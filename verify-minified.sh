#!/bin/bash

# =================================================================
# 婚礼喜糖系统 - 压缩文件验证脚本
# 检查所有压缩文件是否正确生成
# =================================================================

echo "🔍 验证压缩文件..."
echo "========================================"
echo ""

cd "$(dirname "$0")" || exit

errors=0
warnings=0

# 检查 CSS 压缩文件
echo "📋 CSS 压缩文件："
css_files=("main" "theme" "form" "admin" "animation" "mobile")
for file in "${css_files[@]}"; do
    if [ -f "css/${file}.min.css" ]; then
        size=$(du -h "css/${file}.min.css" | cut -f1)
        echo "  ✅ css/${file}.min.css ($size)"
    else
        echo "  ❌ css/${file}.min.css - 文件不存在"
        ((errors++))
    fi
done
echo ""

# 检查 JS 压缩文件
echo "📋 JS 压缩文件："
js_files=("config" "utils" "data-manager")
for file in "${js_files[@]}"; do
    if [ -f "js/${file}.min.js" ]; then
        size=$(du -h "js/${file}.min.js" | cut -f1)
        echo "  ✅ js/${file}.min.js ($size)"
    else
        echo "  ❌ js/${file}.min.js - 文件不存在"
        ((errors++))
    fi
done
echo ""

# 检查总大小
echo "📊 文件大小统计："
if command -v bc &> /dev/null; then
    css_total=$(du -sk css/*.min.css 2>/dev/null | awk '{sum+=$1} END {print sum}')
    js_total=$(du -sk js/*.min.js 2>/dev/null | awk '{sum+=$1} END {print sum}')
    
    if [ -n "$css_total" ] && [ -n "$js_total" ]; then
        css_mb=$(echo "scale=2; $css_total / 1024" | bc)
        js_mb=$(echo "scale=2; $js_total / 1024" | bc)
        total_mb=$(echo "scale=2; ($css_total + $js_total) / 1024" | bc)
        
        echo "  CSS 总计: ${css_mb} KB"
        echo "  JS 总计: ${js_mb} KB"
        echo "  压缩文件总计: ${total_mb} KB"
    fi
fi
echo ""

# 检查是否需要重新压缩
echo "🔄 检查源文件更新："
needs_update=0

for file in "${css_files[@]}"; do
    src="css/${file}.css"
    min="css/${file}.min.css"
    if [ -f "$src" ] && [ -f "$min" ]; then
        if [ "$src" -nt "$min" ]; then
            echo "  ⚠️  $src 已更新，需要重新压缩"
            ((needs_update++))
            ((warnings++))
        fi
    fi
done

for file in "${js_files[@]}"; do
    src="js/${file}.js"
    min="js/${file}.min.js"
    if [ -f "$src" ] && [ -f "$min" ]; then
        if [ "$src" -nt "$min" ]; then
            echo "  ⚠️  $src 已更新，需要重新压缩"
            ((needs_update++))
            ((warnings++))
        fi
    fi
done

if [ $needs_update -eq 0 ]; then
    echo "  ✅ 所有压缩文件都是最新的"
fi
echo ""

# 总结
echo "========================================"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo "✅ 验证通过！所有压缩文件正常"
    echo ""
    echo "📝 下一步："
    echo "  1. 修改配置：js/config.js"
    echo "  2. 部署：./deploy.sh"
    echo "  3. 查看指南：cat QUICK-DEPLOY.md"
    exit 0
elif [ $errors -eq 0 ]; then
    echo "⚠️  验证通过，但有 $warnings 个警告"
    echo ""
    echo "💡 建议："
    echo "  运行 bash build/minify.sh 重新压缩"
    exit 0
else
    echo "❌ 验证失败！有 $errors 个错误"
    echo ""
    echo "🔧 解决方法："
    echo "  运行 bash build/minify.sh 生成压缩文件"
    exit 1
fi
