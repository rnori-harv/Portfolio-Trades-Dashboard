import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
export function RecentTrades() {
  const mockTrades = [{
    id: 1,
    market: 'Will BTC exceed $60K in Q3?',
    position: 'YES',
    amount: 150,
    date: '2024-03-01',
    status: 'open'
  }, {
    id: 2,
    market: 'Will Fed raise rates in July?',
    position: 'NO',
    amount: 200,
    date: '2024-02-28',
    status: 'open'
  }, {
    id: 3,
    market: 'Will SpaceX launch Starship in 2023?',
    position: 'YES',
    amount: 100,
    date: '2024-02-15',
    status: 'closed',
    profit: -100
  }, {
    id: 4,
    market: 'Will Apple release AR glasses?',
    position: 'NO',
    amount: 75,
    date: '2024-02-10',
    status: 'closed',
    profit: 68
  }, {
    id: 5,
    market: 'Will US inflation exceed 3% in Q4?',
    position: 'YES',
    amount: 120,
    date: '2024-02-01',
    status: 'closed',
    profit: 110
  }];
  return <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-slate-100">
        {mockTrades.map(trade => <div key={trade.id} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 truncate" title={trade.market}>
                  {trade.market}
                </h4>
                <div className="flex items-center mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${trade.position === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trade.position}
                  </span>
                  <span className="text-sm text-slate-500 ml-2">
                    ${trade.amount}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${trade.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                    {trade.status}
                  </span>
                </div>
              </div>
              {trade.status === 'closed' && <div className={`flex items-center ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.profit > 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                  <span className="font-semibold">
                    ${Math.abs(trade.profit)}
                  </span>
                </div>}
            </div>
          </div>)}
      </div>
    </div>;
}