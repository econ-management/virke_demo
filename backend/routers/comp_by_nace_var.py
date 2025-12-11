from fastapi import APIRouter
from dotenv import load_dotenv
from backend.app.comp_nace_var import get_comp_nace_var
from typing import Optional
from pydantic import BaseModel
import os

load_dotenv()

router = APIRouter(prefix="/api/comp_by_nace_var", tags=["comp_by_nace_var"])

class CompByNaceVarRequest(BaseModel):
    variable_names: list[str]
    calculations: list[list]
    min_value: Optional[int] = None

@router.post("/{nace}")
async def get_comp_by_nace_var(nace: str, request: CompByNaceVarRequest):
    return await get_comp_nace_var(nace, request.variable_names, request.calculations, request.min_value)
