# 🎯 快速部署清单

## ⚡ 5分钟快速部署

### 前置检查 ✅

- [ ] 已修改新人信息（`js/config.js`）
- [ ] 已修改管理员密码
- [ ] 已准备背景图片（可选）
- [ ] 已清空测试数据

### 步骤 1: 优化文件（2分钟）

```bash
cd wedding-candy-system

# 压缩 CSS/JS（必须）
bash build/minify.sh

# 拆分省市区数据（可选，推荐）
node build/split-regions.js
```

### 步骤 2: Git 提交（1分钟）

```bash
# 初始化（首次）
git init
git add .
git commit -m "Initial: Wedding candy system"

# 创建 GitHub 仓库
# 访问 https://github.com/new
# 仓库名：wedding-candy

# 推送
git remote add origin https://github.com/你的用户名/wedding-candy.git
git push -u origin main
```

### 步骤 3: 部署到 Vercel（2分钟）⭐推荐

```bash
# 访问 https://vercel.com
# 1. 用 GitHub 登录
# 2. 点击 "New Project"
# 3. 选择 wedding-candy 仓库
# 4. 点击 "Deploy"
# 5. 等待 1-2 分钟
# 6. ✅ 完成！
```

或者使用 GitHub Pages：

```bash
# GitHub 仓库页面
# Settings → Pages
# Source: main 分支
# 等待 5-10 分钟
# ✅ 完成！
```

---

## 📊 性能对比

| 方式 | 速度 | 评级 |
|------|------|------|
| 本地服务器 | 3.5s | ⭐⭐⭐ |
| GitHub Pages | 1.2s | ⭐⭐⭐⭐ |
| **Vercel（推荐）** | **0.8s** | **⭐⭐⭐⭐⭐** |

**提升效果：比本地快 4-5倍！** 🚀

---

## 🔧 一键部署（推荐）

```bash
# 运行一键脚本
./deploy.sh

# 按提示操作：
# 1. 压缩文件？ → Y
# 2. 拆分数据？ → Y (推荐)
# 3. 更新HTML？ → Y
# 4. Git提交？ → Y
# 5. 推送部署？ → Y

# ✅ 完成！
```

---

## 📝 更新网站

```bash
# 修改代码后
git add .
git commit -m "Update content"
git push

# Vercel: 1-2分钟自动更新
# GitHub Pages: 5-10分钟自动更新
```

---

## ✅ 验证部署

访问你的网站，检查：

- [ ] 首页正常显示
- [ ] 表单可以提交
- [ ] 后台可以登录
- [ ] 移动端正常
- [ ] 加载速度快

---

## 🆘 遇到问题？

1. **页面空白** → 检查控制台错误，确认文件路径
2. **加载慢** → 确认使用了 .min 文件
3. **表单不工作** → 检查 LocalStorage 是否启用
4. **后台登录失败** → 确认密码是否修改

---

## 📚 详细文档

- **完整部署指南**：`DEPLOY-GUIDE.md`
- **优化工具使用**：`OPTIMIZATION-USAGE.md`
- **性能报告**：`PERFORMANCE-SUMMARY.md`

---

**🎉 快速部署完成后，你的网站将获得 4-5倍速度提升！**

**祝新婚快乐！💝**
