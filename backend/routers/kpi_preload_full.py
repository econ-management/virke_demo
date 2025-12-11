from fastapi import APIRouter
import asyncio

from backend.app.brreg_data_orgnr import get_brreg_data_orgnr   # sync
from backend.app.regnskap_orgnr import get_regnskap_orgnr       # async
from backend.app.comp_nace_var import get_comp_nace_var         # async
from backend.app.nace_dev_var import get_nace_dev_var           # sync

# Reuse existing stores
from backend.routers.kpi_storage import (
    task_store,
    result_store,
    task_store2,
    result_store2,
)

router = APIRouter(prefix="/api/kpi-preload-full", tags=["kpi-preload-full"])


@router.get("/{orgnr}")
async def preload_kpi_full(orgnr: str):
    """
    Fire-and-forget preload of:
      - regnskap + brreg (system 1)
      - comp_by_nace_var + nace_dev_var (system 2, depends on NACE)
    """

    # 1. If everything already loaded, no need to start anything.
    if orgnr in result_store and orgnr in result_store2:
        return {"status": "already_ready"}

    # 2. If a full (or partial) task is already running, do not start another.
    #    We treat any running task in task_store as covering both systems.
    if orgnr in task_store:
        return {"status": "already_loading"}

    async def compute_full():
        try:
            # ---- STEP 1: Load regnskap + brreg (system 1) ----
            # regnskap: async (uses asyncpg/pool internally)
            regnskap_task = asyncio.create_task(get_regnskap_orgnr(orgnr))
            # brreg: sync → run in a thread
            brreg_task = asyncio.to_thread(get_brreg_data_orgnr, orgnr)

            regnskap = await regnskap_task
            brreg = await brreg_task

            # Store system 1 result
            result_store[orgnr] = {
                "regnskap": regnskap,
                "brreg": brreg,
            }

            # ---- STEP 2: If possible, load system 2 (comp_by_nace_var + nace_dev_var) ----
            nace = None
            if (
                brreg
                and isinstance(brreg, list)
                and len(brreg) > 0
                and brreg[0].get("naring1_kode")
            ):
                nace = brreg[0]["naring1_kode"]

            if not nace:
                # We still want a stable shape in result_store2
                result_store2[orgnr] = {
                    "comp_by_nace_var": {},
                    "nace_dev_var": {},
                }
                return

            variable_names_comp = ["ebit", "driftsinntekter_sum"]
            calculations_comp = [[0, "divide", 1]]

            # comp_nace_var: async
            comp_task = asyncio.create_task(
                get_comp_nace_var(nace, variable_names_comp, calculations_comp, None)
            )
            # nace_dev_var: sync → thread
            nace_task = asyncio.to_thread(
                get_nace_dev_var,
                nace,
                variable_names_comp,
                calculations_comp,
            )

            comp = await comp_task
            nace_dev = await nace_task

            # Store system 2 result
            result_store2[orgnr] = {
                "comp_by_nace_var": {"Driftsmargin": comp},
                "nace_dev_var": {"Driftsmargin": nace_dev},
            }

        finally:
            # Clean up task tracking for BOTH systems
            task_store.pop(orgnr, None)
            task_store2.pop(orgnr, None)

    # 3. Start background job once and share it across both systems
    task = asyncio.create_task(compute_full())
    task_store[orgnr] = task
    task_store2[orgnr] = task  # so kpi-result2 logic can also await it if needed

    return {"status": "started"}
