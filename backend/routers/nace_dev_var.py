from fastapi import APIRouter
from dotenv import load_dotenv
from backend.app.nace_dev_var import get_nace_dev_var
from pydantic import BaseModel
import os

load_dotenv()

router = APIRouter(prefix="/api/nace_dev_var", tags=["nace_dev_var"])

class NaceDevVarRequest(BaseModel):
    variable_names: list[str]
    calculations: list[list]

@router.post("/{nace}")
async def get_comp_by_nace_var(nace: str, request: NaceDevVarRequest):
    return get_nace_dev_var(nace, request.variable_names, request.calculations)
