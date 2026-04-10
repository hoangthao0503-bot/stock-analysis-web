'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StockReview } from '@/types';
import { useSession, signIn } from 'next-auth/react';

interface SearchDashboardProps {
  initialReviews: StockReview[];
}

export default function SearchDashboard({ initialReviews }: SearchDashboardProps) {
  const [search, setSearch] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const filteredReviews = initialReviews.filter(review => 
    review.Symbol.toLowerCase().includes(search.toLowerCase()) ||
    review.Industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-32">
      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Tìm theo Mã CK hoặc Ngành (ví dụ: FPT, Thủy sản...)"
          className="block w-full pl-16 pr-6 py-6 glass rounded-3xl leading-5 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99] transition-all text-xl shadow-2xl border-white/5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredReviews.map((item) => (
          <Link 
            key={item.Symbol} 
            href={session ? `/stocks/${item.Symbol}` : '#'}
            onClick={(e) => {
              if (!session) {
                e.preventDefault();
                signIn();
              }
            }}
            className="group relative glass rounded-[2.5rem] p-10 border border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Animated Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-500"></div>

            <div className="w-20 h-20 bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner border border-white/5 relative z-10">
              <span className="text-slate-500 font-black text-4xl group-hover:text-white uppercase transition-colors">
                {item.Symbol[0]}
              </span>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tighter relative z-10">
              {item.Symbol}
            </h2>
            
            <p className="text-xs text-blue-400 font-bold bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20 relative z-10">
              {item.Industry}
            </p>
            
            <div className="mt-10 pt-8 border-t border-white/5 w-full flex justify-center items-center gap-3 text-blue-400 text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 relative z-10">
              {session ? 'Analyze Risk' : 'Login to View'} 
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </Link>
        ))}
      </section>

      {filteredReviews.length === 0 && (
        <div className="text-center py-32 glass rounded-[3rem] border border-white/5">
          <p className="text-2xl font-bold text-slate-500">Không tìm thấy mã "{search}"</p>
          <p className="text-slate-600 mt-3">Hệ thống đang mở rộng cơ sở dữ liệu thị trường.</p>
        </div>
      )}
    </div>
  );
}
