#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Word文档转PDF转换器
"""

import os
import uuid
import re
from datetime import datetime
from docx import Document
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import mammoth
import platform

# 注册中文字体
def register_chinese_fonts():
    # 尝试不同的中文字体路径，适配不同系统
    font_paths = []
    
    if platform.system() == 'Windows':
        font_paths.append('C:\\Windows\\Fonts\\simhei.ttf')  # 黑体
        font_paths.append('C:\\Windows\\Fonts\\simsun.ttc')  # 宋体
        font_paths.append('C:\\Windows\\Fonts\\simkai.ttf')  # 楷体
    elif platform.system() == 'Linux':
        font_paths.extend([
            '/usr/share/fonts/wqy-zenhei/wqy-zenhei.ttc',
            '/usr/share/fonts/wqy-microhei/wqy-microhei.ttc',
            '/usr/share/fonts/simsun.ttc'
        ])
    elif platform.system() == 'Darwin':  # macOS
        font_paths.extend([
            '/System/Library/Fonts/PingFang.ttc',
            '/Library/Fonts/Arial Unicode.ttf'
        ])
    
    # 注册可用的字体
    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont('Chinese', font_path))
                return True
            except Exception as e:
                print(f"注册字体失败: {font_path}, 错误: {e}")
    
    print("未找到可用的中文字体，中文显示可能会有问题")
    return False

# 注册中文字体
register_chinese_fonts()


def convert_word_to_pdf(input_file, output_file=None, options=None):
    """
    Word转PDF的主函数入口

    Args:
        input_file (str): 输入的Word文件路径
        output_file (str, optional): 输出的PDF文件路径
        options (dict, optional): 转换选项

    Returns:
        dict: 转换结果信息
    """
    if options is None:
        options = {}

    # 解析输出路径
    if output_file:
        output_dir = os.path.dirname(output_file)
        base_name = os.path.splitext(os.path.basename(output_file))[0]
    else:
        output_dir = os.path.dirname(input_file)
        base_name = os.path.splitext(os.path.basename(input_file))[0]
        output_file = os.path.join(output_dir, f"{base_name}.pdf")

    # 确保输出目录存在
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    # 检查文件扩展名
    file_extension = os.path.splitext(input_file)[1].lower()
    
    if file_extension not in ['.doc', '.docx']:
        raise Exception(f"不支持的文件格式: {file_extension}，仅支持DOC和DOCX格式")

    try:
        print(f"开始转换Word文件: {input_file}")
        
        # 创建PDF文档
        doc = SimpleDocTemplate(
            output_file,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # 获取样式表
        styles = getSampleStyleSheet()
        
        # 创建自定义样式，使用中文字体
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontName='Chinese',
            fontSize=18,
            leading=22,
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontName='Chinese',
            fontSize=14,
            leading=18,
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontName='Chinese',
            fontSize=12,
            leading=16,
        )
        
        # 文档内容列表
        story = []
        
        if file_extension == '.docx':
            # 处理.docx格式文件
            word_doc = Document(input_file)
            
            # 1. 首先提取所有图片及其关系
            image_rels = {}
            for rel_id, rel in word_doc.part.rels.items():
                if rel.reltype == RT.IMAGE:
                    try:
                        image_data = rel.target_part.blob
                        content_type = rel.target_part.content_type
                        image_rels[rel_id] = {
                            'data': image_data,
                            'content_type': content_type
                        }
                    except Exception as e:
                        print(f"提取图片关系失败: {str(e)}")
            
            total_images = len(image_rels)
            print(f"提取到 {total_images} 张图片关系")
            
            # 2. 遍历所有文档元素
            for element in word_doc.element.body:
                if element.tag.endswith('p'):  # 段落
                    # 查找对应的段落对象
                    paragraph = None
                    for p in word_doc.paragraphs:
                        if p._element == element:
                            paragraph = p
                            break
                    
                    if paragraph:
                        # 检查段落中是否有文字
                        text = paragraph.text.strip()
                        if text:
                            # 跳过匹配"第X页"格式的段落
                            if re.match(r'^第\d+页$', text):
                                print(f"跳过页码段落: {text}")
                                continue
                            
                            # 检查是否是标题
                            if paragraph.style.name.startswith('Heading'):
                                try:
                                    level = int(paragraph.style.name.replace('Heading ', ''))
                                    if level == 1:
                                        p = Paragraph(text, title_style)
                                    elif level == 2:
                                        p = Paragraph(text, subtitle_style)
                                    else:
                                        p = Paragraph(text, normal_style)
                                except ValueError:
                                    p = Paragraph(text, normal_style)
                            else:
                                p = Paragraph(text, normal_style)
                            
                            story.append(p)
                            story.append(Spacer(1, 0.1 * inch))
                        
                        # 3. 检查段落中是否有图片
                        has_image = False
                        p_element = paragraph._element
                        
                        # 检查段落是否包含图片元素
                        for child in p_element.iter():
                            tag = child.tag
                            if 'drawing' in tag.lower() or 'pict' in tag.lower() or 'inline' in tag.lower():
                                has_image = True
                                break
                        
                        # 处理段落中的图片
                        if has_image and image_rels:
                            try:
                                # 获取第一张未处理的图片
                                rel_id, img_info = next(iter(image_rels.items()))
                                img_data = img_info['data']
                                img_stream = BytesIO(img_data)
                                img = Image(img_stream)
                                
                                # 计算合适的图片大小，保持比例
                                max_width = 5.0 * inch
                                if img.drawWidth > max_width:
                                    scale = max_width / img.drawWidth
                                    img.drawWidth = max_width
                                    img.drawHeight = img.drawHeight * scale
                                
                                # 确保图片高度不超过页面高度
                                max_height = 8.0 * inch
                                if img.drawHeight > max_height:
                                    scale = max_height / img.drawHeight
                                    img.drawWidth = img.drawWidth * scale
                                    img.drawHeight = max_height
                                
                                story.append(img)
                                story.append(Spacer(1, 0.2 * inch))
                                # 从字典中移除已处理的图片
                                del image_rels[rel_id]
                            except Exception as img_e:
                                print(f"处理图片时出错: {str(img_e)}")
                elif element.tag.endswith('tbl'):  # 表格
                    # 查找对应的表格对象
                    table = None
                    for t in word_doc.tables:
                        if t._element == element:
                            table = t
                            break
                    
                    if table:
                        story.append(Spacer(1, 0.2 * inch))
                        
                        # 转换表格数据
                        data = []
                        for row in table.rows:
                            row_data = []
                            for cell in row.cells:
                                row_data.append(cell.text.strip())
                            data.append(row_data)
                        
                        if data:
                            # 创建PDF表格
                            pdf_table = Table(data)
                            
                            # 添加表格样式
                            pdf_table.setStyle(TableStyle([
                                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                                ('FONTSIZE', (0, 0), (-1, 0), 12),
                                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                                ('GRID', (0, 0), (-1, -1), 1, colors.black)
                            ]))
                            
                            story.append(pdf_table)
                            story.append(Spacer(1, 0.2 * inch))
            
            # 4. 处理剩余的图片（如果有）
            for rel_id, img_info in list(image_rels.items()):
                try:
                    img_stream = BytesIO(img_info['data'])
                    # 添加图片到PDF
                    img = Image(img_stream)
                    # 设置最大宽度，保持原始比例
                    max_width = 5.0 * inch
                    # 计算调整后的宽度和高度，保持原始比例
                    if img.drawWidth > max_width:
                        # 计算缩放比例
                        scale = max_width / img.drawWidth
                        new_width = max_width
                        new_height = img.drawHeight * scale
                        # 直接设置宽度和高度
                        img.drawWidth = new_width
                        img.drawHeight = new_height
                    # 确保图片高度不超过页面高度
                    max_height = 8.0 * inch
                    if img.drawHeight > max_height:
                        # 计算缩放比例
                        scale = max_height / img.drawHeight
                        new_width = img.drawWidth * scale
                        new_height = max_height
                        # 直接设置宽度和高度
                        img.drawWidth = new_width
                        img.drawHeight = new_height
                    story.append(img)
                    story.append(Spacer(1, 0.2 * inch))
                    # 从字典中移除已处理的图片
                    del image_rels[rel_id]
                except Exception as img_e:
                    print(f"处理剩余图片时出错: {str(img_e)}")
            
            print(f"处理完成，剩余 {len(image_rels)} 张图片未处理")
        elif file_extension == '.doc':
            # 处理.doc格式文件，使用mammoth转换为HTML，再处理
            try:
                with open(input_file, "rb") as doc_file:
                    result = mammoth.convert_to_html(doc_file)
                    html_content = result.value
                    
                    # 简单处理HTML内容，提取文本
                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # 提取所有文本
                    text_content = soup.get_text()
                    
                    # 将文本按段落分割
                    paragraphs = text_content.split('\n')
                    
                    for para in paragraphs:
                        if para.strip():
                            p = Paragraph(para.strip(), normal_style)
                            story.append(p)
                            story.append(Spacer(1, 0.1 * inch))
            except Exception as e:
                print(f"处理.doc文件时出错: {str(e)}")
                raise Exception(f"转换.doc文件失败: {str(e)}")
        
        # 构建PDF文档
        doc.build(story)
        print(f"Word文件转换成功: {output_file}")
        
        return {
            "output_file": output_file,
            "success": True
        }
    except Exception as e:
        print(f"Word文件转换失败: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"转换Word文件失败: {str(e)}")