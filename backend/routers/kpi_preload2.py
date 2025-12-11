from fastapi import APIRouter
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr   # sync
from backend.app.comp_nace_var import get_comp_nace_var        # async
from backend.app.nace_dev_var import get_nace_dev_var          # sync
import asyncio
from backend.routers.kpi_storage import task_store2, result_store2

router = APIRouter(prefix="/api/kpi-preload2", tags=["kpi-preload2"])


@router.get("/{orgnr}")
async def preload_kpi_data2(orgnr: str):

    # Already running or ready?
    if orgnr in task_store2 or orgnr in result_store2:
        return {"status": "already_loading_or_ready"}

    async def compute():
        try:
            # Load brreg (sync)
            brreg = await asyncio.to_thread(get_brreg_data_orgnr, orgnr)

            # Basic validation
            if not brreg or not isinstance(brreg, list) or len(brreg) == 0:
                result_store2[orgnr] = {
                    "comp_by_nace_var": {},
                    "nace_dev_var": {}
                }
                return

            if "error" in brreg[0] or not brreg[0].get("naring1_kode"):
                result_store2[orgnr] = {
                    "comp_by_nace_var": {},
                    "nace_dev_var": {}
                }
                return

            nace = brreg[0]["naring1_kode"]

            variable_names_comp = ["ebit", "driftsinntekter_sum"]
            calculations_comp = [[0, "divide", 1]]

            # Run async + sync tasks in parallel
            comp_task = asyncio.create_task(
                get_comp_nace_var(nace, variable_names_comp, calculations_comp, None)
            )
            nace_task = asyncio.to_thread(
                get_nace_dev_var, nace, variable_names_comp, calculations_comp
            )

            comp = await comp_task
            nace_dev = await nace_task

            # Store result
            result_store2[orgnr] = {
                "comp_by_nace_var": {"Driftsmargin": comp},
                "nace_dev_var": {"Driftsmargin": nace_dev}
            }

        finally:
            task_store2.pop(orgnr, None)

    # Start background compute
    task_store2[orgnr] = asyncio.create_task(compute())

    return {"status": "started"}
