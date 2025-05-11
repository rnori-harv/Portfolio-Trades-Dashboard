import React from 'react';
import { TrendingUpIcon, UserIcon, MenuIcon } from 'lucide-react';
export function Header() {
  return <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Rakesh's Movie Predictions</h1>
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
          
          <button className="md:hidden p-2 rounded-full hover:bg-slate-100">
            <MenuIcon className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>;
}