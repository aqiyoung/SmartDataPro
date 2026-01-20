# SmartDataPro - 智能数据处理平台

一个基于 FastAPI 和 React 构建的数据处理平台，支持文档、网页、视频等多种格式之间的转换与处理。

## 项目名称

- 中文名称：智能数据处理平台
- 英文名称：SmartDataPro

## 功能特性

- ⚡ **快速处理**：高效的数据处理算法，快速完成各种格式转换
- 📄 **文档转换**：支持Word、Markdown、HTML、PDF等多种文档格式之间的转换
- 🌐 **网页处理**：支持网页内容抓取和转换
- 🎬 **视频处理**：支持视频格式转换、剪辑和处理（规划中）
- 🐛 **媒体内容采集**：支持小红书、抖音、快手、B站、微博、贴吧、知乎等平台的内容采集
- 🎨 **样式定制**：多种HTML样式主题，满足不同需求
- 🔒 **安全可靠**：本地处理，保护您的数据隐私安全
- 👁️ **实时预览**：支持多种格式文件在线预览，方便查看处理结果
- 📱 **响应式设计**：适配各种设备，随时随地进行数据处理

## 支持的转换类型

- 📄 Word 转 Markdown
- 🌐 网页转 Word
- 📄 PDF 转 Word
- 📄 Word 转 PDF
- ✏️ **Markdown 编辑器**：支持多端模拟预览、一键导出 HTML/Word、实时渲染
- 🐛 **媒体内容采集**：支持小红书、抖音、快手、B站、微博、贴吧、知乎等平台的内容采集

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

1. **Debian/Ubuntu 脚本**
   ```bash
   # 赋予脚本执行权限
   chmod +x start-all.sh
   
   # 执行启动脚本
   ./start-all.sh
   ```

2. **Windows 批处理脚本**
   ```bash
   start-all.cmd
   ```

3. **PowerShell 脚本**
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

#### 方式三：Docker 部署

1. **环境要求**
   - Docker 20.10+
   - Docker Compose 1.29+

2. **部署步骤**
   ```bash
   # 克隆仓库
   git clone git@github.com:aqiyoung/SmartDataPro.git
   cd SmartDataPro
   
   # 构建镜像
   docker-compose build
   
   # 启动服务
   docker-compose up -d
   ```

3. **停止服务**
   ```bash
   docker-compose down
   ```

4. **查看日志**
   ```bash
   docker-compose logs -f
   ```

5. **Docker 配置说明**
   - 前端镜像：`ghcr.io/aqiyoung/smartdatapro-frontend:latest`
   - 后端镜像：`ghcr.io/aqiyoung/smartdatapro-backend:latest`
   - 前端端口：`5180`
   - 后端端口：`8016`
   - 健康检查：自动检查服务状态，确保服务正常运行
   - 网络配置：使用自定义网络，确保容器间通信安全

6. **环境变量配置**
   可以通过环境变量调整服务配置，例如：
   ```bash
   # 修改前端端口
   FRONTEND_PORT=8080 docker-compose up -d
   ```

### 访问地址

#### 本地部署
- 前端页面：http://localhost:5180/
- 后端 API：http://localhost:8016/

#### Docker 部署
- 前端页面：http://localhost:5180/
- 后端 API：http://localhost:8016/

### Debian/Ubuntu 启动脚本功能说明

**start-all.sh** 脚本提供了以下功能：

1. **自动依赖检查与安装**
   - 检查并安装系统依赖（Python 3.11、Node.js、tesseract-ocr等）
   - 自动创建Python虚拟环境
   - 安装后端Python依赖
   - 安装前端npm依赖

2. **后台服务启动**
   - 后端服务：使用uvicorn在8016端口启动
   - 前端服务：使用npm run dev在5180端口启动
   - 所有服务后台运行，不阻塞终端

3. **日志管理**
   - 后端日志：`backend.log`（项目根目录）
   - 前端日志：`frontend.log`（项目根目录）
   - 每次启动自动清理旧日志

4. **服务管理**
   - 查看日志：`tail -f backend.log` 或 `tail -f frontend.log`
   - 查找进程：`ps aux | grep -E '(uvicorn|npm)'`
   - 终止服务：`kill <进程ID>`

### 脚本执行过程

执行脚本后，脚本将：
1. 显示启动欢迎信息
2. 清理旧日志文件
3. 检查并安装系统依赖
4. 创建并激活Python虚拟环境
5. 安装后端依赖
6. 安装前端依赖
7. 后台启动后端服务
8. 后台启动前端服务
9. 显示服务启动信息和访问地址

### 注意事项

- 脚本需要使用sudo权限安装系统依赖
- 首次运行会安装所有依赖，可能需要较长时间
- 确保端口5180和8016未被占用
- 服务启动后，可通过日志文件查看运行状态

## 项目构建

### GitHub Actions工作流

项目使用GitHub Actions实现自动构建和推送Docker镜像到GitHub Container Registry。

#### 工作流配置

**文件名**: `.github/workflows/docker-build-push.yml`

**触发条件**:
- 代码推送到`main`分支
- 创建Pull Request到`main`分支
- 手动触发

**工作流作业**:

1. **build-backend**
   - 构建后端Docker镜像
   - 推送镜像到GitHub Container Registry
   - 标签: `ghcr.io/{owner}/smartdatapro-backend:latest`, `ghcr.io/{owner}/smartdatapro-backend:{branch}`, `ghcr.io/{owner}/smartdatapro-backend:{sha}`
   
2. **build-frontend**
   - 构建前端Docker镜像
   - 推送镜像到GitHub Container Registry
   - 标签: `ghcr.io/{owner}/smartdatapro-frontend:latest`, `ghcr.io/{owner}/smartdatapro-frontend:{branch}`, `ghcr.io/{owner}/smartdatapro-frontend:{sha}`

#### 构建流程

1. 检出代码
2. 设置Docker Buildx
3. 登录到GitHub Container Registry
4. 提取Docker元数据
5. 构建并推送Docker镜像

#### 缓存策略

使用GitHub Actions缓存来加速构建过程，缓存类型为`gha`，缓存模式为`max`。

## 项目结构

```
SmartDataPro/
├── backend/            # 后端代码
│   ├── src/            # 后端源代码
│   │   ├── converters/ # 转换逻辑
│   │   │   ├── markdown_to_docx.py # Markdown 转 Word
│   │   │   ├── markdown_to_html.py # Markdown 转 HTML
│   │   │   ├── web_to_docx.py      # 网页转 Word
│   │   │   ├── word_to_pdf.py      # Word 转 PDF
│   │   │   ├── pdf_to_word.py      # PDF 转 Word
│   │   │   └── docx2md.py          # Word 转 Markdown
│   │   ├── crawlers/   # 爬虫功能
│   │   │   └── media_crawler/ # 媒体内容采集
│   │   │       └── __init__.py # 媒体爬虫实现
│   │   └── utils/      # 工具函数
│   ├── app.py          # FastAPI 应用
│   ├── main.py         # 启动文件
│   └── requirements.txt # 依赖列表
├── frontend/           # 前端代码
│   ├── src/            # 前端源代码
│   │   ├── components/ # 组件
│   │   ├── pages/      # 页面
│   │   ├── MarkdownEditor.css # Markdown 编辑器样式
│   │   ├── MarkdownEditorPage.jsx # Markdown 编辑器页面
│   │   ├── ConversionPage.jsx # 通用转换页面
│   │   └── HomePage.jsx # 首页
│   ├── App.jsx         # 主应用
│   ├── main.jsx        # 入口文件
│   ├── package.json    # 项目配置
│   └── vite.config.js  # Vite配置
├── .github/workflows/  # GitHub Actions工作流
│   └── docker-build-push.yml # Docker构建推送工作流
├── docker-compose.yml   # Docker Compose配置
├── README.md           # 项目说明
├── start-all.cmd       # Windows 启动脚本
├── start-all.sh        # Linux/macOS 启动脚本
└── start-all.ps1       # PowerShell 脚本
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

## 更新日志

### v2.2.3 (2026-01-20)
- **媒体爬虫优化**：
  - 将术语从"爬取"改为"采集"，更符合规范
  - 优化为只采集文字类信息，不采集媒体视频类内容
  - 添加try-except块处理Playwright初始化错误，提高稳定性
  - 返回真实数据而非模拟内容，提升实用性
- **UI/UX优化**：
  - 优化首页布局，功能特性卡片改为5+4两行排列
  - 移除其他页面的功能特性部分，保持页面简洁
  - 为所有页面添加统一的页脚
  - 优化卡片居中对齐，消除右侧留白
  - 改进布局样式，缩小卡片尺寸，减少页面空间占用
- **代码优化**：
  - 修复布局混乱问题
  - 恢复缺失的转换卡片
  - 修复布局过大问题
  - 优化路由配置

### v2.2.2 (2026-01-20)
- **功能增强**：
  - 添加小红书样式支持：在Markdown编辑器中新增小红书样式选项
  - 优化Markdown编辑器主题选择器：在PC端和移动端均添加小红书样式选项
  - 修复后端服务启动失败问题：优化静态文件挂载和根路径路由配置
  - 改进docker-compose.yml配置：移除不支持的resources配置，优化依赖关系

### v2.2.1 (2026-01-19)
- **功能修复**：
  - 修复复制按钮功能：确保只复制渲染后的纯文本内容，不包含HTML代码
  - 优化复制按钮样式：恢复蓝色背景，与其他按钮形成视觉区分
  - 添加复制成功提示：实现浮动提示消息，显示复制结果
  - 修复docker-compose.yml配置：优化健康检查和依赖关系配置

### v2.2.0 (2026-01-18)
- **性能优化**：
  - 前端构建优化：启用代码分割、CSS分割和资源预构建，减少加载时间
  - Nginx配置优化：启用gzip压缩、配置静态资源缓存和API缓存，提高响应速度
  - 后端性能优化：更新Uvicorn配置，增加工作进程，优化日志级别，添加GZip压缩
  - 端口变更：后端端口从8006变更为8016

### v2.1.0 (2026-01-17)
- **UI/UX优化**：
  - 修复网页转Word手机端URL输入框超出屏幕问题，优化移动端输入体验
  - Markdown编辑器移动端优化：解决控件遮挡问题，实现二级菜单布局
  - 调整导航元素布局，确保在不同设备上显示正常
  - 优化移动端工具栏，支持滑动选择
- **功能优化**：
  - 增强网页转Word的图片处理能力
  - 优化生成Word文档的排版，用自定义符号替代数字编号
  - 移除文档内的数字序号，提高文档可读性

### v2.0.1 (2026-01-16)
- **修复内容**：
  - 修复了app.title中版本为2.0.0，但/api/端点返回版本为1.0.0的问题
  - 修复了静态文件服务配置，现在支持开发和生产环境
  - 修复了网页转Word时数字序号仍然出现的问题
  - 修复了功能特性卡片中第一个图标的显示错误
- **优化内容**：
  - 优化了错误处理逻辑，减少了重复代码
  - 改进了静态文件服务配置，提高了可靠性
  - 创建了`ConversionCard`组件，减少了重复代码
  - 为实时预览功能添加了防抖机制（500ms）

### v2.0.0 (2026-01-15)
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

## 许可证

本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: https://github.com/aqiyoung/SmartDataPro/issues
- 邮箱：aqiyoung@163.com
