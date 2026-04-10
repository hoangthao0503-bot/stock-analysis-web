import Link from 'next/link';

export default function OptimizationDashboard() {
  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-[20%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black premium-text -ml-1 tracking-tighter uppercase leading-none">
              Market Optimization
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Phân tích đường cong hiệu quả (Efficient Frontier) và tối ưu hóa danh mục đa tài sản toàn thị trường.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass rounded-[3rem] p-10 border border-white/5 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
             {/* Mock Chart Area */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
             <p className="text-slate-500 font-bold uppercase tracking-widest z-10">Efficient Frontier Matrix</p>
             <div className="mt-8 w-full max-w-lg aspect-video border-b-2 border-l-2 border-slate-700 relative">
               <div className="absolute bottom-[20%] left-[30%] w-3 h-3 bg-red-400 rounded-full shadow-[0_0_15px_rgba(248,113,113,0.5)] cursor-pointer hover:scale-150 transition-transform group">
                 <span className="absolute -top-6 -left-2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">VHM</span>
               </div>
               <div className="absolute bottom-[60%] left-[50%] w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer hover:scale-150 transition-transform group">
                 <span className="absolute -top-6 -left-2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">TCB</span>
               </div>
               <div className="absolute bottom-[80%] left-[80%] w-4 h-4 bg-green-400 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.8)] cursor-pointer hover:scale-150 transition-transform group">
                 <span className="absolute -top-6 -left-2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">BID (Optimal)</span>
               </div>
               {/* Curve */}
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <path d="M 0 100 Q 150 40 300 10" fill="transparent" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeDasharray="5,5"/>
               </svg>
             </div>
             <div className="w-full flex justify-between mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest max-w-lg">
               <span>Low Risk</span>
               <span>High Volatility</span>
             </div>
          </div>

          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 border border-white/5 bg-blue-500/5">
              <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest mb-6 border-b border-blue-500/20 pb-4">Top Allocation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">BID</span>
                  <span className="text-blue-400 font-mono">15.5%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[15.5%]"></div></div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-white">TCB</span>
                  <span className="text-blue-400 font-mono">12.0%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[12.0%]"></div></div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-white">FPT</span>
                  <span className="text-blue-400 font-mono">10.5%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[10.5%]"></div></div>
              </div>
              <button className="mt-8 w-full py-3 glass rounded-xl text-xs font-bold text-blue-400 uppercase hover:bg-blue-500 hover:text-white transition-all">
                Export Weights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
