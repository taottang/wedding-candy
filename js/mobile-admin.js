// =================================================================
// 移动端管理模块 - Mobile Admin
// 移动端专用管理界面、快捷操作、优化体验
// =================================================================

const MobileAdmin = (() => {
    // 当前视图模式：'table' 或 'card'
    let currentView = 'card';
    
    // 检测是否为移动设备
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * 初始化移动端管理界面
     */
    function init() {
        if (!isMobile()) {
            console.log('Desktop detected, mobile optimization disabled');
            return;
        }
        
        console.log('Mobile detected, initializing mobile admin');
        
        // 添加移动端样式
        addMobileStyles();
        
        // 添加视图切换按钮
        addViewSwitcher();
        
        // 添加快速操作栏
        addQuickActions();
        
        // 默认使用卡片视图
        switchToCardView();
        
        // 优化搜索框
        optimizeSearchBox();
        
        // 添加下拉刷新
        addPullToRefresh();
    }
    
    /**
     * 添加移动端样式
     */
    function addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 移动端优化样式 */
            @media (max-width: 768px) {
                .admin-header {
                    padding: 0.75rem 1rem;
                }
                
                .header-title {
                    font-size: 1.1rem;
                }
                
                .stats-section {
                    padding: 1rem;
                }
                
                .stat-card {
                    padding: 1rem;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                }
                
                .data-section {
                    padding: 0.5rem;
                }
                
                /* 隐藏不必要的列 */
                .data-table th:nth-child(2),
                .data-table td:nth-child(2),
                .data-table th:nth-child(6),
                .data-table td:nth-child(6),
                .data-table th:nth-child(7),
                .data-table td:nth-child(7) {
                    display: none;
                }
                
                /* 优化操作按钮 */
                .action-buttons {
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .btn-small {
                    font-size: 0.75rem;
                    padding: 0.3rem 0.6rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 添加视图切换按钮
     */
    function addViewSwitcher() {
        const toolbar = document.querySelector('.toolbar-right');
        if (!toolbar) return;
        
        const switcher = document.createElement('div');
        switcher.className = 'view-switcher';
        switcher.innerHTML = `
            <button class="btn btn-secondary btn-small" onclick="MobileAdmin.toggleView()" id="viewSwitcherBtn">
                <span id="viewIcon">📇</span>
                <span id="viewText">卡片视图</span>
            </button>
        `;
        
        toolbar.insertBefore(switcher, toolbar.firstChild);
    }
    
    /**
     * 切换视图
     */
    function toggleView() {
        if (currentView === 'table') {
            switchToCardView();
        } else {
            switchToTableView();
        }
    }
    
    /**
     * 切换到卡片视图
     */
    function switchToCardView() {
        currentView = 'card';
        
        // 更新按钮
        const icon = document.getElementById('viewIcon');
        const text = document.getElementById('viewText');
        if (icon) icon.textContent = '📊';
        if (text) text.textContent = '表格视图';
        
        // 隐藏表格，显示卡片
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) tableContainer.style.display = 'none';
        
        // 创建或显示卡片容器
        let cardContainer = document.getElementById('cardContainer');
        if (!cardContainer) {
            cardContainer = document.createElement('div');
            cardContainer.id = 'cardContainer';
            cardContainer.className = 'card-container';
            tableContainer.parentNode.insertBefore(cardContainer, tableContainer);
        }
        cardContainer.style.display = 'block';
        
        // 渲染卡片
        renderCards();
    }
    
    /**
     * 切换到表格视图
     */
    function switchToTableView() {
        currentView = 'table';
        
        // 更新按钮
        const icon = document.getElementById('viewIcon');
        const text = document.getElementById('viewText');
        if (icon) icon.textContent = '📇';
        if (text) text.textContent = '卡片视图';
        
        // 显示表格，隐藏卡片
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) tableContainer.style.display = 'block';
        
        const cardContainer = document.getElementById('cardContainer');
        if (cardContainer) cardContainer.style.display = 'none';
    }
    
    /**
     * 渲染卡片
     */
    function renderCards() {
        const cardContainer = document.getElementById('cardContainer');
        if (!cardContainer) return;
        
        // 获取当前筛选后的数据
        const data = window.filteredData || [];
        
        if (data.length === 0) {
            cardContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无数据</div>
                </div>
            `;
            return;
        }
        
        // 分页处理
        const pageSize = window.pageSize || 20;
        const currentPage = window.currentPage || 1;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = data.slice(start, end);
        
        // 生成卡片HTML
        const cardsHtml = pageData.map(item => generateCardHtml(item)).join('');
        cardContainer.innerHTML = cardsHtml;
    }
    
    /**
     * 生成单个卡片HTML
     */
    function generateCardHtml(item) {
        const statusClass = item.status || 'pending';
        const statusText = item.status_text || '待发货';
        const isSelected = window.selectedIds && window.selectedIds.has(item.id);
        
        return `
        <div class="data-card ${isSelected ? 'selected' : ''}" data-id="${item.id}">
            <div class="card-header">
                <div class="card-checkbox">
                    <input type="checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="handleSelectRow('${item.id}')"
                           onclick="event.stopPropagation()">
                </div>
                <div class="card-name">${Utils.escapeHtml(item.name)}</div>
                <div class="card-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-info-row">
                    <span class="card-label">📱 手机</span>
                    <span class="card-value">
                        ${item.phone}
                        <button class="card-action-btn" onclick="MobileAdmin.copyPhone('${item.phone}')" title="复制">
                            📋
                        </button>
                        <a href="tel:${item.phone}" class="card-action-btn" title="拨打">
                            📞
                        </a>
                    </span>
                </div>
                
                <div class="card-info-row">
                    <span class="card-label">💬 微信</span>
                    <span class="card-value">${Utils.escapeHtml(item.wechat || '-')}</span>
                </div>
                
                <div class="card-info-row">
                    <span class="card-label">📍 地址</span>
                    <span class="card-value card-address">
                        ${item.address?.province || ''} 
                        ${item.address?.city || ''} 
                        ${item.address?.district || ''}
                        <br>
                        ${Utils.escapeHtml(item.address?.detail || '')}
                    </span>
                </div>
                
                <div class="card-info-row">
                    <span class="card-label">⏰ 时间</span>
                    <span class="card-value">${Utils.formatDate(item.submit_time, 'MM-DD HH:mm')}</span>
                </div>
            </div>
            
            <div class="card-actions">
                <button class="btn btn-info btn-small" onclick="showDetail('${item.id}')">
                    详情
                </button>
                ${statusClass === 'pending' ? `
                <button class="btn btn-success btn-small" onclick="MobileAdmin.quickMarkShipped('${item.id}')">
                    标记已发货
                </button>
                ` : ''}
                <button class="btn btn-secondary btn-small" onclick="MobileAdmin.shareContact('${item.id}')">
                    分享
                </button>
            </div>
        </div>
        `;
    }
    
    /**
     * 添加快速操作栏
     */
    function addQuickActions() {
        const batchActions = document.getElementById('batchActions');
        if (!batchActions) return;
        
        // 添加移动端专用批量操作按钮
        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-batch-actions';
        mobileActions.innerHTML = `
            <button class="btn btn-success btn-small" onclick="MobileAdmin.batchMarkShipped()">
                ✅ 批量发货
            </button>
            <button class="btn btn-info btn-small" onclick="MobileAdmin.exportSelectedMobile()">
                📤 导出选中
            </button>
        `;
        
        batchActions.querySelector('.batch-buttons').appendChild(mobileActions);
    }
    
    /**
     * 优化搜索框
     */
    function optimizeSearchBox() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        // 添加清除按钮
        const wrapper = searchInput.parentElement;
        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear-btn';
        clearBtn.innerHTML = '×';
        clearBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #999;
            cursor: pointer;
            display: none;
        `;
        
        clearBtn.onclick = () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            if (typeof applyFilters === 'function') {
                applyFilters();
            }
        };
        
        wrapper.style.position = 'relative';
        wrapper.appendChild(clearBtn);
        
        // 显示/隐藏清除按钮
        searchInput.addEventListener('input', () => {
            clearBtn.style.display = searchInput.value ? 'block' : 'none';
        });
    }
    
    /**
     * 添加下拉刷新
     */
    function addPullToRefresh() {
        let startY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const currentY = e.touches[0].pageY;
            const diff = currentY - startY;
            
            if (diff > 100) {
                // 触发刷新
                isPulling = false;
                refreshData();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            isPulling = false;
        });
    }
    
    /**
     * 刷新数据
     */
    function refreshData() {
        Utils.toast('正在刷新...', 'info');
        
        setTimeout(() => {
            if (typeof loadDashboard === 'function') {
                loadDashboard();
            }
            Utils.toast('刷新完成', 'success');
        }, 500);
    }
    
    /**
     * 复制手机号
     */
    async function copyPhone(phone) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(phone);
            } else {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = phone;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            
            Utils.toast(`✅ 已复制：${phone}`, 'success');
        } catch (error) {
            console.error('Copy phone error:', error);
            Utils.toast('复制失败', 'error');
        }
    }
    
    /**
     * 快速标记为已发货
     */
    function quickMarkShipped(id) {
        if (!confirm('确定标记为已发货吗？')) return;
        
        try {
            DataManager.updateStatus(id, 'shipped');
            Utils.toast('✅ 已标记为已发货', 'success');
            
            // 刷新显示
            if (currentView === 'card') {
                renderCards();
            } else {
                if (typeof renderTable === 'function') {
                    renderTable();
                }
            }
        } catch (error) {
            console.error('Quick mark shipped error:', error);
            Utils.toast('操作失败', 'error');
        }
    }
    
    /**
     * 批量标记为已发货
     */
    function batchMarkShipped() {
        const selectedIds = window.selectedIds;
        if (!selectedIds || selectedIds.size === 0) {
            Utils.toast('请先选择要操作的记录', 'warning');
            return;
        }
        
        if (!confirm(`确定将 ${selectedIds.size} 条记录标记为已发货吗？`)) return;
        
        try {
            let success = 0;
            selectedIds.forEach(id => {
                try {
                    DataManager.updateStatus(id, 'shipped');
                    success++;
                } catch (error) {
                    console.error('Mark shipped error:', id, error);
                }
            });
            
            Utils.toast(`✅ 已标记 ${success} 条记录为已发货`, 'success');
            
            // 清空选择
            selectedIds.clear();
            
            // 刷新显示
            refreshData();
        } catch (error) {
            console.error('Batch mark shipped error:', error);
            Utils.toast('批量操作失败', 'error');
        }
    }
    
    /**
     * 分享联系人信息
     */
    async function shareContact(id) {
        try {
            const item = window.allData.find(d => d.id === id);
            if (!item) return;
            
            const text = `
【喜糖领取信息】
姓名：${item.name}
手机：${item.phone}
微信：${item.wechat || '-'}
地址：${[item.address?.province, item.address?.city, item.address?.district, item.address?.detail].filter(Boolean).join('')}
状态：${item.status_text}
时间：${Utils.formatDate(item.submit_time)}
            `.trim();
            
            // 尝试使用 Web Share API
            if (navigator.share) {
                await navigator.share({
                    title: '喜糖领取信息',
                    text: text
                });
                Utils.toast('分享成功', 'success');
            } else {
                // 降级：复制到剪贴板
                await copyToClipboard(text);
                Utils.toast('信息已复制到剪贴板', 'success');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share contact error:', error);
                Utils.toast('分享失败', 'error');
            }
        }
    }
    
    /**
     * 复制到剪贴板
     */
    async function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
    
    /**
     * 导出选中（移动端优化）
     */
    async function exportSelectedMobile() {
        const selectedIds = window.selectedIds;
        if (!selectedIds || selectedIds.size === 0) {
            Utils.toast('请先选择要导出的记录', 'warning');
            return;
        }
        
        const selectedData = window.allData.filter(item => selectedIds.has(item.id));
        
        // 显示导出选项
        const options = [
            { label: '📊 Excel格式', value: 'excel' },
            { label: '📄 CSV格式', value: 'csv' },
            { label: '📋 复制文本', value: 'clipboard' }
        ];
        
        const choice = await showMobileMenu('选择导出格式', options);
        
        if (!choice) return;
        
        try {
            if (choice === 'excel') {
                await ExportManager.exportExcel(selectedData, { filename: '喜糖领取记录_选中' });
            } else if (choice === 'csv') {
                await ExportManager.exportCSV(selectedData, { filename: '喜糖领取记录_选中' });
            } else if (choice === 'clipboard') {
                await ExportManager.copyToClipboard(selectedData);
            }
        } catch (error) {
            console.error('Export selected mobile error:', error);
            Utils.toast('导出失败', 'error');
        }
    }
    
    /**
     * 显示移动端菜单
     */
    function showMobileMenu(title, options) {
        return new Promise((resolve) => {
            // 创建遮罩
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                align-items: flex-end;
            `;
            
            // 创建菜单
            const menu = document.createElement('div');
            menu.className = 'mobile-menu';
            menu.style.cssText = `
                background: white;
                width: 100%;
                border-radius: 20px 20px 0 0;
                padding: 1.5rem;
                animation: slideUp 0.3s ease;
            `;
            
            menu.innerHTML = `
                <style>
                    @keyframes slideUp {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                </style>
                <h3 style="margin: 0 0 1rem 0; text-align: center; color: #333;">${title}</h3>
                <div class="mobile-menu-options">
                    ${options.map(opt => `
                        <button class="mobile-menu-option" data-value="${opt.value}" style="
                            width: 100%;
                            padding: 1rem;
                            margin-bottom: 0.5rem;
                            background: #F8F9FA;
                            border: none;
                            border-radius: 10px;
                            font-size: 1rem;
                            text-align: left;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            ${opt.label}
                        </button>
                    `).join('')}
                </div>
                <button class="mobile-menu-cancel" style="
                    width: 100%;
                    padding: 1rem;
                    margin-top: 0.5rem;
                    background: white;
                    border: 1px solid #E0E0E0;
                    border-radius: 10px;
                    font-size: 1rem;
                    cursor: pointer;
                ">
                    取消
                </button>
            `;
            
            overlay.appendChild(menu);
            document.body.appendChild(overlay);
            
            // 添加事件监听
            menu.querySelectorAll('.mobile-menu-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.dataset.value;
                    document.body.removeChild(overlay);
                    resolve(value);
                });
                
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = '#667eea';
                    btn.style.color = 'white';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = '#F8F9FA';
                    btn.style.color = '#333';
                });
            });
            
            menu.querySelector('.mobile-menu-cancel').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(null);
                }
            });
        });
    }
    
    /**
     * 更新卡片视图（当数据变化时调用）
     */
    function updateCardView() {
        if (currentView === 'card') {
            renderCards();
        }
    }
    
    // 返回公共API
    return {
        // 初始化
        init,
        isMobile,
        
        // 视图切换
        toggleView,
        switchToCardView,
        switchToTableView,
        updateCardView,
        
        // 快捷操作
        copyPhone,
        quickMarkShipped,
        batchMarkShipped,
        shareContact,
        exportSelectedMobile,
        
        // 工具
        refreshData,
        showMobileMenu
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.MobileAdmin = MobileAdmin;
}

console.log('%c📱 Mobile Admin Loaded', 'color: #4CAF50; font-size: 12px; font-weight: bold;');

// 页面加载后自动初始化
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // 延迟初始化，确保其他模块已加载
        setTimeout(() => {
            if (typeof MobileAdmin !== 'undefined') {
                MobileAdmin.init();
            }
        }, 1000);
    });
}
