// =================================================================
// 无障碍访问增强模块 - Accessibility Enhancement
// ARIA标签、键盘导航、对比度检查
// =================================================================

const A11yEnhancer = (() => {
    // 配置
    const CONFIG = {
        // 最小对比度（WCAG AA标准）
        minContrastRatio: 4.5,
        minContrastRatioLarge: 3.0,
        
        // 焦点陷阱元素
        focusTrapSelectors: '.modal, .drawer, .dropdown-menu',
        
        // 跳过导航链接
        skipLinkText: '跳转到主内容',
        skipLinkTarget: '#main-content'
    };

    /**
     * 初始化ARIA标签
     */
    function initARIALabels() {
        // 为按钮添加 aria-label
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                const title = btn.getAttribute('title');
                if (title) {
                    btn.setAttribute('aria-label', title);
                }
            }
        });

        // 为表单字段添加 aria-required
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.setAttribute('aria-required', 'true');
        });

        // 为表单字段关联错误消息
        document.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const errorMsg = group.querySelector('.error-message');
            
            if (input && errorMsg) {
                const errorId = errorMsg.id || `error-${input.name || input.id}`;
                errorMsg.id = errorId;
                input.setAttribute('aria-describedby', errorId);
                input.setAttribute('aria-invalid', 'false');
            }
        });

        // 为步骤指示器添加 aria-current
        document.querySelectorAll('.step-indicator .step').forEach((step, index) => {
            if (step.classList.contains('active')) {
                step.setAttribute('aria-current', 'step');
            }
            step.setAttribute('aria-label', `第 ${index + 1} 步`);
        });

        // 为模态框添加 ARIA 属性
        document.querySelectorAll('.modal').forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            
            const title = modal.querySelector('.modal-title, h1, h2');
            if (title) {
                const titleId = title.id || `modal-title-${Math.random().toString(36).substr(2, 9)}`;
                title.id = titleId;
                modal.setAttribute('aria-labelledby', titleId);
            }
        });

        // 为表格添加 ARIA 属性
        document.querySelectorAll('table').forEach(table => {
            if (!table.getAttribute('role')) {
                table.setAttribute('role', 'table');
            }
            
            const caption = table.querySelector('caption');
            if (caption) {
                const captionId = caption.id || `table-caption-${Math.random().toString(36).substr(2, 9)}`;
                caption.id = captionId;
                table.setAttribute('aria-labelledby', captionId);
            }
        });

        // 为导航添加 landmark
        document.querySelectorAll('nav:not([aria-label])').forEach(nav => {
            nav.setAttribute('aria-label', '导航菜单');
        });

        // 为搜索框添加 role
        document.querySelectorAll('input[type="search"]').forEach(search => {
            const container = search.closest('.search-box, .search-form');
            if (container) {
                container.setAttribute('role', 'search');
            }
        });

        // 为状态徽章添加 aria-label
        document.querySelectorAll('.badge, .status-badge').forEach(badge => {
            if (!badge.getAttribute('aria-label')) {
                badge.setAttribute('aria-label', `状态: ${badge.textContent.trim()}`);
            }
        });

        console.log('%c♿ ARIA标签已初始化', 'color: #2196F3;');
    }

    /**
     * 设置键盘导航
     */
    function setupKeyboardNavigation() {
        // ESC 键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show, .drawer.open');
                if (openModal) {
                    closeModal(openModal);
                }

                const openDropdown = document.querySelector('.dropdown.open');
                if (openDropdown) {
                    openDropdown.classList.remove('open');
                }
            }
        });

        // Tab 键焦点陷阱
        document.querySelectorAll(CONFIG.focusTrapSelectors).forEach(container => {
            container.addEventListener('keydown', handleFocusTrap);
        });

        // 为可点击元素添加回车/空格键支持
        document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // 箭头键导航（步骤指示器）
        setupArrowKeyNavigation('.step-indicator', '.step');

        // 箭头键导航（标签页）
        setupArrowKeyNavigation('[role="tablist"]', '[role="tab"]');

        console.log('%c⌨️ 键盘导航已设置', 'color: #2196F3;');
    }

    /**
     * 焦点陷阱处理
     */
    function handleFocusTrap(e) {
        if (e.key !== 'Tab') return;

        const container = e.currentTarget;
        const focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), ' +
            'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    /**
     * 箭头键导航
     */
    function setupArrowKeyNavigation(containerSelector, itemSelector) {
        document.querySelectorAll(containerSelector).forEach(container => {
            container.addEventListener('keydown', (e) => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

                const items = Array.from(container.querySelectorAll(itemSelector));
                const currentIndex = items.indexOf(document.activeElement);

                if (currentIndex === -1) return;

                let nextIndex;
                switch (e.key) {
                    case 'ArrowLeft':
                        nextIndex = currentIndex - 1;
                        if (nextIndex < 0) nextIndex = items.length - 1;
                        break;
                    case 'ArrowRight':
                        nextIndex = currentIndex + 1;
                        if (nextIndex >= items.length) nextIndex = 0;
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = items.length - 1;
                        break;
                }

                e.preventDefault();
                items[nextIndex].focus();

                // 如果是标签页，自动激活
                if (items[nextIndex].getAttribute('role') === 'tab') {
                    items[nextIndex].click();
                }
            });
        });
    }

    /**
     * 添加跳过导航链接
     */
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = CONFIG.skipLinkTarget;
        skipLink.textContent = CONFIG.skipLinkText;
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-secondary);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 0 0 4px 0;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // 确保目标元素存在
        let mainContent = document.querySelector(CONFIG.skipLinkTarget);
        if (!mainContent) {
            mainContent = document.querySelector('main, .main-content, .container');
            if (mainContent) {
                mainContent.id = CONFIG.skipLinkTarget.replace('#', '');
            }
        }
    }

    /**
     * 检查颜色对比度
     */
    function checkColorContrast() {
        const issues = [];

        // 检查所有文本元素
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label').forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = getBackgroundColor(element);
            
            if (color && backgroundColor) {
                const contrast = calculateContrastRatio(color, backgroundColor);
                const fontSize = parseFloat(styles.fontSize);
                const fontWeight = styles.fontWeight;
                
                const isLarge = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
                const minContrast = isLarge ? CONFIG.minContrastRatioLarge : CONFIG.minContrastRatio;

                if (contrast < minContrast) {
                    issues.push({
                        element: element,
                        text: element.textContent.trim().substring(0, 50),
                        contrast: contrast.toFixed(2),
                        required: minContrast,
                        color: color,
                        backgroundColor: backgroundColor
                    });
                }
            }
        });

        if (issues.length > 0) {
            console.group('%c⚠️ 颜色对比度问题', 'color: #FF9800; font-weight: bold;');
            issues.forEach((issue, index) => {
                console.log(`${index + 1}. "${issue.text}"`);
                console.log(`   对比度: ${issue.contrast} (要求: ${issue.required})`);
                console.log(`   前景色: ${issue.color}, 背景色: ${issue.backgroundColor}`);
                console.log(issue.element);
            });
            console.groupEnd();
        } else {
            console.log('%c✓ 颜色对比度检查通过', 'color: #4CAF50;');
        }

        return issues;
    }

    /**
     * 获取元素的背景颜色（递归查找）
     */
    function getBackgroundColor(element) {
        let bgColor = window.getComputedStyle(element).backgroundColor;
        
        // 如果是透明的，向上查找父元素
        while ((bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') && element.parentElement) {
            element = element.parentElement;
            bgColor = window.getComputedStyle(element).backgroundColor;
        }

        return bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' ? 'rgb(255, 255, 255)' : bgColor;
    }

    /**
     * 计算颜色对比度
     */
    function calculateContrastRatio(color1, color2) {
        const rgb1 = parseRGB(color1);
        const rgb2 = parseRGB(color2);

        const l1 = getRelativeLuminance(rgb1);
        const l2 = getRelativeLuminance(rgb2);

        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * 解析 RGB 颜色
     */
    function parseRGB(colorString) {
        const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return { r: 0, g: 0, b: 0 };
    }

    /**
     * 获取相对亮度
     */
    function getRelativeLuminance(rgb) {
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;

        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * 添加实时表单验证的无障碍支持
     */
    function enhanceFormAccessibility() {
        document.querySelectorAll('form').forEach(form => {
            // 为表单添加 novalidate 以使用自定义验证
            form.setAttribute('novalidate', 'true');

            // 监听输入变化
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    validateFieldAccessibly(field);
                });

                field.addEventListener('invalid', (e) => {
                    e.preventDefault();
                    validateFieldAccessibly(field);
                });
            });

            // 提交时验证
            form.addEventListener('submit', (e) => {
                let isValid = true;
                let firstInvalidField = null;

                form.querySelectorAll('input, select, textarea').forEach(field => {
                    if (!validateFieldAccessibly(field)) {
                        isValid = false;
                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                        announceToScreenReader('表单验证失败，请检查错误信息');
                    }
                }
            });
        });
    }

    /**
     * 无障碍方式验证字段
     */
    function validateFieldAccessibly(field) {
        const isValid = field.checkValidity();
        const errorMessage = field.parentElement.querySelector('.error-message');

        field.setAttribute('aria-invalid', isValid ? 'false' : 'true');

        if (!isValid && errorMessage) {
            errorMessage.textContent = field.validationMessage;
            errorMessage.style.display = 'block';
            announceToScreenReader(field.validationMessage);
        } else if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        return isValid;
    }

    /**
     * 向屏幕阅读器宣告消息
     */
    function announceToScreenReader(message, priority = 'polite') {
        let announcer = document.getElementById('aria-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'aria-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(announcer);
        }

        // 清空后重新设置，确保屏幕阅读器能读取
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * 关闭模态框（辅助函数）
     */
    function closeModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // 返回焦点到触发元素
        const trigger = modal._triggerElement;
        if (trigger) {
            trigger.focus();
        }
        
        announceToScreenReader('对话框已关闭');
    }

    /**
     * 监控焦点变化（调试用）
     */
    function monitorFocus() {
        document.addEventListener('focusin', (e) => {
            console.log('焦点:', e.target);
        });
    }

    /**
     * 初始化所有无障碍增强
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initAccessibility();
            });
        } else {
            initAccessibility();
        }
    }

    /**
     * 执行初始化
     */
    function initAccessibility() {
        // 添加跳过导航链接
        addSkipLink();

        // 初始化 ARIA 标签
        initARIALabels();

        // 设置键盘导航
        setupKeyboardNavigation();

        // 增强表单无障碍
        enhanceFormAccessibility();

        // 在开发环境检查对比度
        if (window.location.search.includes('debug=true')) {
            checkColorContrast();
            // monitorFocus();
        }

        console.log('%c♿ 无障碍访问增强已启用', 'color: #2196F3; font-weight: bold;');
    }

    // 返回公共 API
    return {
        init,
        initARIALabels,
        setupKeyboardNavigation,
        checkColorContrast,
        announceToScreenReader,
        enhanceFormAccessibility
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.A11yEnhancer = A11yEnhancer;
    A11yEnhancer.init();
}

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = A11yEnhancer;
}

console.log('%c♿ Accessibility Enhancer Loaded', 'color: #2196F3; font-size: 12px;');
