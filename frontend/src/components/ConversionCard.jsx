import React from 'react';

const ConversionCard = ({ 
  title, 
  description, 
  conversionType, 
  selectedFile, 
  url, 
  markdownText, 
  htmlPreview, 
  isPreviewLoading, 
  theme, 
  isConverting, 
  error, 
  success, 
  onFileChange, 
  onUrlChange, 
  onMarkdownChange, 
  onThemeChange, 
  onConvert, 
  onReset, 
  onGoHome 
}) => {
  // 渲染文件上传区域
  const renderFileUploadSection = (accept) => {
    return (
      <div className="file-upload-section">
        <button className="file-btn">
          📁 选择文件
          <input
            type="file"
            accept={accept}
            onChange={onFileChange}
          />
        </button>
        {selectedFile && (
          <p className="file-name">已选择: {selectedFile.name}</p>
        )}
      </div>
    );
  };

  // 渲染URL输入区域
  const renderUrlInputSection = () => {
    return (
      <div className="url-input-section">
        <input
          type="url"
          value={url}
          onChange={onUrlChange}
          placeholder="输入网页URL (例如: https://example.com)"
        />
      </div>
    );
  };

  // 渲染Markdown编辑和预览区域
  const renderMarkdownSection = () => {
    return (
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
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target.result;
                        onMarkdownChange({ target: { value: content } });
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
            onChange={onMarkdownChange}
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
    );
  };

  // 渲染主题选择器
  const renderThemeSelector = () => {
    return (
      <div className="theme-selector">
        <label>选择样式主题:</label>
        <select value={theme} onChange={onThemeChange}>
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
          <option value="xiaohongshu">小红书</option>
        </select>
      </div>
    );
  };

  // 渲染转换界面
  const renderConversionInterface = () => {
    switch (conversionType) {
      case 'word-to-md':
        return (
          <>
            <h3>Word 转 Markdown</h3>
            <p>将Word文档转换为简洁的Markdown格式，保留原始排版结构</p>
            {renderFileUploadSection('.doc,.docx')}
          </>
        );

      case 'md-to-html':
        return (
          <>
            <h3>Markdown 转 HTML</h3>
            <p>将Markdown文本转换为精美的HTML页面，支持多种样式主题</p>
            {renderThemeSelector()}
            {renderMarkdownSection()}
          </>
        );

      case 'web-to-docx':
        return (
          <>
            <h3>网页转 Word</h3>
            <p>将网页内容转换为Word文档，支持普通网页和微信公众号文章</p>
            {renderUrlInputSection()}
          </>
        );

      case 'pdf-to-word':
        return (
          <>
            <h3>PDF 转 Word</h3>
            <p>将PDF文档转换为Word文档，保留原始排版结构</p>
            {renderFileUploadSection('.pdf')}
          </>
        );

      case 'word-to-pdf':
        return (
          <>
            <h3>Word 转 PDF</h3>
            <p>将Word文档转换为PDF文档，保留原始排版结构</p>
            {renderFileUploadSection('.doc,.docx')}
          </>
        );

      default:
        return <div>请选择转换类型</div>;
    }
  };

  return (
    <div className="conversion-card" style={{ position: 'relative' }}>
      <button className="back-home-btn" onClick={onGoHome} style={{ top: '2rem', left: '2rem' }}>
        🏠 返回首页
      </button>
      {renderConversionInterface()}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="action-buttons">
        <button 
          className="convert-btn" 
          onClick={onConvert}
          disabled={isConverting}
        >
          {isConverting ? '⏳ 转换中...' : '🔥 开始转换'}
        </button>
        <button 
          className="reset-btn" 
          onClick={onReset}
          disabled={isConverting}
        >
          🔄 重置
        </button>
      </div>
    </div>
  );
};

export default ConversionCard;