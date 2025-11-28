from fastapi import APIRouter
from dotenv import load_dotenv
from backend.app.regnskap_orgnr import get_regnskap_orgnr
import os

load_dotenv()

router = APIRouter(prefix="/api/regnskap", tags=["regnskap"])

@router.get("/{orgnr}")
async def get_regskap_by_orgnr(orgnr: str):
    return get_regnskap_orgnr(orgnr)
