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
  
  /* Tạm thời gỡ bỏ chuyển hướng tự động để bạn xem giao diện */
  /* useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/dang-nhap');
    }
  }, [status, router]); */

  const filteredReviews = initialReviews.filter(review => 
    review.Symbol.toLowerCase().includes(search.toLowerCase()) ||
    review.Industry.toLowerCase().includes(search.toLowerCase())
  );

  /* if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  } */

  return (
    <div className="space-y-12 pb-20">
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Tìm theo Mã CK hoặc Ngành (ví dụ: FPT, Thủy sản...)"
          className="block w-full pl-12 pr-4 py-5 border-2 border-slate-100 rounded-3xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            className="group relative bg-white rounded-2xl p-8 border-2 border-slate-50 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-300 group-hover:rotate-6 shadow-sm">
              <span className="text-slate-400 font-black text-3xl group-hover:text-white uppercase transition-colors">
                {item.Symbol[0]}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
              {item.Symbol}
            </h2>
            <p className="text-xs text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
              {item.Industry}
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-50 w-full flex justify-center items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {session ? 'Xem phân tích' : 'Đăng nhập để xem'} &rarr;
            </div>
          </Link>
        ))}
      </section>

      {filteredReviews.length === 0 && (
        <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-xl font-bold">Không tìm thấy mã "{search}"</p>
          <p className="text-sm mt-2">Hãy thử tìm kiếm theo ngành hoặc mã khác.</p>
        </div>
      )}
    </div>
  );
}
