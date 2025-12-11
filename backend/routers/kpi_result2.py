from fastapi import APIRouter, Query
import asyncio

from backend.app.brreg_data_orgnr import get_brreg_data_orgnr   # sync
from backend.app.comp_nace_var import get_comp_nace_var         # async
from backend.app.nace_dev_var import get_nace_dev_var           # sync

from backend.routers.kpi_storage import result_store, result_store2, task_store2

# EXACT mapping from frontend kpiOptionMapper
KPI_MAP = {
    "Driftsmargin": {
        "variable_names": ["ebit", "driftsinntekter_sum"],
        "calculations": [[0, "divide", 1]],
        "min_value": None,
    },
    "Omsetning": {
        "variable_names": ["driftsinntekter_sum"],
        "calculations": [[0, "clean"]],
        "min_value": 0,
    },
    "Lønnskostnader": {
        "variable_names": ["lonn_trygd_pensjon", "driftsinntekter_sum"],
        "calculations": [[0, "divide", 1]],
        "min_value": 0,
    },
    "Varekostnader": {
        "variable_names": ["varekostnad", "driftsinntekter_sum"],
        "calculations": [[0, "divide", 1]],
        "min_value": 0,
    },
}

router = APIRouter(prefix="/api/kpi-result2", tags=["kpi-result2"])


@router.get("/{orgnr}")
async def get_kpi_result2(
    orgnr: str,
    metric: str = Query(..., description="Metric name such as 'Driftsmargin'")
):
    """
    Fetch ONE KPI (metric) at a time.

    Example:
    /api/kpi-result2/977213193?metric=Driftsmargin
    """
    # --- FIX OLD BROKEN STATE ---
    if orgnr in task_store2 and not isinstance(task_store2[orgnr], dict):
        task_store2.pop(orgnr, None)
    # -----------------------------
    # 1. Validate metric
    # -----------------------------
    if metric not in KPI_MAP:
        return {"error": f"Unknown metric '{metric}'"}

    config = KPI_MAP[metric]

    if orgnr not in result_store2:
        result_store2[orgnr] = {"comp_by_nace_var": {}, "nace_dev_var": {}}

    # -----------------------------
    # 2. If cached → return immediately
    # -----------------------------
    if orgnr in result_store2:
        comp_cache = result_store2[orgnr]["comp_by_nace_var"]
        dev_cache = result_store2[orgnr]["nace_dev_var"]

        if metric in comp_cache:
            return {
                "comp_by_nace_var": {metric: comp_cache[metric]},
                "nace_dev_var": {metric: dev_cache[metric]},
            }

    # -----------------------------
    # 3. Ensure brreg info exists (system 1)
    # -----------------------------
    if orgnr in result_store:
        brreg = result_store[orgnr]["brreg"]
    else:
        brreg = await asyncio.to_thread(get_brreg_data_orgnr, orgnr)

    if not brreg or "naring1_kode" not in brreg[0]:
        return {"comp_by_nace_var": {}, "nace_dev_var": {}}

    nace = brreg[0]["naring1_kode"]

    # -----------------------------
    # 4. If metric is already being computed, wait for it
    # -----------------------------
    if orgnr in task_store2 and metric in task_store2[orgnr]:
        await task_store2[orgnr][metric]
        return {
            "comp_by_nace_var": {metric: result_store2[orgnr]["comp_by_nace_var"][metric]},
            "nace_dev_var": {metric: result_store2[orgnr]["nace_dev_var"][metric]},
        }

    # -----------------------------
    # 5. Compute the metric (async + sync combo)
    # -----------------------------
    async def compute_metric():
        try:
            comp_task = asyncio.create_task(
                get_comp_nace_var(
                    nace,
                    config["variable_names"],
                    config["calculations"],
                    config["min_value"],
                )
            )

            dev_task = asyncio.to_thread(
                get_nace_dev_var,
                nace,
                config["variable_names"],
                config["calculations"],
            )

            comp_result = await comp_task
            dev_result = await dev_task

            # Store result
            if orgnr not in result_store2:
                result_store2[orgnr] = {"comp_by_nace_var": {}, "nace_dev_var": {}}

            result_store2[orgnr]["comp_by_nace_var"][metric] = comp_result
            result_store2[orgnr]["nace_dev_var"][metric] = dev_result

        finally:
            # Cleanup
            if orgnr in task_store2:
                task_store2[orgnr].pop(metric, None)

    # -----------------------------
    # 6. Create per-metric task
    # -----------------------------
    if orgnr not in task_store2:
        task_store2[orgnr] = {}

    task_store2[orgnr][metric] = asyncio.create_task(compute_metric())

    # Wait for completion (frontend expects data NOW)
    await task_store2[orgnr][metric]

    # -----------------------------
    # 7. Return final result
    # -----------------------------
    return {
        "comp_by_nace_var": {metric: result_store2[orgnr]["comp_by_nace_var"][metric]},
        "nace_dev_var": {metric: result_store2[orgnr]["nace_dev_var"][metric]},
    }
