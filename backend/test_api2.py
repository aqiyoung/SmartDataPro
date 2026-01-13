#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本，用于检查后端API是否正常工作，获取详细的错误信息
"""

import requests
import time

url = "http://localhost:8005/api/convert/web-to-docx"

# 测试微信公众号文章URL
payload = {
    "url": "https://mp.weixin.qq.com/s/h8W8c2slrwgG40mZQ8G5mA"
}

print(f"发送请求到: {url}")
print(f"请求数据: {payload}")
print(f"请求时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")

try:
    # 发送POST请求，设置超时时间为60秒
    response = requests.post(url, data=payload, timeout=60)
    
    # 打印响应信息
    print(f"\n响应时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"响应状态码: {response.status_code}")
    print(f"响应头: {response.headers}")
    print(f"响应内容长度: {len(response.content)}")
    print(f"响应内容类型: {response.headers.get('Content-Type')}")
    
    # 如果是JSON响应，打印JSON内容
    if response.headers.get('Content-Type') and 'application/json' in response.headers.get('Content-Type'):
        print(f"\n响应内容(JSON): {response.json()}")
    else:
        # 如果是二进制响应，保存到文件
        with open(f"test_response_{int(time.time())}.docx", "wb") as f:
            f.write(response.content)
        print(f"\n响应内容(二进制)已保存到文件")
    
    if response.status_code == 200:
        print("\n✅ API请求成功")
    else:
        print(f"\n❌ API请求失败，状态码: {response.status_code}")
        
except requests.exceptions.Timeout:
    print(f"\n❌ 请求超时")
except Exception as e:
    print(f"\n❌ 请求发生异常: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()