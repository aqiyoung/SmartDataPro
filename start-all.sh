#!/bin/bash

# DocMagic 智能文档处理平台启动脚本 (Debian/Ubuntu)
# 版本: 2.1.0
# 功能: 自动检查依赖、安装依赖、后台启动前后端服务，并生成日志

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

# 检查命令是否存在
function check_command() {
    command -v "$1" >/dev/null 2>&1
}

# 检查并安装系统依赖
function install_system_dependencies() {
    echo -e "${YELLOW}检查系统依赖...${NC}"
    
    # 更新包列表
    sudo apt update -y
    
    # 安装Python 3.11及pip
    if ! check_command python3.11; then
        echo -e "${RED}Python 3.11 未安装，正在安装...${NC}"
        sudo apt install -y python3.11 python3.11-venv python3.11-dev
    else
        echo -e "${GREEN}Python 3.11 已安装${NC}"
    fi
    
    # 安装Node.js和npm
    if ! check_command npm; then
        echo -e "${RED}Node.js/npm 未安装，正在安装...${NC}"
        sudo apt install -y curl
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    else
        echo -e "${GREEN}Node.js/npm 已安装${NC}"
    fi
    
    # 安装其他系统依赖
    sudo apt install -y build-essential libssl-dev libffi-dev tesseract-ocr tesseract-ocr-chi-sim
    
    echo -e "${GREEN}系统依赖检查完成！${NC}"
}

# 安装后端依赖
function install_backend_dependencies() {
    echo -e "${YELLOW}安装后端依赖...${NC}"
    cd backend
    
    # 创建虚拟环境（如果不存在）
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}创建Python虚拟环境...${NC}"
        python3.11 -m venv venv
    fi
    
    # 激活虚拟环境并安装依赖
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # 退出虚拟环境
    deactivate
    
    cd ..
    echo -e "${GREEN}后端依赖安装完成！${NC}"
}

# 安装前端依赖
function install_frontend_dependencies() {
    echo -e "${YELLOW}安装前端依赖...${NC}"
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}前端依赖安装完成！${NC}"
}

# 启动后端服务
function start_backend() {
    echo -e "${YELLOW}启动后端服务...${NC}"
    cd backend
    
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
    echo -e "${GREEN}      DocMagic 智能文档处理平台已启动      ${NC}"
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
    echo -e "${GREEN}  DocMagic 智能文档处理平台 - Debian启动脚本  ${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    
    # 清理旧日志
    cleanup_old_logs
    
    # 安装依赖
    install_system_dependencies
    install_backend_dependencies
    install_frontend_dependencies
    
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
