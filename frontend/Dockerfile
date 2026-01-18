# 使用国内镜像源加速拉取 Node.js 镜像
FROM registry.cn-hangzhou.aliyuncs.com/library/node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 使用国内 npm 源安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目代码
COPY . .

# 构建生产版本，增加调试日志
RUN npm run build -- --debug

# 使用国内镜像源拉取 Nginx 镜像
FROM registry.cn-hangzhou.aliyuncs.com/library/nginx:alpine

# 复制构建好的前端文件到 Nginx 静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件（确保文件存在）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
