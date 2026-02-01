# 快速使用指南

## 🚀 立即开始

### 第一步：打开系统
```bash
cd wedding-candy-system

# 使用Python启动（推荐）
python -m http.server 8000

# 或使用Python 3
python3 -m http.server 8000

# 在浏览器中访问
http://localhost:8000
```

### 第二步：宾客填写信息
1. 打开首页 `index.html`
2. 点击"填写领取信息"
3. 填写完整信息并提交

### 第三步：管理员查看数据
1. 访问 `admin.html`
2. 登录信息：
   - 用户名：`admin`
   - 密码：`wedding2026`
3. 查看、搜索、导出数据

## ⚠️ 重要提示

### 修改管理员密码
在正式使用前，请修改默认密码！

打开 `js/config.js`，找到：
```javascript
ADMIN: {
    USERNAME: 'admin',
    PASSWORD: 'wedding2026',  // ← 改成你的密码
},
```

### 数据备份
- 数据存储在浏览器中
- 清空浏览器数据会丢失记录
- 请定期使用"导出Excel"或"导出JSON"备份

## 📱 访问方式

### 本地访问
```
首页：http://localhost:8000/index.html
表单：http://localhost:8000/form.html
管理：http://localhost:8000/admin.html
```

### 分享给宾客
部署到服务器后，将首页链接分享给宾客即可。

## 🎯 主要功能

### 宾客端
- ✅ 填写收货信息
- ✅ 省市区选择
- ✅ 留言祝福

### 管理端
- ✅ 查看所有提交
- ✅ 搜索记录
- ✅ 导出Excel/JSON
- ✅ 标记处理状态
- ✅ 删除记录

## 💡 小贴士

1. **测试一下**：先提交一条测试数据，确保功能正常
2. **备份数据**：定期导出数据到Excel
3. **隐私保护**：所有数据只存在你的浏览器中
4. **手机访问**：完美支持手机填写和管理

## 🆘 遇到问题？

### 页面无法显示
- 确保使用HTTP服务器运行（不能直接双击HTML文件）
- 检查浏览器控制台是否有错误

### 数据无法保存
- 检查浏览器是否允许LocalStorage
- 尝试在无痕模式下测试

### 省市区无法选择
- 确保 `data/recipients.json` 文件存在
- 检查文件路径是否正确

---

更多详细信息请查看 `README.md`

祝使用愉快！💝
