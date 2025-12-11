print("MAIN FILE LOADED")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import regnskap, brreg_data, comp_by_nace_var, kpi_preload, kpi_result, nace_dev_var, kpi_preload2, kpi_result2, kpi_preload_full
from backend.db.pool import init_pool

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("Initializing asyncpg connection pool...")
    await init_pool() 

@app.get("/")
def root():
    return {"status": "ok"}
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(regnskap.router)
app.include_router(brreg_data.router)
app.include_router(comp_by_nace_var.router)
app.include_router(kpi_preload.router)
app.include_router(kpi_result.router)
app.include_router(nace_dev_var.router)
app.include_router(kpi_preload2.router)
app.include_router(kpi_result2.router)
app.include_router(kpi_preload_full.router)