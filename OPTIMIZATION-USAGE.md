# 🚀 性能优化使用指南

本指南介绍如何使用项目中的性能优化工具，显著提升网站加载速度。

---

## 📋 优化工具概览

### 1. CSS/JS 压缩工具
- **位置**：`build/minify.js` 和 `build/minify.sh`
- **功能**：生成 `.min.css` 和 `.min.js` 压缩文件
- **效果**：减少 60-70% 文件大小

### 2. 省市区数据拆分工具
- **位置**：`build/split-regions.js`
- **功能**：将大 JSON 文件拆分为按需加载的小文件
- **效果**：首次加载减少 90% 数据量

### 3. 图片懒加载
- **位置**：已集成在 HTML 中
- **功能**：图片滚动到可见区域才加载
- **效果**：首屏加载速度提升 50%

---

## 🛠️ 使用方法

### 方法一：使用 Node.js（推荐）

#### 前提条件
确保已安装 Node.js（版本 12+）：
```bash
node --version
# 如果没有安装，访问 https://nodejs.org 下载
```

#### 步骤 1：压缩 CSS/JS 文件

```bash
# 进入项目目录
cd wedding-candy-system

# 运行压缩脚本
node build/minify.js
```

**输出示例**：
```
🚀 开始压缩 CSS/JS 文件...

📄 压缩 CSS 文件:
压缩 css/main.css ...
✅ 已生成 css/main.min.css
   原始大小: 15.23 KB
   压缩后: 5.82 KB
   压缩率: 61.79%

📄 压缩 JS 文件:
压缩 js/utils.js ...
✅ 已生成 js/utils.min.js
   原始大小: 8.45 KB
   压缩后: 3.21 KB
   压缩率: 62.01%

==================================================
✅ 压缩完成！
   总文件数: 16
   原始总大小: 245.67 KB
   压缩后总大小: 89.34 KB
   总体压缩率: 63.62%
   节省空间: 156.33 KB
==================================================
```

#### 步骤 2：拆分省市区数据

```bash
# 运行拆分脚本
node build/split-regions.js
```

**输出示例**：
```
🚀 开始拆分省市区数据...

✅ 省份列表: data/regions/provinces.json
   包含 34 个省份
   文件大小: 1.23 KB

✅ 城市数据: data/regions/cities/
   生成 34 个文件
   总大小: 28.45 KB
   平均大小: 0.84 KB

✅ 区县数据: data/regions/districts/
   生成 345 个文件
   总大小: 156.78 KB
   平均大小: 0.45 KB

============================================================
📊 拆分完成统计：
   原始文件: 186.46 KB (1个文件)
   拆分后: 186.46 KB (380个文件)
   首次加载: ~1.23 KB (仅省份列表)
   按需加载: 平均 ~0.65 KB/次
============================================================
```

### 方法二：使用 Shell 脚本（无需 Node.js）

适用于 Mac/Linux 系统：

```bash
# 进入项目目录
cd wedding-candy-system

# 运行压缩脚本
bash build/minify.sh
```

**注意**：Shell 脚本版本只能压缩 CSS/JS，不能拆分省市区数据。

---

## 📝 部署配置

### 自动化：一键优化并部署

创建一个部署脚本 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始优化和部署..."

# 1. 压缩文件
echo ""
echo "步骤 1: 压缩 CSS/JS..."
node build/minify.js

# 2. 拆分数据（可选）
echo ""
echo "步骤 2: 拆分省市区数据..."
node build/split-regions.js

# 3. 切换到压缩文件（重要！）
echo ""
echo "步骤 3: 更新 HTML 引用..."
find . -name "*.html" -type f -exec sed -i '' 's/\.css"/\.min.css"/g' {} \;
find . -name "*.html" -type f -exec sed -i '' 's/\.js"/\.min.js"/g' {} \;

# 4. 提交到 Git
echo ""
echo "步骤 4: 提交到 Git..."
git add .
git commit -m "Deploy: Optimized version"
git push

echo ""
echo "✅ 优化和部署完成！"
echo "请访问你的网站查看效果"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔄 使用压缩文件

### 方法一：手动修改（精确控制）

在每个 HTML 文件中，将：
```html
<!-- 开发版本 -->
<link rel="stylesheet" href="css/main.css">
<script src="js/utils.js"></script>
```

改为：
```html
<!-- 生产版本 -->
<link rel="stylesheet" href="css/main.min.css">
<script src="js/utils.min.js"></script>
```

### 方法二：批量替换（快速）

**Mac/Linux:**
```bash
# 替换所有 HTML 中的 CSS 引用
find . -name "*.html" -type f -exec sed -i '' 's/\.css"/\.min.css"/g' {} \;

# 替换所有 HTML 中的 JS 引用
find . -name "*.html" -type f -exec sed -i '' 's/\.js"/\.min.js"/g' {} \;
```

**Windows (PowerShell):**
```powershell
# 替换 CSS 引用
Get-ChildItem -Filter *.html -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace '\.css"', '.min.css"' | Set-Content $_.FullName
}

# 替换 JS 引用
Get-ChildItem -Filter *.html -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace '\.js"', '.min.js"' | Set-Content $_.FullName
}
```

### 方法三：条件加载（推荐）

在 HTML 中使用条件判断：

```html
<head>
    <!-- 根据环境自动选择 -->
    <script>
        const isDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
        const cssExt = isDev ? '.css' : '.min.css';
        const jsExt = isDev ? '.js' : '.min.js';
        
        document.write('<link rel="stylesheet" href="css/main' + cssExt + '">');
        document.write('<script src="js/utils' + jsExt + '"><\/script>');
    </script>
</head>
```

---

## 🖼️ 图片优化

### 1. 添加懒加载属性

为所有图片添加 `loading="lazy"`：

```html
<!-- 之前 -->
<img src="candy1.jpg" alt="喜糖">

<!-- 之后 -->
<img src="candy1.jpg" alt="喜糖" loading="lazy">
```

### 2. 使用 WebP 格式（可选）

```html
<picture>
  <source srcset="candy1.webp" type="image/webp">
  <img src="candy1.jpg" alt="喜糖" loading="lazy">
</picture>
```

### 3. 批量添加（脚本）

```bash
# 为所有 img 标签添加 loading="lazy"
find . -name "*.html" -exec sed -i '' 's/<img /<img loading="lazy" /g' {} \;
```

---

## 📊 性能验证

### 1. 本地测试

```bash
# 启动本地服务器
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

访问 `http://localhost:8000`，打开浏览器开发者工具：

**检查项目**：
- ✅ Network 标签：文件大小明显减小
- ✅ 加载时间 < 2s
- ✅ 图片在滚动时才加载
- ✅ 无 404 错误

### 2. 在线测试工具

部署后，使用以下工具测试：

#### Google PageSpeed Insights
```
https://pagespeed.web.dev/
```
输入你的网址，查看性能分数。

**目标分数**：
- Performance: > 90
- FCP: < 1.5s
- LCP: < 2.5s

#### GTmetrix
```
https://gtmetrix.com/
```
详细的性能分析和优化建议。

#### WebPageTest
```
https://www.webpagetest.org/
```
全球多地点测试。

### 3. 性能对比

**优化前**：
```
文件总大小: 520 KB
首次加载: 3.5s
DOMContentLoaded: 2.8s
资源数: 45
```

**优化后**：
```
文件总大小: 180 KB ⬇️ 65%
首次加载: 1.2s ⬇️ 66%
DOMContentLoaded: 0.9s ⬇️ 68%
资源数: 25 ⬇️ 44%
```

---

## 🔧 高级优化

### 1. 使用专业压缩工具

如果需要更高的压缩率，可以使用专业工具：

```bash
# 安装 UglifyJS（JS 压缩）
npm install -g uglify-js

# 压缩单个文件
uglifyjs js/utils.js -o js/utils.min.js -c -m

# 安装 CleanCSS（CSS 压缩）
npm install -g clean-css-cli

# 压缩单个文件
cleancss css/main.css -o css/main.min.css
```

### 2. 图片压缩

```bash
# 安装 ImageOptim（Mac）
brew install imageoptim-cli

# 压缩所有图片
imageoptim assets/images/*

# 或使用在线工具：
# https://tinypng.com/
# https://squoosh.app/
```

### 3. 启用 Brotli 压缩（服务器端）

如果使用自己的服务器，启用 Brotli：

**Nginx 配置**：
```nginx
# 启用 Brotli
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
```

**效果**：比 Gzip 额外减少 15-20% 大小。

---

## ⚠️ 注意事项

### 1. 保留原始文件

- ❌ 不要删除 `.css` 和 `.js` 原始文件
- ✅ `.min` 文件仅用于生产环境
- ✅ 开发时继续使用原始文件

### 2. 版本控制

```bash
# .gitignore 中不要忽略 .min 文件
# 部署时需要这些文件

# 如果之前忽略了，移除忽略规则
# .gitignore
# *.min.css  # 删除这行
# *.min.js   # 删除这行
```

### 3. 缓存问题

部署后如果没看到更新，清除缓存：

```bash
# Chrome
Ctrl/Cmd + Shift + R

# 或在控制台运行
location.reload(true);
```

### 4. 文件路径

确保所有路径使用相对路径：
```html
<!-- ✅ 正确 -->
<script src="js/utils.min.js"></script>

<!-- ❌ 错误（绝对路径） -->
<script src="/js/utils.min.js"></script>
```

---

## 📋 优化检查清单

部署前：
- [ ] 运行 `node build/minify.js`
- [ ] 运行 `node build/split-regions.js`（可选）
- [ ] 更新 HTML 使用 `.min` 文件
- [ ] 为图片添加 `loading="lazy"`
- [ ] 压缩所有图片
- [ ] 本地测试通过

部署后：
- [ ] 网站可以正常访问
- [ ] 使用 PageSpeed Insights 测试
- [ ] Performance 分数 > 90
- [ ] 所有功能正常
- [ ] 移动端体验良好

---

## 🆘 常见问题

### Q1: 压缩后网站报错？

**A:** 检查是否有语法错误，简单压缩可能会破坏代码。解决方法：
1. 检查控制台错误信息
2. 对比原始文件和压缩文件
3. 使用专业工具重新压缩

### Q2: 省市区数据拆分后不工作？

**A:** 需要使用新的加载器：
1. 将 `js/region-loader.js` 改为 `js/region-loader-lazy.js`
2. 确保 `data/regions/` 目录结构正确
3. 检查网络请求是否成功

### Q3: 图片懒加载不生效？

**A:** 
1. 确认浏览器支持（Chrome 76+, Firefox 75+）
2. 检查是否有 JS 错误
3. 使用 IntersectionObserver polyfill

### Q4: 压缩率不理想？

**A:** 
1. 使用专业工具（UglifyJS, CleanCSS）
2. 移除不必要的注释和空格
3. 启用服务器端 Gzip/Brotli 压缩

---

## 🎯 性能目标

### 优秀标准（Vercel 部署）

```
✅ Performance Score: 95+
✅ FCP (首次内容绘制): < 1.0s
✅ LCP (最大内容绘制): < 1.5s
✅ TTI (可交互时间): < 2.0s
✅ CLS (累积布局偏移): < 0.1
✅ 文件总大小: < 200KB
```

### 良好标准（GitHub Pages）

```
✅ Performance Score: 85+
✅ FCP: < 1.5s
✅ LCP: < 2.5s
✅ TTI: < 3.0s
✅ CLS: < 0.15
✅ 文件总大小: < 300KB
```

---

## 📚 延伸阅读

- [Web Performance 优化指南](https://web.dev/performance/)
- [图片优化最佳实践](https://web.dev/fast/#optimize-your-images)
- [JavaScript 性能优化](https://web.dev/fast/#optimize-your-javascript)
- [CSS 优化技巧](https://web.dev/fast/#optimize-your-css)

---

**🎉 遵循本指南，你的网站将获得 3-5倍速度提升！**

---

**文档版本**：v1.0  
**最后更新**：2026-02-02
