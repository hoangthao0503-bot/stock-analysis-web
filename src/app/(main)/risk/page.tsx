import Link from 'next/link';

export default function RiskDashboard() {
  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute bottom-0 right-[10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black premium-text -ml-1 tracking-tighter uppercase leading-none">
              Systemic Risk
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Giám sát rủi ro vĩ mô, cảnh báo thanh khoản và rủi ro đuôi (Tail Risk) trên toàn bộ danh mục VN30.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-default">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Market Volatility (VIX)</h3>
               <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
             </div>
             <p className="text-5xl font-black text-white">18.4</p>
             <p className="text-amber-400 text-sm mt-2 font-bold">+2.1% (MoM)</p>
          </div>
          
          <div className="glass p-8 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-colors cursor-default">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Systemic Liquidity</h3>
               <span className="w-2 h-2 rounded-full bg-green-400"></span>
             </div>
             <p className="text-5xl font-black text-white">Safe</p>
             <p className="text-slate-500 text-sm mt-2 font-bold">Interbank rates stable</p>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-default">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tail Risk Alert</h3>
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
             </div>
             <p className="text-3xl font-black text-white">Real Estate</p>
             <p className="text-red-400 text-sm mt-2 font-bold">Elevated default probability</p>
          </div>
        </div>

        <section className="glass rounded-[3rem] p-10 border border-white/5">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
             <span className="w-1.5 h-8 bg-amber-600 rounded-full"></span>
             VaR (Value at Risk) Distribution
           </h3>
           <div className="h-[300px] w-full flex items-end justify-center gap-2 border-b border-white/10 pb-4">
              {/* Histogram Mockup */}
              {[4,8,15,30,50,80,100,70,40,20,10,5,2].map((h, i) => (
                <div key={i} className="w-8 bg-amber-500/80 hover:bg-amber-400 transition-colors rounded-t-md" style={{ height: `${h}%` }}></div>
              ))}
           </div>
           <div className="text-center mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
             Loss Probability Distribution across VN30 Setup
           </div>
        </section>
      </div>
    </div>
  );
}
