// =================================================================
// 数据管理器 - Data Manager
// 管理领取记录的增删改查和统计
// =================================================================

const DataManager = {
    // LocalStorage 键名
    STORAGE_KEY: 'wedding_recipients_data',
    BACKUP_KEY: 'wedding_recipients_backup',
    
    // 状态常量
    STATUS: {
        PENDING: 'pending',      // 待处理
        SHIPPED: 'shipped',      // 已发货
        RECEIVED: 'received'     // 已签收
    },
    
    // 关系映射
    RELATIONSHIP_MAP: {
        'family': '家人',
        'friend': '朋友',
        'colleague': '同事',
        'relative': '亲戚',
        'other': '其他'
    },
    
    /**
     * 生成唯一ID
     * 格式：R + 日期(YYYYMMDD) + _ + 序号(001)
     * @returns {string} 唯一ID
     */
    generateId() {
        const now = new Date();
        const dateStr = Utils.formatDate(now, 'YYYYMMDD');
        
        // 获取今天已有的记录数
        const allRecipients = this.getAllRecipients();
        const todayRecipients = allRecipients.filter(r => {
            const recordDate = Utils.formatDate(new Date(r.submit_time), 'YYYYMMDD');
            return recordDate === dateStr;
        });
        
        // 生成序号（3位数，补零）
        const sequence = String(todayRecipients.length + 1).padStart(3, '0');
        
        return `R${dateStr}_${sequence}`;
    },
    
    /**
     * 获取设备信息
     * @returns {string} 设备信息
     */
    getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'Desktop';
        
        if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) {
            if (/iPad/.test(ua)) {
                deviceType = 'iPad';
            } else if (/iPhone/.test(ua)) {
                deviceType = 'iPhone';
            } else if (/Android/.test(ua)) {
                deviceType = 'Android';
            } else {
                deviceType = 'Mobile';
            }
        }
        
        const browser = Utils.getBrowser();
        return `${deviceType} | ${browser}`;
    },
    
    /**
     * 获取IP地址（模拟）
     * 注意：纯前端无法获取真实IP，这里返回占位符
     * @returns {string} IP地址
     */
    getIpAddress() {
        // 实际项目中需要后端API返回真实IP
        return 'Client-Side';
    },
    
    /**
     * 保存领取记录
     * @param {Object} data - 表单数据
     * @returns {Object} 保存结果 {success: boolean, message: string, data: Object}
     */
    saveRecipient(data) {
        try {
            // 验证必填字段
            if (!data.name || !data.phone) {
                return {
                    success: false,
                    message: '姓名和手机号为必填项',
                    data: null
                };
            }
            
            // 检查手机号是否已存在
            const allRecipients = this.getAllRecipients();
            const phoneExists = allRecipients.some(r => {
                // 移除脱敏的手机号中的星号进行比较
                const existingPhone = r.phone.replace(/\*/g, '');
                const newPhone = data.phone;
                // 比较前3位和后4位
                return existingPhone.substring(0, 3) === newPhone.substring(0, 3) &&
                       existingPhone.substring(existingPhone.length - 4) === newPhone.substring(newPhone.length - 4);
            });
            
            if (phoneExists) {
                return {
                    success: false,
                    message: '该手机号已经提交过领取信息',
                    data: null
                };
            }
            
            // 构造存储记录
            const recipient = {
                id: this.generateId(),
                name: data.name,
                phone: FormValidator.maskPhone(data.phone), // 脱敏处理
                phone_raw: data.phone, // 保留原始号码用于通知（实际项目中应加密存储）
                wechat: data.wechat || '',
                address: {
                    province: data.province || '',
                    city: data.city || '',
                    district: data.district || '',
                    detail: data.address || '',
                    zipcode: data.zipcode || '',
                    full: `${data.province || ''} ${data.city || ''} ${data.district || ''} ${data.address || ''}`.trim()
                },
                relation: data.relationship || 'other',
                relation_text: this.RELATIONSHIP_MAP[data.relationship] || '其他',
                delivery_time: data.deliveryTime || 'anytime',
                blessing: data.message || '',
                status: this.STATUS.PENDING,
                status_text: '待处理',
                submit_time: new Date().toISOString(),
                submit_time_formatted: Utils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                ip_address: this.getIpAddress(),
                device_info: this.getDeviceInfo(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // 保存到数组
            allRecipients.unshift(recipient); // 添加到数组开头（最新的在前）
            
            // 保存到LocalStorage
            if (!this.saveToStorage(allRecipients)) {
                return {
                    success: false,
                    message: '存储空间不足，保存失败',
                    data: null
                };
            }
            
            // 自动备份
            this.createBackup(allRecipients);
            
            // 保存最后提交的数据（用于成功页面显示）
            this.saveLastSubmission(recipient);
            
            return {
                success: true,
                message: '保存成功',
                data: recipient
            };
            
        } catch (error) {
            console.error('Save recipient error:', error);
            return {
                success: false,
                message: '系统错误，保存失败',
                data: null
            };
        }
    },
    
    /**
     * 添加领取记录（别名，兼容旧代码）
     * @param {Object} data - 表单数据
     * @returns {Object} 保存结果
     */
    addRecipient(data) {
        return this.saveRecipient(data);
    },
    
    /**
     * 获取所有领取记录
     * @returns {Array} 领取记录数组
     */
    getAllRecipients() {
        return Utils.storage.get(this.STORAGE_KEY, []);
    },
    
    /**
     * 根据ID获取单个记录
     * @param {string} id - 记录ID
     * @returns {Object|null} 记录对象或null
     */
    getRecipientById(id) {
        const recipients = this.getAllRecipients();
        return recipients.find(r => r.id === id) || null;
    },
    
    /**
     * 更新记录状态
     * @param {string} id - 记录ID
     * @param {string} status - 新状态
     * @returns {boolean} 是否更新成功
     */
    updateStatus(id, status) {
        try {
            const recipients = this.getAllRecipients();
            const index = recipients.findIndex(r => r.id === id);
            
            if (index === -1) {
                console.warn('Record not found:', id);
                return false;
            }
            
            // 验证状态值
            if (!Object.values(this.STATUS).includes(status)) {
                console.warn('Invalid status:', status);
                return false;
            }
            
            // 更新状态
            recipients[index].status = status;
            recipients[index].status_text = this.getStatusText(status);
            recipients[index].updated_at = new Date().toISOString();
            
            // 如果是已发货，记录发货时间
            if (status === this.STATUS.SHIPPED && !recipients[index].shipped_at) {
                recipients[index].shipped_at = new Date().toISOString();
            }
            
            // 如果是已签收，记录签收时间
            if (status === this.STATUS.RECEIVED && !recipients[index].received_at) {
                recipients[index].received_at = new Date().toISOString();
            }
            
            return this.saveToStorage(recipients);
        } catch (error) {
            console.error('Update status error:', error);
            return false;
        }
    },
    
    /**
     * 切换状态（在pending和shipped之间切换）
     * @param {string} id - 记录ID
     * @returns {boolean} 是否切换成功
     */
    toggleStatus(id) {
        const recipient = this.getRecipientById(id);
        if (!recipient) return false;
        
        const newStatus = recipient.status === this.STATUS.PENDING 
            ? this.STATUS.SHIPPED 
            : this.STATUS.PENDING;
        
        return this.updateStatus(id, newStatus);
    },
    
    /**
     * 更新整个记录
     * @param {string} id - 记录ID
     * @param {Object} updates - 更新数据
     * @returns {boolean} 是否更新成功
     */
    updateRecipient(id, updates) {
        try {
            const recipients = this.getAllRecipients();
            const index = recipients.findIndex(r => r.id === id);
            
            if (index === -1) {
                return false;
            }
            
            // 合并更新
            recipients[index] = {
                ...recipients[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            
            return this.saveToStorage(recipients);
        } catch (error) {
            console.error('Update recipient error:', error);
            return false;
        }
    },
    
    /**
     * 删除记录
     * @param {string} id - 记录ID
     * @returns {boolean} 是否删除成功
     */
    deleteRecipient(id) {
        try {
            const recipients = this.getAllRecipients();
            const filteredRecipients = recipients.filter(r => r.id !== id);
            
            if (filteredRecipients.length === recipients.length) {
                console.warn('Record not found:', id);
                return false;
            }
            
            return this.saveToStorage(filteredRecipients);
        } catch (error) {
            console.error('Delete recipient error:', error);
            return false;
        }
    },
    
    /**
     * 批量删除记录
     * @param {Array} ids - 记录ID数组
     * @returns {Object} 删除结果 {success: number, failed: number}
     */
    batchDelete(ids) {
        let success = 0;
        let failed = 0;
        
        ids.forEach(id => {
            if (this.deleteRecipient(id)) {
                success++;
            } else {
                failed++;
            }
        });
        
        return { success, failed };
    },
    
    /**
     * 搜索记录
     * @param {string} keyword - 搜索关键词
     * @returns {Array} 搜索结果
     */
    searchRecipients(keyword) {
        if (!keyword || !keyword.trim()) {
            return this.getAllRecipients();
        }
        
        const recipients = this.getAllRecipients();
        const lowerKeyword = keyword.toLowerCase().trim();
        
        return recipients.filter(r => {
            // 搜索姓名
            if (r.name && r.name.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            
            // 搜索手机号（包括脱敏的）
            if (r.phone && r.phone.includes(lowerKeyword)) {
                return true;
            }
            
            // 搜索微信号
            if (r.wechat && r.wechat.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            
            // 搜索地址
            if (r.address && r.address.full && r.address.full.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            
            // 搜索ID
            if (r.id && r.id.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            
            return false;
        });
    },
    
    /**
     * 按状态筛选
     * @param {string} status - 状态
     * @returns {Array} 筛选结果
     */
    filterByStatus(status) {
        const recipients = this.getAllRecipients();
        return recipients.filter(r => r.status === status);
    },
    
    /**
     * 按日期范围筛选
     * @param {Date} startDate - 开始日期
     * @param {Date} endDate - 结束日期
     * @returns {Array} 筛选结果
     */
    filterByDateRange(startDate, endDate) {
        const recipients = this.getAllRecipients();
        return recipients.filter(r => {
            const submitDate = new Date(r.submit_time);
            return submitDate >= startDate && submitDate <= endDate;
        });
    },
    
    /**
     * 获取统计数据
     * @returns {Object} 统计数据
     */
    getStatistics() {
        const recipients = this.getAllRecipients();
        const total = recipients.length;
        
        // 按状态统计
        const pending = recipients.filter(r => r.status === this.STATUS.PENDING).length;
        const shipped = recipients.filter(r => r.status === this.STATUS.SHIPPED).length;
        const received = recipients.filter(r => r.status === this.STATUS.RECEIVED).length;
        
        // 今日新增
        const today = recipients.filter(r => Utils.isToday(r.submit_time)).length;
        
        // 本周新增
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeek = recipients.filter(r => new Date(r.submit_time) >= weekAgo).length;
        
        // 本月新增
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const thisMonth = recipients.filter(r => new Date(r.submit_time) >= monthAgo).length;
        
        // 按关系统计
        const relationStats = {};
        recipients.forEach(r => {
            const relation = r.relation_text || '未知';
            relationStats[relation] = (relationStats[relation] || 0) + 1;
        });
        
        // 按省份统计
        const provinceStats = {};
        recipients.forEach(r => {
            const province = r.address?.province || '未知';
            provinceStats[province] = (provinceStats[province] || 0) + 1;
        });
        
        // 按城市统计（top 10）
        const cityStats = {};
        recipients.forEach(r => {
            const city = r.address?.city || '未知';
            cityStats[city] = (cityStats[city] || 0) + 1;
        });
        const topCities = Object.entries(cityStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        return {
            total,
            pending,
            shipped,
            received,
            processed: shipped + received, // 已处理（已发货+已签收）
            today,
            thisWeek,
            thisMonth,
            relationStats,
            provinceStats,
            cityStats: Object.fromEntries(topCities),
            completionRate: total > 0 ? ((shipped + received) / total * 100).toFixed(1) : 0
        };
    },
    
    /**
     * 获取状态文本
     * @param {string} status - 状态值
     * @returns {string} 状态文本
     */
    getStatusText(status) {
        const statusMap = {
            [this.STATUS.PENDING]: '待处理',
            [this.STATUS.SHIPPED]: '已发货',
            [this.STATUS.RECEIVED]: '已签收'
        };
        return statusMap[status] || '未知';
    },
    
    /**
     * 保存到LocalStorage
     * @param {Array} recipients - 记录数组
     * @returns {boolean} 是否保存成功
     */
    saveToStorage(recipients) {
        return Utils.storage.set(this.STORAGE_KEY, recipients);
    },
    
    /**
     * 创建数据备份
     * @param {Array} recipients - 记录数组（可选，不传则备份当前所有数据）
     * @returns {boolean} 是否备份成功
     */
    createBackup(recipients) {
        try {
            const dataToBackup = recipients || this.getAllRecipients();
            const backup = {
                data: dataToBackup,
                backupTime: new Date().toISOString(),
                version: '1.0',
                total: dataToBackup.length
            };
            return Utils.storage.set(this.BACKUP_KEY, backup);
        } catch (error) {
            console.error('Create backup error:', error);
            return false;
        }
    },
    
    /**
     * 从备份恢复数据
     * @returns {boolean} 是否恢复成功
     */
    restoreFromBackup() {
        try {
            const backup = Utils.storage.get(this.BACKUP_KEY);
            if (!backup || !backup.data) {
                console.warn('No backup found');
                return false;
            }
            
            return this.saveToStorage(backup.data);
        } catch (error) {
            console.error('Restore from backup error:', error);
            return false;
        }
    },
    
    /**
     * 清空所有数据
     * @param {boolean} createBackup - 是否在清空前创建备份
     * @returns {boolean} 是否清空成功
     */
    clearAll(createBackup = true) {
        try {
            if (createBackup) {
                this.createBackup();
            }
            
            Utils.storage.remove(this.STORAGE_KEY);
            Utils.storage.remove(CONFIG.STORAGE_KEYS.LAST_SUBMISSION);
            return true;
        } catch (error) {
            console.error('Clear all error:', error);
            return false;
        }
    },
    
    /**
     * 导出为JSON
     * @returns {string} JSON字符串
     */
    exportToJson() {
        const recipients = this.getAllRecipients();
        const data = {
            exportedAt: new Date().toISOString(),
            exportedBy: CONFIG.COUPLE.FULL_NAME,
            version: '1.0',
            total: recipients.length,
            statistics: this.getStatistics(),
            recipients: recipients
        };
        return JSON.stringify(data, null, 2);
    },
    
    /**
     * 导出为CSV（用于Excel）
     * @returns {string} CSV字符串
     */
    exportToCsv() {
        const recipients = this.getAllRecipients();
        
        // CSV 头部
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
        
        // CSV 内容
        const rows = recipients.map((r, index) => [
            index + 1,
            r.id,
            r.name,
            r.phone,
            r.wechat || '-',
            r.relation_text,
            r.address?.province || '-',
            r.address?.city || '-',
            r.address?.district || '-',
            r.address?.detail || '-',
            r.address?.zipcode || '-',
            r.delivery_time || '-',
            r.blessing || '-',
            r.status_text,
            r.submit_time_formatted || Utils.formatDate(r.submit_time),
            r.device_info || '-'
        ]);
        
        // 组合CSV（处理包含逗号和引号的字段）
        const escapeCsvField = (field) => {
            const str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        const csvContent = [
            headers.map(escapeCsvField).join(','),
            ...rows.map(row => row.map(escapeCsvField).join(','))
        ].join('\n');
        
        // 添加BOM以支持Excel中文显示
        return '\uFEFF' + csvContent;
    },
    
    /**
     * 从JSON导入数据
     * @param {string} jsonString - JSON字符串
     * @returns {Object} 导入结果 {success: boolean, message: string, imported: number}
     */
    importFromJson(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.recipients || !Array.isArray(data.recipients)) {
                return {
                    success: false,
                    message: '无效的数据格式',
                    imported: 0
                };
            }
            
            // 备份当前数据
            this.createBackup();
            
            // 获取现有数据
            const existing = this.getAllRecipients();
            
            // 合并数据（避免重复）
            let imported = 0;
            data.recipients.forEach(recipient => {
                const exists = existing.some(r => r.id === recipient.id);
                if (!exists) {
                    existing.push(recipient);
                    imported++;
                }
            });
            
            // 保存
            if (this.saveToStorage(existing)) {
                return {
                    success: true,
                    message: `成功导入 ${imported} 条记录`,
                    imported: imported
                };
            } else {
                return {
                    success: false,
                    message: '保存失败',
                    imported: 0
                };
            }
        } catch (error) {
            console.error('Import from JSON error:', error);
            return {
                success: false,
                message: '导入失败：' + error.message,
                imported: 0
            };
        }
    },
    
    /**
     * 保存最后提交的数据
     * @param {Object} recipient - 记录对象
     */
    saveLastSubmission(recipient) {
        try {
            // 创建一个副本，移除敏感信息
            const lastSubmission = {
                name: recipient.name,
                phone: recipient.phone,
                address: recipient.address,
                message: recipient.blessing,
                submit_time: recipient.submit_time_formatted
            };
            Utils.storage.set(CONFIG.STORAGE_KEYS.LAST_SUBMISSION, lastSubmission);
        } catch (error) {
            console.error('Save last submission error:', error);
        }
    },
    
    /**
     * 获取数据存储大小（字节）
     * @returns {number} 存储大小
     */
    getStorageSize() {
        return Utils.storage.getSize();
    },
    
    /**
     * 获取存储使用率（百分比）
     * @returns {number} 使用率
     */
    getStorageUsage() {
        const size = this.getStorageSize();
        const limit = 5 * 1024 * 1024; // 5MB（大多数浏览器的LocalStorage限制）
        return (size / limit * 100).toFixed(2);
    }
};

// 导出数据管理器对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}

// 在控制台显示数据管理器信息（开发调试用）
console.log('%c💾 Data Manager Loaded', 'color: #4CAF50; font-size: 12px;');

// 初始化时显示统计信息
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        const stats = DataManager.getStatistics();
        console.log(`%c📊 当前记录: ${stats.total} 条 | 今日新增: ${stats.today} 条`, 'color: #2196F3; font-size: 11px;');
    });
}
