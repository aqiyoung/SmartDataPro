from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Body
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import os
import tempfile
import requests
from src.converters import (
    convert_docx_to_md, 
    convert_markdown_to_html, 
    convert_web_to_docx, 
    convert_word_to_pdf, 
    convert_pdf_to_word,
    convert_markdown_to_docx
)
import time
import re



app = FastAPI(
    title="统一文档转换工具API",
    description="提供文档格式转换服务，支持多种格式转换",
    version="2.1.0",
    # 优化FastAPI配置
    docs_url=None,  # 生产环境关闭自动生成的文档
    redoc_url=None,  # 生产环境关闭Redoc文档
    openapi_url=None  # 生产环境关闭OpenAPI规范
)

# 添加GZip压缩中间件，减少响应大小
app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,  # 只压缩大于1KB的响应
    compresslevel=5  # 设置压缩级别，5是平衡压缩率和性能的选择
)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    # 在生产环境中应该限制为特定域名，这里为了开发方便暂时允许所有域名
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # 只允许必要的HTTP方法
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Length"]  # 暴露必要的响应头
)

# 添加自定义中间件，用于响应时间跟踪和缓存控制
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    # 添加缓存控制头
    response.headers["Cache-Control"] = "public, max-age=3600"  # 缓存1小时
    return response

# 配置静态文件服务
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
# 检查生产构建目录是否存在，如果存在则使用，否则使用开发目录
dist_dir = os.path.join(frontend_dir, "dist")
static_dir = dist_dir if os.path.exists(dist_dir) else frontend_dir
app.mount("/static", StaticFiles(directory=static_dir), name="frontend")

# 配置临时文件目录
TEMP_DIR = tempfile.gettempdir()

# 生成唯一的临时文件名
import uuid
def generate_unique_filename(original_filename, suffix):
    """生成唯一的临时文件名"""
    unique_id = uuid.uuid4().hex
    if original_filename:
        name_part = os.path.splitext(original_filename)[0]
        # 清理文件名中的特殊字符
        name_part = re.sub(r'[^a-zA-Z0-9_-]', '', name_part)
        return f"{name_part}_{unique_id}.{suffix}"
    return f"temp_{unique_id}.{suffix}"

# 根路径重定向到静态文件服务的 index.html
@app.get("/")
def root():
    index_path = os.path.join(static_dir, "index.html")
    return FileResponse(
        index_path,
        headers={
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block"
        }
    )

@app.get("/api/")
def read_api_root():
    return {"message": "统一文档转换工具API", "version": "2.1.0"}

@app.post("/api/convert/docx-to-md")
async def convert_docx_to_md_endpoint(file: UploadFile = File(...)):
    """将Word文件转换为Markdown"""
    try:
        # 保存上传的文件到临时目录
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.doc', '.docx']:
            raise HTTPException(status_code=400, detail="只支持DOC和DOCX格式文件")
        
        temp_file_path = os.path.join(TEMP_DIR, file.filename)
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # 执行转换
        result = convert_docx_to_md(temp_file_path)
        output_file = result["output_file"]
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            raise HTTPException(status_code=500, detail="转换失败: 生成的文件不存在")
        
        # 转换成功，清理上传的临时文件
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        # 返回转换后的文件
        return FileResponse(
            path=output_file,
            filename=os.path.basename(output_file),
            media_type="text/markdown"
        )
    except Exception as e:
        # 清理临时文件
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if 'output_file' in locals() and os.path.exists(output_file):
            os.remove(output_file)
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")

@app.post("/api/convert/markdown-to-html")
async def convert_markdown_to_html_endpoint(file: UploadFile = File(...), style: str = Form("default")):
    """将Markdown文件转换为HTML"""
    temp_file_path = None
    output_file = None
    
    try:
        # 保存上传的文件到临时目录
        # 注意：对于前端发送的Blob对象，file.filename可能是空字符串或临时文件名
        file_name = file.filename if file.filename else 'temp.md'
        file_extension = os.path.splitext(file_name)[1].lower()
        
        # 确保文件有正确的扩展名
        if not file_extension:
            file_name = file_name + '.md'
            file_extension = '.md'
        
        temp_file_path = os.path.join(TEMP_DIR, file_name)
        
        # 读取文件内容，限制大小
        content = await file.read()
        content_size = len(content)
        print(f"接收到文件，大小: {content_size}字节")
        
        # 限制文件大小，防止过大的文件导致服务器崩溃
        if content_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="文件过大，最大支持10MB")
        
        # 确保内容是文本格式
        try:
            # 尝试解码为UTF-8，确保是文本
            text_content = content.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="文件不是有效的文本格式")
        
        with open(temp_file_path, "wb") as f:
            f.write(content)
        
        # 直接调用转换器，不指定output_file，让它自动生成文件名
        import time
        start_time = time.time()
        
        # 设置超时控制
        import threading
        result = None
        exception = None
        
        def convert_thread():
            nonlocal result, exception
            try:
                result = convert_markdown_to_html(temp_file_path, options={"style": style})
            except Exception as e:
                exception = e
        
        # 启动转换线程
        thread = threading.Thread(target=convert_thread)
        thread.daemon = True
        thread.start()
        
        # 等待转换完成，最多等待10秒
        thread.join(10)
        
        if thread.is_alive():
            raise TimeoutError("转换超时，内容可能过于复杂")
        
        if exception:
            raise exception
        
        if not result:
            raise Exception("转换失败，没有返回结果")
        
        output_file = result["output_file"]
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            raise HTTPException(status_code=500, detail="转换失败: 生成的文件不存在")
        
        # 读取转换后的HTML文件内容
        with open(output_file, "r", encoding="utf-8") as f:
            full_html_content = f.read()
        
        print(f"转换成功，耗时: {time.time() - start_time:.2f}秒，HTML长度: {len(full_html_content)}字节")
        
        # 对于实时预览，直接返回完整的HTML文件，以便前端使用iframe渲染，保证样式一致
        html_content = full_html_content
        
        return HTMLResponse(content=html_content, media_type="text/html")
    except TimeoutError as e:
        # 转换超时
        print(f"转换超时: {e}")
        raise HTTPException(status_code=504, detail=f"转换超时: {str(e)}")
    except HTTPException:
        # 重新抛出已经处理过的HTTP异常
        raise
    except Exception as e:
        # 打印详细错误信息，方便调试
        print(f"转换失败详细错误: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")
    finally:
        # 清理所有临时文件，无论成功失败
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except:
                pass
        if output_file and os.path.exists(output_file):
            try:
                os.remove(output_file)
            except:
                pass

@app.post("/api/convert/markdown-to-docx")
async def convert_markdown_to_docx_endpoint(file: UploadFile = File(...), style: str = Form("default")):
    """将Markdown文件转换为Word"""
    try:
        # 保存上传的文件到临时目录
        file_name = file.filename if file.filename else 'temp.md'
        
        # 确保文件有正确的扩展名
        if not file_name.endswith(('.md', '.markdown', '.txt')):
            file_name = file_name + '.md'
        
        temp_file_path = os.path.join(TEMP_DIR, file_name)
        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # 执行转换
        options = {"style": style, "output_dir": TEMP_DIR}
        result = convert_markdown_to_docx(temp_file_path, options=options)
        
        if not result["success"]:
            raise Exception(result.get("message", "转换失败"))
            
        output_file = result["output_file"]
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            raise HTTPException(status_code=500, detail="转换失败: 生成的文件不存在")
        
        # 转换成功，清理上传的临时文件
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        # 返回转换后的文件
        return FileResponse(
            path=output_file,
            filename=os.path.basename(output_file),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        # 如果发生错误，清理所有文件
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if 'output_file' in locals() and os.path.exists(output_file):
            os.remove(output_file)
        # 打印错误信息
        print(f"Markdown转Word失败: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")


@app.post("/api/convert/web-to-docx")
async def convert_web_to_docx_endpoint(url: str = Form(...)):
    """将网页转换为DOCX文件"""
    print(f"[DEBUG] 收到web-to-docx请求，URL: {url}")
    output_file = None
    
    try:
        # 验证URL格式
        import re
        url_pattern = re.compile(r'^https?://')
        if not url_pattern.match(url):
            raise HTTPException(status_code=400, detail="URL格式不正确，请输入以http://或https://开头的URL")
        
        # 执行转换，添加超时控制
        import threading
        import time
        result = None
        exception = None
        
        def convert_thread():
            nonlocal result, exception
            try:
                print(f"[DEBUG] 转换线程开始，URL: {url}")
                # 设置转换选项，包括超时时间
                options = {
                    "timeout": 10,  # 设置10秒超时，避免长时间等待
                    "output_dir": TEMP_DIR  # 使用临时目录
                }
                result = convert_web_to_docx(url, options=options)
                print(f"[DEBUG] 转换线程完成，结果: {result}")
            except Exception as e:
                exception = e
                print(f"[DEBUG] 转换线程异常: {type(e).__name__}: {e}")
                import traceback
                traceback.print_exc()
        
        # 启动转换线程
        print(f"[DEBUG] 启动转换线程")
        thread = threading.Thread(target=convert_thread)
        thread.daemon = True
        thread.start()
        
        # 等待转换完成，最多等待20秒
        print(f"[DEBUG] 等待转换线程完成，最多20秒")
        thread.join(20)
        
        # 检查转换是否超时
        if thread.is_alive():
            print(f"[DEBUG] 转换线程超时")
            # 不再抛出500错误，而是返回一个友好的错误信息
            from fastapi.responses import Response
            # 创建一个简单的错误文档
            from docx import Document
            error_doc = Document()
            error_doc.add_heading("转换超时", level=1)
            error_doc.add_paragraph("抱歉，网页转换超时。请检查网络连接或稍后重试。")
            error_doc.add_paragraph(f"URL: {url}")
            error_doc.add_paragraph(f"错误信息: 转换超时，请检查网络连接或稍后重试")
            
            # 保存错误文档到临时文件
            error_file_path = os.path.join(TEMP_DIR, f"转换失败_{int(time.time())}.docx")
            error_doc.save(error_file_path)
            
            # 读取错误文档内容
            with open(error_file_path, "rb") as f:
                content = f.read()
            
            # 清理临时文件
            os.remove(error_file_path)
            
            # 使用urllib.parse.quote编码中文文件名
            import urllib.parse
            encoded_filename = urllib.parse.quote("转换失败_超时.docx")
            return Response(
                content=content,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": f'attachment; filename*=UTF-8''{encoded_filename}',
                    "Content-Length": str(len(content)),
                    "Content-Transfer-Encoding": "binary"
                }
            )
        
        # 检查是否发生异常
        if exception:
            print(f"[DEBUG] 转换过程中发生异常: {str(exception)}")
            # 不再抛出500错误，而是返回一个友好的错误信息
            from fastapi.responses import Response
            from docx import Document
            
            error_doc = Document()
            error_doc.add_heading("转换失败", level=1)
            error_doc.add_paragraph("抱歉，网页转换失败。请检查URL是否正确或稍后重试。")
            error_doc.add_paragraph(f"URL: {url}")
            error_doc.add_paragraph(f"错误信息: {str(exception)}")
            
            # 保存错误文档到临时文件
            error_file_path = os.path.join(TEMP_DIR, f"转换失败_{int(time.time())}.docx")
            error_doc.save(error_file_path)
            
            # 读取错误文档内容
            with open(error_file_path, "rb") as f:
                content = f.read()
            
            # 清理临时文件
            os.remove(error_file_path)
            
            # 使用urllib.parse.quote编码中文文件名
            import urllib.parse
            encoded_filename = urllib.parse.quote("转换失败.docx")
            return Response(
                content=content,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": f'attachment; filename*=UTF-8''{encoded_filename}',
                    "Content-Length": str(len(content)),
                    "Content-Transfer-Encoding": "binary"
                }
            )
        
        # 检查转换结果是否成功
        print(f"[DEBUG] 检查转换结果: {result}")
        if not result or not result.get("success", False):
            message = result.get('message', '未知错误') if result else '转换失败'
            print(f"[DEBUG] 转换失败: {message}")
            
            # 不再抛出500错误，而是返回一个友好的错误信息
            from fastapi.responses import Response
            from docx import Document
            
            error_doc = Document()
            error_doc.add_heading("转换失败", level=1)
            error_doc.add_paragraph("抱歉，网页转换失败。请检查URL是否正确或稍后重试。")
            error_doc.add_paragraph(f"URL: {url}")
            error_doc.add_paragraph(f"错误信息: {message}")
            
            # 保存错误文档到临时文件
            error_file_path = os.path.join(TEMP_DIR, f"转换失败_{int(time.time())}.docx")
            error_doc.save(error_file_path)
            
            # 读取错误文档内容
            with open(error_file_path, "rb") as f:
                content = f.read()
            
            # 清理临时文件
            os.remove(error_file_path)
            
            return Response(
                content=content,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": f'attachment; filename="转换失败.docx"',
                    "Content-Length": str(len(content)),
                    "Content-Transfer-Encoding": "binary"
                }
            )
            
        output_file = result["output_file"]
        print(f"[DEBUG] 转换成功，输出文件: {output_file}")
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            print(f"[DEBUG] 生成的文件不存在: {output_file}")
            # 不再抛出500错误，而是返回一个友好的错误信息
            from fastapi.responses import Response
            from docx import Document
            
            error_doc = Document()
            error_doc.add_heading("转换失败", level=1)
            error_doc.add_paragraph("抱歉，网页转换失败。生成的文件不存在。")
            error_doc.add_paragraph(f"URL: {url}")
            error_doc.add_paragraph(f"错误信息: 生成的文件不存在")
            
            # 保存错误文档到临时文件
            error_file_path = os.path.join(TEMP_DIR, f"转换失败_{int(time.time())}.docx")
            error_doc.save(error_file_path)
            
            # 读取错误文档内容
            with open(error_file_path, "rb") as f:
                content = f.read()
            
            # 清理临时文件
            os.remove(error_file_path)
            
            return Response(
                content=content,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": f'attachment; filename="转换失败.docx"',
                    "Content-Length": str(len(content)),
                    "Content-Transfer-Encoding": "binary"
                }
            )
        
        # 从转换结果中获取网页标题，用于文件名
        web_title = result.get("title", "网页内容")
        # 清理标题，去除非法字符，添加.docx扩展名
        import re
        safe_title = re.sub(r'[\\/:*?"<>|]', "_", web_title)
        filename = f"{safe_title}.docx"
        
        # 打印调试信息
        print(f"[DEBUG] 网页标题: {web_title}")
        print(f"[DEBUG] 安全文件名: {filename}")
        print(f"[DEBUG] 输出文件路径: {output_file}")
        
        # 返回转换后的文件，使用FileResponse自动处理文件名编码
        print(f"[DEBUG] 返回响应，状态码: 200")
        return FileResponse(
            path=output_file,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        # 打印详细错误信息，方便调试
        print(f"[DEBUG] 转换失败详细错误: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        
        # 如果发生错误，清理输出文件
        if output_file and os.path.exists(output_file):
            print(f"[DEBUG] 清理输出文件: {output_file}")
            os.remove(output_file)
        
        # 最终的错误处理，确保返回一个Word文档而不是HTML
        from fastapi.responses import Response
        from docx import Document
        
        error_doc = Document()
        error_doc.add_heading("转换失败", level=1)
        error_doc.add_paragraph("抱歉，网页转换失败。请检查URL是否正确或稍后重试。")
        error_doc.add_paragraph(f"URL: {url}")
        error_doc.add_paragraph(f"错误信息: {str(e)}")
        
        # 保存错误文档到临时文件
        import tempfile
        error_file_path = os.path.join(TEMP_DIR, f"转换失败_{int(time.time())}.docx")
        error_doc.save(error_file_path)
        
        # 读取错误文档内容
        with open(error_file_path, "rb") as f:
            content = f.read()
        
        # 清理临时文件
        os.remove(error_file_path)
        
        return Response(
            content=content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="转换失败.docx"',
                "Content-Length": str(len(content)),
                "Content-Transfer-Encoding": "binary"
            }
        )

@app.get("/api/styles")
def get_styles():
    """获取支持的HTML样式列表"""
    from src.converters.markdown_to_html import STYLES
    return {
        "styles": [
            {"name": style_name, "display_name": style_info["name"]}
            for style_name, style_info in STYLES.items()
        ]
    }

@app.post("/api/convert/pdf-to-word")
async def convert_pdf_to_word_endpoint(file: UploadFile = File(...), use_ocr: bool = Form(False), ocr_lang: str = Form("chi_sim+eng")):
    """将PDF文件转换为Word文档"""
    try:
        # 保存上传的文件到临时目录
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.pdf']:
            raise HTTPException(status_code=400, detail="只支持PDF格式文件")
        
        temp_file_path = os.path.join(TEMP_DIR, file.filename)
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # 执行转换，添加OCR选项
        options = {
            "use_ocr": use_ocr,
            "ocr_lang": ocr_lang
        }
        result = convert_pdf_to_word(temp_file_path, options=options)
        output_file = result["output_file"]
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            raise HTTPException(status_code=500, detail="转换失败: 生成的文件不存在")
        
        # 转换成功，只清理上传的临时文件，不清理输出文件，因为FileResponse需要它
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        # 返回转换后的文件
        return FileResponse(
            path=output_file,
            filename=os.path.basename(output_file),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        # 添加详细的错误日志
        import traceback
        print(f"转换失败的详细错误信息: {traceback.format_exc()}")
        # 如果发生错误，清理所有文件
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if 'output_file' in locals() and os.path.exists(output_file):
            os.remove(output_file)
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")

@app.post("/api/convert/word-to-pdf")
async def convert_word_to_pdf_endpoint(file: UploadFile = File(...), use_ocr: bool = Form(False), ocr_lang: str = Form("chi_sim+eng")):
    """将Word文件转换为PDF文档"""
    try:
        # 保存上传的文件到临时目录
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.doc', '.docx']:
            raise HTTPException(status_code=400, detail="只支持DOC和DOCX格式文件")
        
        temp_file_path = os.path.join(TEMP_DIR, file.filename)
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # 执行转换，添加OCR选项
        options = {
            "use_ocr": use_ocr,
            "ocr_lang": ocr_lang
        }
        result = convert_word_to_pdf(temp_file_path, options=options)
        output_file = result["output_file"]
        
        # 检查文件是否存在
        if not os.path.exists(output_file):
            raise HTTPException(status_code=500, detail="转换失败: 生成的文件不存在")
        
        # 转换成功，只清理上传的临时文件，不清理输出文件，因为FileResponse需要它
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        # 返回转换后的文件
        return FileResponse(
            path=output_file,
            filename=os.path.basename(output_file),
            media_type="application/pdf"
        )
    except Exception as e:
        # 添加详细的错误日志
        import traceback
        print(f"转换失败的详细错误信息: {traceback.format_exc()}")
        # 如果发生错误，清理所有文件
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if 'output_file' in locals() and os.path.exists(output_file):
            os.remove(output_file)
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")






