# TalentIQ AI 🚀

An enterprise-grade, AI-powered Resume Screening and Candidate Intelligence platform. TalentIQ AI automates the recruitment pipeline by analyzing resumes against job descriptions, providing semantic match scoring, and offering a real-time conversational AI assistant to query candidate profiles.

## ✨ Key Features

*   **Smart Semantic Matching:** Uses TF-IDF vectorization combined with exact keyword matching to generate an accurate overall match score (0-100%).
*   **AI Candidate Insights:** Integrates with Google Gemini 2.5 Flash to generate professional, objective summaries of a candidate's strengths and skill gaps.
*   **Dynamic API Fallback System:** Built-in multi-key rotation ensures uninterrupted AI processing even if API rate limits are hit.
*   **Real-time AI Chatbox:** Recruiters can ask the AI assistant specific questions about a candidate's profile seamlessly.
*   **Local Search History:** Automatically saves screened profiles to a persistent local storage for instant retrieval via a global search bar (⌘K).
*   **Premium Floating Glass UI:** Designed with Tailwind CSS v4, featuring dynamic circular progress rings, responsive mobile drawers, and smooth transitions.

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, React, Tailwind CSS v4, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI / NLP** | Google Generative AI (Gemini 2.5 Flash), Scikit-learn (TF-IDF) |
| **PDF Processing** | PyMuPDF (fitz) |

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   Google Gemini API Key(s)

### 1. Backend Setup (FastAPI)

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your API keys:

```env
GEMINI_API_KEY_1=your_first_api_key_here
GEMINI_API_KEY_2=your_second_api_key_here
GEMINI_API_KEY_3=your_third_api_key_here
```

Start the backend server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API documentation will be available at `http://localhost:8000/docs`.*

### 2. Frontend Setup (Next.js)

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```
*Access the application at `http://localhost:3000`.*

## 🌍 Deployment Options

**Frontend (Vercel):**
1. Add `NEXT_PUBLIC_API_URL` to your Vercel Environment Variables pointing to your hosted backend (e.g., `https://your-backend.onrender.com/api`).
2. Deploy the `frontend` directory.

**Backend (Render):**
1. Set the Root Directory to `backend`.
2. Use the Build Command: `pip install -r requirements.txt`
3. Use the Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add your `GEMINI_API_KEY` variables to the Render environment settings.
5.