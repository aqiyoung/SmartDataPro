# DocMagic

一个基于 FastAPI 和 React 构建的文档格式转换工具，支持多种格式之间的转换。

## 功能特性

- **文档格式转换**
  - 支持多种文档格式之间的转换
  - 支持网页转Word
  - 支持Word转PDF
  - 支持PDF转Word
  - 支持Markdown转HTML
  - 支持Markdown转Word

- **用户友好的界面**
  - 基于React的现代化前端界面
  - 简洁易用的操作流程
  - 实时转换状态显示

- **高性能后端**
  - 基于FastAPI的高性能后端
  - 支持异步处理
  - 支持多种转换引擎

## 技术栈

- **前端**：React, Vite, Axios
- **后端**：FastAPI, Python
- **部署**：Docker, Docker Compose

## 快速开始

### 本地开发

1. **克隆仓库**
   ```bash
   git clone git@github.com:aqiyoung/DocMagic.git
   cd DocMagic
   ```

2. **启动后端服务**
   ```bash
   cd backend
   python -m uvicorn app:app --host 0.0.0.0 --port 8006 --reload
   ```

3. **启动前端服务**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **访问应用**
   - 前端：http://localhost:5180
   - 后端API文档：http://localhost:8006/docs

### Docker部署

1. **构建镜像**
   ```bash
   docker-compose build
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

3. **访问应用**
   - 前端：http://localhost:5180
   - 后端API文档：http://localhost:8006/docs

## 项目结构

```
DocMagic/
├── backend/          # 后端代码
│   ├── src/          # 源代码
│   ├── app.py        # FastAPI应用入口
│   ├── main.py       # 主程序入口
│   └── requirements.txt # 依赖列表
├── frontend/         # 前端代码
│   ├── src/          # 源代码
│   ├── package.json  # 项目配置
│   └── vite.config.js # Vite配置
├── docker-compose.yml # Docker Compose配置
├── README.md         # 项目说明
└── start-all.cmd     # 启动脚本
```

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: https://github.com/aqiyoung/DocMagic/issues

