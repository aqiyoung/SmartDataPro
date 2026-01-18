# 第一阶段：构建前端代码
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制依赖清单，利用 Docker 缓存
COPY package*.json ./

# 使用国内 npm 源加速安装
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目代码
COPY . .

# 构建生产版本，开启调试日志便于排查
RUN npm run build

# 第二阶段：生成 Nginx 镜像
FROM nginx:alpine

# 复制构建好的前端文件到 Nginx 静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 内置基础 Nginx 配置（避免依赖外部文件）
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 解决 Vue/React 路由刷新 404 问题
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
