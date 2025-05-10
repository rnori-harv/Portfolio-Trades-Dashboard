import React, { useState } from 'react';

export function PerformanceChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const mockData = [
    { month: 'Jan', profit: 250 },
    { month: 'Feb', profit: -120 },
    { month: 'Mar', profit: 450 },
    { month: 'Apr', profit: 180 },
    { month: 'May', profit: -200 },
    { month: 'Jun', profit: 320 },
    { month: 'Jul', profit: 280 },
    { month: 'Aug', profit: -150 },
    { month: 'Sep', profit: -420 },
    { month: 'Oct', profit: 180 },
    { month: 'Nov', profit: 290 },
    { month: 'Dec', profit: 380 }
  ];

  // Calculate total profit/loss
  const totalPL = mockData.reduce((sum, item) => sum + item.profit, 0);
  
  // Find the maximum profit/loss to scale the bars
  const maxProfit = Math.max(...mockData.map(d => d.profit));
  const minProfit = Math.min(...mockData.map(d => d.profit));
  const maxValue = Math.max(Math.abs(maxProfit), Math.abs(minProfit));
  
  // Bar width calculation (slightly less than 100/12 to add spacing)
  const barWidth = 5.5;
  const barGap = 2.5;

  // Function to format numbers in compact form
  const formatCompactNumber = (num: number) => {
    const absNum = Math.abs(num);
    if (absNum >= 1000) {
      return (absNum / 1000).toFixed(1) + 'K';
    }
    return absNum.toString();
  };

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
            ${totalPL.toLocaleString()}
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
          <div>+${maxValue.toLocaleString()}</div>
          <div>+${(maxValue / 2).toLocaleString()}</div>
          <div>$0</div>
          <div>-${(maxValue / 2).toLocaleString()}</div>
          <div>-${maxValue.toLocaleString()}</div>
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
            
            {/* Bars */}
            {mockData.map((data, index) => {
              const x = index * (barWidth + barGap);
              const isPositive = data.profit >= 0;
              const barHeight = Math.abs(data.profit) / maxValue * 45;
              const y = isPositive ? 50 - barHeight : 50;
              
              return (
                <g 
                  key={index}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="1"
                    className={`${isPositive ? 'fill-blue-500' : 'fill-red-500'} opacity-80 hover:opacity-100 cursor-pointer`}
                  />
                  
                  {/* Tooltip */}
                  {hoveredBar === index && (
                    <g transform={`translate(${x + barWidth/2}, ${y - 2})`}>
                      <text
                        className="text-[2.5px] fill-slate-800 font-medium text-center"
                        textAnchor="middle"
                        transform="scale(0.5, 1)"
                      >
                        ${formatCompactNumber(data.profit)}
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
          {mockData.map((data, i) => {
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