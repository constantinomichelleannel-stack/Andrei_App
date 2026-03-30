export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags?: string;
  source_doc_id?: number;
  created_at: string;
}

export interface DocumentVersion {
  id: number;
  document_id: number;
  filename: string;
  version: number;
  size: number;
  uploaded_at: string;
  summary: string;
  citation_check?: {
    status: 'valid' | 'caution' | 'invalid' | 'unchecked';
    analysis: string;
  };
  legal_summary?: CaseSummary;
  citation_analysis?: string;
}

export interface LegalDocument {
  id: number;
  filename: string;
  title: string;
  type: 'case' | 'statute' | 'memo';
  citation?: string;
  author?: string;
  date_published?: string;
  keywords?: string[];
  summary: string;
  size?: number;
  status?: 'processing' | 'completed' | 'failed';
  uploaded_at: string;
  tags?: string[];
  citation_check?: {
    status: 'valid' | 'caution' | 'invalid' | 'unchecked';
    analysis: string;
  };
  legal_summary?: CaseSummary;
  citation_analysis?: string;
  version?: number;
  versions?: DocumentVersion[];
  uid?: string;
  is_public?: boolean;
}

export interface JurisprudenceResult {
  overview: string;
  cases: {
    title: string;
    citation: string;
    date: string;
    summary: string;
    ruling: string;
  }[];
}

export type ViewType = 'dashboard' | 'research' | 'knowledge' | 'library' | 'analytics' | 'summarizer' | 'settings' | 'jurisprudence' | 'workflows' | 'statutes' | 'admin';

export interface User {
  uid: string;
  email: string;
  display_name: string;
  role: 'user' | 'admin';
  last_login: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface CaseSummary {
  type: 'CASE' | 'STATUTE' | 'ADMINISTRATIVE' | 'OTHER';
  title: string;
  citation: string;
  facts: string;
  issues: string;
  ruling: string;
  analysis: string;
  key_doctrines?: string[];
}

export interface LegalPrediction {
  probability: number;
  strengths: string[];
  risks: string[];
  strategy: string;
  analysis: string;
  legalIssues: string[];
  likelyOutcome: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  filters: Partial<SavedSearch>;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filter: 'all' | 'case' | 'statute' | 'memo';
  startDate: string;
  endDate: string;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  tagFilter: string[];
  tagFilterLogic?: 'AND' | 'OR';
  citationFilter: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked';
  summaryFilter: 'all' | 'has-summary' | 'no-summary';
  analysisFilter: 'all' | 'has-analysis' | 'no-analysis';
  sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title' | 'citation-status';
  createdAt?: string;
}
