/**
 * 分享统计追踪器
 * 用于记录和显示分享数据
 */

const ShareTracker = {
    // LocalStorage 键名
    STORAGE_KEY: 'wedding_candy_share_stats',
    
    /**
     * 初始化统计数据
     */
    init() {
        const stats = this.getStats();
        if (!stats) {
            const initialStats = {
                totalShares: 0,
                linkShares: 0,
                posterShares: 0,
                lastShareTime: null,
                shareHistory: []
            };
            this.saveStats(initialStats);
        }
        console.log('📊 分享统计已初始化');
    },
    
    /**
     * 获取统计数据
     */
    getStats() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('读取统计数据失败:', error);
            return null;
        }
    },
    
    /**
     * 保存统计数据
     */
    saveStats(stats) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error('保存统计数据失败:', error);
            return false;
        }
    },
    
    /**
     * 记录链接分享
     */
    recordLinkShare() {
        const stats = this.getStats() || {
            totalShares: 0,
            linkShares: 0,
            posterShares: 0,
            shareHistory: []
        };
        
        stats.totalShares++;
        stats.linkShares++;
        stats.lastShareTime = new Date().toISOString();
        stats.shareHistory.push({
            type: 'link',
            time: stats.lastShareTime
        });
        
        // 只保留最近100条记录
        if (stats.shareHistory.length > 100) {
            stats.shareHistory = stats.shareHistory.slice(-100);
        }
        
        this.saveStats(stats);
        this.updateDisplay();
        
        console.log('✅ 链接分享已记录');
        return stats;
    },
    
    /**
     * 记录海报分享
     */
    recordPosterShare() {
        const stats = this.getStats() || {
            totalShares: 0,
            linkShares: 0,
            posterShares: 0,
            shareHistory: []
        };
        
        stats.totalShares++;
        stats.posterShares++;
        stats.lastShareTime = new Date().toISOString();
        stats.shareHistory.push({
            type: 'poster',
            time: stats.lastShareTime
        });
        
        // 只保留最近100条记录
        if (stats.shareHistory.length > 100) {
            stats.shareHistory = stats.shareHistory.slice(-100);
        }
        
        this.saveStats(stats);
        this.updateDisplay();
        
        console.log('✅ 海报分享已记录');
        return stats;
    },
    
    /**
     * 更新页面显示
     */
    updateDisplay() {
        const stats = this.getStats();
        if (!stats) return;
        
        // 更新总分享次数
        const totalElement = document.getElementById('totalShareCount');
        if (totalElement) {
            totalElement.textContent = stats.totalShares;
        }
        
        // 更新链接分享次数
        const linkElement = document.getElementById('linkShareCount');
        if (linkElement) {
            linkElement.textContent = stats.linkShares;
        }
        
        // 更新海报分享次数
        const posterElement = document.getElementById('posterShareCount');
        if (posterElement) {
            posterElement.textContent = stats.posterShares;
        }
        
        // 更新最后分享时间
        const lastShareElement = document.getElementById('lastShareTime');
        if (lastShareElement && stats.lastShareTime) {
            const date = new Date(stats.lastShareTime);
            lastShareElement.textContent = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    
    /**
     * 获取今日分享次数
     */
    getTodayShares() {
        const stats = this.getStats();
        if (!stats || !stats.shareHistory) return 0;
        
        const today = new Date().toDateString();
        return stats.shareHistory.filter(item => {
            const itemDate = new Date(item.time).toDateString();
            return itemDate === today;
        }).length;
    },
    
    /**
     * 重置统计数据
     */
    reset() {
        const initialStats = {
            totalShares: 0,
            linkShares: 0,
            posterShares: 0,
            lastShareTime: null,
            shareHistory: []
        };
        this.saveStats(initialStats);
        this.updateDisplay();
        console.log('🔄 统计数据已重置');
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    ShareTracker.init();
    ShareTracker.updateDisplay();
});

console.log('%c📊 分享统计模块已加载', 'color: #7CB342; font-size: 14px; font-weight: bold;');
