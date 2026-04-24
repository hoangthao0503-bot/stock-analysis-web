'use client';

import { useState, useEffect } from 'react';
import { MarketReferenceData, MarketIndex, StockSnapshot } from '@/lib/market-scheduler';
import Link from 'next/link';

interface MarketOverviewProps {
  data: MarketReferenceData | null;
}

export default function MarketOverview({ data: initialData }: MarketOverviewProps) {
  const [data, setData] = useState<MarketReferenceData | null>(initialData);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/market-reference');
        if (res.ok) {
          const freshData = await res.json();
          if (freshData && freshData.indices) {
            setData(freshData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    const intervalId = setInterval(fetchMarketData, 30000); // 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (!data || !data.indices || data.indices.length === 0) return null;


  const vnindex = data.indices.find(i => i.name === 'VNINDEX');
  const hnx = data.indices.find(i => i.name === 'HNX');
  const vn30 = data.indices.find(i => i.name === 'VN30');

  const renderIndex = (index?: MarketIndex) => {
    if (!index) return null;
    const isUp = index.change >= 0;
    const colorClass = isUp ? 'text-green-500' : 'text-red-500';
    const bgClass = isUp ? 'bg-green-500/10' : 'bg-red-500/10';
    const borderClass = isUp ? 'border-green-500/20' : 'border-red-500/20';

    return (
      <div className={`glass p-6 rounded-3xl border ${borderClass} flex flex-col`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-black text-white">{index.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold ${bgClass} ${colorClass}`}>
            {isUp ? '+' : ''}{index.change} ({isUp ? '+' : ''}{index.changePercent}%)
          </span>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <p className="text-4xl font-mono font-bold text-white tracking-tighter">
            {index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Vol / Value</p>
            <p className="text-xs font-mono font-bold text-slate-400">
              {index.volume >= 1000000 
                ? (index.volume / 1000000).toFixed(1) + 'M' 
                : index.volume.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderStockList = (title: string, stocks: StockSnapshot[], colorClass: string, bgClass: string) => {
    if (!stocks || stocks.length === 0) return null;
    
    return (
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col h-full">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          {title}
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded">VN30</span>
        </h4>
        <div className="space-y-3 flex-1">
          {stocks.slice(0, 5).map(stock => {
            const isUp = stock.change >= 0;
            return (
              <Link href={`/stocks/${stock.ticker}`} key={stock.ticker} className={`flex items-center justify-between p-3 rounded-xl border border-transparent hover:${bgClass} hover:${colorClass.replace('text-', 'border-')} transition-all group`}>
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center font-bold text-xs ${colorClass}`}>
                    {stock.ticker}
                  </span>
                  <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                    {stock.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${colorClass}`}>
                    {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-20 space-y-8">
      {/* Overview Header with Breadth & Updated Time */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-md rounded-full px-8 py-4 border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Market Live</span>
          </div>
          <p className="text-xs font-mono text-slate-400">{data.lastUpdatedVN.split(' ')[0]}</p>
        </div>
        
        {data.marketBreadth && (
          <div className="flex items-center gap-4 mt-4 sm:mt-0 text-xs font-bold">
            <span className="text-slate-500 uppercase tracking-widest border-r border-slate-700 pr-4">Market Breadth (VN30)</span>
            <span className="text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {data.marketBreadth.advances}</span>
            <span className="text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> {data.marketBreadth.unchanged}</span>
            <span className="text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {data.marketBreadth.declines}</span>
          </div>
        )}
      </div>

      {/* Main Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderIndex(vnindex)}
        {renderIndex(vn30)}
        {renderIndex(hnx)}
      </div>

      {/* Top Movers (VN30) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderStockList("Top Gainers", data.topGainers, "text-green-500", "bg-green-500/10")}
        {renderStockList("Top Losers", data.topLosers, "text-red-500", "bg-red-500/10")}
        {renderStockList("Top Volume", data.topVolume, "text-blue-400", "bg-blue-500/10")}
      </div>
    </section>
  );
}
