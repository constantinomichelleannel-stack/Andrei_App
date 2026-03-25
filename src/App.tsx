import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Shield,
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
  Edit2,
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
  Tag,
  Info,
  RotateCcw,
  ArrowUpDown,
  Bookmark,
  FileSpreadsheet,
  AlertTriangle,
  XCircle,
  Archive,
  User,
  Hash,
  GitCompare,
  LogOut,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Note, LegalDocument, CaseSummary, LegalPrediction, JurisprudenceResult, ChatMessage } from './types';
import { useDocumentStore } from './store';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import Markdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { auth, signOut, db } from './firebase';
import { getDocFromServer, doc } from 'firebase/firestore';

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

const TagManager = ({ 
  tags, 
  onAdd, 
  onRemove, 
  allTags = [], 
  placeholder = "Add tag...",
  icon: Icon = Tag
}: { 
  tags: string[], 
  onAdd: (tag: string) => void, 
  onRemove: (tag: string) => void,
  allTags?: string[],
  placeholder?: string,
  icon?: any
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    return allTags.filter(t => 
      t.toLowerCase().includes(input.toLowerCase()) && 
      !tags.includes(t)
    ).slice(0, 5);
  }, [input, allTags, tags]);

  const handleAdd = (tag: string) => {
    if (tag.trim()) {
      onAdd(tag.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-slate-50 border border-slate-100 rounded-xl">
        {tags.length === 0 && <span className="text-xs text-slate-400 italic px-1">No tags added yet.</span>}
        {tags.map((tag, idx) => (
          <motion.span 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={idx} 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm group"
          >
            <Icon size={10} className="text-indigo-300" />
            {tag}
            <button 
              type="button"
              onClick={() => onRemove(tag)}
              className="text-indigo-300 hover:text-red-500 transition-colors"
            >
              <X size={10} />
            </button>
          </motion.span>
        ))}
      </div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd(input);
                }
              }}
              placeholder={placeholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAdd(input)}
            disabled={!input.trim()}
            className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Suggestions
              </div>
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAdd(suggestion)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 text-slate-700 flex items-center justify-between transition-colors"
                >
                  {suggestion}
                  <Plus size={10} className="text-indigo-300" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  type = 'warning' 
}: { 
  show: boolean; 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}) => {
  if (!show) return null;
  
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
    info: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
  };

  const icons = {
    danger: <XCircle className="text-red-600" size={24} />,
    warning: <AlertTriangle className="text-amber-600" size={24} />,
    info: <Info className="text-indigo-600" size={24} />
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {icons[type]}
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-xl font-bold transition-all shadow-lg ${colors[type]}`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DocumentLibrary = ({ 
  onSummarize,
  setSummarizerInitialData,
  setActiveView,
  showConfirm
}: { 
  onSummarize?: (text: string, citation?: string) => void,
  setSummarizerInitialData: (data: {text: string, citation?: string} | null) => void,
  setActiveView: (view: ViewType) => void,
  showConfirm: (title: string, message: string, onConfirm: () => void, type?: 'danger' | 'warning' | 'info') => void
}) => {
  const { fetchWithAuth, getAuthToken } = useAuth();
  const {
    documents, setDocuments,
    loading, setLoading,
    searchQuery, setSearchQuery,
    filter, setFilter,
    startDate, setStartDate,
    endDate, setEndDate,
    sizeFilter, setSizeFilter,
    statusFilter, setStatusFilter,
    tagFilter, setTagFilter,
    tagFilterLogic, setTagFilterLogic,
    authorFilter, setAuthorFilter,
    datePublishedFilter, setDatePublishedFilter,
    keywordFilter, setKeywordFilter,
    citationFilter, setCitationFilter,
    summaryFilter, setSummaryFilter,
    analysisFilter, setAnalysisFilter,
    sortBy, setSortBy,
    selectedIds, setSelectedIds,
    resetFilters,
    savedSearches, addSavedSearch, removeSavedSearch, applySavedSearch,
    recentSearches, addRecentSearch, clearRecentSearches
  } = useDocumentStore();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState(0);
  const [aiStep, setAiStep] = useState<string | null>(null);
  const [fileStep, setFileStep] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [type, setType] = useState<'case' | 'statute' | 'memo'>('case');
  const [tags, setTags] = useState<string[]>([]);
  const [manualSummary, setManualSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [isBatchCheckingCitations, setIsBatchCheckingCitations] = useState(false);
  const [isBatchSummarizing, setIsBatchSummarizing] = useState(false);
  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [batchEditTitle, setBatchEditTitle] = useState('');
  const [batchEditCitation, setBatchEditCitation] = useState('');
  const [batchEditAuthor, setBatchEditAuthor] = useState('');
  const [batchEditDatePublished, setBatchEditDatePublished] = useState('');
  const [batchEditKeywords, setBatchEditKeywords] = useState<string[]>([]);
  const [batchEditTags, setBatchEditTags] = useState<string[]>([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCitation, setEditCitation] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editDatePublished, setEditDatePublished] = useState('');
  const [editKeywords, setEditKeywords] = useState<string[]>([]);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedVersionDoc, setSelectedVersionDoc] = useState<LegalDocument | null>(null);
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [isTagSuggestionsVisible, setIsTagSuggestionsVisible] = useState(false);
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [expandedDocId, setExpandedDocId] = useState<number | null>(null);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showStructuredSummaryId, setShowStructuredSummaryId] = useState<number | null>(null);
  const [generatingInsightId, setGeneratingInsightId] = useState<number | null>(null);
  const [comparingVersion, setComparingVersion] = useState<any | null>(null);
  const [comparisonContent, setComparisonContent] = useState<{ current: string, target: string } | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<any | null>(null);

  const handleGenerateInsight = async (docId: number) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    if (!process.env.GEMINI_API_KEY) {
      alert("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      return;
    }

    setGeneratingInsightId(docId);
    setAiProgress(0);
    setAiStep('Initializing insight generation...');
    setProcessingStep('Preparing document for AI analysis...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Fetch doc content
      setAiStep('Fetching document content...');
      setAiProgress(10);
      const contentRes = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
      const contentData = await contentRes.json();
      
      setAiStep('Analyzing content with Gemini...');
      setAiProgress(30);
      setProcessingStep('AI is generating strategic insights...');

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following legal document, generate a strategic "Legal Insight" or "Practice Note". 
        Focus on how this case/statute impacts private legal practice, potential risks for clients, and strategic opportunities.
        The insight should be concise, professional, and actionable.
        
        Document: ${doc.title}
        Content: ${contentData.content?.substring(0, 20000) || "No content available."}
        
        Return a JSON object with 'title', 'content', and 'suggested_tags' (comma separated).`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              suggested_tags: { type: Type.STRING }
            },
            required: ['title', 'content', 'suggested_tags']
          }
        }
      });

      if (response.text) {
        setAiStep('Saving insight to Knowledge Portal...');
        setAiProgress(80);
        const data = JSON.parse(response.text);
        
        // Save to Knowledge Portal automatically
        const saveRes = await fetchWithAuth('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            category: 'Practice Note',
            tags: data.suggested_tags,
            source_doc_id: docId
          })
        });

        if (saveRes.ok) {
          setAiProgress(100);
          setAiStep('Insight saved successfully!');
          setProcessingStep('Strategic insight generated and saved.');
          alert(`Successfully generated and saved insight: "${data.title}" to the Knowledge Portal.`);
        } else {
          const errorData = await saveRes.json();
          setAiStep('Failed to save insight');
          alert(`Insight generated but failed to save: ${errorData.error || saveRes.statusText}`);
        }
      }
    } catch (err) {
      console.error("Generate insight error:", err);
      setAiStep('Generation failed');
      alert("An error occurred while generating the legal insight.");
    } finally {
      setTimeout(() => {
        setGeneratingInsightId(null);
        setAiProgress(0);
        setAiStep(null);
        setProcessingStep(null);
      }, 2000);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetchWithAuth('/api/documents');
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

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timer = setTimeout(() => {
        addRecentSearch({
          id: Math.random().toString(36).substring(7),
          query: searchQuery,
          timestamp: new Date().toISOString(),
          filters: {
            filter,
            startDate,
            endDate,
            sizeFilter,
            statusFilter,
            tagFilter,
            tagFilterLogic,
            citationFilter,
            summaryFilter,
            analysisFilter,
            sortBy
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setAiProgress(0);
    setFileProgress(0);
    setAiStep('Initializing...');
    setFileStep('Queued');
    setProcessingStep('Preparing document for analysis...');
    
    let finalSummary = manualSummary.trim();
    let citationCheck = null;
    
    // Attempt to generate AI summary and check citations if API key is available
    if (process.env.GEMINI_API_KEY) {
      try {
        setProcessingStep('AI Analysis in progress...');
        setAiStep('Reading file content...');
        setAiProgress(5);
        setUploadProgress(5);
        
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

        setAiProgress(15);
        setUploadProgress(10);
        setAiStep('Analyzing document structure...');
        setProcessingStep('Analyzing document structure...');

        // 1. Generate Summary if needed
        if (!finalSummary) {
          setAiStep('Generating legal summary...');
          setProcessingStep('Generating legal summary...');
          setAiProgress(20);
          setUploadProgress(15);
          try {
            const summaryResponse = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
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
                      text: `You are an expert Philippine Legal Researcher. Provide a concise, one-sentence legal summary of this document. 
                      Focus on the main subject matter, the specific legal doctrine or provision involved, and its significance in Philippine law.
                      If it's a Supreme Court case, mention the core ruling. If it's a statute, mention its primary purpose.`,
                    },
                  ],
                },
              ],
              config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
              },
            });
            finalSummary = summaryResponse.text || "";
            setAiProgress(60);
            setUploadProgress(30);
          } catch (err) {
            console.error("AI Summarization failed:", err);
            setAiStep('Summarization failed');
          }
        } else {
          setAiProgress(60);
          setUploadProgress(30);
        }

        // 2. Check Citations
        setAiStep('Checking legal citations...');
        setProcessingStep('Checking legal citations...');
        try {
          const citationResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
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
                    text: `You are an expert Philippine Legal Researcher. Analyze the legal citations in the provided document.

1. Identify all primary citations (Supreme Court cases, Republic Acts, Executive Orders, etc.).
2. For each major citation, evaluate its current validity in Philippine jurisprudence:
   - Is it still "Good Law"?
   - Has it been explicitly or impliedly overturned by a more recent Supreme Court decision?
   - Has the statute been repealed, amended, or declared unconstitutional?
3. Assign an overall status:
   - 'valid': All major citations are current and reliable.
   - 'caution': Some citations are old or have been partially modified/clarified by later jurisprudence, or there are conflicting rulings.
   - 'invalid': A major citation has been explicitly overturned or the law has been repealed.

Return a JSON object with 'status' (one of: 'valid', 'caution', 'invalid') and 'analysis' (a detailed explanation of your findings, citing specific cases or laws that affect the validity).`,
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
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
          setAiProgress(100);
          setUploadProgress(50);
        } catch (err) {
          console.error("Citation check failed:", err);
          setAiStep('Citation check failed');
        }
        setAiStep('Analysis Complete');
        setProcessingStep('AI Analysis complete. Starting upload...');
        setUploadProgress(50);

      } catch (err) {
        console.error("Gemini processing failed:", err);
        setAiStep('Analysis Failed');
        setProcessingStep('AI Analysis failed, proceeding with upload...');
        setUploadProgress(50);
      }
    } else {
      setAiStep('Skipped');
      setAiProgress(100);
      setUploadProgress(50);
      setProcessingStep('Starting file upload...');
    }

    setFileStep('Uploading file...');
    setProcessingStep('Uploading file to server...');
    
    const formData = new FormData();
    formData.append('file', file!);
    formData.append('title', title);
    formData.append('citation', citation);
    formData.append('author', author);
    formData.append('date_published', datePublished);
    formData.append('keywords', keywords.join(', '));
    formData.append('type', type);
    formData.append('tags', tags.join(', '));
    if (finalSummary) {
      formData.append('summary', finalSummary);
    }
    if (citationCheck) {
      formData.append('citation_check', JSON.stringify(citationCheck));
    }

    try {
      await new Promise(async (resolve, reject) => {
        const token = await getAuthToken();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/documents', true);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setFileProgress(percentComplete);
            setUploadProgress(50 + (percentComplete / 2));
            if (percentComplete === 100) {
              setFileStep('Finalizing...');
              setProcessingStep('Finalizing document...');
            } else {
              setFileStep(`Uploading... ${percentComplete}%`);
            }
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setFileProgress(100);
            setUploadProgress(100);
            setFileStep('Success!');
            setProcessingStep('Document Uploaded Successfully!');
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      setTitle('');
      setCitation('');
      setAuthor('');
      setDatePublished('');
      setKeywords([]);
      setTags([]);
      setManualSummary('');
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setProcessingStep('Upload failed');
      setFileStep('Error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setAiProgress(0);
        setFileProgress(0);
        setAiStep(null);
        setFileStep(null);
        setProcessingStep(null);
      }, 2000);
    }
  };

  const handlePreview = async (doc: LegalDocument) => {
    setPreviewDoc(doc);
    setPreviewContent(null);
    
    const ext = doc.filename.split('.').pop()?.toLowerCase();
    if (ext && ['txt', 'md', 'csv', 'json', 'html', 'pdf', 'docx'].includes(ext)) {
      setIsPreviewLoading(true);
      try {
        const res = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
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
    
    showConfirm(
      "Confirm Batch Deletion",
      `Are you sure you want to delete ${selectedIds.length} documents? This action cannot be undone.`,
      async () => {
        setIsBatchDeleting(true);
        try {
          const res = await fetchWithAuth('/api/documents/batch-delete', {
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
      },
      'danger'
    );
  };

  const handleBatchDownload = async () => {
    if (selectedIds.length === 0) return;
    
    setIsBatchDownloading(true);
    try {
      const response = await fetchWithAuth('/api/documents/batch-download', {
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

  const handleExportMetadataCSV = () => {
    if (selectedIds.length === 0) return;
    
    const selectedDocs = documents.filter(doc => selectedIds.includes(doc.id));
    
    // CSV Header
    const headers = ["Title", "Type", "Citation", "Tags", "Upload Date"];
    
    // CSV Rows
    const rows = selectedDocs.map(doc => {
      const title = (doc.title || doc.filename).replace(/"/g, '""');
      const type = (doc.type || 'case').replace(/"/g, '""');
      const citation = (doc.citation || '').replace(/"/g, '""');
      const tags = (Array.isArray(doc.tags) ? doc.tags.join(', ') : (doc.tags || '')).replace(/"/g, '""');
      const date = new Date(doc.uploaded_at).toLocaleString().replace(/"/g, '""');
      
      return [`"${title}"`, `"${type}"`, `"${citation}"`, `"${tags}"`, `"${date}"`];
    });
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `document_metadata_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchCitationCheck = async () => {
    if (selectedIds.length === 0) return;
    if (!process.env.GEMINI_API_KEY) {
      alert("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      return;
    }

    setIsBatchCheckingCitations(true);
    setAiProgress(0);
    setAiStep('Initializing batch citation check...');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
      let count = 0;
      for (const id of selectedIds) {
        count++;
        const doc = documents.find(d => d.id === id);
        if (!doc) continue;

        const currentProgress = Math.round(((count - 1) / selectedIds.length) * 100);
        setAiProgress(currentProgress);
        setAiStep(`Checking ${count} of ${selectedIds.length}: ${doc.title}...`);
        setProcessingStep(`Analyzing citations for: ${doc.title}`);

        try {
          // 1. Fetch content
          const res = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
          const data = await res.json();
          if (!data.content) continue;

          // 2. Check Citations with Gemini
          const citationResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert Philippine Legal Researcher. Analyze the legal citations in the provided document.

1. Identify all primary citations (Supreme Court cases, Republic Acts, Executive Orders, etc.).
2. For each major citation, evaluate its current validity in Philippine jurisprudence:
   - Is it still "Good Law"?
   - Has it been explicitly or impliedly overturned by a more recent Supreme Court decision?
   - Has the statute been repealed, amended, or declared unconstitutional?
3. Assign an overall status:
   - 'valid': All major citations are current and reliable.
   - 'caution': Some citations are old or have been partially modified/clarified by later jurisprudence, or there are conflicting rulings.
   - 'invalid': A major citation has been explicitly overturned or the law has been repealed.

Return a JSON object with 'status' (one of: 'valid', 'caution', 'invalid') and 'analysis' (a detailed explanation of your findings, citing specific cases or laws that affect the validity).
                    
                    Document Content: ${data.content.substring(0, 30000)}`, // Limit content size for Gemini
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
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
            const citationCheck = JSON.parse(citationResponse.text);
            
            // 3. Update metadata
            await fetchWithAuth(`/api/documents/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ citation_check: citationCheck }),
            });
            
            // Update local state immediately for better feedback
            fetchDocuments();
            setAiProgress(Math.round((count / selectedIds.length) * 100));
          }
        } catch (err) {
          console.error(`Citation check failed for document ${id}:`, err);
        }
      }
      setAiProgress(100);
      setAiStep('Batch check complete!');
      setSelectedIds([]);
      setProcessingStep(null);
    } catch (err) {
      console.error('Batch citation check error:', err);
      setAiStep('Batch check failed');
      setProcessingStep(null);
    } finally {
      setTimeout(() => {
        setIsBatchCheckingCitations(false);
        setAiProgress(0);
        setAiStep(null);
      }, 2000);
    }
  };

  const handleBatchSummarize = async () => {
    if (selectedIds.length === 0) return;
    if (!process.env.GEMINI_API_KEY) {
      alert("API Key not found. Please add your GEMINI_API_KEY in the Settings > Secrets menu.");
      return;
    }

    setIsBatchSummarizing(true);
    setAiProgress(0);
    setAiStep('Initializing batch summarization...');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
      let count = 0;
      for (const id of selectedIds) {
        count++;
        const doc = documents.find(d => d.id === id);
        if (!doc) continue;

        const currentProgress = Math.round(((count - 1) / selectedIds.length) * 100);
        setAiProgress(currentProgress);
        setAiStep(`Summarizing ${count} of ${selectedIds.length}: ${doc.title}...`);
        setProcessingStep(`Generating summary for: ${doc.title}`);

        try {
          // 1. Fetch content
          const res = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
          const data = await res.json();
          if (!data.content) continue;

          // 2. Generate Summary with Gemini
          const summaryResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert Philippine Legal Researcher. Analyze the provided document and generate a structured legal summary.

First, determine the document type:
- CASE: A court decision (e.g., Supreme Court, Court of Appeals).
- STATUTE: A law, Republic Act, or Ordinance.
- ADMINISTRATIVE: An executive order, circular, or regulation.
- OTHER: Any other legal document.

Based on the type, extract:
For CASES:
- **Title**: Full case title.
- **Citation**: G.R. Number and Date.
- **Facts**: Concise summary of relevant facts.
- **Issues**: The core legal questions addressed.
- **Ruling**: The Court's decision.
- **Analysis**: The Ratio Decidendi and established doctrine.

For STATUTES/ADMINISTRATIVE:
- **Title**: Official name/number.
- **Citation**: Date of effectivity or publication.
- **Facts**: Purpose or preamble summary.
- **Issues**: Key provisions or changes introduced.
- **Ruling**: Scope and applicability.
- **Analysis**: Legal implications and related laws.

Return a JSON object with 'type', 'title', 'citation', 'facts', 'issues', 'ruling', 'analysis', and 'key_doctrines' (an array of strings).
                    
                    Document Content: ${data.content.substring(0, 100000)}`,
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['CASE', 'STATUTE', 'ADMINISTRATIVE', 'OTHER'] },
                  title: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  facts: { type: Type.STRING },
                  issues: { type: Type.STRING },
                  ruling: { type: Type.STRING },
                  analysis: { type: Type.STRING },
                  key_doctrines: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                },
                required: ['type', 'title', 'citation', 'facts', 'issues', 'ruling', 'analysis']
              }
            }
          });

          if (summaryResponse.text) {
            const summaryData = JSON.parse(summaryResponse.text);
            
            // 3. Update metadata
            await fetchWithAuth(`/api/documents/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ legal_summary: summaryData }),
            });
            
            // Update local state immediately for better feedback
            fetchDocuments();
            setAiProgress(Math.round((count / selectedIds.length) * 100));
          }
        } catch (err) {
          console.error(`Summarization failed for document ${id}:`, err);
        }
      }
      setAiProgress(100);
      setAiStep('Batch summarization complete!');
      setSelectedIds([]);
      setProcessingStep(null);
    } catch (err) {
      console.error('Batch summarization error:', err);
      setAiStep('Batch summarization failed');
      setProcessingStep(null);
    } finally {
      setTimeout(() => {
        setIsBatchSummarizing(false);
        setAiProgress(0);
        setAiStep(null);
      }, 2000);
    }
  };

  const handleExportCitationAnalysis = (doc: LegalDocument) => {
    if (!doc.citation_analysis && (!doc.citation_check || !doc.citation_check.analysis)) return;

    const status = doc.citation_check ? `**Status:** ${doc.citation_check.status.toUpperCase()}\n` : '';
    const checkAnalysis = doc.citation_check ? `## Citation Check Summary\n\n${doc.citation_check.analysis}\n\n` : '';
    const detailedAnalysis = doc.citation_analysis ? `## Detailed Legal Analysis\n\n${doc.citation_analysis}\n\n` : '';

    const markdown = `# Citation Analysis: ${doc.title}\n\n` +
      `**Citation:** ${doc.citation || 'N/A'}\n` +
      status +
      `**Date Analysis Generated:** ${new Date().toLocaleDateString()}\n\n` +
      checkAnalysis +
      detailedAnalysis +
      `---\n` +
      `Generated by LexPH Legal Intelligence Platform`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_citation_analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCitationCheckAnalysis = (doc: LegalDocument) => {
    if (!doc.citation_check || !doc.citation_check.analysis) return;

    const markdown = `# Citation Check Analysis: ${doc.title}\n\n` +
      `**Citation:** ${doc.citation || 'N/A'}\n` +
      `**Status:** ${doc.citation_check.status.toUpperCase()}\n` +
      `**Date Analysis Generated:** ${new Date().toLocaleDateString()}\n\n` +
      `## Analysis\n\n` +
      `${doc.citation_check.analysis}\n\n` +
      `---\n` +
      `Generated by LexPH Legal Intelligence Platform`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_citation_check.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadVersion = async (docId: number) => {
    if (!versionFile) return;
    setIsUploadingVersion(true);
    setUploadProgress(0);
    setAiProgress(0);
    setFileProgress(0);
    setAiStep('Initializing analysis...');
    setFileStep('Queued');
    setProcessingStep('Preparing new version for analysis...');

    let finalSummary = '';
    let citationCheck = null;

    // Attempt to generate AI summary and check citations if API key is available
    if (process.env.GEMINI_API_KEY) {
      try {
        setProcessingStep('AI Analysis in progress...');
        setAiStep('Reading file content...');
        setAiProgress(10);
        setUploadProgress(5);
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Convert file to base64 for Gemini
        const reader = new FileReader();
        const fileBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(versionFile);
        });

        setAiProgress(20);
        setUploadProgress(10);
        setAiStep('Analyzing version structure...');

        // 1. Generate Summary
        setAiStep('Generating legal summary...');
        setAiProgress(30);
        setUploadProgress(15);
        try {
          const summaryResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: versionFile.type || "application/octet-stream",
                      data: fileBase64,
                    },
                  },
                  {
                    text: `You are an expert Philippine Legal Researcher. Provide a concise, one-sentence legal summary of this new version of the document. 
                    Focus on the main subject matter, the specific legal doctrine or provision involved, and its significance in Philippine law.`,
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            },
          });
          finalSummary = summaryResponse.text || "";
          setAiProgress(60);
          setUploadProgress(30);
        } catch (err) {
          console.error("AI Summarization failed:", err);
          setAiStep('Summarization failed');
        }

        // 2. Check Citations
        setAiStep('Checking legal citations...');
        try {
          const citationResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: versionFile.type || "application/octet-stream",
                      data: fileBase64,
                    },
                  },
                  {
                    text: `You are an expert Philippine Legal Researcher. Analyze the legal citations in the provided document.
1. Identify all primary citations.
2. Evaluate their current validity in Philippine jurisprudence.
3. Assign an overall status: 'valid', 'caution', 'invalid'.
Return a JSON object with 'status' and 'analysis'.`,
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING, enum: ['valid', 'caution', 'invalid'] },
                  analysis: { type: Type.STRING }
                },
                required: ['status', 'analysis']
              }
            }
          });
          if (citationResponse.text) {
            citationCheck = JSON.parse(citationResponse.text);
          }
          setAiProgress(100);
          setUploadProgress(50);
        } catch (err) {
          console.error("Citation check failed:", err);
          setAiStep('Citation check failed');
        }
        setAiStep('Analysis Complete');
        setProcessingStep('AI Analysis complete. Starting upload...');
        setUploadProgress(50);

      } catch (err) {
        console.error("Gemini processing failed:", err);
        setAiStep('Analysis Failed');
        setProcessingStep('AI Analysis failed, proceeding with upload...');
        setUploadProgress(50);
      }
    } else {
      setAiStep('Skipped');
      setAiProgress(100);
      setUploadProgress(50);
      setProcessingStep('Starting file upload...');
    }

    setFileStep('Uploading file...');
    setProcessingStep('Uploading file to server...');

    const formData = new FormData();
    formData.append('file', versionFile);
    if (finalSummary) {
      formData.append('summary', finalSummary);
    }
    if (citationCheck) {
      formData.append('citation_check', JSON.stringify(citationCheck));
    }

    try {
      await new Promise(async (resolve, reject) => {
        const token = await getAuthToken();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/documents/${docId}/version`, true);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setFileProgress(percentComplete);
            setUploadProgress(50 + (percentComplete / 2));
            if (percentComplete === 100) {
              setFileStep('Finalizing...');
              setProcessingStep('Finalizing version...');
            } else {
              setFileStep(`Uploading... ${percentComplete}%`);
            }
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setFileProgress(100);
            setUploadProgress(100);
            setFileStep('Success!');
            setProcessingStep('Version Uploaded Successfully!');
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      setVersionFile(null);
      setSelectedVersionDoc(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setProcessingStep('Version upload failed');
      setFileStep('Error');
    } finally {
      setTimeout(() => {
        setIsUploadingVersion(false);
        setUploadProgress(0);
        setAiProgress(0);
        setFileProgress(0);
        setAiStep(null);
        setFileStep(null);
        setProcessingStep(null);
      }, 2000);
    }
  };

  const handleRevert = async (docId: number, versionId: number) => {
    if (!confirm('Are you sure you want to revert to this version? The current version will be saved in history.')) return;
    try {
      const res = await fetchWithAuth(`/api/documents/${docId}/revert/${versionId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setSelectedVersionDoc(null);
        setComparingVersion(null);
        setComparisonContent(null);
        setViewingVersion(null);
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewVersionContent = async (filename: string, version: any) => {
    setViewingVersion(version);
    setIsPreviewLoading(true);
    try {
      const res = await fetchWithAuth(`/api/documents/preview/${filename}`);
      const data = await res.json();
      if (data.content) {
        setPreviewContent(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleCompareVersion = async (currentFilename: string, targetFilename: string, targetVersion: any) => {
    setIsComparisonLoading(true);
    setComparingVersion(targetVersion);
    try {
      const [currentRes, targetRes] = await Promise.all([
        fetchWithAuth(`/api/documents/preview/${currentFilename}`),
        fetchWithAuth(`/api/documents/preview/${targetFilename}`)
      ]);
      const currentData = await currentRes.json();
      const targetData = await targetRes.json();
      
      setComparisonContent({
        current: currentData.content || "Content not available",
        target: targetData.content || "Content not available"
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparisonLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setIsUpdating(true);
    try {
      const res = await fetchWithAuth(`/api/documents/${editingDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          citation: editCitation,
          tags: editTags.join(', '),
          author: editAuthor,
          date_published: editDatePublished,
          keywords: editKeywords.join(', ')
        }),
      });
      if (res.ok) {
        setEditingDoc(null);
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBatchUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setIsBatchUpdating(true);
    try {
      const updates = selectedIds.map(id => {
        const body: any = {};
        if (batchEditTitle) body.title = batchEditTitle;
        if (batchEditCitation) body.citation = batchEditCitation;
        if (batchEditTags.length > 0) body.tags = batchEditTags.join(', ');
        if (batchEditAuthor) body.author = batchEditAuthor;
        if (batchEditDatePublished) body.date_published = batchEditDatePublished;
        if (batchEditKeywords.length > 0) body.keywords = batchEditKeywords.join(', ');
        
        if (Object.keys(body).length === 0) return Promise.resolve();

        return fetchWithAuth(`/api/documents/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      });

      await Promise.all(updates);
      setIsBatchEditing(false);
      setBatchEditTitle('');
      setBatchEditCitation('');
      setBatchEditTags([]);
      setBatchEditAuthor('');
      setBatchEditDatePublished('');
      setBatchEditKeywords([]);
      setSelectedIds([]);
      fetchDocuments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handleAddTag = async (docId: number, tag: string) => {
    if (!tag.trim()) return;
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    const currentTags = Array.isArray(doc.tags) ? doc.tags : [];
    if (currentTags.includes(tag.trim())) {
      setNewTag('');
      return;
    }
    
    const newTags = [...currentTags, tag.trim()].join(', ');
    
    try {
      const res = await fetchWithAuth(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      if (res.ok) {
        fetchDocuments();
        setNewTag('');
        // Update previewDoc if it's the one being edited
        if (previewDoc && previewDoc.id === docId) {
          setPreviewDoc({ ...previewDoc, tags: [...currentTags, tag.trim()] });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTag = async (docId: number, tagToRemove: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    const currentTags = Array.isArray(doc.tags) ? doc.tags : [];
    const newTags = currentTags.filter(t => t !== tagToRemove).join(', ');
    
    try {
      const res = await fetchWithAuth(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      if (res.ok) {
        fetchDocuments();
        // Update previewDoc if it's the one being edited
        if (previewDoc && previewDoc.id === docId) {
          setPreviewDoc({ ...previewDoc, tags: currentTags.filter(t => t !== tagToRemove) });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return;
    
    const newSearch = {
      id: crypto.randomUUID(),
      name: newSearchName.trim(),
      query: searchQuery,
      filter,
      startDate,
      endDate,
      sizeFilter,
      statusFilter,
      tagFilter,
      tagFilterLogic,
      citationFilter,
      summaryFilter,
      analysisFilter,
      sortBy
    };
    
    addSavedSearch(newSearch);
    setNewSearchName('');
    setIsSavingSearch(false);
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

  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    documents.forEach(doc => {
      if (Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => {
          const t = tag.trim();
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let results = documents;

    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map(result => result.item);
    }

    const filtered = results.filter(doc => {
      const matchesType = filter === 'all' || doc.type === filter;
      
      const docDate = new Date(doc.uploaded_at);
      const matchesStartDate = !startDate || docDate >= new Date(startDate);
      const matchesEndDate = !endDate || docDate <= new Date(endDate + 'T23:59:59');
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      
      const matchesTag = tagFilter.length === 0 || (
        Array.isArray(doc.tags) && (
          tagFilterLogic === 'AND' 
            ? tagFilter.every(tf => doc.tags!.some(dt => dt.toLowerCase().includes(tf.toLowerCase())))
            : tagFilter.some(tf => doc.tags!.some(dt => dt.toLowerCase().includes(tf.toLowerCase())))
        )
      );

      const matchesCitation = citationFilter === 'all' || (doc.citation_check && doc.citation_check.status === citationFilter) || (citationFilter === 'unchecked' && !doc.citation_check);
      
      const matchesSummary = summaryFilter === 'all' || 
        (summaryFilter === 'has-summary' && (doc.summary || doc.legal_summary)) || 
        (summaryFilter === 'no-summary' && !doc.summary && !doc.legal_summary);
        
      const matchesAnalysis = analysisFilter === 'all' || 
        (analysisFilter === 'has-analysis' && doc.citation_analysis) || 
        (analysisFilter === 'no-analysis' && !doc.citation_analysis);

      const matchesAuthor = !authorFilter || (doc.author && doc.author.toLowerCase().includes(authorFilter.toLowerCase()));
      const matchesDatePublished = !datePublishedFilter || (doc.date_published && doc.date_published === datePublishedFilter);
      const matchesKeyword = !keywordFilter || (Array.isArray(doc.keywords) && doc.keywords.some(k => k.toLowerCase().includes(keywordFilter.toLowerCase())));

      let matchesSize = true;
      if (sizeFilter === 'small') matchesSize = (doc.size || 0) < 1024 * 1024; // < 1MB
      else if (sizeFilter === 'medium') matchesSize = (doc.size || 0) >= 1024 * 1024 && (doc.size || 0) < 10 * 1024 * 1024; // 1MB - 10MB
      else if (sizeFilter === 'large') matchesSize = (doc.size || 0) >= 10 * 1024 * 1024; // > 10MB
      
      return matchesType && matchesStartDate && matchesEndDate && matchesStatus && matchesSize && matchesTag && matchesCitation && matchesSummary && matchesAnalysis && matchesAuthor && matchesDatePublished && matchesKeyword;
    });

    // Sorting logic
    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      if (sortBy === 'oldest') return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
      if (sortBy === 'size-desc') return (b.size || 0) - (a.size || 0);
      if (sortBy === 'size-asc') return (a.size || 0) - (b.size || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'citation-status') {
        const priority: Record<string, number> = { 'valid': 0, 'caution': 1, 'invalid': 2, 'unchecked': 3 };
        const aStatus = a.citation_check?.status || 'unchecked';
        const bStatus = b.citation_check?.status || 'unchecked';
        return (priority[aStatus] ?? 3) - (priority[bStatus] ?? 3);
      }
      return 0;
    });
  }, [documents, searchQuery, filter, startDate, endDate, sizeFilter, statusFilter, tagFilter, citationFilter, summaryFilter, analysisFilter, sortBy, fuse]);

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
                <label className="text-xs font-mono text-slate-400 uppercase">Author / Issuing Authority</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Justice Leonen, Congress"
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">Date Published / Promulgated</label>
                <input 
                  type="date" 
                  value={datePublished}
                  onChange={(e) => setDatePublished(e.target.value)}
                  className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900 bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Keywords</label>
                <TagManager 
                  tags={keywords}
                  onAdd={(keyword) => setKeywords([...keywords, keyword])}
                  onRemove={(keyword) => setKeywords(keywords.filter(k => k !== keyword))}
                  allTags={[]}
                  placeholder="Add keywords..."
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
                <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Document Tags</label>
                <TagManager 
                  tags={tags}
                  onAdd={(tag) => setTags([...tags, tag])}
                  onRemove={(tag) => setTags(tags.filter(t => t !== tag))}
                  allTags={allTags}
                  placeholder="Add category, year, or topic..."
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

              {isUploading && (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <div className="w-4 h-4 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Processing Document</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{processingStep || 'Initializing...'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* AI Analysis Stage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${aiProgress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {aiProgress === 100 ? <Check size={12} /> : <BrainCircuit size={12} />}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">AI Legal Analysis</span>
                        </div>
                        <span className={`text-[10px] font-mono ${aiProgress === 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                          {aiProgress}%
                        </span>
                      </div>
                      <div className="pl-7">
                        <p className="text-[10px] text-slate-400 italic mb-2">{aiStep || 'Waiting to start...'}</p>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full transition-all duration-500 ${aiProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${aiProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* File Upload Stage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${fileProgress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            {fileProgress === 100 ? <Check size={12} /> : <Upload size={12} />}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">Secure File Upload</span>
                        </div>
                        <span className={`text-[10px] font-mono ${fileProgress === 100 ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {fileProgress}%
                        </span>
                      </div>
                      <div className="pl-7">
                        <p className="text-[10px] text-slate-400 italic mb-2">{fileStep || 'Queued...'}</p>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full transition-all duration-500 ${fileProgress === 100 ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${fileProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">
                      <span>Total Progress</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        className="h-full bg-slate-900 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUploading || !file}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 relative overflow-hidden"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="relative z-10 text-xs flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {processingStep || 'Processing...'}
                    </span>
                  </div>
                ) : 'Upload Document'}
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
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => setIsSavingSearch(true)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Save current search"
                  >
                    <Bookmark size={18} />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowSavedSearches(!showSavedSearches)}
                      className={`p-1.5 rounded-lg transition-all ${showSavedSearches ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                      title="View saved searches"
                    >
                      <History size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {showSavedSearches && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search History</span>
                            <button onClick={() => setShowSavedSearches(false)} className="text-slate-400 hover:text-slate-600">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {savedSearches.length > 0 && (
                              <div className="p-2 bg-slate-50/50 border-b border-slate-100">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pinned & Saved</span>
                              </div>
                            )}
                            {savedSearches.map(search => (
                              <div 
                                key={search.id}
                                className="group p-3 border-b border-slate-50 hover:bg-indigo-50/50 transition-colors flex items-center justify-between"
                              >
                                <button 
                                  onClick={() => {
                                    applySavedSearch(search);
                                    setShowSavedSearches(false);
                                  }}
                                  className="flex-1 text-left"
                                >
                                  <p className="text-xs font-bold text-slate-900 truncate">{search.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {search.query || 'No query'} • {search.filter}
                                  </p>
                                </button>
                                <button 
                                  onClick={() => removeSavedSearch(search.id)}
                                  className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}

                            {recentSearches.length > 0 && (
                              <>
                                <div className="p-2 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Recent Searches</span>
                                  <button 
                                    onClick={clearRecentSearches}
                                    className="text-[9px] text-slate-400 hover:text-red-500 font-bold"
                                  >
                                    Clear
                                  </button>
                                </div>
                                {recentSearches.map(search => (
                                  <div 
                                    key={search.id}
                                    className="group p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                                  >
                                    <button 
                                      onClick={() => {
                                        applySavedSearch({ ...search.filters, query: search.query });
                                        setShowSavedSearches(false);
                                      }}
                                      className="flex-1 text-left"
                                    >
                                      <p className="text-xs font-medium text-slate-700 truncate">{search.query}</p>
                                      <p className="text-[9px] text-slate-400 truncate">
                                        {new Date(search.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </button>
                                  </div>
                                ))}
                              </>
                            )}

                            {savedSearches.length === 0 && recentSearches.length === 0 && (
                              <div className="p-6 text-center text-xs text-slate-400 italic">
                                No saved or recent searches yet.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
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
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Size:</span>
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
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Status:</span>
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

                <div className="flex flex-wrap items-center gap-2 relative">
                  <Tag size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Tags:</span>
                  
                  {tagFilter.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {tagFilter.map(tag => (
                        <span 
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold"
                        >
                          {tag}
                          <button 
                            onClick={() => setTagFilter(tagFilter.filter(t => t !== tag))}
                            className="hover:text-indigo-900"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <button 
                        onClick={() => setTagFilter([])}
                        className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-1"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {popularTags.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] no-scrollbar py-1">
                      {popularTags
                        .filter(tag => !tagFilter.includes(tag))
                        .map(tag => (
                        <button
                          key={tag}
                          onClick={() => setTagFilter([...tagFilter, tag])}
                          className="text-[9px] px-2 py-0.5 rounded-full border bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all whitespace-nowrap"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative group">
                    <input 
                      type="text"
                      value={tagSearchQuery}
                      onChange={(e) => {
                        setTagSearchQuery(e.target.value);
                        setIsTagSuggestionsVisible(true);
                      }}
                      onFocus={() => setIsTagSuggestionsVisible(true)}
                      onBlur={() => setTimeout(() => setIsTagSuggestionsVisible(false), 200)}
                      placeholder="Add tag filter..."
                      className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-[150px]"
                    />
                    <AnimatePresence>
                      {isTagSuggestionsVisible && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-[200px] overflow-y-auto"
                        >
                          <div 
                            className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100"
                          >
                            Suggestions
                          </div>
                          {allTags
                            .filter(tag => !tagFilter.includes(tag))
                            .filter(tag => !tagSearchQuery || tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                            .map(tag => (
                              <div 
                                key={tag}
                                className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer text-slate-700 flex items-center justify-between"
                                onClick={() => {
                                  setTagFilter([...tagFilter, tag]);
                                  setTagSearchQuery('');
                                  setIsTagSuggestionsVisible(false);
                                }}
                              >
                                <span>{tag}</span>
                                <Plus size={12} className="text-slate-300" />
                              </div>
                            ))}
                          {allTags.filter(tag => !tagFilter.includes(tag) && (!tagSearchQuery || tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))).length === 0 && (
                            <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                              No matching tags
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {tagFilter.length > 1 && (
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 ml-1 border border-slate-200">
                      <button
                        onClick={() => setTagFilterLogic('AND')}
                        className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${tagFilterLogic === 'AND' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        title="All selected tags must be present"
                      >
                        AND
                      </button>
                      <button
                        onClick={() => setTagFilterLogic('OR')}
                        className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${tagFilterLogic === 'OR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Any selected tag can be present"
                      >
                        OR
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Author:</span>
                  <input 
                    type="text" 
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    placeholder="Filter by author..."
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-[150px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Pub. Date:</span>
                  <input 
                    type="date" 
                    value={datePublishedFilter}
                    onChange={(e) => setDatePublishedFilter(e.target.value)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Keyword:</span>
                  <input 
                    type="text" 
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    placeholder="Filter by keyword..."
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-[150px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <BrainCircuit size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">AI Summary:</span>
                  <select 
                    value={summaryFilter}
                    onChange={(e) => setSummaryFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Summaries</option>
                    <option value="has-summary">Has AI Summary</option>
                    <option value="no-summary">No AI Summary</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Scale size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Analysis:</span>
                  <select 
                    value={analysisFilter}
                    onChange={(e) => setAnalysisFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Analysis</option>
                    <option value="has-analysis">Has Analysis</option>
                    <option value="no-analysis">No Analysis</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Citations:</span>
                  <select 
                    value={citationFilter}
                    onChange={(e) => setCitationFilter(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Citations</option>
                    <option value="valid">Valid Only</option>
                    <option value="caution">Caution Only</option>
                    <option value="invalid">Invalid Only</option>
                    <option value="unchecked">Unchecked</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Sort By:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="newest">Upload Date (Newest)</option>
                    <option value="oldest">Upload Date (Oldest)</option>
                    <option value="citation-status">Citation Status (Valid First)</option>
                    <option value="size-desc">Size (Large to Small)</option>
                    <option value="size-asc">Size (Small to Large)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>

                <button 
                  onClick={() => setIsSavingSearch(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-all"
                  title="Save current search and filters"
                >
                  <Bookmark size={12} /> Save Search
                </button>

                <button 
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-all"
                  title="Reset all filters"
                >
                  <RotateCcw size={12} /> Reset
                </button>
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
                  <div className="flex flex-col gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center justify-between">
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
                        onClick={handleBatchCitationCheck}
                        disabled={isBatchCheckingCitations}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isBatchCheckingCitations ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            {processingStep || 'Checking...'}
                          </>
                        ) : (
                          <><ShieldAlert size={16} /> Batch Citation Check</>
                        )}
                      </button>
                      <button 
                        onClick={handleBatchSummarize}
                        disabled={isBatchSummarizing}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isBatchSummarizing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            {processingStep || 'Summarizing...'}
                          </>
                        ) : (
                          <><Zap size={16} /> Batch Summarize</>
                        )}
                      </button>
                      <button 
                        onClick={() => setIsBatchEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 size={16} /> Batch Edit
                      </button>
                      <button 
                        onClick={handleBatchDownload}
                        disabled={isBatchDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      >
                        {isBatchDownloading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <><Archive size={16} /> Export ZIP</>
                        )}
                      </button>
                      <button 
                        onClick={handleExportMetadataCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <FileSpreadsheet size={16} /> Export CSV
                      </button>
                      <button 
                        onClick={handleBatchDelete}
                        disabled={isBatchDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isBatchDeleting ? 'Deleting...' : <><Trash2 size={16} /> Delete</>}
                      </button>
                    </div>

                    {(isBatchCheckingCitations || isBatchSummarizing) && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-3 bg-white/50 rounded-lg border border-indigo-200/50"
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <BrainCircuit size={14} className="text-indigo-600 animate-pulse" />
                            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">{aiStep || 'Processing...'}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-indigo-600">{aiProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${aiProgress}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
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
                  <div key={doc.id} className="space-y-2">
                    <div 
                      onClick={() => {
                        if (doc.legal_summary || doc.summary) {
                          setExpandedDocId(expandedDocId === doc.id ? null : doc.id);
                        }
                      }}
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all group relative overflow-hidden ${
                        selectedIds.includes(doc.id) 
                          ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                          : 'border-slate-100 hover:bg-slate-50'
                      } ${(doc.legal_summary || doc.summary) ? 'cursor-pointer' : ''}`}
                    >
                      {/* Citation Status Indicator Bar */}
                      {doc.citation_check && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          doc.citation_check.status === 'valid' ? 'bg-emerald-500' :
                          doc.citation_check.status === 'caution' ? 'bg-amber-500' :
                          doc.citation_check.status === 'invalid' ? 'bg-red-500' :
                          'bg-slate-300'
                        }`} />
                      )}
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(doc.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            selectedIds.includes(doc.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          {selectedIds.includes(doc.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                        <div className="relative">
                          <div className={`p-2 rounded-lg ${
                            doc.type === 'case' ? 'bg-blue-50 text-blue-600' :
                            doc.type === 'statute' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            <FileText size={20} />
                          </div>
                          {doc.citation_check && (
                            <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
                              doc.citation_check.status === 'valid' ? 'bg-emerald-500' :
                              doc.citation_check.status === 'caution' ? 'bg-amber-500' :
                              doc.citation_check.status === 'invalid' ? 'bg-red-500' :
                              'bg-slate-300'
                            }`}>
                              {doc.citation_check.status === 'valid' ? <Check size={8} className="text-white" /> : 
                               doc.citation_check.status === 'caution' ? <ShieldAlert size={8} className="text-white" /> : 
                               doc.citation_check.status === 'invalid' ? <X size={8} className="text-white" /> :
                               <Info size={8} className="text-white" />}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {(doc.legal_summary || doc.summary) && (
                              <motion.div
                                animate={{ rotate: expandedDocId === doc.id ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight size={16} className="text-slate-400" />
                              </motion.div>
                            )}
                            <h4 className="font-bold text-slate-900">{highlightText(doc.title, searchQuery)}</h4>
                            {doc.citation && (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {highlightText(doc.citation, searchQuery)}
                              </span>
                            )}
                            {doc.citation_check && (
                              <span 
                                title={doc.citation_check.analysis}
                                className={`flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border cursor-help shadow-sm transition-all hover:scale-105 ${
                                  doc.citation_check.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50' :
                                  doc.citation_check.status === 'caution' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100/50' :
                                  doc.citation_check.status === 'invalid' ? 'bg-red-50 text-red-700 border-red-200 shadow-red-100/50' :
                                  'bg-slate-50 text-slate-600 border-slate-200'
                                }`}
                              >
                                {doc.citation_check.status === 'valid' ? <Check size={10} className="text-emerald-500" /> : 
                                 doc.citation_check.status === 'caution' ? <ShieldAlert size={10} className="text-amber-500" /> : 
                                 doc.citation_check.status === 'invalid' ? <X size={10} className="text-red-500" /> :
                                 <Info size={10} className="text-slate-400" />}
                                Citations: {doc.citation_check.status}
                              </span>
                            )}
                          </div>
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2 mb-2 items-center">
                              {doc.tags.map((tag, idx) => (
                                <button 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!tagFilter.includes(tag.trim())) setTagFilter([...tagFilter, tag.trim()]);
                                  }}
                                  className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                >
                                  <Tag size={8} />
                                  {highlightText(tag.trim(), searchQuery)}
                                </button>
                              ))}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDoc(doc);
                                  setEditTitle(doc.title);
                                  setEditCitation(doc.citation || '');
                                  setEditTags(Array.isArray(doc.tags) ? [...doc.tags] : []);
                                  setEditAuthor(doc.author || '');
                                  setEditDatePublished(doc.date_published || '');
                                  setEditKeywords(Array.isArray(doc.keywords) ? [...doc.keywords] : []);
                                }}
                                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Manage Tags"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                          {doc.keywords && doc.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1 mb-2 items-center">
                              {doc.keywords.map((keyword, idx) => (
                                <button 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setKeywordFilter(keyword.trim());
                                  }}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1"
                                >
                                  <Hash size={8} />
                                  {highlightText(keyword.trim(), searchQuery)}
                                </button>
                              ))}
                            </div>
                          )}
                          {doc.citation_check && doc.citation_check.status !== 'valid' && (
                            <div className={`text-[10px] mt-2 p-3 rounded-xl border flex items-start gap-3 max-w-md shadow-sm transition-all hover:shadow-md ${
                              doc.citation_check.status === 'caution' 
                                ? 'bg-amber-50/50 border-amber-100 text-amber-800' 
                                : 'bg-red-50/50 border-red-100 text-red-800'
                            }`}>
                              <div className={`p-1 rounded-full ${
                                doc.citation_check.status === 'caution' ? 'bg-amber-100' : 'bg-red-100'
                              }`}>
                                {doc.citation_check.status === 'caution' ? <ShieldAlert size={12} className="text-amber-600" /> : <X size={12} className="text-red-600" />}
                              </div>
                              <div>
                                <span className="font-bold uppercase text-[9px] block mb-1 tracking-wider">Citation Analysis Alert</span>
                                <p className="italic leading-relaxed opacity-90">{doc.citation_check.analysis}</p>
                              </div>
                            </div>
                          )}
                          {!expandedDocId || expandedDocId !== doc.id ? (
                            <>
                              {doc.legal_summary && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Zap size={12} className="text-indigo-600" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Summary Available</span>
                                </div>
                              )}
                              <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                                <span className="uppercase font-mono">{doc.type}</span>
                                <span>•</span>
                                <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                {doc.author && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <User size={10} />
                                      {highlightText(doc.author, searchQuery)}
                                    </span>
                                  </>
                                )}
                                {doc.date_published && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar size={10} />
                                      {new Date(doc.date_published).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
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
                              {doc.summary ? (
                                <p className={`text-xs text-slate-400 italic transition-all duration-300 ${expandedDocId === doc.id ? 'mt-2 mb-2' : 'line-clamp-1 max-w-md'}`}>
                                  {highlightText(doc.summary, searchQuery)}
                                </p>
                              ) : doc.legal_summary && (
                                <p className={`text-xs text-slate-400 italic transition-all duration-300 ${expandedDocId === doc.id ? 'mt-2 mb-2' : 'line-clamp-1 max-w-md'}`}>
                                  {highlightText(doc.legal_summary.facts, searchQuery)}
                                </p>
                              )}
                              
                              {generatingInsightId === doc.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-2 space-y-1.5 max-w-sm"
                                >
                                  <div className="flex justify-between items-center text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                                    <span className="flex items-center gap-1">
                                      <BrainCircuit size={10} className="animate-pulse" />
                                      {aiStep || 'Generating insight...'}
                                    </span>
                                    <span>{aiProgress}%</span>
                                  </div>
                                  <div className="h-1 bg-indigo-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-indigo-600"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${aiProgress}%` }}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleGenerateInsight(doc.id)}
                          disabled={generatingInsightId !== null}
                          className={`p-2 transition-colors ${
                            generatingInsightId === doc.id ? 'text-indigo-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600'
                          }`}
                          title="Generate Legal Insight"
                        >
                          {generatingInsightId === doc.id ? <BrainCircuit size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                        </button>
                        <button 
                          onClick={() => {
                            setEditingDoc(doc);
                            setEditTitle(doc.title);
                            setEditCitation(doc.citation || '');
                            setEditTags(Array.isArray(doc.tags) ? [...doc.tags] : []);
                            setEditAuthor(doc.author || '');
                            setEditDatePublished(doc.date_published || '');
                            setEditKeywords(Array.isArray(doc.keywords) ? [...doc.keywords] : []);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit Metadata"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => setSelectedVersionDoc(doc)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative"
                          title="Version History"
                        >
                          <History size={20} />
                          {doc.version && doc.version > 1 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                              {doc.version}
                            </span>
                          )}
                        </button>
                        <button 
                          onClick={async () => {
                            if (onSummarize) {
                              // Fetch content if not already available
                              try {
                                const res = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
                                const data = await res.json();
                                if (data.content) {
                                  onSummarize(data.content, doc.citation);
                                } else {
                                  onSummarize(doc.summary || '', doc.citation);
                                }
                              } catch (err) {
                                onSummarize(doc.summary || '', doc.citation);
                              }
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="AI Summarize"
                        >
                          <Zap size={20} />
                        </button>
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
                        {(doc.citation_check || doc.citation_analysis) && (
                          <button 
                            onClick={() => handleExportCitationAnalysis(doc)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="Export Citation Analysis"
                          >
                            <FileText size={20} />
                          </button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedDocId === doc.id && (doc.legal_summary || doc.citation_check || doc.citation_analysis || doc.summary) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl ml-12 mr-4 mb-4 shadow-inner">
                            {/* AI Summary Section if no legal_summary but has summary */}
                            {!doc.legal_summary && doc.summary && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <BrainCircuit size={18} className="text-indigo-600" />
                                  <h5 className="font-bold text-slate-900 uppercase tracking-wider text-xs">AI Summary</h5>
                                </div>
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                  {doc.summary}
                                </p>
                              </div>
                            )}

                            {/* AI Legal Analysis Section */}
                            {doc.legal_summary && (
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <BrainCircuit size={18} className="text-indigo-600" />
                                    <h5 className="font-bold text-slate-900 uppercase tracking-wider text-xs">AI Legal Analysis</h5>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => {
                                        const summaryText = `FACTS:\n${doc.legal_summary?.facts}\n\nISSUES:\n${doc.legal_summary?.issues}\n\nRULING:\n${doc.legal_summary?.ruling}\n\nANALYSIS:\n${doc.legal_summary?.analysis}`;
                                        navigator.clipboard.writeText(summaryText);
                                        alert('Summary copied to clipboard!');
                                      }}
                                      className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                                    >
                                      <Copy size={10} /> Copy Summary
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSummarizerInitialData({ 
                                          text: `FACTS:\n${doc.legal_summary?.facts}\n\nISSUES:\n${doc.legal_summary?.issues}\n\nRULING:\n${doc.legal_summary?.ruling}\n\nANALYSIS:\n${doc.legal_summary?.analysis}`, 
                                          citation: doc.citation 
                                        });
                                        setActiveView('summarizer');
                                      }}
                                      className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                    >
                                      Open in Summarizer <Zap size={10} />
                                    </button>
                                    <button 
                                      onClick={() => setShowStructuredSummaryId(showStructuredSummaryId === doc.id ? null : doc.id)}
                                      className={`text-[10px] px-3 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
                                        showStructuredSummaryId === doc.id 
                                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                      }`}
                                    >
                                      {showStructuredSummaryId === doc.id ? 'Hide Details' : 'Extract Summary Details'}
                                      <ArrowUpDown size={10} />
                                    </button>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {showStructuredSummaryId === doc.id ? (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-wider">
                                          {doc.legal_summary.type || 'DOCUMENT'}
                                        </span>
                                        {doc.legal_summary.key_doctrines && doc.legal_summary.key_doctrines.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {doc.legal_summary.key_doctrines.map((doctrine, idx) => (
                                              <span key={idx} className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium border border-indigo-100">
                                                {doctrine}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facts of the Case</span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed italic">
                                            {doc.legal_summary.facts}
                                          </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Issues</span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed italic">
                                            {doc.legal_summary.issues}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Court Ruling</span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed italic">
                                            {doc.legal_summary.ruling}
                                          </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Analysis</span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed italic">
                                            {doc.legal_summary.analysis}
                                          </p>
                                        </div>
                                      </div>
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <div className="text-center py-4 bg-white/50 rounded-lg border border-dashed border-slate-200">
                                      <p className="text-xs text-slate-400 italic">Click "Extract Summary Details" to view the structured legal analysis.</p>
                                    </div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* Citation Analysis & Risk Assessment Section */}
                            {(doc.citation_check || doc.citation_analysis) && (
                              <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <ShieldAlert size={18} className={
                                      doc.citation_check?.status === 'valid' ? 'text-emerald-600' :
                                      doc.citation_check?.status === 'caution' ? 'text-amber-600' :
                                      'text-red-600'
                                    } />
                                    <h5 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Citation Analysis & Risk Assessment</h5>
                                  </div>
                                  {(doc.citation_check || doc.citation_analysis) && (
                                    <button 
                                      onClick={() => handleExportCitationAnalysis(doc)}
                                      className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                                    >
                                      <Download size={10} /> Export Citation Analysis
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  {doc.citation_check && (
                                    <div className={`p-4 rounded-lg border ${
                                      doc.citation_check.status === 'valid' ? 'bg-emerald-50 border-emerald-100' :
                                      doc.citation_check.status === 'caution' ? 'bg-amber-50 border-amber-100' :
                                      'bg-red-50 border-red-100'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                          doc.citation_check.status === 'valid' ? 'bg-emerald-500' :
                                          doc.citation_check.status === 'caution' ? 'bg-amber-500' :
                                          'bg-red-500'
                                        }`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Validity Status: {doc.citation_check.status.toUpperCase()}</span>
                                      </div>
                                      <p className="text-xs text-slate-700 leading-relaxed">
                                        {doc.citation_check.analysis}
                                      </p>
                                    </div>
                                  )}

                                  {doc.citation_analysis && (
                                    <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Scale size={14} className="text-indigo-600" />
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Detailed Risk Assessment</span>
                                      </div>
                                      <div className="text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap">
                                        <Markdown>{doc.citation_analysis}</Markdown>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-wrap gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingDoc(doc);
                                      setEditTitle(doc.title);
                                      setEditCitation(doc.citation || '');
                                      setEditTags(Array.isArray(doc.tags) ? [...doc.tags] : []);
                                    }}
                                    className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-full font-bold hover:bg-slate-100 transition-colors flex items-center gap-1"
                                  >
                                    <Plus size={10} /> Manage Tags
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 italic">
                                Last analyzed: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      <AnimatePresence>
        {selectedVersionDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <HistoryIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900">Version History</h3>
                    <p className="text-sm text-slate-500">{selectedVersionDoc.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedVersionDoc(null);
                    setVersionFile(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Current Version */}
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                      Current Version (v{selectedVersionDoc.version})
                    </h4>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                        <Upload size={14} /> Upload New
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setVersionFile(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900 truncate max-w-[300px]">{selectedVersionDoc.filename}</p>
                      <p className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                        <Clock size={12} /> {new Date(selectedVersionDoc.uploaded_at).toLocaleString()} • {((selectedVersionDoc.size || 0) / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button 
                      onClick={() => handleViewVersionContent(selectedVersionDoc.filename, { version: selectedVersionDoc.version, uploaded_at: selectedVersionDoc.uploaded_at })}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="View current content"
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  {versionFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-white rounded-xl border border-indigo-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={16} className="text-indigo-400 flex-shrink-0" />
                          <span className="text-xs text-slate-600 truncate font-medium">{versionFile.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isUploadingVersion && (
                            <>
                              <button 
                                onClick={() => handleUploadVersion(selectedVersionDoc.id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => setVersionFile(null)}
                                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isUploadingVersion && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 shadow-inner">
                          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <div className="w-3 h-3 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Processing Version</h4>
                              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{processingStep || 'Initializing...'}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* AI Analysis Stage */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${aiProgress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {aiProgress === 100 ? <Check size={10} /> : <BrainCircuit size={10} />}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-700">AI Analysis</span>
                                </div>
                                <span className={`text-[9px] font-mono ${aiProgress === 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                  {aiProgress}%
                                </span>
                              </div>
                              <div className="pl-6">
                                <p className="text-[9px] text-slate-400 italic mb-1.5">{aiStep || 'Waiting...'}</p>
                                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full transition-all duration-500 ${aiProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${aiProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* File Upload Stage */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${fileProgress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {fileProgress === 100 ? <Check size={10} /> : <Upload size={10} />}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-700">File Upload</span>
                                </div>
                                <span className={`text-[9px] font-mono ${fileProgress === 100 ? 'text-emerald-500' : 'text-slate-500'}`}>
                                  {fileProgress}%
                                </span>
                              </div>
                              <div className="pl-6">
                                <p className="text-[9px] text-slate-400 italic mb-1.5">{fileStep || 'Queued...'}</p>
                                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full transition-all duration-500 ${fileProgress === 100 ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${fileProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase mb-1 tracking-widest">
                              <span>Total Progress</span>
                              <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                              <motion.div 
                                className="h-full bg-slate-900 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Previous Versions */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 font-bold">Previous Versions History</h4>
                  {(!selectedVersionDoc.versions || selectedVersionDoc.versions.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <HistoryIcon size={32} className="text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400 italic">No previous versions available.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedVersionDoc.versions.map((v) => (
                        <div key={v.id} className="group flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-serif font-bold text-xs group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              v{v.version}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Version {v.version}</p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock size={10} /> {new Date(v.uploaded_at).toLocaleString()} • {(v.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleViewVersionContent(v.filename, v)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                              title="View content"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleCompareVersion(selectedVersionDoc.filename, v.filename, v)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                              title="Compare with current"
                            >
                              <GitCompare size={16} />
                            </button>
                            <button 
                              onClick={() => handleRevert(selectedVersionDoc.id, v.id)}
                              className="px-3 py-1.5 text-indigo-600 hover:bg-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Revert
                            </button>
                            <a 
                              href={`/api/documents/download/${v.filename}`}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                              title="Download"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {comparingVersion && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                    <GitCompare size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Version Comparison</h3>
                    <p className="text-sm text-slate-500">Comparing Current (v{selectedVersionDoc?.version}) vs Version {comparingVersion.version}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setComparingVersion(null);
                    setComparisonContent(null);
                  }}
                  className="p-3 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {isComparisonLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <p className="font-serif italic text-lg">Analyzing differences...</p>
                  </div>
                ) : comparisonContent ? (
                  <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x divide-slate-200">
                    <div className="flex flex-col h-full overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Current Version (v{selectedVersionDoc?.version})</span>
                        <span className="text-[10px] text-slate-400">{new Date(selectedVersionDoc?.uploaded_at || '').toLocaleString()}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 bg-white">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                          {comparisonContent.current}
                        </pre>
                      </div>
                    </div>
                    <div className="flex flex-col h-full overflow-hidden">
                      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Version {comparingVersion.version}</span>
                        <span className="text-[10px] text-indigo-400">{new Date(comparingVersion.uploaded_at).toLocaleString()}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 bg-indigo-50/10">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                          {comparisonContent.target}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <p>Failed to load comparison content.</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="text-sm text-slate-500 italic">
                  Note: This is a side-by-side text comparison.
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setComparingVersion(null);
                      setComparisonContent(null);
                    }}
                    className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    Close Comparison
                  </button>
                  <button 
                    onClick={() => handleRevert(selectedVersionDoc!.id, comparingVersion.id)}
                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                  >
                    <RotateCcw size={18} /> Revert to Version {comparingVersion.version}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {(previewDoc || viewingVersion) && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    ((viewingVersion ? selectedVersionDoc?.type : previewDoc?.type) || 'case') === 'case' ? 'bg-blue-50 text-blue-600' :
                    ((viewingVersion ? selectedVersionDoc?.type : previewDoc?.type) || 'case') === 'statute' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-serif font-bold text-slate-900">
                        {viewingVersion ? `Version ${viewingVersion.version} Preview` : previewDoc?.title}
                      </h3>
                      {(viewingVersion ? selectedVersionDoc?.citation : previewDoc?.citation) && !viewingVersion && (
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                          {viewingVersion ? selectedVersionDoc?.citation : previewDoc?.citation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">
                      {viewingVersion ? `Uploaded on ${new Date(viewingVersion.uploaded_at).toLocaleString()}` : `${previewDoc?.type} • ${new Date(previewDoc?.uploaded_at || '').toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setPreviewDoc(null);
                    setViewingVersion(null);
                    setPreviewContent(null);
                  }}
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
                    
                    {(viewingVersion ? viewingVersion.summary : previewDoc?.summary) && (
                      <div>
                        <h4 className="text-xs font-mono text-slate-400 uppercase mb-3 tracking-widest">Document Snippet</h4>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 leading-relaxed">
                          "{viewingVersion ? viewingVersion.summary : previewDoc?.summary}"
                        </div>
                      </div>
                    )}

                    {!viewingVersion && (
                      <div className="mb-6">
                        <h4 className="text-xs font-mono text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                          <Tag size={12} /> Document Tags
                        </h4>
                        <TagManager 
                          tags={previewDoc?.tags || []}
                          onAdd={(tag) => handleAddTag(previewDoc?.id!, tag)}
                          onRemove={(tag) => handleRemoveTag(previewDoc?.id!, tag)}
                          allTags={allTags}
                        />
                      </div>
                    )}

                    {(viewingVersion ? viewingVersion.citation_check : previewDoc?.citation_check) && (
                      <div className={`p-6 rounded-xl border ${
                        (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'valid' ? 'bg-green-50 border-green-100' :
                        (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'caution' ? 'bg-amber-50 border-amber-100' :
                        (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'invalid' ? 'bg-red-50 border-red-100' :
                        'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold flex items-center gap-2 ${
                            (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'valid' ? 'text-green-900' :
                            (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'caution' ? 'text-amber-900' :
                            (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'invalid' ? 'text-red-900' :
                            'text-slate-900'
                          }`}>
                            {(viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'valid' ? <CheckCircle2 size={18} /> : 
                             (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'caution' ? <ShieldAlert size={18} /> : 
                             (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'invalid' ? <X size={18} /> :
                             <Info size={18} />}
                            Citation Validity Check: {(viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status)?.toUpperCase()}
                          </h4>
                          {!viewingVersion && (previewDoc?.citation_check || previewDoc?.citation_analysis) && (
                            <button 
                              onClick={() => handleExportCitationAnalysis(previewDoc!)}
                              className={`flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg text-xs font-bold transition-all shadow-sm ${
                                previewDoc?.citation_check?.status === 'valid' ? 'border-green-200 text-green-600 hover:bg-green-600 hover:text-white' :
                                previewDoc?.citation_check?.status === 'caution' ? 'border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white' :
                                previewDoc?.citation_check?.status === 'invalid' ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white' :
                                'border-slate-200 text-slate-600 hover:bg-slate-600 hover:text-white'
                              }`}
                            >
                              <Download size={14} /> Export Citation Analysis
                            </button>
                          )}
                        </div>
                        <p className={`text-sm ${
                          (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'valid' ? 'text-green-700' :
                          (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'caution' ? 'text-amber-700' :
                          (viewingVersion ? viewingVersion.citation_check.status : previewDoc?.citation_check?.status) === 'invalid' ? 'text-red-700' :
                          'text-slate-700'
                        }`}>
                          {viewingVersion ? viewingVersion.citation_check.analysis : previewDoc?.citation_check?.analysis}
                        </p>
                      </div>
                    )}

                    {(viewingVersion ? viewingVersion.citation_analysis : previewDoc?.citation_analysis) && (
                      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                            <Scale size={18} /> Detailed Citation Analysis
                          </h4>
                        </div>
                        <p className="text-sm text-indigo-700 leading-relaxed">
                          {viewingVersion ? viewingVersion.citation_analysis : previewDoc?.citation_analysis}
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
                {previewContent && (
                  <button 
                    onClick={() => handleCopy(previewContent)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      isCopied ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                )}
                {previewContent && (
                  <button 
                    onClick={() => {
                      if (onSummarize) {
                        onSummarize(previewContent, previewDoc.citation);
                        setPreviewDoc(null);
                      }
                    }}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    <Zap size={18} /> AI Summarize
                  </button>
                )}
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

      <AnimatePresence>
        {editingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 size={20} className="text-indigo-600" /> Edit Metadata
                </h3>
                <button onClick={() => setEditingDoc(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">Document Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">Citation</label>
                  <input 
                    type="text" 
                    value={editCitation}
                    onChange={(e) => setEditCitation(e.target.value)}
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">Author</label>
                  <input 
                    type="text" 
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">Date Published</label>
                  <input 
                    type="date" 
                    value={editDatePublished}
                    onChange={(e) => setEditDatePublished(e.target.value)}
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Keywords</label>
                  <TagManager 
                    tags={editKeywords}
                    onAdd={(keyword) => setEditKeywords([...editKeywords, keyword])}
                    onRemove={(keyword) => setEditKeywords(editKeywords.filter(k => k !== keyword))}
                    allTags={[]}
                    icon={Hash}
                    placeholder="Add keywords..."
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Document Tags</label>
                  <TagManager 
                    tags={editTags}
                    onAdd={(tag) => setEditTags([...editTags, tag])}
                    onRemove={(tag) => setEditTags(editTags.filter(t => t !== tag))}
                    allTags={allTags}
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditingDoc(null)}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBatchEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 size={20} className="text-indigo-600" /> Batch Edit ({selectedIds.length} items)
                </h3>
                <button onClick={() => setIsBatchEditing(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleBatchUpdate} className="p-6 space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 italic">
                  Leave fields blank to keep their current values.
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">New Document Title</label>
                  <input 
                    type="text" 
                    value={batchEditTitle}
                    onChange={(e) => setBatchEditTitle(e.target.value)}
                    placeholder="Keep current title"
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">New Citation</label>
                  <input 
                    type="text" 
                    value={batchEditCitation}
                    onChange={(e) => setBatchEditCitation(e.target.value)}
                    placeholder="Keep current citation"
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">New Author</label>
                  <input 
                    type="text" 
                    value={batchEditAuthor}
                    onChange={(e) => setBatchEditAuthor(e.target.value)}
                    placeholder="Keep current author"
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">New Date Published</label>
                  <input 
                    type="date" 
                    value={batchEditDatePublished}
                    onChange={(e) => setBatchEditDatePublished(e.target.value)}
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">New Keywords</label>
                  <TagManager 
                    tags={batchEditKeywords}
                    onAdd={(keyword) => setBatchEditKeywords([...batchEditKeywords, keyword])}
                    onRemove={(keyword) => setBatchEditKeywords(batchEditKeywords.filter(k => k !== keyword))}
                    allTags={[]}
                    icon={Hash}
                    placeholder="Add keywords to apply to all..."
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">New Tags</label>
                  <TagManager 
                    tags={batchEditTags}
                    onAdd={(tag) => setBatchEditTags([...batchEditTags, tag])}
                    onRemove={(tag) => setBatchEditTags(batchEditTags.filter(t => t !== tag))}
                    allTags={allTags}
                    placeholder="Add tags to apply to all..."
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsBatchEditing(false)}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isBatchUpdating}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isBatchUpdating ? 'Updating...' : 'Apply to Selected'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSavingSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark size={20} className="text-indigo-600" /> Save Current Search
                </h3>
                <button onClick={() => setIsSavingSearch(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">Current Filters</p>
                  <div className="flex flex-wrap gap-1">
                    {searchQuery && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Query: {searchQuery}</span>}
                    {filter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Type: {filter}</span>}
                    {tagFilter.length > 0 && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Tags ({tagFilterLogic}): {tagFilter.join(', ')}</span>}
                    {citationFilter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Citation: {citationFilter}</span>}
                    {sizeFilter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Size: {sizeFilter}</span>}
                    {statusFilter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Status: {statusFilter}</span>}
                    {summaryFilter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Summary: {summaryFilter}</span>}
                    {analysisFilter !== 'all' && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Analysis: {analysisFilter}</span>}
                    {(startDate || endDate) && <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded text-[10px] text-indigo-600">Date: {startDate || 'Any'} - {endDate || 'Any'}</span>}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase">Search Name</label>
                  <input 
                    type="text" 
                    value={newSearchName}
                    onChange={(e) => setNewSearchName(e.target.value)}
                    placeholder="e.g., Recent Criminal Cases"
                    className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900"
                    autoFocus
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsSavingSearch(false)}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveSearch}
                    disabled={!newSearchName.trim()}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    Save Search
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResearchAssistant = () => {
  const { fetchWithAuth } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, id: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [researchMode, setResearchMode] = useState<'memo' | 'statute' | 'case' | 'article' | 'summarizer' | 'autonomous'>('memo');
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
      summarizer: ["Reading Case Text...", "Identifying Facts...", "Extracting Issues...", "Analyzing Ruling...", "Synthesizing Legal Analysis..."],
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
      } else if (researchMode === 'summarizer') {
        systemPrompt += `
        ROLE: Case Summarizer.
        TASK: Provide a highly structured and precise summary of a case text or citation.
        STRUCTURE:
        1. CASE TITLE & CITATION: Full title and G.R. Number.
        2. FACTS: A concise narrative of the essential events.
        3. ISSUES: The core legal questions addressed by the Court.
        4. RULING: The Court's decision and the underlying legal reasoning.
        5. DOCTRINE: The specific legal principle or "black letter law" established.
        6. IMPLICATIONS: Brief analysis of how this affects Philippine jurisprudence.`;
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
              onClick={() => setResearchMode('summarizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${researchMode === 'summarizer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Summarizer
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

const CaseSummarizer = ({ 
  initialText, 
  initialCitation,
  onClear
}: { 
  initialText?: string, 
  initialCitation?: string,
  onClear?: () => void
}) => {
  const { fetchWithAuth } = useAuth();
  const [caseText, setCaseText] = useState(initialText || '');
  const [citationInput, setCitationInput] = useState(initialCitation || '');
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

  const handleSummarize = useCallback(async (useSearch = false) => {
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
        Once found, provide a comprehensive legal summary tailored for Philippine legal practice. 
        Extract the following:
        1. Case Title
        2. Case Citation (G.R. Number and Date)
        3. Facts (Concise but complete narrative of the dispute)
        4. Issues (The specific legal questions resolved by the Court)
        5. Ruling (The Court's decision and the ratio decidendi)
        6. Legal Analysis (The specific doctrine or legal principle established, and its implications for Philippine jurisprudence).`;
        config.tools = [{ googleSearch: {} }];
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else {
        prompt = `Please provide a detailed legal summary of the following Philippine Supreme Court decision. 
        Extract the Case Title, Case Citation (G.R. Number), Facts, Issues, Ruling, and a brief Legal Analysis highlighting the specific doctrine or legal principle established by the Court and its implications for Philippine jurisprudence.
        
        Case Text: ${caseText}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
  }, [caseText, citationInput]);

  useEffect(() => {
    if (initialText) {
      setCaseText(initialText);
      // Auto-summarize if text is provided from library
      if (!summary && !loading) {
        handleSummarize();
      }
    }
    if (initialCitation) setCitationInput(initialCitation);
  }, [initialText, initialCitation, handleSummarize]);

  const saveToLibrary = async () => {
    if (!summary) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/documents/save-summary', {
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
                onClick={() => { 
                  setCaseText(''); 
                  setCitationInput(''); 
                  setSummary(null); 
                  if (onClear) onClear();
                }}
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
          model: "gemini-3-flash-preview",
          contents: `Analyze the following case facts and identify the key legal issues and applicable laws in the Philippines: ${input}`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        addLog("Facts analyzed and issues identified.", 'success');
        
        addLog("Agent: Searching Philippine jurisprudence for relevant precedents...", 'agent');
        const searchResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Search for Philippine Supreme Court cases relevant to these legal issues: ${analysisResponse.text}. 
          Provide a list of 3-5 most relevant cases with their citations and brief summaries.`,
          config: { tools: [{ googleSearch: {} }] }
        });
        addLog("Found relevant jurisprudence and precedents.", 'success');

        addLog("Agent: Predicting case outcome and assessing risks...", 'agent');
        const predictionResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Based on the facts: ${input}, and the jurisprudence found: ${searchResponse.text}, predict the likely outcome of this case in a Philippine court. 
          Include:
          - Win probability (percentage)
          - Major legal risks and vulnerabilities
          - Strategic recommendations for the client.`,
        });
        addLog("Outcome predicted and risks assessed.", 'success');

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
        
        setResult(finalResponse.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'compliance-check') {
        addLog("Agent: Identifying applicable statutes and regulations...", 'agent');
        const statutesResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Identify all relevant Philippine statutes, executive orders, and administrative regulations applicable to this scenario: ${input}`,
          config: { tools: [{ googleSearch: {} }] }
        });
        addLog("Applicable laws identified.", 'success');
        
        addLog("Agent: Cross-referencing fact pattern with legal provisions...", 'agent');
        const complianceResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze the scenario: ${input} for compliance with the following laws: ${statutesResponse.text}. 
          Identify specific areas of non-compliance and potential penalties.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        addLog("Compliance analysis completed.", 'success');

        addLog("Agent: Generating compliance report and remediation plan...", 'agent');
        const finalReport = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Draft a comprehensive Compliance Report based on the analysis:
          
          Scenario: ${input}
          Applicable Laws: ${statutesResponse.text}
          Compliance Analysis: ${complianceResponse.text}
          
          The report should include a summary of findings, a risk assessment matrix, and a step-by-step remediation plan.`,
        });
        
        setResult(finalReport.text || "Workflow completed with no output.");
      } else if (activeWorkflow === 'contract-review') {
        addLog("Agent: Parsing contract clauses and identifying key terms...", 'agent');
        const parsingResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Parse the following contract text and identify key terms, obligations, and termination clauses: ${input}`,
        });
        addLog("Contract parsed.", 'success');
        
        addLog("Agent: Identifying high-risk provisions and legal pitfalls...", 'agent');
        const riskResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Review the contract terms: ${parsingResponse.text} for high-risk provisions, ambiguities, and potential legal pitfalls under Philippine law.`,
          config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
        });
        addLog("Risks identified.", 'success');

        addLog("Agent: Suggesting amendments and drafting review summary...", 'agent');
        const reviewSummary = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a Contract Review Summary based on the analysis:
          
          Contract Text: ${input}
          Key Terms: ${parsingResponse.text}
          Risk Analysis: ${riskResponse.text}
          
          Provide specific suggestions for amendments to mitigate the identified risks and ensure the contract is favorable to the client.`,
        });
        
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
              className="legal-card p-6"
            >
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Workflow Input</h4>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Provide the necessary facts, case text, or contract provisions to begin..."
                className="w-full h-40 bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none mb-4 shadow-inner"
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

const KnowledgeBase = ({ showConfirm }: { showConfirm: (title: string, message: string, onConfirm: () => void, type?: 'danger' | 'warning' | 'info') => void }) => {
  const { fetchWithAuth } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    category: 'General',
    tags: '',
    source_doc_id: undefined as number | undefined
  });
  
  const { documents } = useDocumentStore();

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      alert("Please enter a title for the insight.");
      return;
    }
    
    setIsSaving(true);
    try {
      const url = editingNoteId ? `/api/notes/${editingNoteId}` : '/api/notes';
      const method = editingNoteId ? 'PATCH' : 'POST';
      
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      
      if (res.ok) {
        await fetchNotes();
        setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
        setIsAdding(false);
        setEditingNoteId(null);
      } else {
        const errorData = await res.json();
        alert(`Failed to save insight: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Save note error:", err);
      alert("An error occurred while saving the insight.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || '',
      source_doc_id: note.source_doc_id
    });
    setEditingNoteId(note.id);
    setIsAdding(true);
  };

  const handleDeleteNote = (id: number) => {
    showConfirm(
      "Delete Insight",
      "Are you sure you want to delete this insight? This action cannot be undone.",
      async () => {
        try {
          const res = await fetchWithAuth(`/api/notes/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setNotes(prev => prev.filter(n => n.id !== id));
          } else {
            alert("Failed to delete insight.");
          }
        } catch (err) {
          console.error("Delete note error:", err);
          alert("An error occurred while deleting the insight.");
        }
      },
      'danger'
    );
  };

  const handleGenerateInsight = async (docId: number) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Fetch doc content
      const contentRes = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
      const contentData = await contentRes.json();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following legal document, generate a strategic "Legal Insight" or "Practice Note". 
        Focus on how this case/statute impacts private legal practice, potential risks for clients, and strategic opportunities.
        The insight should be concise, professional, and actionable.
        
        Document: ${doc.title}
        Content: ${contentData.content?.substring(0, 20000) || "No content available."}
        
        Return a JSON object with 'title', 'content', and 'suggested_tags' (comma separated).`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              suggested_tags: { type: Type.STRING }
            },
            required: ['title', 'content', 'suggested_tags']
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setNewNote({
          title: data.title,
          content: data.content,
          category: 'AI Generated',
          tags: data.suggested_tags,
          source_doc_id: docId
        });
        setEditingNoteId(null);
        setIsAdding(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate insight.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.tags && note.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'General', 'Civil Law', 'Criminal Law', 'Labor Law', 'Taxation', 'Practice Note', 'AI Generated', 'Strategy'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Knowledge Portal</h1>
          <p className="text-slate-500">Centralized repository for internal knowledge diffusion and strategic insights.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchNotes}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Refresh Insights"
          >
            <RotateCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => {
              setEditingNoteId(null);
              setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} /> New Insight
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="legal-card p-4 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Search Insights</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Keywords, tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Categories</label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white font-medium' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="legal-card p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-600" /> AI Synthesis
            </h3>
            <p className="text-xs text-slate-500 mb-4">Generate strategic practice notes from your document library.</p>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {documents.slice(0, 15).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleGenerateInsight(doc.id)}
                  disabled={isGenerating}
                  className="w-full text-left p-2 rounded border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group disabled:opacity-50"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Case</div>
                  <div className="text-xs font-medium text-slate-700 line-clamp-1 group-hover:text-indigo-700">{doc.title}</div>
                </button>
              ))}
              {documents.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-4">No documents in library</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="legal-card p-6 border-2 border-indigo-100 shadow-lg relative"
            >
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingNoteId(null);
                  setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Insight Title"
                  value={newNote.title}
                  onChange={e => setNewNote({...newNote, title: e.target.value})}
                  className="w-full text-2xl font-serif font-bold focus:outline-none border-b border-slate-100 pb-2"
                />
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Category</label>
                    <select 
                      value={newNote.category}
                      onChange={e => setNewNote({...newNote, category: e.target.value})}
                      className="w-full bg-slate-50 text-sm px-3 py-2 rounded border border-slate-200"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Tags (comma separated)</label>
                    <input 
                      type="text"
                      placeholder="e.g. strategy, risk, civil-law"
                      value={newNote.tags}
                      onChange={e => setNewNote({...newNote, tags: e.target.value})}
                      className="w-full bg-slate-50 text-sm px-3 py-2 rounded border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Insight Content</label>
                  <textarea 
                    placeholder="Describe the legal insight, strategic implication, or practice note..."
                    value={newNote.content}
                    onChange={e => setNewNote({...newNote, content: e.target.value})}
                    className="w-full h-48 bg-slate-50 p-4 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingNoteId(null);
                      setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddNote}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <RotateCcw size={16} className="animate-spin" />}
                    {editingNoteId ? (isSaving ? 'Updating...' : 'Update Insight') : (isSaving ? 'Saving...' : 'Save Insight')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <RotateCcw className="animate-spin mb-4" size={32} />
                <p>Loading insights...</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <motion.div 
                  layout
                  key={note.id}
                  className="legal-card p-5 hover:border-indigo-200 transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      note.category === 'AI Generated' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {note.category}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleEditNote(note)}
                        className="text-slate-300 hover:text-indigo-600"
                        title="Edit Insight"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-300 hover:text-red-500"
                        title="Delete Insight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">{note.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-4 mb-4 leading-relaxed">{note.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags?.split(',').map((tag, i) => (
                      tag.trim() && (
                        <span key={i} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                          #{tag.trim()}
                        </span>
                      )
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    {note.source_doc_id && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                        <BookOpen size={10} /> LINKED TO SOURCE
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {!isLoading && filteredNotes.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No insights found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const { profile, loading: authLoading, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [summarizerInitialData, setSummarizerInitialData] = useState<{text: string, citation?: string} | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'warning') => {
    setConfirmModal({ show: true, title, message, onConfirm, type });
  };

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <AuthScreen />;
  }

  const handleSummarizeFromLibrary = (text: string, citation?: string) => {
    setSummarizerInitialData({ text, citation });
    setActiveView('summarizer');
  };

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
          {isAdmin && (
            <SidebarItem 
              icon={Shield} 
              label="Admin Console" 
              active={activeView === 'admin'} 
              onClick={() => setActiveView('admin')} 
            />
          )}
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-2">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
          />
          <div className="pt-4 mt-4 border-t border-slate-50">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {profile.displayName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{profile.displayName}</p>
                <p className="text-[10px] text-slate-500 truncate">{profile.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
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
            {activeView === 'summarizer' && (
              <CaseSummarizer 
                initialText={summarizerInitialData?.text} 
                initialCitation={summarizerInitialData?.citation}
                onClear={() => setSummarizerInitialData(null)}
              />
            )}
            {activeView === 'statutes' && <StatuteSearch />}
            {activeView === 'analytics' && <PredictiveAnalytics />}
            {activeView === 'knowledge' && <KnowledgeBase showConfirm={showConfirm} />}
            {activeView === 'admin' && <AdminDashboard />}
            {activeView === 'library' && (
              <DocumentLibrary 
                onSummarize={handleSummarizeFromLibrary} 
                setSummarizerInitialData={setSummarizerInitialData}
                setActiveView={setActiveView}
                showConfirm={showConfirm}
              />
            )}
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

      <ConfirmModal 
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, show: false }))}
        type={confirmModal.type}
      />
    </div>
  );
}
