import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [totalTrades, setTotalTrades] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const PAGE_SIZE = 5;

  // Calculate total pages based on total trades count
  const totalPages = useMemo(() => Math.ceil(totalTrades / PAGE_SIZE), [totalTrades, PAGE_SIZE]);

  // Memoized function to count total trades
  const countTotalTrades = useCallback(async () => {
    try {
      const { count, error: countError } = await supabase
        .from('settled_positions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      if (count !== null) {
        setTotalTrades(count);
      }
    } catch (err: any) {
      console.error('Error counting trades:', err);
      setError(err.message || 'Failed to count trades');
    }
  }, []);

  // Memoized function to fetch trades for a specific page
  const fetchTrades = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const offset = (page - 1) * PAGE_SIZE;
      
      const { data, error: supabaseError } = await supabase
        .from('settled_positions')
        .select('*')
        .order('last_updated_ts', { ascending: false })
        .order('ticker', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (supabaseError) throw supabaseError;
      
      if (data) {
        setTrades(data);
      }
    } catch (err: any) {
      console.error('Error fetching trades:', err);
      setError(err.message || 'Failed to fetch trades');
    } finally {
      setIsLoading(false);
    }
  }, [PAGE_SIZE]);

  // Initial load: count total trades and fetch first page
  useEffect(() => {
    // Initialize by counting all trades first
    countTotalTrades();
    // Then fetch the first page
    fetchTrades(1);
  }, [countTotalTrades, fetchTrades]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchTrades(page);
  };

  // Generate array of page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPageButtons = 3; // Always show exactly 3 page buttons
    
    // Calculate start page based on current page
    let startPage = currentPage - 1;
    
    // Handle edge cases
    if (startPage < 1) {
      startPage = 1;
    } else if (startPage + maxPageButtons - 1 > totalPages) {
      startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }
    
    // Generate page numbers
    for (let i = 0; i < maxPageButtons; i++) {
      const pageNum = startPage + i;
      if (pageNum <= totalPages) {
        pages.push(pageNum);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (isLoading && totalTrades === 0) {
    return <div className="bg-white rounded-lg shadow p-4 text-center">Loading recent trades...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-lg shadow p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (totalTrades === 0) {
    return <div className="bg-white rounded-lg shadow p-4 text-center">No recent trades found.</div>;
  }

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-slate-100">
        {/* Map through trades and fill with empty rows if needed */}
        {[...Array(PAGE_SIZE)].map((_, index) => {
          const trade = trades[index];
          
          // If we have a trade for this row, render it
          if (trade) {
            return (
              <div key={index} className="p-4 hover:bg-slate-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate text-sm sm:text-base" title={trade.market_name}>
                      {trade.market_name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(trade.last_updated_ts)}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 flex flex-col items-end sm:flex-row sm:items-center ${trade.realized_pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="font-semibold mr-0 sm:mr-1 text-xs sm:text-sm">
                      {trade.realized_pnl > 0 ? 'Win' : 'Loss'}
                    </span>
                    <span className="font-semibold text-sm sm:text-base">
                      {trade.realized_pnl > 0 
                        ? `$${Math.abs(trade.realized_pnl / 100).toFixed(2)}`
                        : `-$${Math.abs(trade.realized_pnl / 100).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          
          // Empty placeholder row
          return (
            <div key={`empty-${index}`} className="p-4 h-[72px] flex items-center justify-center">
              <div className="text-slate-300 text-sm">No data</div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center p-3 bg-slate-50 border-t border-slate-200">
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center h-8 w-8 rounded ${
                currentPage === 1 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            {pageNumbers.map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`flex items-center justify-center h-8 w-8 rounded ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center h-8 w-8 rounded ${
                currentPage === totalPages 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}