// =================================================================
// 动画辅助函数 - Animation Helpers
// 用于创建和管理页面动画效果
// =================================================================

const AnimationHelpers = (() => {
    /**
     * 创建花瓣飘落效果
     * @param {HTMLElement} container - 花瓣容器元素
     * @param {number} count - 花瓣数量
     */
    function createPetals(container, count = 20) {
        if (!container) {
            console.warn('Petals container not found');
            return;
        }
        
        // 清空现有花瓣
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // 随机位置（左侧位置）
            petal.style.left = Math.random() * 100 + '%';
            
            // 随机大小 (6-14px)
            const size = Math.random() * 8 + 6;
            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            
            // 随机持续时间 (6-12s)
            petal.style.animationDuration = (Math.random() * 6 + 6) + 's';
            
            // 随机延迟 (0-5s)
            petal.style.animationDelay = Math.random() * 5 + 's';
            
            // 随机变体
            if (Math.random() > 0.7) {
                const variant = Math.floor(Math.random() * 2) + 1;
                petal.classList.add('petal-variant-' + variant);
            }
            
            container.appendChild(petal);
        }
    }
    
    /**
     * 初始化花瓣效果
     * @param {string} containerId - 容器ID
     * @param {number} count - 花瓣数量
     */
    function initPetals(containerId = 'petalsContainer', count = 20) {
        // 检查是否禁用动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        // 检查是否是移动设备（可选择禁用）
        // if (window.innerWidth < 768) {
        //     return;
        // }
        
        let container = document.getElementById(containerId);
        
        // 如果容器不存在，创建一个
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'petals-container';
            document.body.appendChild(container);
        }
        
        createPetals(container, count);
    }
    
    /**
     * 为按钮添加涟漪效果
     * @param {HTMLElement|string} element - 元素或选择器
     */
    function addRipple(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!el) {
            console.warn('Ripple element not found');
            return;
        }
        
        // 确保元素有相对定位
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }
        
        // 确保溢出隐藏
        el.style.overflow = 'hidden';
        
        el.addEventListener('click', function(e) {
            // 创建涟漪元素
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            // 计算涟漪大小和位置
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // 动画结束后移除元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    /**
     * 批量添加涟漪效果
     * @param {string} selector - CSS选择器
     */
    function addRippleAll(selector = '.btn-primary, .btn-secondary') {
        document.querySelectorAll(selector).forEach(btn => {
            addRipple(btn);
        });
    }
    
    /**
     * 初始化滚动渐显效果
     * @param {string} selector - CSS选择器
     * @param {Object} options - IntersectionObserver 选项
     */
    function initScrollReveal(selector = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right', options = {}) {
        // 检查是否禁用动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }
        
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerOptions = { ...defaultOptions, ...options };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * 添加元素动画
     * @param {HTMLElement|string} element - 元素或选择器
     * @param {string} animationClass - 动画类名
     * @param {Function} callback - 动画结束回调
     */
    function animate(element, animationClass, callback) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!el) {
            console.warn('Animation element not found');
            return;
        }
        
        el.classList.add(animationClass);
        
        const handleAnimationEnd = () => {
            el.classList.remove(animationClass);
            if (callback) callback();
            el.removeEventListener('animationend', handleAnimationEnd);
        };
        
        el.addEventListener('animationend', handleAnimationEnd);
    }
    
    /**
     * 显示加载器
     * @param {HTMLElement|string} container - 容器元素或选择器
     * @param {string} type - 加载器类型 ('spinner', 'dots', 'wave')
     */
    function showLoader(container, type = 'spinner') {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        
        if (!el) {
            console.warn('Loader container not found');
            return;
        }
        
        let loaderHTML = '';
        
        switch (type) {
            case 'spinner':
                loaderHTML = '<div class="spinner"></div>';
                break;
            case 'dots':
                loaderHTML = '<div class="dots-loader"><span></span><span></span><span></span></div>';
                break;
            case 'wave':
                loaderHTML = '<div class="wave-loader"><span></span><span></span><span></span><span></span><span></span></div>';
                break;
            default:
                loaderHTML = '<div class="spinner"></div>';
        }
        
        el.innerHTML = loaderHTML;
    }
    
    /**
     * 隐藏加载器
     * @param {HTMLElement|string} container - 容器元素或选择器
     */
    function hideLoader(container) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        
        if (!el) {
            console.warn('Loader container not found');
            return;
        }
        
        el.innerHTML = '';
    }
    
    /**
     * 表单步骤切换动画
     * @param {HTMLElement} currentStep - 当前步骤元素
     * @param {HTMLElement} nextStep - 下一步骤元素
     * @param {string} direction - 方向 ('forward' 或 'backward')
     */
    function animateStepTransition(currentStep, nextStep, direction = 'forward') {
        if (!currentStep || !nextStep) {
            console.warn('Step elements not found');
            return;
        }
        
        return new Promise((resolve) => {
            // 当前步骤退出动画
            const exitClass = direction === 'forward' ? 'slide-out-left' : 'slide-out-right';
            currentStep.classList.add(exitClass);
            
            setTimeout(() => {
                currentStep.style.display = 'none';
                currentStep.classList.remove(exitClass);
                
                // 下一步骤入场动画
                nextStep.style.display = 'block';
                const enterClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';
                nextStep.classList.add(enterClass);
                
                setTimeout(() => {
                    nextStep.classList.remove(enterClass);
                    resolve();
                }, 500);
            }, 500);
        });
    }
    
    /**
     * 震动反馈（触觉反馈）
     * @param {number} duration - 震动时长（毫秒）
     */
    function vibrate(duration = 50) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
    
    /**
     * 页面进入动画
     */
    function pageEnterAnimation() {
        document.body.classList.add('page-enter');
        
        setTimeout(() => {
            document.body.classList.remove('page-enter');
        }, 600);
    }
    
    /**
     * 添加悬停倾斜效果
     * @param {HTMLElement|string} element - 元素或选择器
     */
    function addTiltEffect(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!el) return;
        
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
    
    /**
     * 数字滚动动画
     * @param {HTMLElement|string} element - 元素或选择器
     * @param {number} target - 目标数字
     * @param {number} duration - 动画时长（毫秒）
     */
    function animateNumber(element, target, duration = 1000) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!el) return;
        
        const start = parseInt(el.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    /**
     * 进度条动画
     * @param {HTMLElement|string} element - 元素或选择器
     * @param {number} percent - 百分比（0-100）
     * @param {number} duration - 动画时长（毫秒）
     */
    function animateProgress(element, percent, duration = 1000) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!el) return;
        
        el.style.transition = `width ${duration}ms ease-in-out`;
        el.style.width = percent + '%';
    }
    
    // 返回公共API
    return {
        // 花瓣效果
        createPetals,
        initPetals,
        
        // 涟漪效果
        addRipple,
        addRippleAll,
        
        // 滚动渐显
        initScrollReveal,
        
        // 通用动画
        animate,
        
        // 加载器
        showLoader,
        hideLoader,
        
        // 表单步骤
        animateStepTransition,
        
        // 其他效果
        vibrate,
        pageEnterAnimation,
        addTiltEffect,
        animateNumber,
        animateProgress
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.AnimationHelpers = AnimationHelpers;
    
    // DOM 加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // 初始化花瓣效果
            AnimationHelpers.initPetals();
            
            // 初始化滚动渐显
            AnimationHelpers.initScrollReveal();
            
            // 为按钮添加涟漪效果
            AnimationHelpers.addRippleAll();
            
            // 页面进入动画
            AnimationHelpers.pageEnterAnimation();
        });
    } else {
        // 如果DOM已加载，立即初始化
        AnimationHelpers.initPetals();
        AnimationHelpers.initScrollReveal();
        AnimationHelpers.addRippleAll();
        AnimationHelpers.pageEnterAnimation();
    }
}

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationHelpers;
}

console.log('%c🎨 Animation Helpers Loaded', 'color: #E8B4B8; font-size: 12px;');
