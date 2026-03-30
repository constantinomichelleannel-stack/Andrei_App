import React from 'react';
import { 
  Search, X, Bookmark, History, Trash2, FileText, Calendar, 
  Database, Activity, Tag, Plus, User, BrainCircuit, Scale, 
  ShieldAlert, ArrowUpDown, RotateCcw, CheckSquare, Square, Library, Share2, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filter: 'all' | 'case' | 'statute' | 'memo';
  setFilter: (val: 'all' | 'case' | 'statute' | 'memo') => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  setSizeFilter: (val: 'all' | 'small' | 'medium' | 'large') => void;
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  setStatusFilter: (val: 'all' | 'completed' | 'processing' | 'failed') => void;
  tagFilter: string[];
  setTagFilter: (val: string[]) => void;
  tagFilterLogic: 'AND' | 'OR';
  setTagFilterLogic: (val: 'AND' | 'OR') => void;
  authorFilter: string;
  setAuthorFilter: (val: string) => void;
  datePublishedFilter: string;
  setDatePublishedFilter: (val: string) => void;
  keywordFilter: string;
  setKeywordFilter: (val: string) => void;
  summaryFilter: 'all' | 'has-summary' | 'no-summary';
  setSummaryFilter: (val: 'all' | 'has-summary' | 'no-summary') => void;
  analysisFilter: 'all' | 'has-analysis' | 'no-analysis';
  setAnalysisFilter: (val: 'all' | 'has-analysis' | 'no-analysis') => void;
  citationFilter: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked';
  setCitationFilter: (val: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked') => void;
  sortBy: 'newest' | 'oldest' | 'citation-status' | 'size-desc' | 'size-asc' | 'title';
  setSortBy: (val: 'newest' | 'oldest' | 'citation-status' | 'size-desc' | 'size-asc' | 'title') => void;
  resetFilters: () => void;
  savedSearches: any[];
  recentSearches: any[];
  addSavedSearch: (name: string) => void;
  removeSavedSearch: (id: string) => void;
  applySavedSearch: (search: any) => void;
  clearRecentSearches: () => void;
  isSavingSearch: boolean;
  setIsSavingSearch: (val: boolean) => void;
  newSearchName: string;
  setNewSearchName: (val: string) => void;
  showSavedSearches: boolean;
  setShowSavedSearches: (val: boolean) => void;
  libraryView: 'all' | 'mine' | 'public';
  setLibraryView: (val: 'all' | 'mine' | 'public') => void;
  tagSearchQuery: string;
  setTagSearchQuery: (val: string) => void;
  isTagSuggestionsVisible: boolean;
  setIsTagSuggestionsVisible: (val: boolean) => void;
  allTags: string[];
  popularTags: string[];
  selectedIds: number[];
  filteredDocumentsCount: number;
  handleSelectAll: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
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
  summaryFilter, setSummaryFilter,
  analysisFilter, setAnalysisFilter,
  citationFilter, setCitationFilter,
  sortBy, setSortBy,
  resetFilters,
  savedSearches,
  recentSearches,
  removeSavedSearch,
  applySavedSearch,
  clearRecentSearches,
  setIsSavingSearch,
  showSavedSearches, setShowSavedSearches,
  libraryView, setLibraryView,
  tagSearchQuery, setTagSearchQuery,
  isTagSuggestionsVisible, setIsTagSuggestionsVisible,
  allTags,
  popularTags,
  selectedIds,
  filteredDocumentsCount,
  handleSelectAll
}) => {
  return (
    <div className="legal-card p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setLibraryView('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${libraryView === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Library size={14} /> All Documents
          </button>
          <button 
            onClick={() => setLibraryView('mine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${libraryView === 'mine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User size={14} /> My Documents
          </button>
          <button 
            onClick={() => setLibraryView('public')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${libraryView === 'public' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Share2 size={14} /> Community Library
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
            <Filter size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Advanced Filters</span>
          </div>
          <button 
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all text-xs font-bold"
          >
            <RotateCcw size={14} /> Reset All
          </button>
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSelectAll}
            className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400"
            title="Select All"
          >
            {selectedIds.length === filteredDocumentsCount && filteredDocumentsCount > 0 ? (
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
    </div>
  );
};
