import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const ConversionPage = () => {
  // 从路由参数中获取转换类型
  const { conversionType } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [htmlPreview, setHtmlPreview] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [theme, setTheme] = useState('default');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 使用useRef保存timeoutId，避免闭包问题
  const timeoutRef = React.useRef(null);
  
  // 返回首页的函数
  const goToHomePage = () => {
    window.location.pathname = '/';
  };

  // 处理文件选择
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 处理URL输入变化
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // 处理Markdown输入变化
  const handleMarkdownChange = (e) => {
    const text = e.target.value;
    setMarkdownText(text);
    // 实现实时预览
    handleLivePreview(text);
  };

  // 实时预览处理 - 添加防抖，减少API调用次数
  const handleLivePreview = React.useCallback(async (text) => {
    if (!text.trim()) {
      setHtmlPreview('');
      return;
    }
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 设置新的定时器，500ms后执行
    timeoutRef.current = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        // 使用临时文件创建一个Blob对象
        const tempFile = new Blob([text], { type: 'text/markdown' });
        const formData = new FormData();
        formData.append('file', tempFile, 'temp.md');
        formData.append('style', theme);
        
        // 调用后端API进行转换
        const response = await axios.post('/api/convert/markdown-to-html', formData);
        setHtmlPreview(response.data);
      } catch (err) {
        console.error('预览失败:', err);
        // 实时预览失败时，不显示错误，保持现有预览
      } finally {
        setIsPreviewLoading(false);
      }
    }, 500);
  }, [theme]);

  // 处理主题选择变化
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // 切换主题时更新预览
    if (markdownText.trim()) {
      handleLivePreview(markdownText);
    }
  };

  // 处理转换开始
  const handleConvert = async () => {
    setIsConverting(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      const apiBaseUrl = '/api/convert'; // 使用相对路径，让Vite代理生效
      
      switch (conversionType) {
        case 'word-to-md':
          if (!selectedFile) throw new Error('请选择文件');
          const formData1 = new FormData();
          formData1.append('file', selectedFile);
          response = await axios.post(`${apiBaseUrl}/docx-to-md`, formData1, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          break;
          
        case 'pdf-to-word':
          if (!selectedFile) throw new Error('请选择文件');
          const formData2 = new FormData();
          formData2.append('file', selectedFile);
          response = await axios.post(`${apiBaseUrl}/pdf-to-word`, formData2, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          break;
          
        case 'word-to-pdf':
          if (!selectedFile) throw new Error('请选择文件');
          const formData3 = new FormData();
          formData3.append('file', selectedFile);
          response = await axios.post(`${apiBaseUrl}/word-to-pdf`, formData3, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          break;
          
        case 'web-to-docx':
          if (!url) throw new Error('请输入URL');
          // 使用URLSearchParams来处理application/x-www-form-urlencoded数据
          const params = new URLSearchParams();
          params.append('url', url);
          response = await axios.post(`${apiBaseUrl}/web-to-docx`, params, {
            responseType: 'blob',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          break;
          
        case 'md-to-html':
          // 只支持文本输入方式
          if (!markdownText) throw new Error('请输入Markdown文本');
          
          // 直接发送Markdown文本
          const tempFile = new Blob([markdownText], { type: 'text/markdown' });
          const formData5 = new FormData();
          formData5.append('file', tempFile, 'temp.md');
          formData5.append('style', theme);
          response = await axios.post(`${apiBaseUrl}/markdown-to-html`, formData5, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          break;
          
        default:
          throw new Error('不支持的转换类型');
      }
      
      // 处理响应，下载文件
      const contentDisposition = response.headers['content-disposition'];
      let filename = '';
      
      // 根据转换类型设置默认扩展名
      const extensions = {
        'word-to-md': '.md',
        'pdf-to-word': '.docx',
        'word-to-pdf': '.pdf',
        'web-to-docx': '.docx',
        'md-to-html': '.html'
      };
      const defaultExt = extensions[conversionType] || '.file';
      
      // 所有转换类型都从响应头中提取文件名
      if (contentDisposition) {
        // 从响应头中提取文件名，支持两种格式：
        // 1. 传统格式: filename="文件名.docx"
        // 2. RFC 5987格式: filename*=utf-8''%E6%96%87%E4%BB%B6%E5%90%8D.docx
        let matches;
        
        // 先尝试匹配RFC 5987格式
        matches = /filename\*=utf-8''([^;]+)/.exec(contentDisposition);
        if (matches && matches[1]) {
          // 解码URL编码的文件名
          filename = decodeURIComponent(matches[1]);
        } else {
          // 再尝试匹配传统格式
          matches = /filename="([^"]+)"/.exec(contentDisposition);
          if (matches && matches[1]) {
            filename = matches[1];
          }
        }
      }
      
      // 如果没有获取到文件名，使用默认逻辑
      if (!filename) {
        // 如果有原始文件名，使用原始文件名的基础名称
        if (selectedFile) {
          const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
          filename = baseName + defaultExt;
        } else if (conversionType === 'web-to-docx') {
          // 对于网页转Word，如果没有获取到文件名，使用默认名称
          filename = '网页内容.docx';
        } else {
          // 如果没有原始文件名，使用默认文件名
          filename = 'converted-file' + defaultExt;
        }
      }
      
      // 设置正确的MIME类型
      const mimeTypes = {
        'word-to-md': 'text/markdown',
        'pdf-to-word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'word-to-pdf': 'application/pdf',
        'web-to-docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'md-to-html': 'text/html'
      };
      const mimeType = mimeTypes[conversionType] || 'application/octet-stream';
      
      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // 清理
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      setSuccess('转换成功！文件已开始下载');
    } catch (err) {
      setError(err.message || '转换失败，请重试');
    } finally {
      setIsConverting(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setSelectedFile(null);
    setUrl('');
    setMarkdownText('');
    setHtmlPreview('');
    setTheme('default');
    setError('');
    setSuccess('');
  };

  // 渲染转换界面
  // 功能特性数据，与首页保持一致
  const features = [
    { icon: '⚡', title: '快速转换', description: '高效的转换算法，快速完成文档格式转换' },
    { icon: '🎨', title: '样式定制', description: '多种HTML样式主题，满足不同需求' },
    { icon: '🔒', title: '安全可靠', description: '本地转换，保护您的文档隐私安全' },
    { icon: '👁️', title: '实时预览', description: '支持Markdown和HTML文件在线预览，方便查看转换结果' },
    { icon: '📱', title: '响应式设计', description: '适配各种设备，随时随地进行文档转换' },
  ];

  const renderConversionInterface = () => {
    switch (conversionType) {
      case 'word-to-md':
        return (
          <div className="conversion-card" style={{ position: 'relative' }}>
            <button className="back-home-btn" onClick={() => window.location.pathname = '/'} style={{ top: '2rem', left: '2rem' }}>
              🏠 返回首页
            </button>
            <h3>Word 转 Markdown</h3>
            <p>将Word文档转换为简洁的Markdown格式，保留原始排版结构</p>
            <div className="file-upload-section">
              <button className="file-btn">
                📁 选择Word文件
                <input
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                />
              </button>
              {selectedFile && (
                <p className="file-name">已选择: {selectedFile.name}</p>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="action-buttons">
              <button 
                className="convert-btn" 
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
              </button>
              <button 
                className="reset-btn" 
                onClick={resetForm}
                disabled={isConverting}
              >
                🔄 重置
              </button>
            </div>
          </div>
        );
      
      case 'md-to-html':
        return (
          <div className="conversion-card" style={{ position: 'relative' }}>
            <button className="back-home-btn" onClick={goToHomePage} style={{ top: '2rem', left: '2rem' }}>
              🏠 返回首页
            </button>
            <h3>Markdown 转 HTML</h3>
            <p>将Markdown文本转换为精美的HTML页面，支持多种样式主题</p>
            <div className="theme-selector">
              <label>选择样式主题:</label>
              <select value={theme} onChange={handleThemeChange}>
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
            <div className="markdown-editor-section">
              <div className="editor-container">
                <div className="section-header">
                  <h4>Markdown 编辑区</h4>
                  <div className="editor-actions">
                    <button 
                      className="upload-btn"
                      onClick={() => document.getElementById('md-file-upload').click()}
                    >
                      上传
                      <input
                        type="file"
                        id="md-file-upload"
                        accept=".md,.markdown"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedFile(file); // 保存文件对象以便获取文件名
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target.result;
                              setMarkdownText(content);
                              // 上传文件后触发实时预览
                              handleLivePreview(content);
                            };
                            reader.readAsText(file);
                          }
                          // 清空input值，允许重复上传同一文件
                          e.target.value = null;
                        }}
                      />
                    </button>
                  </div>
                </div>
                <textarea
                  value={markdownText}
                  onChange={handleMarkdownChange}
                  placeholder="在此输入Markdown文本，支持实时预览..."
                  rows={10}
                ></textarea>
              </div>
              <div className="preview-container">
                <div className="section-header">
                  <h4>HTML 预览区</h4>
                  <div className="preview-actions">
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        const iframe = document.querySelector('.html-preview-iframe');
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
                            // 降级方案：复制源代码
                            navigator.clipboard.writeText(htmlPreview)
                              .then(() => alert('已复制HTML源代码（渲染复制失败）'))
                              .catch(() => alert('复制失败，请手动复制'));
                          }
                        } else {
                          // 没有iframe时的降级方案
                          navigator.clipboard.writeText(htmlPreview)
                            .then(() => alert('HTML内容已复制到剪贴板'))
                            .catch(err => console.error('复制失败:', err));
                        }
                      }}
                    >
                      复制
                    </button>
                    <button 
                      className="download-btn"
                      onClick={() => {
                        let filename = 'preview.html';
                        if (selectedFile) {
                          // 如果有上传的文件，使用文件名
                          filename = selectedFile.name.replace(/\.[^/.]+$/, '.html');
                        } else {
                          // 尝试从Markdown内容中提取一级标题
                          const match = markdownText.match(/^#\s+(.+)$/m);
                          if (match) {
                            filename = match[1].trim() + '.html';
                          }
                        }

                        const blob = new Blob([htmlPreview], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      下载
                    </button>
                  </div>
                </div>
                <div className="preview-content">
                  {isPreviewLoading ? (
                    <div className="preview-placeholder">
                      <div className="loading-spinner"></div>
                      正在生成预览...
                    </div>
                  ) : htmlPreview ? (
                    <iframe
                      title="HTML Preview"
                      srcDoc={htmlPreview}
                      className="html-preview-iframe"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      预览区域
                    </div>
                  )}
                </div>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="action-buttons">
              <button 
                className="convert-btn" 
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
              </button>
              <button 
                className="reset-btn" 
                onClick={resetForm}
                disabled={isConverting}
              >
                🔄 重置
              </button>
            </div>
          </div>
        );
      
      case 'web-to-docx':
        return (
          <div className="conversion-card" style={{ position: 'relative' }}>
            <button className="back-home-btn" onClick={() => window.location.pathname = '/'} style={{ top: '2rem', left: '2rem' }}>
              🏠 返回首页
            </button>
            <h3>网页转 Word</h3>
            <p>将网页内容转换为Word文档，支持普通网页和微信公众号文章</p>
            <div className="url-input-section">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="输入网页URL (例如: https://example.com)"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="action-buttons">
              <button 
                className="convert-btn" 
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
              </button>
              <button 
                className="reset-btn" 
                onClick={resetForm}
                disabled={isConverting}
              >
                🔄 重置
              </button>
            </div>
          </div>
        );
      
      case 'pdf-to-word':
        return (
          <div className="conversion-card" style={{ position: 'relative' }}>
            <button className="back-home-btn" onClick={goToHomePage} style={{ top: '2rem', left: '2rem' }}>
              🏠 返回首页
            </button>
            <h3>PDF 转 Word</h3>
            <p>将PDF文档转换为Word文档，保留原始排版结构</p>
            <div className="file-upload-section">
              <button className="file-btn">
                📁 选择PDF文件
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </button>
              {selectedFile && (
                <p className="file-name">已选择: {selectedFile.name}</p>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="action-buttons">
              <button 
                className="convert-btn" 
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
              </button>
              <button 
                className="reset-btn" 
                onClick={resetForm}
                disabled={isConverting}
              >
                🔄 重置
              </button>
            </div>
          </div>
        );
      
      case 'word-to-pdf':
        return (
          <div className="conversion-card" style={{ position: 'relative' }}>
            <button className="back-home-btn" onClick={goToHomePage} style={{ top: '2rem', left: '2rem' }}>
              🏠 返回首页
            </button>
            <h3>Word 转 PDF</h3>
            <p>将Word文档转换为PDF文档，保留原始排版结构</p>
            <div className="file-upload-section">
              <button className="file-btn">
                📁 选择Word文件
                <input
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                />
              </button>
              {selectedFile && (
                <p className="file-name">已选择: {selectedFile.name}</p>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="action-buttons">
              <button 
                className="convert-btn" 
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
              </button>
              <button 
                className="reset-btn" 
                onClick={resetForm}
                disabled={isConverting}
              >
                🔄 重置
              </button>
            </div>
          </div>
        );
      
      default:
        return <div>请选择转换类型</div>;
    }
  };

  

  return (
    <div className="app-container">
      <main className="app-main">
        {/* 转换功能区域 - 主要内容 */}
        {renderConversionInterface()}

        {/* 功能特性部分，与首页保持一致 */}
        <section className="features-section">
          <h2 className="features-title">功能特性</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>智能文档处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default ConversionPage;
