import asyncio
from typing import Dict, Any

task_store: Dict[str, asyncio.Task] = {}
result_store: Dict[str, Dict[str, Any]] = {}

task_store2: Dict[str, asyncio.Task] = {}
result_store2: Dict[str, Dict[str, Any]] = {}
