# 🎨 分享预览图说明

## 📁 所需文件

### `share-preview.jpg` （必需，当前缺失）

- **用途**：微信朋友圈分享时的预览图
- **尺寸**：1200 × 630 像素
- **格式**：JPG 或 PNG
- **文件大小**：建议 < 500KB

---

## 🚀 快速生成

### 方法 1：使用自动生成工具

1. 在浏览器中打开 `share-preview-placeholder.html`
2. 点击"生成预览图"按钮
3. 点击"下载图片"
4. 将下载的文件重命名为 `share-preview.jpg`
5. 移动到当前目录（`assets/images/`）

```bash
# Mac/Linux
mv ~/Downloads/share-preview.jpg .

# Windows
move %USERPROFILE%\Downloads\share-preview.jpg .
```

### 方法 2：使用 Canva（推荐）

1. 访问 https://www.canva.com
2. 创建自定义尺寸：1200 × 630 像素
3. 使用婚纱照 + 文字设计
4. 导出为 JPG
5. 重命名为 `share-preview.jpg`
6. 放到此目录

---

## ✅ 检查

确保文件存在：

```bash
ls -lh share-preview.jpg
```

应该看到类似：

```
-rw-r--r--  1 user  staff   350K Feb  3 15:00 share-preview.jpg
```

---

## 📤 部署

```bash
cd /Users/taot/Desktop/wedding/wedding-candy-system
git add assets/images/share-preview.jpg
git commit -m "添加微信分享预览图"
git push
```

---

## 💡 提示

- ✅ 使用高质量婚纱照效果最好
- ✅ 图片要清晰、美观、有吸引力
- ✅ 包含新人姓名和婚期信息
- ✅ 颜色搭配要和谐

---

**详细教程**：查看项目根目录的 `WECHAT-SHARE-GUIDE.md`
