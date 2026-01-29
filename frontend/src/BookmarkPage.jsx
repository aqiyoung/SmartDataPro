import React, { useState, useEffect } from 'react';
import './App.css';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 从后端API加载书签
  const loadBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8017/api/v1/bookmarks');
      const data = await response.json();
      if (data.success) {
        setBookmarks(data.data);
      } else {
        setError('加载书签失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化时加载书签
  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="bookmark-page">
      <header className="app-header">
        <div>
          <button 
            className="back-to-home-btn"
            onClick={() => window.location.pathname = '/'}
          >
            🏠 返回首页
          </button>
        </div>
        <div>
          <button 
            className="admin-btn"
            onClick={() => window.location.pathname = '/bookmark-admin'}
          >
            管理书签
          </button>
        </div>
      </header>

      <main className="bookmark-main">
        <h1 className="page-title">我的书签</h1>

        {/* 错误提示 */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* 书签列表 */}
        <section className="bookmark-list-section">
          {loading ? (
            <div className="loading-state">
              <p>加载书签中...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="empty-state">
              <p>暂无书签，请通过管理后台添加</p>
            </div>
          ) : (
            <div className="bookmark-links-container">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark-link-item">
                  <a 
                    href={bookmark.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bookmark-link"
                  >
                    {bookmark.title}
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>SmartDataPro © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default BookmarkPage;