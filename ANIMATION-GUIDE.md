# 动画效果使用指南

## 📦 动画库概述

系统包含完整的动画效果库，涵盖：
- 🌸 花瓣飘落动画
- 📋 表单步骤切换动画
- 🎯 按钮点击反馈
- ⏳ 加载状态动画
- 📄 页面过渡效果

---

## 🚀 快速开始

### 引入文件

```html
<!-- 动画样式 -->
<link rel="stylesheet" href="css/animation.css">

<!-- 动画辅助脚本 -->
<script src="js/animation-helpers.js"></script>
```

---

## 🌸 1. 花瓣飘落动画

### 自动初始化

脚本会自动创建花瓣容器并启动动画：

```javascript
// 自动创建 20 个花瓣
// 页面加载后自动运行
```

### 手动控制

```javascript
// 创建 30 个花瓣
AnimationHelpers.initPetals('petalsContainer', 30);

// 或者手动创建容器
const container = document.getElementById('myPetalsContainer');
AnimationHelpers.createPetals(container, 25);
```

### HTML 结构

```html
<!-- 花瓣容器会自动创建，也可以手动添加 -->
<div id="petalsContainer" class="petals-container"></div>
```

### 性能优化

```css
/* 移动端禁用花瓣效果（可选） */
@media (max-width: 768px) {
    .petals-container {
        display: none;
    }
}
```

---

## 📋 2. 表单步骤切换动画

### 基本用法

```javascript
const currentStep = document.getElementById('step1');
const nextStep = document.getElementById('step2');

// 前进到下一步
await AnimationHelpers.animateStepTransition(currentStep, nextStep, 'forward');

// 返回上一步
await AnimationHelpers.animateStepTransition(currentStep, nextStep, 'backward');
```

### CSS 类名

```html
<!-- 淡入淡出 -->
<div class="fade-in">内容淡入</div>
<div class="fade-out">内容淡出</div>

<!-- 滑动效果 -->
<div class="slide-in-right">从右滑入</div>
<div class="slide-out-left">从左滑出</div>
<div class="slide-in-left">从左滑入</div>
<div class="slide-out-right">从右滑出</div>

<!-- 上下滑动 -->
<div class="slide-up">从下滑入</div>
<div class="slide-down">从上滑入</div>

<!-- 缩放 -->
<div class="scale-in">缩放淡入</div>
<div class="scale-out">缩放淡出</div>
```

### 完整示例

```javascript
// 表单步骤管理
let currentStep = 1;
const totalSteps = 4;

function nextStep() {
    if (currentStep < totalSteps) {
        const current = document.getElementById(`step${currentStep}`);
        const next = document.getElementById(`step${currentStep + 1}`);
        
        AnimationHelpers.animateStepTransition(current, next, 'forward');
        currentStep++;
    }
}

function prevStep() {
    if (currentStep > 1) {
        const current = document.getElementById(`step${currentStep}`);
        const prev = document.getElementById(`step${currentStep - 1}`);
        
        AnimationHelpers.animateStepTransition(current, prev, 'backward');
        currentStep--;
    }
}
```

---

## 🎯 3. 按钮点击反馈

### 涟漪效果

```javascript
// 自动为所有主按钮添加涟漪
AnimationHelpers.addRippleAll('.btn-primary, .btn-secondary');

// 为单个按钮添加涟漪
const button = document.getElementById('myButton');
AnimationHelpers.addRipple(button);

// 使用选择器
AnimationHelpers.addRipple('#submitBtn');
```

### HTML 结构

```html
<!-- 按钮会自动添加涟漪效果 -->
<button class="btn btn-primary">点击我</button>
```

### 其他按钮动画

```html
<!-- 点击缩放 -->
<button class="btn btn-press">按下效果</button>

<!-- 心跳 -->
<button class="btn heartbeat">心跳动画</button>

<!-- 摇晃 -->
<button class="btn shake">摇晃效果</button>

<!-- 弹跳 -->
<button class="btn bounce">弹跳效果</button>

<!-- 脉冲 -->
<button class="btn pulse">脉冲效果</button>
```

### JavaScript 触发

```javascript
// 给元素添加动画
AnimationHelpers.animate('#myButton', 'shake', () => {
    console.log('动画完成！');
});
```

---

## ⏳ 4. 加载状态动画

### 旋转加载器

```html
<!-- 默认大小 -->
<div class="spinner"></div>

<!-- 小型 -->
<div class="spinner spinner-sm"></div>

<!-- 大型 -->
<div class="spinner spinner-lg"></div>
```

### 圆点加载器

```html
<div class="dots-loader">
    <span></span>
    <span></span>
    <span></span>
</div>
```

### 波浪加载器

```html
<div class="wave-loader">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
```

### JavaScript 控制

```javascript
// 显示加载器
AnimationHelpers.showLoader('#loadingContainer', 'spinner');
// 类型: 'spinner', 'dots', 'wave'

// 隐藏加载器
AnimationHelpers.hideLoader('#loadingContainer');
```

### 骨架屏

```html
<!-- 文本骨架 -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>

<!-- 头像骨架 -->
<div class="skeleton skeleton-avatar"></div>

<!-- 卡片骨架 -->
<div class="skeleton skeleton-card"></div>
```

### 进度条

```html
<div class="progress-bar">
    <div class="progress-bar-fill" style="width: 60%"></div>
</div>
```

```javascript
// 动画进度条
const progressBar = document.querySelector('.progress-bar-fill');
AnimationHelpers.animateProgress(progressBar, 75, 1000);
```

---

## 📄 5. 页面过渡效果

### 页面进入/退出

```html
<!-- 页面淡入 -->
<body class="page-enter">
    <!-- 内容 -->
</body>
```

```javascript
// JavaScript 触发
AnimationHelpers.pageEnterAnimation();
```

### 滚动渐显

```html
<!-- 从下往上显示 -->
<div class="scroll-reveal">
    <h2>标题</h2>
    <p>内容...</p>
</div>

<!-- 从左往右显示 -->
<div class="scroll-reveal-left">
    <img src="image.jpg" alt="">
</div>

<!-- 从右往左显示 -->
<div class="scroll-reveal-right">
    <div class="card">...</div>
</div>
```

```javascript
// 自动初始化（已在脚本中自动运行）
AnimationHelpers.initScrollReveal();

// 自定义选项
AnimationHelpers.initScrollReveal('.my-reveal', {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});
```

### 其他入场动画

```html
<!-- 旋转入场 -->
<div class="rotate-in">旋转入场</div>

<!-- 翻转入场 -->
<div class="flip-in">翻转入场</div>

<!-- 缩放弹出 -->
<div class="zoom-in">缩放弹出</div>

<!-- 橡皮筋 -->
<div class="rubber-band">橡皮筋效果</div>

<!-- 摆动 -->
<div class="swing">摆动效果</div>

<!-- 抖动 -->
<div class="jello">抖动效果</div>
```

---

## 🛠️ 辅助工具类

### 动画延迟

```html
<div class="fade-in delay-100">延迟 0.1s</div>
<div class="fade-in delay-200">延迟 0.2s</div>
<div class="fade-in delay-500">延迟 0.5s</div>
```

### 动画持续时间

```html
<div class="bounce duration-fast">快速（0.3s）</div>
<div class="bounce duration-normal">正常（0.5s）</div>
<div class="bounce duration-slow">缓慢（1s）</div>
```

### 动画次数

```html
<div class="pulse animate-once">播放一次</div>
<div class="pulse animate-twice">播放两次</div>
<div class="pulse animate-infinite">无限循环</div>
```

### 暂停动画

```html
<div class="spinner paused">暂停的加载器</div>
```

```javascript
// JavaScript 控制
element.classList.add('paused');    // 暂停
element.classList.remove('paused'); // 继续
```

---

## 🎨 高级功能

### 数字滚动动画

```javascript
// 从 0 滚动到 100
const counter = document.getElementById('counter');
AnimationHelpers.animateNumber(counter, 100, 2000);
```

### 悬停倾斜效果

```javascript
// 为卡片添加 3D 倾斜效果
const card = document.querySelector('.card');
AnimationHelpers.addTiltEffect(card);
```

### 触觉反馈

```javascript
// 震动 50ms（移动设备）
AnimationHelpers.vibrate(50);

// 震动模式
AnimationHelpers.vibrate([50, 100, 50]);
```

---

## 📱 响应式和性能

### 移动端优化

动画会在移动设备上自动优化：

```css
@media (max-width: 768px) {
    /* 花瓣动画持续时间减少 */
    .petal {
        animation-duration: 6s !important;
    }
}
```

### 尊重用户偏好

如果用户设置了"减少动画"偏好，动画会自动禁用或简化：

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
    }
}
```

---

## 💡 完整示例

### 首页示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <link rel="stylesheet" href="css/animation.css">
</head>
<body>
    <!-- 花瓣容器（自动创建） -->
    
    <!-- 滚动渐显的内容 -->
    <section class="scroll-reveal">
        <h1>婚礼喜糖领取</h1>
        <p>邓蓓 & 唐韬</p>
    </section>
    
    <!-- 带涟漪效果的按钮 -->
    <button class="btn btn-primary ripple-container">
        立即领取
    </button>
    
    <!-- 加载器 -->
    <div id="loader" style="display: none;">
        <div class="spinner"></div>
    </div>
    
    <script src="js/animation-helpers.js"></script>
    <script>
        // 点击按钮显示加载
        document.querySelector('.btn-primary').addEventListener('click', () => {
            AnimationHelpers.showLoader('#loader', 'spinner');
            
            // 模拟加载
            setTimeout(() => {
                AnimationHelpers.hideLoader('#loader');
                window.location.href = 'form.html';
            }, 1000);
        });
    </script>
</body>
</html>
```

### 表单页面示例

```html
<div class="form-container">
    <!-- 步骤 1 -->
    <div id="step1" class="form-step">
        <h2>基本信息</h2>
        <input type="text" class="form-control">
        <button onclick="nextStep()">下一步</button>
    </div>
    
    <!-- 步骤 2（隐藏） -->
    <div id="step2" class="form-step" style="display: none;">
        <h2>联系方式</h2>
        <input type="tel" class="form-control">
        <button onclick="prevStep()">上一步</button>
        <button onclick="nextStep()">下一步</button>
    </div>
</div>

<script>
    let currentStep = 1;
    
    function nextStep() {
        const current = document.getElementById(`step${currentStep}`);
        const next = document.getElementById(`step${currentStep + 1}`);
        
        if (next) {
            AnimationHelpers.animateStepTransition(current, next, 'forward');
            currentStep++;
        }
    }
    
    function prevStep() {
        const current = document.getElementById(`step${currentStep}`);
        const prev = document.getElementById(`step${currentStep - 1}`);
        
        if (prev) {
            AnimationHelpers.animateStepTransition(current, prev, 'backward');
            currentStep--;
        }
    }
</script>
```

---

## 🎯 最佳实践

1. **性能优先**：在移动设备上减少或禁用复杂动画
2. **用户偏好**：尊重系统的"减少动画"设置
3. **适度使用**：不要过度使用动画，以免分散注意力
4. **有意义**：动画应该帮助理解界面变化，而非纯装饰
5. **测试**：在不同设备和浏览器上测试动画效果

---

**版本**: v1.0.0  
**更新日期**: 2026-02-01  
**作者**: Wedding Candy System Team
