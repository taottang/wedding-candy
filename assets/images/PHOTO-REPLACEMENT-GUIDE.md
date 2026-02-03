# 📸 婚礼相册图片替换指南

## 🎯 快速替换步骤

### 1. 准备照片
准备 **8张** 婚礼照片，建议规格：
- 📏 尺寸：**800×1000 像素** （宽×高）
- 📐 比例：**4:5** 竖向照片效果最佳
- 💾 格式：**JPG** 或 **PNG**
- 📦 大小：每张 **200KB - 500KB** 为宜

### 2. 重命名照片
将照片重命名为以下文件名：
```
wedding-photo1.jpg
wedding-photo2.jpg
wedding-photo3.jpg
wedding-photo4.jpg
wedding-photo5.jpg
wedding-photo6.jpg
wedding-photo7.jpg
wedding-photo8.jpg
```

### 3. 放置照片
将 8 张照片放入项目的 `assets/images/` 文件夹：
```
wedding-candy-system/
└── assets/
    └── images/
        ├── wedding-photo1.jpg  ← 放这里
        ├── wedding-photo2.jpg  ← 放这里
        ├── wedding-photo3.jpg  ← 放这里
        ├── wedding-photo4.jpg  ← 放这里
        ├── wedding-photo5.jpg  ← 放这里
        ├── wedding-photo6.jpg  ← 放这里
        ├── wedding-photo7.jpg  ← 放这里
        └── wedding-photo8.jpg  ← 放这里
```

### 4. 修改代码
打开 `index.html`，找到相册部分（约 1045 行附近），将占位符替换为实际图片：

**修改前（占位符）：**
```html
<div class="gallery-item">
    <div class="gallery-placeholder">
        💕
        <div class="gallery-placeholder-text">幸福时刻</div>
    </div>
    <!-- 实际使用时替换为：<img src="assets/images/wedding-photo1.jpg" alt="婚礼照片1" loading="lazy"> -->
</div>
```

**修改后（实际图片）：**
```html
<div class="gallery-item">
    <img src="assets/images/wedding-photo1.jpg" alt="婚礼照片1" loading="lazy">
</div>
```

### 5. 批量替换
总共需要替换 **16 处**（每张照片出现2次，用于无限循环）：
- 第 1-8 张：第一组照片
- 第 9-16 张：第二组照片（与第一组相同）

---

## 🎨 推荐照片内容

为了获得最佳展示效果，建议选择以下类型的照片：

| 序号 | 推荐内容 | 拍摄建议 |
|------|---------|---------|
| 1 | 求婚场景 | 温馨浪漫 |
| 2 | 交换戒指 | 特写镜头 |
| 3 | 新人合照 | 经典姿势 |
| 4 | 婚礼现场 | 场景全景 |
| 5 | 亲友合影 | 欢乐氛围 |
| 6 | 婚纱照 | 唯美意境 |
| 7 | 甜蜜瞬间 | 自然互动 |
| 8 | 幸福时刻 | 感人场景 |

---

## 🛠️ 高级自定义

### 修改照片数量
如果想展示更多或更少的照片：

1. 在 `index.html` 中添加或删除 `.gallery-item`
2. **重要**：第二组照片数量必须与第一组相同（用于无限循环）
3. 修改 CSS 动画时长（照片越多，动画时间越长）：

```css
/* 在 index.html 的 <style> 标签中找到 */
@keyframes autoScroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

/* 修改动画时长（当前为 40秒） */
.gallery-track {
    animation: autoScroll 40s linear infinite;
    /* 建议：每张照片 5秒，8张照片 = 40秒 */
}
```

### 修改照片尺寸
在 `index.html` 的 CSS 部分修改：

```css
/* 桌面端 */
.gallery-item {
    width: 350px;   /* 宽度 */
    height: 450px;  /* 高度 */
}

/* 移动端 */
@media (max-width: 768px) {
    .gallery-item {
        width: 280px;
        height: 360px;
    }
}
```

### 修改滚动速度
修改动画时长：
- **更快滚动**：减少秒数，如 `30s`
- **更慢滚动**：增加秒数，如 `60s`

```css
.gallery-track {
    animation: autoScroll 30s linear infinite; /* 30秒完成一轮 */
}
```

---

## 📱 移动端测试

替换照片后，务必在移动设备上测试：

1. **触摸滑动**：手指左右滑动相册
2. **自动播放**：松开后自动恢复滚动
3. **加载速度**：确保照片大小适中

---

## ✅ 检查清单

完成替换后，请检查：

- [ ] 准备了 8 张照片
- [ ] 照片已重命名为 `wedding-photo1.jpg` 到 `wedding-photo8.jpg`
- [ ] 照片已放入 `assets/images/` 文件夹
- [ ] `index.html` 中已替换所有占位符（16处）
- [ ] 本地测试：照片正常显示
- [ ] 移动端测试：滚动流畅
- [ ] 部署后测试：线上正常

---

## 🎯 快捷批量替换

使用文本编辑器的"查找替换"功能：

**查找：**
```html
<div class="gallery-placeholder">
    💕
    <div class="gallery-placeholder-text">幸福时刻</div>
</div>
<!-- 实际使用时替换为：<img src="assets/images/wedding-photo1.jpg" alt="婚礼照片1" loading="lazy"> -->
```

**替换为：**
```html
<img src="assets/images/wedding-photo1.jpg" alt="婚礼照片1" loading="lazy">
```

对所有 8 张照片重复此操作（记得修改数字 1-8）。

---

## 💡 温馨提示

1. **照片优化**：建议使用在线工具压缩照片（如 TinyPNG）
2. **加载速度**：照片总大小建议控制在 3MB 以内
3. **备份原文件**：替换前先备份 `index.html`
4. **版权注意**：确保使用的照片有使用权

---

## 🆘 常见问题

**Q：照片显示变形怎么办？**
A：确保照片比例为 4:5（竖向），或修改 CSS 中的 `object-fit` 属性。

**Q：可以使用横向照片吗？**
A：可以，但需要调整 `.gallery-item` 的宽高比例。

**Q：照片加载很慢怎么办？**
A：压缩照片大小，每张控制在 200-500KB。

**Q：如何让相册停止自动滚动？**
A：在 CSS 中删除 `animation` 属性，或设置 `animation-play-state: paused;`

---

**🎉 完成后别忘了部署到 Cloudflare Pages，让亲朋好友看到精彩瞬间！**
