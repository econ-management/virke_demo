from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr
from backend.app.regnskap_orgnr import get_regnskap_orgnr
import asyncio
from backend.routers.kpi_storage import task_store, result_store

router = APIRouter(prefix="/api/kpi-result", tags=["kpi-result"])

@router.get("/{orgnr}")
async def get_kpi_result(orgnr: str):
    if orgnr in result_store:
        return result_store[orgnr]
    
    if orgnr in task_store:
        await task_store[orgnr]
        return result_store.get(orgnr, {"regnskap": [], "brreg": []})
    
    regnskap = await asyncio.to_thread(get_regnskap_orgnr, orgnr)
    brreg = await asyncio.to_thread(get_brreg_data_orgnr, orgnr)
    return {"regnskap": regnskap, "brreg": brreg}

