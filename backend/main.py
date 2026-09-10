from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import resumes, jobs, screening

app = FastAPI(title="TalentIQ API", version="1.0.0")

# FIX: Allow mobile IP to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Changed to "*" so mobile can fetch data
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(screening.router, prefix="/api/screening", tags=["Screening Engine"])

@app.get("/")
def read_root():
    return {"status": "online", "system": "TalentIQ API"}