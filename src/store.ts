import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LegalDocument, SavedSearch } from './types';

interface DocumentLibraryState {
  documents: LegalDocument[];
  loading: boolean;
  searchQuery: string;
  filter: 'all' | 'case' | 'statute' | 'memo';
  startDate: string;
  endDate: string;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  tagFilter: string;
  citationFilter: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked';
  sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title';
  selectedIds: number[];
  savedSearches: SavedSearch[];

  // Actions
  setDocuments: (docs: LegalDocument[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'case' | 'statute' | 'memo') => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSizeFilter: (size: 'all' | 'small' | 'medium' | 'large') => void;
  setStatusFilter: (status: 'all' | 'completed' | 'processing' | 'failed') => void;
  setTagFilter: (tag: string) => void;
  setCitationFilter: (citation: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked') => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title') => void;
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  resetFilters: () => void;
  addSavedSearch: (search: SavedSearch) => void;
  removeSavedSearch: (id: string) => void;
  applySavedSearch: (search: SavedSearch) => void;
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
      tagFilter: 'all',
      citationFilter: 'all',
      sortBy: 'newest',
      selectedIds: [],
      savedSearches: [],

      setDocuments: (documents) => set({ documents }),
      setLoading: (loading) => set({ loading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilter: (filter) => set({ filter }),
      setStartDate: (startDate) => set({ startDate }),
      setEndDate: (endDate) => set({ endDate }),
      setSizeFilter: (sizeFilter) => set({ sizeFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setTagFilter: (tagFilter) => set({ tagFilter }),
      setCitationFilter: (citationFilter) => set({ citationFilter }),
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
        tagFilter: 'all',
        citationFilter: 'all',
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
        searchQuery: search.query,
        filter: search.filter,
        startDate: search.startDate,
        endDate: search.endDate,
        sizeFilter: search.sizeFilter,
        statusFilter: search.statusFilter,
        tagFilter: search.tagFilter,
        citationFilter: search.citationFilter,
        sortBy: search.sortBy,
      }),
    }),
    {
      name: 'lexph-document-library-storage',
      partialize: (state) => ({ savedSearches: state.savedSearches }),
    }
  )
);
