#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本，用于检查网页转Word转换功能
"""

import sys
import traceback
from src.converters.web_to_docx import convert_web_to_docx

print("Starting web to docx conversion test...")
try:
    # 调用转换函数
    result = convert_web_to_docx(
        url="https://www.example.com",
        options={
            "timeout": 30,
            "output_dir": "."
        }
    )
    print(f"Conversion result: {result}")
    if result.get("success"):
        print("Conversion successful!")
        print(f"Output file: {result.get('output_file')}")
    else:
        print(f"Conversion failed: {result.get('message')}")
except Exception as e:
    print(f"Conversion error: {type(e).__name__}: {e}")
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)