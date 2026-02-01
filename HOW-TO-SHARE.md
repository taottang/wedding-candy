# 🚀 如何部署并分享给好友

> **目标**：获得一个可以分享给好友的链接，让他们填写地址领取喜糖

---

## 📋 快速导航

- [方法一：Vercel部署（推荐）](#方法一vercel部署推荐)
- [方法二：GitHub Pages部署](#方法二github-pages部署)
- [如何分享给好友](#如何分享给好友)
- [如何更新代码](#代码更新后如何更新)

---

## 方法一：Vercel部署（推荐）⭐

**优点**：最快（5分钟），国内访问快，自动HTTPS，完全免费

### 步骤1：推送代码到GitHub（首次）

```bash
# 1. 打开终端，进入项目目录
cd /Users/taot/Desktop/wedding/wedding-candy-system

# 2. 初始化Git（如果还没有）
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Wedding candy system ready"

# 5. 在GitHub创建仓库
# 访问：https://github.com/new
# 仓库名：wedding-candy
# 设置为：Public（公开）
# 点击"Create repository"

# 6. 关联远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/wedding-candy.git

# 7. 推送代码
git branch -M main
git push -u origin main
```

### 步骤2：在Vercel部署

```bash
# 方法A：使用网页（更简单）
1. 访问：https://vercel.com
2. 点击"Sign Up"，选择"Continue with GitHub"
3. 授权登录
4. 点击"New Project"
5. 选择 wedding-candy 仓库
6. 点击"Import"
7. 点击"Deploy"
8. 等待1-2分钟，完成！

# 方法B：使用命令行
npm install -g vercel
vercel login
vercel
# 按提示操作即可
```

### 步骤3：获取链接

部署完成后，你会看到：

```
🎉 Congratulations! 
Your project is live at:

https://wedding-candy-abc123.vercel.app

或者自定义域名：
https://wedding.vercel.app
```

**这就是你要分享的链接！** 📱

---

## 方法二：GitHub Pages部署

**优点**：完全免费，操作简单  
**缺点**：国内访问可能较慢

### 步骤1：推送到GitHub（同上）

参考方法一的步骤1

### 步骤2：启用GitHub Pages

```bash
1. 打开你的仓库页面
   https://github.com/你的用户名/wedding-candy

2. 点击"Settings"（设置）

3. 左侧菜单找到"Pages"

4. Source（源）选择：
   - Branch: main
   - Folder: / (root)

5. 点击"Save"

6. 等待5-10分钟

7. 页面会显示你的链接：
   https://你的用户名.github.io/wedding-candy/
```

**这就是你要分享的链接！** 📱

---

## 📱 如何分享给好友

### 获得链接后

**Vercel链接示例：**
```
https://wedding-candy-abc123.vercel.app
```

**GitHub Pages链接示例：**
```
https://username.github.io/wedding-candy/
```

### 分享方式

#### 方式1：直接发送链接（推荐）

**微信好友/群聊：**
```
【婚礼喜糖领取】
邓蓓 & 唐韬

我们即将步入婚姻殿堂 💝
为您准备了精美喜糖礼盒

点击链接填写地址即可免费领取：
https://你的链接.vercel.app

期待您的祝福~
```

**朋友圈：**
```
1. 复制上面的链接
2. 打开微信朋友圈
3. 长按相机图标
4. 选择"纯文字"
5. 粘贴链接和文字
6. 发送
```

#### 方式2：生成二维码

```bash
# 访问在线工具
https://cli.im/

# 输入你的链接
https://你的链接.vercel.app

# 生成二维码
# 下载图片

# 可以：
- 发到微信群
- 打印成卡片
- 放在请柬里
```

#### 方式3：短链接（可选）

```bash
# 如果链接太长，可以使用短链接服务

# 新浪短链接
https://sina.lt/

# 百度短链接
https://dwz.cn/

# 输入你的长链接
# 获得短链接（如：https://t.cn/xxx）
```

---

## 🔄 代码更新后如何更新

### 场景：你修改了代码，需要更新线上版本

#### Vercel自动更新（推荐）

```bash
# 1. 修改代码后，保存

# 2. 提交到Git
git add .
git commit -m "更新内容说明"

# 3. 推送到GitHub
git push

# 4. 完成！Vercel会自动检测并重新部署
# 约1-2分钟后，你的链接会自动更新
# 好友访问同一个链接就能看到新版本
```

**注意**：链接不会变，好友不需要重新获取！

#### GitHub Pages手动更新

```bash
# 1. 修改代码后，保存

# 2. 提交到Git
git add .
git commit -m "更新内容说明"

# 3. 推送到GitHub
git push

# 4. 完成！GitHub Pages会自动更新
# 约5-10分钟后生效
# 链接不变，好友继续访问原链接即可
```

### 常见更新场景

#### 更新1：修改新人信息

```bash
# 修改文件
vim js/config.js

# 修改以下内容
BRIDE_NAME: '新的名字'
GROOM_NAME: '新的名字'
WEDDING_DATE: '新的日期'

# 保存后推送
git add .
git commit -m "更新新人信息"
git push
```

#### 更新2：修改页面文字

```bash
# 修改首页
vim index.html

# 修改表单页
vim form.html

# 保存后推送
git add .
git commit -m "更新页面文字"
git push
```

#### 更新3：更换背景图片

```bash
# 1. 将新图片放到 assets/images/
cp 新图片.jpg assets/images/bg1.jpg

# 2. 修改 index.html，取消注释图片代码

# 3. 推送
git add .
git commit -m "更新背景图片"
git push
```

---

## ✅ 快速检查清单

### 部署前

- [ ] 已修改 `js/config.js` 中的新人信息
- [ ] 已修改管理员密码（不要用默认密码！）
- [ ] 已清空测试数据
- [ ] 本地测试功能正常

### 部署后

- [ ] 访问链接，确认可以打开
- [ ] 测试表单提交功能
- [ ] 测试后台登录
- [ ] 在手机上测试
- [ ] 在微信中测试

### 分享前

- [ ] 链接可以正常访问
- [ ] 所有功能测试通过
- [ ] 准备好分享文案
- [ ] 可选：生成二维码

---

## 🆘 常见问题

### Q1: 部署后打开是空白页？

**A: 检查以下几点**
```bash
# 1. 确认文件都已推送
git status

# 2. 查看浏览器控制台错误
F12 → Console

# 3. 确认index.html在根目录
ls index.html

# 4. 清除浏览器缓存
Ctrl/Cmd + Shift + R
```

### Q2: 好友无法打开链接？

**A: 可能原因**
```bash
# 1. 链接复制不完整
- 确保复制了完整链接，包括 https://

# 2. 微信中被拦截
- 首次打开可能提示"非微信官方"
- 点击"继续访问"即可

# 3. 部署还未完成
- Vercel：等待1-2分钟
- GitHub Pages：等待5-10分钟
```

### Q3: 更新代码后好友看不到新版本？

**A: 清除缓存**
```bash
# 方法1：等待（推荐）
- Vercel: 1-2分钟后自动更新
- GitHub Pages: 5-10分钟后更新

# 方法2：清除缓存
- 让好友刷新页面（Ctrl+R）
- 或强制刷新（Ctrl+Shift+R）

# 方法3：确认部署成功
- Vercel: 查看 dashboard.vercel.com
- GitHub Pages: 查看仓库的 Actions 标签
```

### Q4: 如何查看有多少人访问？

**A: 使用统计工具**

**Vercel Analytics（免费）：**
```bash
1. 登录 vercel.com
2. 选择你的项目
3. 点击 "Analytics"
4. 查看访问量、来源等数据
```

**Google Analytics（免费）：**
```bash
1. 注册 analytics.google.com
2. 获取跟踪代码
3. 添加到 index.html 的 <head> 中
4. 推送更新
5. 在GA后台查看数据
```

---

## 💡 使用技巧

### 技巧1：自定义域名（可选）

如果你有自己的域名（如：candy.example.com）

**Vercel：**
```bash
1. 登录 vercel.com
2. 项目 → Settings → Domains
3. 添加你的域名
4. 在域名DNS设置中添加CNAME记录
5. 等待生效（10-30分钟）
```

**好处**：链接更简短、更专业

### 技巧2：批量通知好友

```bash
# 准备一个Excel/表格
列出好友的微信

# 使用群发助手
1. 微信 → 通讯录 → 新的朋友
2. 群发助手
3. 选择好友
4. 粘贴链接和文字
5. 发送
```

### 技巧3：设置到期时间

```javascript
// 在 index.html 中添加代码

// 设置截止日期
const deadline = new Date('2026-02-15');
const now = new Date();

if (now > deadline) {
    alert('喜糖领取已截止，感谢您的关注！');
    // 可以跳转到其他页面或显示提示
}
```

---

## 📊 推荐配置对比

| 方案 | 速度 | 国内访问 | 自动更新 | 难度 | 推荐度 |
|------|------|---------|---------|------|--------|
| **Vercel** | ⚡⚡⚡⚡⚡ | ✅ 快 | ✅ 1-2分钟 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ⚡⚡⚡ | ⚠️ 较慢 | ✅ 5-10分钟 | ⭐ | ⭐⭐⭐⭐ |

**结论**：强烈推荐使用 Vercel！

---

## 🎯 完整流程总结

```
步骤1: 修改配置
↓
步骤2: 推送到GitHub
↓
步骤3: 部署到Vercel/GitHub Pages
↓
步骤4: 获得链接
↓
步骤5: 分享给好友
↓
步骤6: 好友填写地址
↓
步骤7: 后台查看数据
↓
步骤8: 导出Excel
↓
步骤9: 安排配送
```

---

## 📞 需要帮助？

### 部署问题

1. **查看部署状态**
   - Vercel: https://vercel.com/dashboard
   - GitHub: 仓库 → Actions

2. **查看日志**
   - Vercel: 项目 → Deployments → 点击某次部署
   - GitHub: Actions → 点击工作流查看详情

3. **常用命令**
```bash
# 查看Git状态
git status

# 查看提交历史
git log --oneline

# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 强制推送（谨慎使用）
git push -f origin main
```

---

## 🎉 成功案例

### 部署完成标志

当你看到以下内容，说明部署成功：

**Vercel：**
```
✅ Production: Ready
🔗 https://wedding-candy-abc123.vercel.app
```

**GitHub Pages：**
```
✅ Your site is published at
🔗 https://username.github.io/wedding-candy/
```

### 测试通过标志

- ✅ 链接可以打开
- ✅ 页面显示正常
- ✅ 表单可以提交
- ✅ 手机访问正常
- ✅ 微信可以打开

**此时就可以放心分享给好友了！** 🎊

---

## 📝 分享文案模板

### 模板1：正式版

```
【邓蓓 & 唐韬的婚礼喜糖】

亲爱的朋友们：

我们即将步入婚姻殿堂，特别准备了精美喜糖礼盒，希望把这份甜蜜和喜悦分享给您。

🎁 点击链接填写地址即可免费领取
🔗 https://你的链接.vercel.app

📦 我们将在3-5个工作日内为您配送
💝 期待您的祝福

邓蓓 & 唐韬
2026年2月1日
```

### 模板2：轻松版

```
嘿，好久不见！💝

我们要结婚啦！
准备了喜糖想送给你

点这个链接填个地址：
https://你的链接.vercel.app

记得来哦~
```

### 模板3：简洁版

```
【喜糖领取】
https://你的链接.vercel.app
点击填写地址，免费送到家 🎁
```

---

**祝您部署顺利，新婚快乐！** 🎊💝

---

**文档版本**：v1.0  
**最后更新**：2026-02-02  
**相关文档**：DEPLOY-GUIDE.md, MOBILE-TESTING.md
