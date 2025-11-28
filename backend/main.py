from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import regnskap, brreg_data, comp_by_nace

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regnskap.router)
app.include_router(brreg_data.router)
app.include_router(comp_by_nace.router)
