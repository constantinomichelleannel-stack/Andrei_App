import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Library, 
  Settings, 
  MessageSquare,
  Plus,
  FileText,
  Clock,
  ChevronRight,
  Scale,
  Gavel,
  Briefcase,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  ShieldAlert,
  Zap,
  Bot,
  Database,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Note, LegalDocument } from './types';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Components
const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <div 
    onClick={onClick}
    className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">LexPH Dashboard</h1>
        <p className="text-slate-500">Agentic Legal Intelligence for Private Practice</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="legal-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">AI AGENT TASKS</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">8</div>
          <p className="text-sm text-slate-500 mt-2">5 automated workflows active</p>
        </div>

        <div className="legal-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">WIN PROBABILITY (AVG)</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">74%</div>
          <p className="text-sm text-slate-500 mt-2">Based on predictive models</p>
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
          <button className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1">
            View all cases <ChevronRight size={16} />
          </button>
        </div>

        <div className="legal-card p-6">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <Briefcase size={20} /> Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {[
              { task: "Filing of Appellant's Brief", client: "ABC Corp", due: "In 2 days", priority: "high" },
              { task: "Pre-trial Conference", client: "Juan Dela Cruz", due: "In 5 days", priority: "medium" },
              { task: "Contract Review", client: "Global Tech", due: "In 1 week", priority: "low" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-l-4 border-slate-200 hover:bg-slate-50 rounded-r-lg transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.task}</div>
                  <div className="text-xs text-slate-500">{item.client}</div>
                </div>
                <div className="text-xs font-medium text-slate-600">{item.due}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResearchAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    
    const statuses = [
      "Analyzing legal issues...",
      "Searching Philippine Jurisprudence...",
      "Identifying relevant statutes...",
      "Synthesizing legal memorandum...",
      "Finalizing citations..."
    ];

    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setAgentStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 1500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: query,
        config: {
          systemInstruction: "You are LexPH, an Agentic AI Legal Research Assistant for Philippine Law. Automate complex research by analyzing issues, searching jurisprudence, and synthesizing comprehensive legal opinions. Cite G.R. Numbers and specific Articles. Tone: Professional, authoritative, precise.",
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to legal database. Please try again." }]);
    } finally {
      clearInterval(statusInterval);
      setAgentStatus(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Agentic Research Assistant</h1>
          <p className="text-slate-500">Autonomous legal research and memorandum synthesis.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          AGENT ONLINE
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-6 bg-white rounded-xl border border-slate-200 shadow-inner">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Bot size={64} strokeWidth={1} className="text-slate-200" />
            <div className="text-center max-w-sm">
              <p className="text-lg font-serif text-slate-400 mb-2">LexPH Agentic Workflow</p>
              <p className="text-sm">Describe a legal problem. The agent will analyze jurisprudence, identify laws, and draft a memorandum for you.</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-800 border border-slate-100'}`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap markdown-body">
                {msg.role === 'assistant' ? <Markdown>{msg.content}</Markdown> : msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-3 min-w-[200px]">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              {agentStatus && (
                <p className="text-xs font-mono text-slate-500 animate-pulse">{agentStatus}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter legal query for autonomous research..."
          className="w-full p-5 pr-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md"
        >
          <Zap size={20} />
        </button>
      </div>
    </div>
  );
};

const PredictiveAnalytics = () => {
  const [facts, setFacts] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!facts.trim()) return;
    setLoading(true);
    setPrediction(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `As a legal predictive analytics tool for Philippine Law, analyze the following case facts and predict the likely outcome based on current jurisprudence and legal principles. 
        Provide:
        1. Probability of Success (Percentage)
        2. Key Legal Strengths
        3. Potential Risks/Weaknesses
        4. Recommended Strategy
        
        Case Facts: ${facts}`,
      });
      setPrediction(response.text || "Analysis failed.");
    } catch (err) {
      console.error(err);
      setPrediction("Error generating predictive analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Predictive Analytics</h1>
        <p className="text-slate-500">Data-driven decision making for private legal practice.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="legal-card p-6">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <BrainCircuit size={20} className="text-indigo-600" /> Case Facts Input
            </h3>
            <textarea 
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              placeholder="Enter the material facts of the case, parties involved, and the specific legal issue..."
              className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm resize-none"
            />
            <button 
              onClick={handlePredict}
              disabled={loading || !facts.trim()}
              className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Zap className="animate-spin" size={20} /> : <TrendingUp size={20} />}
              {loading ? 'Analyzing Jurisprudence...' : 'Generate Prediction'}
            </button>
          </div>

          <div className="legal-card p-6 bg-indigo-50 border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <ShieldAlert size={18} /> Analytics Disclaimer
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Predictive analytics are based on historical jurisprudence and AI patterns. They should be used as a decision-support tool and not as a substitute for professional legal judgment.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="legal-card p-8 min-h-[500px] bg-white relative overflow-hidden">
            {!prediction && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                <BarChart3 size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">Input case facts to generate a data-driven legal prediction.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-1/3" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-4/6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-slate-50 rounded" />
                  <div className="h-32 bg-slate-50 rounded" />
                </div>
              </div>
            )}

            {prediction && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="markdown-body prose prose-slate max-w-none"
              >
                <Markdown>{prediction}</Markdown>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General' });

  useEffect(() => {
    fetch('/api/notes').then(res => res.json()).then(setNotes);
  }, []);

  const handleAddNote = async () => {
    if (!newNote.title) return;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    });
    if (res.ok) {
      const { id } = await res.json();
      setNotes([{ ...newNote, id, created_at: new Date().toISOString() }, ...notes]);
      setNewNote({ title: '', content: '', category: 'General' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Knowledge Portal</h1>
          <p className="text-slate-500">Centralized repository for internal knowledge diffusion.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={20} /> New Insight
        </button>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="legal-card p-6 space-y-4"
        >
          <input 
            type="text" 
            placeholder="Insight Title"
            value={newNote.title}
            onChange={e => setNewNote({...newNote, title: e.target.value})}
            className="w-full text-xl font-serif font-bold focus:outline-none"
          />
          <select 
            value={newNote.category}
            onChange={e => setNewNote({...newNote, category: e.target.value})}
            className="bg-slate-50 text-xs font-mono px-2 py-1 rounded border border-slate-200"
          >
            <option>General</option>
            <option>Civil Law</option>
            <option>Criminal Law</option>
            <option>Labor Law</option>
            <option>Taxation</option>
          </select>
          <textarea 
            placeholder="Start writing..."
            value={newNote.content}
            onChange={e => setNewNote({...newNote, content: e.target.value})}
            className="w-full h-32 focus:outline-none resize-none"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900">Cancel</button>
            <button onClick={handleAddNote} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Save Insight</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="legal-card p-6 flex flex-col h-56 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{note.category}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900"><Share2 size={14} /></button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900"><Database size={14} /></button>
              </div>
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 line-clamp-1">{note.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-3 flex-1">{note.content}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">{new Date(note.created_at).toLocaleDateString()}</span>
              <button className="text-xs font-medium text-slate-900 flex items-center gap-1 hover:underline">
                Read more <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
            <Scale size={20} />
          </div>
          <span className="text-xl font-serif font-bold tracking-tight">LexPH</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={Search} 
            label="Agentic Research" 
            active={activeView === 'research'} 
            onClick={() => setActiveView('research')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Predictive Analytics" 
            active={activeView === 'analytics'} 
            onClick={() => setActiveView('analytics')} 
          />
          <SidebarItem 
            icon={BookOpen} 
            label="Knowledge Portal" 
            active={activeView === 'knowledge'} 
            onClick={() => setActiveView('knowledge')} 
          />
          <SidebarItem 
            icon={Library} 
            label="Document Library" 
            active={activeView === 'library'} 
            onClick={() => setActiveView('library')} 
          />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
          />
          <div className="mt-6 px-4 py-3 bg-slate-50 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Atty. Constantino</p>
              <p className="text-[10px] text-slate-500 truncate">Senior Associate</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'research' && <ResearchAssistant />}
            {activeView === 'analytics' && <PredictiveAnalytics />}
            {activeView === 'knowledge' && <KnowledgeBase />}
            {activeView === 'library' && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Library size={64} strokeWidth={1} />
                <h2 className="text-xl font-serif font-bold text-slate-900">Document Library</h2>
                <p>Upload and manage legal documents, pleadings, and evidence.</p>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg">Upload Document</button>
              </div>
            )}
            {activeView === 'settings' && (
              <div className="max-w-2xl">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-6">Settings</h1>
                <div className="space-y-6">
                  <div className="legal-card p-6">
                    <h3 className="font-bold mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-mono text-slate-400 uppercase">Full Name</label>
                        <input type="text" defaultValue="Atty. Michelle Anne Constantino" className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900" />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-slate-400 uppercase">Roll Number</label>
                        <input type="text" defaultValue="76543" className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
