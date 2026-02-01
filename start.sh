#!/bin/bash

# 婚礼喜糖领取系统 - 启动脚本

echo "======================================"
echo "  💝 婚礼喜糖在线领取系统"
echo "======================================"
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 错误: 未找到Python，请先安装Python"
    exit 1
fi

echo "✅ 找到Python: $PYTHON_CMD"
echo ""

# 获取端口号
PORT=8000
if [ ! -z "$1" ]; then
    PORT=$1
fi

echo "🚀 正在启动HTTP服务器..."
echo "📡 端口: $PORT"
echo ""
echo "======================================"
echo "  访问地址："
echo "======================================"
echo ""
echo "  🏠 首页:     http://localhost:$PORT/index.html"
echo "  📝 填写信息:  http://localhost:$PORT/form.html"
echo "  ⚙️  管理后台:  http://localhost:$PORT/admin.html"
echo "  📖 使用说明:  http://localhost:$PORT/HOW-TO-USE.html"
echo ""
echo "======================================"
echo "  管理员登录信息："
echo "======================================"
echo ""
echo "  用户名: admin"
echo "  密码:   wedding2026"
echo ""
echo "⚠️  重要: 正式使用前请修改密码!"
echo ""
echo "======================================"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
$PYTHON_CMD -m http.server $PORT
