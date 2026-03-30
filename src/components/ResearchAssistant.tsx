import React, { useState, useEffect } from 'react';
import { Bot, History, Download, Save, Check, Copy, CheckCircle2, Search, Zap, X } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';

export const ResearchAssistant = () => {
  const { fetchWithAuth } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, id: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [researchMode, setResearchMode] = useState<'memo' | 'statute' | 'case' | 'article' | 'autonomous'>('memo');
  const [history, setHistory] = useState<{query: string, timestamp: string}[]>([]);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const suggestedQueries = {
    memo: [
      "Requirements for a valid holographic will",
      "Grounds for constructive dismissal in labor law",
      "Elements of Estafa under Art. 315 of RPC"
    ],
    statute: [
      "Republic Act No. 9262 (VAWC)",
      "Article 333 of the Revised Penal Code",
      "Section 5 of the Dangerous Drugs Act"
    ],
    case: [
      "Recent SC rulings on psychological incapacity",
      "Estrada vs. Desierto (G.R. No. 146710)",
      "Landmark cases on freedom of expression"
    ],
    article: [
      "Legal analysis of the Maharlika Investment Fund",
      "Impact of the Anti-Terror Law on civil liberties",
      "Developments in Philippine Cybercrime Law"
    ],
    autonomous: [
      "Conduct a full research on the liability of online platforms for user-generated content in the PH",
      "Analyze the evolution of the 'Doctrine of Command Responsibility' in PH Jurisprudence",
      "Perform a comprehensive legal audit of a standard PH employment contract for BPO employees"
    ]
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('lexph_research_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (q: string) => {
    const newHistory = [{ query: q, timestamp: new Date().toISOString() }, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('lexph_research_history', JSON.stringify(newHistory));
  };

  const handleSend = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;
    
    const userMsg = { role: 'user' as const, content: activeQuery, id: Math.random().toString(36).substring(7) };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    setSources([]);
    saveToHistory(activeQuery);
    
    const statuses = {
      memo: ["Analyzing legal issues...", "Searching Jurisprudence...", "Identifying Statutes...", "Synthesizing Memorandum...", "Finalizing Citations..."],
      statute: ["Searching Statutes...", "Identifying Relevant Articles...", "Checking Amendments...", "Cross-referencing Laws...", "Finalizing Citations..."],
      case: ["Searching Jurisprudence...", "Identifying Key Rulings...", "Analyzing Precedents...", "Checking Case Status...", "Finalizing Citations..."],
      article: ["Searching Legal Journals...", "Retrieving Scholarly Articles...", "Analyzing Legal Commentary...", "Synthesizing Perspectives...", "Finalizing References..."],
      autonomous: ["Initializing Autonomous Agent...", "Decomposing Research Goal...", "Searching Jurisprudence...", "Analyzing Statutes...", "Cross-referencing Precedents...", "Synthesizing Multi-step Analysis...", "Finalizing Comprehensive Report..."]
    };

    const activeStatuses = statuses[researchMode];
    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (statusIdx < activeStatuses.length) {
        setAgentStatus(activeStatuses[statusIdx]);
        statusIdx++;
      }
    }, 1500);

    if (!process.env.GEMINI_API_KEY) {
      const errorMsg = { 
        role: 'assistant' as const, 
        content: "API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.", 
        id: 'error-' + Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
      setLoading(false);
      clearInterval(statusInterval);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let systemPrompt = "You are LexPH, an advanced Agentic AI Legal Research Assistant specializing in Philippine Law. Your goal is to provide highly accurate, authoritative, and precisely cited legal analysis. Always maintain a professional and objective tone.";
      
      if (researchMode === 'memo') {
        systemPrompt += `
        ROLE: Senior Legal Consultant.
        TASK: Automate complex research by analyzing legal issues, searching relevant jurisprudence, and synthesizing comprehensive legal opinions.
        FORMAT: Formal Legal Memorandum.
        STRUCTURE:
        1. TO: [Recipient]
        2. FROM: LexPH AI Assistant
        3. DATE: ${new Date().toLocaleDateString()}
        4. RE: [Subject Matter]
        5. FACTS: Concise summary of material facts.
        6. ISSUES: Clearly stated legal questions.
        7. DISCUSSION/ANALYSIS: Detailed application of law and jurisprudence to the facts.
        8. CONCLUSION: Definitive legal opinion and recommended course of action.
        CITATIONS: Use standard Philippine legal citation format (e.g., G.R. No., Date, SCRA).`;
      } else if (researchMode === 'statute') {
        systemPrompt += `
        ROLE: Statutory Expert.
        TASK: Locate and explain specific Philippine laws, Republic Acts, Executive Orders, and Administrative Regulations.
        INSTRUCTIONS:
        - Provide the exact title and number of the law.
        - Quote relevant provisions verbatim where possible.
        - Explain the current status (e.g., amended by RA XXX, repealed by RA YYY).
        - Cross-reference with related statutes or implementing rules (IRR).
        - Cite the Official Gazette or official government sources.`;
      } else if (researchMode === 'case') {
        systemPrompt += `
        ROLE: Jurisprudence Specialist.
        TASK: Identify relevant Supreme Court cases and legal precedents.
        INSTRUCTIONS:
        - Provide full Case Titles and G.R. Numbers.
        - Include the date of promulgation.
        - Summarize the material facts, the specific legal issue, and the Court's definitive ruling (Ratio Decidendi).
        - Highlight the specific legal doctrine or principle established.
        - Use SCRA or Philippine Reports citations.`;
      } else if (researchMode === 'article') {
        systemPrompt += `
        ROLE: Legal Academic/Scholar.
        TASK: Retrieve and analyze legal articles, scholarly journals, and expert commentaries.
        INSTRUCTIONS:
        - Synthesize different legal perspectives and academic theories on the topic.
        - Reference reputable legal journals (e.g., Philippine Law Journal, Ateneo Law Journal).
        - Analyze the evolution of legal thought on the subject.`;
      } else if (researchMode === 'autonomous') {
        systemPrompt += `
        ROLE: Autonomous Legal Research Agent.
        TASK: Perform complex, multi-step research tasks with minimal supervision.
        INSTRUCTIONS:
        - Decompose the user's request into logical research steps.
        - Search for relevant jurisprudence, statutes, and administrative issuances.
        - Analyze findings iteratively to refine the search.
        - Provide a comprehensive, data-driven report with actionable legal intelligence.
        - Focus on operational efficiency and strategic depth.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: activeQuery,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { 
            thinkingLevel: researchMode === 'autonomous' || researchMode === 'memo' ? ThinkingLevel.HIGH : ThinkingLevel.LOW 
          }
        }
      });
      
      const text = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: text, id: Math.random().toString(36).substring(7) }]);

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedSources = chunks
          .filter(c => c.web)
          .map(c => ({ title: c.web!.title, uri: c.web!.uri }));
        setSources(extractedSources);
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Error connecting to AI service. Please try again.";
      
      if (err.message) {
        if (err.message.includes("API_KEY_INVALID")) {
          errorMessage = "Invalid API Key. Please check your GEMINI_API_KEY in the Settings > Secrets menu.";
        } else if (err.message.includes("QUOTA_EXCEEDED")) {
          errorMessage = "API Quota exceeded. Please try again later.";
        } else if (err.message.includes("SAFETY")) {
          errorMessage = "The request was blocked by safety filters.";
        } else if (err.message.includes("Forbidden") || err.message.includes("403")) {
          errorMessage = "Access Forbidden. This may be due to the 'Google Search' tool being restricted for your API key. Please check your API key's permissions or try a different research mode.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, id: 'error-' + Date.now() }]);
    } finally {
      clearInterval(statusInterval);
      setAgentStatus(null);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('lexph_research_history');
  };

  const downloadAsMarkdown = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LexPH_Research_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToRepository = async (content: string, id: string) => {
    setIsSaving(id);
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const file = new File([blob], `Research_${new Date().getTime()}.md`, { type: 'text/markdown' });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Research: ${messages.find(m => m.role === 'user')?.content.substring(0, 30)}...`);
      formData.append('type', 'memo');
      formData.append('tags', 'AI Research, Legal Memo');

      const res = await fetchWithAuth('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSavedIds(prev => [...prev, id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Legal Research Assistant</h1>
          <p className="text-slate-500">Autonomous agents, statutory analysis, and memorandum synthesis.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setResearchMode('memo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'memo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Memo
            </button>
            <button 
              onClick={() => setResearchMode('statute')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'statute' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Statutes
            </button>
            <button 
              onClick={() => setResearchMode('case')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'case' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Cases
            </button>
            <button 
              onClick={() => setResearchMode('article')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'article' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Articles
            </button>
            <button 
              onClick={() => setResearchMode('autonomous')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'autonomous' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Autonomous Agent
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            AGENTIC WORKFLOW ACTIVE
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 shadow-inner">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
              <Bot size={80} strokeWidth={1} className="text-slate-300 relative z-10" />
            </div>
            <div className="text-center max-w-md space-y-4">
              <h2 className="text-xl font-serif text-slate-600">How can I assist your research?</h2>
              <p className="text-sm leading-relaxed">Describe a legal problem or ask for specific jurisprudence. I will analyze issues, search laws, and generate structured legal analysis.</p>
              
              <div className="pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">Suggested Topics</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQueries[researchMode].map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {history.length > 0 && (
                <div className="pt-6 border-t border-slate-200/60 w-full">
                  <div className="flex items-center justify-between mb-3 px-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <History size={12} /> Recent Research
                    </p>
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {history.map((h, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(h.query)}
                        className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm truncate max-w-[150px]"
                        title={h.query}
                      >
                        {h.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative group max-w-[85%] p-6 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white shadow-xl rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => downloadAsMarkdown(msg.content)}
                    className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-all"
                    title="Download as Markdown"
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    onClick={() => handleSaveToRepository(msg.content, msg.id)}
                    className={`p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all ${isSaving === msg.id ? 'animate-pulse' : ''} ${savedIds.includes(msg.id) ? 'text-emerald-600 bg-emerald-50' : ''}`}
                    title={savedIds.includes(msg.id) ? "Saved to Repository" : "Save to Repository"}
                    disabled={savedIds.includes(msg.id)}
                  >
                    {savedIds.includes(msg.id) ? <Check size={14} /> : <Save size={14} />}
                  </button>
                  <button 
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === msg.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              )}
              <div className="text-sm leading-relaxed markdown-body prose prose-slate max-w-none">
                {msg.role === 'assistant' ? <Markdown>{msg.content}</Markdown> : msg.content}
              </div>
              
              {msg.role === 'assistant' && i === messages.length - 1 && sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Verified Grounding Sources</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle2 size={10} /> GROUNDED
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all truncate max-w-[240px]"
                      >
                        <Search size={10} className="text-slate-400" />
                        <span className="truncate">{src.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex flex-col gap-4 min-w-[280px]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              {agentStatus && (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-indigo-600 font-bold flex items-center gap-2">
                    <Zap size={14} className="animate-pulse" /> {agentStatus}
                  </p>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-1000 group-focus-within:duration-200" />
        <div className="relative flex items-start">
          <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your legal research problem..."
            className="w-full p-5 pr-16 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all shadow-lg min-h-[64px] max-h-[300px] resize-none"
            rows={1}
            style={{ height: 'auto' }}
            ref={(el) => {
              if (el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-16 top-6 p-1 text-slate-400 hover:text-slate-600 transition-all"
              title="Clear"
            >
              <X size={16} />
            </button>
          )}
          <button 
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="absolute right-3 top-3 p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:hover:bg-slate-900"
          >
            <Zap size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
