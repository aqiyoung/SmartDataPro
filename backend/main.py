import uvicorn
import logging

# 设置日志级别，生产环境使用INFO级别以提高性能
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8016,
        reload=False,
        log_level="info",
        # 优化Uvicorn服务器配置
        workers=1,  # Docker容器中使用1个工作进程，避免资源竞争
        backlog=1024,  # 连接队列大小
        timeout_keep_alive=65,  # 保持连接的超时时间
        limit_concurrency=500,  # 限制并发连接数
        limit_max_requests=100000,  # 每个工作进程处理的最大请求数
        forwarded_allow_ips="*"  # 允许所有IP的转发请求
    )
