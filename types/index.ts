export interface ExtractOptions {
  useReadability: boolean;
}

export interface ExtractedContent {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  siteName: string;
  publishedTime: string | null;
  readabilityHtml: string;
  url: string;
}

export interface ExtractResponse {
  success: boolean;
  data?: ExtractedContent;
  error?: string;
}

export interface ConversionResult {
  markdown: string;
  originalTitle: string;
  siteName: string;
  wordCount: number;
}
