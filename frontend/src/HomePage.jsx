import React from 'react';
import './App.css';

const HomePage = () => {
  // 转换类型选项，与原App.jsx中的conversionOptions保持一致
  const conversionOptions = [
    { value: 'word-to-md', label: 'Word 转 Markdown', icon: '📄', description: '将Word文档转换为简洁的Markdown格式，保留原始排版结构' },
    { value: 'md-to-html', label: 'Markdown 编辑器', icon: '📝', description: '功能强大的Markdown编辑器，支持实时预览、样式定制和多格式导出' },
    { value: 'web-to-docx', label: '网页转 Word', icon: '🌐', description: '将网页内容转换为Word文档，支持普通网页和微信公众号文章' },
    { value: 'pdf-to-word', label: 'PDF 转 Word', icon: '📄', description: '将PDF文档转换为Word文档，保留原始排版结构' },
    { value: 'word-to-pdf', label: 'Word 转 PDF', icon: '📄', description: '将Word文档转换为PDF文档，保留原始排版结构' },
    { value: 'media-crawler', label: '媒体内容采集', icon: '🐛', description: '支持小红书、抖音、快手等多平台内容抓取，可直接转换为Markdown或Word' },
    { value: 'external-md', label: 'md 项目', icon: '🔗', description: 'https://github.com/aqiyoung/md - 原样克隆实现' }
  ];

  // 平台核心功能特性数据
  const platformFeatures = [
    { 
      icon: '⚡', 
      title: '高效数据处理', 
      description: '采用先进的转换算法，快速完成各种文档格式转换，处理速度提升300%', 
      color: '#4CAF50' 
    },
    { 
      icon: '🎨', 
      title: '样式定制', 
      description: '提供多种HTML样式主题，支持自定义样式，满足不同场景的文档需求', 
      color: '#2196F3' 
    },
    { 
      icon: '🔒', 
      title: '安全可靠', 
      description: '本地转换模式，保护您的文档隐私安全，数据永不泄露', 
      color: '#FF9800' 
    },
    { 
      icon: '👁️', 
      title: '实时预览', 
      description: '支持Markdown和HTML文件在线预览，随时查看转换效果，所见即所得', 
      color: '#9C27B0' 
    },
    { 
      icon: '📱', 
      title: '响应式设计', 
      description: '适配各种设备，无论是电脑、平板还是手机，都能流畅使用', 
      color: '#F44336' 
    },
    { 
      icon: '🐛', 
      title: '媒体内容采集', 
      description: '支持小红书、抖音、快手等多平台内容采集，直接转换为Markdown或Word', 
      color: '#00BCD4' 
    },
    { 
      icon: '📄', 
      title: '多格式支持', 
      description: '支持Word、PDF、Markdown、HTML等多种格式的相互转换', 
      color: '#795548' 
    },
    { 
      icon: '🌐', 
      title: '网页内容转换', 
      description: '支持普通网页和微信公众号文章转换为Word文档，保留原始排版', 
      color: '#673AB7' 
    },
    { 
      icon: '🔄', 
      title: '批量处理', 
      description: '支持批量上传和转换文件，提高工作效率，节省时间', 
      color: '#3F51B5' 
    }
  ];

  // 处理转换选项点击
  const handleConversionClick = (conversionType) => {
    // 特殊处理外部Markdown项目（md项目）
    if (conversionType === 'external-md') {
      window.location.pathname = '/external-md';
      return;
    }
    // 特殊处理Markdown编辑器
    if (conversionType === 'md-to-html') {
      window.location.pathname = '/markdown-editor';
      return;
    }
    // 特殊处理媒体内容采集
    if (conversionType === 'media-crawler') {
      window.location.pathname = '/media-crawler';
      return;
    }
    // 使用普通路由跳转
    window.location.pathname = `/convert/${conversionType}`;
  };

  return (
    <div className="home-container platform-home">
      <header className="app-header platform-header">
        <h1>智能数据处理平台</h1>
        <p className="app-subtitle">高效、精准、智能的数据处理与转换解决方案</p>
      </header>
      
      <main className="home-main">
        {/* 转换功能选项卡片 */}
        <section className="conversion-section">
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
        </section>

        {/* 平台核心功能特性展示 */}
        <section className="features-section platform-features">
          <h2 className="features-title">核心功能特性</h2>
          <div className="features-grid">
            {platformFeatures.map((feature, index) => {
              // 将十六进制颜色转换为RGB
              const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
                } : null;
              };
              
              const rgb = hexToRgb(feature.color);
              const rgbStr = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '76, 175, 80';
              
              return (
                <div 
                  key={index} 
                  className="feature-card" 
                  style={{
                    '--card-color': feature.color,
                    '--card-color-rgb': rgbStr,
                    color: feature.color
                  }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 平台优势总结 */}
        <section className="platform-advantages">
          <h2>为什么选择我们？</h2>
          <div className="advantages-grid">
            <div className="advantage-item">
              <div className="advantage-icon">🏆</div>
              <h3>专业可靠</h3>
              <p>专注于文档转换领域，技术成熟，服务稳定</p>
            </div>
            <div className="advantage-item">
              <div className="advantage-icon">⚡</div>
              <h3>高效便捷</h3>
              <p>操作简单，转换速度快，节省您的宝贵时间</p>
            </div>
            <div className="advantage-item">
              <div className="advantage-icon">🔒</div>
              <h3>安全保障</h3>
              <p>本地转换模式，数据隐私有保障</p>
            </div>
            <div className="advantage-item">
              <div className="advantage-icon">📈</div>
              <h3>持续更新</h3>
              <p>不断优化功能，添加新特性，提升用户体验</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer platform-footer">
        <p>智能数据处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default HomePage;
