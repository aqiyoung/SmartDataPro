# 统一文档转换工具 - 变更日志

## 版本 2.0.1 (2026-01-16)

### 修复内容

#### 后端修复
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

#### 前端修复
1. **功能特性图标显示问题**
   - 修复了功能特性卡片中第一个图标的显示错误
   - 将无效图标替换为正确的📄图标
   - 文件：`frontend/src/ConversionPage.jsx`

### 优化内容

#### 后端优化
1. **统一错误处理**
   - 优化了错误处理逻辑，减少了重复代码
   - 文件：`backend/app.py`

2. **静态文件服务优化**
   - 改进了静态文件服务配置，提高了可靠性
   - 文件：`backend/app.py`

#### 前端优化
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

### 新功能

1. **组件化架构**
   - 引入了组件化设计，提高了代码的复用性和可维护性
   - 为后续功能扩展奠定了基础

2. **性能优化**
   - 通过防抖机制减少了API调用次数
   - 提高了应用的响应速度和用户体验

## 版本 2.0.0 (2026-01-15)

### 主要功能

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

### 技术栈

- **后端**：FastAPI, Python
- **前端**：React, Vite
- **文档转换**：python-docx, markdown, BeautifulSoup
- **容器化**：Docker, Docker Compose
