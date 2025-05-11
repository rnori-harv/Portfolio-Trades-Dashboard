import React, { useState, useEffect } from 'react';
import { PerformanceChart } from './PerformanceChart';
import { PortfolioSummary } from './PortfolioSummary';
import { RecentTrades } from './RecentTrades';
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

export function Portfolio() {
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
      // Check if data for this time range is already memoized
      if (memoizedPortfolioData[selectedTimeRange]) {
        setPortfolioData(memoizedPortfolioData[selectedTimeRange]!);
        setIsLoading(false); // Already loaded
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('settled_positions')
          .select('realized_pnl, last_updated_ts'); // Ensure last_updated_ts is selected

        if (selectedTimeRange === 'lastWeek') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          query = query.gte('last_updated_ts', oneWeekAgo.toISOString());
        }

        // Fetch all settled positions
        const { data: positions, error: positionsError } = await query;

        if (positionsError) throw positionsError;

        if (positions && positions.length > 0) {

          let newPortfolioData: PortfolioData;
          if (positions && positions.length > 0) {
            // Calculate total profit (sum of all realized_pnl)
            const totalProfit = positions.reduce(
              (sum, position) => sum + position.realized_pnl,
              0
            );

            // Calculate win rate (percentage of positions with positive realized_pnl)
            const winningTrades = positions.filter(position => position.realized_pnl > 0).length;
            const winRate = Math.round((winningTrades / positions.length) * 100);

            // Count total trades
            const totalTrades = positions.length;

            newPortfolioData = {
              totalProfit: totalProfit / 100, // Convert cents to dollars if needed
              winRate,
              totalTrades,
            };
          } else {
            // If no positions match the filter (e.g., no trades last week)
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
        } else {
          // If no positions match the filter (e.g., no trades last week)
          setPortfolioData({
            totalProfit: 0,
            winRate: 0,
            totalTrades: 0,
          });
        }
      } catch (err: any) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message || 'Failed to fetch portfolio data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolioDataAndUpdateState(timeRange);
  }, [timeRange, memoizedPortfolioData]); // Re-fetch when timeRange changes or memoizedData is updated (though direct update is preferred)

  if (isLoading) {
    return <div className="p-4">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return <div className="space-y-20">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-8">Portfolio Overview</h2>
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
        <PortfolioSummary data={portfolioData} />
      </section>
      <section id="performance" className="scroll-mt-20">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <PerformanceChart />
        </div>
      </section>
      <section id="positions" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-8">Recent Positions</h2>
        <RecentTrades />
      </section>
    </div>;
}