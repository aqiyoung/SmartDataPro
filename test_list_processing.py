#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试列表编号处理逻辑
"""

import sys
import os
from bs4 import BeautifulSoup

# 添加项目路径
sys.path.append('backend')

from src.converters.web_to_docx import WebToDocxConverter

def test_list_numbering_removal():
    """测试列表编号移除功能"""
    print("测试列表编号移除功能...")
    
    # 创建测试HTML
    test_html = """
    <html>
    <body>
        <h1>测试列表</h1>
        
        <!-- 测试有序列表 -->
        <ol>
            <li>1. 第一项内容</li>
            <li>2. 第二项内容</li>
            <li>3. 第三项内容</li>
        </ol>
        
        <!-- 测试嵌套有序列表 -->
        <ol>
            <li>1. 第一项
                <ol>
                    <li>1.1. 嵌套第一项</li>
                    <li>1.2. 嵌套第二项</li>
                </ol>
            </li>
            <li>2. 第二项
                <ol>
                    <li>2.1. 嵌套第一项</li>
                    <li>2.2. 嵌套第二项</li>
                </ol>
            </li>
        </ol>
        
        <!-- 测试不同编号格式 -->
        <ol type="a">
            <li>a. 字母编号第一项</li>
            <li>b. 字母编号第二项</li>
        </ol>
        
        <ol type="i">
            <li>i. 罗马数字第一项</li>
            <li>ii. 罗马数字第二项</li>
        </ol>
        
        <!-- 测试无序列表 -->
        <ul>
            <li>• 无序列表第一项</li>
            <li>• 无序列表第二项</li>
        </ul>
        
        <!-- 测试混合内容 -->
        <ol>
            <li>1. <strong>粗体内容</strong> 和 <em>斜体内容</em></li>
            <li>2. 包含 <a href="#">链接</a> 的项</li>
            <li>3. 普通文本内容</li>
        </ol>
    </body>
    </html>
    """
    
    # 创建转换器实例
    converter = WebToDocxConverter(url="http://test.com", output_dir=".")
    converter.html_content = test_html
    converter.soup = BeautifulSoup(test_html, "html.parser")
    converter.doc = converter._create_document()
    
    # 测试_remove_list_numbering函数
    test_cases = [
        "1. 测试文本",
        "2. 另一个测试",
        "6. 1. 嵌套编号",
        "a. 字母编号",
        "i. 罗马数字",
        "(1) 括号编号",
        "1) 数字加括号",
        "   3. 带缩进的编号",
    ]
    
    print("\n_remove_list_numbering测试结果:")
    for test_case in test_cases:
        result = converter._remove_list_numbering(test_case)
        print(f"'{test_case}' -> '{result}'")
    
    # 测试_add_list_to_document函数
    print("\n测试_add_list_to_document函数...")
    lists = converter.soup.find_all(['ul', 'ol'])
    for list_element in lists:
        print(f"处理列表类型: {list_element.name}")
        converter._add_list_to_document(list_element)
    
    # 保存测试文档
    test_output = "test_list_processing_result.docx"
    converter._save_document(test_output)
    print(f"\n测试完成！生成的文档: {test_output}")
    print("请打开文档查看列表编号是否已被正确替换为符号。")

if __name__ == "__main__":
    test_list_numbering_removal()
