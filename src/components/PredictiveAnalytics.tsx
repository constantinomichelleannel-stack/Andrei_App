import React, { useState, useRef } from 'react';
import { Download, RotateCcw, BrainCircuit, Zap, TrendingUp, ShieldAlert, BarChart3, Gavel, CheckCircle2, Scale } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI, Type } from "@google/genai";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { LegalPrediction } from '../types';

export const PredictiveAnalytics = () => {
  const [facts, setFacts] = useState('');
  const [prediction, setPrediction] = useState<LegalPrediction | null>(null);
  const [previousProbability, setPreviousProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!reportRef.current || !prediction) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`LexPH_Legal_Prediction_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePredict = async () => {
    if (!facts.trim()) return;
    if (prediction) {
      setPreviousProbability(prediction.probability);
    }
    setLoading(true);
    setPrediction(null);

    if (!process.env.GEMINI_API_KEY) {
      alert("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As a legal predictive analytics tool for Philippine Law, analyze the following case facts. 
        Identify the key legal issues involved and predict the likely outcome based on current jurisprudence and legal principles. 
        
        Case Facts: ${facts}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              probability: { type: Type.NUMBER, description: "Probability of success as a percentage (0-100)" },
              legalIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key legal issues identified" },
              likelyOutcome: { type: Type.STRING, description: "A concise summary of the likely judicial outcome" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key legal strengths" },
              risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risks or weaknesses" },
              strategy: { type: Type.STRING, description: "Recommended legal strategy" },
              analysis: { type: Type.STRING, description: "Detailed legal analysis and reasoning" },
            },
            required: ["probability", "legalIssues", "likelyOutcome", "strengths", "risks", "strategy", "analysis"],
          }
        },
      });
      
      const result = JSON.parse(response.text || "{}");
      setPrediction(result);
    } catch (err) {
      console.error(err);
      // Fallback or error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Predictive Analytics</h1>
          <p className="text-slate-500">Data-driven decision making for private legal practice.</p>
        </div>
        {prediction && (
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all shadow-sm font-medium disabled:opacity-50"
          >
            {isExporting ? <RotateCcw className="animate-spin" size={18} /> : <Download size={18} />}
            {isExporting ? 'Generating PDF...' : 'Export Report'}
          </button>
        )}
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
          <div ref={reportRef} className="legal-card p-8 min-h-[600px] bg-white relative overflow-hidden">
            {!prediction && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                <BarChart3 size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">Input case facts to generate a data-driven legal prediction.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-40 bg-slate-50 rounded-xl" />
                  <div className="h-40 bg-slate-50 rounded-xl" />
                </div>
                <div className="h-32 bg-slate-50 rounded-xl" />
              </div>
            )}

            {prediction && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="transparent"
                        stroke="#F1F5F9"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="transparent"
                        stroke={prediction.probability > 70 ? "#10B981" : prediction.probability > 40 ? "#F59E0B" : "#EF4444"}
                        strokeWidth="12"
                        strokeDasharray={440}
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * prediction.probability) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-serif font-bold text-slate-900">{prediction.probability}%</span>
                      {previousProbability !== null && (
                        <div className={`flex items-center gap-0.5 text-[10px] font-bold ${prediction.probability >= previousProbability ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {prediction.probability >= previousProbability ? '+' : ''}{prediction.probability - previousProbability}%
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">WIN PROBABILITY</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <TrendingUp size={14} /> Prediction Analysis
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Likely Judicial Outcome</h2>
                    <p className="text-slate-900 text-sm font-medium leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-4 border-slate-900">
                      {prediction.likelyOutcome}
                    </p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Based on current Philippine jurisprudence and similar case patterns, the probability of a favorable ruling is estimated at {prediction.probability}%.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Gavel size={16} /> Key Legal Issues
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prediction.legalIssues.map((issue, i) => (
                      <div key={i} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <h3 className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                      <CheckCircle2 size={16} /> Key Strengths
                    </h3>
                    <ul className="space-y-3">
                      {prediction.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-emerald-900 flex gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-2xl">
                    <h3 className="text-xs font-mono text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                      <ShieldAlert size={16} /> Potential Risks
                    </h3>
                    <ul className="space-y-3">
                      {prediction.risks.map((r, i) => (
                        <li key={i} className="text-sm text-rose-900 flex gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-2xl">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" /> Recommended Strategy
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    {prediction.strategy}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={16} /> Detailed Legal Analysis
                  </h3>
                  <div className="text-slate-700 text-sm leading-relaxed markdown-body prose prose-slate max-w-none">
                    <Markdown>{prediction.analysis}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
