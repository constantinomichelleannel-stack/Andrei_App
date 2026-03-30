import React, { useState } from 'react';
import { Gavel, ShieldAlert, FileText, Zap, BrainCircuit, Download, Terminal, Copy, Trash2, ShieldCheck, Activity, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export const WorkflowCenter = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [logs, setLogs] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'agent' }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState(42);

  const workflows = [
    {
      id: 'case-analysis',
      title: 'Case Analysis Pipeline',
      description: 'Analyze facts, find jurisprudence, predict outcome, and draft a memo.',
      icon: Gavel,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'compliance-check',
      title: 'Statutory Compliance Check',
      description: 'Evaluate a fact pattern against specific statutes and identify risks.',
      icon: ShieldAlert,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      id: 'contract-review',
      title: 'Automated Contract Review',
      description: 'Identify high-risk clauses and suggest legal amendments.',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    }
  ];

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'agent' = 'info') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const runWorkflow = async () => {
    if (!input.trim() || !activeWorkflow) return;
    
    setIsRunning(true);
    setLogs([]);
    setResult(null);
    
    const workflow = workflows.find(w => w.id === activeWorkflow);
    addLog(`INITIATING_SEQUENCE: ${workflow?.title} [PRIORITY: ${priority}]`, 'info');

    if (!process.env.GEMINI_API_KEY) {
      addLog("API Key not found. Please add your GEMINI_API_KEY in Settings.", 'error');
      setIsRunning(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const startTime = Date.now();
      
      if (activeWorkflow === 'case-analysis') {
        addLog("Agent: Analyzing material facts and identifying legal issues...", 'agent');
        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze the following case facts and identify the key legal issues and applicable laws in the Philippines: ${input}`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        setLatency(Date.now() - startTime);
        addLog("Facts analyzed and issues identified.", 'success');
        
        const searchStart = Date.now();
        addLog("Agent: Searching Philippine jurisprudence for relevant precedents...", 'agent');
        const searchResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Search for Philippine Supreme Court cases relevant to these legal issues: ${analysisResponse.text}. 
          Provide a list of 3-5 most relevant cases with their citations and brief summaries.`,
          config: { tools: [{ googleSearch: {} }] }
        });
        setLatency(Date.now() - searchStart);
        addLog("Found relevant jurisprudence and precedents.", 'success');

        const predictStart = Date.now();
        addLog("Agent: Predicting case outcome and assessing risks...", 'agent');
        const predictionResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Based on the facts: ${input}, and the jurisprudence found: ${searchResponse.text}, predict the likely outcome of this case in a Philippine court. 
          Include:
          - Win probability (percentage)
          - Major legal risks and vulnerabilities
          - Strategic recommendations for the client.`,
        });
        setLatency(Date.now() - predictStart);
        addLog("Outcome predicted and risks assessed.", 'success');

        const finalStart = Date.now();
        addLog("Agent: Synthesizing final legal memorandum...", 'agent');
        const finalResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Draft a formal legal memorandum for a senior partner based on the following analysis.
          
          Facts: ${input}
          
          Issues & Analysis: ${analysisResponse.text}
          
          Jurisprudence: ${searchResponse.text}
          
          Prediction & Strategy: ${predictionResponse.text}
          
          The memorandum should be professional, structured (Heading, Facts, Issues, Discussion/Analysis, Conclusion/Recommendation), and cite relevant Philippine laws and cases.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        setLatency(Date.now() - finalStart);
        
        setResult(finalResponse.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'compliance-check') {
        const statutesStart = Date.now();
        addLog("Agent: Identifying applicable statutes and regulations...", 'agent');
        const statutesResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Identify all relevant Philippine statutes, executive orders, and administrative regulations applicable to this scenario: ${input}`,
          config: { tools: [{ googleSearch: {} }] }
        });
        setLatency(Date.now() - statutesStart);
        addLog("Applicable laws identified.", 'success');
        
        const complianceStart = Date.now();
        addLog("Agent: Cross-referencing fact pattern with legal provisions...", 'agent');
        const complianceResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze the scenario: ${input} for compliance with the following laws: ${statutesResponse.text}. 
          Identify specific areas of non-compliance and potential penalties.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        setLatency(Date.now() - complianceStart);
        addLog("Compliance analysis completed.", 'success');

        const reportStart = Date.now();
        addLog("Agent: Generating compliance report and remediation plan...", 'agent');
        const finalReport = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Draft a comprehensive Compliance Report based on the analysis:
          
          Scenario: ${input}
          Applicable Laws: ${statutesResponse.text}
          Compliance Analysis: ${complianceResponse.text}
          
          The report should include a summary of findings, a risk assessment matrix, and a step-by-step remediation plan.`,
        });
        setLatency(Date.now() - reportStart);
        
        setResult(finalReport.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'contract-review') {
        const parseStart = Date.now();
        addLog("Agent: Parsing contract clauses and identifying key terms...", 'agent');
        const parsingResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Parse the following contract text and identify key terms, obligations, and termination clauses: ${input}`,
        });
        setLatency(Date.now() - parseStart);
        addLog("Contract parsed.", 'success');
        
        const riskStart = Date.now();
        addLog("Agent: Identifying high-risk provisions and legal pitfalls...", 'agent');
        const riskResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Review the contract terms: ${parsingResponse.text} for high-risk provisions, ambiguities, and potential legal pitfalls under Philippine law.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        setLatency(Date.now() - riskStart);
        addLog("Risks identified.", 'success');

        const summaryStart = Date.now();
        addLog("Agent: Suggesting amendments and drafting review summary...", 'agent');
        const reviewSummary = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a Contract Review Summary based on the analysis:
          
          Contract Text: ${input}
          Key Terms: ${parsingResponse.text}
          Risk Analysis: ${riskResponse.text}
          
          Provide specific suggestions for amendments to mitigate the identified risks and ensure the contract is favorable to the client.`,
        });
        setLatency(Date.now() - summaryStart);
        
        setResult(reviewSummary.text || "Workflow completed with no output.");
      }

      addLog("Workflow completed successfully.", 'success');
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      addLog("An error occurred during the workflow execution: " + msg, 'error');
      if (msg.includes("Forbidden") || msg.includes("403")) {
        addLog("Note: Access Forbidden may be due to 'Google Search' restrictions on your API key. Try a workflow that doesn't require search or check your API key settings.", 'info');
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-300">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tighter uppercase">Workflow Control Center</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">OPERATIONAL INTERFACE V2.5 // AUTONOMOUS LEGAL AGENTS</p>
        </div>
        <div className="hidden md:block text-right font-mono text-[10px] text-slate-600">
          <div>SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          <div>EST_TOKEN_USAGE: 1.2K / 128K</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {workflows.map((w) => (
            <div 
              key={w.id}
              onClick={() => !isRunning && setActiveWorkflow(w.id)}
              className={`relative overflow-hidden p-5 cursor-pointer transition-all border ${
                activeWorkflow === w.id 
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''} rounded-lg group`}
            >
              {activeWorkflow === w.id && (
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              )}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${activeWorkflow === w.id ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-slate-700 bg-slate-800'} ${w.color}`}>
                  <w.icon size={20} />
                </div>
                <div>
                  <h3 className={`font-mono font-bold text-sm ${activeWorkflow === w.id ? 'text-white' : 'text-slate-300'}`}>{w.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-mono uppercase tracking-tight">{w.description}</p>
                </div>
              </div>
            </div>
          ))}

          {activeWorkflow && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Input Parameters</h4>
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              </div>

              {/* Priority Selector */}
              <div className="mb-4">
                <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block mb-2">Sequence Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-[9px] font-mono font-bold rounded border transition-all ${
                        priority === p 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="LOAD DATA SOURCE..."
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded p-4 text-xs font-mono text-indigo-300 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 resize-none mb-4 shadow-inner"
              />
              <button 
                onClick={runWorkflow}
                disabled={isRunning || !input.trim()}
                className="w-full py-3 bg-indigo-600 text-white rounded font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:translate-y-0.5"
              >
                {isRunning ? <Zap className="animate-spin" size={14} /> : <Zap size={14} />}
                {isRunning ? 'EXECUTING_SEQUENCE...' : 'INITIATE_WORKFLOW'}
              </button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="p-8 min-h-[600px] bg-slate-900 border border-slate-800 rounded-lg flex flex-col relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {!activeWorkflow && !isRunning && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-700 text-center relative z-10">
                <div className="relative mb-6">
                  <BrainCircuit size={80} strokeWidth={1} className="opacity-20" />
                  <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                </div>
                <p className="text-xs font-mono uppercase tracking-[0.3em]">System Awaiting Command</p>
                <p className="text-[10px] font-mono mt-2 opacity-50">SELECT WORKFLOW MODULE FROM LEFT PANEL</p>
              </div>
            )}

            {(activeWorkflow || isRunning) && (
              <div className="flex-1 flex flex-col relative z-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50 border-dashed">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      <Terminal size={16} />
                    </div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Execution Terminal</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {logs.length > 0 && (
                      <div className="flex items-center gap-1 mr-2 border-r border-slate-800 pr-2">
                        <button 
                          onClick={() => {
                            const logText = logs.map(l => `[${l.type.toUpperCase()}] ${l.message}`).join('\n');
                            navigator.clipboard.writeText(logText);
                          }}
                          className="p-1.5 text-slate-500 hover:text-white transition-colors"
                          title="Copy Logs"
                        >
                          <Copy size={12} />
                        </button>
                        <button 
                          onClick={() => setLogs([])}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Clear Logs"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    {isRunning && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 text-[9px] font-mono font-bold">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                        ACTIVE_PROCESS
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2 font-mono text-[10px] overflow-y-auto max-h-[250px] mb-8 p-4 bg-black/40 text-slate-400 rounded border border-slate-800/50 backdrop-blur-sm">
                  {logs.length === 0 && <p className="text-slate-700 italic">SYSTEM_IDLE: WAITING_FOR_INPUT...</p>}
                  {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 leading-relaxed ${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'success' ? 'text-emerald-400' : 
                      log.type === 'agent' ? 'text-indigo-300' : 
                      'text-slate-500'
                    }`}>
                      <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      <span className="flex-1">
                        {log.type === 'agent' && <span className="text-indigo-500 mr-2">▶</span>}
                        {log.message}
                      </span>
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex gap-1 mt-2 opacity-50">
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                {result && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 border-t border-slate-800 border-dashed pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Output Buffer</h4>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => navigator.clipboard.writeText(result)}
                          className="text-[9px] font-mono font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors border border-slate-800 px-2 py-1 rounded bg-slate-950"
                        >
                          <Copy size={10} /> COPY_RESULT
                        </button>
                        <button 
                          onClick={() => {
                            const blob = new Blob([result], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `LEX_PH_EXPORT_${new Date().getTime()}.md`;
                            a.click();
                          }}
                          className="text-[9px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 border border-indigo-500/20 px-2 py-1 rounded bg-indigo-500/5"
                        >
                          <Download size={10} /> EXPORT_MD
                        </button>
                      </div>
                    </div>
                    <div className="markdown-body prose prose-invert prose-slate max-w-none text-xs bg-black/20 p-6 rounded border border-slate-800/50 font-sans">
                      <Markdown>{result}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Specialist Status Bar */}
            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-500 animate-pulse shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'}`} />
                  STATUS: <span className={isRunning ? 'text-amber-500' : 'text-emerald-500'}>{isRunning ? 'BUSY' : 'READY'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BrainCircuit size={10} className="text-indigo-500" />
                  CORE: <span className="text-slate-300">GEMINI-3-FLASH</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={10} className="text-emerald-500" />
                  <span className="text-slate-300">SECURE_LINK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={10} className={priority === 'HIGH' ? 'text-red-500' : priority === 'MEDIUM' ? 'text-amber-500' : 'text-indigo-500'} />
                  PRIORITY: <span className={priority === 'HIGH' ? 'text-red-500' : priority === 'MEDIUM' ? 'text-amber-500' : 'text-indigo-500'}>{priority}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Activity size={10} className="text-indigo-500" />
                  LATENCY: <span className="text-slate-300">{latency}MS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={10} className="text-indigo-500" />
                  NODE: <span className="text-slate-300">ASIA-SE1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
