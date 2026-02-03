/**
 * 海报生成优化模块
 * 包含CDN管理、缓存机制、性能优化
 */

const PosterOptimizer = {
    // CDN配置
    cdnConfig: {
        html2canvas: {
            primary: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
            fallbacks: [
                'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
            ]
        },
        qrcode: {
            primary: 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js',
            fallbacks: [
                'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js'
            ]
        }
    },
    
    // 缓存配置
    cacheConfig: {
        posterCacheKey: 'wedding_poster_cache',
        qrcodeCacheKey: 'wedding_qrcode_cache',
        maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7天
        maxCacheSize: 5 * 1024 * 1024 // 5MB
    },
    
    // 性能监控
    performance: {
        startTime: null,
        loadTimes: {},
        errors: []
    },
    
    /**
     * 初始化
     */
    init() {
        console.log('🎨 海报优化模块初始化...');
        
        // 检查依赖
        this.checkDependencies();
        
        // 清理过期缓存
        this.cleanExpiredCache();
        
        // 预加载资源
        this.preloadResources();
        
        console.log('✅ 海报优化模块初始化完成');
    },
    
    /**
     * 检查依赖库是否加载
     */
    checkDependencies() {
        const deps = {
            html2canvas: typeof html2canvas !== 'undefined',
            QRCode: typeof QRCode !== 'undefined'
        };
        
        console.log('📦 依赖检查:', deps);
        
        // 如果依赖未加载，尝试重新加载
        if (!deps.html2canvas) {
            console.warn('⚠️ html2canvas 未加载，尝试重新加载...');
            this.loadScript('html2canvas');
        }
        
        if (!deps.QRCode) {
            console.warn('⚠️ QRCode 未加载，尝试重新加载...');
            this.loadScript('qrcode');
        }
        
        return deps;
    },
    
    /**
     * 动态加载脚本（带降级）
     */
    async loadScript(libName) {
        const config = this.cdnConfig[libName];
        if (!config) {
            console.error('❌ 未知的库:', libName);
            return false;
        }
        
        // 尝试主CDN
        try {
            await this._loadScriptFromUrl(config.primary);
            console.log(`✅ ${libName} 从主CDN加载成功`);
            return true;
        } catch (error) {
            console.warn(`⚠️ ${libName} 主CDN加载失败，尝试备用CDN...`);
        }
        
        // 尝试备用CDN
        for (let i = 0; i < config.fallbacks.length; i++) {
            try {
                await this._loadScriptFromUrl(config.fallbacks[i]);
                console.log(`✅ ${libName} 从备用CDN ${i + 1} 加载成功`);
                return true;
            } catch (error) {
                console.warn(`⚠️ ${libName} 备用CDN ${i + 1} 加载失败`);
            }
        }
        
        console.error(`❌ ${libName} 所有CDN都加载失败`);
        this.performance.errors.push({
            type: 'cdn_load_failed',
            library: libName,
            time: new Date().toISOString()
        });
        return false;
    },
    
    /**
     * 从URL加载脚本
     */
    _loadScriptFromUrl(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            document.head.appendChild(script);
            
            // 30秒超时
            setTimeout(() => reject(new Error('Script load timeout')), 30000);
        });
    },
    
    /**
     * 预加载资源
     */
    preloadResources() {
        // 预加载海报模板中的字体
        if (document.fonts && document.fonts.load) {
            document.fonts.load('16px "PingFang SC"').then(() => {
                console.log('✅ 字体预加载完成');
            }).catch(err => {
                console.warn('⚠️ 字体预加载失败:', err);
            });
        }
    },
    
    /**
     * 缓存海报
     */
    cachePoster(posterDataUrl) {
        try {
            // 检查数据大小
            const size = this._getDataUrlSize(posterDataUrl);
            if (size > this.cacheConfig.maxCacheSize) {
                console.warn('⚠️ 海报数据过大，不缓存');
                return false;
            }
            
            const cacheData = {
                data: posterDataUrl,
                timestamp: Date.now(),
                size: size
            };
            
            localStorage.setItem(
                this.cacheConfig.posterCacheKey,
                JSON.stringify(cacheData)
            );
            
            console.log(`✅ 海报已缓存 (${this._formatSize(size)})`);
            return true;
        } catch (error) {
            console.error('❌ 缓存海报失败:', error);
            // 可能是 localStorage 满了
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ 存储空间不足，清理旧缓存...');
                this.clearPosterCache();
            }
            return false;
        }
    },
    
    /**
     * 获取缓存的海报
     */
    getCachedPoster() {
        try {
            const cached = localStorage.getItem(this.cacheConfig.posterCacheKey);
            if (!cached) {
                return null;
            }
            
            const cacheData = JSON.parse(cached);
            
            // 检查是否过期
            const age = Date.now() - cacheData.timestamp;
            if (age > this.cacheConfig.maxCacheAge) {
                console.log('⏰ 缓存已过期，清除');
                this.clearPosterCache();
                return null;
            }
            
            console.log(`✅ 使用缓存的海报 (${this._formatSize(cacheData.size)})`);
            return cacheData.data;
        } catch (error) {
            console.error('❌ 读取缓存失败:', error);
            return null;
        }
    },
    
    /**
     * 清除海报缓存
     */
    clearPosterCache() {
        try {
            localStorage.removeItem(this.cacheConfig.posterCacheKey);
            console.log('🗑️ 海报缓存已清除');
        } catch (error) {
            console.error('❌ 清除缓存失败:', error);
        }
    },
    
    /**
     * 缓存二维码
     */
    cacheQRCode(url, qrDataUrl) {
        try {
            const cacheKey = this._getQRCodeCacheKey(url);
            const cacheData = {
                data: qrDataUrl,
                timestamp: Date.now(),
                url: url
            };
            
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log('✅ 二维码已缓存');
            return true;
        } catch (error) {
            console.error('❌ 缓存二维码失败:', error);
            return false;
        }
    },
    
    /**
     * 获取缓存的二维码
     */
    getCachedQRCode(url) {
        try {
            const cacheKey = this._getQRCodeCacheKey(url);
            const cached = localStorage.getItem(cacheKey);
            if (!cached) {
                return null;
            }
            
            const cacheData = JSON.parse(cached);
            
            // 检查是否过期
            const age = Date.now() - cacheData.timestamp;
            if (age > this.cacheConfig.maxCacheAge) {
                localStorage.removeItem(cacheKey);
                return null;
            }
            
            console.log('✅ 使用缓存的二维码');
            return cacheData.data;
        } catch (error) {
            console.error('❌ 读取二维码缓存失败:', error);
            return null;
        }
    },
    
    /**
     * 获取二维码缓存键
     */
    _getQRCodeCacheKey(url) {
        return `${this.cacheConfig.qrcodeCacheKey}_${this._hashString(url)}`;
    },
    
    /**
     * 清理过期缓存
     */
    cleanExpiredCache() {
        try {
            const keys = Object.keys(localStorage);
            let cleaned = 0;
            
            keys.forEach(key => {
                if (key.startsWith('wedding_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.timestamp) {
                            const age = Date.now() - data.timestamp;
                            if (age > this.cacheConfig.maxCacheAge) {
                                localStorage.removeItem(key);
                                cleaned++;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            });
            
            if (cleaned > 0) {
                console.log(`🗑️ 清理了 ${cleaned} 个过期缓存`);
            }
        } catch (error) {
            console.error('❌ 清理缓存失败:', error);
        }
    },
    
    /**
     * 获取缓存统计
     */
    getCacheStats() {
        let totalSize = 0;
        let cacheCount = 0;
        
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('wedding_')) {
                try {
                    const value = localStorage.getItem(key);
                    totalSize += value.length * 2; // UTF-16
                    cacheCount++;
                } catch (e) {
                    // 忽略
                }
            }
        });
        
        return {
            count: cacheCount,
            size: totalSize,
            formattedSize: this._formatSize(totalSize)
        };
    },
    
    /**
     * 性能监控 - 开始
     */
    startPerformanceMonitor(operation) {
        this.performance.startTime = performance.now();
        console.log(`⏱️ 开始: ${operation}`);
    },
    
    /**
     * 性能监控 - 结束
     */
    endPerformanceMonitor(operation) {
        if (!this.performance.startTime) return;
        
        const duration = performance.now() - this.performance.startTime;
        this.performance.loadTimes[operation] = duration;
        
        console.log(`✅ 完成: ${operation} (${duration.toFixed(2)}ms)`);
        this.performance.startTime = null;
        
        return duration;
    },
    
    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            loadTimes: this.performance.loadTimes,
            errors: this.performance.errors,
            cacheStats: this.getCacheStats()
        };
    },
    
    /**
     * 检测浏览器兼容性
     */
    checkCompatibility() {
        const features = {
            canvas: !!document.createElement('canvas').getContext,
            localStorage: this._checkLocalStorage(),
            blob: typeof Blob !== 'undefined',
            promises: typeof Promise !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            serviceWorker: 'serviceWorker' in navigator
        };
        
        console.log('🔍 浏览器兼容性:', features);
        
        const compatible = features.canvas && 
                          features.localStorage && 
                          features.blob && 
                          features.promises;
        
        return {
            compatible,
            features,
            warnings: this._getCompatibilityWarnings(features)
        };
    },
    
    /**
     * 检查 LocalStorage 是否可用
     */
    _checkLocalStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    /**
     * 获取兼容性警告
     */
    _getCompatibilityWarnings(features) {
        const warnings = [];
        
        if (!features.canvas) {
            warnings.push('Canvas 不支持，无法生成海报');
        }
        if (!features.localStorage) {
            warnings.push('LocalStorage 不可用，无法缓存');
        }
        if (!features.blob) {
            warnings.push('Blob 不支持，图片下载可能有问题');
        }
        if (!features.promises) {
            warnings.push('Promise 不支持，可能影响功能');
        }
        
        return warnings;
    },
    
    /**
     * 获取 Data URL 大小
     */
    _getDataUrlSize(dataUrl) {
        // Base64 编码，每个字符约 1 字节
        return dataUrl.length;
    },
    
    /**
     * 格式化文件大小
     */
    _formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },
    
    /**
     * 简单的字符串哈希
     */
    _hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    },
    
    /**
     * 清除所有缓存
     */
    clearAllCache() {
        const keys = Object.keys(localStorage);
        let cleared = 0;
        
        keys.forEach(key => {
            if (key.startsWith('wedding_')) {
                localStorage.removeItem(key);
                cleared++;
            }
        });
        
        console.log(`🗑️ 清除了 ${cleared} 个缓存项`);
        return cleared;
    }
};

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', function() {
    PosterOptimizer.init();
    
    // 显示兼容性信息（开发模式）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const compat = PosterOptimizer.checkCompatibility();
        if (!compat.compatible) {
            console.warn('⚠️ 浏览器兼容性警告:', compat.warnings);
        }
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PosterOptimizer;
}

console.log('%c🎨 海报优化模块已加载', 'color: #FF6B6B; font-size: 14px; font-weight: bold;');
