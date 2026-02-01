# 优化功能快速参考

## 🚀 性能优化

### 图片懒加载
```html
<img data-src="image.jpg" alt="描述">
<div data-bg="background.jpg"></div>
```

### 缓存管理
```javascript
PerformanceOptimizer.CacheManager.set('key', data, ttl);
PerformanceOptimizer.CacheManager.get('key');
PerformanceOptimizer.CacheManager.clear();
```

### 工具函数
```javascript
const debounced = PerformanceOptimizer.debounce(fn, 300);
const throttled = PerformanceOptimizer.throttle(fn, 1000);
```

---

## 📱 移动端优化

### 触摸目标
- 所有可交互元素 ≥ 44px × 44px
- 自动扩展小按钮触摸区域

### 键盘处理
- 防止iOS自动缩放（font-size ≥ 16px）
- 获得焦点自动滚动到可见区域

### 横屏适配
- 自动压缩垂直间距
- 4列统计卡片布局

### 安全区域
```css
padding-bottom: calc(16px + env(safe-area-inset-bottom));
```

---

## ♿ 无障碍访问

### 键盘快捷键
- `ESC` - 关闭模态框/下拉菜单
- `Tab` - 焦点循环（模态框内）
- `←→` - 箭头导航（步骤/标签页）
- `Enter/Space` - 激活按钮

### 屏幕阅读器
```javascript
A11yEnhancer.announceToScreenReader('消息内容', 'polite');
```

### 对比度检查
```javascript
A11yEnhancer.checkColorContrast(); // 开发模式自动
```

### 跳过导航
- 自动添加"跳转到主内容"链接
- `Tab`键可访问

---

## 🔍 SEO优化

### 自动设置
- ✅ Meta标签（description, keywords, robots）
- ✅ Open Graph标签（社交分享）
- ✅ Twitter Card标签
- ✅ 结构化数据（JSON-LD）
- ✅ Canonical链接

### 手动配置
```javascript
SEOOptimizer.init({
    siteName: '站点名称',
    siteUrl: 'https://domain.com',
    coupleName: '新人姓名',
    weddingDate: '2026-02-01',
    defaultImage: 'path/to/og-image.jpg'
});
```

### 生成文件
```javascript
SEOOptimizer.downloadSEOFiles(); // sitemap.xml + robots.txt
```

---

## 📊 开发模式

### 启用方式
```
https://domain.com/index.html?debug=true
```

### 功能
- 性能监控（长任务、资源加载）
- 对比度检查报告
- 详细控制台日志

---

## 🎯 性能目标

| 指标 | 目标 |
|------|------|
| FCP | <1.8s |
| LCP | <2.5s |
| FID | <100ms |
| CLS | <0.1 |

---

## 📦 文件清单

```
css/
  └── mobile.css          # 移动端优化样式

js/
  ├── performance.js      # 性能优化模块
  ├── accessibility.js    # 无障碍访问模块
  └── seo.js             # SEO优化模块

manifest.json            # PWA配置
```

---

## 🔧 引入方式

```html
<!-- CSS -->
<link rel="stylesheet" href="css/mobile.css">

<!-- JavaScript（body标签前） -->
<script src="js/performance.js"></script>
<script src="js/accessibility.js"></script>
<script src="js/seo.js"></script>
```

---

## ✅ 检查清单

### 性能
- [ ] 图片使用懒加载
- [ ] 启用资源缓存
- [ ] 代码按需加载
- [ ] 性能监控已测试

### 移动端
- [ ] 触摸目标 ≥ 44px
- [ ] 输入框字体 ≥ 16px
- [ ] 横屏布局已测试
- [ ] 安全区域已适配

### 无障碍
- [ ] 键盘导航可用
- [ ] ARIA标签完整
- [ ] 对比度符合标准
- [ ] 屏幕阅读器测试

### SEO
- [ ] Meta标签完整
- [ ] OG图片1200×630
- [ ] 结构化数据有效
- [ ] sitemap.xml已生成

---

## 📞 问题排查

### 懒加载失效
1. 检查`data-src`属性
2. 查看浏览器兼容性
3. 查看控制台错误

### 键盘导航问题
1. 检查`tabindex`属性
2. 测试焦点样式
3. 尝试不同浏览器

### SEO未生效
1. 确认JS已加载
2. 检查CONFIG配置
3. 查看页面源代码

---

**详细文档**：请参阅 [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md)
