// =================================================================
// 数据导出工具 - Export Utils
// 支持 Excel、CSV 导出，二维码生成
// =================================================================

const ExportUtils = (() => {
    // ExcelJS CDN 地址
    const EXCELJS_CDN = 'https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js';
    
    // QRCode CDN 地址
    const QRCODE_CDN = 'https://cdn.jsdelivr.net/npm/qrcodejs2@0.0.2/qrcodejs2.min.js';
    
    // 库加载状态
    let excelJSLoaded = false;
    let qrCodeLoaded = false;
    
    /**
     * 动态加载外部库
     * @param {string} url - CDN URL
     * @returns {Promise} 加载Promise
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            // 检查是否已加载
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    }
    
    /**
     * 确保 ExcelJS 已加载
     * @returns {Promise}
     */
    async function ensureExcelJS() {
        if (!excelJSLoaded) {
            try {
                await loadScript(EXCELJS_CDN);
                excelJSLoaded = typeof ExcelJS !== 'undefined';
                if (!excelJSLoaded) {
                    throw new Error('ExcelJS library not available');
                }
            } catch (error) {
                console.error('Failed to load ExcelJS:', error);
                throw new Error('无法加载 Excel 导出库，请检查网络连接');
            }
        }
    }
    
    /**
     * 确保 QRCode 已加载
     * @returns {Promise}
     */
    async function ensureQRCode() {
        if (!qrCodeLoaded) {
            try {
                await loadScript(QRCODE_CDN);
                qrCodeLoaded = typeof QRCode !== 'undefined';
                if (!qrCodeLoaded) {
                    throw new Error('QRCode library not available');
                }
            } catch (error) {
                console.error('Failed to load QRCode:', error);
                throw new Error('无法加载二维码生成库，请检查网络连接');
            }
        }
    }
    
    /**
     * 导出为 Excel
     * @param {Array} data - 数据数组
     * @param {string} filename - 文件名（不含扩展名）
     * @param {Object} options - 配置选项
     * @returns {Promise}
     */
    async function exportToExcel(data, filename = '喜糖领取记录', options = {}) {
        try {
            // 确保 ExcelJS 已加载
            await ensureExcelJS();
            
            // 显示加载提示
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('正在生成 Excel 文件...', 'info');
            }
            
            // 性能优化：使用 setTimeout 避免阻塞UI
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 创建工作簿
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('领取记录', {
                properties: { tabColor: { argb: 'FFE8B4B8' } }
            });
            
            // 设置列定义
            const columns = [
                { header: '序号', key: 'index', width: 8 },
                { header: '记录ID', key: 'id', width: 18 },
                { header: '姓名', key: 'name', width: 12 },
                { header: '手机号', key: 'phone', width: 15 },
                { header: '微信号', key: 'wechat', width: 15 },
                { header: '关系', key: 'relation', width: 10 },
                { header: '省份', key: 'province', width: 12 },
                { header: '城市', key: 'city', width: 12 },
                { header: '区县', key: 'district', width: 12 },
                { header: '详细地址', key: 'address', width: 30 },
                { header: '邮政编码', key: 'zipcode', width: 10 },
                { header: '期望配送时间', key: 'deliveryTime', width: 15 },
                { header: '祝福留言', key: 'blessing', width: 30 },
                { header: '状态', key: 'status', width: 10 },
                { header: '提交时间', key: 'submitTime', width: 20 },
                { header: '设备信息', key: 'deviceInfo', width: 20 }
            ];
            
            worksheet.columns = columns;
            
            // 设置表头样式
            const headerRow = worksheet.getRow(1);
            headerRow.height = 25;
            headerRow.font = {
                name: 'Microsoft YaHei',
                size: 12,
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
            headerRow.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8B4B8' }
            };
            headerRow.border = {
                top: { style: 'thin', color: { argb: 'FFD8A4A8' } },
                left: { style: 'thin', color: { argb: 'FFD8A4A8' } },
                bottom: { style: 'thin', color: { argb: 'FFD8A4A8' } },
                right: { style: 'thin', color: { argb: 'FFD8A4A8' } }
            };
            
            // 批量处理数据（性能优化）
            const BATCH_SIZE = 100;
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const batch = data.slice(i, i + BATCH_SIZE);
                
                batch.forEach((item, batchIndex) => {
                    const globalIndex = i + batchIndex;
                    const rowData = {
                        index: globalIndex + 1,
                        id: item.id || '',
                        name: item.name || '',
                        phone: item.phone || '',
                        wechat: item.wechat || '',
                        relation: item.relation_text || item.relation || '',
                        province: item.address?.province || '',
                        city: item.address?.city || '',
                        district: item.address?.district || '',
                        address: item.address?.detail || '',
                        zipcode: item.address?.zipcode || '',
                        deliveryTime: item.delivery_time || '',
                        blessing: item.blessing || '',
                        status: item.status_text || getStatusText(item.status),
                        submitTime: item.submit_time_formatted || formatDateTime(item.submit_time),
                        deviceInfo: item.device_info || ''
                    };
                    
                    const row = worksheet.addRow(rowData);
                    
                    // 设置行样式
                    row.height = 20;
                    row.font = { name: 'Microsoft YaHei', size: 10 };
                    row.alignment = { vertical: 'middle', wrapText: true };
                    
                    // 斑马纹效果
                    if ((globalIndex + 1) % 2 === 0) {
                        row.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFAFAFA' }
                        };
                    }
                    
                    // 设置边框
                    row.eachCell({ includeEmpty: true }, (cell) => {
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                            right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                        };
                    });
                    
                    // 状态单元格添加颜色
                    const statusCell = row.getCell('status');
                    switch (item.status) {
                        case 'pending':
                            statusCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFF3E0' }
                            };
                            statusCell.font = { color: { argb: 'FFE65100' }, bold: true };
                            break;
                        case 'shipped':
                            statusCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFE3F2FD' }
                            };
                            statusCell.font = { color: { argb: 'FF1976D2' }, bold: true };
                            break;
                        case 'received':
                            statusCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFE8F5E9' }
                            };
                            statusCell.font = { color: { argb: 'FF2E7D32' }, bold: true };
                            break;
                    }
                });
                
                // 批次间暂停，避免阻塞
                if (i + BATCH_SIZE < data.length) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
            
            // 添加统计行
            const summaryRow = worksheet.addRow({
                index: '',
                id: '统计信息',
                name: `总计: ${data.length} 条记录`,
                phone: '',
                wechat: '',
                relation: '',
                province: '',
                city: '',
                district: '',
                address: '',
                zipcode: '',
                deliveryTime: '',
                blessing: '',
                status: '',
                submitTime: `导出时间: ${formatDateTime(new Date())}`,
                deviceInfo: ''
            });
            summaryRow.font = { bold: true, color: { argb: 'FF666666' } };
            summaryRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F0F0' }
            };
            
            // 冻结首行
            worksheet.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1 }
            ];
            
            // 添加筛选
            worksheet.autoFilter = {
                from: 'A1',
                to: `P1`
            };
            
            // 生成文件
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            // 下载文件
            const timestamp = formatDateTime(new Date(), 'YYYYMMDD_HHmmss');
            const fullFilename = `${filename}_${timestamp}.xlsx`;
            downloadBlob(blob, fullFilename);
            
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('Excel 导出成功', 'success');
            }
            
            return { success: true, filename: fullFilename };
            
        } catch (error) {
            console.error('Export to Excel error:', error);
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('Excel 导出失败: ' + error.message, 'error');
            }
            throw error;
        }
    }
    
    /**
     * 导出为 CSV
     * @param {Array} data - 数据数组
     * @param {string} filename - 文件名（不含扩展名）
     * @param {Object} options - 配置选项
     * @returns {Promise}
     */
    async function exportToCSV(data, filename = '喜糖领取记录', options = {}) {
        try {
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('正在生成 CSV 文件...', 'info');
            }
            
            // 性能优化：使用 setTimeout 避免阻塞UI
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // CSV 表头
            const headers = [
                '序号',
                '记录ID',
                '姓名',
                '手机号',
                '微信号',
                '关系',
                '省份',
                '城市',
                '区县',
                '详细地址',
                '邮政编码',
                '期望配送时间',
                '祝福留言',
                '状态',
                '提交时间',
                '设备信息'
            ];
            
            // 批量处理数据
            const BATCH_SIZE = 500;
            const allRows = [headers];
            
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const batch = data.slice(i, i + BATCH_SIZE);
                
                const batchRows = batch.map((item, batchIndex) => {
                    const globalIndex = i + batchIndex;
                    return [
                        globalIndex + 1,
                        item.id || '',
                        item.name || '',
                        item.phone || '',
                        item.wechat || '',
                        item.relation_text || item.relation || '',
                        item.address?.province || '',
                        item.address?.city || '',
                        item.address?.district || '',
                        item.address?.detail || '',
                        item.address?.zipcode || '',
                        item.delivery_time || '',
                        item.blessing || '',
                        item.status_text || getStatusText(item.status),
                        item.submit_time_formatted || formatDateTime(item.submit_time),
                        item.device_info || ''
                    ];
                });
                
                allRows.push(...batchRows);
                
                // 批次间暂停
                if (i + BATCH_SIZE < data.length) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
            
            // 转换为 CSV 字符串
            const csvContent = allRows.map(row => 
                row.map(cell => escapeCsvField(String(cell))).join(',')
            ).join('\n');
            
            // 添加 BOM 以支持 Excel 中文显示
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], {
                type: 'text/csv;charset=utf-8;'
            });
            
            // 下载文件
            const timestamp = formatDateTime(new Date(), 'YYYYMMDD_HHmmss');
            const fullFilename = `${filename}_${timestamp}.csv`;
            downloadBlob(blob, fullFilename);
            
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('CSV 导出成功', 'success');
            }
            
            return { success: true, filename: fullFilename };
            
        } catch (error) {
            console.error('Export to CSV error:', error);
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('CSV 导出失败: ' + error.message, 'error');
            }
            throw error;
        }
    }
    
    /**
     * 转义 CSV 字段
     * @param {string} field - 字段值
     * @returns {string} 转义后的字段
     */
    function escapeCsvField(field) {
        if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }
    
    /**
     * 生成二维码
     * @param {string} text - 二维码内容
     * @param {Object} options - 配置选项
     * @returns {Promise<string>} Base64 图片数据
     */
    async function generateQRCode(text, options = {}) {
        try {
            await ensureQRCode();
            
            const defaultOptions = {
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            };
            
            const config = { ...defaultOptions, ...options };
            
            // 创建临时容器
            const container = document.createElement('div');
            container.style.display = 'none';
            document.body.appendChild(container);
            
            // 生成二维码
            const qrcode = new QRCode(container, {
                text: text,
                width: config.width,
                height: config.height,
                colorDark: config.colorDark,
                colorLight: config.colorLight,
                correctLevel: config.correctLevel
            });
            
            // 等待生成完成
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 获取 canvas 或 img
            const canvas = container.querySelector('canvas');
            const img = container.querySelector('img');
            
            let dataUrl;
            if (canvas) {
                dataUrl = canvas.toDataURL('image/png');
            } else if (img) {
                dataUrl = img.src;
            } else {
                throw new Error('Failed to generate QR code');
            }
            
            // 清理临时容器
            document.body.removeChild(container);
            
            return dataUrl;
            
        } catch (error) {
            console.error('Generate QR code error:', error);
            throw error;
        }
    }
    
    /**
     * 格式化日期时间
     * @param {Date|string} date - 日期
     * @param {string} format - 格式
     * @returns {string} 格式化后的字符串
     */
    function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        
        const map = {
            'YYYY': d.getFullYear(),
            'MM': String(d.getMonth() + 1).padStart(2, '0'),
            'DD': String(d.getDate()).padStart(2, '0'),
            'HH': String(d.getHours()).padStart(2, '0'),
            'mm': String(d.getMinutes()).padStart(2, '0'),
            'ss': String(d.getSeconds()).padStart(2, '0')
        };
        
        let result = format;
        for (const [key, value] of Object.entries(map)) {
            result = result.replace(key, value);
        }
        
        return result;
    }
    
    /**
     * 获取状态文本
     * @param {string} status - 状态值
     * @returns {string} 状态文本
     */
    function getStatusText(status) {
        const statusMap = {
            'pending': '待发货',
            'shipped': '已发货',
            'received': '已签收'
        };
        return statusMap[status] || status || '';
    }
    
    /**
     * 下载 Blob
     * @param {Blob} blob - Blob 对象
     * @param {string} filename - 文件名
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    /**
     * 导出简单的文本文件
     * @param {string} content - 内容
     * @param {string} filename - 文件名
     * @param {string} mimeType - MIME 类型
     */
    function exportTextFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        downloadBlob(blob, filename);
    }
    
    /**
     * 导出 JSON 文件
     * @param {Object} data - 数据对象
     * @param {string} filename - 文件名
     */
    function exportJSON(data, filename = 'data.json') {
        const content = JSON.stringify(data, null, 2);
        exportTextFile(content, filename, 'application/json');
    }
    
    /**
     * 批量导出为多个文件（ZIP）
     * 注意：需要额外引入 JSZip 库
     * @param {Array} files - 文件数组 [{name, content, type}]
     * @param {string} zipFilename - ZIP 文件名
     */
    async function exportZip(files, zipFilename = 'export.zip') {
        try {
            // 检查 JSZip 是否可用
            if (typeof JSZip === 'undefined') {
                throw new Error('JSZip library not loaded');
            }
            
            const zip = new JSZip();
            
            files.forEach(file => {
                zip.file(file.name, file.content);
            });
            
            const blob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(blob, zipFilename);
            
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('ZIP 导出成功', 'success');
            }
            
        } catch (error) {
            console.error('Export ZIP error:', error);
            if (typeof Utils !== 'undefined' && Utils.toast) {
                Utils.toast('ZIP 导出失败: ' + error.message, 'error');
            }
            throw error;
        }
    }
    
    /**
     * 预加载导出库（可选，提前加载以提升用户体验）
     */
    async function preloadLibraries() {
        try {
            await ensureExcelJS();
            console.log('ExcelJS preloaded successfully');
        } catch (error) {
            console.warn('Failed to preload ExcelJS:', error);
        }
    }
    
    // 返回公共 API
    return {
        // 核心导出功能
        exportToExcel,
        exportToCSV,
        generateQRCode,
        
        // 辅助功能
        exportTextFile,
        exportJSON,
        exportZip,
        
        // 工具函数
        formatDateTime,
        getStatusText,
        downloadBlob,
        
        // 预加载
        preloadLibraries,
        
        // CDN 地址（可自定义）
        EXCELJS_CDN,
        QRCODE_CDN
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.ExportUtils = ExportUtils;
}

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportUtils;
}

// 在控制台显示信息
console.log('%c📦 Export Utils Loaded', 'color: #4CAF50; font-size: 12px;');

// 可选：页面加载后预加载库（提升用户体验）
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // 延迟预加载，避免影响页面加载
        setTimeout(() => {
            ExportUtils.preloadLibraries().catch(() => {
                // 静默失败，不影响用户体验
            });
        }, 2000);
    });
}
