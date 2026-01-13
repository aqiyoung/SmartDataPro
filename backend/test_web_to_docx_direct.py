#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
直接测试网页转Word功能
"""

import os
import sys
import traceback
from src.converters.web_to_docx import WebToDocxConverter


def main():
    """主函数"""
    # 测试URL
    url = "https://www.example.com"
    print(f"正在转换网页: {url}")
    
    try:
        # 创建转换器实例
        converter = WebToDocxConverter(url, timeout=5)  # 缩短超时时间
        
        # 分步执行转换，以便更好地追踪问题
        print("\n=== 步骤1: 下载HTML ===")
        success = converter._download_html()
        print(f"HTML下载结果: {success}")
        
        if success:
            print(f"HTML内容长度: {len(converter.html_content) if converter.html_content else 0} 字符")
        
        print("\n=== 步骤2: 解析HTML ===")
        success = converter._parse_html()
        print(f"HTML解析结果: {success}")
        print(f"标题: {converter.title}")
        print(f"内容存在: {converter.content is not None}")
        
        print("\n=== 步骤3: 下载图片 ===")
        success = converter._download_all_images()
        print(f"图片下载结果: {success}")
        print(f"下载的图片数量: {len(converter.downloaded_images)}")
        
        print("\n=== 步骤4: 创建Word文档 ===")
        success = converter._create_word_document()
        print(f"Word文档创建结果: {success}")
        
        print("\n=== 步骤5: 保存Word文档 ===")
        output_file = os.path.join("output", "test_output.docx")
        success = converter._save_document(output_file)
        print(f"Word文档保存结果: {success}")
        
        if success:
            print(f"\n=== 转换成功！ ===")
            print(f"输出文件: {output_file}")
            print(f"文件大小: {os.path.getsize(output_file)} 字节")
        else:
            print(f"\n=== 转换失败！ ===")
            
    except Exception as e:
        print(f"\n=== 转换过程中发生异常 ===")
        print(f"异常类型: {type(e).__name__}")
        print(f"异常信息: {str(e)}")
        print(f"堆栈跟踪:")
        traceback.print_exc()


if __name__ == "__main__":
    main()