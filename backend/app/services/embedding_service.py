from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """
    Calculates the cosine similarity between Resume and Job Description
    using TF-IDF Vectorization. 100% stable on Windows Python 3.13.
    """
    if not resume_text or not jd_text:
        return 0.0

    # Initialize TF-IDF Vectorizer, ignoring common stop words
    vectorizer = TfidfVectorizer(stop_words='english')

    try:
        # Fit and transform the texts into vectors
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])

        # Calculate cosine similarity between the two document vectors
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Convert to percentage
        score = round(float(similarity) * 100, 2)
        return max(0.0, min(100.0, score))
    except Exception as e:
        print(f"Similarity Calculation Error: {e}")
        return 0.0