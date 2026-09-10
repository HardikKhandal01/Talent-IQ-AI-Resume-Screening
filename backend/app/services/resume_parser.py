import re

def clean_resume_text(raw_text: str) -> str:
    cleaned_text = re.sub(r'[^\x00-\x7F]+', ' ', raw_text)
    cleaned_text = re.sub(r'\n+', '\n', cleaned_text)
    cleaned_text = re.sub(r'\s{2,}', ' ', cleaned_text)
    return cleaned_text.strip()

def process_resume(file_bytes: bytes, filename: str) -> dict:
    from app.utils.pdf_utils import extract_text_from_pdf
    
    raw_text = extract_text_from_pdf(file_bytes)
    
    # Handling specific PDF extraction edge cases
    if raw_text == "ERROR_ENCRYPTED":
        return {"error": "PDF is password protected. Please upload an unlocked PDF."}
    elif raw_text == "ERROR_EMPTY_SCANNED":
        return {"error": "PDF contains only scanned images. Text-based PDF required."}
    elif raw_text == "ERROR_CORRUPT":
        return {"error": "PDF file is corrupted or unreadable."}
    elif not raw_text:
        return {"error": "Could not extract text from PDF."}
        
    cleaned_text = clean_resume_text(raw_text)
    
    return {
        "filename": filename,
        "raw_length": len(raw_text),
        "cleaned_length": len(cleaned_text),
        "extracted_text": cleaned_text
    }