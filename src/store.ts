import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LegalDocument, SavedSearch, RecentSearch } from './types';

interface DocumentLibraryState {
  documents: LegalDocument[];
  loading: boolean;
  searchQuery: string;
  filter: 'all' | 'case' | 'statute' | 'memo';
  startDate: string;
  endDate: string;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  tagFilter: string[];
  tagFilterLogic: 'AND' | 'OR';
  authorFilter: string;
  datePublishedFilter: string;
  keywordFilter: string;
  citationFilter: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked';
  summaryFilter: 'all' | 'has-summary' | 'no-summary';
  analysisFilter: 'all' | 'has-analysis' | 'no-analysis';
  sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title' | 'citation-status';
  selectedIds: number[];
  savedSearches: SavedSearch[];
  recentSearches: RecentSearch[];

  // Actions
  setDocuments: (docs: LegalDocument[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'case' | 'statute' | 'memo') => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSizeFilter: (size: 'all' | 'small' | 'medium' | 'large') => void;
  setStatusFilter: (status: 'all' | 'completed' | 'processing' | 'failed') => void;
  setTagFilter: (tags: string[]) => void;
  setTagFilterLogic: (logic: 'AND' | 'OR') => void;
  setAuthorFilter: (author: string) => void;
  setDatePublishedFilter: (date: string) => void;
  setKeywordFilter: (keyword: string) => void;
  setCitationFilter: (citation: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked') => void;
  setSummaryFilter: (filter: 'all' | 'has-summary' | 'no-summary') => void;
  setAnalysisFilter: (filter: 'all' | 'has-analysis' | 'no-analysis') => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title' | 'citation-status') => void;
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  resetFilters: () => void;
  addSavedSearch: (search: SavedSearch) => void;
  removeSavedSearch: (id: string) => void;
  applySavedSearch: (search: SavedSearch | Partial<SavedSearch>) => void;
  addRecentSearch: (search: RecentSearch) => void;
  clearRecentSearches: () => void;
}

export const useDocumentStore = create<DocumentLibraryState>()(
  persist(
    (set) => ({
      documents: [],
      loading: true,
      searchQuery: '',
      filter: 'all',
      startDate: '',
      endDate: '',
      sizeFilter: 'all',
      statusFilter: 'all',
      tagFilter: [],
      tagFilterLogic: 'AND',
      authorFilter: '',
      datePublishedFilter: '',
      keywordFilter: '',
      citationFilter: 'all',
      summaryFilter: 'all',
      analysisFilter: 'all',
      sortBy: 'newest',
      selectedIds: [],
      savedSearches: [],
      recentSearches: [],

      setDocuments: (documents) => set({ documents }),
      setLoading: (loading) => set({ loading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilter: (filter) => set({ filter }),
      setStartDate: (startDate) => set({ startDate }),
      setEndDate: (endDate) => set({ endDate }),
      setSizeFilter: (sizeFilter) => set({ sizeFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setTagFilter: (tagFilter) => set({ tagFilter }),
      setTagFilterLogic: (tagFilterLogic) => set({ tagFilterLogic }),
      setAuthorFilter: (authorFilter) => set({ authorFilter }),
      setDatePublishedFilter: (datePublishedFilter) => set({ datePublishedFilter }),
      setKeywordFilter: (keywordFilter) => set({ keywordFilter }),
      setCitationFilter: (citationFilter) => set({ citationFilter }),
      setSummaryFilter: (summaryFilter) => set({ summaryFilter }),
      setAnalysisFilter: (analysisFilter) => set({ analysisFilter }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSelectedIds: (ids) => set((state) => ({ 
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids 
      })),
      resetFilters: () => set({
        filter: 'all',
        startDate: '',
        endDate: '',
        sizeFilter: 'all',
        statusFilter: 'all',
        tagFilter: [],
        tagFilterLogic: 'AND',
        authorFilter: '',
        datePublishedFilter: '',
        keywordFilter: '',
        citationFilter: 'all',
        summaryFilter: 'all',
        analysisFilter: 'all',
        sortBy: 'newest',
        searchQuery: '',
      }),
      addSavedSearch: (search) => set((state) => ({
        savedSearches: [search, ...state.savedSearches]
      })),
      removeSavedSearch: (id) => set((state) => ({
        savedSearches: state.savedSearches.filter(s => s.id !== id)
      })),
      applySavedSearch: (search) => set({
        searchQuery: search.query || '',
        filter: search.filter || 'all',
        startDate: search.startDate || '',
        endDate: search.endDate || '',
        sizeFilter: search.sizeFilter || 'all',
        statusFilter: search.statusFilter || 'all',
        tagFilter: search.tagFilter || [],
        tagFilterLogic: search.tagFilterLogic || 'AND',
        citationFilter: search.citationFilter || 'all',
        summaryFilter: search.summaryFilter || 'all',
        analysisFilter: search.analysisFilter || 'all',
        sortBy: search.sortBy || 'newest',
      }),
      addRecentSearch: (search) => set((state) => ({
        recentSearches: [
          search,
          ...state.recentSearches.filter(s => s.query !== search.query).slice(0, 9)
        ]
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'lexph-document-library-storage',
      partialize: (state) => ({ 
        savedSearches: state.savedSearches,
        recentSearches: state.recentSearches
      }),
    }
  )
);
