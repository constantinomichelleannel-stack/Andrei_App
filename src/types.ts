export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export interface LegalDocument {
  id: number;
  filename: string;
  title: string;
  type: 'case' | 'statute' | 'memo';
  summary: string;
  uploaded_at: string;
  tags?: string[];
}

export type ViewType = 'dashboard' | 'research' | 'knowledge' | 'library' | 'analytics' | 'summarizer' | 'settings' | 'jurisprudence' | 'workflows';

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
}
