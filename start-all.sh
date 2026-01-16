#!/bin/bash

# 统一文档转换工具 - 启动脚本
# 同时启动前端和后端服务
# 适用于 Debian/Ubuntu 系统

clear
echo "========================================"
echo "统一文档转换工具 启动脚本"
echo "========================================"
echo

echo "[1/2] 启动后端服务..."
cd backend
python3 main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "后端服务已启动，PID: $BACKEND_PID，运行在 http://localhost:8006/"

# 等待后端服务初始化
sleep 2

echo
echo "[2/2] 启动前端服务..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务已启动，PID: $FRONTEND_PID，运行在 http://localhost:5180/"

# 等待前端服务初始化
sleep 3

cd ..
echo
echo "========================================"
echo "🎉 所有服务已成功启动！"
echo "========================================"
echo "前端访问地址: http://localhost:5180/"
echo "后端访问地址: http://localhost:8006/"
echo "========================================"
echo "日志文件:"
echo "  - 后端日志: backend/backend.log"
echo "  - 前端日志: frontend/frontend.log"
echo "========================================"
echo "按任意键关闭所有服务并退出..."
echo "========================================"

# 等待用户输入
read -n 1 -s

# 关闭所有服务
echo
echo "========================================"
echo "正在停止所有服务..."
echo "========================================"

# 关闭后端服务
if [ -n "$BACKEND_PID" ] && ps -p $BACKEND_PID > /dev/null; then
    kill -9 $BACKEND_PID
    echo "后端服务已停止 (PID: $BACKEND_PID)"
fi

# 关闭前端服务
if [ -n "$FRONTEND_PID" ] && ps -p $FRONTEND_PID > /dev/null; then
    kill -9 $FRONTEND_PID
    echo "前端服务已停止 (PID: $FRONTEND_PID)"
fi

# 关闭所有关联的子进程
pkill -f "python3 main.py"
pkill -f "npm run dev"
echo

echo "========================================"
echo "所有服务已停止，脚本退出。"
echo "========================================"
