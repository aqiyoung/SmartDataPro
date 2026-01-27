import React, { useState } from 'react';
import './App.css';

const WordToPdfPage = () => {
  // 状态管理
  const [file, setFile] = useState(null);
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

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      resetState();
    }
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
      formData.append('conversion_type', 'word-to-pdf');

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

  return (
    <div className="app-container">
      <main className="app-main" style={{ position: 'relative', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <button className="back-home-btn" onClick={goToHomePage} style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
          🏠 返回首页
        </button>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', width: '100%' }}>
          {/* 页面标题和描述 */}
          <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.6s ease-out' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem', animation: 'slideUp 0.5s ease-out' }}>Word 转 PDF</h3>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5', animation: 'slideUp 0.5s ease-out 0.1s both' }}>将Word文档转换为PDF文档，保留原始排版结构</p>
          </div>
          
          {/* 错误和成功消息 */}
          {error && <div className="error-message" style={{ animation: 'fadeIn 0.3s ease-out' }}>{error}</div>}
          {success && <div className="success-message" style={{ animation: 'fadeIn 0.3s ease-out' }}>{success}</div>}
          
          {/* 转换表单 */}
          <form className="conversion-form" onSubmit={handleConvert} style={{ animation: 'fadeIn 0.6s ease-out 0.2s both' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', padding: '3rem', transition: 'all 0.3s ease' }}>
              {/* 文件上传区域 */}
              <div style={{ marginBottom: '2.5rem' }}>
                <button 
                  type="button" 
                  style={{
                    display: 'inline-block',
                    padding: '1.2rem 3rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  📁 选择文件
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    required
                    accept=".docx,.doc"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                </button>
                {file && (
                  <p style={{
                    marginTop: '1rem',
                    color: '#666',
                    fontSize: '1rem',
                    fontWeight: '500',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>已选择文件: {file.name}</p>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="submit" 
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '160px',
                    backgroundColor: isLoading || !file ? '#a5b4fc' : '#667eea',
                    color: 'white',
                    boxShadow: isLoading || !file ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.3)',
                    opacity: isLoading || !file ? 0.7 : 1
                  }}
                  disabled={isLoading || !file}
                  onMouseEnter={(e) => {
                    if (!isLoading && file) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && file) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      转换中...
                    </div>
                  ) : '🚀 开始转换'}
                </button>
                <button 
                  type="button" 
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    border: '2px solid #e0e7ff',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '160px',
                    backgroundColor: '#f8fafc',
                    color: '#667eea',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onClick={handleReset}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.borderColor = '#667eea';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.borderColor = '#e0e7ff';
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                >
                  🔄 重置
                </button>
              </div>
            </div>
          </form>
          
          {/* 转换结果展示 */}
          {result && (
            <div className="result-section" style={{ marginTop: '3rem', animation: 'fadeIn 0.6s ease-out' }}>
              <div style={{ backgroundColor: '#f0f4ff', borderRadius: '24px', padding: '2.5rem', border: '2px solid #e0e7ff' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#667eea', marginBottom: '1.5rem' }}>转换结果</h3>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '2px solid #e0e0e0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <div>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#667eea', fontWeight: '600' }}>转换类型:</p>
                      <p style={{ margin: 0, color: '#333' }}>{result.conversion_type}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#667eea', fontWeight: '600' }}>文件名称:</p>
                      <p style={{ margin: 0, color: '#333' }}>{result.original_file_name}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#667eea', fontWeight: '600' }}>转换状态:</p>
                      <p style={{ margin: 0, color: '#333' }}>{result.status}</p>
                    </div>
                  </div>
                  
                  {result.download_url && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #e0e7ff' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#667eea', marginBottom: '1.2rem' }}>下载链接</h4>
                      <a 
                        href={result.download_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '1rem 2.5rem',
                          backgroundColor: '#667eea',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '20px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        📥 下载转换后的文件
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="app-footer platform-footer">
        <p>智能数据处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>
    </div>
  );
};

export default WordToPdfPage;