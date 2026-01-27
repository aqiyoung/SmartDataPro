# MediaCrawler 集成方案

## 1. 项目分析

### MediaCrawler 项目概述
MediaCrawler 是一个功能强大的多平台自媒体数据采集工具，支持小红书、抖音、快手、B站、微博、贴吧、知乎等主流平台的公开信息抓取。

### 核心技术
- 基于 Playwright 浏览器自动化框架
- 无需 JS 逆向，利用浏览器上下文获取签名参数
- 支持多平台登录态缓存
- 提供 WebUI 可视化操作界面

### 主要功能
- 关键词搜索
- 指定帖子ID爬取
- 二级评论爬取
- 指定创作者主页爬取
- IP代理池支持
- 生成评论词云图

## 2. 集成方案

### 集成目标
将 MediaCrawler 集成到 SmartDataPro 项目中，扩展其功能，使其能够从多个自媒体平台抓取内容并进行转换。

### 集成架构

```
SmartDataPro
├── backend/            # 原有后端代码
│   ├── src/            # 后端源代码
│   │   ├── crawlers/   # 新增爬虫模块
│   │   │   ├── media_crawler/  # MediaCrawler 集成
│   │   │   └── __init__.py
│   │   └── converters/ # 原有转换逻辑
│   ├── app.py          # 新增爬虫API端点
│   └── main.py
├── frontend/           # 原有前端代码
│   ├── src/            # 前端源代码
│   │   ├── components/ # 新增爬虫相关组件
│   │   └── pages/      # 新增爬虫页面
│   └── App.jsx         # 新增路由
└── docker-compose.yml  # 新增 Playwright 依赖
```

### 核心集成点

1. **API 集成**
   - 在 FastAPI 中新增爬虫相关端点
   - 支持多平台内容抓取
   - 支持将抓取内容直接转换为 Markdown/Word

2. **前端集成**
   - 新增爬虫页面
   - 集成 WebUI 可视化操作界面
   - 支持直接使用抓取内容进行编辑和转换

3. **依赖管理**
   - 添加 Playwright 依赖
   - 添加 MediaCrawler 核心依赖
   - 确保与原有依赖兼容

## 3. 实现步骤

### 3.1 后端集成

1. **创建爬虫模块**
   ```bash
   mkdir -p backend/src/crawlers/media_crawler
   ```

2. **添加 MediaCrawler 核心代码**
   - 克隆 MediaCrawler 项目
   - 提取核心代码到 backend/src/crawlers/media_crawler
   - 修改配置，使其适应 DocMagic 项目结构

3. **新增 API 端点**
   ```python
   # backend/app.py
   
   @app.post("/api/crawl/media")
   async def crawl_media(platform: str, url: str = None, keyword: str = None, post_id: str = None):
       """自媒体平台内容抓取"""
       # 调用 MediaCrawler 核心功能
       # 将抓取结果转换为 Markdown 或直接返回
       pass
   ```

4. **添加依赖**
   ```bash
   # backend/requirements.txt
   playwright>=1.40.0
   python-dotenv>=1.0.0
   # 其他 MediaCrawler 依赖
   ```

### 3.2 前端集成

1. **新增爬虫页面**
   ```bash
   mkdir -p frontend/src/pages/MediaCrawlerPage.jsx
   ```

2. **实现爬虫界面**
   - 平台选择
   - 抓取参数配置
   - 实时进度显示
   - 结果预览和转换

3. **添加路由**
   ```jsx
   // frontend/App.jsx
   
   <Route path="/crawler" element={<MediaCrawlerPage />} />
   ```

4. **添加依赖**
   ```bash
   # frontend/package.json
   "dependencies": {
     "axios": "^1.6.0",
     "react-router-dom": "^6.20.0",
     # 其他必要依赖
   }
   ```

### 3.3 Docker 配置

1. **更新 docker-compose.yml**
   ```yaml
   services:
     backend:
       # 原有配置
       environment:
         # 新增 Playwright 环境变量
         - PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
       volumes:
         # 新增 Playwright 浏览器缓存目录
         - playwright-cache:/ms-playwright
     
   volumes:
     playwright-cache:
   ```

2. **更新 Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   
   # 安装 Playwright
   RUN pip install playwright
   RUN playwright install --with-deps
   ```

## 4. 功能扩展

### 4.1 新增转换流程

1. **自媒体平台 → Markdown**
   - 抓取自媒体平台内容
   - 转换为 Markdown 格式
   - 支持直接在 Markdown 编辑器中编辑

2. **自媒体平台 → Word**
   - 抓取自媒体平台内容
   - 直接转换为 Word 文档
   - 支持自定义样式

3. **批量转换**
   - 支持批量抓取和转换
   - 支持定时任务

### 4.2 优化功能

1. **登录态管理**
   - 优化登录流程
   - 支持多账号管理
   - 实现登录态持久化

2. **IP代理池**
   - 集成 IP 代理池
   - 支持自动切换代理
   - 提高爬取成功率

3. **错误处理**
   - 完善错误处理机制
   - 实现断点续爬
   - 提供详细的错误日志

## 5. 安全考虑

1. **合规性**
   - 遵守各平台 robots.txt 规则
   - 限制爬取频率
   - 明确告知用户爬取风险

2. **数据安全**
   - 加密存储登录态
   - 保护用户隐私
   - 实现数据访问控制

3. **稳定性**
   - 实现熔断机制
   - 避免对目标平台造成过大压力
   - 定期更新爬虫规则

## 6. 测试计划

1. **单元测试**
   - 测试核心爬虫功能
   - 测试转换功能
   - 测试 API 端点

2. **集成测试**
   - 测试前后端集成
   - 测试多平台爬取
   - 测试批量转换

3. **性能测试**
   - 测试爬取速度
   - 测试转换效率
   - 测试并发处理能力

## 7. 部署方案

1. **本地部署**
   - 安装 Playwright 浏览器
   - 运行后端服务
   - 运行前端服务

2. **Docker 部署**
   - 使用更新后的 docker-compose.yml
   - 构建新的 Docker 镜像
   - 启动服务

3. **云部署**
   - 支持 Kubernetes 部署
   - 支持 Serverless 部署
   - 提供详细的部署文档

## 8. 后续优化

1. **AI 集成**
   - 集成 AI 内容摘要
   - 支持 AI 内容分类
   - 实现 AI 内容生成

2. **扩展平台支持**
   - 支持更多自媒体平台
   - 支持自定义平台配置
   - 提供平台插件机制

3. **增强用户体验**
   - 优化 WebUI 界面
   - 提供详细的使用文档
   - 支持多语言

4. **性能优化**
   - 优化爬取算法
   - 实现分布式爬取
   - 优化存储机制

## 9. 风险评估

1. **技术风险**
   - Playwright 依赖可能与现有依赖冲突
   - 各平台 API 可能频繁变化
   - 爬取规则可能需要定期更新

2. **法律风险**
   - 爬取行为可能违反各平台服务条款
   - 数据使用可能涉及版权问题
   - 需要明确告知用户相关风险

3. **维护风险**
   - MediaCrawler 项目更新可能导致集成问题
   - 多平台支持需要持续维护
   - 登录态管理需要定期更新

## 10. 结论

将 MediaCrawler 集成到 DocMagic 项目中，可以扩展其功能，使其能够从多个自媒体平台抓取内容并进行转换。集成方案需要考虑技术架构、依赖管理、安全合规等多个方面。通过合理的设计和实现，可以实现两个项目的无缝集成，为用户提供更丰富的功能。