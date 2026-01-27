// ===========================================================================
// ========================= md 项目扩展配置 ===========================
// ===========================================================================
// 说明：基于GitHub项目 https://github.com/aqiyoung/md 扩展实现
// ===========================================================================

// 定义marked扩展

// Alert 扩展
export function markedAlert() {
  return {
    name: 'markedAlert',
    level: 'block',
    start(src) {
      return src.match(/^\s*!!!\s*([\w-]+)\s*(.*?)\s*$/)?.index;
    },
    tokenizer(src, tokens) {
      const rule = /^\s*!!!\s*([\w-]+)\s*(.*?)\s*$/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'alert',
          raw: match[0],
          alertType: match[1],
          title: match[2],
          tokens: [],
          level: 'block'
        };
        
        // 解析alert内容
        const rest = src.substring(match[0].length);
        let content = '';
        let i = 0;
        let lineStart = 0;
        
        while (i < rest.length) {
          if (rest[i] === '\n') {
            const nextLine = rest.substring(i + 1);
            if (nextLine.match(/^\s*!!!/)) {
              break;
            }
            lineStart = i + 1;
          }
          i++;
        }
        
        content = rest.substring(0, i).trim();
        token.tokens = this.lexer.blockTokens(content, tokens);
        token.raw += content;
        
        return token;
      }
      return null;
    },
    renderer(token) {
      const alertClass = `alert alert-${token.alertType}`;
      const title = token.title ? `<div class="alert-title">${token.title}</div>` : '';
      return `<div class="${alertClass}">${title}${this.parser.parse(token.tokens)}</div>`;
    }
  };
}

// Footnotes 扩展
export function markedFootnotes() {
  return {
    name: 'markedFootnotes',
    level: 'block',
    start(src) {
      return src.match(/^\[\^(\w+)\]:\s/)?.index;
    },
    tokenizer(src, tokens) {
      const rule = /^\[\^(\w+)\]:\s/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'footnoteDefinition',
          raw: match[0],
          id: match[1],
          tokens: [],
          level: 'block'
        };
        
        // 解析脚注内容
        const rest = src.substring(match[0].length);
        let content = '';
        let i = 0;
        let lineStart = 0;
        let isParagraph = true;
        
        while (i < rest.length) {
          if (rest[i] === '\n') {
            const nextLine = rest.substring(i + 1);
            if (nextLine.match(/^\[\^(\w+)\]:\s/)) {
              break;
            }
            lineStart = i + 1;
          }
          i++;
        }
        
        content = rest.substring(0, i).trim();
        token.tokens = this.lexer.blockTokens(content, tokens);
        token.raw += content;
        
        return token;
      }
      return null;
    },
    renderer(token) {
      return `<li id="footnote-${token.id}" class="footnote-item">${this.parser.parse(token.tokens)}</li>`;
    },
    inlineRules: [
      {
        name: 'footnoteReference',
        regex: /\[\^(\w+)\]/,
        tokenizer(match, tokens) {
          return {
            type: 'footnoteReference',
            raw: match[0],
            id: match[1]
          };
        },
        renderer(token) {
          return `<sup class="footnote-ref"><a href="#footnote-${token.id}">${token.id}</a></sup>`;
        }
      }
    ]
  };
}

// Markup 扩展
export function markedMarkup() {
  return {
    name: 'markedMarkup',
    level: 'inline',
    inlineRules: [
      {
        name: 'markedStrong',
        regex: /\*{3}([\s\S]+?)\*{3}/,
        tokenizer(match, tokens) {
          return {
            type: 'markedStrong',
            raw: match[0],
            text: match[1]
          };
        },
        renderer(token) {
          return `<strong>${this.parser.parseInline(token.text)}</strong>`;
        }
      },
      {
        name: 'markedEm',
        regex: /\*{1,2}([\s\S]+?)\*{1,2}/,
        tokenizer(match, tokens) {
          return {
            type: 'markedEm',
            raw: match[0],
            text: match[1]
          };
        },
        renderer(token) {
          return `<em>${this.parser.parseInline(token.text)}</em>`;
        }
      },
      {
        name: 'markedUnderline',
        regex: /__(.+?)__/,
        tokenizer(match, tokens) {
          return {
            type: 'markedUnderline',
            raw: match[0],
            text: match[1]
          };
        },
        renderer(token) {
          return `<u>${this.parser.parseInline(token.text)}</u>`;
        }
      },
      {
        name: 'markedStrikethrough',
        regex: /~~(.+?)~~/,
        tokenizer(match, tokens) {
          return {
            type: 'markedStrikethrough',
            raw: match[0],
            text: match[1]
          };
        },
        renderer(token) {
          return `<del>${this.parser.parseInline(token.text)}</del>`;
        }
      }
    ]
  };
}

// PlantUML 扩展
export function markedPlantUML() {
  return {
    name: 'markedPlantUML',
    level: 'block',
    start(src) {
      return src.match(/^\s*@startuml\s*$/)?.index;
    },
    tokenizer(src, tokens) {
      const rule = /^\s*@startuml\s*$/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'plantuml',
          raw: match[0],
          content: '',
          level: 'block'
        };
        
        const rest = src.substring(match[0].length);
        const endMatch = rest.match(/^[\s\S]*?@enduml\s*$/m);
        if (endMatch) {
          token.content = endMatch[0].substring(0, endMatch[0].length - 7).trim();
          token.raw += endMatch[0];
        }
        
        return token;
      }
      return null;
    },
    renderer(token) {
      const encoded = encodeURIComponent(token.content);
      const url = `https://www.plantuml.com/plantuml/svg/${encoded}`;
      return `<div class="plantuml-container"><img src="${url}" alt="PlantUML diagram" class="plantuml" /></div>`;
    }
  };
}

// Ruby 扩展
export function markedRuby() {
  return {
    name: 'markedRuby',
    level: 'inline',
    inlineRules: [
      {
        name: 'markedRuby',
        regex: /\[([^\]]+)\]\{([^\}]+)\}/,
        tokenizer(match, tokens) {
          return {
            type: 'markedRuby',
            raw: match[0],
            text: match[1],
            ruby: match[2]
          };
        },
        renderer(token) {
          return `<ruby>${this.parser.parseInline(token.text)}<rt>${this.parser.parseInline(token.ruby)}</rt></ruby>`;
        }
      }
    ]
  };
}

// Slider 扩展
export function markedSlider() {
  return {
    name: 'markedSlider',
    level: 'block',
    start(src) {
      return src.match(/^\s*\|\|\|\s*$/)?.index;
    },
    tokenizer(src, tokens) {
      const rule = /^\s*\|\|\|\s*$/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'slider',
          raw: match[0],
          items: [],
          level: 'block'
        };
        
        const rest = src.substring(match[0].length);
        let i = 0;
        let itemContent = '';
        let items = [];
        
        while (i < rest.length) {
          if (rest[i] === '\n') {
            const nextLine = rest.substring(i + 1);
            if (nextLine.match(/^\s*\|\|\|\s*$/)) {
              if (itemContent.trim()) {
                items.push(itemContent.trim());
                itemContent = '';
              }
              i += nextLine.match(/^\s*\|\|\|\s*/)[0].length + 1;
              continue;
            }
            if (nextLine.match(/^\s*\|\|\|\s*$/)) {
              break;
            }
          }
          itemContent += rest[i];
          i++;
        }
        
        if (itemContent.trim()) {
          items.push(itemContent.trim());
        }
        
        token.items = items;
        token.raw += rest.substring(0, i);
        
        return token;
      }
      return null;
    },
    renderer(token) {
      const itemsHtml = token.items.map(item => {
        return `<div class="slider-item">${this.parser.parse(item)}</div>`;
      }).join('');
      return `<div class="slider-container">${itemsHtml}</div>`;
    }
  };
}

// TOC 扩展
export function markedToc() {
  return {
    name: 'markedToc',
    level: 'block',
    start(src) {
      return src.match(/^\[\[toc\]\]\s*$/i)?.index;
    },
    tokenizer(src, tokens) {
      const rule = /^\[\[toc\]\]\s*$/i;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'toc',
          raw: match[0],
          level: 'block'
        };
      }
      return null;
    },
    renderer(token) {
      // 在实际使用中，这里需要访问文档的所有标题
      // 为了简化，我们返回一个占位符，实际实现需要更复杂的逻辑
      return `<div class="toc-container">
        <h2 class="toc-title">目录</h2>
        <ul class="toc-list">
          <li class="toc-item"><a href="#h1" class="toc-link">一级标题</a></li>
          <li class="toc-item"><a href="#h2" class="toc-link">二级标题</a></li>
          <li class="toc-item"><a href="#h3" class="toc-link">三级标题</a></li>
        </ul>
      </div>`;
    }
  };
}