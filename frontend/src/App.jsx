import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import ConversionPage from './ConversionPage.jsx';
import MarkdownEditorPage from './MarkdownEditorPage.jsx';
import MediaCrawlerPage from './MediaCrawlerPage.jsx';
import MdProjectPage from './MdProjectPage.jsx';
import WordToMarkdownPage from './WordToMarkdownPage.jsx';
import WebToWordPage from './WebToWordPage.jsx';
import PdfToWordPage from './PdfToWordPage.jsx';
import WordToPdfPage from './WordToPdfPage.jsx';
import BookmarkPage from './BookmarkPage.jsx';
import BookmarkAdminPage from './BookmarkAdminPage.jsx';
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
          {/* 外部MD项目路由 */}
          <Route path="/external-md" element={<MdProjectPage />} />
          {/* 独立转换页面路由 */}
          <Route path="/word-to-md" element={<WordToMarkdownPage />} />
          <Route path="/web-to-docx" element={<WebToWordPage />} />
          <Route path="/pdf-to-word" element={<PdfToWordPage />} />
          <Route path="/word-to-pdf" element={<WordToPdfPage />} />
          {/* 网址收藏管理路由 */}
          <Route path="/bookmarks" element={<BookmarkPage />} />
          {/* 书签管理后台路由 */}
          <Route path="/bookmark-admin" element={<BookmarkAdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;