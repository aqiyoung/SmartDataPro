import React, { useEffect, useState } from 'react';
import HomePage from './HomePage.jsx';
import ConversionPage from './ConversionPage.jsx';
import './App.css';

const App = () => {
  const [conversionType, setConversionType] = useState(null);

  // 监听URL变化，更新转换类型
  useEffect(() => {
    const handleUrlChange = () => {
      // 检查普通路由（优先处理）
      const pathMatch = window.location.pathname.match(/^\/convert\/(\w+[-\w]*)$/);
      if (pathMatch) {
        setConversionType(pathMatch[1]);
        return;
      }
      
      // 不是转换页面，渲染首页
      setConversionType(null);
    };

    // 初始调用一次，处理当前URL
    handleUrlChange();

    // 监听popstate事件处理路由变化
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // 渲染当前页面
  const renderCurrentPage = () => {
    // 如果是转换页面，渲染ConversionPage组件
    if (conversionType) {
      return <ConversionPage conversionType={conversionType} />;
    }
    // 否则渲染首页
    return <HomePage />;
  };

  return (
    <div className="app-container">
      {renderCurrentPage()}
    </div>
  );
};

export default App;