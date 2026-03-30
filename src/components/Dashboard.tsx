import React, { useMemo } from 'react';
import { 
  BrainCircuit, 
  Scale, 
  TrendingUp, 
  Library, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Gavel, 
  Book, 
  ChevronRight 
} from 'lucide-react';
import { useDocumentStore } from '../store';

export const Dashboard = ({ 
  onViewAllJurisprudence,
  onViewAnalytics,
  onViewWorkflows,
  onViewStatutes
}: { 
  onViewAllJurisprudence: () => void,
  onViewAnalytics: () => void,
  onViewWorkflows: () => void,
  onViewStatutes: () => void
}) => {
  const { documents } = useDocumentStore();
  
  const citationStats = useMemo(() => {
    const stats = {
      valid: 0,
      caution: 0,
      invalid: 0,
      unchecked: 0
    };
    
    documents.forEach(doc => {
      const status = doc.citation_check?.status || 'unchecked';
      if (status in stats) {
        stats[status as keyof typeof stats]++;
      }
    });
    
    return stats;
  }, [documents]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">LexPH Dashboard</h1>
        <p className="text-slate-500">Agentic Legal Intelligence Framework</p>
      </header>

      <div className="legal-card p-8 bg-indigo-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
            <BrainCircuit size={24} className="text-indigo-300" /> Research Framework: Agentic AI in Legal Practice
          </h2>
          <p className="text-indigo-100 leading-relaxed text-sm italic">
            "This research assesses the impact of Agentic AI and its associated technologies in providing legal research towards automation. 
            It evaluates the ability to enhance internal knowledge diffusion and data-driven decision making through advanced predictive analytics. 
            Exclusively focused on private legal practice, the study assesses how agentic and fully autonomous machine workflows enhance operational 
            and client service efficiency, thereby increasing the competitiveness of the practice."
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> AI Research Assistant
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Knowledge Management Portal
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Advanced Predictive Analytics
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
          <BrainCircuit size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="legal-card p-6 bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale size={24} />
            </div>
            <span className="text-xs font-mono opacity-60">ACTIVE CASES</span>
          </div>
          <div className="text-4xl font-serif font-bold">12</div>
          <p className="text-sm opacity-60 mt-2">+2 from last month</p>
        </div>

        <div 
          onClick={onViewWorkflows}
          className="legal-card p-6 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-900 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">AI AGENT TASKS</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">Active</div>
          <p className="text-sm text-slate-500 mt-2">Automated workflows active</p>
        </div>

        <div 
          onClick={onViewAnalytics}
          className="legal-card p-6 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-900 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">WIN PROBABILITY (AVG)</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">74%</div>
          <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> +3.2% from last week
          </p>
        </div>

        <div className="legal-card p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
              <Library size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">TOTAL DOCUMENTS</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">{documents.length}</div>
          <p className="text-sm text-slate-500 mt-2">In document library</p>
        </div>
      </div>

      <div className="legal-card p-6">
        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
          <ShieldAlert size={20} className="text-indigo-600" /> Citation Validation Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-lg text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-900">{citationStats.valid}</div>
              <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Valid Citations</div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-lg text-white">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-900">{citationStats.caution}</div>
              <div className="text-xs font-medium text-amber-700 uppercase tracking-wider">Caution Required</div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-4">
            <div className="p-3 bg-rose-500 rounded-lg text-white">
              <XCircle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-900">{citationStats.invalid}</div>
              <div className="text-xs font-medium text-rose-700 uppercase tracking-wider">Invalid Citations</div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-400 rounded-lg text-white">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{citationStats.unchecked}</div>
              <div className="text-xs font-medium text-slate-700 uppercase tracking-wider">Unchecked</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="legal-card p-6">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <Gavel size={20} /> Recent Jurisprudence
          </h3>
          <div className="space-y-4">
            {[
              { title: "People vs. Santos", gr: "G.R. No. 245123", date: "Feb 20, 2026" },
              { title: "Cruz vs. Republic", gr: "G.R. No. 210987", date: "Feb 15, 2026" },
              { title: "SMC vs. NLRC", gr: "G.R. No. 198765", date: "Feb 10, 2026" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-b border-slate-100 last:border-0">
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.gr}</div>
                </div>
                <div className="text-xs text-slate-400">{item.date}</div>
              </div>
            ))}
          </div>
          <button 
            onClick={onViewAllJurisprudence}
            className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
          >
            View all cases <ChevronRight size={16} />
          </button>
        </div>

        <div className="legal-card p-6">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <Book size={20} /> Statutes & Regulations
          </h3>
          <div className="space-y-4">
            {[
              { title: "Revised Penal Code", type: "Code", year: "1930" },
              { title: "Civil Code of the PH", type: "Code", year: "1949" },
              { title: "Data Privacy Act", type: "RA 10173", year: "2012" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-b border-slate-100 last:border-0">
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.type}</div>
                </div>
                <div className="text-xs text-slate-400">{item.year}</div>
              </div>
            ))}
          </div>
          <button 
            onClick={onViewStatutes}
            className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
          >
            Search all laws <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
