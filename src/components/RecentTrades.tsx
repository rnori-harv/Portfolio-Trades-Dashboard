import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

// Type definition for settled positions from our database
interface SettledPosition {
  id: number;
  ticker: string;
  market_name: string;
  realized_pnl: number;
  last_updated_ts: string;
}

export function RecentTrades() {
  const [trades, setTrades] = useState<SettledPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const PAGE_SIZE = 5;

  // Fetch initial trades
  useEffect(() => {
    fetchTrades(0, PAGE_SIZE);
  }, []);

  // Function to fetch trades with pagination
  const fetchTrades = async (offset: number, limit: number, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('settled_positions')
        .select('*')
        .order('last_updated_ts', { ascending: false })
        .range(offset, offset + limit - 1);

      if (supabaseError) throw supabaseError;
      
      if (data) {
        // If we got fewer results than requested, there are no more to load
        if (data.length < limit) {
          setHasMore(false);
        }
        
        if (append) {
          setTrades(prevTrades => [...prevTrades, ...data]);
        } else {
          setTrades(data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching trades:', err);
      setError(err.message || 'Failed to fetch trades');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (expanded) {
      // Collapse - just show the first PAGE_SIZE trades again
      setExpanded(false);
      // We don't need to fetch again, just slice the current trades
      // setTrades(trades.slice(0, PAGE_SIZE));
    } else {
      // Expand - load more trades
      setExpanded(true);
      fetchTrades(trades.length, PAGE_SIZE, true);
    }
  };

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow p-4 text-center">Loading recent trades...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-lg shadow p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (trades.length === 0) {
    return <div className="bg-white rounded-lg shadow p-4 text-center">No recent trades found.</div>;
  }

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Display only the first PAGE_SIZE trades when collapsed
  const displayTrades = expanded ? trades : trades.slice(0, PAGE_SIZE);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-slate-100">
        {displayTrades.map((trade, index) => (
          <div key={index} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 truncate" title={trade.market_name}>
                  {trade.market_name}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {formatDate(trade.last_updated_ts)}
                </p>
              </div>
              <div className={`flex items-center ${trade.realized_pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-semibold mr-1">
                  {trade.realized_pnl > 0 ? 'Win' : 'Loss'}
                </span>
                <span className="font-semibold">
                  ${Math.abs(trade.realized_pnl / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More / Collapse Button */}
      <button 
        onClick={handleLoadMore}
        className="w-full py-3 px-4 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
        disabled={isLoadingMore || (!hasMore && !expanded)}
      >
        {isLoadingMore ? (
          <span>Loading...</span>
        ) : expanded ? (
          <>
            <ChevronUpIcon className="h-4 w-4 mr-2" />
            <span>Show Less</span>
          </>
        ) : (
          <>
            <ChevronDownIcon className="h-4 w-4 mr-2" />
            <span>{hasMore ? 'Show More' : 'No more trades'}</span>
          </>
        )}
      </button>
    </div>
  );
}