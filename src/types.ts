export type Market = 'PT-BR' | 'ES-MX' | 'ES-ES' | 'KO-KR' | 'EN-US';

export interface SEOInput {
  market: Market;
  h1: string;
  title: string;
  meta: string;
  keywords: string;
  html: string;
  date: string;
  url: string;
  notes: string;
}

export interface SEOOutput {
  type: 'intro' | 'h2' | 'table' | 'schema' | 'ctr';
  content: string;
  explanation?: string;
}
