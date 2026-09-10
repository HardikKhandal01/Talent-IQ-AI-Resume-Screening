"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { 
  Home, FileSearch, Users, ArrowLeftRight, Briefcase, 
  Bot, BarChart2, Settings, Search, Bell, Menu, X, Sparkles, CheckCircle2 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// 1. Sidebar Component (Code ko clean rakhne ke liye)
const SidebarContent = ({ pathname, setIsSidebarOpen }: any) => {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Screening", icon: FileSearch, path: "/screening" },
    { name: "Candidates", icon: Users, path: "/candidates" },
    { name: "Compare", icon: ArrowLeftRight, path: "/compare" },
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
    { name: "AI Assistant", icon: Bot, path: "/assistant" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">TalentIQ AI</span>
        </div>
        {/* Mobile Close Button */}
        <button 
          type="button"
          className="lg:hidden text-slate-400 p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} className="pointer-events-none" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5 shrink-0 border-t border-white/5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-3 shadow-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          <h4 className="text-white text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-slate-400 text-xs mb-3">Get advanced analytics, custom filters and more.</p>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadHistory = () => {
      const saved = JSON.parse(localStorage.getItem("talentiq_history") || "[]");
      setHistory(saved);
    };
    loadHistory();
    window.addEventListener("candidate_screened", loadHistory);
    return () => window.removeEventListener("candidate_screened", loadHistory);
  }, []);

  const searchResults = history.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-light text-slate-900`}>
        
        {/* ===================================================================== */}
        {/* GUARANTEED FIX: EXACT MODAL CLONE METHOD FOR MOBILE SIDEBAR */}
        {/* ===================================================================== */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[99999] flex lg:hidden">
            {/* Dark Background Overlay (Clicks here close the sidebar) */}
            <div 
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Solid Sidebar Box (No sliding CSS, just direct render) */}
            <aside className="relative w-72 h-full bg-brand-dark shadow-2xl flex flex-col z-10">
              <SidebarContent pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
            </aside>
          </div>
        )}

        {/* MAIN APP WRAPPER */}
        <div className="flex h-screen w-full overflow-hidden">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-72 h-full bg-brand-dark shrink-0 z-10 shadow-2xl">
            <SidebarContent pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
            
            <header className="h-20 bg-white/90 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
              
              {/* Hamburger Button (Fixed pointer events & type) */}
              <button 
                type="button"
                className="lg:hidden text-slate-800 p-2 hover:bg-slate-100 rounded-xl cursor-pointer active:scale-95 transition-transform" 
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={28} className="pointer-events-none" />
              </button>
              
              <div className="flex items-center gap-2 flex-1">
                <div className="relative w-full max-w-md hidden sm:block ml-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search previous candidates..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {/* Real-time Search Dropdown */}
                  {searchQuery && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-glass border border-slate-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase">Search Results</p>
                      </div>
                      {searchResults.length > 0 ? searchResults.map((res, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedCandidate(res);
                            setSearchQuery("");
                          }}
                          className="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">{res.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{res.date} • {res.details.match_results.recommendation}</p>
                          </div>
                          <span className="text-sm font-black text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
                            {res.score}%
                          </span>
                        </div>
                      )) : (
                        <div className="p-6 text-sm text-slate-500 text-center">No matching candidates found in history.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                <button className="text-slate-400 hover:text-slate-600 relative p-2 cursor-pointer">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4 lg:pl-6 cursor-pointer hover:opacity-80">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center border border-blue-200">
                    HS
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-bold text-slate-800">Hardik Sharma</p>
                    <p className="text-xs text-slate-500 font-medium">Recruiter</p>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Scroll Container with heavy bottom padding to fix cut-off */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-12 scroll-smooth relative z-0">
              <div className="max-w-[1400px] mx-auto w-full">
                {children}
              </div>
            </div>

            {/* Candidate Quick View Modal (This was working perfectly, now Sidebar uses same logic) */}
            {selectedCandidate && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-glass relative">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">{selectedCandidate.name}</h3>
                      <p className="text-sm text-slate-500">Screened on {selectedCandidate.date}</p>
                    </div>
                    <button onClick={() => setSelectedCandidate(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 cursor-pointer transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase">Overall Match</p>
                      <p className="text-3xl font-black text-blue-600 mt-1">{selectedCandidate.score}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col justify-center">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Status</p>
                      <span className="text-sm font-bold bg-emerald-100 text-emerald-700 py-1.5 px-3 rounded-lg mx-auto">
                        {selectedCandidate.details.match_results.recommendation}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className="text-blue-500"/> AI Summary Snapshot
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedCandidate.details.ai_insights?.summary || "No AI summary available."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}