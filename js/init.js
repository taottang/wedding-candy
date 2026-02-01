// =================================================================
// 初始化脚本 - Init.js
// 根据当前页面初始化相应功能
// =================================================================

(function() {
    'use strict';
    
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        
        // 根据页面初始化
        if (page === 'form.html') {
            initFormPage();
        } else if (page === 'admin.html') {
            initAdminPage();
        } else if (page === 'index.html' || page === '') {
            initIndexPage();
        }
    });
    
    /**
     * 初始化首页
     */
    function initIndexPage() {
        console.log('Wedding Candy System - Index Page Loaded');
        
        // 添加滚动动画
        const observeElements = document.querySelectorAll('.slide-up, .fade-in');
        if (observeElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observeElements.forEach(el => observer.observe(el));
        }
    }
    
    /**
     * 初始化表单页面
     */
    function initFormPage() {
        console.log('Wedding Candy System - Form Page Loaded');
        
        const form = document.getElementById('candyForm');
        if (!form) return;
        
        // 加载省市区数据
        loadRegionData();
        
        // 字符计数
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', function() {
                charCount.textContent = this.value.length;
            });
        }
        
        // 实时验证
        setupFormValidation(form);
        
        // 表单提交
        form.addEventListener('submit', handleFormSubmit);
    }
    
    /**
     * 加载省市区数据
     */
    function loadRegionData() {
        const provinceSelect = document.getElementById('province');
        const citySelect = document.getElementById('city');
        const districtSelect = document.getElementById('district');
        
        if (!provinceSelect || !citySelect || !districtSelect) return;
        
        // 加载区域数据
        fetch('data/recipients.json')
            .then(response => response.json())
            .then(data => {
                const regions = data.regions || [];
                
                // 填充省份
                regions.forEach(province => {
                    const option = document.createElement('option');
                    option.value = province.name;
                    option.textContent = province.name;
                    provinceSelect.appendChild(option);
                });
                
                // 省份变化事件
                provinceSelect.addEventListener('change', function() {
                    const selectedProvince = regions.find(p => p.name === this.value);
                    
                    // 重置城市和区县
                    citySelect.innerHTML = '<option value="">请选择城市</option>';
                    districtSelect.innerHTML = '<option value="">请先选择城市</option>';
                    districtSelect.disabled = true;
                    
                    if (selectedProvince && selectedProvince.cities) {
                        citySelect.disabled = false;
                        selectedProvince.cities.forEach(city => {
                            const option = document.createElement('option');
                            option.value = city.name;
                            option.textContent = city.name;
                            citySelect.appendChild(option);
                        });
                    } else {
                        citySelect.disabled = true;
                    }
                });
                
                // 城市变化事件
                citySelect.addEventListener('change', function() {
                    const selectedProvince = regions.find(p => p.name === provinceSelect.value);
                    if (!selectedProvince) return;
                    
                    const selectedCity = selectedProvince.cities.find(c => c.name === this.value);
                    
                    // 重置区县
                    districtSelect.innerHTML = '<option value="">请选择区县</option>';
                    
                    if (selectedCity && selectedCity.districts) {
                        districtSelect.disabled = false;
                        selectedCity.districts.forEach(district => {
                            const option = document.createElement('option');
                            option.value = district;
                            option.textContent = district;
                            districtSelect.appendChild(option);
                        });
                    } else {
                        districtSelect.disabled = true;
                    }
                });
            })
            .catch(error => {
                console.error('Load region data error:', error);
                Utils.toast('加载地区数据失败', 'error');
            });
    }
    
    /**
     * 设置表单验证
     */
    function setupFormValidation(form) {
        const fields = {
            name: document.getElementById('name'),
            phone: document.getElementById('phone'),
            province: document.getElementById('province'),
            city: document.getElementById('city'),
            district: document.getElementById('district'),
            address: document.getElementById('address'),
            message: document.getElementById('message'),
            privacy: document.getElementById('privacy')
        };
        
        // 为每个字段添加失焦验证
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field) {
                field.addEventListener('blur', function() {
                    if (this.value || fieldName === 'privacy') {
                        FormValidator.validateField(this, fieldName);
                    }
                });
            }
        });
    }
    
    /**
     * 处理表单提交
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.btn-submit');
        
        // 收集表单数据
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            district: document.getElementById('district').value,
            address: document.getElementById('address').value,
            message: document.getElementById('message').value,
            privacy: document.getElementById('privacy').checked
        };
        
        // 验证表单
        const validation = FormValidator.validateForm(formData);
        
        if (!validation.valid) {
            // 显示错误
            Object.keys(validation.errors).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field) {
                    FormValidator.showError(field, validation.errors[fieldName]);
                }
            });
            
            // 滚动到第一个错误字段
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            
            Utils.toast('请检查表单填写', 'error');
            return;
        }
        
        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // 模拟提交延迟
        setTimeout(() => {
            // 保存数据
            const result = DataManager.addRecipient(validation.data);
            
            if (result.success) {
                Utils.toast('提交成功！', 'success');
                
                // 跳转到成功页面
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 500);
            } else {
                Utils.toast(result.message, 'error');
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }, 800);
    }
    
    /**
     * 初始化管理页面
     */
    function initAdminPage() {
        console.log('Wedding Candy System - Admin Page Loaded');
        
        const loginPage = document.getElementById('loginPage');
        const adminPage = document.getElementById('adminPage');
        const loginForm = document.getElementById('loginForm');
        
        // 检查登录状态
        if (AdminAuth.isAuthenticated()) {
            showAdminPanel();
        } else {
            showLoginPanel();
        }
        
        // 登录表单提交
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const errorElement = document.getElementById('loginError');
                
                const result = AdminAuth.login(username, password);
                
                if (result.success) {
                    Utils.toast('登录成功', 'success');
                    showAdminPanel();
                } else {
                    errorElement.textContent = result.message;
                    Utils.toast(result.message, 'error');
                }
            });
        }
        
        // 登出按钮
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (Utils.confirm('确定要退出登录吗？')) {
                    AdminAuth.logout();
                    Utils.toast('已退出登录', 'info');
                    showLoginPanel();
                }
            });
        }
        
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(function() {
                renderDataTable(DataManager.searchRecipients(this.value));
            }, 300));
        }
        
        // 导出按钮
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => ExportUtils.exportToExcel());
        }
        
        const exportJsonBtn = document.getElementById('exportJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => ExportUtils.exportToJson());
        }
        
        // 清空数据按钮
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', function() {
                if (Utils.confirm('确定要清空所有数据吗？此操作不可恢复！')) {
                    if (DataManager.clearAllData()) {
                        Utils.toast('数据已清空', 'success');
                        updateStatistics();
                        renderDataTable([]);
                    } else {
                        Utils.toast('清空失败', 'error');
                    }
                }
            });
        }
        
        // 模态框关闭
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('detailModal');
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.classList.remove('show');
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }
    }
    
    /**
     * 显示登录面板
     */
    function showLoginPanel() {
        const loginPage = document.getElementById('loginPage');
        const adminPage = document.getElementById('adminPage');
        
        if (loginPage) loginPage.style.display = 'flex';
        if (adminPage) adminPage.style.display = 'none';
    }
    
    /**
     * 显示管理面板
     */
    function showAdminPanel() {
        const loginPage = document.getElementById('loginPage');
        const adminPage = document.getElementById('adminPage');
        
        if (loginPage) loginPage.style.display = 'none';
        if (adminPage) adminPage.style.display = 'block';
        
        // 加载数据
        updateStatistics();
        renderDataTable(DataManager.getRecipients());
    }
    
    /**
     * 更新统计数据
     */
    function updateStatistics() {
        const stats = DataManager.getStatistics();
        
        const elements = {
            totalCount: document.getElementById('totalCount'),
            processedCount: document.getElementById('processedCount'),
            pendingCount: document.getElementById('pendingCount'),
            todayCount: document.getElementById('todayCount')
        };
        
        if (elements.totalCount) elements.totalCount.textContent = stats.total;
        if (elements.processedCount) elements.processedCount.textContent = stats.processed;
        if (elements.pendingCount) elements.pendingCount.textContent = stats.pending;
        if (elements.todayCount) elements.todayCount.textContent = stats.today;
    }
    
    /**
     * 渲染数据表格
     */
    function renderDataTable(recipients) {
        const tbody = document.getElementById('dataTableBody');
        if (!tbody) return;
        
        if (recipients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-message">暂无数据</td></tr>';
            return;
        }
        
        tbody.innerHTML = recipients.map((r, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${Utils.escapeHtml(r.name)}</td>
                <td>${Utils.escapeHtml(r.phone)}</td>
                <td>${Utils.escapeHtml(Utils.truncate(r.fullAddress, 30))}</td>
                <td>${Utils.escapeHtml(Utils.truncate(r.message || '-', 20))}</td>
                <td>${Utils.formatDate(r.createdAt, 'YYYY-MM-DD HH:mm')}</td>
                <td>
                    <span class="status-badge ${r.status}">
                        ${r.status === CONFIG.STATUS.PENDING.value ? '待处理' : '已处理'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewDetail('${r.id}')">查看</button>
                        <button class="action-btn toggle" onclick="toggleStatus('${r.id}')">
                            ${r.status === CONFIG.STATUS.PENDING.value ? '标记处理' : '标记待处理'}
                        </button>
                        <button class="action-btn delete" onclick="deleteRecipient('${r.id}')">删除</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    /**
     * 查看详情
     */
    window.viewDetail = function(id) {
        const recipient = DataManager.getRecipientById(id);
        if (!recipient) {
            Utils.toast('记录不存在', 'error');
            return;
        }
        
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = `
            <div class="modal-detail-item">
                <div class="modal-detail-label">姓名</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.name)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">手机号</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.phone)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">省份</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.province)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">城市</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.city)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">区县</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.district)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">详细地址</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.address)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">完整地址</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.fullAddress)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">留言</div>
                <div class="modal-detail-value">${Utils.escapeHtml(recipient.message || '-')}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">状态</div>
                <div class="modal-detail-value">
                    <span class="status-badge ${recipient.status}">
                        ${recipient.status === CONFIG.STATUS.PENDING.value ? '待处理' : '已处理'}
                    </span>
                </div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">提交时间</div>
                <div class="modal-detail-value">${Utils.formatDate(recipient.createdAt)}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">更新时间</div>
                <div class="modal-detail-value">${Utils.formatDate(recipient.updatedAt)}</div>
            </div>
        `;
        
        modal.classList.add('show');
    };
    
    /**
     * 切换状态
     */
    window.toggleStatus = function(id) {
        if (DataManager.toggleStatus(id)) {
            Utils.toast('状态已更新', 'success');
            updateStatistics();
            
            const searchInput = document.getElementById('searchInput');
            const keyword = searchInput ? searchInput.value : '';
            renderDataTable(DataManager.searchRecipients(keyword));
        } else {
            Utils.toast('状态更新失败', 'error');
        }
    };
    
    /**
     * 删除记录
     */
    window.deleteRecipient = function(id) {
        if (Utils.confirm('确定要删除这条记录吗？')) {
            if (DataManager.deleteRecipient(id)) {
                Utils.toast('删除成功', 'success');
                updateStatistics();
                
                const searchInput = document.getElementById('searchInput');
                const keyword = searchInput ? searchInput.value : '';
                renderDataTable(DataManager.searchRecipients(keyword));
            } else {
                Utils.toast('删除失败', 'error');
            }
        }
    };
    
})();
