// ===========================================================================
// ========================= 独立功能模块：Markdown编辑器 =========================
// ===========================================================================
// 说明：此模块为独立功能，与其他转换页面分离，修改时请勿同步到其他页面
// 版本：v2.1.0
// 更新日期：2026-01-18
// ===========================================================================

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MarkdownEditor.css';

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
};

const MarkdownEditorPage = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlPreview, setHtmlPreview] = useState('');
  const [theme, setTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [previewScale, setPreviewScale] = useState(100);
  const [previewDevice, setPreviewDevice] = useState('full');
  const [showImageModal, setShowImageModal] = useState(false);
  const [githubConfig, setGithubConfig] = useState({
    token: localStorage.getItem('github_token') || '',
    repo: localStorage.getItem('github_repo') || '',
    branch: localStorage.getItem('github_branch') || 'main',
    path: localStorage.getItem('github_path') || 'images'
  });
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  // 使用useRef保存定时器ID，避免闭包问题
  const timeoutRef = useRef(null);

  // 实时预览函数
  const handleLivePreview = async (text, currentTheme) => {
    if (!text || !text.trim()) {
      setHtmlPreview('');
      return;
    }
    
    // 取消之前的请求
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 使用setTimeout模拟防抖，避免复杂的防抖函数问题
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('开始转换Markdown到HTML，文本长度:', text.length);
        console.log('当前主题:', currentTheme || theme);
        
        // 限制转换的文本长度，防止过大的内容导致问题
        const textToConvert = text.length > 50000 ? text.substring(0, 50000) + '\n\n<!-- 内容过长，已截断 -->' : text;
        
        const tempFile = new Blob([textToConvert], { type: 'text/markdown' });
        const formData = new FormData();
        formData.append('file', tempFile, 'temp.md');
        formData.append('style', currentTheme || theme);
        
        console.log('准备发送请求，formData内容:', {
          file: tempFile,
          style: currentTheme || theme
        });
        
        const response = await axios.post('/api/convert/markdown-to-html', formData, {
          timeout: 12000, // 设置12秒超时
        });
        
        console.log('请求成功，响应状态:', response.status);
        
        // 检查响应数据
        if (response.data && typeof response.data === 'string') {
          console.log('HTML转换成功，HTML长度:', response.data.length);
          setHtmlPreview(response.data);
        } else {
          console.error('预览失败: 无效的HTML响应', response.data);
          setHtmlPreview(`<div style="color: red; padding: 20px;">预览失败: 无效的HTML响应</div>`);
        }
      } catch (err) {
        console.error('预览失败:', err);
        console.error('错误详情:', {
          name: err.name,
          message: err.message,
          code: err.code,
          response: err.response ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          } : null
        });
        // 显示详细错误信息，方便调试
        let errorMessage = err.message;
        if (err.code === 'ECONNABORTED') {
          errorMessage = '转换超时，请检查内容复杂度';
        } else if (err.code === 'ECONNREFUSED') {
          errorMessage = '无法连接到服务器，请检查后端服务是否正常运行';
        } else if (err.response) {
          errorMessage = `服务器错误: ${err.response.status} ${err.response.statusText}`;
          // 显示详细的错误响应内容
          if (err.response.data) {
            if (typeof err.response.data === 'object') {
              errorMessage += ` - ${JSON.stringify(err.response.data)}`;
            } else {
              errorMessage += ` - ${err.response.data}`;
            }
          }
        }
        setHtmlPreview(`<div style="color: red; padding: 20px;">预览失败: ${errorMessage}</div>`);
      }
    }, 200); // 200ms延迟，平衡实时性和性能
  };
  
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // 默认示例文本
  useEffect(() => {
    // 构建默认文本，使用数组join方法避免转义问题
    const defaultText = [
      '# Markdown 编辑器',
      '',
      '## 📝 项目介绍',
      '',
      'Markdown 文档自动即时渲染，让你不再为内容排版而发愁！只要你会基本的 Markdown 语法，就能做出一篇样式简洁而又美观大方的文档。',
      '',
      '## 🤔 为何开发这款编辑器',
      '',
      '现有的开源 Markdown 编辑器样式繁杂，排版过程中往往需要额外调整，影响使用效率。为了解决这一问题，我们打造了一款更加简洁、优雅的编辑器，提供更流畅的排版体验。',
      '',
      '## ✨ 功能特性',
      '',
      '### 🎨 核心功能',
      '',
      '- ✅ **完整 Markdown 支持** - 支持所有基础语法、数学公式',
      '- ✅ **图表渲染** - 支持 Mermaid 图表和 GFM 警告块',
      '- ✅ **PlantUML 支持** - 强大的 UML 图表渲染',
      '- ✅ **Ruby 注音扩展** - 支持 [文字]{注音}、[文字]^(注音) 格式，支持多种分隔符',
      '',
      '### 🎯 编辑体验',
      '',
      '- ✅ **代码高亮** - 丰富的代码块高亮主题，提升代码可读性',
      '- ✅ **自定义样式** - 允许自定义主题色和 CSS 样式，灵活定制展示效果',
      '- ✅ **草稿保存** - 内置本地内容管理功能，支持草稿自动保存',
      '',
      '### 🚀 高级功能',
      '',
      '- ✅ **多图床支持** - 提供多种图床选择，便捷的图片上传功能',
      '- ✅ **文件管理** - 便捷的文件导入、导出功能，提升工作效率',
      '',
      '## 🖼️ 支持的图床服务',
      '',
      '| # | 图床 | 使用时是否需要配置 | 备注 |',
      '|---|---|---|---|',
      '| 1 | 默认 | 否 | - |',
      '| 2 | GitHub | 配置 Repo、Token 参数 | 如何获取 GitHub token？ |',
      '| 3 | 阿里云 | 配置 AccessKey ID、AccessKey Secret、Bucket、Region 参数 | 如何使用阿里云 OSS？ |',
      '| 4 | 腾讯云 | 配置 SecretId、SecretKey、Bucket、Region 参数 | 如何使用腾讯云 COS？ |',
      '| 5 | 七牛云 | 配置 AccessKey、SecretKey、Bucket、Domain、Region 参数 | 如何使用七牛云 Kodo？ |',
      '| 6 | MinIO | 配置 Endpoint、Port、UseSSL、Bucket、AccessKey、SecretKey 参数 | 如何使用 MinIO？ |',
      '| 7 | 公众号 | 配置 appID、appsecret、代理域名 参数 | 如何使用公众号图床？ |',
      '| 8 | Cloudflare R2 | 配置 AccountId、AccessKey、SecretKey、Bucket、Domain 参数 | 如何使用 S3 API 操作 R2？ |',
      '| 9 | 又拍云 | 配置 Bucket、Operator、Password、Domain 参数 | 如何使用 又拍云？ |',
      '| 10 | Telegram | 配置 Bot Token、Chat ID 参数 | 如何使用 Telegram 图床？ |',
      '| 11 | Cloudinary | 配置 Cloud Name、API Key、API Secret 参数 | 如何使用 Cloudinary？ |',
      '| 12 | 自定义上传 | 是 | 如何自定义上传？ |',
      ''
    ].join('\n');
    
    setMarkdownText(defaultText);
    handleLivePreview(defaultText, 'default');
  }, []);

  // 当markdownText变化时，自动更新预览（包括AI生成的内容）
  useEffect(() => {
    if (markdownText) {
      handleLivePreview(markdownText, theme);
    } else {
      setHtmlPreview('');
    }
  }, [markdownText, theme]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setMarkdownText(text);
    // 不再直接调用handleLivePreview，而是依赖useEffect监听markdownText变化
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    handleLivePreview(markdownText, newTheme);
  };

  const handleScaleChange = (type) => {
    if (type === 'plus') setPreviewScale(prev => Math.min(prev + 10, 200));
    if (type === 'minus') setPreviewScale(prev => Math.max(prev - 10, 50));
  };

  const handleDeviceChange = (e) => {
    setPreviewDevice(e.target.value);
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
      // 替换alert为更友好的提示方式（后续可以添加toast组件）
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
          const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}.${ext}`; // 使用substring替代substr，更安全
          const path = githubConfig.path ? `${githubConfig.path}/${filename}` : filename;
          
          const url = `https://api.github.com/repos/${githubConfig.repo}/contents/${path}`;
          
          try {
            await axios.put(url, {
              message: `Upload image ${filename} via Markdown Editor`,
              content: base64Content,
              branch: githubConfig.branch
            }, {
              headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Markdown-Editor' // 添加User-Agent头，符合GitHub API要求
              },
              timeout: 10000 // 添加超时设置
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
      // 替换alert为更友好的提示方式
      console.warn('图片上传失败，请检查配置或网络');
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
      // 替换alert为更友好的提示方式
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
  }, [githubConfig]); // 依赖配置变化

  // 点击外部关闭菜单
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
    handleLivePreview(newText, theme);
    
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
      handleLivePreview(text, theme);
    };
    reader.readAsText(file);
    // 清空input值，允许重复上传同一文件
    e.target.value = null;
  };

  // 保存为Word
  const handleSaveAsWord = async () => {
    if (!markdownText.trim()) {
      // 替换alert为更友好的提示方式
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
      
      // 优先使用提取的标题作为文件名，如果后端有返回更准确的则使用后端的
      if (titleMatch && titleMatch[1]) {
         // 已经设置了 outputFilename
      } else {
          // 尝试从 header 获取
          const contentDisposition = response.headers['content-disposition'];
          if (contentDisposition) {
            const matches = /filename\*=utf-8''([^;]+)/.exec(contentDisposition);
            if (matches && matches[1]) {
              outputFilename = decodeURIComponent(matches[1]);
            } else {
              const matches2 = /filename="([^"]+)"/.exec(contentDisposition);
              if (matches2 && matches2[1]) {
                outputFilename = matches2[1];
              }
            }
          } else {
             // 使用当前时间戳生成文件名
             const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
             outputFilename = `document-${timestamp}.docx`;
          }
      }
      
      link.setAttribute('download', outputFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('导出Word失败:', err);
      // 替换alert为更友好的提示方式
      console.warn('导出Word失败，请重试');
    } finally {
      setIsConverting(false);
    }
  };

  // 导出HTML功能
  const handleExportHtml = () => {
    // 提取标题作为文件名
    let filename = 'markdown-export.html';
    const titleMatch = markdownText.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      filename = `${titleMatch[1].trim()}.html`;
    }
    
    const blob = new Blob([htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    
    const iframe = document.querySelector('.preview-iframe');
    if (iframe && iframe.contentDocument) {
      try {
        const doc = iframe.contentDocument;
        
        // 获取渲染后的HTML内容和纯文本内容
        const htmlContent = doc.body.innerHTML;
        const plainText = doc.body.textContent || doc.body.innerText;
        
        // 使用现代的Clipboard API复制HTML和纯文本，以支持不同粘贴场景
        if (navigator.clipboard && navigator.clipboard.write) {
          // 创建ClipboardItem，同时包含HTML和纯文本
          const clipboardItem = new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' })
          });
          await navigator.clipboard.write([clipboardItem]);
          createToast('已复制渲染后的内容到剪贴板');
        } else {
          // 回退方案：先尝试复制HTML，再复制纯文本
          try {
            // 使用execCommand复制HTML（已废弃，但仍有较好的浏览器兼容性）
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'fixed';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);
            
            const range = document.createRange();
            range.selectNode(tempDiv);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            
            if (document.execCommand('copy')) {
              createToast('已复制渲染后的内容到剪贴板');
            } else {
              throw new Error('execCommand copy failed');
            }
            
            window.getSelection().removeAllRanges();
            document.body.removeChild(tempDiv);
          } catch (htmlErr) {
            // 如果复制HTML失败，回退到复制纯文本
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
    }
  };

  // 返回首页
  const goHome = () => {
    window.location.pathname = '/';
  };

  return (
    <div className="md-editor-container">
      {/* 顶部导航栏 */}
      <nav className="md-navbar">
        <div className="md-navbar-left">
          {/* 返回首页按钮 - PC端放在最左侧 */}
          <div className="pc-only">
            <button className="md-home-btn" onClick={goHome} title="返回首页">
              🏠
            </button>
          </div>
          
          <div className="md-logo">
            <span>Markdown编辑器</span>
          </div>
          
          {/* PC端原始布局 */}
          <div className="pc-only">
            {/* 导入按钮 */}
            <button className="md-btn" onClick={() => document.getElementById('md-upload-input').click()}>
              📂 导入
            </button>
            <input
              type="file"
              id="md-upload-input"
              accept=".md,.markdown,.txt"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* 主题选择器 */}
            <div className="md-toolbar-top">
              <select className="md-select" value={theme} onChange={handleThemeChange} title="预览主题">
                <option value="default">默认样式</option>
                <option value="clean">简洁模式</option>
                <option value="modern">现代模式</option>
                <option value="book">书籍模式</option>
                <option value="docs">文档模式</option>
                <option value="tech_blue">科技蓝</option>
                <option value="dark_mode">暗黑模式</option>
                <option value="wechat">微信公众号</option>
                <option value="github">GitHub 风格</option>
                <option value="xiaohongshu">小红书</option>
              </select>
            </div>
          </div>
          
          {/* 移动端二级菜单按钮 - 只在移动端显示 */}
          <div className="mobile-only md-menu-container" ref={menuRef}>
            <button 
              className="md-btn menu-btn" 
              onClick={() => setShowMenu(!showMenu)}
              title="更多功能"
            >
              ⚙️ 菜单
            </button>
            
            {/* 下拉菜单 */}
            {showMenu && (
              <div className="md-dropdown-menu">
                {/* 导入功能 */}
                <div className="dropdown-item" onClick={() => document.getElementById('md-upload-input').click()}>
                  <span className="dropdown-icon">📂</span>
                  <span className="dropdown-text">导入文件</span>
                </div>
                
                {/* 主题选择器 */}
                <div className="dropdown-divider"></div>
                <div className="dropdown-section-title">预览主题</div>
                <select className="md-select dropdown-select" value={theme} onChange={handleThemeChange} title="预览主题">
                  <option value="default">默认样式</option>
                  <option value="clean">简洁模式</option>
                  <option value="modern">现代模式</option>
                  <option value="book">书籍模式</option>
                  <option value="docs">文档模式</option>
                  <option value="tech_blue">科技蓝</option>
                  <option value="dark_mode">暗黑模式</option>
                  <option value="wechat">微信公众号</option>
                  <option value="github">GitHub 风格</option>
                  <option value="neurapress">NeuraPress</option>
                  <option value="xiaohongshu">小红书</option>
                </select>
                
                {/* 导出功能 */}
                <div className="dropdown-divider"></div>
                <div className="dropdown-section-title">导出功能</div>
                <div className="dropdown-item" onClick={handleSaveAsWord} disabled={isConverting}>
                  <span className="dropdown-icon">{isConverting ? '⏳' : '📝'}</span>
                  <span className="dropdown-text">{isConverting ? '转换中...' : '转 Word'}</span>
                </div>
                <div className="dropdown-item" onClick={handleExportHtml}>
                  <span className="dropdown-icon">🌐</span>
                  <span className="dropdown-text">导出 HTML</span>
                </div>
                <div className="dropdown-item primary" onClick={handleCopy}>
                  <span className="dropdown-icon">❐</span>
                  <span className="dropdown-text">复制内容</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md-navbar-right">
          {/* 移动端返回首页按钮 */}
          <div className="mobile-only">
            <button className="md-home-btn" onClick={goHome} title="返回首页">
              🏠
            </button>
          </div>
          
          {/* PC端右侧按钮 */}
          <div className="pc-only">
            <button className="md-btn" onClick={handleSaveAsWord} disabled={isConverting}>
              {isConverting ? '⏳ 转换中...' : '📝 转 Word'}
            </button>
            <button className="md-btn" onClick={handleExportHtml}>
              🌐 导出 HTML
            </button>
            <button className="md-btn primary" onClick={handleCopy}>
              ❐ 复制
            </button>
          </div>
        </div>
      </nav>

      {/* 编辑器主体 */}
      <div className="md-main">
        {/* 左侧编辑区 */}
        <div className="md-pane editor">
          {/* 工具栏 */}
          <div className="md-editor-toolbar">
            <button className="toolbar-btn" onClick={() => insertSyntax('# ')} title="一级标题">H1</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('## ')} title="二级标题">H2</button>
            <button className="toolbar-btn" onClick={() => insertSyntax('### ')} title="三级标题">H3</button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('**', '**')} title="粗体"><Icons.Bold /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('*', '*')} title="斜体"><Icons.Italic /></button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('- ')} title="无序列表"><Icons.List /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('1. ')} title="有序列表"><Icons.OrderedList /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('- [ ] ')} title="任务列表"><Icons.TaskList /></button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('> ')} title="引用"><Icons.Quote /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('`', '`')} title="行内代码"><Icons.Code /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('```\n', '\n```')} title="代码块"><Icons.CodeBlock /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('$$ ', ' $$')} title="插入公式"><Icons.Sigma /></button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => insertSyntax('[]()', '')} title="插入链接"><Icons.Link /></button>
            <button className="toolbar-btn" onClick={() => document.getElementById('md-image-upload').click()} title="上传图片 (支持 Ctrl+V 粘贴)">
              {uploading ? '⏳' : <Icons.Image />}
            </button>
            <input
              type="file"
              id="md-image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button className="toolbar-btn" onClick={() => insertSyntax('| | |\n|---|---|\n| | |', '')} title="插入表格"><Icons.Table /></button>
            <button className="toolbar-btn" onClick={() => insertSyntax('\n---\n')} title="分割线"><Icons.Hr /></button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-btn" onClick={() => setShowImageModal(true)} title="配置 GitHub 图床"><Icons.Settings /></button>
          </div>
          
          <textarea
            ref={textareaRef}
            className="md-textarea"
            value={markdownText}
            onChange={handleTextChange}
            placeholder="在此输入 Markdown 内容..."
          />
        </div>

        {/* 右侧预览区 */}
        <div className="md-pane preview">
          <div className="preview-header">
            <div className="preview-controls-left">
              <button onClick={() => handleScaleChange('minus')} className="icon-btn" title="缩小">➖</button>
              <span>{previewScale}%</span>
              <button onClick={() => handleScaleChange('plus')} className="icon-btn" title="放大">➕</button>
            </div>
            <div className="preview-controls-right">
              <select value={previewDevice} onChange={handleDeviceChange} className="device-select">
                <option value="mobile-s">小屏 (320px)</option>
                <option value="mobile-m">中屏 (375px)</option>
                <option value="tablet">平板 (768px)</option>
                <option value="full">全屏</option>
              </select>
            </div>
          </div>
          <div className="preview-content-wrapper">
            {htmlPreview ? (
              <div 
                className={`preview-device-container ${previewDevice}`}
                style={{
                  transform: `scale(${previewScale / 100})`,
                }}
              >
                <iframe
                  title="HTML Preview"
                  srcDoc={htmlPreview}
                  className="preview-iframe"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'white',
                  }}
                />
              </div>
            ) : (
              <div className="loading-overlay">预览加载中...</div>
            )}
          </div>
        </div>
      </div>
      <footer className="md-footer">
        <p>智能数据处理平台 © 2026 | 基于 FastAPI 和 React 构建</p>
      </footer>

      {/* 图床配置模态框 */}
      {showImageModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowImageModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>GitHub 图床配置</h3>
              <button className="close-btn" onClick={() => setShowImageModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Token (必填)</label>
                <input
                  type="password"
                  name="token"
                  value={githubConfig.token}
                  onChange={handleGithubConfigChange}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <small>请在 GitHub Settings {'>'} Developer settings 生成 Personal access token</small>
              </div>
              <div className="form-group">
                <label>Repo (必填)</label>
                <input
                  type="text"
                  name="repo"
                  value={githubConfig.repo}
                  onChange={handleGithubConfigChange}
                  placeholder="username/repo"
                />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={githubConfig.branch}
                  onChange={handleGithubConfigChange}
                  placeholder="main"
                />
              </div>
              <div className="form-group">
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
            <div className="modal-footer">
              <button className="md-btn primary" onClick={() => setShowImageModal(false)}>保存配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditorPage;
