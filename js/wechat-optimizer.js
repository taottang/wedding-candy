/**
 * 微信环境优化模块
 * 专门处理微信浏览器的特殊限制和优化用户体验
 */

const WeChatOptimizer = {
    /**
     * 检测是否在微信浏览器中
     */
    isWeChat() {
        const ua = navigator.userAgent.toLowerCase();
        return /micromessenger/.test(ua);
    },
    
    /**
     * 检测是否在微信小程序的webview中
     */
    isWeChatMiniProgram() {
        const ua = navigator.userAgent.toLowerCase();
        return /miniprogram/.test(ua);
    },
    
    /**
     * 获取微信版本号
     */
    getWeChatVersion() {
        const ua = navigator.userAgent.toLowerCase();
        const match = ua.match(/micromessenger\/([\d.]+)/);
        return match ? match[1] : '';
    },
    
    /**
     * 检测操作系统
     */
    getOS() {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) {
            return 'android';
        } else if (/iphone|ipad|ipod/i.test(ua)) {
            return 'ios';
        }
        return 'unknown';
    },
    
    /**
     * 初始化微信优化
     */
    init() {
        if (!this.isWeChat()) {
            console.log('💡 当前不在微信环境中');
            return false;
        }
        
        console.log('📱 检测到微信环境');
        console.log('📱 微信版本:', this.getWeChatVersion());
        console.log('📱 操作系统:', this.getOS());
        
        // 显示微信环境提示
        this.showWeChatTips();
        
        // 优化图片保存体验
        this.optimizeImageSaving();
        
        // 添加分享引导
        this.addShareGuide();
        
        // 处理特殊的微信限制
        this.handleWeChatLimitations();
        
        return true;
    },
    
    /**
     * 显示微信环境提示
     */
    showWeChatTips() {
        // 检查是否已经显示过（24小时内）
        const lastShown = localStorage.getItem('wechat_tips_shown');
        const now = Date.now();
        
        if (lastShown && (now - parseInt(lastShown)) < 24 * 60 * 60 * 1000) {
            // 24小时内已显示过，不再显示
            return;
        }
        
        // 创建提示横幅
        const banner = document.createElement('div');
        banner.id = 'wechat-tips-banner';
        banner.className = 'wechat-tips-banner';
        banner.innerHTML = `
            <div class="wechat-tips-content">
                <div class="wechat-tips-icon">📱</div>
                <div class="wechat-tips-text">
                    <div class="wechat-tips-title">您正在微信中浏览</div>
                    <div class="wechat-tips-desc">
                        保存海报时可能需要长按图片选择"保存图片"
                    </div>
                </div>
                <button class="wechat-tips-close" onclick="WeChatOptimizer.closeTips()">×</button>
            </div>
        `;
        
        // 添加到页面顶部
        document.body.insertBefore(banner, document.body.firstChild);
        
        // 3秒后自动淡出（但不关闭）
        setTimeout(() => {
            if (banner && banner.parentNode) {
                banner.style.opacity = '0.7';
            }
        }, 3000);
        
        // 记录显示时间
        localStorage.setItem('wechat_tips_shown', now.toString());
    },
    
    /**
     * 关闭提示横幅
     */
    closeTips() {
        const banner = document.getElementById('wechat-tips-banner');
        if (banner) {
            banner.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 300);
        }
    },
    
    /**
     * 优化图片保存体验
     */
    optimizeImageSaving() {
        // 监听海报生成完成事件
        document.addEventListener('posterGenerated', (e) => {
            this.showImageSaveTips();
        });
    },
    
    /**
     * 显示图片保存提示
     */
    showImageSaveTips() {
        const os = this.getOS();
        let tips = '';
        
        if (os === 'ios') {
            tips = `
                <div class="wechat-save-tips">
                    <div class="wechat-save-tips-title">💾 iOS 保存图片方法</div>
                    <ol class="wechat-save-tips-list">
                        <li>长按下方图片</li>
                        <li>在弹出菜单中选择"保存图片"</li>
                        <li>或点击"保存到相册"按钮后长按保存</li>
                    </ol>
                    <div class="wechat-save-tips-note">
                        💡 提示：如果无法保存，请在右上角"···"菜单中选择"在浏览器中打开"
                    </div>
                </div>
            `;
        } else if (os === 'android') {
            tips = `
                <div class="wechat-save-tips">
                    <div class="wechat-save-tips-title">💾 Android 保存图片方法</div>
                    <ol class="wechat-save-tips-list">
                        <li>点击"保存到相册"按钮</li>
                        <li>图片会自动下载到相册</li>
                        <li>如失败，请长按图片选择"保存图片"</li>
                    </ol>
                    <div class="wechat-save-tips-note">
                        💡 提示：部分安卓机型可能需要授予存储权限
                    </div>
                </div>
            `;
        }
        
        // 将提示添加到海报预览窗口
        const modalContent = document.querySelector('.poster-modal-content');
        if (modalContent && tips) {
            // 移除旧的提示（如果存在）
            const oldTips = modalContent.querySelector('.wechat-save-tips');
            if (oldTips) {
                oldTips.remove();
            }
            
            // 添加新提示
            const posterActions = modalContent.querySelector('.poster-actions');
            if (posterActions) {
                posterActions.insertAdjacentHTML('afterend', tips);
            }
        }
    },
    
    /**
     * 添加分享引导
     */
    addShareGuide() {
        // 创建微信分享引导面板
        const guideHTML = `
            <div class="wechat-share-guide">
                <div class="wechat-share-guide-title">
                    <span class="wechat-icon">💬</span>
                    <span>微信分享指南</span>
                </div>
                
                <div class="wechat-share-methods">
                    <div class="wechat-share-method">
                        <div class="method-icon">👥</div>
                        <div class="method-content">
                            <div class="method-title">分享到微信群/好友</div>
                            <div class="method-steps">
                                1. 点击"复制链接"按钮<br>
                                2. 在微信中粘贴发送
                            </div>
                        </div>
                    </div>
                    
                    <div class="wechat-share-method">
                        <div class="method-icon">📱</div>
                        <div class="method-content">
                            <div class="method-title">分享到朋友圈</div>
                            <div class="method-steps">
                                1. 生成并保存海报<br>
                                2. 打开朋友圈选择图片<br>
                                3. 添加文字说明后发送
                            </div>
                        </div>
                    </div>
                    
                    <div class="wechat-share-method highlight">
                        <div class="method-icon">⚠️</div>
                        <div class="method-content">
                            <div class="method-title">重要提示</div>
                            <div class="method-steps">
                                微信限制了网页直接分享功能<br>
                                请使用上述方式进行分享
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wechat-open-browser">
                    <button class="open-browser-btn" onclick="WeChatOptimizer.showOpenInBrowserGuide()">
                        🌐 如何在浏览器中打开
                    </button>
                </div>
            </div>
        `;
        
        // 找到分享区域，添加微信指南
        const shareSection = document.querySelector('.share-section');
        if (shareSection) {
            // 检查是否已存在
            if (!document.querySelector('.wechat-share-guide')) {
                shareSection.insertAdjacentHTML('beforeend', guideHTML);
            }
        }
    },
    
    /**
     * 显示"在浏览器中打开"指南
     */
    showOpenInBrowserGuide() {
        const os = this.getOS();
        let guide = '';
        
        if (os === 'ios') {
            guide = `
                <div class="browser-guide-content">
                    <h3>📱 iOS 在浏览器中打开</h3>
                    <div class="browser-guide-steps">
                        <div class="guide-step">
                            <div class="step-number">1</div>
                            <div class="step-text">点击右上角的 <strong>···</strong> (三个点)</div>
                        </div>
                        <div class="guide-step">
                            <div class="step-number">2</div>
                            <div class="step-text">在弹出菜单中找到 <strong>"在Safari中打开"</strong> 或 <strong>"在浏览器中打开"</strong></div>
                        </div>
                        <div class="guide-step">
                            <div class="step-number">3</div>
                            <div class="step-text">页面会在 Safari 浏览器中打开</div>
                        </div>
                    </div>
                    <div class="browser-guide-benefits">
                        <strong>✨ 在浏览器中的优势：</strong><br>
                        • 图片保存更方便<br>
                        • 功能更完整<br>
                        • 无微信限制
                    </div>
                </div>
            `;
        } else if (os === 'android') {
            guide = `
                <div class="browser-guide-content">
                    <h3>📱 Android 在浏览器中打开</h3>
                    <div class="browser-guide-steps">
                        <div class="guide-step">
                            <div class="step-number">1</div>
                            <div class="step-text">点击右上角的 <strong>···</strong> (三个点)</div>
                        </div>
                        <div class="guide-step">
                            <div class="step-number">2</div>
                            <div class="step-text">在弹出菜单中找到 <strong>"在浏览器中打开"</strong> 或 <strong>"用浏览器打开"</strong></div>
                        </div>
                        <div class="guide-step">
                            <div class="step-number">3</div>
                            <div class="step-text">选择您的浏览器（Chrome、默认浏览器等）</div>
                        </div>
                    </div>
                    <div class="browser-guide-benefits">
                        <strong>✨ 在浏览器中的优势：</strong><br>
                        • 图片保存更方便<br>
                        • 功能更完整<br>
                        • 无微信限制
                    </div>
                </div>
            `;
        }
        
        // 创建 Modal
        this.showModal('在浏览器中打开指南', guide);
    },
    
    /**
     * 显示 Modal
     */
    showModal(title, content) {
        // 移除已存在的 Modal
        const existingModal = document.getElementById('wechat-guide-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'wechat-guide-modal';
        modal.className = 'wechat-guide-modal';
        modal.innerHTML = `
            <div class="wechat-guide-modal-backdrop" onclick="WeChatOptimizer.closeModal()"></div>
            <div class="wechat-guide-modal-content">
                <div class="wechat-guide-modal-header">
                    <h2>${title}</h2>
                    <button class="wechat-guide-modal-close" onclick="WeChatOptimizer.closeModal()">×</button>
                </div>
                <div class="wechat-guide-modal-body">
                    ${content}
                </div>
                <div class="wechat-guide-modal-footer">
                    <button class="wechat-guide-modal-btn" onclick="WeChatOptimizer.closeModal()">知道了</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
        
        // 添加动画
        setTimeout(() => {
            modal.style.opacity = '1';
            const modalContent = modal.querySelector('.wechat-guide-modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);
    },
    
    /**
     * 关闭 Modal
     */
    closeModal() {
        const modal = document.getElementById('wechat-guide-modal');
        if (modal) {
            modal.style.opacity = '0';
            const modalContent = modal.querySelector('.wechat-guide-modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(20px)';
            }
            
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.body.style.overflow = 'auto';
            }, 300);
        }
    },
    
    /**
     * 处理微信特殊限制
     */
    handleWeChatLimitations() {
        // 禁用微信的默认分享功能提示
        this.disableWeChatDefaultShare();
        
        // 优化复制功能
        this.optimizeCopyFunction();
        
        // 处理图片下载
        this.handleImageDownload();
    },
    
    /**
     * 禁用微信默认分享
     */
    disableWeChatDefaultShare() {
        // 微信会拦截部分分享API，这里提供友好提示
        if (typeof navigator.share !== 'undefined') {
            // 检测到 Web Share API 可用
            console.log('📱 Web Share API 可用');
        } else {
            console.log('📱 Web Share API 不可用（微信限制）');
        }
    },
    
    /**
     * 优化复制功能
     */
    optimizeCopyFunction() {
        // 微信中 Clipboard API 可能受限
        // 提供降级方案
        const originalCopy = window.copyShareLink;
        if (originalCopy) {
            window.copyShareLink = function() {
                try {
                    originalCopy();
                } catch (error) {
                    // 降级：显示链接让用户手动复制
                    const input = document.getElementById('shareUrl');
                    if (input) {
                        input.select();
                        input.setSelectionRange(0, 99999);
                        alert('请长按链接手动复制');
                    }
                }
            };
        }
    },
    
    /**
     * 处理图片下载
     */
    handleImageDownload() {
        // 微信中图片下载可能受限
        // 提供长按保存的提示
        const originalDownload = window.downloadPoster;
        if (originalDownload) {
            window.downloadPoster = function() {
                // 先尝试原始下载方法
                originalDownload();
                
                // 额外显示长按提示
                setTimeout(() => {
                    const os = WeChatOptimizer.getOS();
                    if (os === 'ios') {
                        alert('💡 提示：\n\nIOS 用户请长按图片，选择"保存图片"。\n\n如无法保存，请在右上角菜单选择"在Safari中打开"。');
                    }
                }, 500);
            };
        }
    },
    
    /**
     * 获取环境信息（用于调试）
     */
    getEnvironmentInfo() {
        return {
            isWeChat: this.isWeChat(),
            isMiniProgram: this.isWeChatMiniProgram(),
            wechatVersion: this.getWeChatVersion(),
            os: this.getOS(),
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }
};

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', function() {
    WeChatOptimizer.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeChatOptimizer;
}

console.log('%c💬 微信优化模块已加载', 'color: #07C160; font-size: 14px; font-weight: bold;');
