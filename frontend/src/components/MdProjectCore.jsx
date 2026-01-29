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

const MdProjectCore = ({ 
  markdownText = '', 
  theme = 'default', 
  font = 'sans-serif', 
  fontSize = 'recommended', 
  themeColor = '#1e40af', 
  showLineNumbers = true,
  macCodeBlock = true,
  codeLineNumbers = false,
  wechatLinkReference = false,
  paragraphIndent = false,
  paragraphJustify = false
}) => {
  const [html, setHtml] = useState('');
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
      return;
    }

    try {
      // 转换Markdown为HTML
      let htmlContent = marked(markdownText);

      // 主题映射
      const themeMap = {
        'classic': 'doocs_classic',
        'elegant': 'doocs_elegant',
        'clean': 'clean'
      };
      const mappedTheme = themeMap[theme] || theme;

      // 应用主题样式
      const themeStyles = THEMES[mappedTheme] || THEMES.default;
      htmlContent = applyThemeStyles(htmlContent, themeStyles);

      // 应用字体样式
      htmlContent = applyFontStyles(htmlContent, font);

      // 应用字号样式
      htmlContent = applyFontSizeStyles(htmlContent, fontSize);

      // 应用主题色样式
      htmlContent = applyThemeColorStyles(htmlContent, themeColor);

      // 应用额外的样式设置
      if (paragraphIndent) {
        htmlContent = `<div style="text-indent: 2em;">${htmlContent}</div>`;
      }
      
      if (paragraphJustify) {
        htmlContent = `<div style="text-align: justify;">${htmlContent}</div>`;
      }

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
    // 为markdown内容添加主题样式
    if (themeStyles && themeStyles.css) {
      // 生成内联样式
      let baseStyles = '';
      if (themeStyles.css.base) {
        baseStyles = Object.entries(themeStyles.css.base)
          .map(([property, value]) => `${property}: ${value};`)
          .join(' ');
      }
      
      // 生成样式标签
      let styleTag = '';
      if (themeStyles.css.block) {
        let blockStyles = '';
        Object.entries(themeStyles.css.block).forEach(([selector, styles]) => {
          if (styles) {
            const blockStyle = Object.entries(styles)
              .map(([property, value]) => {
                // 替换硬编码的主题色为CSS变量
                if (property === 'border-bottom' || property === 'border-left' || property === 'color') {
                  // 检查是否是主题色相关的属性
                  return `${property}: var(--theme-color, ${value});`;
                }
                return `${property}: ${value};`;
              })
              .join(' ');
            blockStyles += `.markdown-content ${selector} { ${blockStyle} }\n`;
          }
        });
        
        // 添加Mac代码块样式
        if (macCodeBlock) {
          blockStyles += `.markdown-content pre { border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }\n`;
        }
        
        // 添加代码块行号样式
        if (codeLineNumbers) {
          blockStyles += `.markdown-content pre code { counter-reset: line; }\n`;
          blockStyles += `.markdown-content pre code span.line { counter-increment: line; }\n`;
          blockStyles += `.markdown-content pre code span.line::before { content: counter(line); display: inline-block; width: 2em; padding-right: 1em; text-align: right; color: #666; border-right: 1px solid #ddd; margin-right: 1em; }\n`;
        }
        
        if (blockStyles) {
          styleTag = `<style>${blockStyles}</style>`;
        }
      }
      
      return `${styleTag}<div style="${baseStyles}">${html}</div>`;
    }
    return html;
  };

  // 应用字体样式
  const applyFontStyles = (html, font) => {
    // 为markdown内容添加字体样式
    return `<div style="font-family: ${font};">${html}</div>`;
  };

  // 应用字号样式
  const applyFontSizeStyles = (html, fontSize) => {
    // 根据字号设置添加对应的样式
    let fontSizeValue = '';
    switch (fontSize) {
      case 'smaller':
        fontSizeValue = '12px';
        break;
      case 'small':
        fontSizeValue = '14px';
        break;
      case 'recommended':
        fontSizeValue = '16px';
        break;
      case 'large':
        fontSizeValue = '18px';
        break;
      case 'larger':
        fontSizeValue = '20px';
        break;
      default:
        fontSizeValue = '16px';
    }
    return `<div style="font-size: ${fontSizeValue};">${html}</div>`;
  };

  // 应用主题色样式
  const applyThemeColorStyles = (html, themeColor) => {
    // 为markdown内容添加主题色样式
    return `<div style="--theme-color: ${themeColor};">
      <style>
        /* 确保标题样式优先于主题样式 */
        .md-project-core .markdown-content h1 {
          font-size: 24px !important;
          font-weight: bold !important;
          margin: 48px auto 24px !important;
          text-align: center !important;
          color: #ffffff !important;
          background-color: var(--theme-color) !important;
          padding: 10px 30px !important;
          border-radius: 20px !important;
          line-height: 1.3 !important;
          display: inline-block !important;
          float: none !important;
          clear: both !important;
        }
        
        .md-project-core .markdown-content h1::before {
          content: "" !important;
          display: block !important;
          width: 100% !important;
          height: 0 !important;
        }
        
        .md-project-core .markdown-content h1::after {
          content: "" !important;
          display: block !important;
          width: 100% !important;
          height: 0 !important;
        }
        
        .md-project-core .markdown-content h2 {
          font-size: 22px !important;
          font-weight: bold !important;
          margin: 36px 0 18px 0 !important;
          text-align: center !important;
          color: #ffffff !important;
          background-color: var(--theme-color) !important;
          padding: 8px 24px !important;
          border-radius: 16px !important;
          line-height: 1.3 !important;
          display: block !important;
          width: fit-content !important;
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
          clear: both !important;
        }
        
        .md-project-core .markdown-content h3 {
          font-size: 20px !important;
          font-weight: bold !important;
          margin: 32px 0 16px 0 !important;
          text-align: left !important;
          color: #000000 !important;
          background-color: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          line-height: 1.4 !important;
          display: block !important;
          width: 100% !important;
          border-bottom: 1px solid #f0f0f0 !important;
          padding-bottom: 6px !important;
          float: none !important;
          clear: both !important;
        }
        
        .md-project-core .markdown-content h4, 
        .md-project-core .markdown-content h5, 
        .md-project-core .markdown-content h6 {
          color: #ffffff !important;
          background-color: var(--theme-color) !important;
          padding: 6px 16px !important;
          border-radius: 12px !important;
          margin: 20px auto 10px !important;
          text-align: center !important;
          display: block !important;
          width: fit-content !important;
          float: none !important;
          clear: both !important;
        }
      </style>
      ${html}
    </div>`;
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

  // 当Markdown文本或样式相关属性变化时重新渲染
  useEffect(() => {
    renderMarkdown();
  }, [markdownText, theme, font, fontSize, themeColor, macCodeBlock, codeLineNumbers, wechatLinkReference, paragraphIndent, paragraphJustify]);

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
      <div 
        ref={containerRef}
        className={`markdown-content theme-${theme}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MdProjectCore;