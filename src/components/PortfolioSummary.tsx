import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon, LayersIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PortfolioData {
  totalProfit: number;
  winRate: number;
  totalTrades: number;
}

type TimeRange = 'allTime' | 'lastWeek';

interface MemoizedData {
  allTime: PortfolioData | null;
  lastWeek: PortfolioData | null;
}

export function PortfolioSummary() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('allTime');
  const [memoizedPortfolioData, setMemoizedPortfolioData] = useState<MemoizedData>({
    allTime: null,
    lastWeek: null,
  });

  useEffect(() => {
    async function fetchPortfolioDataAndUpdateState(selectedTimeRange: TimeRange) {
      if (memoizedPortfolioData[selectedTimeRange]) {
        setPortfolioData(memoizedPortfolioData[selectedTimeRange]!);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('settled_positions')
          .select('realized_pnl, last_updated_ts');

        if (selectedTimeRange === 'lastWeek') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          query = query.gte('last_updated_ts', oneWeekAgo.toISOString());
        }

        const { data: positions, error: positionsError } = await query;

        if (positionsError) throw positionsError;

        let newPortfolioData: PortfolioData;
        if (positions && positions.length > 0) {
          const totalProfit = positions.reduce(
            (sum, position) => sum + position.realized_pnl,
            0
          );
          const winningTrades = positions.filter(position => position.realized_pnl > 0).length;
          const winRate = Math.round((winningTrades / positions.length) * 100);
          const totalTrades = positions.length;

          newPortfolioData = {
            totalProfit: totalProfit / 100,
            winRate,
            totalTrades,
          };
        } else {
          newPortfolioData = {
            totalProfit: 0,
            winRate: 0,
            totalTrades: 0,
          };
        }
        setPortfolioData(newPortfolioData);
        setMemoizedPortfolioData(prevMemoizedData => ({
          ...prevMemoizedData,
          [selectedTimeRange]: newPortfolioData,
        }));
      } catch (err: any) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message || 'Failed to fetch portfolio data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolioDataAndUpdateState(timeRange);
  }, [timeRange, memoizedPortfolioData]);

  if (isLoading) {
    return <div className="p-4">Loading summary data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const isProfitPositive = portfolioData.totalProfit >= 0;
  const profitIconColor = isProfitPositive ? 'text-green-500' : 'text-red-500';
  const profitBgColor = isProfitPositive ? 'bg-green-50' : 'bg-red-50';
  const profitTextColor = isProfitPositive ? 'text-green-700' : 'text-red-700';
  
  const formattedProfit = isProfitPositive 
    ? `$${portfolioData.totalProfit.toLocaleString()}`
    : `-$${Math.abs(portfolioData.totalProfit).toLocaleString()}`;

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
    value: `${portfolioData.winRate}%`,
    icon: <ActivityIcon className="h-6 w-6 text-blue-500" />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  }, {
    title: 'Total Trades',
    value: portfolioData.totalTrades,
    icon: <LayersIcon className="h-6 w-6 text-purple-500" />,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }];
  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setTimeRange('allTime')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            timeRange === 'allTime'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setTimeRange('lastWeek')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            timeRange === 'lastWeek'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Last Week
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => <div key={index} className={`${stat.bgColor} rounded-lg shadow p-4 flex items-center`}>
            <div className="p-3 rounded-full bg-white mr-4">{stat.icon}</div>
            <div>
              <p className="text-slate-600 text-sm">{stat.title}</p>
              <p className={`text-xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>)}
      </div>
    </div>
  );
}