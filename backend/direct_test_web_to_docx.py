#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
from src.converters.web_to_docx import convert_web_to_docx

# 直接测试网页转Word功能
def direct_test():
    # 要测试的网页URL
    test_url = "http://example.com"
    
    print(f"=== 直接测试网页转Word功能 ===")
    print(f"测试URL: {test_url}")
    
    try:
        # 直接调用转换函数
        print("开始转换...")
        result = convert_web_to_docx(test_url)
        
        print(f"\n--- 转换结果 ---")
        print(f"成功: {result.get('success')}")
        print(f"消息: {result.get('message')}")
        print(f"输出文件: {result.get('output_file')}")
        print(f"标题: {result.get('title')}")
        print(f"下载图片数: {result.get('downloaded_images')}")
        
        if result.get('success'):
            print(f"\n转换成功！文件已保存为: {result['output_file']}")
            # 检查文件是否存在
            if os.path.exists(result['output_file']):
                print(f"文件大小: {os.path.getsize(result['output_file'])} 字节")
            else:
                print(f"错误: 生成的文件不存在")
        else:
            print(f"\n转换失败！")
            
    except Exception as e:
        print(f"\n--- 异常信息 ---")
        print(f"转换失败: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    direct_test()