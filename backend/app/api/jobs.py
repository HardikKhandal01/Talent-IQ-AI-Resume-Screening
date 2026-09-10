from fastapi import APIRouter, HTTPException
from app.schemas.job import JobCreate, JobResponse
from app.services.jd_analyzer import analyze_jd

router = APIRouter()

@router.post("/analyze", response_model=JobResponse)
async def analyze_job_description(job: JobCreate):
    """
    Endpoint to analyze a job description and extract requirements.
    """
    try:
        result = analyze_jd(job.title, job.description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))