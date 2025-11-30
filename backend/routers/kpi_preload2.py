from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr
from backend.app.comp_nace_var import get_comp_nace_var
from backend.app.nace_dev_var import get_nace_dev_var
import asyncio
from backend.routers.kpi_storage import task_store2, result_store2

router = APIRouter(prefix="/api/kpi-preload2", tags=["kpi-preload2"])

@router.get("/{orgnr}")
async def preload_kpi_data2(orgnr: str):
    if orgnr in task_store2 or orgnr in result_store2:
        return {"status": "already_loading_or_ready"}
    
    async def fetch_data():
        brreg = await asyncio.to_thread(get_brreg_data_orgnr, orgnr)
        
        if not brreg or not isinstance(brreg, list) or len(brreg) == 0:
            result_store2[orgnr] = {"comp_by_nace_var": {}, "nace_dev_var": {}}
            if orgnr in task_store2:
                del task_store2[orgnr]
            return
        
        if 'error' in brreg[0] or not brreg[0].get('naring1_kode'):
            result_store2[orgnr] = {"comp_by_nace_var": {}, "nace_dev_var": {}}
            if orgnr in task_store2:
                del task_store2[orgnr]
            return
        
        nace = brreg[0]['naring1_kode']
        
        variable_names_comp = ["ebit", "driftsinntekter_sum"]
        calculations_comp = [[0, "divide", 1]]
        min_value = None
        
        comp_task = asyncio.create_task(asyncio.to_thread(get_comp_nace_var, nace, variable_names_comp, calculations_comp, min_value))
        nace_dev_task = asyncio.create_task(asyncio.to_thread(get_nace_dev_var, nace, variable_names_comp, calculations_comp))
        
        comp_by_nace_var = await comp_task
        nace_dev_var = await nace_dev_task
        
        result_store2[orgnr] = {
            "comp_by_nace_var": {"Driftsmargin": comp_by_nace_var},
            "nace_dev_var": {"Driftsmargin": nace_dev_var}
        }
        if orgnr in task_store2:
            del task_store2[orgnr]
    
    task = asyncio.create_task(fetch_data())
    task_store2[orgnr] = task
    return {"status": "started"}

