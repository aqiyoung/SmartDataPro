#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
验证数字序号修复是否有效
"""

import sys
import os

# 添加项目路径
sys.path.append('backend')

from src.converters.web_to_docx import WebToDocxConverter

def test_fix_verification():
    """测试修复是否有效"""
    print("=== 验证数字序号修复 ===")
    
    # 创建测试HTML
    test_html = """
    <html>
    <body>
        <h1>测试文档</h1>
        
        <p>普通段落文本，没有编号。</p>
        
        <p>1. 这个段落开头有编号，应该被移除。</p>
        <p>2. 这个段落也有编号，同样需要移除。</p>
        
        <ol>
            <li>1. 有序列表第一项</li>
            <li>2. 有序列表第二项</li>
            <li>3. 有序列表第三项</li>
        </ol>
        
        <ul>
            <li>• 无序列表第一项</li>
            <li>• 无序列表第二项</li>
        </ul>
        
        <div>
            <p>3. 嵌套在div中的带编号段落</p>
            <p>4. 另一个带编号段落</p>
        </div>
        
        <ol type="a">
            <li>a. 字母编号第一项</li>
            <li>b. 字母编号第二项</li>
        </ol>
        
        <ol type="i">
            <li>i. 罗马数字第一项</li>
            <li>ii. 罗马数字第二项</li>
        </ol>
    </body>
    </html>
    """
    
    # 创建转换器实例
    converter = WebToDocxConverter(url="http://test.com", output_dir=".")
    converter.html_content = test_html
    
    # 测试解析HTML（会触发预处理）
    print("\n1. 测试HTML解析和预处理...")
    if converter._parse_html():
        print("✓ HTML解析成功")
        
        # 检查预处理效果
        print("\n2. 检查预处理效果...")
        
        # 检查所有列表项
        all_li = converter.soup.find_all("li")
        print(f"   找到 {len(all_li)} 个列表项")
        for i, li in enumerate(all_li[:5]):  # 只检查前5个
            text = li.get_text(strip=True)
            print(f"   列表项 {i+1}: '{text}'")
        
        # 检查所有段落
        all_p = converter.soup.find_all("p")
        print(f"\n   找到 {len(all_p)} 个段落")
        for i, p in enumerate(all_p):
            text = p.get_text(strip=True)
            print(f"   段落 {i+1}: '{text}'")
        
        # 测试文档生成
        print("\n3. 测试文档生成...")
        converter.doc = converter._create_document()
        converter._process_block_element(converter.soup.body)
        
        # 保存测试文档
        test_output = "test_fix_verification_result.docx"
        converter._save_document(test_output)
        print(f"\n✓ 测试完成！生成的文档: {test_output}")
        print("请打开文档查看数字序号是否已被彻底移除。")
    else:
        print("✗ HTML解析失败")

if __name__ == "__main__":
    test_fix_verification()
