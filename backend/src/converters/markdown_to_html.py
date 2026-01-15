#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown转HTML工具 - Python版本
将Markdown文件转换为HTML文件，保持与原Node.js版本相同的功能和输出格式
"""

import os
import sys
import argparse
import markdown
from datetime import datetime


# 定义不同的样式模板
STYLES = {
    "default": {
        "name": "默认样式",
        "css": """
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 {
            font-size: 2em;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.3em;
        }
        h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.3em;
        }
        p {
            margin: 1em 0;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        ul, ol {
            padding-left: 2em;
            margin: 1em 0;
        }
        li {
            margin: 0.5em 0;
        }
        code {
            background-color: #f1f1f1;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f1f1f1;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        """
    },
    "clean": {
        "name": "简洁模式",
        "css": """
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #000;
            margin-top: 1.8em;
            margin-bottom: 0.6em;
            font-weight: 600;
        }
        h1 {
            font-size: 2.2em;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 0.3em;
        }
        h2 {
            font-size: 1.8em;
        }
        h3 {
            font-size: 1.5em;
        }
        p {
            margin: 1.2em 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        ul, ol {
            padding-left: 2em;
            margin: 1em 0;
        }
        li {
            margin: 0.5em 0;
        }
        code {
            background-color: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            border-left: 3px solid #e5e5e5;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
            font-style: italic;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5em 0;
        }
        th, td {
            border: 1px solid #e5e5e5;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #fafafa;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        """
    },
    "modern": {
        "name": "现代模式",
        "css": """
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #2d3748;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f7fafc;
        }
        .content {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 3rem;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #1a202c;
            margin-top: 1.8em;
            margin-bottom: 0.8em;
            font-weight: 700;
        }
        h1 {
            font-size: 2.5em;
            margin-top: 0;
            color: #2b6cb0;
        }
        h2 {
            font-size: 2em;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.5em;
        }
        h3 {
            font-size: 1.5em;
        }
        p {
            margin: 1.5em 0;
        }
        a {
            color: #2b6cb0;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        a:hover {
            color: #2c5282;
            text-decoration: underline;
        }
        ul, ol {
            padding-left: 1.5em;
            margin: 1.5em 0;
        }
        li {
            margin: 0.8em 0;
        }
        code {
            background-color: #edf2f7;
            padding: 0.2em 0.5em;
            border-radius: 6px;
            font-family: 'Fira Code', 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #edf2f7;
            padding: 1.5em;
            border-radius: 8px;
            overflow-x: auto;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            border-left: 4px solid #2b6cb0;
            padding: 1em 1.5em;
            margin: 1.5em 0;
            color: #4a5568;
            background-color: #ebf8ff;
            border-radius: 0 6px 6px 0;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 2em 0;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 2em 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 12px 16px;
            text-align: left;
        }
        th {
            background-color: #f7fafc;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f7fafc;
        }
        """
    },
    "book": {
        "name": "书籍模式",
        "css": """
        body {
            font-family: 'Georgia', 'Times New Roman', Times, serif;
            line-height: 1.8;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #faf9f6;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #222;
            margin-top: 2em;
            margin-bottom: 1em;
            font-weight: 700;
        }
        h1 {
            font-size: 2.5em;
            text-align: center;
            margin-bottom: 1.5em;
        }
        h2 {
            font-size: 2em;
            margin-top: 2.5em;
        }
        h3 {
            font-size: 1.5em;
        }
        p {
            margin: 1.5em 0;
            text-align: justify;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        ul, ol {
            padding-left: 1.5em;
            margin: 1.5em 0;
        }
        li {
            margin: 0.8em 0;
            text-align: justify;
        }
        code {
            background-color: #f0f0f0;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f0f0f0;
            padding: 1.2em;
            border-radius: 5px;
            overflow-x: auto;
            margin: 2em 0;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            border-left: 3px solid #ccc;
            padding: 1em 1.5em;
            margin: 2em 0;
            color: #555;
            font-style: italic;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 2.5em auto;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 2em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f5f5f5;
        }
        """
    },
    "docs": {
        "name": "文档模式",
        "css": """
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            font-size: 16px;
            line-height: 1.5;
            word-wrap: break-word;
            color: #24292f;
            background-color: #ffffff;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #24292f;
        }
        h1 {
            font-size: 2em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid #d0d7de;
        }
        h2 {
            font-size: 1.5em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid #d0d7de;
        }
        h3 {
            font-size: 1.25em;
        }
        h4 {
            font-size: 1em;
        }
        p {
            margin-top: 0;
            margin-bottom: 16px;
        }
        a {
            color: #0969da;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        ul, ol {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }
        code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: #afb8c133;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        }
        pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 16px;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            padding: 0 1em;
            color: #57606a;
            border-left: 0.25em solid #d0d7de;
            margin: 0 0 16px 0;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
            display: block;
            width: max-content;
            max-width: 100%;
            overflow: auto;
            margin-bottom: 16px;
        }
        tr {
            background-color: #ffffff;
            border-top: 1px solid #d8dee4;
        }
        tr:nth-child(2n) {
            background-color: #f6f8fa;
        }
        th, td {
            padding: 6px 13px;
            border: 1px solid #d0d7de;
        }
        th {
            font-weight: 600;
        }
        img {
            max-width: 100%;
            box-sizing: content-box;
            background-color: #ffffff;
        }
        hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #d0d7de;
            border: 0;
        }
        """
    },
    "tech_blue": {
        "name": "科技蓝",
        "css": """
        body {
            font-family: 'Roboto', 'Segoe UI', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            background-color: #f0f4f8;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #0d47a1;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
        }
        h1 {
            font-size: 2.2em;
            border-bottom: 2px solid #0d47a1;
            padding-bottom: 0.3em;
        }
        h2 {
            font-size: 1.8em;
            border-bottom: 1px solid #bbdefb;
            padding-bottom: 0.3em;
        }
        a {
            color: #1976d2;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            font-family: 'Consolas', 'Monaco', monospace;
            background-color: #e3f2fd;
            color: #0d47a1;
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-size: 0.9em;
        }
        pre {
            background-color: #263238;
            color: #eceff1;
            padding: 1.2em;
            border-radius: 8px;
            overflow-x: auto;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #1976d2;
            padding-left: 1em;
            background-color: #e3f2fd;
            padding: 1em;
            border-radius: 0 4px 4px 0;
            color: #546e7a;
            margin: 1.5em 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5em 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            background-color: white;
        }
        th {
            background-color: #1976d2;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            border-bottom: 1px solid #e0e0e0;
            padding: 12px;
        }
        tr:nth-child(even) {
            background-color: #f5f5f5;
        }
        """
    },
    "dark_mode": {
        "name": "暗黑模式",
        "css": """
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #e0e0e0;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            background-color: #1e1e1e;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #90caf9;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 {
            border-bottom: 1px solid #424242;
            padding-bottom: 0.3em;
        }
        a {
            color: #64b5f6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            font-family: 'Fira Code', monospace;
            background-color: #333;
            padding: 0.2em 0.4em;
            border-radius: 4px;
            color: #ffcc80;
        }
        pre {
            background-color: #121212;
            padding: 1.2em;
            border-radius: 8px;
            border: 1px solid #333;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #64b5f6;
            padding-left: 1em;
            color: #bdbdbd;
            background-color: #263238;
            padding: 1em;
            border-radius: 4px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5em 0;
        }
        th, td {
            border: 1px solid #424242;
            padding: 10px;
        }
        th {
            background-color: #333;
        }
        tr:nth-child(even) {
            background-color: #2c2c2c;
        }
        """
    }
}

# 生成完整的HTML文件内容
def generate_html_file(html_content, title="Markdown to HTML", style="default"):
    # 获取选择的样式
    selected_style = STYLES.get(style, STYLES["default"])
    css = selected_style["css"]
    
    # 现代模式需要特殊处理，添加content容器
    if style == "modern":
        html_content = f'<div class="content">{html_content}</div>'
    
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        {css}
    </style>
</head>
<body>
    {html_content}
</body>
</html>"""


# 读取Markdown文件
def read_markdown_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        raise Exception(f"读取Markdown文件错误: {e}")


# 从Markdown内容中提取标题
def extract_title_from_markdown(markdown_content):
    """从Markdown内容中提取第一个h1标题"""
    import re
    # 查找第一个h1标题，格式为 # 标题 或 #标题
    # 使用re.search而不是re.match，因为re.match只匹配字符串开头
    match = re.search(r'^#\s*(.+?)\s*(?:\n|$)', markdown_content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None

# 将Markdown转换为HTML
def markdown_content_to_html(markdown_content):
    try:
        import markdown
        # 使用Python markdown库进行转换
        return markdown.markdown(markdown_content, extensions=["fenced_code", "tables"])
    except Exception as e:
        raise Exception(f"Markdown转换为HTML错误: {e}")


# 写入HTML文件
def write_html_file(html_content, output_file_path):
    try:
        # 确保输出目录存在
        output_dir = os.path.dirname(output_file_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        with open(output_file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"HTML文件已成功生成: {output_file_path}")
    except Exception as e:
        raise Exception(f"写入HTML文件错误: {e}")


# 清理文件名，移除或替换特殊字符
def sanitize_filename(filename):
    """清理文件名，移除或替换特殊字符"""
    import re
    # 移除或替换不允许的字符
    filename = re.sub(r'[\\/:*?"<>|]', '_', filename)
    # 移除开头和结尾的空白字符
    filename = filename.strip()
    # 确保文件名不为空
    if not filename:
        filename = "unnamed"
    return filename

# 统一的Markdown转HTML函数接口
def convert_markdown_to_html(input_file, output_file=None, options=None):
    """
    Markdown转HTML的主函数入口

    Args:
        input_file (str): 输入的Markdown文件路径
        output_file (str, optional): 输出的HTML文件路径
        options (dict, optional): 转换选项

    Returns:
        dict: 转换结果信息
    """
    if options is None:
        options = {}

    # 读取Markdown文件
    markdown_content = read_markdown_file(input_file)

    # 解析输出路径
    if output_file:
        # 确保输出文件路径完整
        if not os.path.isabs(output_file):
            # 如果是相对路径，使用当前目录作为基准
            output_file = os.path.abspath(output_file)
    else:
        # 尝试从Markdown内容中提取标题作为文件名
        extracted_title = extract_title_from_markdown(markdown_content)
        if extracted_title:
            # 使用提取的标题作为文件名
            base_name = sanitize_filename(extracted_title)
        else:
            # 如果没有提取到标题，使用原文件名
            base_name = os.path.splitext(os.path.basename(input_file))[0]
        # 使用当前目录作为输出目录，而不是输入文件所在目录
        output_file = os.path.join(os.getcwd(), f"{base_name}.html")

    # 转换为HTML
    html_content = markdown_content_to_html(markdown_content)

    # 生成完整HTML文件
    # 提取标题用于HTML标题
    extracted_title = extract_title_from_markdown(markdown_content)
    if extracted_title:
        title = options.get("title", extracted_title)
    else:
        title = options.get("title", os.path.splitext(os.path.basename(input_file))[0])
    style = options.get("style", "default")
    full_html_content = generate_html_file(html_content, title, style)

    # 写入文件
    write_html_file(full_html_content, output_file)

    return {"input_file": input_file, "output_file": output_file, "success": True}


# 命令行主函数
def main():
    # 设置命令行参数解析
    parser = argparse.ArgumentParser(description="将Markdown文件转换为HTML文件")
    parser.add_argument("input_file", help="输入的Markdown文件路径")
    parser.add_argument("output_file", nargs="?", help="输出的HTML文件路径，可选")
    args = parser.parse_args()

    # 调用统一的转换函数
    result = convert_markdown_to_html(args.input_file, args.output_file)

    if result["success"]:
        print(f"转换完成! 输出文件: {result['output_file']}")
    else:
        print("转换失败!")


if __name__ == "__main__":
    main()
