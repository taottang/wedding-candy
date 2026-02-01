// =================================================================
// 工具函数库 - Utils.js
// 提供常用的工具函数和辅助方法
// =================================================================

const Utils = {
    // ==================== 日期时间工具 ====================
    
    /**
     * 格式化日期
     * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
     * @param {string} format - 格式化模板 (YYYY-MM-DD HH:mm:ss)
     * @returns {string} 格式化后的日期字符串
     * 
     * @example
     * Utils.formatDate(new Date(), 'YYYY-MM-DD') // '2026-02-01'
     * Utils.formatDate(Date.now(), 'HH:mm:ss')   // '14:30:45'
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        
        // 检查日期是否有效
        if (isNaN(d.getTime())) {
            console.warn('Invalid date:', date);
            return '-';
        }
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    /**
     * 判断是否为今天
     * @param {Date|string|number} date - 日期
     * @returns {boolean} 是否为今天
     */
    isToday(date) {
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    },
    
    /**
     * 获取两个日期之间的天数差
     * @param {Date} startDate - 开始日期
     * @param {Date} endDate - 结束日期
     * @returns {number} 相差天数
     */
    getDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.abs(end - start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    
    /**
     * 获取相对时间描述
     * @param {Date|string|number} date - 日期
     * @returns {string} 相对时间描述（刚刚、1分钟前等）
     */
    getRelativeTime(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = Math.floor((now - target) / 1000); // 秒
        
        if (diff < 60) return '刚刚';
        if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
        return this.formatDate(date, 'YYYY-MM-DD');
    },
    
    // ==================== 字符串处理工具 ====================
    
    /**
     * 格式化手机号（隐藏中间4位）
     * @param {string} phone - 手机号
     * @returns {string} 格式化后的手机号
     * 
     * @example
     * Utils.formatPhone('13800138000') // '138****8000'
     */
    formatPhone(phone) {
        if (!phone || phone.length !== 11) {
            return phone;
        }
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
    },
    
    /**
     * 转义HTML字符（防止XSS攻击）
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },
    
    /**
     * 字符串截断
     * @param {string} str - 要截断的字符串
     * @param {number} length - 最大长度
     * @param {string} suffix - 后缀（默认为...）
     * @returns {string} 截断后的字符串
     * 
     * @example
     * Utils.truncate('这是一段很长的文字', 5) // '这是一段很...'
     */
    truncate(str, length = 50, suffix = '...') {
        if (!str || str.length <= length) {
            return str;
        }
        return str.substring(0, length) + suffix;
    },
    
    /**
     * 移除字符串两端空格并压缩中间多余空格
     * @param {string} str - 字符串
     * @returns {string} 处理后的字符串
     */
    normalizeWhitespace(str) {
        return str.trim().replace(/\s+/g, ' ');
    },
    
    // ==================== 数据处理工具 ====================
    
    /**
     * 生成唯一ID
     * @param {string} prefix - ID前缀（可选）
     * @returns {string} 唯一ID
     * 
     * @example
     * Utils.generateId() // 'kx9f2jd8a'
     * Utils.generateId('user') // 'user_kx9f2jd8a'
     */
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 9);
        const id = timestamp + randomStr;
        return prefix ? `${prefix}_${id}` : id;
    },
    
    /**
     * 深拷贝对象
     * @param {*} obj - 要拷贝的对象
     * @returns {*} 拷贝后的对象
     * 
     * @example
     * const original = { a: 1, b: { c: 2 } };
     * const copy = Utils.deepClone(original);
     * copy.b.c = 3; // original.b.c 仍然是 2
     */
    deepClone(obj) {
        // 处理 null 和非对象类型
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        // 处理日期对象
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        // 处理数组
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        // 处理普通对象
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }
        return clonedObj;
    },
    
    /**
     * 对象合并（类似 Object.assign，但支持深度合并）
     * @param {Object} target - 目标对象
     * @param {...Object} sources - 源对象
     * @returns {Object} 合并后的对象
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.deepMerge(target, ...sources);
    },
    
    /**
     * 判断是否为对象
     * @param {*} item - 要判断的项
     * @returns {boolean} 是否为对象
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    
    // ==================== 防抖和节流 ====================
    
    /**
     * 防抖函数 - 在事件停止触发n毫秒后才执行
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @param {boolean} immediate - 是否立即执行
     * @returns {Function} 防抖后的函数
     * 
     * @example
     * const debouncedSearch = Utils.debounce(searchFunction, 300);
     * input.addEventListener('input', debouncedSearch);
     */
    debounce(func, wait = 300, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    /**
     * 节流函数 - 在指定时间内最多执行一次
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 限制时间（毫秒）
     * @returns {Function} 节流后的函数
     * 
     * @example
     * const throttledScroll = Utils.throttle(scrollFunction, 100);
     * window.addEventListener('scroll', throttledScroll);
     */
    throttle(func, limit = 300) {
        let inThrottle;
        let lastResult;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                lastResult = func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
            return lastResult;
        };
    },
    
    // ==================== LocalStorage 操作封装 ====================
    
    storage: {
        /**
         * 设置存储项
         * @param {string} key - 键名
         * @param {*} value - 值（会自动JSON序列化）
         * @returns {boolean} 是否设置成功
         */
        set(key, value) {
            try {
                const serializedValue = JSON.stringify(value);
                localStorage.setItem(key, serializedValue);
                return true;
            } catch (error) {
                console.error('Storage set error:', error);
                // 可能是超出存储限制
                if (error.name === 'QuotaExceededError') {
                    console.error('Storage quota exceeded');
                }
                return false;
            }
        },
        
        /**
         * 获取存储项
         * @param {string} key - 键名
         * @param {*} defaultValue - 默认值
         * @returns {*} 存储的值或默认值
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Storage get error:', error);
                return defaultValue;
            }
        },
        
        /**
         * 删除存储项
         * @param {string} key - 键名
         * @returns {boolean} 是否删除成功
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage remove error:', error);
                return false;
            }
        },
        
        /**
         * 清空所有存储项
         * @returns {boolean} 是否清空成功
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear error:', error);
                return false;
            }
        },
        
        /**
         * 检查键是否存在
         * @param {string} key - 键名
         * @returns {boolean} 是否存在
         */
        has(key) {
            return localStorage.getItem(key) !== null;
        },
        
        /**
         * 获取存储大小（近似值，单位：字节）
         * @returns {number} 存储大小
         */
        getSize() {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        },
    },
    
    // ==================== UI 交互工具 ====================
    
    /**
     * Toast 提示消息
     * @param {string} message - 提示消息
     * @param {string} type - 类型 (success|error|warning|info)
     * @param {number} duration - 显示时长（毫秒）
     */
    toast(message, type = 'info', duration = 3000) {
        // 移除已存在的toast
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${this.escapeHtml(message)}</span>
        `;
        
        // 添加样式（如果还未添加）
        if (!document.querySelector('#toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                .custom-toast {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    animation: toastSlideIn 0.3s ease;
                    min-width: 250px;
                    max-width: 500px;
                }
                @keyframes toastSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                .custom-toast.toast-success { border-left: 4px solid #4CAF50; }
                .custom-toast.toast-error { border-left: 4px solid #f44336; }
                .custom-toast.toast-warning { border-left: 4px solid #ff9800; }
                .custom-toast.toast-info { border-left: 4px solid #2196F3; }
                .toast-icon {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                .toast-success .toast-icon { color: #4CAF50; }
                .toast-error .toast-icon { color: #f44336; }
                .toast-warning .toast-icon { color: #ff9800; }
                .toast-info .toast-icon { color: #2196F3; }
                .toast-message {
                    color: #333;
                    font-size: 0.95rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    /**
     * 确认对话框
     * @param {string} message - 确认消息
     * @returns {boolean} 用户确认结果
     */
    confirm(message) {
        return window.confirm(message);
    },
    
    /**
     * 提示对话框
     * @param {string} message - 提示消息
     */
    alert(message) {
        window.alert(message);
    },
    
    // ==================== 数值处理工具 ====================
    
    /**
     * 格式化数字（千分位分隔）
     * @param {number} num - 数字
     * @returns {string} 格式化后的数字
     * 
     * @example
     * Utils.formatNumber(1234567) // '1,234,567'
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * 生成随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机数
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // ==================== 数组处理工具 ====================
    
    /**
     * 数组去重
     * @param {Array} arr - 数组
     * @returns {Array} 去重后的数组
     */
    unique(arr) {
        return [...new Set(arr)];
    },
    
    /**
     * 数组分组
     * @param {Array} arr - 数组
     * @param {Function} fn - 分组函数
     * @returns {Object} 分组后的对象
     */
    groupBy(arr, fn) {
        return arr.reduce((result, item) => {
            const key = fn(item);
            (result[key] = result[key] || []).push(item);
            return result;
        }, {});
    },
    
    // ==================== 浏览器检测工具 ====================
    
    /**
     * 检测是否为移动设备
     * @returns {boolean} 是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * 检测浏览器类型
     * @returns {string} 浏览器类型
     */
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) return 'IE';
        return 'Unknown';
    },
};

// 导出工具对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

// 在控制台显示工具库信息（开发调试用）
console.log('%c🛠️ Utils Library Loaded', 'color: #2196F3; font-size: 12px;');
