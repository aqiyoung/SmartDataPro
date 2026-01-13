FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci --no-audit

# 复制应用代码
COPY . .

# 构建生产版本
RUN npm run build

# 使用Nginx作为服务器
FROM nginx:stable-alpine

# 复制构建产物到Nginx静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]