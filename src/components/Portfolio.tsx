import React, { useState, useEffect } from 'react';
import { PerformanceChart } from './PerformanceChart';
import { PortfolioSummary } from './PortfolioSummary';
import { RecentTrades } from './RecentTrades';
import { supabase } from '../lib/supabaseClient';

interface PortfolioData {
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

export function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all settled positions
        const { data: positions, error: positionsError } = await supabase
          .from('settled_positions')
          .select('realized_pnl');

        if (positionsError) throw positionsError;

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

          setPortfolioData({
            totalProfit: totalProfit / 100, // Convert cents to dollars if needed
            winRate,
            totalTrades,
            activePositions: 0 // You may want to fetch this from another table
          });
        }
      } catch (err: any) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message || 'Failed to fetch portfolio data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return <div className="space-y-20">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-8">Portfolio Overview</h2>
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