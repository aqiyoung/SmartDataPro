# 统一文档转换工具

一个基于 FastAPI 和 React 构建的文档格式转换工具，支持多种格式之间的转换。

## 功能特性

- ⚡ **快速转换**：高效的转换算法，快速完成文档格式转换
- 🎨 **样式定制**：多种HTML样式主题，满足不同需求
- 🔒 **安全可靠**：本地转换，保护您的文档隐私安全
- 👁️ **实时预览**：支持Markdown和HTML文件在线预览，方便查看转换结果
- 📱 **响应式设计**：适配各种设备，随时随地进行文档转换

## 支持的转换类型

- 📄 Word 转 Markdown
- 📝 Markdown 转 HTML
- 🌐 网页转 Word
- 📄 PDF 转 Word
- 📄 Word 转 PDF

## 技术栈

### 前端
- React 18
- Vite
- Axios

### 后端
- FastAPI
- Python 3.11+
- OCR: pytesseract, OpenCV, PIL
- PDF Processing: pdfplumber
- Word Processing: python-docx

## 快速开始

### 环境要求

- Python 3.11+
- Node.js 16+
- npm 8+

### 启动方式

#### 方式一：使用启动脚本（推荐）

1. **Windows 批处理脚本**
   ```bash
   start-all.cmd
   ```

2. **PowerShell 脚本**
   ```bash
   .\start-all.ps1
   ```

#### 方式二：手动启动

1. **启动后端服务**
   ```bash
   cd backend
   python main.py
   ```

2. **启动前端服务**
   ```bash
   cd frontend
   npm run dev
   ```

### 访问地址

- 前端页面：http://localhost:5180/
- 后端 API：http://localhost:8006/

## 项目结构

```
.
├── backend/            # 后端代码
│   ├── src/            # 后端源代码
│   │   ├── converters/ # 转换逻辑
│   │   └── utils/      # 工具函数
│   ├── app.py          # FastAPI 应用
│   └── main.py         # 启动文件
├── frontend/           # 前端代码
│   ├── src/            # 前端源代码
│   │   ├── components/ # 组件
│   │   └── pages/      # 页面
│   ├── App.jsx         # 主应用
│   └── main.jsx        # 入口文件
├── start-all.cmd       # Windows 启动脚本
├── start-all.ps1       # PowerShell 启动脚本
└── README.md           # 项目说明
```

## 使用说明

1. 在浏览器中访问前端页面：http://localhost:5180/
2. 选择您需要的转换类型
3. 上传文件或输入URL
4. 点击转换按钮
5. 下载或预览转换结果

## 开发说明

### 前端开发

```bash
cd frontend
npm install  # 安装依赖
npm run dev  # 启动开发服务器
npm run build  # 构建生产版本
```

### 后端开发

```bash
cd backend
pip install -r requirements.txt  # 安装依赖
python main.py  # 启动开发服务器
```

## 许可证

MIT
