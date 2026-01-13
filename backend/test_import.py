#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本，用于检查app模块的导入错误
"""

import sys
import traceback

print("Starting import...")
try:
    import app
    print("Import successful!")
except Exception as e:
    print(f"Import failed with error: {type(e).__name__}: {e}")
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)