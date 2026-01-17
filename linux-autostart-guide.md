# 统一文档转换工具开机自动启动解决方案

## 问题分析

您需要在 Linux 环境下实现 `start-all.sh` 脚本的开机自启，但没有 root 用户密码，无法直接使用 `sudo` 权限安装系统依赖。以下是针对这种情况的解决方案：

# Linux 环境开机自动启动解决方案（无 root 密码）

## 核心思路

当没有 root 密码时，我们需要：
1. 避免使用需要 `sudo` 权限的系统依赖安装
2. 使用普通用户权限即可运行的自启方式
3. 手动安装必要依赖或使用已安装的依赖

## 解决方案一：修改脚本，移除 sudo 依赖安装（推荐）

### 1. 创建简化版启动脚本

创建一个不需要 `sudo` 权限的启动脚本 `start-services.sh`：

```bash
#!/bin/bash

# 统一文档转换工具启动脚本（无 sudo 版本）
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
    nohup uvicorn app:app --reload --port 8006 > "$BACKEND_LOG" 2>&1 &
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
    echo -e "${GREEN}      统一文档转换工具已启动      ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${YELLOW}访问地址：${NC}"
    echo -e "  前端页面: http://localhost:5180"
    echo -e "  后端 API: http://localhost:8006"
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
    echo -e "${GREEN}  统一文档转换工具 - 无 sudo 启动脚本  ${NC}"
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
```

### 2. 赋予脚本执行权限

```bash
chmod +x start-services.sh
```

### 3. 手动安装必要依赖

在首次运行前，需要手动安装必要依赖：

```bash
# 创建并激活虚拟环境
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# 安装前端依赖
cd ../frontend
npm install
cd ..
```

## 解决方案二：使用用户级 systemd 服务（不需要 root）

### 1. 创建用户级 systemd 服务文件

```bash
mkdir -p ~/.config/systemd/user/
```

创建 `~/.config/systemd/user/unified-tools-web.service` 文件：

```ini
[Unit]
Description=Unified Tools Web - Document Conversion Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/unified-tools-web
ExecStart=/bin/bash /path/to/unified-tools-web/start-services.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

**注意**：将 `/path/to/unified-tools-web` 替换为实际的项目路径。

### 2. 重新加载 systemd 配置

```bash
systemctl --user daemon-reload
```

### 3. 设置服务开机自启

```bash
systemctl --user enable unified-tools-web.service
```

### 4. 启动服务（可选，测试用）

```bash
systemctl --user start unified-tools-web.service
```

## 解决方案三：使用 crontab 用户级任务

### 1. 编辑用户 crontab

```bash
crontab -e
```

### 2. 添加开机启动项

```
@reboot /path/to/unified-tools-web/start-services.sh
```

**注意**：将 `/path/to/unified-tools-web` 替换为实际的项目路径。

## 解决方案四：使用 .bashrc 或 .profile（登录时启动）

### 1. 编辑 .bashrc 或 .profile

```bash
nano ~/.bashrc
# 或
nano ~/.profile
```

### 2. 添加启动命令

在文件末尾添加：

```bash
# 启动统一文档转换工具
if [ -f "/path/to/unified-tools-web/start-services.sh" ]; then
    /path/to/unified-tools-web/start-services.sh
fi
```

**注意**：将 `/path/to/unified-tools-web` 替换为实际的项目路径。

## 日志查看与服务管理

### 查看服务状态（仅适用于 systemd 方案）

```bash
systemctl --user status unified-tools-web.service
```

### 查看脚本日志

```bash
tail -f /path/to/unified-tools-web/backend.log
tail -f /path/to/unified-tools-web/frontend.log
```

### 停止服务

```bash
# 查找进程
ps aux | grep -E '(uvicorn|npm)'

# 终止进程
kill <进程ID>
```

## 注意事项

1. **依赖安装**：首次运行前，需要手动安装所有必要依赖
2. **端口占用**：确保端口 5180 和 8006 未被其他程序占用
3. **虚拟环境**：确保已创建并配置好 Python 虚拟环境
4. **npm 依赖**：确保已安装好前端依赖
5. **权限问题**：确保脚本有执行权限

## 手动依赖安装指南

### 1. 检查必要命令

```bash
python3 --version
npm --version
```

如果这些命令不可用，需要联系系统管理员安装。

### 2. 安装 Python 虚拟环境和依赖

```bash
# 创建虚拟环境
cd backend
python3 -m venv venv

# 激活虚拟环境并安装依赖
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 退出虚拟环境
deactivate
```

### 3. 安装前端依赖

```bash
cd frontend
npm install
cd ..
```

## 总结

对于没有 root 密码的 Linux 环境，我们通过以下方式解决开机自启问题：
1. 创建简化版启动脚本，移除需要 `sudo` 的依赖安装步骤
2. 使用用户级 systemd 服务、crontab 或 .bashrc 实现开机自启
3. 手动安装必要依赖，确保服务可以正常启动

这些方案都不需要 root 权限，适合普通用户使用。