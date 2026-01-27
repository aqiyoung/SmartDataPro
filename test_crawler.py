import requests

# 测试小红书关键词搜索
def test_xiaohongshu_search():
    url = 'http://localhost:8016/api/crawl/media'
    data = {
        'platform': 'xiaohongshu',
        'keyword': '银河麒麟'
    }
    
    try:
        response = requests.post(url, data=data, timeout=60)
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        return response.json()
    except Exception as e:
        print(f"测试失败: {str(e)}")
        return None

if __name__ == "__main__":
    print("测试小红书关键词搜索...")
    result = test_xiaohongshu_search()
    if result:
        print("\n测试成功！")
        print(f"结果数量: {len(result.get('data', []))}")
    else:
        print("\n测试失败！")
