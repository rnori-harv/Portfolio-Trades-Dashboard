import React, { useState } from 'react';
export function PerformanceChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const mockData = [{
    month: 'Jan',
    profit: 250
  }, {
    month: 'Feb',
    profit: -120
  }, {
    month: 'Mar',
    profit: 450
  }, {
    month: 'Apr',
    profit: 180
  }, {
    month: 'May',
    profit: -200
  }, {
    month: 'Jun',
    profit: 320
  }, {
    month: 'Jul',
    profit: 280
  }, {
    month: 'Aug',
    profit: -150
  }, {
    month: 'Sep',
    profit: 420
  }, {
    month: 'Oct',
    profit: 180
  }, {
    month: 'Nov',
    profit: 290
  }, {
    month: 'Dec',
    profit: 380
  }];
  const cumulativeData = mockData.reduce((acc, curr) => {
    const lastTotal = acc.length > 0 ? acc[acc.length - 1].totalProfit : 0;
    acc.push({
      ...curr,
      totalProfit: lastTotal + curr.profit
    });
    return acc;
  }, [] as Array<(typeof mockData)[0] & {
    totalProfit: number;
  }>);
  const maxProfit = Math.max(...cumulativeData.map(d => d.totalProfit));
  const minProfit = Math.min(...cumulativeData.map(d => d.totalProfit));
  const range = Math.max(Math.abs(maxProfit), Math.abs(minProfit));
  const points = cumulativeData.map((data, index) => {
    const x = index / (mockData.length - 1) * 100;
    const y = 50 - data.totalProfit / range * 45;
    return {
      x,
      y,
      ...data
    };
  });
  const linePath = `M ${points.map(point => `${point.x} ${point.y}`).join(' L ')}`;
  return <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">Monthly P/L</h3>
          <p className="text-sm text-slate-500">
            Performance tracking for 2024
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            ${points[points.length - 1].totalProfit.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500">Total P/L</div>
        </div>
      </div>
      <div className="relative w-full h-[400px]">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => <div key={i} className="border-t border-slate-100 w-full" />)}
        </div>
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-slate-400 py-6">
          <div>+${range.toLocaleString()}</div>
          <div>+${(range / 2).toLocaleString()}</div>
          <div>$0</div>
          <div>-${(range / 2).toLocaleString()}</div>
          <div>-${range.toLocaleString()}</div>
        </div>
        <div className="absolute inset-0 pl-12">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <line x1="0" y1="50%" x2="100%" y2="50%" className="stroke-slate-200" strokeWidth="1" />
            <path d={linePath} fill="none" className="stroke-blue-500" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {points.map((point, index) => <g key={index}>
                <circle cx={`${point.x}%`} cy={`${point.y}%`} r="12" className="fill-transparent cursor-pointer" onMouseEnter={() => setHoveredPoint(index)} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx={`${point.x}%`} cy={`${point.y}%`} r="3" className={`${hoveredPoint === index ? 'fill-blue-500 stroke-white stroke-2' : 'fill-white stroke-blue-500'}`} />
                {hoveredPoint === index && <g>
                    <rect x={`${point.x}%`} y={`${point.y}%`} transform={`translate(-50, -40)`} width="100" height="30" rx="4" className="fill-slate-800" />
                    <text x={`${point.x}%`} y={`${point.y}%`} transform={`translate(0, -20)`} className="text-xs fill-white text-center" textAnchor="middle">
                      ${point.totalProfit.toLocaleString()}
                    </text>
                  </g>}
                <text x={`${point.x}%`} y="100%" className="text-xs fill-slate-500" textAnchor="middle">
                  {point.month}
                </text>
              </g>)}
          </svg>
        </div>
      </div>
      <div className="mt-8 text-sm text-slate-500 text-center">
        Hover over points to see cumulative P/L values
      </div>
    </div>;
}