import { PortfolioItem } from './types';

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, avgPrice: 150.00, currentPrice: 225.50, sector: 'Technology', assetClass: 'Stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 30, avgPrice: 280.00, currentPrice: 415.20, sector: 'Technology', assetClass: 'Stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 20, avgPrice: 200.00, currentPrice: 240.80, sector: 'Automotive', assetClass: 'Stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 45, avgPrice: 130.00, currentPrice: 185.60, sector: 'Consumer Cyclical', assetClass: 'Stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 15, avgPrice: 400.00, currentPrice: 1150.00, sector: 'Technology', assetClass: 'Stock' },
  { symbol: 'JPM', name: 'JPMorgan Chase', quantity: 60, avgPrice: 140.00, currentPrice: 195.40, sector: 'Financial', assetClass: 'Stock' },
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.45, avgPrice: 35000.00, currentPrice: 68500.00, sector: 'Crypto', assetClass: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', quantity: 5.0, avgPrice: 2200.00, currentPrice: 3800.00, sector: 'Crypto', assetClass: 'Crypto' },
  { symbol: 'USD', name: 'US Dollar Cash', quantity: 15000, avgPrice: 1.00, currentPrice: 1.00, sector: 'Cash', assetClass: 'Cash' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 25, avgPrice: 380.00, currentPrice: 490.50, sector: 'ETF', assetClass: 'ETF' },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
