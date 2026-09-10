export default function SettingsPage() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-soft max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Platform Settings</h2>
      <div className="space-y-4">
        <p className="text-slate-600">Model Preferences: <span className="font-semibold text-blue-600">Gemini 1.5 Pro</span></p>
        <p className="text-slate-600">Strict Match Threshold: <span className="font-semibold text-blue-600">75%</span></p>
      </div>
    </div>
  );
}