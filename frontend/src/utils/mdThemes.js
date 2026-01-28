// ===========================================================================
// ========================= md 项目主题配置 ===========================
// ===========================================================================
// 说明：基于GitHub项目 https://github.com/aqiyoung/md 主题配置
// ===========================================================================

export const THEMES = {
  default: {
    name: "默认样式",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#333'
      },
      block: {
        h1: {
          'font-size': '2em',
          'color': '#2c3e50',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em',
          'border-bottom': '2px solid #333333',
          'padding-bottom': '0.3em'
        },
        h2: {
          'font-size': '1.5em',
          'color': '#2c3e50',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em',
          'border-bottom': '1px solid #eee',
          'padding-bottom': '0.3em'
        },
        p: {
          'margin': '1em 0'
        },
        blockquote: {
          'border-left': '4px solid #333333',
          'padding-left': '1em',
          'margin': '1em 0',
          'color': '#666',
          'background-color': '#f8f9fa'
        },
        pre: {
          'background-color': '#f1f1f1',
          'padding': '1em',
          'border-radius': '5px',
          'overflow-x': 'auto'
        },
        code: {
          'background-color': '#f1f1f1',
          'padding': '0.2em 0.4em',
          'border-radius': '3px',
          'font-family': '"Courier New", Courier, monospace'
        },
        table: {
          'border-collapse': 'collapse',
          'width': '100%',
          'margin': '1em 0'
        },
        th: {
          'background-color': '#f2f2f2',
          'border': '1px solid #ddd',
          'padding': '8px',
          'text-align': 'left'
        },
        td: {
          'border': '1px solid #ddd',
          'padding': '8px',
          'text-align': 'left'
        }
      }
    }
  },
  clean: {
    name: "简洁模式",
    css: {
      base: {
        'font-family': '"Helvetica Neue", Arial, sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#333',
        'background-color': '#ffffff'
      },
      block: {
        h1: {
          'font-size': '2.2em',
          'color': '#000',
          'margin-top': '1.8em',
          'margin-bottom': '0.6em',
          'border-bottom': '1px solid #e5e5e5',
          'padding-bottom': '0.3em'
        },
        h2: {
          'font-size': '1.8em',
          'color': '#000',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em'
        },
        p: {
          'margin': '1.2em 0'
        },
        blockquote: {
          'border-left': '3px solid #e5e5e5',
          'padding-left': '1em',
          'margin': '1em 0',
          'color': '#666',
          'font-style': 'italic'
        },
        pre: {
          'background-color': '#f5f5f5',
          'padding': '1em',
          'border-radius': '4px',
          'overflow-x': 'auto'
        },
        code: {
          'background-color': '#f5f5f5',
          'padding': '0.2em 0.4em',
          'border-radius': '3px',
          'font-family': '"Courier New", Courier, monospace'
        }
      }
    }
  },
  modern: {
    name: "现代模式",
    css: {
      base: {
        'font-family': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'font-size': '16px',
        'line-height': '1.7',
        'color': '#2d3748',
        'background-color': '#f7fafc'
      },
      block: {
        h1: {
          'font-size': '2.5em',
          'color': '#1a202c',
          'margin-top': '1.8em',
          'margin-bottom': '0.8em',
          'color': '#333333'
        },
        h2: {
          'font-size': '2em',
          'color': '#1a202c',
          'margin-top': '1.5em',
          'margin-bottom': '0.8em',
          'border-bottom': '2px solid #333333',
          'padding-bottom': '0.5em'
        },
        p: {
          'margin': '1.5em 0'
        },
        blockquote: {
          'border-left': '4px solid #333333',
          'padding': '1em 1.5em',
          'margin': '1.5em 0',
          'color': '#4a5568',
          'background-color': '#f5f5f5',
          'border-radius': '0 6px 6px 0'
        },
        pre: {
          'background-color': '#edf2f7',
          'padding': '1.5em',
          'border-radius': '8px',
          'overflow-x': 'auto'
        },
        code: {
          'background-color': '#edf2f7',
          'padding': '0.2em 0.5em',
          'border-radius': '6px',
          'font-family': '"Fira Code", "Courier New", Courier, monospace'
        }
      }
    }
  },
  book: {
    name: "书籍模式",
    css: {
      base: {
        'font-family': '"Georgia", "Times New Roman", Times, serif',
        'font-size': '16px',
        'line-height': '1.8',
        'color': '#333',
        'background-color': '#faf9f6'
      },
      block: {
        h1: {
          'font-size': '2.5em',
          'color': '#222',
          'text-align': 'center',
          'margin-bottom': '1.5em'
        },
        h2: {
          'font-size': '2em',
          'color': '#222',
          'margin-top': '2.5em',
          'margin-bottom': '1em'
        },
        p: {
          'margin': '1.5em 0',
          'text-align': 'justify'
        },
        blockquote: {
          'border-left': '3px solid #ccc',
          'padding': '1em 1.5em',
          'margin': '2em 0',
          'color': '#555',
          'font-style': 'italic'
        },
        pre: {
          'background-color': '#f0f0f0',
          'padding': '1.2em',
          'border-radius': '5px',
          'overflow-x': 'auto',
          'margin': '2em 0'
        },
        code: {
          'background-color': '#f0f0f0',
          'padding': '0.2em 0.4em',
          'border-radius': '3px',
          'font-family': '"Courier New", Courier, monospace'
        }
      }
    }
  },
  docs: {
    name: "文档模式",
    css: {
      base: {
        'font-family': '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#24292f',
        'background-color': '#ffffff'
      },
      block: {
        h1: {
          'font-size': '2em',
          'color': '#24292f',
          'padding-bottom': '0.3em',
          'border-bottom': '1px solid #d0d7de'
        },
        h2: {
          'font-size': '1.5em',
          'color': '#24292f',
          'padding-bottom': '0.3em',
          'border-bottom': '1px solid #d0d7de'
        },
        p: {
          'margin-top': '0',
          'margin-bottom': '16px'
        },
        blockquote: {
          'padding': '0 1em',
          'color': '#57606a',
          'border-left': '0.25em solid #d0d7de',
          'margin': '0 0 16px 0'
        },
        pre: {
          'padding': '16px',
          'overflow': 'auto',
          'font-size': '85%',
          'line-height': '1.45',
          'background-color': '#f6f8fa',
          'border-radius': '6px',
          'margin-bottom': '16px'
        },
        code: {
          'padding': '0.2em 0.4em',
          'margin': '0',
          'font-size': '85%',
          'background-color': '#afb8c133',
          'border-radius': '6px',
          'font-family': 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace'
        }
      }
    }
  },
  tech_blue: {
    name: "科技蓝",
    css: {
      base: {
        'font-family': '"Roboto", "Segoe UI", sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#333',
        'background-color': '#f0f4f8'
      },
      block: {
        h1: {
          'font-size': '2.2em',
          'color': '#0d47a1',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em',
          'border-bottom': '2px solid #0d47a1',
          'padding-bottom': '0.3em'
        },
        h2: {
          'font-size': '1.8em',
          'color': '#0d47a1',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em',
          'border-bottom': '1px solid #bbdefb',
          'padding-bottom': '0.3em'
        },
        p: {
          'margin': '1em 0'
        },
        blockquote: {
          'border-left': '4px solid #1976d2',
          'padding-left': '1em',
          'background-color': '#e3f2fd',
          'padding': '1em',
          'border-radius': '0 4px 4px 0',
          'color': '#546e7a',
          'margin': '1.5em 0'
        },
        pre: {
          'background-color': '#263238',
          'color': '#eceff1',
          'padding': '1.2em',
          'border-radius': '8px',
          'overflow-x': 'auto',
          'box-shadow': '0 4px 6px rgba(0,0,0,0.1)'
        },
        code: {
          'font-family': '"Consolas", "Monaco", monospace',
          'background-color': '#e3f2fd',
          'color': '#0d47a1',
          'padding': '0.2em 0.4em',
          'border-radius': '4px',
          'font-size': '0.9em'
        }
      }
    }
  },
  dark_mode: {
    name: "暗黑模式",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#e0e0e0',
        'background-color': '#1e1e1e'
      },
      block: {
        h1: {
          'font-size': '2.2em',
          'color': '#90caf9',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em',
          'border-bottom': '1px solid #424242',
          'padding-bottom': '0.3em'
        },
        h2: {
          'font-size': '1.8em',
          'color': '#90caf9',
          'margin-top': '1.5em',
          'margin-bottom': '0.5em'
        },
        p: {
          'margin': '1em 0'
        },
        blockquote: {
          'border-left': '4px solid #64b5f6',
          'padding-left': '1em',
          'color': '#bdbdbd',
          'background-color': '#263238',
          'padding': '1em',
          'border-radius': '4px',
          'margin': '1.5em 0'
        },
        pre: {
          'background-color': '#121212',
          'padding': '1.2em',
          'border-radius': '8px',
          'border': '1px solid #333',
          'overflow-x': 'auto'
        },
        code: {
          'font-family': '"Fira Code", monospace',
          'background-color': '#333',
          'padding': '0.2em 0.4em',
          'border-radius': '4px',
          'color': '#ffcc80'
        }
      }
    }
  },
  github: {
    name: "GitHub 风格",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        'font-size': '16px',
        'line-height': '1.5',
        'word-wrap': 'break-word',
        'color': '#24292f',
        'background-color': '#ffffff'
      },
      block: {
        h1: {
          'font-size': '2em',
          'color': '#24292f',
          'margin-top': '24px',
          'margin-bottom': '16px',
          'font-weight': '600',
          'line-height': '1.25',
          'padding-bottom': '0.3em',
          'border-bottom': '1px solid #d0d7de'
        },
        h2: {
          'font-size': '1.5em',
          'color': '#24292f',
          'margin-top': '24px',
          'margin-bottom': '16px',
          'font-weight': '600',
          'line-height': '1.25',
          'padding-bottom': '0.3em',
          'border-bottom': '1px solid #d0d7de'
        },
        p: {
          'margin-top': '0',
          'margin-bottom': '16px'
        },
        blockquote: {
          'padding': '0 1em',
          'color': '#57606a',
          'border-left': '0.25em solid #d0d7de',
          'margin': '0 0 16px 0'
        },
        pre: {
          'padding': '16px',
          'overflow': 'auto',
          'font-size': '85%',
          'line-height': '1.45',
          'background-color': '#f6f8fa',
          'border-radius': '6px',
          'margin-bottom': '16px'
        },
        code: {
          'padding': '0.2em 0.4em',
          'margin': '0',
          'font-size': '85%',
          'background-color': '#afb8c133',
          'border-radius': '6px',
          'font-family': 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace'
        }
      }
    }
  },
  wechat: {
    name: "微信公众号",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
        'font-size': '16px',
        'line-height': '1.6',
        'color': '#333',
        'background-color': '#fff',
        'text-align': 'justify'
      },
      block: {
        h1: {
          'font-size': '22px',
          'color': '#333',
          'text-align': 'center',
          'margin-bottom': '16px',
          'border-bottom': '2px solid #07c160',
          'padding-bottom': '10px',
          'font-weight': 'bold'
        },
        h2: {
          'font-size': '18px',
          'color': '#333',
          'border-left': '4px solid #07c160',
          'padding-left': '10px',
          'margin-top': '2em',
          'font-weight': 'bold'
        },
        p: {
          'margin-bottom': '1.2em',
          'letter-spacing': '0.05em'
        },
        blockquote: {
          'border-left': '4px solid #07c160',
          'background-color': '#f8f8f8',
          'padding': '15px',
          'margin': '1.5em 0',
          'color': '#555',
          'border-radius': '4px',
          'font-size': '15px'
        },
        pre: {
          'background': '#f8f8f8',
          'color': '#333',
          'padding': '15px',
          'border-radius': '8px',
          'overflow-x': 'auto',
          'position': 'relative',
          'margin': '1.5em 0',
          'font-family': '"Fira Code", Consolas, monospace',
          'line-height': '1.5',
          'box-shadow': '0 4px 12px rgba(0,0,0,0.1)'
        },
        code: {
          'background-color': '#f0f0f0',
          'padding': '2px 4px',
          'border-radius': '3px',
          'color': '#d63200',
          'font-size': '14px',
          'font-family': 'Consolas, monospace'
        }
      }
    }
  },
  xiaohongshu: {
    name: "小红书",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, "Helvetica Neue", Arial, sans-serif',
        'line-height': '1.8',
        'word-wrap': 'break-word',
        'overflow-wrap': 'break-word',
        'color': '#333',
        'background-color': '#fff',
        'text-align': 'left'
      },
      block: {
        h1: {
          'font-size': '24px',
          'font-weight': 'bold',
          'margin-bottom': '16px',
          'color': '#333',
          'text-align': 'center'
        },
        h2: {
          'font-size': '20px',
          'font-weight': 'bold',
          'margin': '20px 0 12px 0',
          'color': '#444'
        },
        p: {
          'margin-bottom': '12px',
          'color': '#222'
        },
        blockquote: {
          'margin': '16px 0',
          'padding': '12px 16px',
          'background-color': '#f8f9fa',
          'border-left': '4px solid #e91e63',
          'border-radius': '4px',
          'font-style': 'italic',
          'color': '#666'
        },
        pre: {
          'background-color': '#f8f9fa',
          'padding': '16px',
          'border-radius': '8px',
          'overflow-x': 'auto',
          'margin': '16px 0',
          'border': '1px solid #e9ecef'
        },
        code: {
          'background-color': '#f1f3f4',
          'padding': '2px 6px',
          'border-radius': '4px',
          'font-family': '"Courier New", monospace',
          'font-size': '0.9em',
          'color': '#d63384'
        }
      }
    }
  },
  // doocs/md 风格主题
  doocs_classic: {
    name: "Doocs 经典",
    css: {
      base: {
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
        'font-size': '16px',
        'line-height': '1.8',
        'color': '#333',
        'background-color': '#ffffff',
        'text-align': 'justify'
      },
      block: {
        h1: {
          'font-size': '28px',
          'font-weight': 'bold',
          'margin': '48px 0 24px 0',
          'color': '#2c3e50',
          'text-align': 'center',
          'padding-bottom': '12px',
          'border-bottom': '2px solid #eaecef',
          'line-height': '1.3'
        },
        h2: {
          'font-size': '24px',
          'font-weight': 'bold',
          'margin': '36px 0 18px 0',
          'color': '#34495e',
          'padding-bottom': '8px',
          'border-bottom': '1px solid #eaecef',
          'line-height': '1.3'
        },
        h3: {
          'font-size': '20px',
          'font-weight': 'bold',
          'margin': '32px 0 16px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h4: {
          'font-size': '18px',
          'font-weight': 'bold',
          'margin': '28px 0 14px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h5: {
          'font-size': '16px',
          'font-weight': 'bold',
          'margin': '24px 0 12px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h6: {
          'font-size': '14px',
          'font-weight': 'bold',
          'margin': '20px 0 10px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        p: {
          'margin': '16px 0',
          'text-indent': '2em',
          'line-height': '1.8'
        },
        blockquote: {
          'margin': '20px 0',
          'padding': '15px 20px',
          'background-color': '#f8f9fa',
          'border-left': '4px solid #333333',
          'border-radius': '4px',
          'color': '#666',
          'font-size': '15px'
        },
        pre: {
          'margin': '20px 0',
          'padding': '16px',
          'background-color': '#f6f8fa',
          'border-radius': '6px',
          'overflow-x': 'auto',
          'font-size': '14px',
          'line-height': '1.5',
          'box-shadow': '0 2px 4px rgba(0,0,0,0.1)'
        },
        code: {
          'padding': '0.2em 0.4em',
          'margin': '0',
          'font-size': '0.9em',
          'background-color': '#f1f3f4',
          'border-radius': '3px',
          'font-family': 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace'
        },
        table: {
          'width': '100%',
          'border-collapse': 'collapse',
          'margin': '20px 0',
          'font-size': '14px'
        },
        th: {
          'background-color': '#f8f9fa',
          'border': '1px solid #e0e0e0',
          'padding': '10px',
          'text-align': 'left',
          'font-weight': 'bold'
        },
        td: {
          'border': '1px solid #e0e0e0',
          'padding': '10px',
          'text-align': 'left'
        },
        img: {
          'max-width': '100%',
          'height': 'auto',
          'border-radius': '4px',
          'margin': '16px 0'
        }
      }
    }
  },
  doocs_elegant: {
    name: "Doocs 优雅",
    css: {
      base: {
        'font-family': '"Georgia", "Times New Roman", "Microsoft YaHei", serif',
        'font-size': '16px',
        'line-height': '1.9',
        'color': '#333',
        'background-color': '#faf9f6',
        'text-align': 'justify'
      },
      block: {
        h1: {
          'font-size': '30px',
          'font-weight': 'bold',
          'margin': '52px 0 26px 0',
          'color': '#2c3e50',
          'text-align': 'center',
          'font-style': 'italic',
          'padding-bottom': '14px',
          'border-bottom': '2px solid #eaecef',
          'line-height': '1.3'
        },
        h2: {
          'font-size': '26px',
          'font-weight': 'bold',
          'margin': '40px 0 20px 0',
          'color': '#34495e',
          'border-bottom': '1px solid #eaecef',
          'padding-bottom': '10px',
          'line-height': '1.3'
        },
        h3: {
          'font-size': '22px',
          'font-weight': 'bold',
          'margin': '36px 0 18px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h4: {
          'font-size': '20px',
          'font-weight': 'bold',
          'margin': '32px 0 16px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h5: {
          'font-size': '18px',
          'font-weight': 'bold',
          'margin': '28px 0 14px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        h6: {
          'font-size': '16px',
          'font-weight': 'bold',
          'margin': '24px 0 12px 0',
          'color': '#34495e',
          'line-height': '1.3'
        },
        p: {
          'margin': '18px 0',
          'text-indent': '2em',
          'line-height': '1.9'
        },
        blockquote: {
          'margin': '24px 0',
          'padding': '20px 24px',
          'background-color': '#f5f5f5',
          'border-left': '4px solid #95a5a6',
          'border-radius': '4px',
          'color': '#7f8c8d',
          'font-style': 'italic',
          'font-size': '15px'
        },
        pre: {
          'margin': '24px 0',
          'padding': '18px',
          'background-color': '#ecf0f1',
          'border-radius': '6px',
          'overflow-x': 'auto',
          'font-size': '14px',
          'line-height': '1.5'
        },
        code: {
          'padding': '0.2em 0.4em',
          'margin': '0',
          'font-size': '0.9em',
          'background-color': '#ecf0f1',
          'border-radius': '3px',
          'font-family': '"Courier New", Courier, monospace'
        }
      }
    }
  }
};