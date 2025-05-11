import React, { useState } from 'react';
import { TrendingUpIcon, UserIcon, MenuIcon } from 'lucide-react';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Rakesh's Kalshi Trades</h1>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <a href="#overview" className="text-slate-600 hover:text-blue-600">
              Overview
            </a>
            <a href="#performance" className="text-slate-600 hover:text-blue-600">
              Performance
            </a>
            <a href="#positions" className="text-slate-600 hover:text-blue-600">
              Positions
            </a>
            <a href="https://rakeshnori.com/" className="text-slate-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
              About Me
            </a>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <MenuIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-200">
          <a href="#overview" className="block text-slate-600 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
            Overview
          </a>
          <a href="#performance" className="block text-slate-600 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
            Performance
          </a>
          <a href="#positions" className="block text-slate-600 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
            Positions
          </a>
          <a href="https://rakeshnori.com/" className="block text-slate-600 hover:text-blue-600 py-2" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
            About Me
          </a>
        </div>
      )}
    </header>;
}