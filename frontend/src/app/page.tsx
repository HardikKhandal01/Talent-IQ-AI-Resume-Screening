import { Users, FileText, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Recruiter</h1>
        <p className="text-slate-500 mt-1">Here is your candidate pipeline overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Candidates", value: "124", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Strong Matches", value: "18", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Review", value: "45", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Screened Today", value: "12", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}