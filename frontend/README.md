# 统一文档转换工具 - 前端

## 如何访问

### 独立首页
访问地址：`index_home.html`
- 这是一个纯HTML的独立首页，无需React环境即可运行
- 包含所有转换功能的入口链接
- 支持点击卡片直接跳转到对应转换页面

### 转换页面
访问地址：`index.html#/convert/{转换类型}`

## 转换类型

1. **Word 转 Markdown** - `index.html#/convert/word-to-md`
2. **Markdown 转 HTML** - `index.html#/convert/md-to-html`
3. **网页转 Word** - `index.html#/convert/web-to-docx`
4. **PDF 转 Word** - `index.html#/convert/pdf-to-word`
5. **Word 转 PDF** - `index.html#/convert/word-to-pdf`

## 开发说明

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建版本
```bash
npm run preview
```

## 技术栈

- React 18
- Vite
- Axios