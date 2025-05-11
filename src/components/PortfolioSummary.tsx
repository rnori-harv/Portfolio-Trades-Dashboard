import React from 'react';
import { TrendingUpIcon, ActivityIcon, LayersIcon } from 'lucide-react';

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
  const stats = [{
    title: 'Total Profit',
    value: `$${data.totalProfit.toLocaleString()}`,
    icon: <TrendingUpIcon className="h-6 w-6 text-green-500" />,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
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