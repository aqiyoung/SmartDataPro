#!/usr/bin/env pwsh

# 统一文档转换工具 - 启动脚本
# 同时启动前端和后端服务

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SmartDataPro 智能数据处理平台 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 定义颜色常量
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"
$CYAN = "Cyan"

# 切换到脚本所在目录
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# 检查并启动后端服务
Write-Host "\n[1/2] 启动后端服务..." -ForegroundColor $YELLOW
$backendPath = Join-Path -Path $PWD -ChildPath "backend"
if (Test-Path -Path $backendPath) {
    Set-Location -Path $backendPath
    Write-Host "切换到后端目录: $backendPath" -ForegroundColor $CYAN
    
    # 启动后端服务（异步）
    $backendJob = Start-Job -ScriptBlock {
        python main.py
    }
    Write-Host "后端服务已启动，运行在 http://localhost:8016/" -ForegroundColor $GREEN
    
    # 等待后端服务初始化
    Start-Sleep -Seconds 2
    
    # 切换回根目录
    Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
} else {
    Write-Host "后端目录不存在: $backendPath" -ForegroundColor $RED
    exit 1
}

# 检查并启动前端服务
Write-Host "\n[2/2] 启动前端服务..." -ForegroundColor $YELLOW
$frontendPath = Join-Path -Path $PWD -ChildPath "frontend"
if (Test-Path -Path $frontendPath) {
    Set-Location -Path $frontendPath
    Write-Host "切换到前端目录: $frontendPath" -ForegroundColor $CYAN
    
    # 启动前端服务（异步）
    $frontendJob = Start-Job -ScriptBlock {
        npm run dev
    }
    Write-Host "前端服务已启动，运行在 http://localhost:5180/" -ForegroundColor $GREEN
    
    # 等待前端服务初始化
    Start-Sleep -Seconds 3
    
    # 切换回根目录
    Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
} else {
    Write-Host "前端目录不存在: $frontendPath" -ForegroundColor $RED
    exit 1
}

Write-Host "\n========================================" -ForegroundColor Cyan
Write-Host "🎉 所有服务已成功启动！" -ForegroundColor $GREEN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "前端访问地址: http://localhost:5180/" -ForegroundColor $GREEN
Write-Host "后端访问地址: http://localhost:8006/" -ForegroundColor $GREEN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止脚本，所有服务将自动关闭。" -ForegroundColor $YELLOW
Write-Host "========================================" -ForegroundColor Cyan

# 等待用户输入，保持脚本运行
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch [System.Management.Automation.KeyboardInterrupt] {
    Write-Host "\n\n========================================" -ForegroundColor Cyan
    Write-Host "正在停止所有服务..." -ForegroundColor $YELLOW
    Write-Host "========================================" -ForegroundColor Cyan
    
    # 停止后端服务
    if ($backendJob -and $backendJob.State -eq "Running") {
        Stop-Job -Job $backendJob
        Remove-Job -Job $backendJob
        Write-Host "后端服务已停止" -ForegroundColor $GREEN
    }
    
    # 停止前端服务
    if ($frontendJob -and $frontendJob.State -eq "Running") {
        Stop-Job -Job $frontendJob
        Remove-Job -Job $frontendJob
        Write-Host "前端服务已停止" -ForegroundColor $GREEN
    }
    
    Write-Host "\n========================================" -ForegroundColor Cyan
    Write-Host "所有服务已停止，脚本退出。" -ForegroundColor $CYAN
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
}