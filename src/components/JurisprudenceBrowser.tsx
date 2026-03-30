import React, { useState } from 'react';
import { Search, Gavel, ShieldAlert, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { JurisprudenceResult } from '../types';

export const JurisprudenceBrowser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JurisprudenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setError(null);
    setSources([]);

    if (!process.env.GEMINI_API_KEY) {
      setError("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for real-life Philippine Supreme Court cases and legal precedents related to: ${query}. 
        Provide a detailed summary of the most relevant cases. 
        For each case, extract the Case Title, G.R. Number/Citation, Date, a concise Summary, and the Key Ruling.
        Also provide a brief overview of the jurisprudence found.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              cases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    citation: { type: Type.STRING },
                    date: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    ruling: { type: Type.STRING }
                  },
                  required: ['title', 'citation', 'date', 'summary', 'ruling']
                }
              }
            },
            required: ['overview', 'cases']
          }
        },
      });

      if (response.text) {
        try {
          setResults(JSON.parse(response.text));
        } catch (parseErr) {
          console.error("Failed to parse JSON response:", parseErr);
          setError("Failed to process the search results. Please try again.");
        }
      } else {
        setError("No results found.");
      }
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedSources = chunks
          .filter(chunk => chunk.web)
          .map(chunk => ({
            title: chunk.web!.title || "Source",
            uri: chunk.web!.uri
          }));
        setSources(extractedSources);
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Error searching for jurisprudence.";
      if (err.message && (err.message.includes("Forbidden") || err.message.includes("403"))) {
        msg = "Access Forbidden. This may be due to the 'Google Search' tool being restricted for your API key. Please check your API key's permissions.";
      } else if (err.message) {
        msg = `Error: ${err.message}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Philippine Jurisprudence</h1>
        <p className="text-slate-500">Search and browse real-life Philippine Supreme Court decisions and legal precedents.</p>
      </header>

      <div className="legal-card p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search cases (e.g., 'People vs. Santos', 'Cybercrime Law decisions', 'Labor law precedents')..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="legal-card p-8 min-h-[600px] bg-white relative">
            {!results && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                <Gavel size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">Enter a query to browse Philippine jurisprudence.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-1/2" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
                <div className="h-64 bg-slate-50 rounded w-full" />
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
                <ShieldAlert size={20} />
                {error}
              </div>
            )}

            {results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-2">Overview</h3>
                  <p className="text-slate-700 leading-relaxed">{results.overview}</p>
                </div>

                <div className="space-y-6">
                  {results.cases.map((caseResult, idx) => (
                    <div key={idx} className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{caseResult.title}</h2>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 uppercase tracking-wider">
                              {caseResult.citation}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                              {caseResult.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Summary</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{caseResult.summary}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Key Ruling</h4>
                          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                            <p className="text-sm text-indigo-900 italic leading-relaxed">"{caseResult.ruling}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="legal-card p-6 sticky top-6">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Share2 size={16} /> Verified Sources
            </h3>
            {sources.length > 0 ? (
              <div className="space-y-3">
                {sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-700">{source.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-1">{source.uri}</div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No sources available yet. Perform a search to see references.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
