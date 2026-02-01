# 资源文件说明

## 📁 目录用途

### images/
用于存放系统使用的图片资源，例如：
- 婚礼照片
- 喜糖礼盒图片
- 装饰图案
- Logo图片

### fonts/
用于存放自定义字体文件（可选），例如：
- 特殊字体文件（.ttf, .woff, .woff2）
- 手写字体
- 艺术字体

## 💡 使用建议

1. **图片优化**
   - 建议使用压缩后的图片（推荐使用 TinyPNG 等工具）
   - 建议尺寸不超过 1920px 宽度
   - 格式推荐：JPG（照片）、PNG（透明背景）、WebP（现代浏览器）

2. **字体使用**
   - 系统已配置常用中文字体
   - 如需特殊字体，将字体文件放入 fonts/ 目录
   - 在 CSS 中使用 @font-face 引入

3. **文件命名**
   - 使用英文命名，避免中文
   - 使用小写字母和连字符
   - 例如：wedding-photo.jpg, candy-box.png

## 📝 示例

### 在HTML中使用图片
```html
<img src="assets/images/wedding-photo.jpg" alt="婚礼照片">
```

### 在CSS中使用图片
```css
.hero {
    background-image: url('../assets/images/background.jpg');
}
```

### 在CSS中使用字体
```css
@font-face {
    font-family: 'CustomFont';
    src: url('../assets/fonts/custom-font.woff2') format('woff2');
}

body {
    font-family: 'CustomFont', sans-serif;
}
```

## 🎨 推荐资源

- **免费图片**: Unsplash, Pexels, Pixabay
- **图标**: Font Awesome, Material Icons
- **字体**: Google Fonts, 字体天下

---

注意：本系统默认不包含图片和字体文件，请根据需要自行添加。
