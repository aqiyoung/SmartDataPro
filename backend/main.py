import os
import logging
import uvicorn

# 从环境变量读取配置
host = os.getenv("HOST", "0.0.0.0")
port = int(os.getenv("PORT", "8016"))
log_level = os.getenv("LOG_LEVEL", "info").lower()
workers = int(os.getenv("WORKERS", "1"))

logging.basicConfig(
    level=getattr(logging, log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("smartdatapro")

if __name__ == "__main__":
    logger.info(f"Starting SmartDataPro on {host}:{port}")
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=False,
        log_level=log_level,
        workers=workers,
        backlog=1024,
        timeout_keep_alive=65,
        limit_concurrency=500,
        limit_max_requests=100000,
    )
