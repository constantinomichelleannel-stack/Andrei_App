import React, { useState } from 'react';
import { Search, Zap, Book, Activity, Database, Download } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI, Type } from "@google/genai";

export const StatuteSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSelectedLaw(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for specific Philippine laws, statutes, or regulations related to: ${query}. 
        Return a JSON array of objects, each with: 'title' (e.g., Republic Act No. 9262), 'description' (brief summary), 'year' (enactment year), and 'relevance' (why it matches).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                year: { type: Type.STRING },
                relevance: { type: Type.STRING },
              },
              required: ["title", "description", "year", "relevance"]
            }
          }
        }
      });

      if (response.text) {
        setResults(JSON.parse(response.text));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLawDetails = async (lawTitle: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a detailed breakdown of ${lawTitle}. Include its full title, date of effectivity, key provisions, and its current status (active, amended, or repealed). Also provide a brief explanation of its impact on Philippine law.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      setSelectedLaw({ title: lawTitle, details: response.text });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Statutes & Regulations</h1>
        <p className="text-slate-500">Advanced search for Philippine Republic Acts, Presidential Decrees, and Administrative Orders.</p>
      </header>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by law number, title, or subject (e.g., 'RA 9165' or 'Cybercrime Law')..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-50"
        >
          {loading ? <Zap className="animate-spin" size={20} /> : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest px-2">Search Results</h3>
          {results.length === 0 && !loading && (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              <Book size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm italic">No results yet. Try searching for a specific law.</p>
            </div>
          )}
          {results.map((law, i) => (
            <div 
              key={i}
              onClick={() => fetchLawDetails(law.title)}
              className={`legal-card p-5 cursor-pointer transition-all border-2 ${
                selectedLaw?.title === law.title ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900">{law.title}</h4>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{law.year}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">{law.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                <Activity size={12} /> {law.relevance}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="legal-card p-8 min-h-[500px] bg-white">
            {!selectedLaw && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center">
                <Database size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">Select a law from the results to view detailed provisions and status.</p>
              </div>
            )}
            {loading && !results.length && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Zap className="animate-spin text-indigo-500" size={40} />
                <p className="text-slate-500 font-mono text-xs animate-pulse">QUERYING LEGAL DATABASE...</p>
              </div>
            )}
            {selectedLaw && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">{selectedLaw.title}</h2>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Statutory Breakdown</p>
                  </div>
                  <button 
                    onClick={() => {
                      const blob = new Blob([selectedLaw.details], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedLaw.title.replace(/\s+/g, '_')}_Details.md`;
                      a.click();
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Download Details"
                  >
                    <Download size={20} />
                  </button>
                </div>
                <div className="markdown-body prose prose-slate max-w-none text-sm leading-relaxed">
                  <Markdown>{selectedLaw.details}</Markdown>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
