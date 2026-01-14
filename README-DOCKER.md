# Docker 部署指南

本指南将帮助您使用 Docker 部署统一文档转换工具。

## 目录结构

```
.
├── backend/            # 后端代码
│   └── Dockerfile      # 后端Dockerfile
├── frontend/           # 前端代码
│   ├── Dockerfile      # 前端Dockerfile
│   └── nginx.conf      # Nginx配置文件
├── docker-compose.yml  # Docker Compose配置文件
└── README-DOCKER.md    # Docker部署指南
```

## 环境要求

- Docker 19.03+ 
- Docker Compose 3.8+

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd unified-tools-web
```

### 2. 构建和启动服务

使用 Docker Compose 一键构建和启动所有服务：

```bash
docker-compose up -d --build
```

这将：
- 构建后端服务镜像
- 构建前端服务镜像
- 启动后端服务（端口 8006）
- 启动前端服务（端口 80）
- 创建并连接到自定义网络

### 3. 访问应用

- 前端页面：http://localhost:5180
- 后端 API：http://localhost:8006
- API 文档：http://localhost:8006/docs

## 详细命令

### 构建镜像

```bash
# 构建所有服务镜像
docker-compose build

# 仅构建后端服务镜像
docker-compose build backend

# 仅构建前端服务镜像
docker-compose build frontend
```

### 启动服务

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 启动指定服务
docker-compose up -d backend

# 启动并查看日志
docker-compose up
```

### 查看服务状态

```bash
docker-compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看指定服务日志
docker-compose logs backend

# 实时查看日志
docker-compose logs -f
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止指定服务
docker-compose stop backend
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启指定服务
docker-compose restart backend
```

## 环境变量

### 后端环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PYTHONUNBUFFERED | 禁用Python缓冲输出 | 1 |
| TESSDATA_PREFIX | Tesseract OCR数据目录 | /usr/share/tesseract-ocr/5/tessdata/ |

## 端口映射

| 服务 | 容器端口 | 主机端口 |
|------|----------|----------|
| 后端 | 8006 | 8006 |
| 前端 | 80 | 5180 |

## 数据持久化

- 临时文件目录：`/tmp` 目录已挂载到容器中，用于处理转换过程中的临时文件
- 所有转换结果直接返回给客户端，不持久化存储

## 常见问题

### 1. 端口被占用

如果遇到端口被占用的情况，可以修改 `docker-compose.yml` 文件中的端口映射：

```yaml
# 例如，将前端端口从80改为8080
ports:
  - "8080:80"
```

### 2. 构建失败

- 确保 Docker 版本符合要求
- 确保网络连接正常，能够拉取基础镜像
- 检查 Dockerfile 中的依赖是否正确

### 3. 服务无法访问

- 检查服务是否正常运行：`docker-compose ps`
- 查看服务日志：`docker-compose logs`
- 检查防火墙设置，确保端口已开放

## 开发建议

### 1. 本地开发

在开发阶段，建议直接运行前后端服务，而不是使用 Docker：

```bash
# 启动后端服务
cd backend
python main.py

# 启动前端服务
cd frontend
npm run dev
```

### 2. 调试模式

如果需要调试后端服务，可以修改 `docker-compose.yml` 文件，启用调试模式：

```yaml
environment:
  - PYTHONUNBUFFERED=1
  - DEBUG=1
```

## 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Host                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                    Docker Network                   │ │
│ │  ┌───────────────┐           ┌────────────────────┐ │ │
│ │  │   Frontend    │           │      Backend       │ │ │
│ │  │   (Nginx)     │──────────▶│  (FastAPI + OCR)   │ │ │
│ │  └───────────────┘           └────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 注意事项

1. 首次构建镜像可能需要较长时间，因为需要安装所有依赖
2. 确保系统资源充足，特别是内存和CPU，因为OCR处理可能需要较多资源
3. 定期清理不再使用的镜像和容器，以释放磁盘空间
4. 生产环境建议使用HTTPS，可通过修改Nginx配置实现

## 更新服务

当代码更新后，需要重新构建和启动服务：

```bash
docker-compose down
docker-compose up -d --build
```

## 许可证

MIT
