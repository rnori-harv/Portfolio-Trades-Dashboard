import React from 'react';
import { Header } from './components/Header';
import { Portfolio } from './components/Portfolio';
export function App() {
  return <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Portfolio />
      </main>
    </div>;
}