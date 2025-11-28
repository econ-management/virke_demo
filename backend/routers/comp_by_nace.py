from fastapi import APIRouter
from dotenv import load_dotenv
from app.comp_nace import get_comp_nace
import os

load_dotenv()

router = APIRouter(prefix="/api/comp_by_nace", tags=["comp_by_nace"])

@router.get("/{nace}")
async def get_comp_by_nace(nace: str):
    return get_comp_nace(nace)
