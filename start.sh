#!/bin/bash

# SmartDataPro 智能数据处理平台启动脚本（无 sudo 版本）
# 仅启动服务，不安装系统依赖

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志文件路径
BACKEND_LOG="$(pwd)/backend.log"
FRONTEND_LOG="$(pwd)/frontend.log"

# 清理旧日志
function cleanup_old_logs() {
    echo -e "${YELLOW}清理旧日志...${NC}"
    rm -f "$BACKEND_LOG" "$FRONTEND_LOG"
    echo -e "${GREEN}旧日志清理完成！${NC}"
}

# 启动后端服务
function start_backend() {
    echo -e "${YELLOW}启动后端服务...${NC}"
    cd backend
    
    # 检查虚拟环境
    if [ ! -d "venv" ]; then
        echo -e "${RED}虚拟环境不存在，请先手动创建并安装依赖${NC}"
        exit 1
    fi
    
    # 激活虚拟环境并启动后端服务
    source venv/bin/activate
    nohup uvicorn app:app --reload --port 8016 > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    
    # 退出虚拟环境
    deactivate
    
    cd ..
    echo -e "${GREEN}后端服务启动成功！进程ID: $BACKEND_PID${NC}"
    echo -e "${YELLOW}后端日志: $BACKEND_LOG${NC}"
}

# 启动前端服务
function start_frontend() {
    echo -e "${YELLOW}启动前端服务...${NC}"
    cd frontend
    
    # 检查 npm 依赖
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}前端依赖不存在，请先手动安装依赖${NC}"
        exit 1
    fi
    
    # 启动前端服务
    nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    
    cd ..
    echo -e "${GREEN}前端服务启动成功！进程ID: $FRONTEND_PID${NC}"
    echo -e "${YELLOW}前端日志: $FRONTEND_LOG${NC}"
}

# 显示启动信息
function show_start_info() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}      SmartDataPro 智能数据处理平台已启动      ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${YELLOW}访问地址：${NC}"
    echo -e "  前端页面: http://localhost:5180"
    echo -e "  后端 API: http://localhost:8016"
    echo -e "\n${YELLOW}启动日志：${NC}"
    echo -e "  后端日志: tail -f $BACKEND_LOG"
    echo -e "  前端日志: tail -f $FRONTEND_LOG"
    echo -e "\n${YELLOW}停止服务：${NC}"
    echo -e "  查找进程: ps aux | grep -E '(uvicorn|npm)'"
    echo -e "  终止进程: kill <进程ID>"
    echo -e "${GREEN}========================================${NC}\n"
}

# 主函数
function main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  SmartDataPro 智能数据处理平台 - 无 sudo 启动脚本  ${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    
    # 清理旧日志
    cleanup_old_logs
    
    # 启动服务
    start_backend
    start_frontend
    
    # 等待服务启动
    echo -e "\n${YELLOW}等待服务初始化...${NC}"
    sleep 3
    
    # 显示启动信息
    show_start_info
}

# 执行主函数
main
