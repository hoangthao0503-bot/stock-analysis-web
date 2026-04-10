import { getStockReviews } from '@/lib/data-loader';
import SearchDashboard from '@/components/SearchDashboard';
import Link from 'next/link';

export default async function Home() {
  const reviews = await getStockReviews();

  return (
    <main className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      {/* Decorative Blur and Radiance */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 premium-text">
            SSI Risk & Portfolio Optimizer
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Hệ thống quản trị rủi ro và tối ưu hóa danh mục đầu tư dựa trên dữ liệu thời gian thực và phân tích cảm xúc (NLP).
          </p>
          <div className="flex justify-center flex-wrap gap-4 pt-8">
            <Link href="/optimization" className="px-5 py-2.5 glass rounded-full text-xs font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
              Market Wide Optimization
            </Link>
            <Link href="/sentiment" className="px-5 py-2.5 glass rounded-full text-xs font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
              Sentiment Analysis
            </Link>
            <Link href="/risk" className="px-5 py-2.5 glass rounded-full text-xs font-black text-amber-400 uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1">
              Risk Management
            </Link>
          </div>
        </header>

        <SearchDashboard initialReviews={reviews} />

        {reviews.length === 0 && (
          <div className="text-center py-32 glass rounded-[3rem] border border-white/5">
            <p className="text-2xl font-bold premium-text opacity-50">Hệ thống đang chuẩn bị dữ liệu...</p>
          </div>
        )}
      </div>
    </main>
  );
}
