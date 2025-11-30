from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr
from backend.app.regnskap_orgnr import get_regnskap_orgnr
import asyncio
from backend.routers.kpi_storage import task_store, result_store

router = APIRouter(prefix="/api/kpi-preload", tags=["kpi-preload"])

@router.get("/{orgnr}")
async def preload_kpi_data(orgnr: str):
    if orgnr in task_store or orgnr in result_store:
        return {"status": "already_loading_or_ready"}
    
    async def fetch_data():
        regnskap_task = asyncio.create_task(asyncio.to_thread(get_regnskap_orgnr, orgnr))
        brreg_task = asyncio.create_task(asyncio.to_thread(get_brreg_data_orgnr, orgnr))
        
        regnskap = await regnskap_task
        brreg = await brreg_task
        
        result_store[orgnr] = {"regnskap": regnskap, "brreg": brreg}
        if orgnr in task_store:
            del task_store[orgnr]
    
    task = asyncio.create_task(fetch_data())
    task_store[orgnr] = task
    return {"status": "started"}

