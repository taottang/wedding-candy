// =================================================================
// 统计管理器 - Statistics Manager
// 数据统计、趋势分析、图表生成
// =================================================================

const StatisticsManager = (() => {
    /**
     * 获取基础统计
     */
    function getBasicStatistics() {
        try {
            const recipients = DataManager.getAllRecipients();
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            // 今日新增
            const todayCount = recipients.filter(item => {
                const submitTime = new Date(item.submit_time);
                return submitTime >= todayStart;
            }).length;
            
            return {
                total: recipients.length,
                todayNew: todayCount,
                pending: recipients.filter(r => r.status === 'pending').length,
                shipped: recipients.filter(r => r.status === 'shipped').length,
                received: recipients.filter(r => r.status === 'received').length
            };
        } catch (error) {
            console.error('Get basic statistics error:', error);
            return {
                total: 0,
                todayNew: 0,
                pending: 0,
                shipped: 0,
                received: 0
            };
        }
    }
    
    /**
     * 获取地区分布统计
     */
    function getRegionDistribution() {
        try {
            const recipients = DataManager.getAllRecipients();
            const distribution = {};
            
            recipients.forEach(item => {
                const province = item.address?.province || '未知';
                if (!distribution[province]) {
                    distribution[province] = {
                        name: province,
                        count: 0,
                        cities: {}
                    };
                }
                distribution[province].count++;
                
                // 统计城市
                const city = item.address?.city || '未知';
                if (!distribution[province].cities[city]) {
                    distribution[province].cities[city] = 0;
                }
                distribution[province].cities[city]++;
            });
            
            // 转换为数组并排序
            const result = Object.values(distribution)
                .sort((a, b) => b.count - a.count);
            
            return result;
        } catch (error) {
            console.error('Get region distribution error:', error);
            return [];
        }
    }
    
    /**
     * 获取最近7天趋势
     */
    function getLast7DaysTrend() {
        try {
            const recipients = DataManager.getAllRecipients();
            const now = new Date();
            const trends = [];
            
            // 生成最近7天的日期
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);
                
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                
                // 统计当天的提交数
                const count = recipients.filter(item => {
                    const submitTime = new Date(item.submit_time);
                    return submitTime >= date && submitTime < nextDate;
                }).length;
                
                trends.push({
                    date: date,
                    dateStr: Utils.formatDate(date, 'MM-DD'),
                    weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
                    count: count
                });
            }
            
            return trends;
        } catch (error) {
            console.error('Get last 7 days trend error:', error);
            return [];
        }
    }
    
    /**
     * 获取关系分布统计
     */
    function getRelationDistribution() {
        try {
            const recipients = DataManager.getAllRecipients();
            const distribution = {};
            
            recipients.forEach(item => {
                const relation = item.relation || 'other';
                const relationText = item.relation_text || '其他';
                
                if (!distribution[relation]) {
                    distribution[relation] = {
                        key: relation,
                        name: relationText,
                        count: 0
                    };
                }
                distribution[relation].count++;
            });
            
            // 转换为数组并排序
            const result = Object.values(distribution)
                .sort((a, b) => b.count - a.count);
            
            return result;
        } catch (error) {
            console.error('Get relation distribution error:', error);
            return [];
        }
    }
    
    /**
     * 生成趋势图HTML（简单柱状图）
     */
    function generateTrendChart(trends, options = {}) {
        try {
            const maxCount = Math.max(...trends.map(t => t.count), 1);
            const height = options.height || 200;
            const barWidth = options.barWidth || 40;
            const gap = options.gap || 10;
            const showValues = options.showValues !== false;
            
            let html = `<div class="trend-chart" style="height: ${height}px;">`;
            
            // 图表容器
            html += `<div class="chart-container" style="display: flex; align-items: flex-end; justify-content: space-around; height: 100%; padding: 10px;">`;
            
            trends.forEach((trend, index) => {
                const barHeight = maxCount > 0 ? (trend.count / maxCount) * (height - 50) : 0;
                const color = trend.count > 0 ? '#667eea' : '#e0e0e0';
                
                html += `
                <div class="chart-bar-wrapper" style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    ${showValues && trend.count > 0 ? `
                    <div class="chart-value" style="font-size: 12px; font-weight: 600; color: ${color}; margin-bottom: 5px;">
                        ${trend.count}
                    </div>
                    ` : '<div style="height: 20px;"></div>'}
                    <div class="chart-bar" style="
                        width: ${barWidth}px;
                        height: ${barHeight}px;
                        background: linear-gradient(to top, ${color}, ${color}dd);
                        border-radius: 4px 4px 0 0;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    " title="${trend.dateStr}: ${trend.count}条"></div>
                    <div class="chart-label" style="
                        margin-top: 8px;
                        font-size: 11px;
                        color: #666;
                        text-align: center;
                    ">
                        <div>${trend.dateStr}</div>
                        <div style="color: #999; font-size: 10px;">周${trend.weekday}</div>
                    </div>
                </div>
                `;
            });
            
            html += `</div>`;
            html += `</div>`;
            
            // 添加交互样式
            html += `
            <style>
                .chart-bar:hover {
                    opacity: 0.8;
                    transform: translateY(-2px);
                }
            </style>
            `;
            
            return html;
        } catch (error) {
            console.error('Generate trend chart error:', error);
            return '<div class="error">图表生成失败</div>';
        }
    }
    
    /**
     * 生成地区分布图HTML（横向柱状图）
     */
    function generateRegionChart(regions, options = {}) {
        try {
            const maxCount = Math.max(...regions.map(r => r.count), 1);
            const topN = options.topN || 10;
            const showPercentage = options.showPercentage !== false;
            const total = regions.reduce((sum, r) => sum + r.count, 0);
            
            const topRegions = regions.slice(0, topN);
            
            let html = `<div class="region-chart">`;
            
            topRegions.forEach((region, index) => {
                const percentage = total > 0 ? ((region.count / total) * 100).toFixed(1) : 0;
                const width = maxCount > 0 ? (region.count / maxCount) * 100 : 0;
                const color = getColorByIndex(index);
                
                html += `
                <div class="region-item" style="margin-bottom: 12px;">
                    <div class="region-header" style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
                        <span class="region-name" style="font-weight: 500; color: #333;">
                            ${index + 1}. ${region.name}
                        </span>
                        <span class="region-count" style="color: #666;">
                            ${region.count} 条
                            ${showPercentage ? `<span style="color: #999; margin-left: 5px;">(${percentage}%)</span>` : ''}
                        </span>
                    </div>
                    <div class="region-bar-bg" style="
                        width: 100%;
                        height: 20px;
                        background: #f0f0f0;
                        border-radius: 10px;
                        overflow: hidden;
                        position: relative;
                    ">
                        <div class="region-bar" style="
                            width: ${width}%;
                            height: 100%;
                            background: linear-gradient(to right, ${color}, ${color}dd);
                            border-radius: 10px;
                            transition: width 0.5s ease;
                            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                        "></div>
                    </div>
                </div>
                `;
            });
            
            if (regions.length > topN) {
                const othersCount = regions.slice(topN).reduce((sum, r) => sum + r.count, 0);
                const othersPercentage = total > 0 ? ((othersCount / total) * 100).toFixed(1) : 0;
                
                html += `
                <div class="region-item" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e0e0e0;">
                    <div class="region-header" style="display: flex; justify-content: space-between; font-size: 12px; color: #999;">
                        <span>其他 ${regions.length - topN} 个地区</span>
                        <span>${othersCount} 条 (${othersPercentage}%)</span>
                    </div>
                </div>
                `;
            }
            
            html += `</div>`;
            
            return html;
        } catch (error) {
            console.error('Generate region chart error:', error);
            return '<div class="error">图表生成失败</div>';
        }
    }
    
    /**
     * 生成关系分布饼图HTML（简化版）
     */
    function generateRelationChart(relations, options = {}) {
        try {
            const total = relations.reduce((sum, r) => sum + r.count, 0);
            
            let html = `<div class="relation-chart" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">`;
            
            relations.forEach((relation, index) => {
                const percentage = total > 0 ? ((relation.count / total) * 100).toFixed(1) : 0;
                const color = getColorByIndex(index);
                
                html += `
                <div class="relation-item" style="
                    padding: 15px;
                    background: ${color}15;
                    border: 2px solid ${color};
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px ${color}40';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 24px; margin-bottom: 5px;">${getRelationIcon(relation.key)}</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 5px;">${relation.name}</div>
                    <div style="font-size: 20px; font-weight: 700; color: ${color};">${relation.count}</div>
                    <div style="font-size: 11px; color: #999; margin-top: 3px;">${percentage}%</div>
                </div>
                `;
            });
            
            html += `</div>`;
            
            return html;
        } catch (error) {
            console.error('Generate relation chart error:', error);
            return '<div class="error">图表生成失败</div>';
        }
    }
    
    /**
     * 根据索引获取颜色
     */
    function getColorByIndex(index) {
        const colors = [
            '#667eea', // 紫色
            '#4CAF50', // 绿色
            '#FF9800', // 橙色
            '#2196F3', // 蓝色
            '#E91E63', // 粉色
            '#9C27B0', // 紫红
            '#00BCD4', // 青色
            '#FFC107', // 黄色
            '#795548', // 棕色
            '#607D8B'  // 灰蓝
        ];
        return colors[index % colors.length];
    }
    
    /**
     * 获取关系图标
     */
    function getRelationIcon(relation) {
        const icons = {
            'family': '👨‍👩‍👧',
            'relative': '👥',
            'friend': '🤝',
            'colleague': '💼',
            'classmate': '🎓',
            'other': '👤'
        };
        return icons[relation] || '👤';
    }
    
    /**
     * 生成完整统计报告
     */
    function generateFullReport() {
        try {
            const basic = getBasicStatistics();
            const regions = getRegionDistribution();
            const trends = getLast7DaysTrend();
            const relations = getRelationDistribution();
            
            return {
                basic,
                regions,
                trends,
                relations,
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Generate full report error:', error);
            return {
                basic: {},
                regions: [],
                trends: [],
                relations: [],
                error: error.message
            };
        }
    }
    
    /**
     * 导出统计报告
     */
    function exportReport(format = 'json') {
        try {
            const report = generateFullReport();
            
            if (format === 'json') {
                const jsonStr = JSON.stringify(report, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const timestamp = Utils.formatDate(new Date(), 'YYYYMMDD_HHmmss');
                const filename = `统计报告_${timestamp}.json`;
                downloadBlob(blob, filename);
                
                Utils.toast('统计报告已导出', 'success');
                return { success: true, filename };
            }
            
        } catch (error) {
            console.error('Export report error:', error);
            Utils.toast('导出失败: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }
    
    /**
     * 下载Blob
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // 返回公共API
    return {
        // 统计数据
        getBasicStatistics,
        getRegionDistribution,
        getLast7DaysTrend,
        getRelationDistribution,
        generateFullReport,
        
        // 图表生成
        generateTrendChart,
        generateRegionChart,
        generateRelationChart,
        
        // 导出
        exportReport
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.StatisticsManager = StatisticsManager;
}

console.log('%c📊 Statistics Manager Loaded', 'color: #4CAF50; font-size: 12px; font-weight: bold;');
