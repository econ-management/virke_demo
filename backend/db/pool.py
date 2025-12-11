# backend/db/pool.py

import asyncpg
import os
from backend.models.general_methods import raw_url_conv

pool = None  # DO NOT compute DSN here

async def init_pool():
    global pool
    if pool is None:
        # Load environment inside function
        econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))

        print("Creating asyncpg pool with DSN:", econm_url)

        pool = await asyncpg.create_pool(
            dsn=econm_url,
            min_size=5,
            max_size=20
        )

    return pool
