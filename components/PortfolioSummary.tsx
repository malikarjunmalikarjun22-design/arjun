import React from 'react';
import { MOCK_PORTFOLIO } from '../constants';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react';

const PortfolioSummary: React.FC = () => {
  const totalValue = MOCK_PORTFOLIO.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);
  const totalCost = MOCK_PORTFOLIO.reduce((sum, item) => sum + (item.quantity * item.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const percentGain = (totalGain / totalCost) * 100;

  return (
    <div className="h-full overflow-y-auto p-6 bg-white border-l border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <PieIcon className="w-5 h-5 text-emerald-600" />
        Your Portfolio
      </h2>

      {/* Main Stats Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-lg mb-8">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Net Worth</div>
        <div className="text-3xl font-bold mb-4">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
           <div>
              <div className="text-slate-400 text-xs mb-1">Total Gain</div>
              <div className={`flex items-center font-semibold ${totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
           </div>
           <div className="text-right">
              <div className="text-slate-400 text-xs mb-1">Return</div>
              <div className={`flex items-center font-semibold justify-end ${percentGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                 {percentGain >= 0 ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                 {percentGain.toFixed(2)}%
              </div>
           </div>
        </div>
      </div>

      {/* Holdings List */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Top Holdings</h3>
      <div className="space-y-4">
        {MOCK_PORTFOLIO.sort((a,b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice)).map((item) => {
          const value = item.quantity * item.currentPrice;
          const gain = (item.currentPrice - item.avgPrice) / item.avgPrice * 100;
          return (
            <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold 
                  ${item.assetClass === 'Crypto' ? 'bg-orange-100 text-orange-600' : 
                    item.assetClass === 'Cash' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.symbol[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{item.symbol}</div>
                  <div className="text-xs text-gray-500">{item.quantity.toLocaleString()} shares</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm text-gray-900">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className={`text-xs font-medium ${gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {gain >= 0 ? '+' : ''}{gain.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioSummary;
