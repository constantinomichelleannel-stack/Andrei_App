import React from 'react';
import { Upload, FileText, BrainCircuit, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { TagManager } from './TagManager';

interface DocumentUploadProps {
  title: string;
  setTitle: (val: string) => void;
  citation: string;
  setCitation: (val: string) => void;
  author: string;
  setAuthor: (val: string) => void;
  datePublished: string;
  setDatePublished: (val: string) => void;
  keywords: string[];
  setKeywords: (val: string[]) => void;
  type: 'case' | 'statute' | 'memo';
  setType: (val: 'case' | 'statute' | 'memo') => void;
  tags: string[];
  setTags: (val: string[]) => void;
  manualSummary: string;
  setManualSummary: (val: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  allTags: string[];
  isUploading: boolean;
  uploadProgress: number;
  aiProgress: number;
  fileProgress: number;
  aiStep: string | null;
  fileStep: string | null;
  processingStep: string | null;
  handleUpload: (e: React.FormEvent) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title, setTitle,
  citation, setCitation,
  author, setAuthor,
  datePublished, setDatePublished,
  keywords, setKeywords,
  type, setType,
  tags, setTags,
  manualSummary, setManualSummary,
  file, setFile,
  allTags,
  isUploading,
  uploadProgress,
  aiProgress,
  fileProgress,
  aiStep,
  fileStep,
  processingStep,
  handleUpload
}) => {
  return (
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
            <option value="case">Supreme Court Case</option>
            <option value="statute">Statute / Law</option>
            <option value="memo">Legal Memorandum</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Tags</label>
          <TagManager 
            tags={tags}
            onAdd={(tag) => setTags([...tags, tag])}
            onRemove={(tag) => setTags(tags.filter(t => t !== tag))}
            allTags={allTags}
            placeholder="Add tags..."
          />
        </div>
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase">Manual Summary (Optional)</label>
          <textarea 
            value={manualSummary}
            onChange={(e) => setManualSummary(e.target.value)}
            placeholder="Enter a brief summary or leave blank for AI generation..."
            className="w-full p-2 border-b border-slate-200 focus:outline-none focus:border-slate-900 h-20 resize-none"
          />
        </div>
        
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-900 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto text-slate-400 mb-2" size={24} />
          <p className="text-xs font-medium text-slate-600">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, TXT, MD (Max 20MB)</p>
        </div>

        {isUploading && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 shadow-inner">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <div className="w-3 h-3 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Processing Document</h4>
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
  );
};
