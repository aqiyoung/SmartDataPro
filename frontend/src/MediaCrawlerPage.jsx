import React, { useState } from 'react';
import './App.css';

const MediaCrawlerPage = () => {
  // 状态管理
  const [platform, setPlatform] = useState('xiaohongshu');
  const [crawlType, setCrawlType] = useState('url');
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [postId, setPostId] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 返回首页的函数
  const goToHomePage = () => {
    window.location.pathname = '/';
  };

  // 支持的平台列表
  const platforms = [
    { name: 'xiaohongshu', displayName: '小红书' },
    { name: 'douyin', displayName: '抖音' },
    { name: 'kuaishou', displayName: '快手' },
    { name: 'bilibili', displayName: 'B站' },
    { name: 'weibo', displayName: '微博' },
    { name: 'tieba', displayName: '贴吧' },
    { name: 'zhihu', displayName: '知乎' }
  ];

  // 采集类型
  const crawlTypes = [
    { value: 'url', label: '通过URL采集' },
    { value: 'keyword', label: '通过关键词采集' },
    { value: 'post_id', label: '通过帖子ID采集' }
  ];

  // 处理采集请求
  const handleCrawl = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('platform', platform);
      
      if (crawlType === 'url' && url) {
        formData.append('url', url);
      } else if (crawlType === 'keyword' && keyword) {
        formData.append('keyword', keyword);
      } else if (crawlType === 'post_id' && postId) {
        formData.append('post_id', postId);
      } else {
        throw new Error('请填写必要的采集参数');
      }

      const response = await fetch('/api/crawl/media', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`采集失败: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setSuccess('采集成功！');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setPlatform('xiaohongshu');
    setCrawlType('url');
    setUrl('');
    setKeyword('');
    setPostId('');
    setResult(null);
    setError('');
    setSuccess('');
  };

  // 渲染结果
  const renderResult = () => {
    if (!result) return null;

    const { data } = result;
    
    return (
      <div className="result-section">
        <h3>采集结果</h3>
        <div className="result-content">
          <p><strong>平台:</strong> {data.platform}</p>
          <p><strong>类型:</strong> {data.type}</p>
          
          {data.url && <p><strong>URL:</strong> {data.url}</p>}
          {data.keyword && <p><strong>关键词:</strong> {data.keyword}</p>}
          {data.post_id && <p><strong>帖子ID:</strong> {data.post_id}</p>}
          
          <div className="result-data">
            {data.type === 'url' && (
              <div>
                <h4>{data.data.title}</h4>
                <p><strong>作者:</strong> {data.data.author}</p>
                <p><strong>发布时间:</strong> {data.data.publish_time}</p>
                <p><strong>内容:</strong> {data.data.content}</p>
              </div>
            )}
            
            {data.type === 'keyword' && (
              <div>
                <h4>搜索结果 ({data.data.length}条)</h4>
                <ul>
                  {data.data.map((item, index) => (
                    <li key={index} className="search-result-item">
                      <h5>{item.title}</h5>
                      <p>{item.content}</p>
                      <p><strong>作者:</strong> {item.author}</p>
                      <p><strong>发布时间:</strong> {item.publish_time}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">查看原文</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.type === 'post_id' && (
              <div>
                <h4>{data.data.title}</h4>
                <p><strong>作者:</strong> {data.data.author}</p>
                <p><strong>发布时间:</strong> {data.data.publish_time}</p>
                <p><strong>内容:</strong> {data.data.content}</p>
                
                {data.data.comments && data.data.comments.length > 0 && (
                  <div className="comments-section">
                    <h5>评论 ({data.data.comments.length}条)</h5>
                    <ul>
                      {data.data.comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                          <p><strong>{comment.author}:</strong> {comment.content}</p>
                          <p className="comment-time">{comment.publish_time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <main className="app-main">
        {/* 转换功能区域 - 主要内容 */}
        <div className="conversion-card" style={{ position: 'relative' }}>
          <button className="back-home-btn" onClick={goToHomePage} style={{ top: '2rem', left: '2rem' }}>
            🏠 返回首页
          </button>
          <h3>媒体内容采集</h3>
          <p>支持小红书、抖音、快手、B站、微博、贴吧、知乎等平台的内容抓取</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form className="crawl-form" onSubmit={handleCrawl}>
            <div className="theme-selector">
              <div className="form-group">
                <label htmlFor="platform">选择平台:</label>
                <select 
                  id="platform" 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  required
                >
                  {platforms.map(p => (
                    <option key={p.name} value={p.name}>{p.displayName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="crawlType">采集方式:</label>
                <select 
                  id="crawlType" 
                  value={crawlType} 
                  onChange={(e) => setCrawlType(e.target.value)}
                  required
                >
                  {crawlTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {crawlType === 'url' && (
              <div className="url-input-section">
                <input 
                  type="url" 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="请输入要采集的URL"
                  required
                />
              </div>
            )}
            
            {crawlType === 'keyword' && (
              <div className="file-upload-section">
                <input 
                  type="text" 
                  id="keyword" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="请输入搜索关键词"
                  required
                  style={{ 
                    padding: '0.9rem 1.5rem', 
                    fontSize: '1rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '16px', 
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    margin: '0 auto',
                    display: 'block',
                    width: '80%',
                    maxWidth: '600px'
                  }}
                />
              </div>
            )}
            
            {crawlType === 'post_id' && (
              <div className="file-upload-section">
                <input 
                  type="text" 
                  id="postId" 
                  value={postId} 
                  onChange={(e) => setPostId(e.target.value)}
                  placeholder="请输入帖子ID"
                  required
                  style={{ 
                    padding: '0.9rem 1.5rem', 
                    fontSize: '1rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '16px', 
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    margin: '0 auto',
                    display: 'block',
                    width: '80%',
                    maxWidth: '600px'
                  }}
                />
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                type="submit" 
                className="convert-btn"
                disabled={isLoading}
              >
                {isLoading ? '⏳ 采集中...' : '🔥 开始采集'}
              </button>
              <button 
                type="button" 
                className="reset-btn"
                onClick={resetForm}
                disabled={isLoading}
              >
                🔄 重置
              </button>
            </div>
          </form>
          
          {renderResult()}
        </div>
      </main>
      <footer className="app-footer platform-footer">
        <p>智能数据处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default MediaCrawlerPage;