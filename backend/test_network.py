#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import socket
import traceback

# 测试基本网络连接
def test_network_basic():
    print("=== 测试基本网络连接 ===")
    
    try:
        # 测试DNS解析
        print("测试DNS解析...")
        ip = socket.gethostbyname("www.example.com")
        print(f"DNS解析成功，IP地址: {ip}")
        
        # 测试TCP连接
        print("\n测试TCP连接...")
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((ip, 443))
        sock.close()
        
        if result == 0:
            print("TCP连接成功")
        else:
            print(f"TCP连接失败，错误代码: {result}")
            
    except Exception as e:
        print(f"网络连接测试失败: {str(e)}")
        traceback.print_exc()

# 测试requests库的基本功能
def test_requests_basic():
    print("\n=== 测试requests库基本功能 ===")
    
    try:
        # 测试HTTP请求
        print("测试HTTP请求...")
        response = requests.get("http://www.example.com", timeout=5)
        print(f"HTTP状态码: {response.status_code}")
        print(f"响应内容长度: {len(response.text)} 字符")
        
        # 测试HTTPS请求
        print("\n测试HTTPS请求...")
        response = requests.get("https://www.example.com", timeout=5, verify=False)  # 临时关闭证书验证
        print(f"HTTPS状态码: {response.status_code}")
        print(f"响应内容长度: {len(response.text)} 字符")
        
    except Exception as e:
        print(f"requests库测试失败: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    test_network_basic()
    test_requests_basic()