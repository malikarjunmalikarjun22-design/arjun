export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  assetClass: 'Stock' | 'Crypto' | 'Cash' | 'ETF';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartConfig {
  type: 'chart';
  chartType: 'pie' | 'bar' | 'line' | 'area';
  title: string;
  data: ChartDataPoint[];
  xAxisKey?: string;
  dataKey?: string; // For simple charts
  colors?: string[];
  yAxisLabel?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: ChartConfig;
  timestamp: Date;
  isStreaming?: boolean;
}