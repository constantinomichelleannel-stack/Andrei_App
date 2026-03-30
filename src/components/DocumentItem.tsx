import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  FileText, Check, ShieldAlert, X, Info, ChevronRight, Tag, Plus, Hash, 
  User, Calendar, CheckCircle2, Clock, Zap, BrainCircuit, Edit2, History, 
  Download, Eye, Copy, ArrowUpDown, Scale, Shield, ListChecks, AlertTriangle
} from 'lucide-react';
import { LegalDocument } from '../types';

interface DocumentItemProps {
  doc: LegalDocument;
  searchQuery: string;
  highlightText: (text: string, query: string) => React.ReactNode;
  selectedIds: number[];
  handleSelect: (id: number) => void;
  expandedDocId: number | null;
  setExpandedDocId: (id: number | null) => void;
  tagFilter: string[];
  setTagFilter: (tags: string[]) => void;
  setKeywordFilter: (keyword: string) => void;
  setEditingDoc: (doc: LegalDocument) => void;
  setEditTitle: (title: string) => void;
  setEditCitation: (citation: string) => void;
  setEditTags: (tags: string[]) => void;
  setEditAuthor: (author: string) => void;
  setEditDatePublished: (date: string) => void;
  setEditKeywords: (keywords: string[]) => void;
  setEditType: (type: 'case' | 'statute' | 'memo') => void;
  generatingInsightId: number | null;
  handleGenerateInsight: (id: number) => void;
  setSelectedVersionDoc: (doc: LegalDocument) => void;
  handlePreview: (doc: LegalDocument) => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  setActiveView: (view: any) => void;
  showStructuredSummaryId: number | null;
  setShowStructuredSummaryId: (id: number | null) => void;
  handleExportCitationAnalysis: (doc: LegalDocument) => void;
  aiStep: string | null;
  aiProgress: number;
  currentUserId?: string;
  onTogglePublic?: (doc: LegalDocument) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  doc,
  searchQuery,
  highlightText,
  selectedIds,
  handleSelect,
  expandedDocId,
  setExpandedDocId,
  tagFilter,
  setTagFilter,
  setKeywordFilter,
  setEditingDoc,
  setEditTitle,
  setEditCitation,
  setEditTags,
  setEditAuthor,
  setEditDatePublished,
  setEditKeywords,
  setEditType,
  generatingInsightId,
  handleGenerateInsight,
  setSelectedVersionDoc,
  handlePreview,
  fetchWithAuth,
  setActiveView,
  showStructuredSummaryId,
  setShowStructuredSummaryId,
  handleExportCitationAnalysis,
  aiStep,
  aiProgress,
  currentUserId,
  onTogglePublic
}) => {
  const isExpanded = expandedDocId === doc.id;
  const isOwner = currentUserId === doc.uid;
  const [activeTab, setActiveTab] = useState<'summary' | 'citations'>('summary');

  // Reset tab when document changes or collapses
  React.useEffect(() => {
    if (!isExpanded) {
      setActiveTab(doc.legal_summary || doc.summary ? 'summary' : 'citations');
    }
  }, [isExpanded, doc.id]);

  return (
    <div className="space-y-2">
      <div 
        onClick={() => {
          if (doc.legal_summary || doc.summary) {
            setExpandedDocId(isExpanded ? null : doc.id);
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
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(doc.id);
            }}
            className={`p-1 rounded transition-colors ${
              selectedIds.includes(doc.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'
            }`}
          >
            {selectedIds.includes(doc.id) ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] border-2 border-slate-200 rounded" />}
          </button>
          <div className="relative flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              { (doc.legal_summary || doc.summary) && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} className="text-slate-400" />
                </motion.div>
              )}
              <h4 className="font-bold text-slate-900 truncate">{highlightText(doc.title, searchQuery)}</h4>
              {doc.citation && (
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
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

            {/* AI Summary Snippet - Prominent Display */}
            {(doc.summary || doc.legal_summary) && (
              <div className="mt-2 mb-3 group/summary">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={10} className="text-indigo-600" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">AI Summary</span>
                </div>
                <div className="relative">
                  <p className={`text-xs text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {highlightText(doc.summary || doc.legal_summary?.facts || '', searchQuery)}
                  </p>
                  {!isExpanded && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDocId(doc.id);
                      }}
                      className="text-[10px] text-indigo-600 font-bold hover:text-indigo-800 transition-colors mt-1 flex items-center gap-0.5"
                    >
                      Read Full Summary <ChevronRight size={10} className="rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            )}

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
                    setEditType(doc.type as 'case' | 'statute' | 'memo' || 'case');
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Manage Tags"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
              <span className="uppercase font-mono font-bold">{doc.type}</span>
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
              {doc.size && (
                <>
                  <span>•</span>
                  <span>{(doc.size / 1024).toFixed(1)} KB</span>
                </>
              )}
              {doc.status && (
                <>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-bold ${
                    doc.status === 'completed' ? 'text-emerald-600' :
                    doc.status === 'processing' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {doc.status === 'completed' ? <CheckCircle2 size={10} /> : 
                     doc.status === 'processing' ? <Clock size={10} /> : 
                     <ShieldAlert size={10} />}
                    {doc.status.toUpperCase()}
                  </span>
                </>
              )}
              {doc.uid && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-slate-400">
                    {doc.is_public ? (
                      <div className="flex items-center gap-1 text-indigo-600">
                        <Scale size={10} /> PUBLIC
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Shield size={10} /> PRIVATE
                      </div>
                    )}
                  </span>
                </>
              )}
            </div>

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
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
              setEditType(doc.type as 'case' | 'statute' | 'memo' || 'case');
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Edit Metadata"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => setSelectedVersionDoc(doc)}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative"
            title="Version History"
          >
            <History size={18} />
            {doc.version && doc.version > 1 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-indigo-500 text-white text-[7px] flex items-center justify-center rounded-full border-2 border-white">
                {doc.version}
              </span>
            )}
          </button>
          <button 
            onClick={() => handlePreview(doc)}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Preview"
          >
            <Eye size={18} />
          </button>
          {isOwner && onTogglePublic && (
            <button 
              onClick={() => onTogglePublic(doc)}
              className={`p-2 transition-colors ${doc.is_public ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
              title={doc.is_public ? "Make Private" : "Make Public"}
            >
              {doc.is_public ? <Scale size={18} /> : <Shield size={18} />}
            </button>
          )}
          <a 
            href={`/api/documents/download/${doc.filename}`}
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            title="Download"
          >
            <Download size={18} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (doc.legal_summary || doc.citation_check || doc.summary) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl ml-12 mr-4 mb-4 shadow-inner">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === 'summary' 
                      ? 'text-indigo-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <BrainCircuit size={14} />
                  Legal Summary & Analysis
                  {activeTab === 'summary' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('citations')}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === 'citations' 
                      ? 'text-indigo-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ShieldAlert size={14} />
                  Citation & Risk Analysis
                  {activeTab === 'citations' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </button>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'summary' ? (
                  <div className="space-y-6">
                    {/* AI Summary Section if no legal_summary but has summary */}
                    {!doc.legal_summary && doc.summary && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-indigo-600" />
                          <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">General AI Summary</h5>
                        </div>
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                          {doc.summary}
                        </p>
                      </div>
                    )}

                    {/* AI Legal Analysis Section */}
                    {doc.legal_summary && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BrainCircuit size={18} className="text-indigo-600" />
                            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Structured Legal Analysis</h5>
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
                              onClick={() => setShowStructuredSummaryId(showStructuredSummaryId === doc.id ? null : doc.id)}
                              className={`text-[10px] px-3 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
                                showStructuredSummaryId === doc.id 
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              {showStructuredSummaryId === doc.id ? 'Hide Details' : 'View Full Case Brief'}
                              <ArrowUpDown size={10} />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          {showStructuredSummaryId === doc.id ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-2">
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facts of the Case</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                      {doc.legal_summary.facts}
                                    </p>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Issues</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                      {doc.legal_summary.issues}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Court Ruling</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                      {doc.legal_summary.ruling}
                                    </p>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
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
                            <div className="bg-white p-6 rounded-xl border border-dashed border-slate-200 text-center">
                              <BrainCircuit size={24} className="text-slate-200 mx-auto mb-2" />
                              <p className="text-xs text-slate-400 italic mb-3">Structured analysis is available for this document.</p>
                              <button 
                                onClick={() => setShowStructuredSummaryId(doc.id)}
                                className="text-[10px] bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition-colors"
                              >
                                View Case Brief Details
                              </button>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Citation Analysis & Risk Assessment Section */}
                    {(doc.citation_check || doc.citation_analysis) ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldAlert size={18} className={
                              doc.citation_check?.status === 'valid' ? 'text-emerald-600' :
                              doc.citation_check?.status === 'caution' ? 'text-amber-600' :
                              'text-red-600'
                            } />
                            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Citation Integrity & Risk Assessment</h5>
                          </div>
                          {(doc.citation_check || doc.citation_analysis) && (
                            <button 
                              onClick={() => handleExportCitationAnalysis(doc)}
                              className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                              <Download size={10} /> Export Analysis
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {doc.citation_check && (
                            <div className={`p-5 rounded-xl border shadow-sm ${
                              doc.citation_check.status === 'valid' ? 'bg-emerald-50/50 border-emerald-100' :
                              doc.citation_check.status === 'caution' ? 'bg-amber-50/50 border-amber-100' :
                              'bg-red-50/50 border-red-100'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2.5 h-2.5 rounded-full ${
                                    doc.citation_check.status === 'valid' ? 'bg-emerald-500' :
                                    doc.citation_check.status === 'caution' ? 'bg-amber-500' :
                                    'bg-red-500'
                                  }`} />
                                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                    Status: {doc.citation_check.status.toUpperCase()}
                                  </span>
                                </div>
                                {doc.citation_check.status !== 'valid' && (
                                  <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                    <AlertTriangle size={10} /> ACTION REQUIRED
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {doc.citation_check.analysis}
                              </p>
                            </div>
                          )}

                          {doc.citation_analysis && (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                                <Scale size={14} className="text-indigo-600" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Legal Risk Profile</span>
                              </div>
                              <div className="text-xs text-slate-700 leading-relaxed prose prose-slate prose-xs max-w-none">
                                <Markdown>{doc.citation_analysis}</Markdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center">
                        <ShieldAlert size={32} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 italic">No citation analysis available for this document yet.</p>
                        <button 
                          onClick={() => handleGenerateInsight(doc.id)}
                          className="mt-4 text-[10px] bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors"
                        >
                          Run AI Analysis
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
              
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
                        setEditType(doc.type as 'case' | 'statute' | 'memo' || 'case');
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
  );
};

export default React.memo(DocumentItem);
