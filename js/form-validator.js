// =================================================================
// 表单验证器 - Form Validator
// 提供完整的表单验证功能
// =================================================================

const FormValidator = {
    // ==================== 验证规则配置 ====================
    rules: {
        // 姓名验证规则
        name: {
            pattern: /^[\u4e00-\u9fa5a-zA-Z·\s]{2,20}$/,
            minLength: 2,
            maxLength: 20,
            required: true,
            messages: {
                required: '请输入姓名',
                pattern: '姓名只能包含中文、英文、间隔号(·)和空格',
                minLength: '姓名至少需要2个字符',
                maxLength: '姓名不能超过20个字符',
                invalid: '姓名格式不正确'
            }
        },
        
        // 关系验证规则
        relationship: {
            required: true,
            messages: {
                required: '请选择您与新人的关系',
                invalid: '请选择有效的关系'
            }
        },
        
        // 手机号验证规则
        phone: {
            pattern: /^1[3-9]\d{9}$/,
            length: 11,
            required: true,
            messages: {
                required: '请输入手机号码',
                pattern: '请输入正确的11位手机号码',
                length: '手机号码应为11位数字',
                invalid: '手机号码格式不正确'
            }
        },
        
        // 微信号验证规则
        wechat: {
            pattern: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,
            minLength: 6,
            maxLength: 20,
            required: true,
            messages: {
                required: '请输入微信号',
                pattern: '微信号应以字母开头，包含字母、数字、下划线或连字符',
                minLength: '微信号至少需要6个字符',
                maxLength: '微信号不能超过20个字符',
                invalid: '微信号格式不正确'
            }
        },
        
        // 省份验证规则
        province: {
            required: true,
            messages: {
                required: '请选择省份',
                invalid: '请选择有效的省份'
            }
        },
        
        // 城市验证规则
        city: {
            required: true,
            messages: {
                required: '请选择城市',
                invalid: '请选择有效的城市'
            }
        },
        
        // 区县验证规则
        district: {
            required: true,
            messages: {
                required: '请选择区县',
                invalid: '请选择有效的区县'
            }
        },
        
        // 详细地址验证规则
        address: {
            minLength: 3,
            maxLength: 200,
            required: true,
            messages: {
                required: '请输入详细地址',
                minLength: '详细地址至少需要3个字符',
                maxLength: '详细地址不能超过200个字符',
                invalid: '详细地址格式不正确'
            }
        },
        
        // 邮政编码验证规则（选填）
        zipcode: {
            pattern: /^\d{6}$/,
            required: false,
            messages: {
                pattern: '邮政编码应为6位数字',
                invalid: '邮政编码格式不正确'
            }
        },
        
        // 期望配送时间验证规则
        deliveryTime: {
            required: true,
            messages: {
                required: '请选择期望配送时间',
                invalid: '请选择有效的配送时间'
            }
        },
        
        // 留言验证规则（选填）
        message: {
            maxLength: 200,
            required: false,
            messages: {
                maxLength: '留言不能超过200个字符',
                invalid: '留言格式不正确'
            }
        },
        
        // 隐私政策验证规则
        privacy: {
            required: true,
            messages: {
                required: '请阅读并同意隐私政策',
                invalid: '必须同意隐私政策才能继续'
            }
        }
    },
    
    // ==================== 验证单个字段 ====================
    /**
     * 验证单个字段
     * @param {string} fieldName - 字段名
     * @param {*} value - 字段值
     * @returns {Object} 验证结果 {valid: boolean, message: string}
     */
    validateField(fieldName, value) {
        const rule = this.rules[fieldName];
        
        if (!rule) {
            return { valid: true, message: '' };
        }
        
        // 处理值
        const processedValue = this.processValue(value, fieldName);
        
        // 必填验证
        if (rule.required && this.isEmpty(processedValue)) {
            return {
                valid: false,
                message: rule.messages.required
            };
        }
        
        // 如果非必填且为空，则通过验证
        if (!rule.required && this.isEmpty(processedValue)) {
            return { valid: true, message: '' };
        }
        
        // 长度验证
        if (rule.length && processedValue.length !== rule.length) {
            return {
                valid: false,
                message: rule.messages.length
            };
        }
        
        // 最小长度验证
        if (rule.minLength && processedValue.length < rule.minLength) {
            return {
                valid: false,
                message: rule.messages.minLength
            };
        }
        
        // 最大长度验证
        if (rule.maxLength && processedValue.length > rule.maxLength) {
            return {
                valid: false,
                message: rule.messages.maxLength
            };
        }
        
        // 正则表达式验证
        if (rule.pattern && !rule.pattern.test(processedValue)) {
            return {
                valid: false,
                message: rule.messages.pattern
            };
        }
        
        return { valid: true, message: '' };
    },
    
    // ==================== 处理值 ====================
    /**
     * 处理字段值
     * @param {*} value - 原始值
     * @param {string} fieldName - 字段名
     * @returns {string} 处理后的值
     */
    processValue(value, fieldName) {
        if (fieldName === 'privacy') {
            return value; // 复选框保持布尔值
        }
        
        if (typeof value === 'string') {
            return value.trim();
        }
        
        return value;
    },
    
    // ==================== 判断是否为空 ====================
    /**
     * 判断值是否为空
     * @param {*} value - 值
     * @returns {boolean} 是否为空
     */
    isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        
        if (typeof value === 'boolean') {
            return !value;
        }
        
        return false;
    },
    
    // ==================== 显示错误 ====================
    /**
     * 显示字段错误
     * @param {HTMLElement} field - 字段元素
     * @param {string} message - 错误消息
     */
    showError(field, message) {
        if (!field) return;
        
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        
        // 添加错误样式
        field.classList.add('error');
        field.classList.remove('success');
        
        // 添加抖动动画
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
        
        // 显示错误消息
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },
    
    // ==================== 清除错误 ====================
    /**
     * 清除字段错误
     * @param {HTMLElement} field - 字段元素
     */
    clearError(field) {
        if (!field) return;
        
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        
        // 移除错误样式
        field.classList.remove('error');
        
        // 清除错误消息
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },
    
    // ==================== 显示成功 ====================
    /**
     * 显示字段验证成功
     * @param {HTMLElement} field - 字段元素
     */
    showSuccess(field) {
        if (!field) return;
        
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        
        // 添加成功样式
        field.classList.remove('error');
        field.classList.add('success');
        
        // 清除错误消息
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },
    
    // ==================== 验证表单字段（DOM） ====================
    /**
     * 验证DOM字段
     * @param {HTMLElement} field - 字段元素
     * @returns {boolean} 是否验证通过
     */
    validateDOMField(field) {
        if (!field) return false;
        
        const fieldName = field.name || field.id;
        let value;
        
        // 获取字段值
        if (field.type === 'checkbox') {
            value = field.checked;
        } else {
            value = field.value;
        }
        
        // 验证
        const result = this.validateField(fieldName, value);
        
        // 显示验证结果
        if (result.valid) {
            this.showSuccess(field);
        } else {
            this.showError(field, result.message);
        }
        
        return result.valid;
    },
    
    // ==================== 验证表单数据对象 ====================
    /**
     * 验证表单数据对象
     * @param {Object} formData - 表单数据对象
     * @returns {Object} 验证结果 {valid: boolean, errors: Object, validData: Object}
     */
    validateFormData(formData) {
        const errors = {};
        const validData = {};
        
        // 遍历所有字段进行验证
        for (const fieldName in formData) {
            if (formData.hasOwnProperty(fieldName)) {
                const value = formData[fieldName];
                const result = this.validateField(fieldName, value);
                
                if (!result.valid) {
                    errors[fieldName] = result.message;
                } else {
                    validData[fieldName] = this.processValue(value, fieldName);
                }
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            validData: validData
        };
    },
    
    // ==================== 验证整个表单（DOM） ====================
    /**
     * 验证整个表单
     * @param {HTMLFormElement} form - 表单元素
     * @returns {Object} 验证结果 {valid: boolean, errors: Object, data: Object}
     */
    validateForm(form) {
        if (!form) return { valid: false, errors: {}, data: {} };
        
        const formData = {};
        const errors = {};
        let isValid = true;
        
        // 获取所有表单字段
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            const fieldName = field.name || field.id;
            
            if (!fieldName) return;
            
            let value;
            if (field.type === 'checkbox') {
                value = field.checked;
            } else {
                value = field.value;
            }
            
            // 验证字段
            const result = this.validateField(fieldName, value);
            
            if (!result.valid) {
                errors[fieldName] = result.message;
                this.showError(field, result.message);
                isValid = false;
            } else {
                formData[fieldName] = this.processValue(value, fieldName);
                this.showSuccess(field);
            }
        });
        
        return {
            valid: isValid,
            errors: errors,
            data: formData
        };
    },
    
    // ==================== 清除所有错误 ====================
    /**
     * 清除表单所有错误
     * @param {HTMLFormElement} form - 表单元素
     */
    clearAllErrors(form) {
        if (!form) return;
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearError(field);
            field.classList.remove('success');
        });
    },
    
    // ==================== 设置实时验证 ====================
    /**
     * 为字段设置实时验证
     * @param {HTMLElement} field - 字段元素
     * @param {Object} options - 选项 {onInput: boolean, onBlur: boolean, debounce: number}
     */
    setupRealtimeValidation(field, options = {}) {
        if (!field) return;
        
        const defaultOptions = {
            onInput: true,
            onBlur: true,
            debounce: 300
        };
        
        const opts = { ...defaultOptions, ...options };
        
        // 失焦时验证
        if (opts.onBlur) {
            field.addEventListener('blur', () => {
                this.validateDOMField(field);
            });
        }
        
        // 输入时验证（带防抖）
        if (opts.onInput) {
            let debounceTimer;
            field.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    // 只在有值时验证
                    if (field.value || field.type === 'checkbox') {
                        this.validateDOMField(field);
                    } else {
                        // 清除错误但不显示成功
                        this.clearError(field);
                        field.classList.remove('success');
                    }
                }, opts.debounce);
            });
        }
    },
    
    // ==================== 为表单所有字段设置实时验证 ====================
    /**
     * 为表单所有字段设置实时验证
     * @param {HTMLFormElement} form - 表单元素
     * @param {Object} options - 选项
     */
    setupFormRealtimeValidation(form, options = {}) {
        if (!form) return;
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            const fieldName = field.name || field.id;
            if (fieldName && this.rules[fieldName]) {
                this.setupRealtimeValidation(field, options);
            }
        });
    },
    
    // ==================== 手机号格式化 ====================
    /**
     * 格式化手机号（添加空格）
     * @param {string} phone - 手机号
     * @returns {string} 格式化后的手机号
     * 
     * @example
     * formatPhone('13800138000') // '138 0013 8000'
     */
    formatPhone(phone) {
        if (!phone || typeof phone !== 'string') return phone;
        
        // 移除所有非数字字符
        const cleaned = phone.replace(/\D/g, '');
        
        // 格式化为 XXX XXXX XXXX
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        
        return phone;
    },
    
    // ==================== 手机号脱敏 ====================
    /**
     * 手机号脱敏显示
     * @param {string} phone - 手机号
     * @returns {string} 脱敏后的手机号
     * 
     * @example
     * maskPhone('13800138000') // '138****8000'
     */
    maskPhone(phone) {
        if (!phone || typeof phone !== 'string') return phone;
        
        // 移除所有非数字字符
        const cleaned = phone.replace(/\D/g, '');
        
        // 隐藏中间4位
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
        }
        
        return phone;
    },
    
    // ==================== 手机号输入格式化 ====================
    /**
     * 为手机号输入框添加自动格式化
     * @param {HTMLInputElement} phoneInput - 手机号输入框
     */
    setupPhoneFormatting(phoneInput) {
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', function(e) {
            // 只保留数字
            let value = this.value.replace(/\D/g, '');
            
            // 限制最大长度为11
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // 更新输入框值
            this.value = value;
        });
        
        // 粘贴时也处理
        phoneInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                this.value = value;
            }, 0);
        });
    },
    
    // ==================== 获取字段的验证规则 ====================
    /**
     * 获取字段的验证规则
     * @param {string} fieldName - 字段名
     * @returns {Object|null} 验证规则
     */
    getFieldRule(fieldName) {
        return this.rules[fieldName] || null;
    },
    
    // ==================== 添加自定义验证规则 ====================
    /**
     * 添加自定义验证规则
     * @param {string} fieldName - 字段名
     * @param {Object} rule - 验证规则
     */
    addRule(fieldName, rule) {
        this.rules[fieldName] = rule;
    },
    
    // ==================== 更新验证规则 ====================
    /**
     * 更新现有验证规则
     * @param {string} fieldName - 字段名
     * @param {Object} updates - 要更新的规则属性
     */
    updateRule(fieldName, updates) {
        if (this.rules[fieldName]) {
            this.rules[fieldName] = { ...this.rules[fieldName], ...updates };
        }
    },
    
    // ==================== 移除验证规则 ====================
    /**
     * 移除验证规则
     * @param {string} fieldName - 字段名
     */
    removeRule(fieldName) {
        delete this.rules[fieldName];
    }
};

// 导出验证器对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}

// 在控制台显示验证器信息（开发调试用）
console.log('%c✓ Form Validator Loaded', 'color: #4CAF50; font-size: 12px;');
