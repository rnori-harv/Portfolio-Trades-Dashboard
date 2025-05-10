import React from 'react';
// import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

// Type definition for trades - all trades are now closed
interface Trade {
  id: number;
  market: string;
  position: 'YES' | 'NO';
  amount: number;
  date: string;
  status: 'closed';
  profit: number;
}

export function RecentTrades() {
  const mockTrades: Trade[] = [{
    id: 1,
    market: 'Will BTC exceed $60K in Q3?',
    position: 'YES',
    amount: 150,
    date: '2024-03-01',
    status: 'closed',
    profit: 120
  }, {
    id: 2,
    market: 'Will Fed raise rates in July?',
    position: 'NO',
    amount: 200,
    date: '2024-02-28',
    status: 'closed',
    profit: -50
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
              </div>
              <div className={`flex items-center ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="font-semibold mr-1">
                    {trade.profit > 0 ? 'Win' : 'Loss'}
                  </span>
                  <span className="font-semibold">
                    ${Math.abs(trade.profit)}
                  </span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}