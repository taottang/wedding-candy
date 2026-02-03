// =================================================================
// 导出管理器 - Export Manager
// 增强版数据导出功能，包含筛选、记录、多种格式
// =================================================================

const ExportManager = (() => {
    // 导出记录存储
    const EXPORT_HISTORY_KEY = 'wedding_export_history';
    const MAX_HISTORY_RECORDS = 5; // 最多保留5条记录
    
    /**
     * 获取导出历史记录
     * @returns {Array} 历史记录数组
     */
    function getExportHistory() {
        try {
            const history = localStorage.getItem(EXPORT_HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Failed to get export history:', error);
            return [];
        }
    }
    
    /**
     * 添加导出记录
     * @param {Object} record - 导出记录
     */
    function addExportRecord(record) {
        try {
            let history = getExportHistory();
            
            // 添加新记录
            history.unshift({
                id: Utils.generateID(),
                ...record,
                timestamp: new Date().toISOString()
            });
            
            // 只保留最近的N条记录
            history = history.slice(0, MAX_HISTORY_RECORDS);
            
            localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history));
            
            console.log('Export record added:', record);
        } catch (error) {
            console.error('Failed to add export record:', error);
        }
    }
    
    /**
     * 清空导出历史
     */
    function clearExportHistory() {
        try {
            localStorage.removeItem(EXPORT_HISTORY_KEY);
            console.log('Export history cleared');
        } catch (error) {
            console.error('Failed to clear export history:', error);
        }
    }
    
    /**
     * 筛选数据
     * @param {Array} data - 原始数据
     * @param {Object} filters - 筛选条件
     * @returns {Array} 筛选后的数据
     */
    function filterData(data, filters = {}) {
        if (!data || data.length === 0) return [];
        
        let filtered = [...data];
        
        // 时间范围筛选
        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            if (start || end) {
                filtered = filtered.filter(item => {
                    const submitTime = new Date(item.submit_time);
                    if (start && submitTime < new Date(start)) return false;
                    if (end && submitTime > new Date(end + 'T23:59:59')) return false;
                    return true;
                });
            }
        }
        
        // 地区筛选
        if (filters.region) {
            const { province, city, district } = filters.region;
            if (province) {
                filtered = filtered.filter(item => 
                    item.address?.province === province
                );
            }
            if (city) {
                filtered = filtered.filter(item => 
                    item.address?.city === city
                );
            }
            if (district) {
                filtered = filtered.filter(item => 
                    item.address?.district === district
                );
            }
        }
        
        // 状态筛选
        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === filters.status);
        }
        
        // 关系筛选
        if (filters.relation && filters.relation !== 'all') {
            filtered = filtered.filter(item => item.relation === filters.relation);
        }
        
        // 关键词搜索
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            filtered = filtered.filter(item => {
                return (
                    item.name?.toLowerCase().includes(keyword) ||
                    item.phone?.includes(keyword) ||
                    item.wechat?.toLowerCase().includes(keyword) ||
                    item.address?.detail?.toLowerCase().includes(keyword) ||
                    item.blessing?.toLowerCase().includes(keyword)
                );
            });
        }
        
        console.log(`Filtered data: ${data.length} → ${filtered.length} records`);
        return filtered;
    }
    
    /**
     * 导出为 Excel（增强版）
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     */
    async function exportExcel(data, options = {}) {
        try {
            const startTime = Date.now();
            
            // 应用筛选
            const filteredData = options.filters 
                ? filterData(data, options.filters) 
                : data;
            
            if (filteredData.length === 0) {
                Utils.toast('没有可导出的数据', 'warning');
                return { success: false, message: 'No data to export' };
            }
            
            // 调用原有的导出功能
            const result = await ExportUtils.exportToExcel(
                filteredData, 
                options.filename || '喜糖领取记录'
            );
            
            const duration = Date.now() - startTime;
            
            // 记录导出历史
            addExportRecord({
                type: 'excel',
                format: 'Excel (XLSX)',
                filename: result.filename,
                recordCount: filteredData.length,
                filters: options.filters || {},
                duration: duration,
                fileSize: estimateFileSize(filteredData.length, 'excel')
            });
            
            return { ...result, recordCount: filteredData.length };
            
        } catch (error) {
            console.error('Export Excel error:', error);
            throw error;
        }
    }
    
    /**
     * 导出为 CSV（增强版）
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     */
    async function exportCSV(data, options = {}) {
        try {
            const startTime = Date.now();
            
            // 应用筛选
            const filteredData = options.filters 
                ? filterData(data, options.filters) 
                : data;
            
            if (filteredData.length === 0) {
                Utils.toast('没有可导出的数据', 'warning');
                return { success: false, message: 'No data to export' };
            }
            
            // 调用原有的导出功能
            const result = await ExportUtils.exportToCSV(
                filteredData, 
                options.filename || '喜糖领取记录'
            );
            
            const duration = Date.now() - startTime;
            
            // 记录导出历史
            addExportRecord({
                type: 'csv',
                format: 'CSV',
                filename: result.filename,
                recordCount: filteredData.length,
                filters: options.filters || {},
                duration: duration,
                fileSize: estimateFileSize(filteredData.length, 'csv')
            });
            
            return { ...result, recordCount: filteredData.length };
            
        } catch (error) {
            console.error('Export CSV error:', error);
            throw error;
        }
    }
    
    /**
     * 打印数据
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     */
    function printData(data, options = {}) {
        try {
            // 应用筛选
            const filteredData = options.filters 
                ? filterData(data, options.filters) 
                : data;
            
            if (filteredData.length === 0) {
                Utils.toast('没有可打印的数据', 'warning');
                return { success: false, message: 'No data to print' };
            }
            
            // 生成打印HTML
            const printHTML = generatePrintHTML(filteredData, options);
            
            // 创建隐藏的iframe用于打印
            const printFrame = document.createElement('iframe');
            printFrame.style.display = 'none';
            document.body.appendChild(printFrame);
            
            const printDoc = printFrame.contentDocument || printFrame.contentWindow.document;
            printDoc.open();
            printDoc.write(printHTML);
            printDoc.close();
            
            // 等待内容加载后打印
            setTimeout(() => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
                
                // 打印完成后移除iframe
                setTimeout(() => {
                    document.body.removeChild(printFrame);
                }, 1000);
            }, 500);
            
            // 记录导出历史
            addExportRecord({
                type: 'print',
                format: '打印',
                filename: '打印预览',
                recordCount: filteredData.length,
                filters: options.filters || {},
                duration: 0,
                fileSize: '-'
            });
            
            Utils.toast('正在准备打印...', 'info');
            return { success: true, recordCount: filteredData.length };
            
        } catch (error) {
            console.error('Print error:', error);
            Utils.toast('打印失败: ' + error.message, 'error');
            throw error;
        }
    }
    
    /**
     * 复制到剪贴板
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     */
    async function copyToClipboard(data, options = {}) {
        try {
            // 应用筛选
            const filteredData = options.filters 
                ? filterData(data, options.filters) 
                : data;
            
            if (filteredData.length === 0) {
                Utils.toast('没有可复制的数据', 'warning');
                return { success: false, message: 'No data to copy' };
            }
            
            // 生成文本内容
            const text = generateClipboardText(filteredData, options);
            
            // 尝试使用现代Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // 降级方案：使用传统方法
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            
            // 记录导出历史
            addExportRecord({
                type: 'clipboard',
                format: '剪贴板',
                filename: '复制到剪贴板',
                recordCount: filteredData.length,
                filters: options.filters || {},
                duration: 0,
                fileSize: formatBytes(text.length)
            });
            
            Utils.toast(`已复制 ${filteredData.length} 条记录到剪贴板`, 'success');
            return { success: true, recordCount: filteredData.length };
            
        } catch (error) {
            console.error('Copy to clipboard error:', error);
            Utils.toast('复制失败: ' + error.message, 'error');
            throw error;
        }
    }
    
    /**
     * 生成打印HTML
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     * @returns {string} HTML字符串
     */
    function generatePrintHTML(data, options = {}) {
        const title = options.title || '婚礼喜糖领取记录';
        const now = Utils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
        
        let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            padding: 20px;
        }
        
        .print-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
        }
        
        .print-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .print-info {
            font-size: 11px;
            color: #666;
        }
        
        .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .print-table th,
        .print-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        .print-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
        }
        
        .print-table tbody tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        .print-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: right;
            font-size: 11px;
            color: #666;
        }
        
        .status-pending { color: #E65100; font-weight: bold; }
        .status-shipped { color: #1976D2; font-weight: bold; }
        .status-received { color: #2E7D32; font-weight: bold; }
        
        @media print {
            body { padding: 10px; }
            .print-table { page-break-inside: auto; }
            .print-table tr { page-break-inside: avoid; page-break-after: auto; }
            .print-table thead { display: table-header-group; }
            .print-table tfoot { display: table-footer-group; }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <div class="print-title">${title}</div>
        <div class="print-info">打印时间：${now} | 记录总数：${data.length} 条</div>
    </div>
    
    <table class="print-table">
        <thead>
            <tr>
                <th style="width: 40px;">序号</th>
                <th style="width: 80px;">姓名</th>
                <th style="width: 100px;">手机号</th>
                <th style="width: 60px;">关系</th>
                <th style="width: 200px;">地址</th>
                <th style="width: 60px;">状态</th>
                <th style="width: 120px;">提交时间</th>
            </tr>
        </thead>
        <tbody>`;
        
        data.forEach((item, index) => {
            const statusClass = `status-${item.status}`;
            const statusText = ExportUtils.getStatusText(item.status);
            const address = [
                item.address?.province,
                item.address?.city,
                item.address?.district,
                item.address?.detail
            ].filter(Boolean).join('');
            
            html += `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${item.name || ''}</td>
                <td>${item.phone || ''}</td>
                <td style="text-align: center;">${item.relation_text || item.relation || ''}</td>
                <td>${address}</td>
                <td class="${statusClass}" style="text-align: center;">${statusText}</td>
                <td>${Utils.formatDate(item.submit_time, 'MM-DD HH:mm')}</td>
            </tr>`;
        });
        
        html += `
        </tbody>
    </table>
    
    <div class="print-footer">
        邓蓓 & 唐韬的婚礼喜糖领取系统
    </div>
</body>
</html>`;
        
        return html;
    }
    
    /**
     * 生成剪贴板文本
     * @param {Array} data - 数据
     * @param {Object} options - 选项
     * @returns {string} 文本字符串
     */
    function generateClipboardText(data, options = {}) {
        const format = options.format || 'table'; // 'table' 或 'csv'
        
        if (format === 'csv') {
            // CSV格式
            const headers = ['序号', '姓名', '手机号', '微信号', '关系', '省份', '城市', '区县', '详细地址', '状态', '提交时间'];
            const rows = data.map((item, index) => [
                index + 1,
                item.name || '',
                item.phone || '',
                item.wechat || '',
                item.relation_text || item.relation || '',
                item.address?.province || '',
                item.address?.city || '',
                item.address?.district || '',
                item.address?.detail || '',
                ExportUtils.getStatusText(item.status),
                Utils.formatDate(item.submit_time, 'YYYY-MM-DD HH:mm:ss')
            ]);
            
            return [headers, ...rows]
                .map(row => row.join('\t'))
                .join('\n');
        } else {
            // 表格格式（对齐的纯文本）
            let text = '婚礼喜糖领取记录\n';
            text += '=' .repeat(80) + '\n\n';
            
            data.forEach((item, index) => {
                text += `【记录 ${index + 1}】\n`;
                text += `姓名：${item.name || ''}\n`;
                text += `手机：${item.phone || ''}\n`;
                text += `微信：${item.wechat || ''}\n`;
                text += `关系：${item.relation_text || item.relation || ''}\n`;
                text += `地址：${[item.address?.province, item.address?.city, item.address?.district, item.address?.detail].filter(Boolean).join('')}\n`;
                text += `状态：${ExportUtils.getStatusText(item.status)}\n`;
                text += `时间：${Utils.formatDate(item.submit_time, 'YYYY-MM-DD HH:mm:ss')}\n`;
                if (item.blessing) {
                    text += `祝福：${item.blessing}\n`;
                }
                text += '\n' + '-'.repeat(80) + '\n\n';
            });
            
            text += `\n总计：${data.length} 条记录\n`;
            text += `导出时间：${Utils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')}\n`;
            
            return text;
        }
    }
    
    /**
     * 估算文件大小
     * @param {number} recordCount - 记录数量
     * @param {string} type - 文件类型
     * @returns {string} 文件大小
     */
    function estimateFileSize(recordCount, type) {
        let bytesPerRecord;
        switch (type) {
            case 'excel':
                bytesPerRecord = 500; // Excel 文件每条记录约 500 字节
                break;
            case 'csv':
                bytesPerRecord = 200; // CSV 文件每条记录约 200 字节
                break;
            default:
                bytesPerRecord = 300;
        }
        
        const totalBytes = recordCount * bytesPerRecord;
        return formatBytes(totalBytes);
    }
    
    /**
     * 格式化字节数
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的字符串
     */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
    
    // 返回公共API
    return {
        // 导出功能
        exportExcel,
        exportCSV,
        printData,
        copyToClipboard,
        
        // 筛选功能
        filterData,
        
        // 历史记录
        getExportHistory,
        addExportRecord,
        clearExportHistory,
        
        // 工具函数
        estimateFileSize,
        formatBytes
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.ExportManager = ExportManager;
}

console.log('%c📦 Export Manager Loaded', 'color: #4CAF50; font-size: 12px; font-weight: bold;');
