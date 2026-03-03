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
}

export type ViewType = 'dashboard' | 'research' | 'knowledge' | 'library' | 'analytics' | 'settings';
