from fastapi import APIRouter
from dotenv import load_dotenv
from backend.app.brreg_data_orgnr import get_brreg_data_orgnr
import os

load_dotenv()

router = APIRouter(prefix="/api/brreg_data", tags=["brreg_data"])

@router.get("/{orgnr}")
async def get_brreg_data_by_orgnr(orgnr: str):
    return get_brreg_data_orgnr(orgnr)
