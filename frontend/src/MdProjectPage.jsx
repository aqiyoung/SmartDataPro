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

// SVG Icons
const Icons = {
  Bold: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>,
  Italic: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>,
  List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  OrderedList: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>,
  TaskList: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
  Quote: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>,
  Code: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  Link: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
  Image: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Table: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>,
  Hr: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  CodeBlock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><path d="M9 9h6"></path><path d="M9 13h6"></path><path d="M9 17h4"></path></svg>,
  Sigma: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6l8 8-8 8h12"></path></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Pen: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
};

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
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);



  // 默认示例文本 - md项目专属
  useEffect(() => {
    const defaultText = [
      '# Markdown 项目 (md)',
      '',
      '## 📁 项目介绍',
      '',
      '这是一个基于 GitHub 项目 [https://github.com/aqiyoung/md](https://github.com/aqiyoung/md) 的原样克隆实现。',
      '',
      '## 🎯 核心功能',
      '',
      '- ✅ **完整 Markdown 支持** - 支持所有基础语法',
      '- ✅ **实时预览** - 编辑内容即时渲染',
      '- ✅ **多种主题** - 支持多种预览样式',
      '- ✅ **GitHub图床** - 支持图片上传到GitHub',
      '- ✅ **导出功能** - 支持导出 HTML 和 Word',
      '- ✅ **代码高亮** - 支持多种编程语言',
      '',
      '## 📝 快速开始',
      '',
      '1. 在左侧编辑区输入 Markdown 内容',
      '2. 右侧实时预览渲染效果',
      '3. 选择喜欢的主题样式',
      '4. 导出或复制结果',
      '',
      '## 💡 使用示例',
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
      {/* 顶部传统菜单栏 */}
      <div className="md-project-menu-bar">
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
              <button className="md-project-submenu-item" onClick={() => setTheme('default')}>默认样式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('clean')}>简洁模式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('modern')}>现代模式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('book')}>书籍模式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('docs')}>文档模式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('tech_blue')}>科技蓝</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('dark_mode')}>暗黑模式</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('github')}>GitHub 风格</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('wechat')}>微信公众号</button>
              <button className="md-project-submenu-item" onClick={() => setTheme('xiaohongshu')}>小红书</button>
            </div>
          </div>
          <div className="md-project-menu-item">视图
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={toggleView}>{showEditor ? '预览模式' : '编辑模式'}</button>
            </div>
          </div>
          <div className="md-project-menu-item">帮助
            <div className="md-project-submenu">
              <button className="md-project-submenu-item" onClick={() => alert('Markdown 编辑器 v1.0.0\n\n基于 GitHub 项目 https://github.com/aqiyoung/md')}>关于</button>
            </div>
          </div>
        </div>
        

        <div className="md-project-menu-right">
          <button className="md-project-menu-btn" onClick={goHome} title="返回首页">🏠</button>
          <button className="md-project-menu-btn" onClick={handleCopy} title="复制到剪贴板"><Icons.Copy /></button>
        </div>
      </div>

      {/* 编辑器主体 - 采用两栏布局，移除左侧文章区域 */}
      <div ref={containerRef} className="md-project-main">
        {/* 中间编辑和预览区 - 占据整个宽度 */}
        <div className="md-project-center-panel" style={{ width: '100%' }}>


          {/* 可调整大小的编辑和预览区 */}
          <div className="md-project-editor-preview-container">
            {/* 左侧编辑区 */}
            {showEditor && (
              <div 
                className="md-project-pane md-project-editor"
                style={{ width: `${editorWidth}%` }}
              >
                <div className="md-project-editor-content">
                  {/* 编辑区 */}
                  <textarea
                    ref={textareaRef}
                    className="md-project-textarea"
                    value={markdownText}
                    onChange={handleTextChange}
                    placeholder="在此输入 Markdown 内容..."
                  />
                </div>
              </div>
            )}
            
            {/* 分隔条 */}
            {showEditor && (
              <div 
                ref={dividerRef}
                className="md-project-resizer"
                onMouseDown={handleResizeStart}
                style={{ cursor: isResizing ? 'col-resize' : 'ew-resize' }}
              />
            )}
            
            {/* 右侧预览区 */}
            <div 
              className="md-project-pane md-project-preview"
              style={{ width: showEditor ? `${100 - editorWidth}%` : '100%' }}
            >
              {/* 预览内容区 */}
              <div className="md-project-preview-content">
                <MdProjectCore 
                  markdownText={markdownText} 
                  theme={theme} 
                  showLineNumbers={true} 
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
          </div>
        </div>


      </div>
      
      {/* 移动端浮动按钮组 - 原项目的移动端浮动按钮 */}
      <div className="md-project-mobile-fab">
        <button className="md-project-fab-btn" onClick={toggleView} title={showEditor ? "切换到预览模式" : "切换到编辑模式"}>
          {showEditor ? <Icons.Eye /> : <Icons.Pen />}
        </button>
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