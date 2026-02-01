// =================================================================
// 性能优化模块 - Performance Optimizer
// 图片懒加载、缓存策略、代码优化
// =================================================================

const PerformanceOptimizer = (() => {
    // 配置
    const CONFIG = {
        // 图片懒加载阈值
        lazyLoadThreshold: 200,
        
        // 缓存版本
        cacheVersion: 'v1.0.0',
        
        // 缓存资源列表
        cacheResources: [
            'css/main.css',
            'css/theme.css',
            'css/animation.css',
            'js/config.js',
            'js/utils.js',
            'js/data-manager.js'
        ]
    };

    /**
     * 图片懒加载
     */
    function initLazyLoading() {
        // 检查 IntersectionObserver 支持
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 加载图片
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // 加载背景图
                        if (img.dataset.bg) {
                            img.style.backgroundImage = `url(${img.dataset.bg})`;
                            img.removeAttribute('data-bg');
                        }
                        
                        // 停止观察
                        observer.unobserve(img);
                        
                        // 添加加载完成类
                        img.classList.add('lazy-loaded');
                    }
                });
            }, {
                rootMargin: `${CONFIG.lazyLoadThreshold}px`
            });

            // 观察所有懒加载图片
            document.querySelectorAll('img[data-src], [data-bg]').forEach(img => {
                imageObserver.observe(img);
            });
            
            console.log('%c📷 图片懒加载已启用', 'color: #4CAF50;');
        } else {
            // 降级方案：直接加载所有图片
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
            
            document.querySelectorAll('[data-bg]').forEach(el => {
                el.style.backgroundImage = `url(${el.dataset.bg})`;
            });
            
            console.warn('⚠️ IntersectionObserver 不支持，已降级加载所有图片');
        }
    }

    /**
     * 预加载关键资源
     */
    function preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/theme.css', as: 'style' },
            { href: 'js/utils.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
        
        console.log('%c⚡ 关键资源预加载已启用', 'color: #FF9800;');
    }

    /**
     * 预连接到外部域名
     */
    function setupPreconnect() {
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * 防抖函数（高性能版本）
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * 节流函数（高性能版本）
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 优化滚动性能
     */
    function optimizeScrollPerformance() {
        let ticking = false;
        
        const handleScroll = () => {
            // 实际的滚动处理逻辑
            // 例如：更新导航栏、显示返回顶部按钮等
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 代码分割 - 动态导入
     */
    async function loadModule(modulePath) {
        try {
            const module = await import(modulePath);
            return module;
        } catch (error) {
            console.error(`加载模块失败: ${modulePath}`, error);
            return null;
        }
    }

    /**
     * 条件加载 - 按需加载功能
     */
    function conditionalLoad() {
        // 只在管理后台加载导出功能
        if (window.location.pathname.includes('admin.html')) {
            const script = document.createElement('script');
            script.src = 'js/export-utils.js';
            document.head.appendChild(script);
        }

        // 只在表单页面加载验证器
        if (window.location.pathname.includes('form.html')) {
            const script = document.createElement('script');
            script.src = 'js/form-validator.js';
            document.head.appendChild(script);
        }
    }

    /**
     * 缓存管理
     */
    const CacheManager = {
        /**
         * 设置缓存
         */
        set(key, data, ttl = 3600000) {
            const item = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl
            };
            
            try {
                localStorage.setItem(`cache_${key}`, JSON.stringify(item));
                return true;
            } catch (e) {
                console.warn('缓存设置失败:', e);
                return false;
            }
        },

        /**
         * 获取缓存
         */
        get(key) {
            try {
                const item = localStorage.getItem(`cache_${key}`);
                if (!item) return null;

                const cache = JSON.parse(item);
                const now = Date.now();

                // 检查是否过期
                if (now - cache.timestamp > cache.ttl) {
                    this.remove(key);
                    return null;
                }

                return cache.data;
            } catch (e) {
                console.warn('缓存读取失败:', e);
                return null;
            }
        },

        /**
         * 移除缓存
         */
        remove(key) {
            localStorage.removeItem(`cache_${key}`);
        },

        /**
         * 清除所有缓存
         */
        clear() {
            Object.keys(localStorage)
                .filter(key => key.startsWith('cache_'))
                .forEach(key => localStorage.removeItem(key));
            
            console.log('✅ 缓存已清空');
        },

        /**
         * 清除过期缓存
         */
        clearExpired() {
            const now = Date.now();
            let count = 0;

            Object.keys(localStorage)
                .filter(key => key.startsWith('cache_'))
                .forEach(key => {
                    try {
                        const item = JSON.parse(localStorage.getItem(key));
                        if (now - item.timestamp > item.ttl) {
                            localStorage.removeItem(key);
                            count++;
                        }
                    } catch (e) {
                        // 无效的缓存项，直接删除
                        localStorage.removeItem(key);
                        count++;
                    }
                });

            if (count > 0) {
                console.log(`🗑️ 已清除 ${count} 个过期缓存`);
            }
        }
    };

    /**
     * 资源预加载策略
     */
    function setupResourceHints() {
        // DNS 预解析
        const dnsPrefetch = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ];

        dnsPrefetch.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });

        // 预加载下一页
        const nextPageLinks = document.querySelectorAll('a[href*="form.html"], a[href*="admin.html"]');
        nextPageLinks.forEach(link => {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = link.href;
            document.head.appendChild(prefetch);
        });
    }

    /**
     * 性能监控
     */
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // 监控长任务
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ 检测到长任务:', entry.duration.toFixed(2), 'ms');
                    }
                }
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // 某些浏览器不支持 longtask
            }

            // 监控资源加载
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 1000) {
                        console.warn('⚠️ 资源加载缓慢:', entry.name, entry.duration.toFixed(2), 'ms');
                    }
                }
            });

            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                // 降级处理
            }
        }
    }

    /**
     * 初始化所有优化
     */
    function init() {
        // 页面加载完成后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initOptimizations();
            });
        } else {
            initOptimizations();
        }

        // 定期清理过期缓存
        setInterval(() => {
            CacheManager.clearExpired();
        }, 3600000); // 每小时清理一次
    }

    /**
     * 执行优化
     */
    function initOptimizations() {
        // 图片懒加载
        initLazyLoading();

        // 预连接
        setupPreconnect();

        // 资源提示
        setupResourceHints();

        // 滚动优化
        optimizeScrollPerformance();

        // 条件加载
        conditionalLoad();

        // 性能监控
        if (window.location.search.includes('debug=true')) {
            monitorPerformance();
        }

        console.log('%c⚡ 性能优化已启用', 'color: #4CAF50; font-weight: bold;');
    }

    // 返回公共 API
    return {
        init,
        debounce,
        throttle,
        loadModule,
        CacheManager,
        initLazyLoading,
        preloadCriticalResources
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.PerformanceOptimizer = PerformanceOptimizer;
    PerformanceOptimizer.init();
}

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

console.log('%c⚡ Performance Optimizer Loaded', 'color: #FF9800; font-size: 12px;');
