import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import ConversionPage from './ConversionPage.jsx';
import MarkdownEditorPage from './MarkdownEditorPage.jsx';
import MediaCrawlerPage from './MediaCrawlerPage.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 首页路由 */}
          <Route path="/" element={<HomePage />} />
          {/* 转换页面路由 */}
          <Route path="/convert/:conversionType" element={<ConversionPage />} />
          {/* Markdown编辑器路由 */}
          <Route path="/markdown-editor" element={<MarkdownEditorPage />} />
          {/* 媒体内容采集路由 */}
          <Route path="/media-crawler" element={<MediaCrawlerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;