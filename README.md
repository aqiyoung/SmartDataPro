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
│   │   │   ├── markdown_to_docx.py # Markdown 转 Word
│   │   │   ├── markdown_to_html.py # Markdown 转 HTML
│   │   │   ├── web_to_docx.py      # 网页转 Word
│   │   │   ├── word_to_pdf.py      # Word 转 PDF
│   │   │   ├── pdf_to_word.py      # PDF 转 Word
│   │   │   └── docx2md.py          # Word 转 Markdown
│   │   └── utils/      # 工具函数
│   ├── app.py          # FastAPI 应用
│   └── main.py         # 启动文件
├── frontend/           # 前端代码
│   ├── src/            # 前端源代码
│   │   ├── components/ # 组件
│   │   ├── pages/      # 页面
│   │   ├── MarkdownEditor.css # Markdown 编辑器样式
│   │   ├── MarkdownEditorPage.jsx # Markdown 编辑器页面
│   │   ├── ConversionPage.jsx # 通用转换页面
│   │   └── HomePage.jsx # 首页
│   ├── App.jsx         # 主应用
│   └── main.jsx        # 入口文件
├── start-all.cmd       # Windows 启动脚本
├── start-all.ps1       # PowerShell 脚本
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

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues：https://github.com/aqiyoung/unified-tools-web/issues
- 邮箱：aqiyoung@163.com

## 更新日志

### v2.0.0 (2026-01-16)
- **重大更新**：
  - 新增独立的 Markdown 编辑器，支持多端模拟预览、一键导出 HTML/Word、实时渲染
  - 首页界面重构，采用现代化卡片式布局，优化用户体验
  - 增强 Word 转 PDF 功能：支持图片精准定位、VML 图形兼容、乱码修复
  - 新增“网页转 Word”功能，支持智能提取正文、自动处理样式
  - 优化移动端适配，所有功能完美支持手机/平板访问
- **功能优化**：
  - 统一全站页脚和导航栏样式
  - 优化文件命名逻辑，自动提取标题作为文件名
  - 增强错误处理，提供更友好的用户提示
  - 修复 CSS 样式残留问题，提升 Word 文档导出质量

### v1.3.1 (2026-01-15)
- 优化 OCR 引擎：增加图像预处理（增强、去噪），提升识别准确率
- 兼容性修复：支持无 OpenCV 环境运行，自动降级
- 修复 Word 转 PDF 转换器缩进错误
- 修复后端 OCR 依赖问题

### v1.3.0 (2026-01-14)
- 修复转换无反应问题
- 解决端口冲突问题，配置代理
- 实现Markdown转HTML实时预览
- 统一UI样式，修复布局和对齐问题
- 优化移动端适配
- 添加上传、复制、下载控件
- 修复转换后文件名错误问题
- 修复文件类型识别问题

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
