import asyncio
from typing import Dict, Any

task_store: Dict[str, asyncio.Task] = {}
result_store: Dict[str, Dict[str, Any]] = {}

