// ===========================================================================
// ========================= md 项目核心渲染组件 ===========================
// ===========================================================================
// 说明：基于GitHub项目 https://github.com/aqiyoung/md 核心功能实现
// 核心功能：Markdown渲染引擎，支持多种扩展和主题
// ===========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 默认代码高亮样式

// 导入主题配置
import { THEMES } from '../utils/mdThemes';

// 初始化marked配置
marked.setOptions({
  breaks: true,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // 使用默认的转义
  }
});

// 注册扩展
import { markedAlert, markedFootnotes, markedMarkup, markedPlantUML, markedRuby, markedSlider, markedToc } from '../utils/mdExtensions';

marked.use(markedSlider());
marked.use(markedAlert());
marked.use(markedFootnotes());
marked.use(markedMarkup());
marked.use(markedPlantUML());
marked.use(markedRuby());
marked.use(markedToc());

// 引入katex支持
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MdProjectCore = ({ markdownText = '', theme = 'default', showLineNumbers = true }) => {
  const [html, setHtml] = useState('');
  const [readingTime, setReadingTime] = useState(null);
  const containerRef = useRef(null);

  // 计算阅读时间
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return {
      words,
      minutes
    };
  };

  // 渲染Markdown
  const renderMarkdown = () => {
    if (!markdownText.trim()) {
      setHtml('');
      setReadingTime(null);
      return;
    }

    try {
      // 计算阅读时间
      const readingTimeResult = calculateReadingTime(markdownText);
      setReadingTime(readingTimeResult);

      // 转换Markdown为HTML
      let htmlContent = marked(markdownText);

      // 应用主题样式
      const themeStyles = THEMES[theme] || THEMES.default;
      htmlContent = applyThemeStyles(htmlContent, themeStyles);

      // 渲染数学公式
      htmlContent = renderMathFormulas(htmlContent);

      setHtml(htmlContent);
    } catch (error) {
      console.error('Markdown渲染错误:', error);
      setHtml(`<div style="color: red; padding: 20px; background-color: #ffebee;">
        <h3>渲染错误</h3>
        <p>${error.message}</p>
      </div>`);
    }
  };

  // 应用主题样式
  const applyThemeStyles = (html, themeStyles) => {
    // 这里可以根据主题样式动态修改HTML内容
    // 例如添加特定的CSS类或内联样式
    return html;
  };

  // 渲染数学公式
  const renderMathFormulas = (html) => {
    // 使用katex渲染数学公式
    // 查找所有的数学公式并渲染
    return html.replace(/\$\$(.*?)\$\$/gms, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: true
        });
      } catch (error) {
        return match;
      }
    }).replace(/\$(.*?)\$/gms, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: false
        });
      } catch (error) {
        return match;
      }
    });
  };

  // 当Markdown文本或主题变化时重新渲染
  useEffect(() => {
    renderMarkdown();
  }, [markdownText, theme]);

  // 处理代码块的动态加载
  useEffect(() => {
    if (containerRef.current) {
      // 处理mermaid图表等动态内容
      const mermaidElements = containerRef.current.querySelectorAll('.mermaid');
      if (mermaidElements.length > 0 && window.mermaid) {
        window.mermaid.run();
      }

      // 处理PlantUML图表
      const plantumlElements = containerRef.current.querySelectorAll('.plantuml');
      if (plantumlElements.length > 0) {
        // 这里可以添加PlantUML渲染逻辑
      }
    }
  }, [html]);

  return (
    <div className="md-project-core">
      {readingTime && (
        <div className="reading-time">
          <p>字数: {readingTime.words}，阅读大约需 {readingTime.minutes} 分钟</p>
        </div>
      )}
      <div 
        ref={containerRef}
        className={`markdown-content theme-${theme}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MdProjectCore;