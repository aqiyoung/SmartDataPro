// ===========================================================================
// ========================= 外部Markdown项目 - md ===========================
// ===========================================================================
// 说明：基于GitHub项目 https://github.com/aqiyoung/md 原样克隆实现
// 版本：v1.0.0
// 更新日期：2026-01-26
// ===========================================================================

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MdProject.css';
import MdProjectCore from './components/MdProjectCore';

// 导入 CodeMirror 用于编辑器语法高亮
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { githubDark } from '@uiw/codemirror-theme-github';
import { highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap, rectangularSelection, crosshairCursor, lineNumbers } from '@codemirror/view';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { historyKeymap } from '@codemirror/commands';

const MdProjectPage = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [theme, setTheme] = useState('default');
  const [isConverting, setIsConverting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [githubConfig, setGithubConfig] = useState({
    token: localStorage.getItem('github_token') || '',
    repo: localStorage.getItem('github_repo') || '',
    branch: localStorage.getItem('github_branch') || 'main',
    path: localStorage.getItem('github_path') || 'images'
  });
  const [uploading, setUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [currentFont, setCurrentFont] = useState('sans-serif');
  const [currentFontSize, setCurrentFontSize] = useState('smaller');
  const [currentThemeColor, setCurrentThemeColor] = useState('#1e40af');
  const [currentHeadingStyle, setCurrentHeadingStyle] = useState('h2');
  const [currentHeadingFormat, setCurrentHeadingFormat] = useState('default');
  const [currentCodeTheme, setCurrentCodeTheme] = useState('github-dark');
  const [currentCaptionFormat, setCurrentCaptionFormat] = useState('title-first');
  const [macCodeBlock, setMacCodeBlock] = useState(true);
  const [codeLineNumbers, setCodeLineNumbers] = useState(false);
  const [wechatLinkReference, setWechatLinkReference] = useState(false);
  const [paragraphIndent, setParagraphIndent] = useState(false);
  const [paragraphJustify, setParagraphJustify] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);

  // 默认示例文本 - md项目专属
  useEffect(() => {
    const defaultText = [
      '## Markdown 项目 (md)',
      '',
      '### 📁 项目介绍',
      '',
      '这是一个基于 GitHub 项目 `https://github.com/aqiyoung/md`  的原样克隆实现。',
      '',
      '### 🎯 核心功能',
      '',
      '- ✅ **完整 Markdown 支持** - 支持所有基础语法',
      '- ✅ **实时预览** - 编辑内容即时渲染',
      '- ✅ **多种主题** - 支持多种预览样式',
      '- ✅ **GitHub图床** - 支持图片上传到GitHub',
      '- ✅ **导出功能** - 支持导出 HTML 和 Word',
      '- ✅ **代码高亮** - 支持多种编程语言',
      '',
      '### 📝 快速开始',
      '',
      '1. 在左侧编辑区输入 Markdown 内容',
      '2. 右侧实时预览渲染效果',
      '3. 选择喜欢的主题样式',
      '4. 导出或复制结果',
      '',
      '### 💡 使用示例',
      '',
      '```markdown',
      '# 标题',
      '',
      '## 二级标题',
      '',
      '- 列表项 1',
      '- 列表项 2',
      '- 列表项 3',
      '',
      '```javascript',
      'console.log("Hello, Markdown!");',
      '```',
      '',
      '> 这是一段引用',
      '',
      '**粗体** 和 *斜体*',
      '```',
      '',
      '## 📄 项目结构',
      '',
      '```',
      'md/',
      '├── src/',
      '│   ├── components/',
      '│   ├── pages/',
      '│   └── utils/',
      '├── package.json',
      '└── README.md',
      '```',
      '',
      '## 🤝 贡献指南',
      '',
      '欢迎提交 Issue 和 Pull Request！',
      '',
      '## 📄 许可证',
      '',
      'MIT License',
    ].join('\n');
    
    setMarkdownText(defaultText);
  }, []);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setMarkdownText(text);
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
  };

  // GitHub图床配置处理
  const handleGithubConfigChange = (e) => {
    const { name, value } = e.target;
    const newConfig = { ...githubConfig, [name]: value };
    setGithubConfig(newConfig);
    // 保存到本地存储
    localStorage.setItem(`github_${name}`, value);
  };

  // 上传图片到GitHub
  const uploadToGithub = async (file) => {
    if (!githubConfig.token || !githubConfig.repo) {
      console.warn('请先配置GitHub图床信息');
      setShowImageModal(true);
      return null;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          const base64Content = reader.result.split(',')[1];
          // 生成唯一文件名
          const ext = file.name.split('.').pop();
          const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}.${ext}`;
          const path = githubConfig.path ? `${githubConfig.path}/${filename}` : filename;
          
          const url = `https://api.github.com/repos/${githubConfig.repo}/contents/${path}`;
          
          try {
            await axios.put(url, {
              message: `Upload image ${filename} via md project`,
              content: base64Content,
              branch: githubConfig.branch
            }, {
              headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'md-project'
              },
              timeout: 10000
            });
            
            // 使用 jsDelivr CDN 加速
            const cdnUrl = `https://cdn.jsdelivr.net/gh/${githubConfig.repo}@${githubConfig.branch}/${path}`;
            resolve(cdnUrl);
          } catch (err) {
            console.error('GitHub API Error:', err);
            reject(err);
          }
        };
        reader.onerror = error => reject(error);
      });
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // 处理图片上传
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      console.warn('请选择图片文件');
      return;
    }

    // 检查文件大小（限制为10MB）
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.warn('图片大小不能超过10MB');
      return;
    }

    try {
      const url = await uploadToGithub(file);
      if (url) {
        insertSyntax(`![${file.name}](${url})`);
      }
    } catch (err) {
      console.error('图片上传失败:', err);
      console.warn('图片上传失败，请检查网络或GitHub配置');
    } finally {
      // 清空input，允许重复上传同一文件
      e.target.value = null;
    }
  };

  // 监听粘贴事件
  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          
          try {
            // 检查文件大小
            const MAX_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
              console.warn('图片大小不能超过10MB');
              return;
            }
            
            const url = await uploadToGithub(file);
            if (url) {
              insertSyntax(`![image](${url})`);
            }
          } catch (err) {
            console.error('粘贴图片失败:', err);
            console.warn('粘贴图片失败，请检查网络或GitHub配置');
          }
          break;
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('paste', handlePaste);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('paste', handlePaste);
      }
    };
  }, [githubConfig]);

  // 插入语法
  const insertSyntax = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setMarkdownText(newText);
    
    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setMarkdownText(text);
    };
    reader.readAsText(file);
    // 清空input值，允许重复上传同一文件
    e.target.value = null;
  };

  // 保存为Word
  const handleSaveAsWord = async () => {
    if (!markdownText.trim()) {
      console.warn('请输入Markdown内容');
      return;
    }
    
    setIsConverting(true);
    try {
      // 提取标题作为文件名
      let filename = 'document.md';
      let outputFilename = 'document.docx';
      const titleMatch = markdownText.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim().replace(/[\\/:*?"<>|]/g, '-');
        filename = `${title}.md`;
        outputFilename = `${title}.docx`;
      }

      const tempFile = new Blob([markdownText], { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', tempFile, filename);
      formData.append('style', theme);
      
      const response = await axios.post('/api/convert/markdown-to-docx', formData, {
        responseType: 'blob',
        timeout: 30000 // 添加30秒超时
      });
      
      // 下载文件
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('导出Word失败:', err);
      console.warn('导出Word失败，请重试');
    } finally {
      setIsConverting(false);
    }
  };

  // 导出HTML功能
  const handleExportHtml = async () => {
    if (!markdownText.trim()) {
      console.warn('请输入Markdown内容');
      return;
    }
    
    try {
      // 提取标题作为文件名
      let filename = 'markdown-export.html';
      const titleMatch = markdownText.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        filename = `${titleMatch[1].trim()}.html`;
      }
      
      const tempFile = new Blob([markdownText], { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', tempFile, 'temp.md');
      formData.append('style', theme);
      
      const response = await axios.post('/api/convert/markdown-to-html', formData, {
        timeout: 12000, // 设置12秒超时
      });
      
      if (response.data && typeof response.data === 'string') {
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error('导出HTML失败: 无效的HTML响应');
      }
    } catch (err) {
      console.error('导出HTML失败:', err);
      console.warn('导出HTML失败，请重试');
    }
  };

  // 复制功能
  const handleCopy = async () => {
    // 创建提示元素
    const createToast = (message, type = 'success') => {
      const toast = document.createElement('div');
      toast.className = `md-toast md-toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(-20px);
      `;
      
      // 根据类型设置不同背景色
      if (type === 'success') {
        toast.style.backgroundColor = '#52c41a';
      } else if (type === 'error') {
        toast.style.backgroundColor = '#ff4d4f';
      } else if (type === 'warning') {
        toast.style.backgroundColor = '#faad14';
      }
      
      document.body.appendChild(toast);
      
      // 显示动画
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      }, 100);
      
      // 3秒后自动移除
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
      
      return toast;
    };
    
    try {
      // 先导出HTML，然后复制到剪贴板
      const tempFile = new Blob([markdownText], { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', tempFile, 'temp.md');
      formData.append('style', theme);
      
      const response = await axios.post('/api/convert/markdown-to-html', formData, {
        timeout: 12000,
      });
      
      if (response.data && typeof response.data === 'string') {
        // 创建临时元素来获取纯文本
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = response.data;
        const plainText = tempDiv.textContent || tempDiv.innerText;
        
        // 使用现代的Clipboard API复制HTML和纯文本
        if (navigator.clipboard && navigator.clipboard.write) {
          // 创建ClipboardItem，同时包含HTML和纯文本
          const clipboardItem = new ClipboardItem({
            'text/html': new Blob([response.data], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' })
          });
          await navigator.clipboard.write([clipboardItem]);
          createToast('已复制渲染后的内容到剪贴板');
        } else {
          // 回退方案：只复制纯文本
          await navigator.clipboard.writeText(plainText);
          createToast('已复制渲染后的纯文本内容到剪贴板', 'warning');
        }
      }
    } catch (err) {
      console.error('复制失败:', err);
      try {
        // 最终回退方案：只复制编辑器中的Markdown原始文本
        await navigator.clipboard.writeText(markdownText);
        createToast('已复制Markdown原始文本', 'warning');
      } catch (fallbackErr) {
        console.error('回退复制方案也失败了:', fallbackErr);
        createToast('复制失败，请手动复制', 'error');
      }
    }
  };

  // 返回首页
  const goHome = () => {
    window.location.pathname = '/';
  };

  // 切换编辑/预览视图
  const toggleView = () => {
    setShowEditor(!showEditor);
  };

  // 开始调整大小
  const handleResizeStart = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // 调整大小
  const handleResize = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setEditorWidth(Math.max(20, Math.min(80, newWidth)));
  };

  // 结束调整大小
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div className="md-project-page">
      {/* 顶部导航栏 - 匹配 doocs/md 设计 */}
      <div className="md-project-menu-bar">
        {/* 左侧传统菜单 */}
        <div className="md-project-menu">
          <div className="md-project-menu-item">文件
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => document.getElementById('md-upload-input').click()}>导入文件</button>
              <button className="md-project-submenu-item" onClick={handleSaveAsWord}>导出Word</button>
              <button className="md-project-submenu-item" onClick={handleExportHtml}>导出HTML</button>
            </div>
          </div>
          <div className="md-project-menu-item">编辑
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => insertSyntax('# ')}>一级标题</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('## ')}>二级标题</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('### ')}>三级标题</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('**', '**')}>粗体</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('*', '*')}>斜体</button>
            </div>
          </div>
          <div className="md-project-menu-item">格式
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => insertSyntax('- ')}>无序列表</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('1. ')}>有序列表</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('- [ ] ')}>任务列表</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('> ')}>引用</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('`', '`')}>行内代码</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('```\n', '\n```')}>代码块</button>
            </div>
          </div>
          <div className="md-project-menu-item">插入
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => insertSyntax('[]()', '')}>链接</button>
              <button className="md-project-submenu-item" onClick={() => document.getElementById('md-image-upload').click()}>图片</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('| | |\n|---|---|\n| | |', '')}>表格</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('\n---\n')}>分割线</button>
              <button className="md-project-submenu-item" onClick={() => insertSyntax('$$ ', ' $$')}>数学公式</button>
            </div>
          </div>
          <div className="md-project-menu-item">样式
            <div className="md-project-submenu">
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>主题</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item" onClick={() => setTheme('default')}>经典</button>
                  <button className="md-project-submenu-item" onClick={() => setTheme('modern')}>优雅</button>
                  <button className="md-project-submenu-item" onClick={() => setTheme('clean')}>
                    <span>简洁</span>
                    <span style={{ marginLeft: 'auto' }}>✓</span>
                  </button>
                  <button className="md-project-submenu-item" onClick={() => setTheme('doocs_classic')}>Doocs 经典</button>
                  <button className="md-project-submenu-item" onClick={() => setTheme('doocs_elegant')}>Doocs 优雅</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>字体</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">默认字体</button>
                  <button className="md-project-submenu-item">微软雅黑</button>
                  <button className="md-project-submenu-item">宋体</button>
                  <button className="md-project-submenu-item">楷体</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>字号</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">小</button>
                  <button className="md-project-submenu-item">中</button>
                  <button className="md-project-submenu-item">大</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>主题色</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">默认</button>
                  <button className="md-project-submenu-item">蓝色</button>
                  <button className="md-project-submenu-item">绿色</button>
                  <button className="md-project-submenu-item">红色</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>代码块主题</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">默认</button>
                  <button className="md-project-submenu-item">暗色</button>
                  <button className="md-project-submenu-item">亮色</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>图注格式</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">默认</button>
                  <button className="md-project-submenu-item">编号</button>
                  <button className="md-project-submenu-item">自定义</button>
                </div>
              </div>
              <button className="md-project-submenu-item" onClick={() => alert('自定义主题色功能')}>自定义主题色</button>
              <button className="md-project-submenu-item" onClick={() => alert('自定义CSS功能')}>自定义CSS</button>
              <div className="md-project-submenu-item" style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={true} style={{ marginRight: '8px' }} />
                <span>Mac代码块</span>
              </div>
              <button className="md-project-submenu-item" onClick={() => alert('重置样式功能')}>重置</button>
            </div>
          </div>
          <div className="md-project-menu-item">视图
            <div className="md-project-submenu">
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>外观</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">浅色主题</button>
                  <button className="md-project-submenu-item">深色主题</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>编辑模式</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item">分屏模式</button>
                  <button className="md-project-submenu-item">全屏模式</button>
                </div>
              </div>
              <div className="md-project-submenu-item" style={{ cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'flex';
              }} onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector('.md-project-submenu');
                if (submenu) submenu.style.display = 'none';
              }}>
                <span>预览模式</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
                <div className="md-project-submenu" style={{ left: '100%', top: 0, display: 'none' }}>
                  <button className="md-project-submenu-item" onClick={() => {
                    // 切换到移动端预览模式
                    alert('已切换到移动端预览模式');
                  }}>移动端</button>
                  <button className="md-project-submenu-item" onClick={() => {
                    // 切换到电脑端预览模式
                    alert('已切换到电脑端预览模式');
                  }}>
                    <span>电脑端</span>
                    <span style={{ marginLeft: 'auto' }}>✓</span>
                  </button>
                </div>
              </div>
              <button className="md-project-submenu-item" onClick={() => alert('浮动目录功能')}>浮动目录</button>
              <button className="md-project-submenu-item" onClick={() => alert('样式面板功能')}>样式面板</button>
              <button className="md-project-submenu-item" onClick={() => alert('CSS 编辑器功能')}>CSS 编辑器</button>
            </div>
          </div>
          <div className="md-project-menu-item">帮助
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => alert('Markdown 编辑器 v1.0.0\n\n基于 GitHub 项目 https://github.com/aqiyoung/md')}>关于</button>
            </div>
          </div>
        </div>

        {/* 右侧图二样式按钮 */}
        <div className="md-project-header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="md-project-simple-btn" onClick={goHome} title="返回首页">
            🏠 返回首页
          </button>
          <button className="md-project-simple-btn" onClick={handleCopy} title="复制到剪贴板">
            📋 复制
          </button>
          <button className="md-project-simple-btn" onClick={handleSaveAsWord} title="发布文档">
            📤 发布
          </button>
          <button 
            className="md-project-simple-btn style-btn" 
            onClick={() => setShowStylePanel(!showStylePanel)}
            title="样式设置"
          >
            ⚙️ 样式
          </button>
        </div>
      </div>

      {/* 编辑器主体 - 两栏布局，移除左侧文章区域 */}
      <div ref={containerRef} className="md-project-main">
        {/* 中间编辑和预览区 - 占据整个宽度 */}
        <div className="md-project-center-panel" style={{ width: '100%' }}>

          {/* 可调整大小的编辑、预览和样式区 */}
          <div className="md-project-editor-preview-container">
            {/* 左侧编辑区 */}
            {showEditor && (
              <div 
                className="md-project-pane md-project-editor"
                style={{ width: showStylePanel ? `${editorWidth * 0.8}%` : `${editorWidth}%` }}
              >
                <div className="md-project-editor-content">
                  {/* CodeMirror 编辑器，支持语法高亮 */}
                  <CodeMirror
                    value={markdownText}
                    onChange={(value) => setMarkdownText(value)}
                    placeholder="在此输入 Markdown 内容..."
                    extensions={[
                      lineNumbers(),
                      highlightActiveLineGutter(),
                      highlightSpecialChars(),
                      foldGutter(),
                      drawSelection(),
                      dropCursor(),
                      indentOnInput(),
                      syntaxHighlighting(defaultHighlightStyle),
                      bracketMatching(),
                      closeBrackets(),
                      rectangularSelection(),
                      crosshairCursor(),
                      highlightActiveLine(),
                      highlightSelectionMatches(),
                      markdown(),
                      keymap.of([
                        ...closeBracketsKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap
                      ])
                    ]}
                    className="md-project-codemirror"
                  />
                </div>
              </div>
            )}
            
            {/* 分隔条1 */}
            {showEditor && (
              <div 
                ref={dividerRef}
                className="md-project-resizer"
                onMouseDown={handleResizeStart}
                style={{ cursor: isResizing ? 'col-resize' : 'ew-resize' }}
              />
            )}
            
            {/* 中间预览区 */}
            <div 
              className="md-project-pane md-project-preview"
              style={{ width: showStylePanel ? showEditor ? `${(100 - editorWidth) * 0.8}%` : '80%' : showEditor ? `${100 - editorWidth}%` : '100%' }}
            >
              {/* 预览内容区 */}
              <div className="md-project-preview-content">
                <MdProjectCore 
                  markdownText={markdownText} 
                  theme={currentTheme} 
                  font={currentFont}
                  fontSize={currentFontSize}
                  themeColor={currentThemeColor}
                  showLineNumbers={true}
                  macCodeBlock={macCodeBlock}
                  codeLineNumbers={codeLineNumbers}
                  wechatLinkReference={wechatLinkReference}
                  paragraphIndent={paragraphIndent}
                  paragraphJustify={paragraphJustify}
                />
              </div>
              
              {/* 回到顶部按钮 */}
              <button className="md-project-back-to-top" onClick={() => {
                const previewContent = document.querySelector('.md-project-preview-content');
                if (previewContent) {
                  previewContent.scrollTop = 0;
                }
              }} title="回到顶部">
                ↑
              </button>
            </div>
            
            {/* 分隔条2 */}
            {showStylePanel && (
              <div 
                className="md-project-resizer"
                style={{ cursor: 'ew-resize' }}
              />
            )}
            
            {/* 右侧样式设置区 */}
            {showStylePanel && (
              <div 
                className="md-project-pane md-project-style-panel"
                style={{ width: '20%' }}
              >
                <div className="md-project-style-panel-header">
                  <h3>样式设置</h3>
                  <button className="md-project-style-panel-close" onClick={() => setShowStylePanel(false)}>×</button>
                </div>
                <div className="md-project-style-panel-content">
                  {/* 主题选择 */}
                  <div className="md-project-style-section">
                    <label>主题</label>
                    <div className="md-project-style-buttons-three">
                      <button 
                        className={`md-project-style-radio-btn ${currentTheme === 'classic' ? 'active' : ''}`}
                        onClick={() => setCurrentTheme('classic')}
                      >
                        经典
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentTheme === 'elegant' ? 'active' : ''}`}
                        onClick={() => setCurrentTheme('elegant')}
                      >
                        优雅
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentTheme === 'clean' ? 'active' : ''}`}
                        onClick={() => setCurrentTheme('clean')}
                      >
                        简洁
                      </button>
                    </div>
                  </div>
                  
                  {/* 字体选择 */}
                  <div className="md-project-style-section">
                    <label>字体</label>
                    <div className="md-project-style-buttons-three">
                      <button 
                        className={`md-project-style-radio-btn ${currentFont === 'sans-serif' ? 'active' : ''}`}
                        onClick={() => setCurrentFont('sans-serif')}
                      >
                        无衬线
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFont === 'serif' ? 'active' : ''}`}
                        onClick={() => setCurrentFont('serif')}
                      >
                        衬线
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFont === 'monospace' ? 'active' : ''}`}
                        onClick={() => setCurrentFont('monospace')}
                      >
                        等宽
                      </button>
                    </div>
                  </div>
                  
                  {/* 字号选择 */}
                  <div className="md-project-style-section">
                    <label>字号</label>
                    <div className="md-project-style-buttons-five">
                      <button 
                        className={`md-project-style-radio-btn ${currentFontSize === 'smaller' ? 'active' : ''}`}
                        onClick={() => setCurrentFontSize('smaller')}
                      >
                        更小
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFontSize === 'small' ? 'active' : ''}`}
                        onClick={() => setCurrentFontSize('small')}
                      >
                        稍小
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFontSize === 'recommended' ? 'active' : ''}`}
                        onClick={() => setCurrentFontSize('recommended')}
                      >
                        推荐
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFontSize === 'large' ? 'active' : ''}`}
                        onClick={() => setCurrentFontSize('large')}
                      >
                        稍大
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentFontSize === 'larger' ? 'active' : ''}`}
                        onClick={() => setCurrentFontSize('larger')}
                      >
                        更大
                      </button>
                    </div>
                  </div>
                  
                  {/* 主题色选择 */}
                  <div className="md-project-style-section">
                    <label>主题色</label>
                    <div className="md-project-style-color-grid">
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#1e40af' ? 'active' : ''}`}
                        style={{ backgroundColor: '#1e40af', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#1e40af')}
                      >
                        经典蓝
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#047857' ? 'active' : ''}`}
                        style={{ backgroundColor: '#047857', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#047857')}
                      >
                        翡翠绿
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#f97316' ? 'active' : ''}`}
                        style={{ backgroundColor: '#f97316', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#f97316')}
                      >
                        活力橘
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#eab308' ? 'active' : ''}`}
                        style={{ backgroundColor: '#eab308', color: '#000' }}
                        onClick={() => setCurrentThemeColor('#eab308')}
                      >
                        柠檬黄
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#8b5cf6' ? 'active' : ''}`}
                        style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#8b5cf6')}
                      >
                        薰衣紫
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#06b6d4' ? 'active' : ''}`}
                        style={{ backgroundColor: '#06b6d4', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#06b6d4')}
                      >
                        天空蓝
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#d97706' ? 'active' : ''}`}
                        style={{ backgroundColor: '#d97706', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#d97706')}
                      >
                        玫瑰金
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#4d7c0f' ? 'active' : ''}`}
                        style={{ backgroundColor: '#4d7c0f', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#4d7c0f')}
                      >
                        橄榄绿
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#1f2937' ? 'active' : ''}`}
                        style={{ backgroundColor: '#1f2937', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#1f2937')}
                      >
                        石墨黑
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#6b7280' ? 'active' : ''}`}
                        style={{ backgroundColor: '#6b7280', color: '#fff' }}
                        onClick={() => setCurrentThemeColor('#6b7280')}
                      >
                        雾烟灰
                      </button>
                      <button 
                        className={`md-project-style-color-btn ${currentThemeColor === '#f9a8d4' ? 'active' : ''}`}
                        style={{ backgroundColor: '#f9a8d4', color: '#000' }}
                        onClick={() => setCurrentThemeColor('#f9a8d4')}
                      >
                        樱花粉
                      </button>
                    </div>
                  </div>
                  
                  {/* 自定义主题色 */}
                  <div className="md-project-style-section">
                    <label>自定义主题色</label>
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        type="color" 
                        value={currentThemeColor} 
                        onChange={(e) => setCurrentThemeColor(e.target.value)}
                        style={{ width: '60px', height: '36px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  
                  {/* 标题样式 */}
                  <div className="md-project-style-section">
                    <label>标题样式</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <select 
                        className="md-project-style-select" 
                        style={{ flex: 1 }}
                        value={currentHeadingStyle}
                        onChange={(e) => setCurrentHeadingStyle(e.target.value)}
                      >
                        <option value="h1">一级标题</option>
                        <option value="h2">二级标题</option>
                        <option value="h3">三级标题</option>
                      </select>
                      <select 
                        className="md-project-style-select" 
                        style={{ flex: 1 }}
                        value={currentHeadingFormat}
                        onChange={(e) => setCurrentHeadingFormat(e.target.value)}
                      >
                        <option value="default">默认</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* 代码主题 */}
                  <div className="md-project-style-section">
                    <label>代码主题</label>
                    <select 
                      className="md-project-style-select"
                      value={currentCodeTheme}
                      onChange={(e) => setCurrentCodeTheme(e.target.value)}
                    >
                      <option value="github-dark">github-dark</option>
                      <option value="github-light">github-light</option>
                      <option value="monokai">monokai</option>
                      <option value="nord">nord</option>
                    </select>
                  </div>
                  
                  {/* 图注格式 */}
                  <div className="md-project-style-section">
                    <label>图注格式</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${currentCaptionFormat === 'title-first' ? 'active' : ''}`}
                        onClick={() => setCurrentCaptionFormat('title-first')}
                      >
                        title 优先
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentCaptionFormat === 'alt-first' ? 'active' : ''}`}
                        onClick={() => setCurrentCaptionFormat('alt-first')}
                      >
                        alt 优先
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentCaptionFormat === 'only-title' ? 'active' : ''}`}
                        onClick={() => setCurrentCaptionFormat('only-title')}
                      >
                        只显示 title
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentCaptionFormat === 'only-alt' ? 'active' : ''}`}
                        onClick={() => setCurrentCaptionFormat('only-alt')}
                      >
                        只显示 alt
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${currentCaptionFormat === 'none' ? 'active' : ''}`}
                        onClick={() => setCurrentCaptionFormat('none')}
                      >
                        不显示
                      </button>
                    </div>
                  </div>
                  
                  {/* Mac 代码块 */}
                  <div className="md-project-style-section">
                    <label>Mac 代码块</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${macCodeBlock ? 'active' : ''}`}
                        onClick={() => setMacCodeBlock(true)}
                      >
                        开启
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${!macCodeBlock ? 'active' : ''}`}
                        onClick={() => setMacCodeBlock(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {/* 代码块行号 */}
                  <div className="md-project-style-section">
                    <label>代码块行号</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${codeLineNumbers ? 'active' : ''}`}
                        onClick={() => setCodeLineNumbers(true)}
                      >
                        开启
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${!codeLineNumbers ? 'active' : ''}`}
                        onClick={() => setCodeLineNumbers(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {/* 微信外链底部引用 */}
                  <div className="md-project-style-section">
                    <label>微信外链底部引用</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${wechatLinkReference ? 'active' : ''}`}
                        onClick={() => setWechatLinkReference(true)}
                      >
                        开启
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${!wechatLinkReference ? 'active' : ''}`}
                        onClick={() => setWechatLinkReference(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {/* 段落首行缩进 */}
                  <div className="md-project-style-section">
                    <label>段落首行缩进</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${paragraphIndent ? 'active' : ''}`}
                        onClick={() => setParagraphIndent(true)}
                      >
                        开启
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${!paragraphIndent ? 'active' : ''}`}
                        onClick={() => setParagraphIndent(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {/* 段落两端对齐 */}
                  <div className="md-project-style-section">
                    <label>段落两端对齐</label>
                    <div className="md-project-style-buttons">
                      <button 
                        className={`md-project-style-radio-btn ${paragraphJustify ? 'active' : ''}`}
                        onClick={() => setParagraphJustify(true)}
                      >
                        开启
                      </button>
                      <button 
                        className={`md-project-style-radio-btn ${!paragraphJustify ? 'active' : ''}`}
                        onClick={() => setParagraphJustify(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {/* 重置按钮 */}
                  <div className="md-project-style-section">
                    <button 
                      className="md-project-style-reset-btn"
                      onClick={() => {
                        setCurrentTheme('classic');
                        setCurrentFont('sans-serif');
                        setCurrentFontSize('smaller');
                        setCurrentThemeColor('#1e40af');
                        setCurrentHeadingStyle('h2');
                        setCurrentHeadingFormat('default');
                        setCurrentCodeTheme('github-dark');
                        setCurrentCaptionFormat('title-first');
                        setMacCodeBlock(true);
                        setCodeLineNumbers(false);
                        setWechatLinkReference(false);
                        setParagraphIndent(false);
                        setParagraphJustify(false);
                      }}
                    >
                      重置
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* 底部状态栏 */}
      <footer className="md-project-footer">
        <div className="md-project-footer-left">
          <p>GitHub项目: <a href="https://github.com/aqiyoung/md" target="_blank" rel="noopener noreferrer">https://github.com/aqiyoung/md</a> © 2026</p>
        </div>
        <div className="md-project-footer-right">
          <p>当前主题: {theme} | 字数: {markdownText.trim().split(/\s+/).length} | 行数: {markdownText.split('\n').length}</p>
        </div>
      </footer>

      {/* 图床配置模态框 */}
      {showImageModal && (
        <div className="md-project-modal-overlay" onClick={(e) => e.target.className === 'md-project-modal-overlay' && setShowImageModal(false)}>
          <div className="md-project-modal-content">
            <div className="md-project-modal-header">
              <h3 className="md-project-modal-title">GitHub 图床配置</h3>
              <button className="md-project-modal-close" onClick={() => setShowImageModal(false)}>×</button>
            </div>
            <div className="md-project-modal-body">
              <div className="md-project-form-group">
                <label>Token (必填)</label>
                <input
                  type="password"
                  name="token"
                  value={githubConfig.token}
                  onChange={handleGithubConfigChange}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <small>请在 GitHub Settings &gt; Developer settings 生成 Personal access token</small>
              </div>
              <div className="md-project-form-group">
                <label>Repo (必填)</label>
                <input
                  type="text"
                  name="repo"
                  value={githubConfig.repo}
                  onChange={handleGithubConfigChange}
                  placeholder="username/repo"
                />
              </div>
              <div className="md-project-form-group">
                <label>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={githubConfig.branch}
                  onChange={handleGithubConfigChange}
                  placeholder="main"
                />
              </div>
              <div className="md-project-form-group">
                <label>Path</label>
                <input
                  type="text"
                  name="path"
                  value={githubConfig.path}
                  onChange={handleGithubConfigChange}
                  placeholder="images"
                />
              </div>
            </div>
            <div className="md-project-modal-footer">
              <button className="md-project-btn primary" onClick={() => setShowImageModal(false)}>保存配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MdProjectPage;