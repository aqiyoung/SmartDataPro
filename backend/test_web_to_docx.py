import requests
import json
import traceback

# 测试网页转Word功能
def test_web_to_docx():
    url = "http://localhost:8002/api/convert/web-to-docx"
    
    # 要测试的网页URL
    test_url = "https://www.example.com"
    
    # 准备表单数据
    data = {
        "url": test_url
    }
    
    try:
        print(f"开始测试网页转Word功能")
        print(f"API端点: {url}")
        print(f"测试URL: {test_url}")
        
        # 添加超时设置
        print("发送POST请求...")
        response = requests.post(url, data=data, timeout=30)
        
        print(f"\n--- 响应信息 ---")
        print(f"状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        
        print(f"\n--- 响应内容 ---")
        if response.status_code == 200:
            # 保存转换后的文件
            filename = "example.docx"
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"转换成功！文件已保存为: {filename}")
            print(f"文件大小: {len(response.content)} 字节")
        else:
            print(f"转换失败，状态码: {response.status_code}")
            print(f"响应内容: {response.text}")
            
    except requests.exceptions.Timeout:
        print(f"请求超时，可能是网络问题或服务器处理时间过长")
    except requests.exceptions.ConnectionError:
        print(f"连接失败，可能是服务器未运行或端口错误")
    except Exception as e:
        print(f"\n--- 异常信息 ---")
        print(f"请求失败: {str(e)}")
        print(f"异常类型: {type(e).__name__}")
        print(f"完整堆栈:")
        traceback.print_exc()

if __name__ == "__main__":
    print("=== 网页转Word功能测试 ===")
    test_web_to_docx()
    print("\n=== 测试结束 ===")