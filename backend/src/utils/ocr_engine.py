# -*- coding: utf-8 -*-
"""
OCR 引擎封装 - 支持图片增强、表格优化
"""
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from io import BytesIO
try:
    import cv2
except ImportError:
    cv2 = None

def preprocess_image(image):
    """
    图像预处理，增强OCR效果
    """
    try:
        # 1. 如果是字节数据，转换为PIL Image
        if isinstance(image, bytes):
            image = Image.open(BytesIO(image))
        
        # 2. 转换为RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # 3. 使用 OpenCV 进行高级处理（如果可用）
        if cv2 is not None:
            img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # 灰度化
            gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
            
            # 二值化 (OTSU)
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            
            # 降噪
            # binary = cv2.medianBlur(binary, 3)
            
            return Image.fromarray(binary)
        
        # 4. 如果没有 OpenCV，使用 Pillow 进行基础增强
        # 灰度化
        image = image.convert('L')
        
        # 增强对比度
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # 锐化
        image = image.filter(ImageFilter.SHARPEN)
        
        # 二值化
        threshold = 127
        image = image.point(lambda p: p > threshold and 255)
        
        # 放大（如果分辨率较低，有助于提高识别率）
        if image.width < 1000:
            new_size = (int(image.width * 2), int(image.height * 2))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
            
        return image
            
    except Exception as e:
        print(f"图像预处理失败: {str(e)}")
        return image

def perform_ocr(image, lang='chi_sim+eng', mode='auto'):
    """
    执行 OCR 识别
    
    Args:
        image: 图像数据或对象
        lang: 语言代码
        mode: 识别模式 'auto' | 'table' | 'formula'
    """
    processed_image = preprocess_image(image)
    
    config = ''
    if mode == 'table':
        # PSM 6: Assume a single uniform block of text. (适合整齐的表格)
        # PSM 4: Assume a single column of text of variable sizes. (适合单列)
        config = '--psm 6'
    elif mode == 'formula':
        # Tesseract 对公式支持较差，尝试使用 PSM 6
        config = '--psm 6'
    
    try:
        text = pytesseract.image_to_string(processed_image, lang=lang, config=config)
        return text
    except Exception as e:
        print(f"OCR 识别出错: {e}")
        return ""

def check_environment():
    """
    检查 OCR 环境状态
    """
    status = {
        "tesseract": False,
        "opencv": cv2 is not None,
        "formula_support": False  # 暂时不支持高级公式识别
    }
    try:
        pytesseract.get_tesseract_version()
        status["tesseract"] = True
    except:
        pass
    return status
