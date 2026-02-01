#!/bin/bash

# 婚礼喜糖领取系统 - 项目验证脚本

echo "======================================"
echo "  💝 项目完整性检查"
echo "======================================"
echo ""

# 检查必要文件
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1 (缺失)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/ (缺失)"
        return 1
    fi
}

echo "检查 HTML 页面..."
check_file "index.html"
check_file "form.html"
check_file "success.html"
check_file "admin.html"
check_file "privacy.html"
echo ""

echo "检查 CSS 文件..."
check_file "css/main.css"
check_file "css/theme.css"
check_file "css/form.css"
check_file "css/admin.css"
check_file "css/animation.css"
echo ""

echo "检查 JavaScript 文件..."
check_file "js/config.js"
check_file "js/utils.js"
check_file "js/form-validator.js"
check_file "js/data-manager.js"
check_file "js/admin-auth.js"
check_file "js/export-utils.js"
check_file "js/init.js"
echo ""

echo "检查数据文件..."
check_file "data/recipients.json"
check_file "data/config.json"
echo ""

echo "检查文档文件..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "HOW-TO-USE.html"
echo ""

echo "检查资源目录..."
check_dir "assets"
check_dir "assets/images"
check_dir "assets/fonts"
echo ""

echo "======================================"
echo "  📊 统计信息"
echo "======================================"
echo ""
echo "HTML 文件: $(find . -name "*.html" -type f | wc -l | tr -d ' ')"
echo "CSS 文件:  $(find . -name "*.css" -type f | wc -l | tr -d ' ')"
echo "JS 文件:   $(find . -name "*.js" -type f | wc -l | tr -d ' ')"
echo "JSON 文件: $(find . -name "*.json" -type f | wc -l | tr -d ' ')"
echo "总文件数:  $(find . -type f | wc -l | tr -d ' ')"
echo ""

echo "======================================"
echo "  ✅ 检查完成！"
echo "======================================"
echo ""
echo "系统已准备就绪，可以启动使用！"
echo ""
echo "启动命令："
echo "  Mac/Linux: ./start.sh"
echo "  Windows:   start.bat"
echo ""
