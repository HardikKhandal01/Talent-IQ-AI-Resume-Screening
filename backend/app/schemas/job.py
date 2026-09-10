from pydantic import BaseModel
from typing import List, Optional

class JobCreate(BaseModel):
    title: str
    description: str

class JobResponse(BaseModel):
    job_id: str
    title: str
    extracted_skills: List[str]
    experience_required: Optional[str]