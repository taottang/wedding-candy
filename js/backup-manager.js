// =================================================================
// 备份管理器 - Backup Manager
// 自动备份、手动备份、数据恢复、清空数据
// =================================================================

const BackupManager = (() => {
    // 配置
    const AUTO_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24小时
    const BACKUP_REMINDER_THRESHOLD = 100; // 数据超过100条提醒
    const LAST_BACKUP_KEY = 'wedding_last_backup_time';
    const BACKUP_REMINDER_KEY = 'wedding_backup_reminder_shown';
    
    /**
     * 备份所有数据到JSON文件
     */
    function backupData() {
        try {
            // 获取所有数据
            const recipients = DataManager.getAllRecipients() || [];
            
            // 构建备份数据
            const backupData = {
                version: '1.0',
                backupTime: new Date().toISOString(),
                backupBy: '管理员',
                systemInfo: {
                    totalRecords: recipients.length,
                    dataKeys: Object.keys(localStorage).filter(k => k.startsWith('wedding_'))
                },
                data: {
                    recipients: recipients,
                    config: getConfigData(),
                    statistics: getStatisticsSnapshot()
                }
            };
            
            // 生成文件名
            const timestamp = Utils.formatDate(new Date(), 'YYYYMMDD_HHmmss');
            const filename = `婚礼喜糖数据备份_${timestamp}.json`;
            
            // 导出JSON
            const jsonStr = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            downloadBlob(blob, filename);
            
            // 更新最后备份时间
            localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
            
            Utils.toast(`✅ 数据备份成功！共 ${recipients.length} 条记录`, 'success');
            
            console.log('Backup created:', filename, backupData);
            return { success: true, filename, recordCount: recipients.length };
            
        } catch (error) {
            console.error('Backup error:', error);
            Utils.toast('❌ 备份失败: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }
    
    /**
     * 从JSON文件恢复数据
     */
    function restoreData() {
        return new Promise((resolve, reject) => {
            try {
                // 创建文件选择器
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) {
                        reject(new Error('未选择文件'));
                        return;
                    }
                    
                    try {
                        // 读取文件
                        const text = await file.text();
                        const backupData = JSON.parse(text);
                        
                        // 验证数据格式
                        if (!backupData.data || !backupData.data.recipients) {
                            throw new Error('备份文件格式不正确');
                        }
                        
                        // 确认恢复
                        const currentCount = DataManager.getAllRecipients().length;
                        const backupCount = backupData.data.recipients.length;
                        
                        const confirmed = confirm(
                            `确定要恢复数据吗？\n\n` +
                            `当前数据：${currentCount} 条\n` +
                            `备份数据：${backupCount} 条\n` +
                            `备份时间：${Utils.formatDate(backupData.backupTime)}\n\n` +
                            `⚠️ 恢复后将覆盖当前所有数据！`
                        );
                        
                        if (!confirmed) {
                            Utils.toast('已取消恢复', 'info');
                            resolve({ success: false, cancelled: true });
                            return;
                        }
                        
                        // 恢复数据
                        const restored = restoreFromBackup(backupData);
                        
                        Utils.toast(`✅ 数据恢复成功！共 ${restored} 条记录`, 'success');
                        
                        // 刷新页面
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                        
                        resolve({ success: true, recordCount: restored });
                        
                    } catch (error) {
                        console.error('Restore error:', error);
                        Utils.toast('❌ 恢复失败: ' + error.message, 'error');
                        reject(error);
                    }
                };
                
                // 触发文件选择
                input.click();
                
            } catch (error) {
                console.error('Restore data error:', error);
                reject(error);
            }
        });
    }
    
    /**
     * 从备份数据恢复
     */
    function restoreFromBackup(backupData) {
        try {
            const recipients = backupData.data.recipients;
            
            // 清空现有数据
            localStorage.removeItem(DataManager.STORAGE_KEY);
            
            // 恢复每条记录
            let restored = 0;
            recipients.forEach(recipient => {
                try {
                    DataManager.saveRecipient(recipient);
                    restored++;
                } catch (error) {
                    console.error('Restore recipient error:', recipient.id, error);
                }
            });
            
            console.log(`Restored ${restored} of ${recipients.length} records`);
            return restored;
            
        } catch (error) {
            console.error('Restore from backup error:', error);
            throw error;
        }
    }
    
    /**
     * 清空所有数据（需密码确认）
     */
    function clearAllData() {
        return new Promise((resolve, reject) => {
            try {
                const currentCount = DataManager.getAllRecipients().length;
                
                // 第一次确认
                const confirmed1 = confirm(
                    `⚠️ 警告：即将清空所有数据！\n\n` +
                    `当前共有 ${currentCount} 条记录\n\n` +
                    `此操作不可恢复，确定要继续吗？`
                );
                
                if (!confirmed1) {
                    Utils.toast('已取消清空', 'info');
                    resolve({ success: false, cancelled: true });
                    return;
                }
                
                // 密码确认
                const password = prompt('请输入管理员密码以确认清空操作：');
                
                if (!password) {
                    Utils.toast('已取消清空', 'info');
                    resolve({ success: false, cancelled: true });
                    return;
                }
                
                // 验证密码
                if (!AdminAuth.verifyPassword(password)) {
                    Utils.toast('❌ 密码错误', 'error');
                    resolve({ success: false, error: 'Invalid password' });
                    return;
                }
                
                // 第二次确认
                const confirmed2 = confirm(
                    `⚠️⚠️⚠️ 最后确认 ⚠️⚠️⚠️\n\n` +
                    `确定要清空 ${currentCount} 条数据吗？\n\n` +
                    `建议先备份数据！`
                );
                
                if (!confirmed2) {
                    Utils.toast('已取消清空', 'info');
                    resolve({ success: false, cancelled: true });
                    return;
                }
                
                // 清空数据
                const cleared = clearData();
                
                Utils.toast(`✅ 已清空 ${cleared} 条记录`, 'success');
                
                // 刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
                resolve({ success: true, clearedCount: cleared });
                
            } catch (error) {
                console.error('Clear all data error:', error);
                Utils.toast('❌ 清空失败: ' + error.message, 'error');
                reject(error);
            }
        });
    }
    
    /**
     * 执行数据清空
     */
    function clearData() {
        try {
            const recipients = DataManager.getAllRecipients();
            const count = recipients.length;
            
            // 清空数据
            localStorage.removeItem(DataManager.STORAGE_KEY);
            
            // 清空其他相关数据
            localStorage.removeItem(LAST_BACKUP_KEY);
            localStorage.removeItem(BACKUP_REMINDER_KEY);
            
            console.log(`Cleared ${count} records`);
            return count;
            
        } catch (error) {
            console.error('Clear data error:', error);
            throw error;
        }
    }
    
    /**
     * 自动备份检查
     */
    function checkAutoBackup() {
        try {
            const lastBackupTime = localStorage.getItem(LAST_BACKUP_KEY);
            const now = new Date().getTime();
            
            if (!lastBackupTime) {
                // 首次使用，记录当前时间
                localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
                return { needBackup: false, reason: 'First time' };
            }
            
            const lastBackup = new Date(lastBackupTime).getTime();
            const timeSinceBackup = now - lastBackup;
            
            // 检查是否超过24小时
            if (timeSinceBackup >= AUTO_BACKUP_INTERVAL) {
                return { 
                    needBackup: true, 
                    reason: 'Auto backup interval',
                    lastBackupTime: lastBackupTime,
                    hoursSince: Math.floor(timeSinceBackup / (60 * 60 * 1000))
                };
            }
            
            return { needBackup: false, hoursSince: Math.floor(timeSinceBackup / (60 * 60 * 1000)) };
            
        } catch (error) {
            console.error('Check auto backup error:', error);
            return { needBackup: false, error: error.message };
        }
    }
    
    /**
     * 数据量备份提醒
     */
    function checkBackupReminder() {
        try {
            const recipients = DataManager.getAllRecipients();
            const count = recipients.length;
            
            // 检查是否超过阈值
            if (count < BACKUP_REMINDER_THRESHOLD) {
                return { needReminder: false, count };
            }
            
            // 检查是否已提醒过
            const reminderShown = localStorage.getItem(BACKUP_REMINDER_KEY);
            if (reminderShown) {
                const lastCount = parseInt(reminderShown);
                // 如果数据量增加了50条以上，再次提醒
                if (count - lastCount < 50) {
                    return { needReminder: false, count, lastReminder: lastCount };
                }
            }
            
            return { 
                needReminder: true, 
                count, 
                threshold: BACKUP_REMINDER_THRESHOLD 
            };
            
        } catch (error) {
            console.error('Check backup reminder error:', error);
            return { needReminder: false, error: error.message };
        }
    }
    
    /**
     * 标记备份提醒已显示
     */
    function markReminderShown() {
        try {
            const count = DataManager.getAllRecipients().length;
            localStorage.setItem(BACKUP_REMINDER_KEY, count.toString());
        } catch (error) {
            console.error('Mark reminder shown error:', error);
        }
    }
    
    /**
     * 显示备份提醒
     */
    function showBackupReminder() {
        const reminder = checkBackupReminder();
        
        if (reminder.needReminder) {
            setTimeout(() => {
                const confirmed = confirm(
                    `💾 备份提醒\n\n` +
                    `当前已有 ${reminder.count} 条数据\n` +
                    `建议及时备份以防数据丢失\n\n` +
                    `是否立即备份？`
                );
                
                if (confirmed) {
                    backupData();
                }
                
                markReminderShown();
            }, 2000);
        }
    }
    
    /**
     * 获取配置数据
     */
    function getConfigData() {
        try {
            return {
                siteName: CONFIG.SITE_NAME,
                couple: CONFIG.COUPLE,
                exportHistory: localStorage.getItem('wedding_export_history')
            };
        } catch (error) {
            console.error('Get config data error:', error);
            return {};
        }
    }
    
    /**
     * 获取统计快照
     */
    function getStatisticsSnapshot() {
        try {
            const stats = DataManager.getStatistics();
            return {
                total: stats.total,
                byStatus: stats.byStatus,
                byRelation: stats.byRelation,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Get statistics snapshot error:', error);
            return {};
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
    
    /**
     * 获取备份信息
     */
    function getBackupInfo() {
        try {
            const lastBackupTime = localStorage.getItem(LAST_BACKUP_KEY);
            const recipients = DataManager.getAllRecipients();
            const autoBackup = checkAutoBackup();
            const reminder = checkBackupReminder();
            
            return {
                lastBackupTime: lastBackupTime,
                lastBackupFormatted: lastBackupTime ? Utils.formatDate(lastBackupTime) : '从未备份',
                currentRecordCount: recipients.length,
                autoBackup: autoBackup,
                reminder: reminder,
                needBackup: autoBackup.needBackup || reminder.needReminder
            };
        } catch (error) {
            console.error('Get backup info error:', error);
            return {
                lastBackupTime: null,
                lastBackupFormatted: '未知',
                currentRecordCount: 0,
                error: error.message
            };
        }
    }
    
    // 返回公共API
    return {
        // 核心功能
        backupData,
        restoreData,
        clearAllData,
        
        // 自动备份
        checkAutoBackup,
        checkBackupReminder,
        showBackupReminder,
        markReminderShown,
        
        // 信息查询
        getBackupInfo,
        
        // 配置
        AUTO_BACKUP_INTERVAL,
        BACKUP_REMINDER_THRESHOLD
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.BackupManager = BackupManager;
}

console.log('%c💾 Backup Manager Loaded', 'color: #4CAF50; font-size: 12px; font-weight: bold;');

// 页面加载后检查备份提醒
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (typeof BackupManager !== 'undefined') {
                BackupManager.showBackupReminder();
            }
        }, 3000);
    });
}
