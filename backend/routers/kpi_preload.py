from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr  # sync
from backend.app.regnskap_orgnr import get_regnskap_orgnr  # async
import asyncio
from backend.routers.kpi_storage import task_store, result_store

router = APIRouter(prefix="/api/kpi-preload", tags=["kpi-preload"])


@router.get("/{orgnr}")
async def preload_kpi_data(orgnr: str):
    # If already computing or ready
    if orgnr in task_store or orgnr in result_store:
        return {"status": "already_loading_or_ready"}

    async def fetch_data():
        try:
            # async regnskap
            regnskap_task = asyncio.create_task(get_regnskap_orgnr(orgnr))

            # sync brreg (thread), DO NOT wrap in create_task
            brreg_task = asyncio.to_thread(get_brreg_data_orgnr, orgnr)

            regnskap = await regnskap_task
            brreg = await brreg_task

            # safety check (debug for later)
            if asyncio.iscoroutine(regnskap):
                raise RuntimeError("regnskap unexpectedly coroutine")
            if asyncio.iscoroutine(brreg):
                raise RuntimeError("brreg unexpectedly coroutine")

            result_store[orgnr] = {
                "regnskap": regnskap,
                "brreg": brreg
            }
        finally:
            task_store.pop(orgnr, None)

    # Start background job
    task_store[orgnr] = asyncio.create_task(fetch_data())

    return {"status": "started"}
