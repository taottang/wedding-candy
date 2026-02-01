# 💻 婚礼喜糖领取系统 - 代码规范与最佳实践

> **版本**：v1.1.0  
> **更新日期**：2026-02-02  
> **用途**：开发规范和代码质量指南

---

## 📋 目录

- [代码规范](#代码规范)
- [ES6+语法规范](#es6语法规范)
- [注释规范](#注释规范)
- [模块化设计](#模块化设计)
- [中国用户习惯](#中国用户习惯)
- [微信浏览器兼容](#微信浏览器兼容)
- [纯前端架构](#纯前端架构)
- [错误处理](#错误处理)

---

## 📝 代码规范

### 1. 基本原则

✅ **已遵循的原则**：
- 使用 ES6+ 语法
- 详细的中文注释
- 模块化设计（IIFE模块模式）
- 纯前端实现（无需服务器）
- 完整的错误处理

### 2. 命名规范

#### 变量命名（驼峰式）
```javascript
// ✅ 正确
const userName = '张三';
const phoneNumber = '13800138000';
const isValid = true;

// ❌ 错误
const user_name = '张三';
const PHONE_NUMBER = '13800138000';
```

#### 常量命名（大写下划线）
```javascript
// ✅ 正确
const MAX_LENGTH = 200;
const DEFAULT_PAGE_SIZE = 20;
const STORAGE_KEY = 'wedding_data';

// ❌ 错误
const maxLength = 200;
const defaultPageSize = 20;
```

#### 函数命名（驼峰式，动词开头）
```javascript
// ✅ 正确
function getUserData() { }
function validateForm() { }
function showMessage() { }

// ❌ 错误
function user_data() { }
function formValidation() { }
function message() { }
```

#### 类/构造函数命名（帕斯卡式）
```javascript
// ✅ 正确
class DataManager { }
class FormValidator { }

// ❌ 错误
class dataManager { }
class form_validator { }
```

### 3. 代码格式

#### 缩进（2空格）
```javascript
// ✅ 正确
function example() {
  if (condition) {
    console.log('message');
  }
}

// ❌ 错误（4空格或Tab）
function example() {
    if (condition) {
        console.log('message');
    }
}
```

#### 分号使用
```javascript
// ✅ 正确（总是使用分号）
const name = '张三';
const age = 25;

// ⚠️ 可接受（但不推荐）
const name = '张三'
const age = 25
```

#### 引号使用（优先单引号）
```javascript
// ✅ 正确
const message = '提交成功';
const html = '<div class="card">内容</div>';

// ✅ 也可接受（模板字符串）
const message = `${name}，提交成功`;

// ❌ 避免（双引号，除非必要）
const message = "提交成功";
```

---

## 🚀 ES6+语法规范

### ✅ 系统已使用的ES6+特性

#### 1. const/let（替代var）
```javascript
// ✅ 系统中使用
const CONFIG = {
  SITE_NAME: '婚礼喜糖领取系统'
};

let currentStep = 1;
```

#### 2. 箭头函数
```javascript
// ✅ 系统中使用
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// 数组方法中使用
recipients.filter(r => r.status === 'pending');
recipients.map(r => r.name);
```

#### 3. 模板字符串
```javascript
// ✅ 系统中使用
const message = `${name}，您的信息已提交成功！`;
const address = `${province} ${city} ${district} ${detail}`;
const html = `
  <div class="card">
    <h3>${title}</h3>
    <p>${content}</p>
  </div>
`;
```

#### 4. 解构赋值
```javascript
// ✅ 系统中使用
const { name, phone, address } = formData;
const [year, month, day] = date.split('-');

// 函数参数解构
function updateRecipient({ id, status }) {
  // ...
}
```

#### 5. 展开运算符
```javascript
// ✅ 系统中使用
const newArray = [...oldArray, newItem];
const merged = { ...defaultConfig, ...userConfig };
```

#### 6. 默认参数
```javascript
// ✅ 系统中使用
function formatDate(date, format = 'YYYY-MM-DD') {
  // ...
}

function search(keyword = '', options = {}) {
  // ...
}
```

#### 7. Promise和async/await
```javascript
// ✅ 系统中使用
async function loadRegions() {
  try {
    const response = await fetch('data/regions.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载失败:', error);
    return null;
  }
}
```

#### 8. 类（Class）
```javascript
// ✅ 可选使用（系统主要用IIFE模块）
class FormValidator {
  constructor(rules) {
    this.rules = rules;
  }
  
  validate(data) {
    // ...
  }
}
```

#### 9. 增强对象字面量
```javascript
// ✅ 系统中使用
const name = '张三';
const age = 25;

const person = {
  name,           // 属性简写
  age,
  sayHi() {      // 方法简写
    console.log(`你好，我是${this.name}`);
  }
};
```

#### 10. Array方法
```javascript
// ✅ 系统中使用
// find, filter, map, reduce, some, every
const found = recipients.find(r => r.phone === phone);
const filtered = recipients.filter(r => r.status === 'pending');
const names = recipients.map(r => r.name);
const total = numbers.reduce((sum, num) => sum + num, 0);
```

---

## 📝 注释规范

### ✅ 系统中的注释风格

#### 1. 文件头注释
```javascript
// =================================================================
// 性能优化模块 - Performance Optimizer
// 图片懒加载、缓存策略、代码优化
// =================================================================
```

#### 2. 函数注释
```javascript
/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  // 实现代码...
}
```

#### 3. 代码块注释
```javascript
// ==================== 初始化配置 ====================
const CONFIG = {
  // 站点配置
  SITE_NAME: '婚礼喜糖领取系统',
  
  // 新人信息
  COUPLE: {
    BRIDE: '邓蓓',      // 新娘姓名
    GROOM: '唐韬'       // 新郎姓名
  }
};
```

#### 4. 行内注释
```javascript
const phone = value.replace(/\s/g, ''); // 移除所有空格
const masked = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); // 脱敏处理
```

#### 5. TODO注释
```javascript
// TODO: 添加更多验证规则
// FIXME: 修复IE11兼容性问题
// NOTE: 这里需要特别注意性能
// HACK: 临时解决方案，待优化
```

### 📋 注释要求

✅ **必须添加注释的地方**：
- 文件头部说明
- 复杂的函数逻辑
- 正则表达式
- 算法实现
- 浏览器兼容性处理
- 性能优化技巧
- 重要的业务逻辑

⚠️ **不需要注释的地方**：
- 非常简单明了的代码
- 变量名已经很清楚的情况

---

## 📦 模块化设计

### ✅ 系统采用的模块模式

#### 1. IIFE模块模式（主要使用）
```javascript
// js/utils.js
const Utils = (() => {
  // 私有变量
  const privateVar = 'private';
  
  // 私有方法
  function privateMethod() {
    // ...
  }
  
  // 公共API
  return {
    formatDate(date) {
      // ...
    },
    
    formatPhone(phone) {
      // ...
    }
  };
})();

// 使用
Utils.formatDate(new Date());
```

#### 2. 模块职责划分

**配置模块** (`js/config.js`)
```javascript
const CONFIG = {
  SITE_NAME: '婚礼喜糖领取系统',
  COUPLE: { /* ... */ },
  ADMIN: { /* ... */ }
};
```

**工具模块** (`js/utils.js`)
```javascript
const Utils = (() => {
  return {
    formatDate() { },
    formatPhone() { },
    deepClone() { },
    // 通用工具函数
  };
})();
```

**数据管理模块** (`js/data-manager.js`)
```javascript
const DataManager = (() => {
  return {
    addRecipient() { },
    getAllRecipients() { },
    updateStatus() { },
    // 数据CRUD操作
  };
})();
```

**表单验证模块** (`js/form-validator.js`)
```javascript
const FormValidator = (() => {
  return {
    validateField() { },
    validateForm() { },
    showError() { },
    // 验证相关功能
  };
})();
```

**性能优化模块** (`js/performance.js`)
```javascript
const PerformanceOptimizer = (() => {
  return {
    init() { },
    initLazyLoading() { },
    CacheManager: { /* ... */ }
  };
})();
```

#### 3. 模块依赖关系
```
index.html
  ├── config.js           (基础配置)
  ├── utils.js            (工具函数)
  ├── performance.js      (性能优化)
  ├── accessibility.js    (无障碍)
  └── seo.js             (SEO)

form.html
  ├── config.js
  ├── utils.js
  ├── form-validator.js   (依赖 utils)
  ├── region-loader.js
  ├── data-manager.js     (依赖 utils)
  ├── performance.js
  ├── accessibility.js
  └── seo.js

admin.html
  ├── config.js
  ├── utils.js
  ├── data-manager.js
  ├── admin-auth.js       (依赖 config, utils)
  ├── export-utils.js     (依赖 utils)
  ├── performance.js
  └── accessibility.js
```

---

## 🇨🇳 中国用户习惯

### ✅ 系统已实现的本地化特性

#### 1. 语言本地化
```javascript
// ✅ 全中文界面
const messages = {
  submitSuccess: '提交成功！',
  submitFailed: '提交失败，请重试',
  required: '此项为必填项',
  invalidPhone: '请输入有效的手机号'
};
```

#### 2. 日期格式
```javascript
// ✅ 中国日期格式
formatDate(date, 'YYYY年MM月DD日');      // 2026年02月01日
formatDate(date, 'YYYY-MM-DD');          // 2026-02-01
formatDate(date, 'MM月DD日 HH:mm');      // 02月01日 14:30
```

#### 3. 手机号格式
```javascript
// ✅ 11位手机号
const phonePattern = /^1[3-9]\d{9}$/;

// ✅ 格式化显示 (3-4-4)
formatPhone('13800138000'); // 138 0013 8000

// ✅ 脱敏显示
maskPhone('13800138000');   // 138****8000
```

#### 4. 省市区三级联动
```javascript
// ✅ 完整的中国行政区划数据
{
  "110000": {
    "code": "110000",
    "name": "北京市",
    "children": { /* ... */ }
  }
  // ... 包含所有省市区
}
```

#### 5. 微信相关功能
```javascript
// ✅ 微信号验证
const wechatPattern = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;

// ✅ 微信分享功能
if (navigator.share) {
  navigator.share({
    title: '婚礼喜糖领取',
    text: '我领取了喜糖！',
    url: window.location.href
  });
}
```

#### 6. 支付相关（可选）
```javascript
// 如需集成支付，可使用：
// - 微信支付
// - 支付宝
// - 当前系统免费，无需支付
```

#### 7. 用户体验优化
```javascript
// ✅ 中文提示
toast('操作成功');
confirm('确定要删除吗？');
alert('请先登录');

// ✅ 友好的错误提示
'请输入姓名' 而不是 'Name is required'
'手机号格式不正确' 而不是 'Invalid phone number'
```

---

## 📱 微信浏览器兼容

### ✅ 系统已实现的微信兼容特性

#### 1. 浏览器检测
```javascript
// ✅ 检测微信浏览器
function isWechat() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
}

// ✅ 检测iOS微信
function isWechatIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1 && 
         ua.indexOf('iphone') !== -1;
}
```

#### 2. 输入框优化（防止iOS微信缩放）
```css
/* ✅ 字体大小 ≥ 16px */
input, select, textarea {
  font-size: 16px;
}
```

#### 3. 图片加载优化
```javascript
// ✅ 懒加载图片（微信浏览器支持）
<img data-src="image.jpg" alt="描述">
```

#### 4. 分享功能（Web Share API）
```javascript
// ✅ 优先使用 Web Share API
if (navigator.share) {
  navigator.share({
    title: '标题',
    text: '内容',
    url: 'https://...'
  });
} else {
  // 降级方案：提示用户手动分享
  alert('请点击右上角分享按钮');
}
```

#### 5. 返回键处理
```javascript
// ✅ 监听返回事件（微信浏览器）
window.addEventListener('popstate', function(e) {
  // 处理返回逻辑
});
```

#### 6. 长按保存图片
```css
/* ✅ 允许长按保存图片 */
img {
  -webkit-touch-callout: default;
}

/* ⚠️ 禁止长按（某些区域） */
.no-callout {
  -webkit-touch-callout: none;
}
```

#### 7. 微信内置浏览器样式
```css
/* ✅ 取消高亮 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

/* ✅ 去除输入框阴影 */
input, textarea {
  -webkit-appearance: none;
  appearance: none;
}
```

#### 8. 微信JS-SDK（可选）
```javascript
// 如需使用微信高级功能（分享到朋友圈等）
// 需要引入微信JS-SDK
// <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

// wx.config({ /* ... */ });
// wx.ready(function() { /* ... */ });
```

### 🧪 微信浏览器测试要点

- [ ] iOS微信正常打开
- [ ] Android微信正常打开
- [ ] 输入框不会自动缩放
- [ ] 分享功能正常
- [ ] 图片加载正常
- [ ] 动画流畅
- [ ] 返回键正常
- [ ] 无白屏问题

---

## 💾 纯前端架构

### ✅ 系统架构特点

#### 1. 无服务器依赖
```
✅ 纯静态文件
  ├── HTML (5个页面)
  ├── CSS (6个样式文件)
  ├── JavaScript (13个模块)
  └── JSON (3个数据文件)

✅ 无需：
  ❌ 数据库
  ❌ 后端API
  ❌ 服务器运行环境
  ❌ 域名备案（静态托管）
```

#### 2. 数据存储（LocalStorage）
```javascript
// ✅ 使用浏览器本地存储
const storage = {
  // 保存数据
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  // 读取数据
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  
  // 删除数据
  remove(key) {
    localStorage.removeItem(key);
  }
};
```

#### 3. 数据导出（客户端）
```javascript
// ✅ ExcelJS（客户端生成Excel）
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('领取记录');
// ... 添加数据
const buffer = await workbook.xlsx.writeBuffer();
// ... 下载文件
```

#### 4. 数据备份（JSON）
```javascript
// ✅ 导出为JSON文件
function exportBackup() {
  const data = DataManager.getAllRecipients();
  const json = JSON.stringify(data, null, 2);
  downloadFile('backup.json', json, 'application/json');
}
```

#### 5. 部署方式
```
✅ 可部署到：
  ✅ GitHub Pages（免费）
  ✅ Vercel（免费）
  ✅ Netlify（免费）
  ✅ 腾讯云COS（低成本）
  ✅ 阿里云OSS（低成本）
  ✅ 任何静态网站托管
```

### ⚠️ LocalStorage限制

```javascript
// LocalStorage容量：约5MB
// 建议：
// - 定期导出数据
// - 清理旧数据
// - 使用压缩（可选）

// ✅ 检查容量
function checkStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
}
```

---

## 🛡️ 错误处理

### ✅ 系统中的错误处理机制

#### 1. Try-Catch包裹
```javascript
// ✅ 异步操作
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载失败:', error);
    Utils.toast('数据加载失败，请刷新重试', 'error');
    return null;
  }
}

// ✅ 同步操作
function saveData(data) {
  try {
    localStorage.setItem('key', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存失败:', error);
    if (error.name === 'QuotaExceededError') {
      Utils.toast('存储空间不足，请清理数据', 'error');
    }
    return false;
  }
}
```

#### 2. 参数验证
```javascript
// ✅ 函数参数检查
function updateRecipient(id, status) {
  // 参数验证
  if (!id) {
    console.error('ID不能为空');
    return { success: false, message: 'ID不能为空' };
  }
  
  if (!['pending', 'shipped', 'received'].includes(status)) {
    console.error('无效的状态值');
    return { success: false, message: '无效的状态值' };
  }
  
  // 执行操作
  try {
    // ...
    return { success: true, message: '更新成功' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

#### 3. 返回值规范
```javascript
// ✅ 统一的返回格式
function operation() {
  try {
    // 成功
    return {
      success: true,
      message: '操作成功',
      data: result
    };
  } catch (error) {
    // 失败
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
}

// 使用
const result = operation();
if (result.success) {
  Utils.toast(result.message, 'success');
} else {
  Utils.toast(result.message, 'error');
}
```

#### 4. 用户友好的错误提示
```javascript
// ✅ 中文错误提示
const errorMessages = {
  'NetworkError': '网络连接失败，请检查网络',
  'QuotaExceededError': '存储空间不足，请清理数据',
  'ValidationError': '数据验证失败，请检查输入',
  'PermissionDenied': '没有权限，请先登录'
};

function showError(error) {
  const message = errorMessages[error.name] || '操作失败，请重试';
  Utils.toast(message, 'error');
  console.error('详细错误:', error);
}
```

#### 5. 全局错误捕获
```javascript
// ✅ 捕获未处理的错误
window.addEventListener('error', function(e) {
  console.error('全局错误:', e.error);
  // 可选：上报错误
});

// ✅ 捕获Promise错误
window.addEventListener('unhandledrejection', function(e) {
  console.error('未处理的Promise错误:', e.reason);
  e.preventDefault();
});
```

#### 6. 表单验证错误
```javascript
// ✅ 清晰的验证错误提示
const FormValidator = (() => {
  const rules = {
    name: {
      pattern: /^[\u4e00-\u9fa5a-zA-Z·\s]{2,20}$/,
      messages: {
        required: '姓名不能为空',
        pattern: '姓名只能包含中文、英文、间隔号和空格，长度2-20字符'
      }
    }
  };
  
  return {
    validateField(field) {
      const value = field.value.trim();
      const rule = rules[field.name];
      
      if (rule.required && !value) {
        showError(field, rule.messages.required);
        return false;
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        showError(field, rule.messages.pattern);
        return false;
      }
      
      clearError(field);
      return true;
    }
  };
})();
```

#### 7. 降级处理
```javascript
// ✅ 功能降级
if ('IntersectionObserver' in window) {
  // 使用现代API
  initLazyLoading();
} else {
  // 降级方案
  loadAllImages();
}

if (navigator.share) {
  // 使用Web Share API
  navigator.share(shareData);
} else {
  // 降级方案
  showShareDialog();
}
```

---

## 📋 代码质量检查清单

### ✅ 语法规范
- [x] 使用ES6+语法
- [x] 使用const/let代替var
- [x] 使用箭头函数
- [x] 使用模板字符串
- [x] 使用解构赋值

### ✅ 注释规范
- [x] 文件头部有说明注释
- [x] 复杂函数有详细注释
- [x] 关键代码有行内注释
- [x] 使用中文注释

### ✅ 模块化
- [x] 使用IIFE模块模式
- [x] 模块职责单一
- [x] 模块间依赖清晰
- [x] 公共功能抽取到utils

### ✅ 本地化
- [x] 全中文界面
- [x] 中文错误提示
- [x] 中国日期格式
- [x] 手机号格式验证
- [x] 省市区数据完整

### ✅ 微信兼容
- [x] 输入框字体≥16px
- [x] 分享功能实现
- [x] 微信浏览器测试
- [x] 样式兼容处理

### ✅ 纯前端
- [x] 无服务器依赖
- [x] LocalStorage存储
- [x] 客户端导出
- [x] 静态文件部署

### ✅ 错误处理
- [x] Try-Catch包裹
- [x] 参数验证
- [x] 友好错误提示
- [x] 降级处理
- [x] 全局错误捕获

---

## 🎯 最佳实践总结

### 1. 代码质量
- ✅ ES6+语法，现代化
- ✅ 详细中文注释，易维护
- ✅ 模块化设计，结构清晰
- ✅ 统一命名规范，可读性强

### 2. 用户体验
- ✅ 中国用户习惯，符合预期
- ✅ 微信浏览器兼容，覆盖广
- ✅ 友好错误提示，易理解
- ✅ 性能优化，加载快

### 3. 技术架构
- ✅ 纯前端实现，部署简单
- ✅ LocalStorage存储，无需服务器
- ✅ 完整错误处理，稳定可靠
- ✅ 渐进增强，向后兼容

---

**文档版本**：v1.0  
**最后更新**：2026-02-02  
**维护者**：开发团队

遵循本规范，确保代码质量和项目可维护性！💻
