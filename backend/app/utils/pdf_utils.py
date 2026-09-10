import fitz  # PyMuPDF
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from PDF and strictly handles encrypted, scanned, or corrupted files.
    """
    text = ""
    try:
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        
        # Edge Case 1: Password Protected PDF
        if pdf_document.is_encrypted:
            return "ERROR_ENCRYPTED"

        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text("text") + "\n"
        pdf_document.close()
        
        # Edge Case 2: Scanned Image PDF (No selectable text)
        if not text.strip():
            return "ERROR_EMPTY_SCANNED"
            
    except Exception as e:
        # Edge Case 3: Corrupted File
        return "ERROR_CORRUPT"
    
    return text.strip()