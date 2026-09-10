import re
import uuid

# Basic industry skills list for initial extraction
COMMON_SKILLS = [
    "python", "sql", "machine learning", "data science", "pandas",
    "numpy", "scikit-learn", "nlp", "xgboost", "fastapi", "react",
    "docker", "aws", "power bi", "tableau", "statistics", "next.js"
]

def analyze_jd(title: str, description: str) -> dict:
    """
    Analyzes the job description text to extract key requirements.
    """
    desc_lower = description.lower()
    
    # Extract skills
    extracted_skills = []
    for skill in COMMON_SKILLS:
        if skill in desc_lower:
            extracted_skills.append(skill.title())
            
    # Extract experience (e.g., looks for "2+ years", "3 years")
    exp_match = re.search(r'(\d+)\+?\s*(?:-\s*\d+\s*)?years?', desc_lower)
    experience_req = f"{exp_match.group(1)}+ years" if exp_match else "Not explicitly specified"
    
    return {
        "job_id": str(uuid.uuid4()),
        "title": title,
        "extracted_skills": extracted_skills,
        "experience_required": experience_req
    }