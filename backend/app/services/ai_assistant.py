import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def _get_ai_response_with_fallback(prompt: str) -> str:
    """Tries multiple API keys sequentially. Uses verified active model 'gemini-2.5-flash'."""
    keys = [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3"),
        os.getenv("GEMINI_API_KEY")
    ]
    valid_keys = [k for k in keys if k and k.strip() != ""]
    
    if not valid_keys:
        raise Exception("No valid API keys found in .env file.")
        
    last_error = ""
    for key in valid_keys:
        try:
            genai.configure(api_key=key.strip())
            
            # Direct hit to the active model we found in your terminal
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            err_str = str(e).lower()
            last_error = str(e)
            
            # 429 Quota Exceeded error handling - Seamlessly moves to the next API key
            if "429" in err_str or "quota" in err_str or "exhausted" in err_str:
                print(f"⚠️ Quota exceeded for current key, seamlessly switching to next...")
                continue
            else:
                print(f"⚠️ Model error with current key, trying next... ({last_error})")
                continue
                
    raise Exception(f"AI Generation Failed. All keys exhausted. Last error: {last_error}")

def generate_ai_insights(candidate_name: str, match_results: dict) -> dict:
    matched = ', '.join(match_results['matched_skills']) if match_results['matched_skills'] else 'None'
    missing = ', '.join(match_results['missing_skills']) if match_results['missing_skills'] else 'None'
    
    prompt = f"""
    You are an elite, highly intelligent Technical Recruiter AI.
    Analyze this candidate objectively:
    - Name: {candidate_name}
    - Score: {match_results['overall_score']}%
    - Matched Skills: {matched}
    - Missing Skills: {missing}
    
    Provide a pure JSON response (NO markdown formatting, NO ```json, just the raw JSON brackets) with exactly two keys:
    "summary": "A highly professional, intelligent 3-4 sentence evaluation highlighting their exact potential, strengths, and the real impact of their missing skills.",
    "questions": ["Professional question to test a matched skill deeply", "Question assessing adaptability for missing skills", "Advanced technical problem-solving question"]
    """
    
    try:
        response_text = _get_ai_response_with_fallback(prompt)
        
        # Aggressive cleanup to ensure strict JSON parsing
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1)
        if response_text.startswith("```"):
            response_text = response_text.replace("```", "", 1)
        if response_text.endswith("```"):
            response_text = response_text[::-1].replace("```", "", 1)[::-1]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        return {
            "summary": f"AI Insights temporarily unavailable. Error: {str(e)}",
            "questions": []
        }

def chat_with_ai(candidate_name: str, score_data: dict, question: str) -> str:
    prompt = f"""
    You are an elite Technical Recruiter AI Assistant. 
    You are advising a human recruiter about a candidate named '{candidate_name}'.
    Candidate Profile Context: {json.dumps(score_data)}
    
    The Recruiter asks: "{question}"
    
    Provide a smart, insightful, and highly professional answer. Be concise but detailed enough to help make a hiring decision. Do not use markdown wrappers.
    """
    try:
        return _get_ai_response_with_fallback(prompt)
    except Exception as e:
        return f"Sorry, I couldn't process that right now. {str(e)}"