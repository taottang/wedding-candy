# 📱 移动端测试指南

本指南介绍如何在真实移动设备上测试婚礼喜糖领取系统，确保在手机和微信中正常运行。

---

## 📋 测试方法概览

| 方法 | 难度 | 速度 | HTTPS | 微信支持 | 推荐度 |
|------|------|------|-------|---------|--------|
| **局域网测试** | ⭐ | 最快 | ❌ | ❌ | ⭐⭐⭐ |
| **ngrok 测试** | ⭐⭐ | 快 | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Vercel 部署** | ⭐⭐⭐ | 中等 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |

---

## 方法一：局域网测试（最简单）

### 适用场景
- ✅ 快速开发调试
- ✅ 本地功能测试
- ✅ 不需要微信环境
- ❌ 无法在微信中测试

### 前提条件
- 电脑和手机连接到同一个 WiFi 网络
- 手机和电脑在同一局域网内

### 步骤详解

#### 步骤 1: 获取电脑 IP 地址

**Mac 系统：**
```bash
# 方法1: 使用 ifconfig
ifconfig | grep "inet " | grep -v 127.0.0.1

# 方法2: 系统偏好设置
# 系统偏好设置 → 网络 → 查看 WiFi IP

# 常见输出示例：
# inet 192.168.1.100
```

**Windows 系统：**
```cmd
# 命令提示符
ipconfig

# 查找 "无线局域网适配器 WLAN" 下的 IPv4 地址
# 示例：192.168.1.100
```

**Linux 系统：**
```bash
hostname -I
# 或
ip addr show
```

#### 步骤 2: 启动本地服务器

```bash
# 进入项目目录
cd wedding-candy-system

# 启动 Python 服务器（推荐端口 8080）
python3 -m http.server 8080

# 或使用 8000 端口
python3 -m http.server 8000

# 成功输出：
# Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

**重要：** 不要使用 `localhost` 或 `127.0.0.1`，必须使用 `0.0.0.0` 才能让其他设备访问。

#### 步骤 3: 手机访问

在手机浏览器中输入：
```
http://你的电脑IP:8080

# 例如：
http://192.168.1.100:8080
```

#### 步骤 4: 测试功能

- [ ] 首页正常显示
- [ ] 背景轮播正常
- [ ] 表单可以填写
- [ ] 表单可以提交
- [ ] 成功页面显示
- [ ] 触摸操作流畅
- [ ] 横屏竖屏切换正常

### 常见问题

#### Q1: 手机无法访问？

**检查清单：**
```bash
# 1. 确认电脑和手机在同一 WiFi
# 查看手机 WiFi 名称和电脑是否一致

# 2. 确认防火墙设置（Mac）
sudo pfctl -d  # 临时关闭防火墙测试

# 3. 确认防火墙设置（Windows）
# 控制面板 → Windows 防火墙 → 允许应用通过防火墙
# 添加 Python 到允许列表

# 4. 尝试其他端口
python3 -m http.server 8000
# 手机访问：http://你的IP:8000
```

#### Q2: 可以访问但加载很慢？

**解决方法：**
```bash
# 确保使用的是 WiFi 5GHz 频段（如果路由器支持）
# 或靠近路由器

# 检查是否有其他设备占用带宽
```

#### Q3: 页面显示但功能异常？

**调试方法：**
```javascript
// 在手机浏览器打开调试
// iPhone: Safari → 设置 → 高级 → 网页检查器
// Android: Chrome → 菜单 → 更多工具 → 远程设备

// 或在页面添加调试信息
console.log('Debug info:', someVariable);
alert('Debug: ' + someValue);
```

---

## 方法二：ngrok 测试（推荐）

### 适用场景
- ✅ 需要 HTTPS 访问
- ✅ 在微信中测试
- ✅ 分享给他人测试
- ✅ 快速获取公网链接

### 什么是 ngrok？

ngrok 是一个内网穿透工具，可以将本地服务暴露到公网，并提供 HTTPS 支持。

### 安装 ngrok

#### Mac 系统：
```bash
# 使用 Homebrew 安装
brew install ngrok

# 或下载安装包
# 访问 https://ngrok.com/download
```

#### Windows 系统：
```bash
# 下载安装包
# 访问 https://ngrok.com/download
# 解压到任意目录（如 C:\ngrok）
```

#### Linux 系统：
```bash
# 下载并安装
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

### 使用步骤

#### 步骤 1: 注册 ngrok 账号（免费）

```bash
# 访问 https://dashboard.ngrok.com/signup
# 注册免费账号

# 获取 Authtoken
# 访问 https://dashboard.ngrok.com/get-started/your-authtoken
```

#### 步骤 2: 配置 Authtoken

```bash
# 配置认证令牌（只需执行一次）
ngrok config add-authtoken 你的_authtoken

# 示例：
# ngrok config add-authtoken 2abc123def456ghi789jkl
```

#### 步骤 3: 启动本地服务器

```bash
# 在项目目录启动服务器
cd wedding-candy-system
python3 -m http.server 8080
```

#### 步骤 4: 启动 ngrok 隧道

**新开一个终端窗口：**
```bash
# 将本地 8080 端口暴露到公网
ngrok http 8080

# 成功后会显示：
# Forwarding  https://abc123def456.ngrok-free.app -> http://localhost:8080
```

**输出示例：**
```
ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.5.0
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

#### 步骤 5: 手机访问

**复制 HTTPS 链接：**
```
https://abc123def456.ngrok-free.app
```

**在手机浏览器或微信中打开此链接**

### ngrok 功能特性

#### 1. Web 界面（查看请求日志）

```bash
# 访问本地 ngrok 界面
http://localhost:4040

# 可以看到：
# - 所有 HTTP 请求
# - 请求详情
# - 响应内容
# - 性能指标
```

#### 2. 自定义子域名（付费功能）

```bash
# Pro 版本可以自定义域名
ngrok http 8080 --subdomain=my-wedding

# 获得固定链接：
# https://my-wedding.ngrok-free.app
```

#### 3. 多个隧道

```bash
# 同时暴露多个端口
# 创建 ngrok.yml 配置文件

# ngrok.yml
tunnels:
  wedding:
    proto: http
    addr: 8080
  api:
    proto: http
    addr: 3000

# 启动所有隧道
ngrok start --all
```

### 免费版限制

```
✅ HTTPS 支持
✅ 无限制流量
✅ 临时随机域名
❌ 自定义域名
❌ 域名固定（每次重启会变）
⚠️  每分钟最多 40 个连接
⚠️  2小时后需要重新启动
```

### 测试清单

- [ ] 手机浏览器访问正常
- [ ] 微信内置浏览器访问正常
- [ ] HTTPS 绿色锁显示
- [ ] 所有功能正常
- [ ] LocalStorage 可以保存
- [ ] 表单提交成功

### 常见问题

#### Q1: ngrok 连接失败？

```bash
# 检查网络连接
ping ngrok.com

# 检查防火墙
# 确保允许 ngrok 访问网络

# 重新认证
ngrok config add-authtoken 你的_token
```

#### Q2: 访问速度慢？

```bash
# 选择就近的区域
ngrok http 8080 --region=ap  # 亚太
ngrok http 8080 --region=us  # 美国
ngrok http 8080 --region=eu  # 欧洲

# 或使用国内替代方案：
# - natapp.cn
# -花生壳 https://hsk.oray.com/
```

#### Q3: 微信提示"非微信官方网页"？

```
这是正常的，因为是临时域名。
点击"继续访问"即可。

部署到 Vercel 后就不会有这个提示。
```

---

## 方法三：Vercel 部署测试（推荐用于最终测试）

### 适用场景
- ✅ 生产环境测试
- ✅ 最接近真实环境
- ✅ 微信正式使用
- ✅ 分享给所有人

### 部署步骤

#### 快速部署（详见 DEPLOY-GUIDE.md）

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Ready for mobile testing"
git push

# 2. 访问 Vercel
# https://vercel.com
# 用 GitHub 登录

# 3. Import Project
# 选择你的仓库 → Deploy

# 4. 等待部署完成（1-2分钟）
# 获得链接：https://your-project.vercel.app
```

### 部署后测试

#### 1. 基础功能测试

**iPhone 测试：**
```
浏览器：Safari、Chrome
系统：iOS 15+
测试项：
- [ ] 页面加载速度
- [ ] 触摸操作
- [ ] 表单输入
- [ ] 键盘弹出
- [ ] 横竖屏切换
- [ ] Safari 刘海适配
```

**Android 测试：**
```
浏览器：Chrome、系统浏览器
系统：Android 10+
测试项：
- [ ] 页面加载速度
- [ ] 触摸操作
- [ ] 表单输入
- [ ] 键盘弹出
- [ ] 不同屏幕尺寸
```

#### 2. 微信内测试（重要！）

**微信内置浏览器特性：**
```
✅ 自动使用微信登录信息
✅ 可以分享到朋友圈
✅ 可以分享给好友
⚠️  某些 API 受限
⚠️  需要微信 JS-SDK（本项目不需要）
```

**测试步骤：**
```
1. 在微信中打开链接
   - 发送给"文件传输助手"
   - 点击打开

2. 功能测试
   - [ ] 页面正常显示
   - [ ] 背景轮播正常
   - [ ] 表单可以填写
   - [ ] 提交成功
   - [ ] 返回正常

3. 分享测试
   - [ ] 点击右上角"..."
   - [ ] 分享给朋友
   - [ ] 查看卡片预览
   - [ ] 对方可以打开
```

#### 3. 性能测试

**使用 Chrome DevTools（移动端）：**

**Android + Chrome：**
```
1. 手机开启开发者选项
2. 开启 USB 调试
3. 电脑 Chrome 访问：chrome://inspect
4. 选择设备和页面
5. 查看 Performance、Network
```

**使用在线工具：**
```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/
# 输入你的 Vercel 链接

# GTmetrix
https://gtmetrix.com/
# 测试移动端性能

# WebPageTest
https://www.webpagetest.org/
# 选择移动设备测试
```

### 域名配置（可选）

如果有自己的域名：

```bash
# 1. 在 Vercel 项目设置中添加域名
# Settings → Domains → Add

# 2. 配置 DNS
# 添加 CNAME 记录：
# wedding  CNAME  cname.vercel-dns.com

# 3. 等待生效（10-30分钟）

# 4. 使用自定义域名测试
# https://wedding.yourdomain.com
```

---

## 方法四：微信内测试特别说明

### ⚠️ 重要提醒

#### 1. HTTPS 要求

```
微信内置浏览器要求：
✅ 必须使用 HTTPS
❌ 不支持 HTTP（会被拦截）
❌ 不支持 IP 地址访问

支持的方式：
✅ ngrok (https://xxx.ngrok-free.app)
✅ Vercel (https://xxx.vercel.app)
✅ 自定义域名 + SSL证书
```

#### 2. LocalStorage 支持

```javascript
// 微信内置浏览器支持 LocalStorage
// 但有以下限制：

// ✅ 可以读写
localStorage.setItem('key', 'value');
localStorage.getItem('key');

// ⚠️  可能被清理（用户清理微信缓存时）
// ⚠️  隐私模式下可能受限
// ✅ 本项目的数据存储方案兼容
```

#### 3. 微信 API（本项目不需要）

```javascript
// 本项目是纯前端，不需要微信 JS-SDK
// 如果将来需要使用微信登录、支付等功能：

// 需要引入 JS-SDK
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

// 需要后端接口进行签名验证
// 需要在微信公众平台配置
```

#### 4. 分享设置

**默认分享卡片：**
```html
<!-- 在 HTML 中配置（已完成）-->
<meta property="og:title" content="邓蓓 & 唐韬 婚礼喜糖领取">
<meta property="og:description" content="填写地址，我们将把喜悦和祝福送达">
<meta property="og:image" content="分享图片链接">
```

**自定义分享（需要 JS-SDK）：**
```javascript
// 如果需要自定义分享内容（可选）
wx.ready(function() {
  wx.onMenuShareTimeline({
    title: '邓蓓 & 唐韬的婚礼喜糖',
    link: window.location.href,
    imgUrl: '分享图片URL'
  });
});
```

### 微信测试清单

#### 基础功能
- [ ] 页面可以打开
- [ ] HTTPS 绿色锁显示
- [ ] 图片正常加载
- [ ] 表单可以填写
- [ ] 数据可以提交
- [ ] LocalStorage 保存成功

#### 交互体验
- [ ] 触摸滚动流畅
- [ ] 按钮点击响应快
- [ ] 键盘弹出不遮挡输入框
- [ ] 横竖屏切换正常
- [ ] 下拉刷新正常

#### 分享功能
- [ ] 可以分享给好友
- [ ] 可以分享到朋友圈
- [ ] 分享卡片显示正常
- [ ] 分享图片显示正常
- [ ] 对方可以打开链接

#### 兼容性
- [ ] iOS 微信正常
- [ ] Android 微信正常
- [ ] 不同微信版本正常
- [ ] 长按可以复制链接

---

## 📊 测试对比

| 测试方法 | 设置时间 | HTTPS | 微信支持 | 稳定性 | 分享测试 |
|----------|----------|-------|---------|--------|---------|
| **局域网** | 1分钟 | ❌ | ❌ | ⭐⭐⭐⭐⭐ | ❌ |
| **ngrok** | 5分钟 | ✅ | ✅ | ⭐⭐⭐ | ✅ |
| **Vercel** | 10分钟 | ✅ | ✅ | ⭐⭐⭐⭐⭐ | ✅ |

---

## 🔧 测试工具推荐

### 1. 浏览器开发者工具

**Chrome DevTools：**
```
F12 → 移动设备模拟
- iPhone 13 Pro
- Samsung Galaxy S21
- iPad Pro
- 自定义尺寸
```

### 2. 真机调试工具

**iOS：**
```
Safari → 开发 → 你的iPhone → 选择页面
可以查看控制台、元素、网络等
```

**Android：**
```
Chrome → chrome://inspect → 选择设备
实时调试远程设备
```

### 3. 网络模拟

**Chrome DevTools：**
```
Network 标签 → Throttling
- Fast 3G
- Slow 3G
- Offline
模拟不同网络环境
```

### 4. 屏幕录制

**iOS：**
```
控制中心 → 屏幕录制
录制操作过程
```

**Android：**
```
通知栏 → 屏幕录制
或使用 ADB：
adb shell screenrecord /sdcard/test.mp4
```

---

## 📝 测试清单（完整版）

### 功能测试
- [ ] 首页加载正常
- [ ] 背景轮播正常
- [ ] 倒计时显示正确
- [ ] 详情展开/收起正常
- [ ] 主按钮点击响应
- [ ] 表单填写流畅
- [ ] 省市区选择正常
- [ ] 表单验证正确
- [ ] 提交成功
- [ ] 成功页面显示
- [ ] 后台登录正常

### 性能测试
- [ ] 首屏加载 < 2秒
- [ ] 图片懒加载正常
- [ ] 滚动流畅
- [ ] 动画流畅（60fps）
- [ ] 无卡顿

### 兼容性测试
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad
- [ ] 微信内置浏览器
- [ ] 横屏模式
- [ ] 竖屏模式

### 响应式测试
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 13)
- [ ] 414px (iPhone 13 Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)

---

## 🆘 常见问题汇总

### Q1: 为什么局域网测试微信打不开？

**A:** 微信要求必须使用 HTTPS 协议，局域网是 HTTP。
```
解决方案：
1. 使用 ngrok（推荐）
2. 或部署到 Vercel
```

### Q2: ngrok 链接为什么经常变？

**A:** 免费版每次重启会生成新的随机域名。
```
解决方案：
1. 升级到 Pro 版（$8/月）获得固定域名
2. 或使用 Vercel 部署（推荐，免费）
```

### Q3: 手机看不到控制台错误怎么办？

**A:** 使用远程调试。
```
iOS: Safari → 开发 → iPhone
Android: Chrome → chrome://inspect
或在页面添加：
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

### Q4: 微信提示"非官方网页"？

**A:** 这是正常的，因为不是微信认证的域名。
```
解决方案：
1. 点击"继续访问"
2. 部署后使用自己的域名
3. 进行微信公众平台认证（可选）
```

### Q5: 表单在手机上无法提交？

**A:** 检查以下几点：
```
1. 控制台是否有错误
2. LocalStorage 是否被禁用
3. 网络连接是否正常
4. 浏览器是否支持 ES6
```

---

## 📞 获取帮助

### 查看文档
```bash
cat START-HERE.md          # 快速开始
cat DEPLOY-GUIDE.md        # 部署指南
cat OPTIMIZATION-USAGE.md  # 优化说明
```

### 在线资源
- ngrok 官网：https://ngrok.com
- Vercel 官网：https://vercel.com
- 微信开放平台：https://open.weixin.qq.com

---

## 🎯 推荐测试流程

### 开发阶段
```
1. 局域网测试（快速迭代）
   └─ 电脑 + 手机同 WiFi
   
2. ngrok 测试（功能验证）
   └─ 获取 HTTPS 链接
   └─ 微信内测试
   
3. 修复问题
   └─ 重复步骤 1-2
```

### 部署前
```
1. 本地完整测试
   └─ 所有功能正常
   
2. 性能优化
   └─ 压缩文件
   └─ 验证优化效果
   
3. ngrok 最终测试
   └─ 模拟真实环境
```

### 部署后
```
1. Vercel 部署
   └─ 推送 GitHub
   └─ 自动部署
   
2. 多设备测试
   └─ iPhone
   └─ Android
   └─ iPad
   └─ 微信
   
3. 分享测试
   └─ 发送给朋友
   └─ 收集反馈
```

---

## 🎉 测试完成标准

当以下所有项都通过时，即可正式使用：

- ✅ 所有功能在手机浏览器正常
- ✅ 所有功能在微信内正常
- ✅ 加载速度 < 2秒
- ✅ 无明显卡顿或延迟
- ✅ 不同设备兼容
- ✅ 横竖屏切换正常
- ✅ 分享功能正常
- ✅ 数据可以正确保存和导出

**🎊 恭喜！你的系统已通过移动端测试！**

---

**文档版本：** v1.0  
**最后更新：** 2026-02-02  
**相关文档：** DEPLOY-GUIDE.md, QUICK-DEPLOY.md
