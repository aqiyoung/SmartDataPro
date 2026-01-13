# 统一文档转换工具

一个功能全面的文档格式转换工具，支持多种文档格式之间的相互转换，提供简单易用的Web界面。

## 功能特性

### 文档转换功能
- 📄 **Word 转 Markdown**：将DOC/DOCX文件转换为Markdown格式
- ✍️ **Markdown 转 HTML**：将Markdown文件转换为HTML，支持多种样式
- 🌐 **网页转 Word**：将网页内容转换为DOCX文件，支持普通网页和微信公众号文章
- 📑 **PDF 转 Word**：将PDF文件转换为可编辑的DOCX格式
- 📄 **Word 转 PDF**：将DOC/DOCX文件转换为PDF格式

### 技术特性
- 前后端分离架构
- 支持实时预览（Markdown转HTML）
- 友好的用户界面
- 支持多种样式选择
- 错误处理机制完善
- 支持跨域访问

## 技术栈

### 前端
- **框架**：React 18
- **构建工具**：Vite
- **HTTP客户端**：Axios
- **样式**：CSS3

### 后端
- **框架**：FastAPI
- **语言**：Python 3.11+
- **文档转换库**：
  - mammoth (Word转Markdown)
  - markdown (Markdown转HTML)
  - pdfplumber (PDF处理)
  - python-docx (Word文档生成)
  - Beautiful Soup (网页解析)

## 快速开始

### 前置要求
- Python 3.11+
- Node.js 16+
- npm 或 yarn 或 pnpm

### 安装和运行

#### 1. 克隆仓库
```bash
git clone <repository-url>
cd unified-tools-web
```

#### 2. 运行后端服务
```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 运行服务
python main.py
# 或使用uvicorn直接运行
uvicorn app:app --host 0.0.0.0 --port 8005
```
后端服务将运行在 http://localhost:8005

#### 3. 运行前端服务
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
前端服务将运行在 http://localhost:5180

#### 4. 访问应用
在浏览器中访问 http://localhost:5180 即可使用文档转换工具

## 使用说明

### 1. Word 转 Markdown
1. 点击"Word 转 Markdown"选项
2. 点击"选择文件"按钮，选择要转换的DOC/DOCX文件
3. 等待转换完成，下载转换后的Markdown文件

### 2. Markdown 转 HTML
1. 点击"Markdown 转 HTML"选项
2. 点击"选择文件"按钮，选择要转换的Markdown文件
3. 选择喜欢的HTML样式
4. 等待转换完成，查看预览或下载HTML文件

### 3. 网页转 Word
1. 点击"网页转 Word"选项
2. 在输入框中粘贴要转换的网页URL
3. 点击"转换"按钮
4. 等待转换完成，下载转换后的DOCX文件

### 4. PDF 转 Word
1. 点击"PDF 转 Word"选项
2. 点击"选择文件"按钮，选择要转换的PDF文件
3. 等待转换完成，下载转换后的DOCX文件

### 5. Word 转 PDF
1. 点击"Word 转 PDF"选项
2. 点击"选择文件"按钮，选择要转换的DOC/DOCX文件
3. 等待转换完成，下载转换后的PDF文件

## API文档

后端提供了RESTful API，可直接调用进行文档转换：

### 1. Word 转 Markdown
```
POST /api/convert/docx-to-md
Content-Type: multipart/form-data

file: <DOC/DOCX文件>
```

### 2. Markdown 转 HTML
```
POST /api/convert/markdown-to-html
Content-Type: multipart/form-data

file: <Markdown文件>
style: <样式名称，可选>
```

### 3. 网页转 Word
```
POST /api/convert/web-to-docx
Content-Type: application/x-www-form-urlencoded

url: <网页URL>
```

### 4. PDF 转 Word
```
POST /api/convert/pdf-to-word
Content-Type: multipart/form-data

file: <PDF文件>
```

### 5. Word 转 PDF
```
POST /api/convert/word-to-pdf
Content-Type: multipart/form-data

file: <DOC/DOCX文件>
```

### 6. 获取支持的样式列表
```
GET /api/styles
```

## 项目结构

```
unified-tools-web/
├── backend/                 # 后端代码
│   ├── src/                 # 源代码
│   │   ├── converters/      # 转换工具实现
│   │   └── __init__.py      # 初始化文件
│   ├── app.py               # FastAPI应用
│   ├── main.py              # 服务入口
│   └── requirements.txt     # 依赖列表
├── frontend/                # 前端代码
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── App.jsx          # 应用入口
│   │   └── main.jsx         # 渲染入口
│   ├── package.json         # 依赖配置
│   └── vite.config.js       # Vite配置
├── .gitignore               # Git忽略文件
└── README.md                # 项目说明
```

## 配置说明

### 前端配置
- API基础URL：在`src/App.jsx`中配置
- 端口：在`vite.config.js`中配置

### 后端配置
- 端口：在`main.py`中配置
- CORS允许的源：在`app.py`中配置
- 临时文件目录：使用系统临时目录

## 常见问题

### 1. 转换失败怎么办？
- 检查文件格式是否正确
- 检查网络连接是否正常
- 查看浏览器控制台或服务器日志获取详细错误信息

### 2. 转换后的文件样式不符合预期？
- 对于Markdown转HTML，可以尝试不同的样式
- 对于PDF转Word，部分复杂格式可能无法完美转换

### 3. 网页转换超时？
- 检查网页URL是否正确
- 部分网页可能有反爬机制，无法直接转换
- 尝试增加超时时间配置

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues：https://github.com/aqiyoung/unified-tools-web/issues
- 邮箱：aqiyoung@163.com

## 更新日志

### v1.2.0 (2026-01-13)
- 修复网页转Word功能的500错误
- 优化中文文件名处理
- 完善错误处理机制

### v1.1.0 (2026-01-10)
- 新增PDF转Word功能
- 新增Word转PDF功能
- 优化Markdown转HTML样式

### v1.0.0 (2026-01-05)
- 初始版本
- 支持Word转Markdown
- 支持Markdown转HTML
- 支持网页转Word
