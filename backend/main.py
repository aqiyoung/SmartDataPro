import uvicorn
import logging

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8005,
        reload=False,
        log_level="debug"
    )
