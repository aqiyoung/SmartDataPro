import React, { useState, useEffect } from 'react';
import './App.css';

const BookmarkAdminPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
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

  // 处理添加或更新书签
  const handleSaveBookmark = async (e) => {
    e.preventDefault();
    if (!newBookmark.title || !newBookmark.url) return;

    setLoading(true);
    setError('');
    try {
      if (editMode) {
        // 更新现有书签
        const response = await fetch(`http://localhost:8017/api/v1/bookmarks/${currentEditId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newBookmark)
        });
        const data = await response.json();
        if (data.success) {
          setBookmarks(bookmarks.map(bookmark => 
            bookmark.id === currentEditId 
              ? data.data
              : bookmark
          ));
          setEditMode(false);
          setCurrentEditId(null);
        } else {
          setError('更新书签失败');
        }
      } else {
        // 添加新书签
        const response = await fetch('http://localhost:8017/api/v1/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newBookmark)
        });
        const data = await response.json();
        if (data.success) {
          setBookmarks([...bookmarks, data.data]);
        } else {
          setError('添加书签失败');
        }
      }

      // 重置表单
      setNewBookmark({ title: '', url: '', description: '' });
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑书签
  const handleEditBookmark = (bookmark) => {
    setNewBookmark(bookmark);
    setEditMode(true);
    setCurrentEditId(bookmark.id);
  };

  // 处理删除书签
  const handleDeleteBookmark = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8017/api/v1/bookmarks/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      } else {
        setError('删除书签失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentEditId(null);
    setNewBookmark({ title: '', url: '', description: '' });
  };

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
            className="view-bookmarks-btn"
            onClick={() => window.location.pathname = '/bookmarks'}
          >
            查看前端书签
          </button>
        </div>
      </header>

      <main className="bookmark-main">
        <h1 className="page-title">书签管理后台</h1>

        {/* 错误提示 */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* 添加/编辑书签表单 */}
        <section className="bookmark-form-section">
          <h2 className="section-title">{editMode ? '编辑书签' : '添加新书签'}</h2>
          <form onSubmit={handleSaveBookmark} className="bookmark-form">
            <div className="form-group">
              <label htmlFor="bookmark-title">标题</label>
              <input
                type="text"
                id="bookmark-title"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                placeholder="请输入网址标题"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bookmark-url">网址</label>
              <input
                type="url"
                id="bookmark-url"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                placeholder="请输入完整网址，如 https://example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bookmark-description">描述</label>
              <textarea
                id="bookmark-description"
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                placeholder="请输入网址描述（可选）"
                rows="3"
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              {editMode && (
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  取消
                </button>
              )}
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? '处理中...' : (editMode ? '更新' : '保存')}
              </button>
            </div>
          </form>
        </section>

        {/* 书签列表 */}
        <section className="bookmark-list-section">
          <h2 className="section-title">所有书签</h2>
          {loading && bookmarks.length === 0 ? (
            <div className="loading-state">
              <p>加载书签中...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="empty-state">
              <p>暂无书签，点击上方添加新书签</p>
            </div>
          ) : (
            <div className="bookmark-grid">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark-card">
                  <div className="bookmark-card-header">
                    <h3 className="bookmark-card-title">{bookmark.title}</h3>
                    <div className="bookmark-card-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditBookmark(bookmark)}
                        disabled={loading}
                      >
                        编辑
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        disabled={loading}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  <a 
                    href={bookmark.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bookmark-card-url"
                  >
                    {bookmark.url}
                  </a>
                  {bookmark.description && (
                    <p className="bookmark-card-description">{bookmark.description}</p>
                  )}
                  <p className="bookmark-card-date">
                    添加于: {new Date(bookmark.createdAt).toLocaleString()}
                  </p>
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

export default BookmarkAdminPage;