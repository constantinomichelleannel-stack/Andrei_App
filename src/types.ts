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
}

export interface LegalDocument {
  id: number;
  filename: string;
  title: string;
  type: 'case' | 'statute' | 'memo';
  citation?: string;
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

export type ViewType = 'dashboard' | 'research' | 'knowledge' | 'library' | 'analytics' | 'summarizer' | 'settings' | 'jurisprudence' | 'workflows' | 'statutes';

export interface CaseSummary {
  title: string;
  citation: string;
  facts: string;
  issues: string;
  ruling: string;
  analysis: string;
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

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filter: 'all' | 'case' | 'statute' | 'memo';
  startDate: string;
  endDate: string;
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  tagFilter: string;
  citationFilter: 'all' | 'valid' | 'caution' | 'invalid' | 'unchecked';
  summaryFilter: 'all' | 'has-summary' | 'no-summary';
  analysisFilter: 'all' | 'has-analysis' | 'no-analysis';
  sortBy: 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'title';
}
