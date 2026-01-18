import React from 'react';
import HomePage from './HomePage.jsx';
import './App.css';

const App = () => {
  // 无论访问什么路径，都只显示首页
  return (
    <div className="app-container">
      <HomePage />
    </div>
  );
};

export default App;