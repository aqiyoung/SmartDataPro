
import os
import tempfile
from .markdown_to_html import convert_markdown_to_html
from .web_to_docx import WebToDocxConverter

def convert_markdown_to_docx(input_file, options=None):
    """
    将Markdown文件转换为Word文档
    
    Args:
        input_file (str): 输入的Markdown文件路径
        options (dict, optional): 转换选项
        
    Returns:
        dict: 转换结果信息
    """
    if options is None:
        options = {}
        
    output_dir = options.get("output_dir", os.path.dirname(input_file))
    
    # 1. 先将Markdown转换为HTML
    # 创建临时HTML文件，指定 use_inline_styles=True 以便将样式内联到 HTML 中
    html_result = convert_markdown_to_html(
        input_file, 
        options={
            "style": options.get("style", "default"),
            "use_inline_styles": True  # 新增选项：内联样式
        }
    )
    if not html_result["success"]:
        return html_result
        
    html_file = html_result["output_file"]
    
    try:
        # 2. 使用WebToDocxConverter将HTML转换为Word
        # 确定输出文件名
        base_name = os.path.splitext(os.path.basename(input_file))[0]
        output_file = os.path.join(output_dir, f"{base_name}.docx")
        
        # WebToDocxConverter需要一个URL或本地文件路径
        # 对于本地文件，可以直接传递路径
        converter = WebToDocxConverter(
            url=html_file,
            output_dir=output_dir,
            timeout=options.get("timeout", 10)
        )
        
        # 执行转换
        docx_result = converter.convert(output_file)
        
        return docx_result
        
    finally:
        # 清理临时HTML文件
        if os.path.exists(html_file):
            os.remove(html_file)
