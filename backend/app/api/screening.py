from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.services.resume_parser import process_resume
from app.services.scoring_engine import calculate_candidate_score
from app.services.ai_assistant import generate_ai_insights, chat_with_ai
import json

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB Security Limit

@router.post("/screen")
async def screen_candidate(
    file: UploadFile = File(...),
    jd_text: str = Form(...),
    jd_skills: str = Form(...) 
):
    # Security 1: MIME Type Validation
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Strictly only PDF files are allowed.")
        
    # Security 2: Empty JD Validation
    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
        
    try:
        try:
            skills_list = json.loads(jd_skills)
        except json.JSONDecodeError:
            skills_list = []

        file_bytes = await file.read()
        
        # Security 3: File Size Limit Validation
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds the 5MB limit.")
            
        resume_data = process_resume(file_bytes, file.filename)
        
        if "error" in resume_data:
            raise HTTPException(status_code=422, detail=resume_data["error"])
            
        resume_text = resume_data.get("extracted_text", "")
        score_results = calculate_candidate_score(resume_text, jd_text, skills_list)
        candidate_name = file.filename.replace(".pdf", "").replace("_", " ")
        
        ai_insights = generate_ai_insights(candidate_name, score_results)
        
        return {
            "candidate_name": candidate_name,
            "match_results": score_results,
            "ai_insights": ai_insights
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatRequest(BaseModel):
    candidate_name: str
    score_data: dict
    question: str

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        answer = chat_with_ai(req.candidate_name, req.score_data, req.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))