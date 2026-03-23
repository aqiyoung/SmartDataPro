import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const HomePage = () => {
  const navigate = useNavigate();

  // 功能分类
  const categories = [
    {
      title: '📄 文档转换',
      description: '多种格式之间自由转换',
      items: [
        { path: '/word-to-md', icon: '📄', label: 'Word → Markdown', desc: '保留排版结构的格式转换' },
        { path: '/web-to-docx', icon: '🌐', label: '网页 → Word', desc: '网页和公众号文章转文档' },
        { path: '/pdf-to-word', icon: '📑', label: 'PDF → Word', desc: 'PDF文档可编辑化' },
        { path: '/word-to-pdf', icon: '📋', label: 'Word → PDF', desc: '文档转为PDF格式' },
      ]
    },
    {
      title: '✏️ 内容编辑',
      description: '强大的编辑工具',
      items: [
        { path: '/markdown-editor', icon: '✏️', label: 'Markdown 编辑器', desc: '实时预览、多格式导出' },
        { path: '/external-md', icon: '🌟', label: '微信公众号专用', desc: '专为公众号排版设计' },
      ]
    },
    {
      title: '🛠️ 实用工具',
      description: '更多便捷功能',
      items: [
        { path: '/media-crawler', icon: '🐛', label: '媒体内容采集', desc: '小红书、抖音、B站等平台抓取' },
        { path: '/bookmarks', icon: '🔖', label: '网址收藏管理', desc: '管理和收藏常用网址' },
      ]
    }
  ];

  return (
    <div className="landing-page">
      {/* 顶部导航 */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <img src="/logo.svg" alt="SmartDataPro" className="landing-logo-img" />
            <span className="landing-logo-text">SmartDataPro</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">功能</a>
            <a href="#about">关于</a>
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            智能数据<span className="highlight">处理平台</span>
          </h1>
          <p className="landing-hero-subtitle">
            基于 FastAPI 和 React 构建，支持文档、网页、视频等多种格式之间的转换与处理
          </p>
          <div className="landing-hero-badges">
            <span className="badge">📄 文档转换</span>
            <span className="badge">🌐 网页处理</span>
            <span className="badge">🐛 内容采集</span>
            <span className="badge">✏️ Markdown 编辑</span>
          </div>
          <button 
            className="landing-cta-btn"
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            开始使用 ↓
          </button>
        </div>
      </section>

      {/* 功能区域 */}
      <section className="landing-features" id="features">
        {categories.map((cat, ci) => (
          <div key={ci} className="landing-category">
            <div className="landing-category-header">
              <h2>{cat.title}</h2>
              <p>{cat.description}</p>
            </div>
            <div className="landing-card-grid">
              {cat.items.map((item, ii) => (
                <div 
                  key={ii} 
                  className="landing-card"
                  onClick={() => navigate(item.path)}
                >
                  <div className="landing-card-icon">{item.icon}</div>
                  <h3 className="landing-card-title">{item.label}</h3>
                  <p className="landing-card-desc">{item.desc}</p>
                  <div className="landing-card-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 关于区域 */}
      <section className="landing-about" id="about">
        <div className="landing-about-inner">
          <h2>为什么选择 SmartDataPro？</h2>
          <div className="landing-about-grid">
            <div className="landing-about-item">
              <div className="landing-about-icon">⚡</div>
              <h3>高效处理</h3>
              <p>先进的转换算法，快速完成各种格式转换</p>
            </div>
            <div className="landing-about-item">
              <div className="landing-about-icon">🔒</div>
              <h3>本地处理</h3>
              <p>数据本地处理，保护隐私安全</p>
            </div>
            <div className="landing-about-item">
              <div className="landing-about-icon">📱</div>
              <h3>响应式设计</h3>
              <p>适配各种设备，随时随地使用</p>
            </div>
            <div className="landing-about-item">
              <div className="landing-about-icon">🎨</div>
              <h3>样式丰富</h3>
              <p>多种主题样式，满足不同需求</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="landing-footer">
        <p>SmartDataPro © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default HomePage;
