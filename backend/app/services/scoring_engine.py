from app.services.embedding_service import calculate_semantic_similarity

def calculate_skill_match(resume_text: str, required_skills: list) -> dict:
    """
    Checks which required skills are present in the resume.
    """
    resume_lower = resume_text.lower()
    matched = []
    missing = []
    
    for skill in required_skills:
        if skill.lower() in resume_lower:
            matched.append(skill)
        else:
            missing.append(skill)

    score = (len(matched) / len(required_skills) * 100) if required_skills else 0
    return {"score": score, "matched": matched, "missing": missing}

def calculate_candidate_score(resume_text: str, jd_text: str, required_skills: list) -> dict:
    """
    Combines Semantic Match and Skill Match to generate a final weighted score.
    """
    # 1. Semantic Match (50% Weight) - Meaning and context based
    semantic_score = calculate_semantic_similarity(resume_text, jd_text)
    
    # 2. Skill Match (50% Weight) - Exact keyword requirement based
    skill_data = calculate_skill_match(resume_text, required_skills)
    skill_score = skill_data["score"]
    
    # Final Weighted Score calculation
    final_score = (semantic_score * 0.5) + (skill_score * 0.5)
    
    # AI Recommendation Logic based on thresholds
    if final_score >= 80:
        recommendation = "Strong Match"
    elif final_score >= 65:
        recommendation = "Shortlist"
    elif final_score >= 50:
        recommendation = "Review"
    else:
        recommendation = "Low Match"
        
    return {
        "overall_score": round(final_score, 1),
        "semantic_score": round(semantic_score, 1),
        "skill_score": round(skill_score, 1),
        "matched_skills": skill_data["matched"],
        "missing_skills": skill_data["missing"],
        "recommendation": recommendation
    }