import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
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
  Share2,
  Activity,
  Upload,
  Download,
  Eye,
  X,
  Trash2,
  CheckSquare,
  Square,
  Check,
  CheckCircle2,
  Copy,
  Save,
  History,
  Book,
  Calendar,
  Filter,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Note, LegalDocument, CaseSummary, LegalPrediction } from './types';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
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

const Dashboard = ({ 
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

const DocumentLibrary = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [type, setType] = useState<'case' | 'statute' | 'memo'>('case');
  const [tags, setTags] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState<'all' | 'case' | 'statute' | 'memo'>('all');
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    let finalSummary = manualSummary.trim();
    let citationCheck = null;
    
    // Attempt to generate AI summary and check citations if API key is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Convert file to base64 for Gemini
        const reader = new FileReader();
        const fileBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });

        // 1. Generate Summary if needed
        if (!finalSummary) {
          try {
            const summaryResponse = await ai.models.generateContent({
              model: "gemini-3.1-pro-preview",
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: file.type || "application/octet-stream",
                        data: fileBase64,
                      },
                    },
                    {
                      text: "Please provide a concise, one-sentence legal summary of this document. Focus on the main subject matter and legal significance.",
                    },
                  ],
                },
              ],
            });
            finalSummary = summaryResponse.text || "";
          } catch (err) {
            console.error("AI Summarization failed:", err);
          }
        }

        // 2. Check Citations
        try {
          const citationResponse = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: file.type || "application/octet-stream",
                      data: fileBase64,
                    },
                  },
                  {
                    text: "Analyze the legal citations in this document. Identify the main citations and check if they are still valid and current (e.g., not overturned, repealed, or amended). Return a JSON object with 'status' (one of: 'valid', 'caution', 'invalid') and 'analysis' (a brief explanation of the validity of the citations found).",
                  },
                ],
              },
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  status: { 
                    type: Type.STRING, 
                    description: "Status of the citations found in the document.",
                    enum: ['valid', 'caution', 'invalid'] 
                  },
                  analysis: { 
                    type: Type.STRING,
                    description: "Detailed analysis of the citations."
                  }
                },
                required: ['status', 'analysis']
              }
            }
          });
          if (citationResponse.text) {
            citationCheck = JSON.parse(citationResponse.text);
          }
        } catch (err) {
          console.error("Citation check failed:", err);
        }

      } catch (err) {
        console.error("Gemini processing failed:", err);
      }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('citation', citation);
    formData.append('type', type);
    formData.append('tags', tags);
    if (finalSummary) {
      formData.append('summary', finalSummary);
    }
    if (citationCheck) {
      formData.append('citation_check', JSON.stringify(citationCheck));
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setTitle('');
        setCitation('');
        setTags('');
        setManualSummary('');
        setFile(null);
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (doc: LegalDocument) => {
    setPreviewDoc(doc);
    setPreviewContent(null);
    
    const ext = doc.filename.split('.').pop()?.toLowerCase();
    if (ext && ['txt', 'md', 'csv', 'json', 'html', 'pdf', 'docx'].includes(ext)) {
      setIsPreviewLoading(true);
      try {
        const res = await fetch(`/api/documents/preview/${doc.filename}`);
        const data = await res.json();
        if (data.content) {
          setPreviewContent(data.content);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} documents?`)) return;

    setIsBatchDeleting(true);
    try {
      const res = await fetch('/api/documents/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleBatchDownload = async () => {
    if (selectedIds.length === 0) return;
    
    setIsBatchDownloading(true);
    try {
      const response = await fetch('/api/documents/batch-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `legal-documents-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Batch download failed:', errorData.error);
      }
    } catch (err) {
      console.error('Batch download error:', err);
    } finally {
      setIsBatchDownloading(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</span> : 
        part
    );
  };

  const fuse = useMemo(() => {
    return new Fuse(documents, {
      keys: ['title', 'summary', 'tags', 'citation'],
      threshold: 0.4, // Adjust for fuzziness
    });
  }, [documents]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    documents.forEach(doc => {
      if (Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => tagsSet.add(tag.trim()));
      }
    });
    return Array.from(tagsSet).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let results = documents;

    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map(result => result.item);
    }

    return results.filter(doc => {
      const matchesType = filter === 'all' || doc.type === filter;
      
      const docDate = new Date(doc.uploaded_at);
      const matchesStartDate = !startDate || docDate >= new Date(startDate);
      const matchesEndDate = !endDate || docDate <= new Date(endDate + 'T23:59:59');
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesTag = tagFilter === 'all' || (Array.isArray(doc.tags) && doc.tags.includes(tagFilter));

      let matchesSize = true;
      if (sizeFilter === 'small') matchesSize = (doc.size || 0) < 1024 * 1024; // < 1MB
      else if (sizeFilter === 'medium') matchesSize = (doc.size || 0) >= 1024 * 1024 && (doc.size || 0) < 10 * 1024 * 1024; // 1MB - 10MB
      else if (sizeFilter === 'large') matchesSize = (doc.size || 0) >= 10 * 1024 * 1024; // > 10MB
      
      return matchesType && matchesStartDate && matchesEndDate && matchesStatus && matchesSize && matchesTag;
    });
  }, [documents, searchQuery, filter, startDate, endDate, sizeFilter, statusFilter, tagFilter, fuse]);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Document Library</h1>
          <p className="text-slate-500">Centralized repository for case law, statutes, and legal memoranda.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="legal-card p-6 sticky top-6">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <Upload size={20} /> Upload New Document
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">Document Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., People vs. Santos Summary"
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">Citation (e.g., G.R. No., R.A. No.)</label>
                <input 
                  type="text" 
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="e.g., G.R. No. 245123"
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">Document Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900 bg-transparent"
                >
                  <option value="case">Case Law</option>
                  <option value="statute">Statute</option>
                  <option value="memo">Legal Memo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., criminal, appeal, 2023"
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">AI Summary (Optional)</label>
                <textarea 
                  value={manualSummary}
                  onChange={(e) => setManualSummary(e.target.value)}
                  placeholder="Provide a brief summary or key takeaways..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 text-sm h-24 resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">If left blank, LexPH will attempt to auto-generate a summary.</p>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">File</label>
                <input 
                  type="file" 
                  accept=".txt,.md,.csv,.json,.html,.pdf,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isUploading || !file}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isUploading ? 'Analyzing & Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="legal-card p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by keywords, title, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Case Type:</span>
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Types</option>
                    <option value="case">Case Law</option>
                    <option value="statute">Statute</option>
                    <option value="memo">Legal Memo</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <div className="flex items-center gap-1">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-[10px] font-medium bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-slate-300 text-[10px]">to</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-[10px] font-medium bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold ml-1"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Database size={14} className="text-slate-400" />
                  <select 
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">&lt; 1MB</option>
                    <option value="medium">1MB - 10MB</option>
                    <option value="large">&gt; 10MB</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-slate-400" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-slate-400" />
                  <select 
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px]"
                  >
                    <option value="all">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSelectAll}
                  className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400"
                  title="Select All"
                >
                  {selectedIds.length === filteredDocuments.length && filteredDocuments.length > 0 ? (
                    <CheckSquare size={20} className="text-indigo-600" />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
                <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                  <Library size={20} /> Repository
                </h3>
              </div>
            </div>

            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-indigo-900">
                        {selectedIds.length} items selected
                      </span>
                      <button 
                        onClick={() => setSelectedIds([])}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Deselect all
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleBatchDownload}
                        disabled={isBatchDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      >
                        {isBatchDownloading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            Zipping...
                          </>
                        ) : (
                          <><Download size={16} /> Download</>
                        )}
                      </button>
                      <button 
                        onClick={handleBatchDelete}
                        disabled={isBatchDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isBatchDeleting ? 'Deleting...' : <><Trash2 size={16} /> Delete</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No {filter !== 'all' ? filter : ''} documents found in the repository.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all group ${
                      selectedIds.includes(doc.id) 
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleSelect(doc.id)}
                        className={`p-1 rounded transition-colors ${
                          selectedIds.includes(doc.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'
                        }`}
                      >
                        {selectedIds.includes(doc.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <div className={`p-2 rounded-lg ${
                        doc.type === 'case' ? 'bg-blue-50 text-blue-600' :
                        doc.type === 'statute' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{highlightText(doc.title, searchQuery)}</h4>
                          {doc.citation && (
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {highlightText(doc.citation, searchQuery)}
                            </span>
                          )}
                          {doc.citation_check && (
                            <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                              doc.citation_check.status === 'valid' ? 'bg-emerald-100 text-emerald-700' :
                              doc.citation_check.status === 'caution' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {doc.citation_check.status === 'valid' ? <Check size={10} /> : 
                               doc.citation_check.status === 'caution' ? <ShieldAlert size={10} /> : 
                               <X size={10} />}
                              Citations: {doc.citation_check.status}
                            </span>
                          )}
                        </div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 mb-1">
                            {doc.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">
                                {highlightText(tag.trim(), searchQuery)}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                          <span className="uppercase font-mono">{doc.type}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                          {doc.size && (
                            <>
                              <span>•</span>
                              <span>{(doc.size / 1024).toFixed(1)} KB</span>
                            </>
                          )}
                          {doc.status && (
                            <>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${
                                doc.status === 'completed' ? 'text-emerald-600' :
                                doc.status === 'processing' ? 'text-amber-600' :
                                'text-red-600'
                              }`}>
                                {doc.status === 'completed' ? <CheckCircle2 size={10} /> : 
                                 doc.status === 'processing' ? <Clock size={10} /> : 
                                 <ShieldAlert size={10} />}
                                {doc.status}
                              </span>
                            </>
                          )}
                        </div>
                        {doc.summary && (
                          <p className="text-xs text-slate-400 line-clamp-2 max-w-md italic">
                            {highlightText(doc.summary, searchQuery)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePreview(doc)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Preview"
                      >
                        <Eye size={20} />
                      </button>
                      <a 
                        href={`/api/documents/download/${doc.filename}`}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        title="Download"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    previewDoc.type === 'case' ? 'bg-blue-50 text-blue-600' :
                    previewDoc.type === 'statute' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-serif font-bold text-slate-900">{previewDoc.title}</h3>
                      {previewDoc.citation && (
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                          {previewDoc.citation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">
                      {previewDoc.type} • {new Date(previewDoc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {isPreviewLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <p className="font-serif italic">Loading document content...</p>
                  </div>
                ) : previewContent ? (
                  <div className="prose prose-slate max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                      {previewContent}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl">
                      <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <ShieldAlert size={18} /> Preview Limited
                      </h4>
                      <p className="text-sm text-amber-700">
                        Full text preview is only available for supported documents (.txt, .md, .csv, .json, .pdf, .docx). 
                        For other file types, please download the document to view its contents.
                      </p>
                    </div>
                    
                    {previewDoc.summary && (
                      <div>
                        <h4 className="text-xs font-mono text-slate-400 uppercase mb-3 tracking-widest">Document Snippet</h4>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 leading-relaxed">
                          "{previewDoc.summary}"
                        </div>
                      </div>
                    )}

                    {previewDoc.citation_check && (
                      <div className={`p-6 rounded-xl border ${
                        previewDoc.citation_check.status === 'valid' ? 'bg-emerald-50 border-emerald-100' :
                        previewDoc.citation_check.status === 'caution' ? 'bg-amber-50 border-amber-100' :
                        'bg-red-50 border-red-100'
                      }`}>
                        <h4 className={`font-bold mb-2 flex items-center gap-2 ${
                          previewDoc.citation_check.status === 'valid' ? 'text-emerald-900' :
                          previewDoc.citation_check.status === 'caution' ? 'text-amber-900' :
                          'text-red-900'
                        }`}>
                          {previewDoc.citation_check.status === 'valid' ? <CheckCircle2 size={18} /> : 
                           previewDoc.citation_check.status === 'caution' ? <ShieldAlert size={18} /> : 
                           <X size={18} />}
                          Citation Validity Check: {previewDoc.citation_check.status.toUpperCase()}
                        </h4>
                        <p className={`text-sm ${
                          previewDoc.citation_check.status === 'valid' ? 'text-emerald-700' :
                          previewDoc.citation_check.status === 'caution' ? 'text-amber-700' :
                          'text-red-700'
                        }`}>
                          {previewDoc.citation_check.analysis}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="px-6 py-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                >
                  Close
                </button>
                <a 
                  href={`/api/documents/download/${previewDoc.filename}`}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Download size={18} /> Download Full Document
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResearchAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, id: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [researchMode, setResearchMode] = useState<'memo' | 'statute' | 'case' | 'article' | 'summarizer'>('memo');
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
    summarizer: [
      "Summarize Estrada vs. Desierto (G.R. No. 146710)",
      "Provide a case brief for People vs. Genosa",
      "Analyze the ruling in Falcis vs. Civil Registrar General"
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
      summarizer: ["Reading Case Text...", "Identifying Facts...", "Extracting Issues...", "Analyzing Ruling...", "Synthesizing Legal Analysis..."]
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
      
      let systemPrompt = "You are LexPH, an Agentic AI Legal Research Assistant for Philippine Law. Tone: Professional, authoritative, precise.";
      if (researchMode === 'memo') {
        systemPrompt += " Automate complex research by analyzing issues, searching jurisprudence, and synthesizing comprehensive legal opinions. Format your response as a formal legal memorandum with sections: To, From, Date, Re, Facts, Issues, Discussion, and Conclusion.";
      } else if (researchMode === 'statute') {
        systemPrompt += " Focus on finding and explaining specific laws, statutes, and articles. Provide the full text of relevant provisions if possible and explain their current status (amended, repealed, etc.). Cite the Official Gazette or relevant Republic Acts.";
      } else if (researchMode === 'case') {
        systemPrompt += " Focus on finding relevant Supreme Court cases and legal precedents. Provide G.R. Numbers, dates, and detailed summaries of the rulings. Use SCRA or Philippine Reports citations where available.";
      } else if (researchMode === 'article') {
        systemPrompt += " Focus on retrieving and analyzing legal articles, scholarly journals, and expert commentaries. Provide a synthesis of different legal perspectives on the topic.";
      } else if (researchMode === 'summarizer') {
        systemPrompt += " You are a Case Summarizer. Your task is to provide a highly structured and precise summary of the provided case text or citation. You MUST include the following sections: 1. Case Title & Citation, 2. Facts (concise narrative), 3. Issues (legal questions addressed), 4. Ruling (the court's decision), and 5. Legal Analysis (the rationale and principles applied). Use professional legal terminology.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: activeQuery,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
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
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to legal database. Please try again.", id: 'error' }]);
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

      const res = await fetch('/api/documents', {
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
          <p className="text-slate-500">Autonomous research, statutory analysis, and memorandum synthesis.</p>
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
              onClick={() => setResearchMode('summarizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'summarizer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Summarizer
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
              <p className="text-sm leading-relaxed">Describe a legal problem, ask for specific jurisprudence, or provide a case for summarization. I will analyze issues, search laws, and generate structured summaries.</p>
              
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
            placeholder={
              researchMode === 'summarizer' 
                ? "Paste case text or provide a citation (e.g., 'Estrada vs. Desierto, G.R. No. 146710')..." 
                : "Describe your legal research problem..."
            }
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

const PredictiveAnalytics = () => {
  const [facts, setFacts] = useState('');
  const [prediction, setPrediction] = useState<LegalPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!facts.trim()) return;
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
        model: "gemini-3.1-pro-preview",
        contents: `As a legal predictive analytics tool for Philippine Law, analyze the following case facts and predict the likely outcome based on current jurisprudence and legal principles. 
        
        Case Facts: ${facts}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              probability: { type: Type.NUMBER, description: "Probability of success as a percentage (0-100)" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key legal strengths" },
              risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risks or weaknesses" },
              strategy: { type: Type.STRING, description: "Recommended legal strategy" },
              analysis: { type: Type.STRING, description: "Detailed legal analysis and reasoning" },
            },
            required: ["probability", "strengths", "risks", "strategy", "analysis"],
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
          <div className="legal-card p-8 min-h-[600px] bg-white relative overflow-hidden">
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
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">WIN PROBABILITY</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <TrendingUp size={14} /> Prediction Analysis
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Likely Judicial Outcome</h2>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      Based on current Philippine jurisprudence and similar case patterns, the probability of a favorable ruling is estimated at {prediction.probability}%.
                    </p>
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

const StatuteSearch = () => {
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
        model: "gemini-3.1-pro-preview",
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
        model: "gemini-3.1-pro-preview",
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

const CaseSummarizer = () => {
  const [caseText, setCaseText] = useState('');
  const [citationInput, setCitationInput] = useState('');
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  const sampleCase = `G.R. No. 135981. January 15, 2004.
PEOPLE OF THE PHILIPPINES, appellee, vs. MARIVIC GENOSA, appellant.

DECISION
PANGANIBAN, J.:

The battered woman syndrome is a scientifically recognized medical and psychological condition that affects women who have been subjected to a pattern of physical, sexual, or psychological abuse by their intimate partners. It is characterized by a cycle of violence, where periods of relative calm are followed by escalating tension and eventually an acute battering incident.

In the present case, the appellant, Marivic Genosa, was charged with parricide for killing her husband, Ben Genosa. She admitted to the killing but claimed self-defense, alleging that she was a victim of battered woman syndrome.

The trial court convicted her of parricide and sentenced her to death. On appeal, the Supreme Court recognized the existence of battered woman syndrome in the Philippines but ruled that the appellant failed to prove all the elements of self-defense. However, the Court appreciated the syndrome as a mitigating circumstance, analogous to passion or obfuscation, and reduced her sentence.`;

  const handleSummarize = async (useSearch = false) => {
    if (!caseText.trim() && !citationInput.trim()) return;
    setLoading(true);
    setSearchMode(useSearch);
    setSummary(null);

    if (!process.env.GEMINI_API_KEY) {
      alert("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = "";
      let config: any = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The full title of the case (e.g., People vs. Juan Dela Cruz)" },
            citation: { type: Type.STRING, description: "The Case Citation (e.g., G.R. No. 123456 and date of the decision)" },
            facts: { type: Type.STRING, description: "A concise summary of the material facts of the case" },
            issues: { type: Type.STRING, description: "The legal issues addressed by the court" },
            ruling: { type: Type.STRING, description: "The court's ruling and ratio decidendi" },
            analysis: { type: Type.STRING, description: "A brief analysis of the case, highlighting key legal principles and implications" },
          },
          required: ["title", "citation", "facts", "issues", "ruling", "analysis"]
        }
      };

      if (useSearch) {
        prompt = `Search for the full text of the Philippine Supreme Court case: ${citationInput}. 
        Once found, provide a detailed legal summary. 
        Extract the Case Title, Case Citation, Facts, Issues, Ruling, and a brief Legal Analysis.`;
        config.tools = [{ googleSearch: {} }];
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else {
        prompt = `Please provide a detailed legal summary of the following Philippine Supreme Court decision. 
        Extract the Case Title, Case Citation (G.R. Number), Facts, Issues, Ruling, and a brief Legal Analysis highlighting key legal principles and their implications.
        
        Case Text: ${caseText}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: config
      });
      
      if (response.text) {
        setSummary(JSON.parse(response.text));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearchMode(false);
    }
  };

  const saveToLibrary = async () => {
    if (!summary) return;
    setLoading(true);
    try {
      const res = await fetch('/api/documents/save-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: summary.title,
          citation: citationInput || summary.citation,
          summary: summary.facts.substring(0, 200) + '...',
          facts: summary.facts,
          issues: summary.issues,
          ruling: summary.ruling,
          analysis: summary.analysis,
          tags: 'ai-generated,summary'
        })
      });
      if (res.ok) {
        alert("Summary saved to Document Library successfully!");
      } else {
        alert("Failed to save summary.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const exportSummary = () => {
    if (!summary) return;
    const content = `
# Case Summary: ${summary.title}
**Citation:** ${citationInput || summary.citation}

## Facts
${summary.facts}

## Issues
${summary.issues}

## Ruling
${summary.ruling}

## Legal Analysis
${summary.analysis}

---
Generated by LexPH AI Case Summarizer
    `;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^a-z0-9]/gi, '_')}_Summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">AI Case Summarizer</h1>
          <p className="text-slate-500">Transform lengthy Supreme Court decisions into structured legal summaries.</p>
        </div>
        <button 
          onClick={() => setCaseText(sampleCase)}
          className="text-xs font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100 transition-all"
        >
          <Zap size={14} /> LOAD SAMPLE CASE
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="legal-card p-6">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-slate-900" /> Case Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1 block">Case Citation (Optional)</label>
                <input 
                  type="text" 
                  value={citationInput}
                  onChange={(e) => setCitationInput(e.target.value)}
                  placeholder="e.g., G.R. No. 123456"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1 block">Case Document Text</label>
                <textarea 
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  placeholder="Paste the full text of the Supreme Court decision here..."
                  className="w-full h-[500px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSummarize(false)}
                  disabled={loading || !caseText.trim()}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {loading && !searchMode ? <Zap className="animate-spin" size={20} /> : <BookOpen size={20} />}
                  {loading && !searchMode ? 'Summarizing...' : 'Summarize Text'}
                </button>
                <button 
                  onClick={() => handleSummarize(true)}
                  disabled={loading || !citationInput.trim()}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading && searchMode ? <Zap className="animate-spin" size={20} /> : <Search size={20} />}
                  {loading && searchMode ? 'Searching...' : 'Search & Summarize'}
                </button>
              </div>
              <button 
                onClick={() => { setCaseText(''); setCitationInput(''); setSummary(null); }}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="legal-card p-8 min-h-[700px] bg-white relative overflow-hidden">
            {!summary && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                <Gavel size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">The structured AI summary will appear here once the decision text is processed.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="space-y-4">
                  <div className="h-6 bg-slate-50 rounded w-1/3" />
                  <div className="h-24 bg-slate-50 rounded w-full" />
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-slate-50 rounded w-1/3" />
                  <div className="h-24 bg-slate-50 rounded w-full" />
                </div>
              </div>
            )}

            {summary && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-start pb-6 border-b border-slate-100">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Case Summary</h2>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Philippine Supreme Court Decision</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={saveToLibrary}
                      disabled={loading}
                      className="text-xs font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 px-3 py-1.5 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all"
                    >
                      <Save size={14} /> SAVE TO LIBRARY
                    </button>
                    <button 
                      onClick={exportSummary}
                      className="text-xs font-mono text-slate-400 hover:text-slate-900 flex items-center gap-1 shrink-0 px-3 py-1.5 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all"
                    >
                      <Download size={14} /> EXPORT MD
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-900 rounded-full" /> Case Title
                    </h3>
                    <div className="text-slate-900 font-bold text-lg font-serif bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 leading-tight">
                      {summary.title}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-900 rounded-full" /> Case Citation
                    </h3>
                    <div className="text-slate-900 font-bold text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      {citationInput || summary.citation}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-900 rounded-full" /> Facts
                    </h3>
                    <div className="text-slate-700 leading-relaxed text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <Markdown>{summary.facts}</Markdown>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-900 rounded-full" /> Issues
                    </h3>
                    <div className="text-slate-700 leading-relaxed text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <Markdown>{summary.issues}</Markdown>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-900 rounded-full" /> Ruling
                    </h3>
                    <div className="text-slate-900 leading-relaxed text-sm font-medium bg-slate-900/5 p-4 rounded-xl border border-slate-900/10">
                      <Markdown>{summary.ruling}</Markdown>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-indigo-600 rounded-full" /> Legal Analysis
                    </h3>
                    <div className="text-slate-700 leading-relaxed text-sm bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 italic">
                      <Markdown>{summary.analysis}</Markdown>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowCenter = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'agent' }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    addLog(`Starting ${workflow?.title}...`, 'info');

    if (!process.env.GEMINI_API_KEY) {
      addLog("API Key not found. Please add your GEMINI_API_KEY in Settings.", 'error');
      setIsRunning(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      if (activeWorkflow === 'case-analysis') {
        addLog("Agent: Analyzing material facts and identifying legal issues...", 'agent');
        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Analyze the following case facts and identify the key legal issues and applicable laws in the Philippines: ${input}`,
        });
        addLog("Facts analyzed and issues identified.", 'success');
        
        addLog("Agent: Searching Philippine jurisprudence for relevant precedents...", 'agent');
        const searchResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Search for Philippine Supreme Court cases relevant to these legal issues: ${analysisResponse.text}`,
          config: { tools: [{ googleSearch: {} }] }
        });
        addLog("Found relevant jurisprudence and precedents.", 'success');

        addLog("Agent: Predicting case outcome and assessing risks...", 'agent');
        const predictionResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Based on the facts: ${input}, and the jurisprudence found: ${searchResponse.text}, predict the likely outcome of this case in a Philippine court. Include a win probability and a list of major legal risks.`,
        });
        addLog("Outcome predicted and risks assessed.", 'success');

        addLog("Agent: Synthesizing final legal memorandum...", 'agent');
        const finalResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Draft a formal legal memorandum for a senior partner. 
          Facts: ${input}
          Issues & Analysis: ${analysisResponse.text}
          Jurisprudence: ${searchResponse.text}
          Prediction & Strategy: ${predictionResponse.text}
          
          The memorandum should be professional, structured, and cite relevant Philippine laws and cases.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        
        setResult(finalResponse.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'compliance-check') {
        addLog("Agent: Identifying applicable statutes...", 'agent');
        await new Promise(r => setTimeout(r, 1500));
        
        addLog("Agent: Cross-referencing fact pattern with legal provisions...", 'agent');
        const complianceResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Analyze this scenario for statutory compliance in the Philippines: ${input}`,
          config: { tools: [{ googleSearch: {} }] }
        });
        
        setResult(complianceResponse.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'contract-review') {
        addLog("Agent: Parsing contract clauses...", 'agent');
        await new Promise(r => setTimeout(r, 1500));
        
        addLog("Agent: Identifying high-risk provisions...", 'agent');
        const reviewResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Review this contract text for risks and suggest amendments based on Philippine law: ${input}`,
        });
        
        setResult(reviewResponse.text || "Workflow completed with no output.");
      }

      addLog("Workflow completed successfully.", 'success');
    } catch (err) {
      console.error(err);
      addLog("An error occurred during the workflow execution.", 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Agentic Workflows</h1>
        <p className="text-slate-500">Automate multi-step legal processes using autonomous AI agents.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {workflows.map((w) => (
            <div 
              key={w.id}
              onClick={() => !isRunning && setActiveWorkflow(w.id)}
              className={`legal-card p-5 cursor-pointer transition-all border-2 ${
                activeWorkflow === w.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent hover:border-slate-200'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${w.bg} ${w.color}`}>
                  <w.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{w.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{w.description}</p>
                </div>
              </div>
            </div>
          ))}

          {activeWorkflow && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="legal-card p-6 bg-slate-900 text-white"
            >
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Workflow Input</h4>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Provide the necessary facts, case text, or contract provisions to begin..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-white/20 resize-none mb-4"
              />
              <button 
                onClick={runWorkflow}
                disabled={isRunning || !input.trim()}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isRunning ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
                {isRunning ? 'Agent Running...' : 'Execute Workflow'}
              </button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="legal-card p-8 min-h-[600px] bg-white flex flex-col">
            {!activeWorkflow && !isRunning && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center">
                <BrainCircuit size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-serif italic">Select a workflow to begin automation.</p>
              </div>
            )}

            {(activeWorkflow || isRunning) && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-serif font-bold text-slate-900">Agent Execution Logs</h3>
                  {isRunning && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      LIVE EXECUTION
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 font-mono text-xs overflow-y-auto max-h-[300px] mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {logs.length === 0 && <p className="text-slate-400 italic">Waiting for execution...</p>}
                  {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${
                      log.type === 'error' ? 'text-red-600' : 
                      log.type === 'success' ? 'text-emerald-600' : 
                      log.type === 'agent' ? 'text-indigo-600 font-bold' : 
                      'text-slate-500'
                    }`}>
                      <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex gap-1 mt-2">
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
                    className="flex-1 border-t border-slate-100 pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Workflow Result</h4>
                      <button 
                        onClick={() => {
                          const blob = new Blob([result], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `LexPH_Workflow_Result_${new Date().getTime()}.md`;
                          a.click();
                        }}
                        className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Download size={12} /> DOWNLOAD MD
                      </button>
                    </div>
                    <div className="markdown-body prose prose-slate max-w-none text-sm bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <Markdown>{result}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const JurisprudenceBrowser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setSources([]);

    if (!process.env.GEMINI_API_KEY) {
      setResults("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Search for real-life Philippine Supreme Court cases and legal precedents related to: ${query}. 
        Provide a detailed summary of the most relevant cases, including their G.R. Numbers, dates, and key rulings.
        Format the output in clear Markdown.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        },
      });

      setResults(response.text || "No results found.");
      
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
    } catch (err) {
      console.error(err);
      setResults("Error searching for jurisprudence.");
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

            {results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="markdown-body prose prose-slate max-w-none"
              >
                <Markdown>{results}</Markdown>
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
            icon={Gavel} 
            label="Jurisprudence" 
            active={activeView === 'jurisprudence'} 
            onClick={() => setActiveView('jurisprudence')} 
          />
          <SidebarItem 
            icon={Search} 
            label="Legal Research" 
            active={activeView === 'research'} 
            onClick={() => setActiveView('research')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Case Summarizer" 
            active={activeView === 'summarizer'} 
            onClick={() => setActiveView('summarizer')} 
          />
          <SidebarItem 
            icon={Book} 
            label="Statutes & Regulations" 
            active={activeView === 'statutes'} 
            onClick={() => setActiveView('statutes')} 
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
          <SidebarItem 
            icon={Zap} 
            label="Workflows" 
            active={activeView === 'workflows'} 
            onClick={() => setActiveView('workflows')} 
          />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
          />
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
            {activeView === 'dashboard' && (
              <Dashboard 
                onViewAllJurisprudence={() => setActiveView('jurisprudence')} 
                onViewAnalytics={() => setActiveView('analytics')}
                onViewWorkflows={() => setActiveView('workflows')}
                onViewStatutes={() => setActiveView('statutes')}
              />
            )}
            {activeView === 'jurisprudence' && <JurisprudenceBrowser />}
            {activeView === 'research' && <ResearchAssistant />}
            {activeView === 'summarizer' && <CaseSummarizer />}
            {activeView === 'statutes' && <StatuteSearch />}
            {activeView === 'analytics' && <PredictiveAnalytics />}
            {activeView === 'knowledge' && <KnowledgeBase />}
            {activeView === 'library' && <DocumentLibrary />}
            {activeView === 'workflows' && <WorkflowCenter />}
            {activeView === 'settings' && (
              <div className="max-w-2xl">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-6">Settings</h1>
                <div className="space-y-6">
                  <div className="legal-card p-6">
                    <h3 className="font-bold mb-4">Application Settings</h3>
                    <p className="text-sm text-slate-500">Configure your LexPH experience.</p>
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
