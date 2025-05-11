import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon, LayersIcon } from 'lucide-react';

interface PortfolioSummaryProps {
  data: {
    totalProfit: number;
    winRate: number;
    totalTrades: number;
  }
}

export function PortfolioSummary({
  data
}: PortfolioSummaryProps) {
  // Determine color based on profit value
  const isProfitPositive = data.totalProfit >= 0;
  const profitIconColor = isProfitPositive ? 'text-green-500' : 'text-red-500';
  const profitBgColor = isProfitPositive ? 'bg-green-50' : 'bg-red-50';
  const profitTextColor = isProfitPositive ? 'text-green-700' : 'text-red-700';
  
  // Format profit with negative sign before dollar sign
  const formattedProfit = isProfitPositive 
    ? `$${data.totalProfit.toLocaleString()}`
    : `-$${Math.abs(data.totalProfit).toLocaleString()}`;

  const stats = [{
    title: 'Total Profit',
    value: formattedProfit,
    icon: isProfitPositive 
      ? <TrendingUpIcon className={`h-6 w-6 ${profitIconColor}`} />
      : <TrendingDownIcon className={`h-6 w-6 ${profitIconColor}`} />,
    bgColor: profitBgColor,
    textColor: profitTextColor
  }, {
    title: 'Win Rate',
    value: `${data.winRate}%`,
    icon: <ActivityIcon className="h-6 w-6 text-blue-500" />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  }, {
    title: 'Total Trades',
    value: data.totalTrades,
    icon: <LayersIcon className="h-6 w-6 text-purple-500" />,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => <div key={index} className={`${stat.bgColor} rounded-lg shadow p-4 flex items-center`}>
          <div className="p-3 rounded-full bg-white mr-4">{stat.icon}</div>
          <div>
            <p className="text-slate-600 text-sm">{stat.title}</p>
            <p className={`text-xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        </div>)}
    </div>;
}