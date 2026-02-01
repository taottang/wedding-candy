// =================================================================
// 管理员认证模块 - Admin Authentication
// 管理员登录、会话管理、权限验证
// =================================================================

const AdminAuth = {
    // LocalStorage 键名
    STORAGE_KEYS: {
        SESSION: 'admin_session',
        REMEMBER: 'admin_remember',
        PASSWORD_HASH: 'admin_password_custom' // 自定义密码（如已修改）
    },
    
    // 会话状态
    session: null,
    
    /**
     * 初始化
     */
    init() {
        // 检查是否有有效会话
        this.checkSession();
        
        // 监听页面可见性变化，重新验证会话
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkSession();
            }
        });
        
        console.log('%c🔐 Admin Auth Loaded', 'color: #FF9800; font-size: 12px;');
    },
    
    /**
     * 登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {boolean} remember - 是否记住登录
     * @returns {Object} 登录结果 {success: boolean, message: string}
     */
    login(username, password, remember = false) {
        try {
            // 验证输入
            if (!username || !password) {
                return {
                    success: false,
                    message: '用户名和密码不能为空'
                };
            }
            
            // 验证用户名
            if (username !== CONFIG.ADMIN.USERNAME) {
                return {
                    success: false,
                    message: '用户名或密码错误'
                };
            }
            
            // 验证密码
            if (!this.verifyPassword(password)) {
                // 记录失败尝试
                this.recordFailedAttempt();
                
                return {
                    success: false,
                    message: '用户名或密码错误'
                };
            }
            
            // 检查是否被锁定
            if (this.isLocked()) {
                return {
                    success: false,
                    message: '登录失败次数过多，请10分钟后再试'
                };
            }
            
            // 创建会话
            const session = this.createSession(username, remember);
            
            // 保存会话
            Utils.storage.set(this.STORAGE_KEYS.SESSION, session);
            
            // 保存记住登录状态
            if (remember) {
                Utils.storage.set(this.STORAGE_KEYS.REMEMBER, {
                    username: username,
                    timestamp: new Date().toISOString()
                });
            } else {
                Utils.storage.remove(this.STORAGE_KEYS.REMEMBER);
            }
            
            // 清除失败记录
            this.clearFailedAttempts();
            
            // 更新当前会话
            this.session = session;
            
            return {
                success: true,
                message: '登录成功',
                session: session
            };
            
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: '系统错误，登录失败'
            };
        }
    },
    
    /**
     * 验证密码
     * @param {string} password - 输入的密码
     * @returns {boolean} 是否匹配
     */
    verifyPassword(password) {
        // 优先检查是否有自定义密码
        const customPasswordHash = Utils.storage.get(this.STORAGE_KEYS.PASSWORD_HASH);
        if (customPasswordHash) {
            return this.hashPassword(password) === customPasswordHash;
        }
        
        // 使用默认密码
        return password === CONFIG.ADMIN.PASSWORD;
    },
    
    /**
     * 创建会话
     * @param {string} username - 用户名
     * @param {boolean} remember - 是否记住登录
     * @returns {Object} 会话对象
     */
    createSession(username, remember = false) {
        const now = new Date();
        const timeout = remember 
            ? CONFIG.ADMIN.SESSION_TIMEOUT * 2  // 记住登录时延长会话时间
            : CONFIG.ADMIN.SESSION_TIMEOUT;
        
        const expiresAt = new Date(now.getTime() + timeout);
        
        return {
            username: username,
            token: this.generateToken(),
            loginTime: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            remember: remember,
            lastActivity: now.toISOString()
        };
    },
    
    /**
     * 生成会话令牌
     * @returns {string} 令牌
     */
    generateToken() {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}-${random}`;
    },
    
    /**
     * 检查会话
     * @returns {boolean} 会话是否有效
     */
    checkSession() {
        const session = Utils.storage.get(this.STORAGE_KEYS.SESSION);
        
        if (!session) {
            this.session = null;
            return false;
        }
        
        // 检查是否过期
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now >= expiresAt) {
            // 会话已过期
            this.logout();
            return false;
        }
        
        // 更新最后活动时间
        session.lastActivity = now.toISOString();
        Utils.storage.set(this.STORAGE_KEYS.SESSION, session);
        
        this.session = session;
        return true;
    },
    
    /**
     * 验证是否已登录
     * @returns {boolean} 是否已登录
     */
    isAuthenticated() {
        return this.checkSession();
    },
    
    /**
     * 要求登录（未登录则重定向）
     * @param {string} redirectUrl - 重定向URL（默认为登录页）
     */
    requireAuth(redirectUrl = 'admin.html') {
        if (!this.isAuthenticated()) {
            // 保存当前页面URL，登录后可返回
            Utils.storage.set('admin_redirect_after_login', window.location.href);
            
            // 重定向到登录页
            window.location.href = redirectUrl;
        }
    },
    
    /**
     * 登出
     */
    logout() {
        // 清除会话
        Utils.storage.remove(this.STORAGE_KEYS.SESSION);
        
        // 如果不是记住登录，也清除记住状态
        const remember = Utils.storage.get(this.STORAGE_KEYS.REMEMBER);
        if (!remember) {
            Utils.storage.remove(this.STORAGE_KEYS.REMEMBER);
        }
        
        this.session = null;
        
        console.log('Admin logged out');
    },
    
    /**
     * 完全登出（包括清除记住登录）
     */
    fullLogout() {
        Utils.storage.remove(this.STORAGE_KEYS.SESSION);
        Utils.storage.remove(this.STORAGE_KEYS.REMEMBER);
        this.session = null;
    },
    
    /**
     * 获取当前会话
     * @returns {Object|null} 会话对象
     */
    getSession() {
        if (this.isAuthenticated()) {
            return this.session;
        }
        return null;
    },
    
    /**
     * 获取记住的用户名
     * @returns {string|null} 用户名
     */
    getRememberedUsername() {
        const remember = Utils.storage.get(this.STORAGE_KEYS.REMEMBER);
        return remember ? remember.username : null;
    },
    
    /**
     * 修改密码
     * @param {string} oldPassword - 旧密码
     * @param {string} newPassword - 新密码
     * @returns {Object} 修改结果 {success: boolean, message: string}
     */
    changePassword(oldPassword, newPassword) {
        try {
            // 验证旧密码
            if (!this.verifyPassword(oldPassword)) {
                return {
                    success: false,
                    message: '原密码错误'
                };
            }
            
            // 验证新密码强度
            const validation = this.validatePasswordStrength(newPassword);
            if (!validation.valid) {
                return {
                    success: false,
                    message: validation.message
                };
            }
            
            // 哈希并保存新密码
            const hashedPassword = this.hashPassword(newPassword);
            Utils.storage.set(this.STORAGE_KEYS.PASSWORD_HASH, hashedPassword);
            
            // 记录密码修改时间
            Utils.storage.set('admin_password_changed_at', new Date().toISOString());
            
            return {
                success: true,
                message: '密码修改成功'
            };
            
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: '系统错误，修改失败'
            };
        }
    },
    
    /**
     * 重置密码为默认密码
     * @returns {boolean} 是否成功
     */
    resetPassword() {
        try {
            Utils.storage.remove(this.STORAGE_KEYS.PASSWORD_HASH);
            Utils.storage.remove('admin_password_changed_at');
            return true;
        } catch (error) {
            console.error('Reset password error:', error);
            return false;
        }
    },
    
    /**
     * 验证密码强度
     * @param {string} password - 密码
     * @returns {Object} 验证结果 {valid: boolean, message: string, strength: string}
     */
    validatePasswordStrength(password) {
        if (!password || password.length < 6) {
            return {
                valid: false,
                message: '密码长度至少6位',
                strength: 'weak'
            };
        }
        
        if (password.length < 8) {
            return {
                valid: true,
                message: '密码强度：弱',
                strength: 'weak'
            };
        }
        
        // 检查是否包含数字和字母
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (hasNumber && hasLetter && hasSpecial) {
            return {
                valid: true,
                message: '密码强度：强',
                strength: 'strong'
            };
        } else if ((hasNumber && hasLetter) || (hasNumber && hasSpecial) || (hasLetter && hasSpecial)) {
            return {
                valid: true,
                message: '密码强度：中',
                strength: 'medium'
            };
        } else {
            return {
                valid: true,
                message: '密码强度：弱',
                strength: 'weak'
            };
        }
    },
    
    /**
     * 密码哈希（简单实现，实际项目应使用更安全的方法）
     * @param {string} password - 密码
     * @returns {string} 哈希值
     */
    hashPassword(password) {
        // 简单的哈希实现（实际项目中应使用 bcrypt 或类似库）
        let hash = 0;
        const salt = 'wedding_candy_system_2024';
        const str = password + salt;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash.toString(36);
    },
    
    /**
     * 记录失败尝试
     */
    recordFailedAttempt() {
        const attempts = Utils.storage.get('admin_failed_attempts', []);
        attempts.push({
            timestamp: new Date().toISOString(),
            ip: 'unknown' // 前端无法获取真实IP
        });
        
        // 只保留最近10次尝试
        if (attempts.length > 10) {
            attempts.shift();
        }
        
        Utils.storage.set('admin_failed_attempts', attempts);
    },
    
    /**
     * 清除失败尝试记录
     */
    clearFailedAttempts() {
        Utils.storage.remove('admin_failed_attempts');
    },
    
    /**
     * 检查是否被锁定
     * @returns {boolean} 是否被锁定
     */
    isLocked() {
        const attempts = Utils.storage.get('admin_failed_attempts', []);
        
        if (attempts.length < 5) {
            return false;
        }
        
        // 检查最近10分钟内的失败次数
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
        
        const recentAttempts = attempts.filter(a => {
            return new Date(a.timestamp) > tenMinutesAgo;
        });
        
        return recentAttempts.length >= 5;
    },
    
    /**
     * 获取失败尝试次数
     * @returns {number} 次数
     */
    getFailedAttempts() {
        const attempts = Utils.storage.get('admin_failed_attempts', []);
        return attempts.length;
    },
    
    /**
     * 获取会话剩余时间（秒）
     * @returns {number} 剩余秒数
     */
    getSessionRemainingTime() {
        if (!this.session) {
            return 0;
        }
        
        const now = new Date();
        const expiresAt = new Date(this.session.expiresAt);
        const remaining = Math.floor((expiresAt - now) / 1000);
        
        return remaining > 0 ? remaining : 0;
    },
    
    /**
     * 格式化会话剩余时间
     * @returns {string} 格式化的时间
     */
    getSessionRemainingTimeFormatted() {
        const seconds = this.getSessionRemainingTime();
        
        if (seconds <= 0) {
            return '已过期';
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else {
            return `${minutes}分钟`;
        }
    },
    
    /**
     * 延长会话
     * @param {number} minutes - 延长的分钟数（默认30分钟）
     * @returns {boolean} 是否成功
     */
    extendSession(minutes = 30) {
        if (!this.session) {
            return false;
        }
        
        const expiresAt = new Date(this.session.expiresAt);
        expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
        
        this.session.expiresAt = expiresAt.toISOString();
        Utils.storage.set(this.STORAGE_KEYS.SESSION, this.session);
        
        return true;
    },
    
    /**
     * 显示登录表单
     * @param {HTMLElement} container - 容器元素
     */
    renderLoginForm(container) {
        const rememberedUsername = this.getRememberedUsername();
        
        container.innerHTML = `
            <div class="admin-login-form">
                <div class="login-header">
                    <h2>管理员登录</h2>
                    <p>请输入管理员账号密码</p>
                </div>
                
                <form id="loginForm" onsubmit="return false;">
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value="${rememberedUsername || ''}"
                            placeholder="请输入用户名"
                            required
                            autocomplete="username"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="请输入密码"
                            required
                            autocomplete="current-password"
                        >
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input 
                                type="checkbox" 
                                id="remember" 
                                name="remember"
                                ${rememberedUsername ? 'checked' : ''}
                            >
                            记住登录状态
                        </label>
                    </div>
                    
                    <div class="error-message" id="errorMessage"></div>
                    
                    <button type="submit" class="btn-login" id="loginBtn">
                        登录
                    </button>
                    
                    <div class="login-tips">
                        <p>忘记密码？请联系技术支持</p>
                        <p class="tip-text">默认用户名：admin</p>
                    </div>
                </form>
            </div>
        `;
        
        // 绑定事件
        this.bindLoginFormEvents();
    },
    
    /**
     * 绑定登录表单事件
     */
    bindLoginFormEvents() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // 清除之前的错误消息
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            
            // 禁用按钮
            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';
            
            // 执行登录
            setTimeout(() => {
                const result = this.login(username, password, remember);
                
                if (result.success) {
                    // 登录成功
                    errorMessage.style.display = 'block';
                    errorMessage.style.color = '#4CAF50';
                    errorMessage.textContent = '登录成功！';
                    
                    // 跳转到管理页面
                    setTimeout(() => {
                        const redirectUrl = Utils.storage.get('admin_redirect_after_login');
                        if (redirectUrl && !redirectUrl.includes('admin.html')) {
                            window.location.href = redirectUrl;
                            Utils.storage.remove('admin_redirect_after_login');
                        } else {
                            window.location.reload();
                        }
                    }, 500);
                } else {
                    // 登录失败
                    errorMessage.style.display = 'block';
                    errorMessage.style.color = '#f44336';
                    errorMessage.textContent = result.message;
                    
                    loginBtn.disabled = false;
                    loginBtn.textContent = '登录';
                    
                    // 清空密码
                    document.getElementById('password').value = '';
                }
            }, 500); // 模拟网络延迟
        });
        
        // Enter 键提交
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    form.dispatchEvent(new Event('submit'));
                }
            });
        });
    }
};

// 自动初始化
if (typeof window !== 'undefined') {
    window.AdminAuth = AdminAuth;
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AdminAuth.init());
    } else {
        AdminAuth.init();
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
}
