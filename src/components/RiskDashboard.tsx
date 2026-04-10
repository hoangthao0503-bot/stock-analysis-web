'use client';

interface RiskMetrics {
  beta: number;
  volatility: number;
  sharpe_ratio: number;
  var_95: number;
  avg_return: number;
}

export default function RiskDashboard({ metrics }: { metrics: RiskMetrics | null }) {
  if (!metrics) return (
    <div className="glass p-10 rounded-[2rem] text-center text-slate-500 italic">
      Đang tính toán các thông số rủi ro...
    </div>
  );

  const getRiskLevel = (beta: number) => {
    if (beta > 1.2) return { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (beta < 0.8) return { label: 'Defensive', color: 'text-green-400', bg: 'bg-green-500/10' };
    return { label: 'Market Average', color: 'text-blue-400', bg: 'bg-blue-500/10' };
  };

  const risk = getRiskLevel(metrics.beta);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Market Beta</p>
        <h4 className="text-4xl font-black text-white mb-2">{metrics.beta.toFixed(2)}</h4>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${risk.bg} ${risk.color}`}>
          {risk.label}
        </span>
      </div>

      <div className="glass p-8 rounded-[2rem] border border-white/5 group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Annual Volatility</p>
        <h4 className="text-4xl font-black text-white mb-2">{(metrics.volatility * 100).toFixed(1)}%</h4>
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-cyan-500 transition-all duration-1000" 
            style={{ width: `${Math.min(metrics.volatility * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem] border border-white/5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sharpe Ratio</p>
        <h4 className="text-4xl font-black text-blue-400 mb-2">{metrics.sharpe_ratio.toFixed(2)}</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">Risk-Adjusted Return</p>
      </div>

      <div className="glass p-8 rounded-[2rem] border border-white/5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Value at Risk (95%)</p>
        <h4 className="text-4xl font-black text-red-400 mb-2">{(metrics.var_95 * 100).toFixed(1)}%</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">Expected Max Daily Loss</p>
      </div>
    </div>
  );
}
