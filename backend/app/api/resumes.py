from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import process_resume

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload a single resume PDF and extract its content.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        # Read file into memory
        file_bytes = await file.read()
        
        # Process the resume
        result = process_resume(file_bytes, file.filename)
        
        if "error" in result:
            raise HTTPException(status_code=422, detail=result["error"])
            
        return {
            "message": "Resume processed successfully",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))