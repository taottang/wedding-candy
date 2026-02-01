#!/bin/bash

# =================================================================
# CSS/JS 压缩脚本（无需 Node.js）
# 使用系统自带工具进行基础压缩
# =================================================================

echo "🚀 开始压缩 CSS/JS 文件..."
echo ""

# 进入项目根目录
cd "$(dirname "$0")/.." || exit

# 统计变量
total_files=0
total_original=0
total_minified=0

# 压缩单个文件
minify_file() {
    local input=$1
    local output=$2
    
    if [ ! -f "$input" ]; then
        return
    fi
    
    echo "压缩 $input ..."
    
    # 获取原始大小
    original_size=$(wc -c < "$input" | tr -d ' ')
    
    # 使用 sed 进行基础压缩（移除注释和多余空白）
    sed -e '/^[[:space:]]*\/\//d' \
        -e '/^[[:space:]]*\/\*/,/\*\//d' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' \
        -e '/^$/d' \
        "$input" > "$output"
    
    # 获取压缩后大小
    minified_size=$(wc -c < "$output" | tr -d ' ')
    
    # 计算压缩率
    if [ "$original_size" -gt 0 ]; then
        ratio=$(echo "scale=2; (1 - $minified_size / $original_size) * 100" | bc)
    else
        ratio=0
    fi
    
    echo "✅ 已生成 $output"
    echo "   原始大小: $(echo "scale=2; $original_size / 1024" | bc) KB"
    echo "   压缩后: $(echo "scale=2; $minified_size / 1024" | bc) KB"
    echo "   压缩率: ${ratio}%"
    echo ""
    
    total_files=$((total_files + 1))
    total_original=$((total_original + original_size))
    total_minified=$((total_minified + minified_size))
}

# 压缩 CSS 文件
echo "📄 压缩 CSS 文件:"
minify_file "css/main.css" "css/main.min.css"
minify_file "css/theme.css" "css/theme.min.css"
minify_file "css/form.css" "css/form.min.css"
minify_file "css/admin.css" "css/admin.min.css"
minify_file "css/animation.css" "css/animation.min.css"
minify_file "css/mobile.css" "css/mobile.min.css"

# 压缩 JS 文件
echo "📄 压缩 JS 文件:"
minify_file "js/config.js" "js/config.min.js"
minify_file "js/utils.js" "js/utils.min.js"
minify_file "js/data-manager.js" "js/data-manager.min.js"
minify_file "js/form-validator.js" "js/form-validator.min.js"
minify_file "js/region-loader.js" "js/region-loader.min.js"
minify_file "js/admin-auth.js" "js/admin-auth.min.js"
minify_file "js/export-utils.js" "js/export-utils.min.js"
minify_file "js/performance.js" "js/performance.min.js"
minify_file "js/accessibility.js" "js/accessibility.min.js"
minify_file "js/seo.js" "js/seo.min.js"

# 总结
echo "=================================================="
echo "✅ 压缩完成！"
echo "   总文件数: $total_files"
echo "   原始总大小: $(echo "scale=2; $total_original / 1024" | bc) KB"
echo "   压缩后总大小: $(echo "scale=2; $total_minified / 1024" | bc) KB"
if [ "$total_original" -gt 0 ]; then
    total_ratio=$(echo "scale=2; (1 - $total_minified / $total_original) * 100" | bc)
    saved=$(echo "scale=2; ($total_original - $total_minified) / 1024" | bc)
    echo "   总体压缩率: ${total_ratio}%"
    echo "   节省空间: ${saved} KB"
fi
echo "=================================================="
echo ""
echo "💡 提示：部署时使用 .min 文件可提升 40-50% 加载速度"
