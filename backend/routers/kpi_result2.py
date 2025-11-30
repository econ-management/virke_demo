from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr
from backend.app.comp_nace_var import get_comp_nace_var
from backend.app.nace_dev_var import get_nace_dev_var
import asyncio
from backend.routers.kpi_storage import task_store2, result_store2

router = APIRouter(prefix="/api/kpi-result2", tags=["kpi-result2"])

@router.get("/{orgnr}")
async def get_kpi_result2(orgnr: str):
    if orgnr in result_store2:
        return result_store2[orgnr]
    
    if orgnr in task_store2:
        await task_store2[orgnr]
        return result_store2.get(orgnr, {"comp_by_nace_var": {}, "nace_dev_var": {}})
    
    brreg = await asyncio.to_thread(get_brreg_data_orgnr, orgnr)
    
    if not brreg or not isinstance(brreg, list) or len(brreg) == 0:
        return {"comp_by_nace_var": {}, "nace_dev_var": {}}
    
    if 'error' in brreg[0] or not brreg[0].get('naring1_kode'):
        return {"comp_by_nace_var": {}, "nace_dev_var": {}}
    
    nace = brreg[0]['naring1_kode']
    
    variable_names_comp = ["ebit", "driftsinntekter_sum"]
    calculations_comp = [[0, "divide", 1]]
    min_value = None
    
    comp_by_nace_var = await asyncio.to_thread(get_comp_nace_var, nace, variable_names_comp, calculations_comp, min_value)
    nace_dev_var = await asyncio.to_thread(get_nace_dev_var, nace, variable_names_comp, calculations_comp)
    
    return {
        "comp_by_nace_var": {"Driftsmargin": comp_by_nace_var},
        "nace_dev_var": {"Driftsmargin": nace_dev_var}
    }

