import React from 'react';

const HomePage = () => {
  // 转换类型选项，与原App.jsx中的conversionOptions保持一致
  const conversionOptions = [
    { value: 'word-to-md', label: 'Word 转 Markdown', icon: '📄', description: '将Word文档转换为简洁的Markdown格式，保留原始排版结构' },
    { value: 'md-to-html', label: 'Markdown 编辑器', icon: '📝', description: '功能强大的Markdown编辑器，支持实时预览、样式定制和多格式导出' },
    { value: 'web-to-docx', label: '网页转 Word', icon: '🌐', description: '将网页内容转换为Word文档，支持普通网页和微信公众号文章' },
    { value: 'pdf-to-word', label: 'PDF 转 Word', icon: '📄', description: '将PDF文档转换为Word文档，保留原始排版结构' },
    { value: 'word-to-pdf', label: 'Word 转 PDF', icon: '📄', description: '将Word文档转换为PDF文档，保留原始排版结构' },
  ];

  // 功能特性数据
  const features = [
    { icon: '⚡', title: '快速转换', description: '高效的转换算法，快速完成文档格式转换' },
    { icon: '🎨', title: '样式定制', description: '多种HTML样式主题，满足不同需求' },
    { icon: '🔒', title: '安全可靠', description: '本地转换，保护您的文档隐私安全' },
    { icon: '👁️', title: '实时预览', description: '支持Markdown和HTML文件在线预览，方便查看转换结果' },
    { icon: '📱', title: '响应式设计', description: '适配各种设备，随时随地进行文档转换' },
  ];

  // 处理转换选项点击
  const handleConversionClick = (conversionType) => {
    // 特殊处理Markdown编辑器
    if (conversionType === 'md-to-html') {
      window.location.pathname = '/markdown-editor';
      return;
    }
    // 使用普通路由跳转
    window.location.pathname = `/convert/${conversionType}`;
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>统一文档转换工具</h1>
        <p className="app-subtitle">高效、便捷的文档格式转换解决方案</p>
      </header>
      
      <main className="home-main">
        <div className="conversion-grid">
          {conversionOptions.map((option) => (
            <div 
              key={option.value} 
              className="conversion-card"
              onClick={() => handleConversionClick(option.value)}
            >
              <div className="conversion-icon">{option.icon}</div>
              <h3 className="conversion-title">{option.label}</h3>
              <p className="conversion-description">{option.description}</p>
            </div>
          ))}
        </div>

        {/* 功能特性部分 */}
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
        <p>统一文档转换工具 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default HomePage;
