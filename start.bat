@echo off
chcp 65001 >nul
cls

echo ======================================
echo   💝 婚礼喜糖在线领取系统
echo ======================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Python，请先安装Python
    pause
    exit /b 1
)

echo ✅ 找到Python
echo.

:: 获取端口号（默认8000）
set PORT=8000
if not "%1"=="" set PORT=%1

echo 🚀 正在启动HTTP服务器...
echo 📡 端口: %PORT%
echo.
echo ======================================
echo   访问地址：
echo ======================================
echo.
echo   🏠 首页:     http://localhost:%PORT%/index.html
echo   📝 填写信息:  http://localhost:%PORT%/form.html
echo   ⚙️  管理后台:  http://localhost:%PORT%/admin.html
echo   📖 使用说明:  http://localhost:%PORT%/HOW-TO-USE.html
echo.
echo ======================================
echo   管理员登录信息：
echo ======================================
echo.
echo   用户名: admin
echo   密码:   wedding2026
echo.
echo ⚠️  重要: 正式使用前请修改密码!
echo.
echo ======================================
echo.
echo 按 Ctrl+C 停止服务器
echo.

:: 启动服务器
python -m http.server %PORT%
