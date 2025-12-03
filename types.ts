export type Theme = 'light' | 'dark' | 'eye-care';
export type Language = 'en' | 'zh';

export interface PaperMetadata {
  title: string;
  authors: string[];
  year: string;
  institution: string;
  keywords: string[];
  summary: string;
  doi?: string;
  folder: string; // This is now assigned at save time
}

export interface AnalysisResult {
  markdown_report: string; // Full formatted markdown for reading
  metadata: PaperMetadata; // Structured data for DB
}

export interface StoredPaper extends PaperMetadata {
  id: string;
  addedAt: number;
  raw_analysis: string; // The full markdown content
}

export enum ViewState {
  LIBRARY = 'LIBRARY',
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW', // New state for viewing before saving
  READING = 'READING',
  ANALYZING = 'ANALYZING'
}
