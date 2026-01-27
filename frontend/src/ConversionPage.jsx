import React, { useState, useEffect } from 'react';
import './App.css';

const ConversionPage = () => {
  // 状态管理
  const [conversionType, setConversionType] = useState('word-to-md');
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('default');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [processedFileUrl, setProcessedFileUrl] = useState('');

  // 返回首页的函数
  const goToHomePage = () => {
    window.location.pathname = '/';
  };

  // 支持的转换类型
  const conversionTypes = [
    { value: 'word-to-md', label: 'Word 转 Markdown', description: '将Word文档转换为简洁的Markdown格式，保留原始排版结构' },
    { value: 'web-to-docx', label: '网页转 Word', description: '将网页内容转换为Word文档，支持普通网页和微信公众号文章' },
    { value: 'pdf-to-word', label: 'PDF 转 Word', description: '将PDF文档转换为Word文档，保留原始排版结构' },
    { value: 'word-to-pdf', label: 'Word 转 PDF', description: '将Word文档转换为PDF文档，保留原始排版结构' }
  ];

  // 支持的主题列表
  const themes = [
    { value: 'default', label: '默认主题' },
    { value: 'dark', label: '暗黑主题' },
    { value: 'light', label: '明亮主题' },
    { value: 'blue', label: '蓝色主题' },
    { value: 'green', label: '绿色主题' },
    { value: 'purple', label: '紫色主题' }
  ];

  // 处理转换类型变化
  const handleConversionTypeChange = (e) => {
    setConversionType(e.currentTarget.value);
    resetState();
  };

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      resetState();
    }
  };

  // 处理主题选择
  const handleThemeChange = (e) => {
    setTheme(e.currentTarget.value);
  };

  // 重置状态
  const resetState = () => {
    setFileContent('');
    setResult(null);
    setError('');
    setSuccess('');
    setProcessedFileUrl('');
  };

  // 处理转换请求
  const handleConvert = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setResult(null);
    setProcessedFileUrl('');

    try {
      if (!file) {
        throw new Error('请选择要转换的文件');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversion_type', conversionType);
      formData.append('theme', theme);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`转换失败: ${response.statusText}`);
        
      }

      const data = await response.json();
      setResult(data);
      setSuccess('转换成功！');
      
      // 如果有处理后的文件URL，设置它
      if (data.processed_file_url) {
        setProcessedFileUrl(data.processed_file_url);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFile(null);
    resetState();
  };

  // 渲染转换界面
  const renderConversionInterface = () => {
    return (
      <>
        <button className="back-home-btn" onClick={goToHomePage} style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
          🏠 返回首页
        </button>
        
        <h3>{conversionTypes.find(type => type.value === conversionType)?.label}</h3>
        <p>{conversionTypes.find(type => type.value === conversionType)?.description}</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="conversion-form" onSubmit={handleConvert}>
          {/* 转换类型选择器 */}
          <div className="conversion-selector">
            <div className="conversion-controls">
              {/* 返回首页按钮容器 */}
              <div className="back-home-btn"></div>
              
              {/* 转换类型容器 */}
              <div className="conversion-type-container">
                <label htmlFor="conversionType">转换类型:</label>
                <select 
                  id="conversionType" 
                  value={conversionType} 
                  onChange={handleConversionTypeChange}
                >
                  {conversionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {/* 主题选择器 */}
              <div className="theme-selector">
                <label htmlFor="theme">主题选择:</label>
                <select 
                  id="theme" 
                  value={theme} 
                  onChange={handleThemeChange}
                >
                  {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>{theme.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* 文件上传区域 */}
          <div className="file-upload-section">
            <button type="button" className="file-btn">
              📁 选择文件
              <input 
                type="file" 
                onChange={handleFileChange} 
                required
                accept={conversionType === 'web-to-docx' ? '.html' : '*'}
              />
            </button>
            {file && <p className="file-name">已选择文件: {file.name}</p>}
          </div>
          
          {/* 操作按钮 */}
          <div className="action-buttons">
            <button 
              type="submit" 
              className="convert-btn"
              disabled={isLoading || !file}
            >
              {isLoading ? '⏳ 转换中...' : '🚀 开始转换'}
            </button>
            <button 
              type="button" 
              className="reset-btn"
              onClick={handleReset}
              disabled={isLoading}
            >
              🔄 重置
            </button>
          </div>
        </form>
        
        {/* 转换结果展示 */}
        {result && (
          <div className="result-section">
            <h3>转换结果</h3>
            <div className="result-content">
              <p><strong>转换类型:</strong> {result.conversion_type}</p>
              <p><strong>主题:</strong> {result.theme}</p>
              <p><strong>文件名称:</strong> {result.original_file_name}</p>
              <p><strong>转换状态:</strong> {result.status}</p>
              
              {result.download_url && (
                <div className="result-data">
                  <h4>下载链接</h4>
                  <a 
                    href={result.download_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    📥 下载转换后的文件
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  // 渲染Markdown编辑器界面
  const renderMarkdownEditor = () => {
    // Markdown编辑器的实现
    // ... (保持原有的Markdown编辑器实现不变)
    return null;
  };

  return (
    <div className="app-container">
      <main className="app-main" style={{ position: 'relative', textAlign: 'center' }}>
        {/* 转换功能区域 - 主要内容 */}
        {renderConversionInterface()}
      </main>
      <footer className="app-footer platform-footer">
        <p>智能数据处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default ConversionPage;