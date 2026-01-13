#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本，用于检查后端API是否正常工作
"""

import requests

url = "http://localhost:8005/api/convert/web-to-docx"

# 测试数据
payload = {
    "url": "https://www.example.com"
}

print(f"发送请求到: {url}")
print(f"请求数据: {payload}")

try:
    # 发送POST请求
    response = requests.post(url, data=payload)
    
    # 打印响应信息
    print(f"\n响应状态码: {response.status_code}")
    print(f"响应头: {response.headers}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ API请求成功")
    else:
        print(f"\n❌ API请求失败，状态码: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ 请求发生异常: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()