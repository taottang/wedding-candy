#!/bin/bash

# Cloudflare Pages 手动触发部署脚本

echo "🚀 准备触发 Cloudflare Pages 部署..."
echo ""
echo "请在 Cloudflare Dashboard 执行以下操作："
echo ""
echo "方法 1（推荐）："
echo "1. 访问: https://dash.cloudflare.com/"
echo "2. 进入 Workers & Pages → wedding-candy"
echo "3. 点击 'Create deployment' 按钮"
echo "4. 选择 branch: main"
echo "5. 点击 'Deploy'"
echo ""
echo "方法 2（如果方法1按钮找不到）："
echo "1. 点击任意一个旧的部署右侧的 'View details'"
echo "2. 在详情页面点击 '···' 菜单"
echo "3. 选择 'Retry deployment' 或 'Redeploy'"
echo ""
echo "方法 3（强制同步）："
echo "1. Settings → Builds & deployments"
echo "2. 找到 Git 配置，点击 'Manage'"
echo "3. 点击 'Trigger deployment' 或类似按钮"
echo ""
echo "✅ 部署触发后，等待 1-2 分钟即可看到新版本"
echo ""

# 检查最新提交
echo "📋 当前本地最新提交："
git log --oneline -1
echo ""
echo "🔍 GitHub 远程提交："
git ls-remote origin main | cut -f1
echo ""
