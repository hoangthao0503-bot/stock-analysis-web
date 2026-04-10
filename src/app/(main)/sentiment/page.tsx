import Link from 'next/link';

export default function SentimentDashboard() {
  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-[20%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black premium-text -ml-1 tracking-tighter uppercase leading-none">
              Global Sentiment
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Bản đồ nhiệt cảm xúc thị trường và chỉ báo tâm lý thời gian thực từ dữ liệu NLP.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="glass rounded-[3rem] p-10 border border-white/5 flex flex-col items-center justify-center">
             <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-8">Fear & Greed Index</h3>
             <div className="relative w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center bg-slate-900 shadow-inner">
                {/* SVG Gauge Mock */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="rgb(34 197 94)" strokeWidth="16" fill="transparent" strokeDasharray="300 252" className="opacity-80"/>
                </svg>
                <div className="text-center z-10">
                  <span className="text-4xl font-black text-green-400">72</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Greed</p>
                </div>
             </div>
           </div>

           <div className="lg:col-span-2 glass rounded-[3rem] p-10 border border-white/5">
              <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-6">Market Heatmap (Top 30)</h3>
              <div className="flex flex-wrap gap-2">
                 {/* Heatmap blocks */}
                 <div className="w-24 h-24 bg-green-500/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">BID</div>
                 <div className="w-32 h-24 bg-green-400/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">TCB</div>
                 <div className="w-20 h-24 bg-red-500/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">VHM</div>
                 <div className="w-24 h-24 bg-amber-500/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">VPB</div>
                 <div className="w-40 h-24 bg-green-600/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">FPT</div>
                 <div className="w-24 h-24 bg-slate-600/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">VIC</div>
                 <div className="w-28 h-24 bg-red-400/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">MSN</div>
                 <div className="w-20 h-24 bg-green-400/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">MBB</div>
                 <div className="w-24 h-24 bg-amber-400/80 rounded-xl flex items-center justify-center font-black text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">HPG</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
