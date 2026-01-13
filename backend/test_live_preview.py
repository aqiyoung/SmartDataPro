import requests

# 测试实时预览功能
def test_live_preview():
    print("测试实时预览功能...")
    
    # 测试用的Markdown文本
    test_text = "# 测试标题\n\n这是一个测试段落。\n\n- 列表项1\n- 列表项2\n- 列表项3"
    
    # 准备表单数据
    files = {
        'file': ('temp.md', test_text, 'text/markdown')
    }
    data = {
        'style': 'default'
    }
    
    # 发送请求
    try:
        response = requests.post('http://localhost:8000/api/convert/markdown-to-html', files=files, data=data)
        print(f"状态码: {response.status_code}")
        if response.status_code == 200:
            print("实时预览请求成功!")
            print("HTML内容:")
            print(response.text)
        else:
            print(f"请求失败: {response.text}")
    except Exception as e:
        print(f"请求失败: {e}")

if __name__ == "__main__":
    test_live_preview()
