import React from 'react';
import { PerformanceChart } from './PerformanceChart';
import { PortfolioSummary } from './PortfolioSummary';
import { RecentTrades } from './RecentTrades';
export function Portfolio() {
  const mockData = {
    totalProfit: 1284.75,
    winRate: 68,
    totalTrades: 47,
    activePositions: 12
  };
  return <div className="space-y-20">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-8">Portfolio Overview</h2>
        <PortfolioSummary data={mockData} />
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