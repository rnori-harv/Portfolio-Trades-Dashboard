    // src/components/PerformanceChart.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if necessary

interface SettledPosition {
  ticker: string;
  realized_pnl: number;
  last_updated_ts: string; // Assuming it's a string like 'YYYY-MM-DD HH:MM:SS.ssssss+ZZ'
  market_name: string;
}

interface MonthlyPL {
  month: string;
  profit: number;
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<MonthlyPL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    const fetchSettledPositions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('settled_positions')
          .select('realized_pnl, last_updated_ts');

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          // Process data to aggregate P/L by month
          const monthlyData: { [key: string]: number } = {}; // e.g., {"2024-01": 100, "2024-02": -50}
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          data.forEach((item: Pick<SettledPosition, 'realized_pnl' | 'last_updated_ts'>) => {
            const date = new Date(item.last_updated_ts);
            const year = date.getFullYear();
            const monthIndex = date.getMonth(); // 0-11
            const monthKey = `${year}-${monthNames[monthIndex]}`; // For unique month identification across years

            if (monthlyData[monthKey]) {
              monthlyData[monthKey] += item.realized_pnl / 100;
            } else {
              monthlyData[monthKey] = item.realized_pnl / 100;
            }
          });

          // Transform into the array format required by the chart
          // Assuming you want to display for a single year, or sort chronologically
          // For this example, let's extract month names and sort.
          // You might want a more robust sorting, especially if data spans multiple years.
          const processedData: MonthlyPL[] = Object.entries(monthlyData)
            .map(([monthYearKey, profit]) => {
                // Extract month name, assuming format "YYYY-Mon"
                const monthName = monthYearKey.split('-')[1];
                return { month: monthName, profit: profit };
            })
            .sort((a, b) => {
                // A simple sort by month name array order, good for a single year
                return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
            });
          
          // If you want to ensure all 12 months are present, even with 0 profit:
          const finalChartData = monthNames.map(monthName => {
            const existingMonthData = processedData.find(d => d.month === monthName);
            return existingMonthData || { month: monthName, profit: 0 };
          });


          setChartData(finalChartData);
        }
      } catch (err: any) {
        console.error("Error fetching or processing data:", err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettledPositions();
  }, []); // Empty dependency array means this runs once on mount
  

  // Calculate total profit/loss
  const totalPL = chartData.reduce((sum, item) => sum + item.profit, 0);

  // Format total P/L with negative sign before dollar sign
  const formattedTotalPL = totalPL >= 0 
    ? `$${totalPL.toLocaleString()}`
    : `-$${Math.abs(totalPL).toLocaleString()}`;

  // Find the maximum profit/loss to scale the bars
  const profits = chartData.map(d => d.profit);
  const maxProfit = profits.length > 0 ? Math.max(...profits) : 0;
  const minProfit = profits.length > 0 ? Math.min(...profits) : 0;
  const maxValue = Math.max(Math.abs(maxProfit), Math.abs(minProfit), 1); // Ensure maxValue is at least 1 to prevent division by zero if all profits are 0
  
  // Calculate the ceiling for Y-axis scale (in increments of 5)
  const yAxisMax = Math.ceil(maxValue / 5) * 5;
  
  // Calculate bar width and gap to fill the entire width
  const totalBars = chartData.length;
  const totalWidthPercentage = 100; // Full width of the SVG
  const gapRatio = 0.4; // Ratio of gap to bar width
  
  // Calculate the width each bar+gap unit should take
  const unitWidth = totalWidthPercentage / totalBars;
  const barWidth = unitWidth / (1 + gapRatio);
  const barGap = barWidth * gapRatio;

  // Function to format numbers in compact form with negative sign before dollar
  const formatCompactNumber = (num: number) => {
    const absNum = Math.abs(num);
    const isNegative = num < 0;
    const prefix = isNegative ? '-$' : '$';
    
    if (absNum >= 1000) {
      return `${prefix}${(absNum / 1000).toFixed(2)}K`;
    }
    return `${prefix}${absNum.toFixed(2)}`;
  };

  if (isLoading) {
    return <div className="w-full bg-white p-6 rounded-lg text-center">Loading P/L data...</div>;
  }

  if (error) {
    return <div className="w-full bg-white p-6 rounded-lg text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">Monthly P/L</h3>
          <p className="text-sm text-slate-500">
            Performance tracking for 2024
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {formattedTotalPL}
          </div>
          <div className="text-sm text-slate-500">Total P/L</div>
        </div>
      </div>
      
      <div className="relative w-full h-[400px]">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-slate-100 w-full" />
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-slate-400 py-6">
          <div>${yAxisMax}</div>
          <div>${yAxisMax / 2}</div>
          <div>$0</div>
          <div>-${yAxisMax / 2}</div>
          <div>-${yAxisMax}</div>
        </div>
        
        {/* Chart area */}
        <div className="absolute inset-0 pl-12">
          <svg 
            className="w-full h-full overflow-visible" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Zero line */}
            <line x1="0" y1="50" x2="100" y2="50" className="stroke-slate-200" strokeWidth="1" />
            
            {/* Bars and hover areas */}
            {chartData.map((data, index) => {
              const x = index * (barWidth + barGap);
              const isPositive = data.profit >= 0;
              const barHeight = Math.abs(data.profit) / yAxisMax * 45;
              const y = isPositive ? 50 - barHeight : 50;
              
              return (
                <g 
                  key={index}
                >
                  {/* Invisible hover area for entire column */}
                  <rect
                    x={x}
                    y={5} /* Start from top with some padding */
                    width={barWidth}
                    height={90} /* Cover almost the entire height */
                    fill="transparent"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer"
                  />
                  
                  {/* Actual visible bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="1"
                    className={`${isPositive ? 'fill-blue-500' : 'fill-red-500'} opacity-80 hover:opacity-100`}
                  />
                  
                  {/* Tooltip */}
                  {hoveredBar === index && (
                    <g transform={`translate(${x + barWidth/2}, ${isPositive ? y - 2 : y + barHeight + 4})`}>
                      <text
                        className="text-[2.5px] fill-slate-800 font-medium text-center"
                        textAnchor="middle"
                        transform="scale(0.4, 1)"
                      >
                        {formatCompactNumber(data.profit)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* X-axis month labels */}
        <div className="absolute bottom-0 left-12 right-0 flex text-xs text-slate-500 pb-1">
          {chartData.map((data, i) => {
            const position = i * (barWidth + barGap) + barWidth/2;
            return (
              <div key={i} className="absolute text-center" style={{left: `${position}%`, transform: 'translateX(-50%)'}}>
                {data.month}
              </div>
            );
          })}
        </div>
      </div>
    
    </div>
  );
}