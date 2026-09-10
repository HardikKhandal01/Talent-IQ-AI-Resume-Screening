"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Zap, BrainCircuit, Lightbulb, MapPin, Briefcase, Send, BarChart2, X, MessageSquare } from "lucide-react";

// FIX 1: Dynamic Text Size for Circles
const CircularProgress = ({ percentage, color = "stroke-blue-600", size = 120, strokeWidth = 8 }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Dynamic text size based on circle size
  const textSize = size < 80 ? "text-xl" : "text-3xl";
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`${color} transition-all duration-1000 ease-out`} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`${textSize} font-black text-slate-800`}>{percentage}%</span>
      </div>
    </div>
  );
};

export default function ScreeningPage() {
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [autoSkills, setAutoSkills] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Chatbox States
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // FIX 2: Dynamic API Base URL for Mobile Support
  const getApiBase = () => {
    // Apna Render ka live link yahan paste karo, aur dhyan rakhna end me '/api' zaroor laga ho!
    return "https://talent-iq-ai-resume-screening.onrender.com/api";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleScreening = async () => {
    if (!jdText || !file) {
      setError("Please provide both Job Description and a Resume PDF.");
      return;
    }
    setLoading(true); setError(""); setResult(null); setChatHistory([]);

    try {
      const API_BASE = getApiBase();
      
      const jdResponse = await fetch(`${API_BASE}/jobs/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Analyzed Job", description: jdText }),
      });
      if (!jdResponse.ok) throw new Error("Failed to analyze Job Description");
      const jdData = await jdResponse.json();
      setAutoSkills(jdData.extracted_skills);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jd_text", jdText);
      formData.append("jd_skills", JSON.stringify(jdData.extracted_skills));

      const screenResponse = await fetch(`${API_BASE}/screening/screen`, {
        method: "POST", body: formData,
      });

      if (!screenResponse.ok) throw new Error("Failed to screen resume");
      const screenData = await screenResponse.json();
      setResult(screenData);

      // Save to History (Functional Search Bar Logic)
      const existingHistory = JSON.parse(localStorage.getItem("talentiq_history") || "[]");
      const newRecord = {
        id: Date.now(), name: screenData.candidate_name, score: screenData.match_results.overall_score,
        date: new Date().toLocaleDateString(), details: screenData
      };
      const filteredHistory = existingHistory.filter((h: any) => h.name !== screenData.candidate_name);
      localStorage.setItem("talentiq_history", JSON.stringify([newRecord, ...filteredHistory]));
      window.dispatchEvent(new Event("candidate_screened"));
      
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // FIX 3: Chat Logic
  const handleChat = async () => {
    if (!chatMsg.trim() || !result) return;
    
    const userMsg = chatMsg;
    setChatMsg("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const API_BASE = getApiBase();
      const chatRes = await fetch(`${API_BASE}/screening/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: result.candidate_name,
          score_data: result.match_results,
          question: userMsg
        })
      });
      
      if (!chatRes.ok) throw new Error("Chat failed");
      const chatData = await chatRes.json();
      
      setChatHistory(prev => [...prev, { role: "ai", text: chatData.answer }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "ai", text: "Error connecting to AI Assistant. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
            Welcome back, <span className="font-bold text-slate-800">Hardik</span> 👋
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Find the Right Talent, <span className="text-transparent bg-clip-text bg-gradient-primary">Faster</span>
          </h1>
          <p className="text-slate-500 mt-2">Upload resumes, add a job description and let AI do the heavy lifting.</p>
        </div>
        <div className="hidden lg:flex gap-4">
          {[
            { icon: BrainCircuit, title: "AI Analysis", desc: "NLP + ML powered", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Zap, title: "Smart Ranking", desc: "Find best matches", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Lightbulb, title: "Detailed Insights", desc: "Make better decisions", color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-3 pr-6 rounded-2xl shadow-glass border border-slate-100">
              <div className={`p-2.5 rounded-xl ${f.bg} ${f.color}`}><f.icon size={20} /></div>
              <div><p className="text-sm font-bold text-slate-800">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Zone */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-500" size={20} /> Job Description</h2>
            </div>
            <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-3 text-slate-400 font-serif font-bold text-sm">
                <span>B</span><span className="italic">I</span><span className="underline">U</span>
              </div>
              <textarea
                className="w-full h-40 p-4 text-slate-700 placeholder-slate-400 focus:outline-none resize-none text-sm leading-relaxed"
                placeholder="Paste the job description or requirements here..."
                value={jdText} onChange={(e) => setJdText(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><Upload className="text-blue-500" size={20} /> Upload Resumes</h2>
            <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors group mb-4">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Upload className="text-blue-500" size={24} />
                </div>
                <span className="text-slate-800 font-bold">Drag & drop your resumes here</span>
                <span className="text-slate-400 text-xs mt-1">Supports PDF, DOCX (Max 5MB)</span>
              </div>
            </div>
            {file && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl pr-4 mb-6">
                <div className="bg-red-100 text-red-600 p-2 rounded-lg"><FileText size={16} /></div>
                <div className="flex-1 truncate"><p className="text-xs font-bold text-slate-700 truncate">{file.name}</p></div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
            <button
              onClick={handleScreening} disabled={loading}
              className="w-full bg-gradient-primary text-white font-bold py-4 rounded-2xl shadow-glow hover:opacity-90 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? "Analyzing..." : "Start Analysis →"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Engine */}
        <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-glass p-6 md:p-8 min-h-[600px] flex flex-col relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="text-blue-500" size={22} /> AI Analysis Results
              </h2>
              <p className="text-sm text-slate-500 mt-1">Your candidate analysis will appear here</p>
            </div>
            {result && <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Ready</span>}
          </div>

          {!result && !loading && (
            <div className="flex-1 flex items-center justify-center text-center opacity-40">
              <div><BrainCircuit size={64} className="mx-auto text-slate-300 mb-4" /><p className="text-slate-500 font-medium">Upload a profile to begin</p></div>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-blue-600">
              <Loader2 className="animate-spin mb-4" size={48} /><p className="animate-pulse font-medium text-slate-500">Extracting semantic entities...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">
              
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="shrink-0">
                  <CircularProgress percentage={result.match_results.overall_score} size={140} strokeWidth={12} color="stroke-blue-600" />
                  <p className="text-center text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">Overall Match</p>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-slate-800">{result.candidate_name}</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                      {result.match_results.recommendation}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-slate-500 text-sm font-medium mb-5">
                    <span className="flex items-center gap-1.5"><Briefcase size={14}/> {result.match_results.experience_required || "3.4 years"}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14}/> Remote, India</span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {result.match_results.matched_skills.slice(0, 5).map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-lg text-xs font-bold shadow-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 className="text-blue-500" size={18} /> Score Breakdown</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <CircularProgress percentage={result.match_results.skill_score} size={70} strokeWidth={6} color="stroke-emerald-500" />
                    <p className="text-xs font-bold text-slate-600 mt-3 text-center">Skills Match</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <CircularProgress percentage={result.match_results.semantic_score} size={70} strokeWidth={6} color="stroke-blue-500" />
                    <p className="text-xs font-bold text-slate-600 mt-3 text-center">Semantic Fit</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <CircularProgress percentage={88} size={70} strokeWidth={6} color="stroke-purple-500" />
                    <p className="text-xs font-bold text-slate-600 mt-3 text-center">Experience</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <CircularProgress percentage={100} size={70} strokeWidth={6} color="stroke-indigo-500" />
                    <p className="text-xs font-bold text-slate-600 mt-3 text-center">Education</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Lightbulb className="text-blue-500" size={18} /> Key Insights</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full shrink-0"><CheckCircle2 size={18}/></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Professional AI Summary</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{result.ai_insights?.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Chat History Box */}
              {chatHistory.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 max-h-64 overflow-y-auto mt-6">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 text-slate-400 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-2 items-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Chat Input Pinned to Bottom */}
          {result && !loading && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
              <div className="relative shadow-glass rounded-full bg-white">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><MessageSquare size={18} /></div>
                <input 
                  type="text" 
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask AI anything about this candidate..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-12 pr-16 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors" 
                />
                <button 
                  onClick={handleChat}
                  disabled={chatLoading || !chatMsg.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}