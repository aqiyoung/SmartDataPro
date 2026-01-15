#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试微信公众号文章转换修复
"""

import os
import sys
from src.converters.web_to_docx import WebToDocxConverter

def test_wechat_article():
    """测试微信公众号文章转换"""
    # 测试URL
    url = "https://mp.weixin.qq.com/s/5pSmQki-8K2W19SorzNm4g"
    print(f"测试URL: {url}")
    
    # 创建转换器实例
    converter = WebToDocxConverter(url, output_dir="test_output")
    
    # 执行转换
    if converter._download_html():
        print("HTML下载成功")
        
        if converter._parse_html():
            print(f"HTML解析成功，标题: {converter.title}")
            
            # 清理并打印前1000个字符的内容，查看是否还有代码字符
            if converter.content:
                content_text = converter.content.get_text()
                cleaned_text = converter._clean_text(content_text)
                print("\n清理后的前1000字符:")
                print(cleaned_text[:1000])
                
                # 检查是否还有代码字符
                import re
                code_chars = re.findall(r'[{};|`~^]|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}', cleaned_text)
                if code_chars:
                    print(f"\n仍发现代码字符: {set(code_chars)}")
                else:
                    print("\n未发现代码字符，修复成功!")
            
            if converter._create_word_document():
                # 保存文档
                output_filename = f"test_wechat_fix_{converter.title}.docx"
                output_path = os.path.join("test_output", output_filename)
                converter.doc.save(output_path)
                print(f"\n文档保存成功: {output_path}")
                return True
            else:
                print("创建Word文档失败")
        else:
            print("HTML解析失败")
    else:
        print("HTML下载失败")
    
    return False

if __name__ == "__main__":
    test_wechat_article()