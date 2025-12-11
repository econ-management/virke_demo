from fastapi import APIRouter
import asyncio

from backend.app.brreg_data_orgnr import get_brreg_data_orgnr  # sync
from backend.app.regnskap_orgnr import get_regnskap_orgnr      # async
from backend.routers.kpi_storage import task_store, result_store

router = APIRouter(prefix="/api/kpi-result", tags=["kpi-result"])


@router.get("/{orgnr}")
async def get_kpi_result(orgnr: str):

    # 1. Cached result available?
    if orgnr in result_store:
        return result_store[orgnr]

    # 2. A full preload or system-1 preload isrunning
    if orgnr in task_store:
        await task_store[orgnr]
        return result_store.get(orgnr, {"regnskap": [], "brreg": []})

    # 3. No preload running → compute system 1 now
    async def compute():
        try:
            regnskap_task = asyncio.create_task(get_regnskap_orgnr(orgnr))
            brreg_task = asyncio.to_thread(get_brreg_data_orgnr, orgnr)

            regnskap = await regnskap_task
            brreg = await brreg_task

            result_store[orgnr] = {
                "regnskap": regnskap,
                "brreg": brreg
            }

        finally:
            task_store.pop(orgnr, None)

    # Start compute once
    task_store[orgnr] = asyncio.create_task(compute())

    # Wait for result and return it
    await task_store[orgnr]
    return result_store[orgnr]
