import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MarkdownEditor.css';

const MarkdownEditorPage = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlPreview, setHtmlPreview] = useState('');
  const [theme, setTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [previewScale, setPreviewScale] = useState(100);
  const [previewDevice, setPreviewDevice] = useState('full');
  const textareaRef = useRef(null);

  // 默认示例文本
  useEffect(() => {
    const defaultText = `# 微信 Markdown 编辑器

## 📝 项目介绍

Markdown 文档自动即时渲染为微信图文，让你不再为微信内容排版而发愁！只要你会基本的 Markdown 语法（现在有了 AI，你甚至不需要会 Markdown），就能做出一篇样式简洁而又美观大方的微信图文。

## 🤔 为何开发这款编辑器

现有的开源微信 Markdown 编辑器样式繁杂，排版过程中往往需要额外调整，影响使用效率。为了解决这一问题，我们打造了一款更加简洁、优雅的编辑器，提供更流畅的排版体验。

## ✨ 功能特性

### 🎨 核心功能

- ✅ **完整 Markdown 支持** - 支持所有基础语法、数学公式
- ✅ **图表渲染** - 支持 Mermaid 图表和 GFM 警告块
- ✅ **PlantUML 支持** - 强大的 UML 图表渲染
- ✅ **Ruby 注音扩展** - 支持 [文字]{注音}、[文字]^(注音) 格式，支持多种分隔符

### 🎯 编辑体验

- ✅ **代码高亮** - 丰富的代码块高亮主题，提升代码可读性
- ✅ **自定义样式** - 允许自定义主题色和 CSS 样式，灵活定制展示效果
- ✅ **草稿保存** - 内置本地内容管理功能，支持草稿自动保存

### 🚀 高级功能

- ✅ **多图床支持** - 提供多种图床选择，便捷的图片上传功能
- ✅ **文件管理** - 便捷的文件导入、导出功能，提升工作效率
- ✅ **AI 集成** - 集成主流 AI 模型，智能辅助内容创作

## 🖼️ 支持的图床服务

| # | 图床 | 使用时是否需要配置 | 备注 |
|---|---|---|---|
| 1 | 默认 | 否 | - |
| 2 | GitHub | 配置 Repo、Token 参数 | 如何获取 GitHub token？ |
| 3 | 阿里云 | 配置 AccessKey ID、AccessKey Secret、Bucket、Region 参数 | 如何使用阿里云 OSS？ |
| 4 | 腾讯云 | 配置 SecretId、SecretKey、Bucket、Region 参数 | 如何使用腾讯云 COS？ |
| 5 | 七牛云 | 配置 AccessKey、SecretKey、Bucket、Domain、Region 参数 | 如何使用七牛云 Kodo？ |
| 6 | MinIO | 配置 Endpoint、Port、UseSSL、Bucket、AccessKey、SecretKey 参数 | 如何使用 MinIO？ |
| 7 | 公众号 | 配置 appID、appsecret、代理域名 参数 | 如何使用公众号图床？ |
| 8 | Cloudflare R2 | 配置 AccountId、AccessKey、SecretKey、Bucket、Domain 参数 | 如何使用 S3 API 操作 R2？ |
| 9 | 又拍云 | 配置 Bucket、Operator、Password、Domain 参数 | 如何使用 又拍云？ |
| 10 | Telegram | 配置 Bot Token、Chat ID 参数 | 如何使用 Telegram 图床？ |
| 11 | Cloudinary | 配置 Cloud Name、API Key、API Secret 参数 | 如何使用 Cloudinary？ |
| 12 | 自定义上传 | 是 | 如何自定义上传？ |

## 🛠️ 开发与部署

\`\`\`bash
# 安装 node 版本
nvm i && nvm use

# 安装依赖
pnpm i

# 启动开发模式
pnpm web dev
# 访问 http://localhost:5173/md/
\`\`\`

`;
    setMarkdownText(defaultText);
    handleLivePreview(defaultText, 'default');
  }, []);

  // 实时预览
  const handleLivePreview = async (text, currentTheme) => {
    if (!text && !text.trim()) {
      setHtmlPreview('');
      return;
    }
    
    // setIsLoading(true); // 实时预览不显示全屏加载，体验更好
    try {
      const tempFile = new Blob([text], { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', tempFile, 'temp.md');
      formData.append('style', currentTheme || theme);
      
      const response = await axios.post('/api/convert/markdown-to-html', formData);
      setHtmlPreview(response.data);
    } catch (err) {
      console.error('预览失败:', err);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setMarkdownText(text);
    handleLivePreview(text, theme);
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    handleLivePreview(markdownText, newTheme);
  };

  const handleScaleChange = (type) => {
    if (type === 'plus') setPreviewScale(prev => Math.min(prev + 10, 200));
    if (type === 'minus') setPreviewScale(prev => Math.max(prev - 10, 50));
  };

  const handleDeviceChange = (e) => {
    setPreviewDevice(e.target.value);
  };

  // 插入语法
  const insertSyntax = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setMarkdownText(newText);
    handleLivePreview(newText, theme);
    
    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setMarkdownText(text);
      handleLivePreview(text, theme);
    };
    reader.readAsText(file);
    // 清空input值，允许重复上传同一文件
    e.target.value = null;
  };

  // 保存为Word
  const handleSaveAsWord = async () => {
    if (!markdownText.trim()) {
      alert('请输入Markdown内容');
      return;
    }
    
    setIsConverting(true);
    try {
      // 提取标题作为文件名
      let filename = 'document.md';
      let outputFilename = 'document.docx';
      const titleMatch = markdownText.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim().replace(/[\\/:*?"<>|]/g, '-');
        filename = `${title}.md`;
        outputFilename = `${title}.docx`;
      }

      const tempFile = new Blob([markdownText], { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', tempFile, filename);
      formData.append('style', theme);
      
      const response = await axios.post('/api/convert/markdown-to-docx', formData, {
        responseType: 'blob'
      });
      
      // 下载文件
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // 优先使用提取的标题作为文件名，如果后端有返回更准确的则使用后端的（通常后端会返回 based on input filename）
      // 这里为了确保标题生效，如果提取到了标题，就优先使用
      if (titleMatch && titleMatch[1]) {
         // 已经设置了 outputFilename
      } else {
          // 尝试从 header 获取
          const contentDisposition = response.headers['content-disposition'];
          if (contentDisposition) {
            const matches = /filename\*=utf-8''([^;]+)/.exec(contentDisposition);
            if (matches && matches[1]) {
              outputFilename = decodeURIComponent(matches[1]);
            } else {
              const matches2 = /filename="([^"]+)"/.exec(contentDisposition);
              if (matches2 && matches2[1]) {
                outputFilename = matches2[1];
              }
            }
          } else {
             // 使用当前时间戳生成文件名
             const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
             outputFilename = `document-${timestamp}.docx`;
          }
      }
      
      link.setAttribute('download', outputFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Word文档导出成功');
    } catch (err) {
      console.error('导出Word失败:', err);
      alert('导出Word失败，请重试');
    } finally {
      setIsConverting(false);
    }
  };

  // 导出HTML功能
  const handleExportHtml = () => {
    // 提取标题作为文件名
    let filename = 'markdown-export.html';
    const titleMatch = markdownText.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      filename = `${titleMatch[1].trim()}.html`;
    }
    
    const blob = new Blob([htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('HTML文件已导出');
  };

  // 复制功能
  const handleCopy = () => {
    const iframe = document.querySelector('.preview-iframe');
    if (iframe && iframe.contentDocument) {
      try {
        const doc = iframe.contentDocument;
        const selection = iframe.contentWindow.getSelection();
        const range = doc.createRange();
        range.selectNodeContents(doc.body);
        selection.removeAllRanges();
        selection.addRange(range);
        
        const successful = doc.execCommand('copy');
        selection.removeAllRanges();
        
        if (successful) {
          alert('已复制渲染后的内容到剪贴板，可直接到公众号后台粘贴');
        } else {
          throw new Error('复制命令执行失败');
        }
      } catch (err) {
        console.error('复制失败:', err);
        navigator.clipboard.writeText(htmlPreview)
          .then(() => alert('已复制HTML源代码（渲染复制失败）'))
          .catch(() => alert('复制失败，请手动复制'));
      }
    }
  };

  // 返回首页
  const goHome = () => {
    window.location.pathname = '/';
  };

  return (
    <div className="md-editor-container">
      {/* 顶部导航栏 */}
      <nav className="md-navbar">
        <div className="md-navbar-left">
          <button className="md-home-btn" onClick={goHome} title="返回首页">
            🏠
          </button>
          <div className="md-logo" onClick={goHome}>
            <span>Markdown</span>
          </div>
          <div className="md-toolbar-top">
            <select className="md-select" value="default">
              <option value="default">默认样式</option>
            </select>
            <select className="md-select" value="default">
              <option value="default">代码主题</option>
            </select>
            <select className="md-select" value={theme} onChange={handleThemeChange}>
              <option value="default">默认样式</option>
              <option value="clean">简洁模式</option>
              <option value="modern">现代模式</option>
              <option value="book">书籍模式</option>
              <option value="docs">文档模式</option>
              <option value="tech_blue">科技蓝</option>
              <option value="dark_mode">暗黑模式</option>
              <option value="wechat">微信公众号</option>
              <option value="github">GitHub 风格</option>
              <option value="neurapress">NeuraPress</option>
            </select>
          </div>
        </div>
        <div className="md-navbar-right">
          <button className="md-btn" onClick={() => document.getElementById('md-upload-input').click()}>
            📂 导入
          </button>
          <input
            type="file"
            id="md-upload-input"
            accept=".md,.markdown,.txt"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button className="md-btn" onClick={handleSaveAsWord} disabled={isConverting}>
            {isConverting ? '⏳ 转换中...' : '📝 转 Word'}
          </button>
          <button className="md-btn" onClick={handleExportHtml}>
            🌐 导出 HTML
          </button>
          <button className="md-btn primary" onClick={handleCopy}>
            ❐ 复制
          </button>
        </div>
      </nav>

      {/* 编辑器主体 */}
      <div className="md-main">
        {/* 左侧编辑区 */}
        <div className="md-pane editor">
          {/* 工具栏 */}
          <div className="md-editor-toolbar">
            <button className="toolbar-btn" onClick={() => insertSyntax('# ')}>H1</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('## ')}>H2</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('### ')}>H3</button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('**', '**')}>B</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('*', '*')}>I</button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('- ')}>≣</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('1. ')}>1.</button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('> ')}>”</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('`', '`')}>&lt;&gt;</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('```\n', '\n```')}>Code</button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('[]()', '')}>🔗</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('![]()', '')}>🖼️</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('| | |\n|---|---|\n| | |', '')}>田</button>
          </div>
          <textarea
            ref={textareaRef}
            className="md-textarea"
            value={markdownText}
            onChange={handleTextChange}
            placeholder="在此输入 Markdown 内容..."
          />
        </div>

        {/* 右侧预览区 */}
        <div className="md-pane preview">
          <div className="preview-header">
            <div className="preview-controls-left">
              <button onClick={() => handleScaleChange('minus')} className="icon-btn" title="缩小">➖</button>
              <span>{previewScale}%</span>
              <button onClick={() => handleScaleChange('plus')} className="icon-btn" title="放大">➕</button>
            </div>
            <div className="preview-controls-right">
              <select value={previewDevice} onChange={handleDeviceChange} className="device-select">
                <option value="mobile-s">小屏 (320px)</option>
                <option value="mobile-m">中屏 (375px)</option>
                <option value="tablet">平板 (768px)</option>
                <option value="full">全屏</option>
              </select>
            </div>
          </div>
          <div className="preview-content-wrapper">
            {htmlPreview ? (
              <div 
                className={`preview-device-container ${previewDevice}`}
                style={{
                  transform: `scale(${previewScale / 100})`,
                }}
              >
                <iframe
                  title="HTML Preview"
                  srcDoc={htmlPreview}
                  className="preview-iframe"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="loading-overlay">预览加载中...</div>
            )}
          </div>
        </div>
      </div>
      <footer className="md-footer">
        <p>统一文档转换工具 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default MarkdownEditorPage;
