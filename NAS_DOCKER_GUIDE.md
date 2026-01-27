# NAS Docker 部署指南

本指南将详细介绍如何在 NAS 设备上使用 Docker 部署 SmartDataPro 智能数据处理平台。

## 一、环境准备

### 1. 检查 NAS 环境

- 确保您的 NAS 支持 Docker 和 Docker Compose
- 确认 NAS 上有足够的存储空间（建议至少 5GB）
- 确保 NAS 已连接到网络

### 2. 安装 Docker 和 Docker Compose

#### Synology NAS
1. 打开 DSM 管理界面
2. 进入 **套件中心**
3. 搜索并安装 **Docker** 套件
4. Docker Compose 已包含在 Docker 套件中

#### QNAP NAS
1. 打开 QTS 管理界面
2. 进入 **App Center**
3. 搜索并安装 **Container Station**（包含 Docker 和 Docker Compose）

#### 其他 Linux-based NAS
```bash
# 更新包管理器
sudo apt-get update

# 安装 Docker
sudo apt-get install docker.io

# 安装 Docker Compose
sudo apt-get install docker-compose

# 启动 Docker 服务
sudo systemctl start docker

# 设置 Docker 开机自启
sudo systemctl enable docker
```

## 二、部署步骤

### 1. 获取项目文件

#### 方法一：使用 Git 克隆（推荐）
```bash
# 进入您想要存储项目的目录
cd /volume1/docker/  # 根据您的 NAS 目录结构调整

# 克隆仓库
git clone https://github.com/aqiyoung/DocMagic.git

# 进入项目目录
cd DocMagic
```

#### 方法二：手动下载
1. 访问 GitHub 项目页面：https://github.com/aqiyoung/DocMagic
2. 点击 **Code** → **Download ZIP**
3. 将 ZIP 文件上传到 NAS
4. 解压到合适的目录

### 2. 调整配置

#### 2.1 修改 docker-compose.yml（可选）

根据您的 NAS 环境需求，可以调整以下配置：

```yaml
# 端口映射：根据需要修改主机端口
ports:
  - "5180:80"  # 前端端口，可修改为其他端口
  - "8016:8016"  # 后端端口，可修改为其他端口

# 卷挂载：调整为 NAS 上的实际目录
volumes:
  - ./tmp:/tmp  # 临时文件目录
  - ./backend/logs:/app/logs  # 后端日志目录
  - ./backend/data:/app/data  # 后端数据目录
  - ./frontend/logs:/var/log/nginx  # 前端日志目录
```

#### 2.2 设置环境变量（可选）

创建 `.env` 文件来自定义环境变量：

```bash
# 在项目根目录创建 .env 文件
touch .env

# 编辑 .env 文件，添加以下内容
FRONTEND_PORT=5180
BACKEND_PORT=8016
DEBUG=0
```

### 3. 启动服务

```bash
# 在项目根目录执行
docker-compose up -d
```

### 4. 验证部署

1. 查看容器状态：
   ```bash
   docker-compose ps
   ```

2. 查看日志：
   ```bash
   docker-compose logs -f
   ```

3. 访问应用：
   - 前端页面：`http://您的NAS_IP:5180`
   - 后端 API：`http://您的NAS_IP:8016/api/`

## 三、管理与维护

### 1. 停止服务

```bash
docker-compose down
```

### 2. 重启服务

```bash
docker-compose restart
```

### 3. 更新服务

```bash
# 更新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

### 4. 数据备份

定期备份以下目录：
- `./backend/data`：后端数据目录
- `./backend/logs`：日志文件

### 5. 常见问题排查

#### 端口冲突
```bash
# 检查端口占用情况
netstat -tuln | grep -E "5180|8016"
```

#### 权限问题
```bash
# 调整目录权限
chmod -R 755 ./backend/logs ./backend/data ./frontend/logs ./tmp
```

#### 容器无法启动
```bash
# 查看具体容器日志
docker-compose logs <容器名称>  # 替换为实际容器名称
```

## 四、高级配置

### 1. 设置反向代理

如果您的 NAS 已配置了反向代理（如 Nginx、Apache 或 NAS 自带的反向代理），可以将 DocMagic 应用配置为子域名访问：

#### Nginx 反向代理示例
```nginx
server {
    listen 80;
    server_name docmagic.yourdomain.com;

    location / {
        proxy_pass http://localhost:5180;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 配置 HTTPS

如果您希望通过 HTTPS 访问应用，可以：
1. 使用 NAS 自带的证书服务
2. 使用 Let's Encrypt 证书
3. 使用已有的 SSL 证书

#### Docker Compose 中配置 HTTPS

```yaml
frontend:
  # ... 其他配置 ...
  ports:
    - "443:443"  # HTTPS 端口
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl  # SSL 证书目录
  environment:
    - HTTPS_ENABLED=1
```

### 3. 调整资源限制

如果您的 NAS 资源有限，可以调整容器的资源限制：

```yaml
backend:
  # ... 其他配置 ...
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M
```

## 五、访问与使用

### 1. 访问应用

- **前端页面**：`http://您的NAS_IP:5180`
- **后端 API**：`http://您的NAS_IP:8016/api/`

### 2. 基本使用

1. 在浏览器中访问前端页面
2. 选择您需要的转换类型
3. 上传文件或输入 URL
4. 点击转换按钮
5. 下载或预览转换结果

## 六、更新日志

- **v2.2.0**：优化了 Docker 配置，增强了 NAS 兼容性
- **v2.1.0**：修复了 405 Not Allowed 错误，添加了 API 代理配置
- **v2.0.0**：新增独立的 Markdown 编辑器，支持多端模拟预览

## 七、联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: https://github.com/aqiyoung/DocMagic/issues
- 邮箱：aqiyoung@163.com

---

**祝您使用愉快！** 🚀
