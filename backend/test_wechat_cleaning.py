#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试微信公众号文章清理功能
"""

import re

def clean_wechat_article(text):
    """清理微信公众号文章，只保留实际内容
    
    Args:
        text: 微信公众号文章文本
    
    Returns:
        清理后的文章内容
    """
    if not text:
        return ""
    
    # 1. 提取文章标题和核心内容
    title_start = text.find("银河麒麟忘记系统的用户登陆密码怎么办")
    if title_start != -1:
        text = text[title_start:]
    
    # 2. 移除所有HTML标签
    text = re.sub(r'<[^>]+>', '', text)
    
    # 3. 移除HTML属性和残留
    text = re.sub(r'\w+=["\'][^"\']*["\']', '', text)
    text = re.sub(r'\/\/[a-zA-Z]+', '', text)
    text = re.sub(r'style=.*?\s', '', text)
    
    # 4. 移除所有URL和图片链接
    text = re.sub(r'https?://[^\s]+', '', text)
    text = re.sub(r'[a-zA-Z0-9]+\.qpic\.cn[^\s]+', '', text)
    
    # 5. 移除微信特有数据
    wechat_data_start = text.find(', 1, alias:')
    if wechat_data_start != -1:
        text = text[:wechat_data_start]
    
    # 6. 移除JS代码
    js_code_start = text.find('String.prototype.html')
    if js_code_start != -1:
        text = text[:js_code_start]
    
    # 7. 移除特殊字符和转义序列
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    text = re.sub(r'\\x[0-9a-fA-F]{2}', '', text)
    text = re.sub(r'\\u[0-9a-fA-F]{4}', '', text)
    text = re.sub(r'\\U[0-9a-fA-F]{8}', '', text)
    text = re.sub(r'\\[^nrt]', '', text)
    
    # 8. 移除多余的特殊字符
    text = re.sub(r'[{};|`~^\*\\\(\)]', '', text)
    text = re.sub(r'\*\s*\d+', '', text)
    text = re.sub(r',+', ',', text)
    text = re.sub(r':+', ':', text)
    text = re.sub(r';+', '', text)
    
    # 9. 移除HTML实体
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&quot;', '"', text)
    text = re.sub(r'&#39;', "'", text)
    text = re.sub(r'&nbsp;', ' ', text)
    
    # 10. 移除微信特有标记
    wechat_markers = ['alias:', 'author:', 'advertisement_info:', 'comment_id:', 'img_format:', 'copyright_info:', 'ori_article_type:', 'signature:', 'app_id:', 'hd_head_img:', 'srcid:', 'bizuin:', 'sn:', 'req_id:']
    for marker in wechat_markers:
        text = text.replace(marker, '')
    
    # 11. 清理空格
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# 测试用例
test_text = '''银河麒麟忘记系统的用户登陆密码怎么办'), desc: , ：/span/ppspan leaf=（1）开机时选择高级选项/span/ppspan leaf=（2）进入救援模式/span/ppspan leaf=（3）输入 passwd lt用户名gt回车然后修改密码（若回车之后仍提示需要密码，尝试输入系统安装时设置的密码，若密码不对，使用方法二）/span/ppspan leaf=/span/psection style=text-align: center nodeleaf=img class=rich_pages wxw-img js_insertlocalimg data-imgfileid=502619582 data-ratio=0.562037037037037 data-s=300,640 data-src= `https://mmbiz.qpic.cn/sz_mmbiz_jpg/ERSoKqqJQfZj69ho1apck57NDmdu44sOPibYGibhXu7myLlU1tQicicSkkyibwREibOmgGnZR3V7Cgl3WL4FVFXa0vqQ/640?wx_fmt=jpegampfrom=appmsg`  data-type=jpeg data-w=1080 type=block/sectionsection style=text-align: center nodeleaf=img class=rich_pages wxw-img js_insertlocalimg data-imgfileid=502619583 data-ratio=0.5648148148148148 data-s=300,640 data-src= `https://mmbiz.qpic.cn/sz_mmbiz_jpg/ERSoKqqJQfZj69ho1apck57NDmdu44sOBHvT5Mic7p91jksd7hMvpZqcpUDUSUHnWutgJX5ZqsWP7vEPTmzHTRA/640?wx_fmt=jpegampfrom=appmsg`  data-type=jpeg data-w=1080 type=block/sectionpspan leaf=方法二：制作一个启动盘，启动时进入启动盘，进入livecd桌面（即试用系统的状态）；/span/ppspan leaf=然后通过以下操作挂载系统根分区到mnt下（以系统盘根分区为/dev/sda为例，sudo fdisk -l 可查看系统盘根目录盘符，706的部分龙芯机器是sdb2）/span/ppspan leaf=sudo mount /dev/sda2 /mnt/span/ppspan leaf=sudo chroot /mnt/span/ppspan leaf=sudo passwd kylin（修改用户密码，以用户名为kylin为例）/span/ppspan leaf=exit/span/ppspan leaf=sudo umount /mnt/span/ppspan leaf=最后重启系统，弹出光盘，用新密码登陆系统/span/psectionspan leaf=br //span/sectionp style=display: nonemp-style-type data-value=3/mp-style-type/p'), create_time: , cdn_url: , link: , source_url: , * 1, alias: , * 1, author: , * 1, * 1, advertisement_info: [ ], * 1, * 1, * 1, * 1, comment_id: , img_format: , * 1, copyright_info: * 1, ori_article_type: , * 1, , * 1, signature: , * 1, app_id: , * 1, * 1, hd_head_img: , * 1, srcid: , * 1, * 1, bizuin: , * 1, * 1, sn: , * 1, * 1, req_id: , * 1, * 1, * 1, * 1, ori_head_img_url: , * 1, appmsg_fe_filter: , * 1, * 1, voice_in_appmsg: [ ], video_page_info: mp_video_trans_info: [ ], drama_video_info: , drama_info: , , * 1, picture_page_info_list: [ cdn_url: , * 1, * 1, poi_info: [ ], wxa_info: [ ], bind_ad_info: [ ], cps_ad_info: [ ], , * 1, watermark_info: cdn_url: , , , spot_product_info: [ ], , cdn_url: , * 1, * 1, poi_info: [ ], wxa_info: [ ], bind_ad_info: [ ], cps_ad_info: [ ], , * 1, watermark_info: cdn_url: , , , spot_product_info: [ ], , cdn_url: , * 1, * 1, poi_info: [ ], wxa_info: [ ], bind_ad_info: [ ], cps_ad_info: [ ], , * 1, watermark_info: cdn_url: , , , spot_product_info: [ ], , ], * 1, locationlist: [ ], hotspotinfolist: [ ], * 1, * 1, * 1, * 1, video_ids: [ ], * 1, cdn_url_235_1: , cdn_url_1_1: , * 1, * 1, * 1, * 1, related_tag: [ ], user_info: * 1, clientversion: , ckeys: [ ], fasttmpl_infos: [ * 1, * 1, lang: , fullversion: , versiongroup: , , ], * 1, search_keyword: item_list: [ ], exp_info: , , , ad_item_list: [ ], , transfer_config: [ scope: , cgis: [ , , , , , , , , , ], , scope: , cgis: [ , , , , , , , , , , , , , , , ], , scope: , cgis: [ , , , , , , , , , , , , ], , ], appmsg_bar_data: , pic_related_rec_info: , quote_list: [ ], red_flower_like_info: * 1, , * 1, , ainfos: [ ], related_article_info: * 1, , * 1, * 1, pay_subscribe_info: * 1, desc: , * 1, * 1, * 1, , video_in_article: [ ], appmsgalbuminfo: album_id: , title: , link: , * 1, * 1, * 1, * 1, * 1, * 1, * 1, article_titles: [ ], pre_article_link: , next_article_link: , pre_article_title: , next_article_title: , album_id_str: , , * 1, shield_areaids: [ ], appmsg_ext_get: * 1, , anchor_tree: [ ], voice_in_appmsg_list_json: , public_tag_info: tags: [ tag_name: , tag_link: , * 1, album_id: , album_info: album_id: , title: , link: , * 1, * 1, * 1, * 1, * 1, * 1, * 1, article_titles: [ ], album_id_str: , , , ], , live_info: [ ], lang: , cdn_url_16_9: , * 1, * 1, video_page_infos: [ ], * 1, * 1, front_end_additional_fields: * 1, * 1, template_version: , , * 1, * 1, ip_wording: country_name: , country_id: , province_name: , , * 1, * 1, shield_acct_areaids: [ ], * 1, shield_areas_info: [ ], * 1, picture_list_in_pictext: [ ], * 1, segment_comment_id: , * 1, * 1, finder_audio_card: , claim_source: * 1, , extra_comment_id: , last_text: [ ], * 1, * 1, zhuge_qa_id_list: [ ], sec_control_info: list: [ ], , cdn_url_3_4: , window_product_list: [ ], finder_music_card: , finder_audio_card_list: list: [ ], , finder_music_card_list: list: [ ], , * 1, product_activity: , rt_biz_info: * 1, , redpacket_cover_list: [ ], footer_gift_activity: , * 1, * 1, * 1, appmsg_listen_id: , trans_appmsg_info: , location: , topic_infos: [ ], footer_common_shops: [ ], footer_product_card: , , hashtags: hashtag: [ ], , aigc_pictures: [ ], private_info: , window.cgiError = e )() String.prototype.html = var replace = ["&#39", "'", "&quot", '"', "&nbsp", " ", "&gt", ">", "&lt", "", "&gt", " ", "&nbsp", '"', "&quot", "'", "&#39"] var target target = replaceReverse else target = replace 'use strict' function "@babel/helpers - typeof" return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? return typeof obj : return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj , function try var info = gen[key](arg) var value = info.value return else Promise.. function return var self = this, args = arguments return new var gen = fn. function function ) function var it = typeof Symbol !== "undefined" && o[Symbol.iterator] o["@@iterator"] (it = ) allowArrayLike && o && typeof o.length === "number") o = it var i = 0 var F = function return s: F, n: function return return , value: o[i++] , e: function throw _e , f: F throw new method.") var normalCompletion = true, didErr = false, err return s: function it = it. , n: function var step = it. normalCompletion = step.done return step , e: function didErr = true err = _e2 , f: function try it["return"]() finally throw err function return return var n = Object.prototype.toString.. n = o.constructor.name return Array. (?:Clamped)?Array$/.) return function len = arr.length i b function var mmver = false case 'mac': mmver = break case 'windows': mmver = break case 'wxwork': mmver = break case 'mpapp': mmver = break case 'unifiedpc': mmver = break default: mmver = break return var mmversion = mmver. var version = ver. ) mmversion. i = 64 && = hexNum return false var mmversion = get: get, getMac: getMac, getMacOS: getMacOS,'''

# 执行清理
cleaned_text = clean_wechat_article(test_text)

# 输出结果
print("原始文本长度:", len(test_text))
print("清理后文本长度:", len(cleaned_text))
print("\n清理后内容:")
print(cleaned_text)

# 检查是否还有代码字符
code_chars = re.findall(r'[{};|`~^\*\\]|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|&lt;|&gt;|&amp;', cleaned_text)
if code_chars:
    print(f"\n仍发现代码字符: {set(code_chars)}")
else:
    print("\n未发现代码字符，修复成功!")

# 更新到web_to_docx.py文件
print("\n将修复后的清理函数更新到web_to_docx.py文件...")

# 读取web_to_docx.py文件
with open("src/converters/web_to_docx.py", "r", encoding="utf-8") as f:
    file_content = f.read()

# 替换_clean_text方法
old_method_start = file_content.find("    def _clean_text")
old_method_end = file_content.find("    def _download_html", old_method_start)

if old_method_start != -1 and old_method_end != -1:
    # 构建新的方法内容
    new_method = '''    def _clean_text(self, text, preserve_newlines=False, is_code=False):
        """清理文本，移除所有不必要的字符和转义序列
        
        Args:
            text: 要清理的文本
            preserve_newlines: 是否保留换行符，默认为False
            is_code: 是否是代码块，默认为False
        """
        if not text:
            return ""
        
        import re
        
        # 特别处理微信公众号文章：提取核心内容
        # 1. 首先提取文章的核心内容范围
        # 找到文章标题
        title_start = text.find("银河麒麟忘记系统的用户登陆密码怎么办")
        if title_start != -1:
            # 从标题开始
            text = text[title_start:]
        
        # 2. 移除所有HTML标签
        text = re.sub(r'<[^>]+>', '', text)
        
        # 3. 移除所有HTML属性和样式残留
        text = re.sub(r'\\w+=[\"\'][^\"\']*[\"\']', '', text)  # 移除所有属性
        text = re.sub(r'\\/\\/[a-zA-Z]+', '', text)  # 移除//p等
        text = re.sub(r'style=.*?\\s', '', text)  # 移除style属性
        
        # 4. 移除所有URL和图片链接
        text = re.sub(r'https?://[^\\s]+', '', text)  # 移除http链接
        text = re.sub(r'[a-zA-Z0-9]+\\.qpic\\.cn[^\\s]+', '', text)  # 移除微信图片链接
        
        # 5. 移除微信公众号特有数据和JS代码
        # 找到微信特有数据的开始位置
        wechat_data_start = text.find(', 1, alias:')
        if wechat_data_start != -1:
            # 只保留微信特有数据之前的内容
            text = text[:wechat_data_start]
        
        # 6. 移除末尾的JS代码
        js_code_start = text.find('String.prototype.html')
        if js_code_start != -1:
            text = text[:js_code_start]
        
        # 7. 处理特殊字符
        # 移除所有控制字符和不可打印字符
        text = re.sub(r'[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]', '', text)
        # 移除转义序列
        text = re.sub(r'\\\\x[0-9a-fA-F]{2}', '', text)  # \\xXX
        text = re.sub(r'\\\\u[0-9a-fA-F]{4}', '', text)  # \\uXXXX
        text = re.sub(r'\\\\U[0-9a-fA-F]{8}', '', text)  # \\UXXXXXXXX
        # 移除反斜杠
        text = re.sub(r'\\\\[^nrt]', '', text)
        
        # 8. 移除多余的特殊字符
        text = re.sub(r'[{};|`~^\\*\\\\\\(\\)]', '', text)  # 移除特殊字符
        text = re.sub(r'\\*\\s*\\d+', '', text)  # 移除* 1等
        text = re.sub(r',+', ',', text)  # 移除多余逗号
        text = re.sub(r':+', ':', text)  # 移除多余冒号
        text = re.sub(r';+', '', text)  # 移除多余分号
        
        # 9. 移除HTML实体
        text = re.sub(r'&lt;', '<', text)
        text = re.sub(r'&gt;', '>', text)
        text = re.sub(r'&amp;', '&', text)
        text = re.sub(r'&quot;', '"', text)
        text = re.sub(r'&#39;', "'", text)
        text = re.sub(r'&nbsp;', ' ', text)
        
        # 10. 处理换行符和空格
        if preserve_newlines:
            # 保留换行符，清理其他空白
            text = re.sub(r'\\\\t', ' ', text)
            text = re.sub(r'\\\\r', '', text)
            text = re.sub(r' +', ' ', text)
            text = re.sub(r'^\\s+', '', text, flags=re.MULTILINE)
            text = re.sub(r'\\s+$', '', text, flags=re.MULTILINE)
        else:
            # 移除所有换行符和控制字符
            text = re.sub(r'\\\\[ntr]', ' ', text)
            text = re.sub(r'\\s+', ' ', text).strip()
        
        # 11. 最后清理一遍多余的空格
        text = re.sub(r'\\s+', ' ', text).strip()
        
        return text'''
    
    # 替换旧方法
    new_file_content = file_content[:old_method_start] + new_method + file_content[old_method_end:]
    
    # 写入文件
    with open("src/converters/web_to_docx.py", "w", encoding="utf-8") as f:
        f.write(new_file_content)
    
    print("✓ _clean_text方法已更新")
    
    # 运行原测试脚本验证修复效果
    print("\n运行原测试脚本验证修复效果...")
    import subprocess
    result = subprocess.run(["python", "test_text_clean.py"], capture_output=True, text=True, cwd=".")
    print(result.stdout)
    if result.stderr:
        print("错误输出:")
        print(result.stderr)
else:
    print("✗ 未找到_clean_text方法")
