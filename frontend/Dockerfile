# 使用官方Node.js镜像作为基础镜像，直接从Docker Hub拉取
FROM docker.io/library/node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目代码
COPY . .

# 构建生产版本
RUN npm run build

# 使用Nginx作为生产服务器，直接从Docker Hub拉取
FROM docker.io/library/nginx:alpine

# 复制构建好的前端文件到Nginx的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]