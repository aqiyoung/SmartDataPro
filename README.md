# DocMaster

一个基于 FastAPI 和 React 构建的现代化文档处理平台，支持多种格式之间的转换与处理。

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

## 版本更新

### 版本 2.0.1 (2026-01-16)

#### 修复内容

##### 后端修复
1. **API版本不一致**
   - 修复了app.title中版本为2.0.0，但/api/端点返回版本为1.0.0的问题
   - 文件：`backend/app.py`

2. **静态文件配置错误**
   - 修复了静态文件服务配置，现在支持开发和生产环境
   - 添加了对dist目录的检查，如果存在则使用，否则使用开发目录
   - 文件：`backend/app.py`

3. **列表编号处理**
   - 修复了网页转Word时数字序号仍然出现的问题
   - 实现了多层次的编号移除机制：HTML预处理、块级元素处理、列表处理
   - 文件：`backend/src/converters/web_to_docx.py`

##### 前端修复
1. **功能特性图标显示问题**
   - 修复了功能特性卡片中第一个图标的显示错误
   - 将无效图标替换为正确的📄图标
   - 文件：`frontend/src/ConversionPage.jsx`

#### 优化内容

##### 后端优化
1. **统一错误处理**
   - 优化了错误处理逻辑，减少了重复代码
   - 文件：`backend/app.py`

2. **静态文件服务优化**
   - 改进了静态文件服务配置，提高了可靠性
   - 文件：`backend/app.py`

##### 前端优化
1. **组件化重构**
   - 创建了`ConversionCard`组件，减少了重复代码
   - 提高了代码的可维护性和可读性
   - 文件：`frontend/src/components/ConversionCard.jsx`

2. **实时预览性能优化**
   - 为实时预览功能添加了防抖机制（500ms）
   - 减少了API调用次数，提高了性能
   - 文件：`frontend/src/ConversionPage.jsx`

3. **代码质量提升**
   - 优化了组件结构，提高了代码的可维护性
   - 改进了状态管理，减少了不必要的渲染
   - 文件：`frontend/src/ConversionPage.jsx`

#### 新功能

1. **组件化架构**
   - 引入了组件化设计，提高了代码的复用性和可维护性
   - 为后续功能扩展奠定了基础

2. **性能优化**
   - 通过防抖机制减少了API调用次数
   - 提高了应用的响应速度和用户体验

### 版本 2.0.0 (2026-01-15)

#### 主要功能

1. **多格式转换支持**
   - Word 转 Markdown
   - Markdown 转 HTML
   - 网页转 Word
   - PDF 转 Word
   - Word 转 PDF

2. **实时预览功能**
   - 支持 Markdown 实时预览
   - 多种 HTML 样式主题

3. **现代化架构**
   - 基于 FastAPI 和 React 构建
   - 支持 Docker 部署

#### 技术栈

- **后端**：FastAPI, Python
- **前端**：React, Vite
- **文档转换**：python-docx, markdown, BeautifulSoup
- **容器化**：Docker, Docker Compose

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

