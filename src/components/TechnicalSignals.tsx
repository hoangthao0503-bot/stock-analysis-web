import { TechnicalIndicators } from '@/lib/technical-analysis';
import ReactMarkdown from 'react-markdown';

interface Props {
  data: TechnicalIndicators | null;
}

export default function TechnicalSignals({ data }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Cards */}
        {[
          { label: 'MA20', val: data.ma20, desc: 'Xu hướng ngắn hạn' },
          { label: 'MA50', val: data.ma50, desc: 'Sức mạnh dòng tiền' },
          { label: 'MA200', val: data.ma200, desc: 'Uptrend/Downtrend' },
          { label: 'RSI (14)', val: data.rsi14, desc: 'Đà hưng phấn' },
        ].map((m) => (
          <div key={m.label} className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center group hover:border-blue-500/30 transition-colors">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-3xl font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
              {m.val || 'N/A'}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signal List */}
        <div className="glass p-8 rounded-[3rem] border border-white/5">
          <h4 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
             Tín hiệu Cảnh báo Trực tiếp
          </h4>
          <div className="space-y-4">
            {data.signals.length === 0 ? (
              <p className="text-slate-500 text-sm">Chưa có tín hiệu kỹ thuật đột biến lúc này.</p>
            ) : (
              data.signals.map(sig => (
                <div key={sig.id} className={`p-5 rounded-2xl border ${
                  sig.type === 'bullish' ? 'bg-green-500/10 border-green-500/20' 
                  : sig.type === 'bearish' ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-slate-500/10 border-slate-500/20'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      sig.type === 'bullish' ? 'text-green-400' 
                      : sig.type === 'bearish' ? 'text-red-400' 
                      : 'text-slate-400'
                    }`}>
                      {sig.type === 'bullish' ? 'BUY SIGNAL' : sig.type === 'bearish' ? 'SELL ALERT' : 'WATCH'}
                    </span>
                    <span className="text-white font-bold">{sig.title}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{sig.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Insight Storytelling */}
        <div className="glass p-8 rounded-[3rem] border border-purple-500/20 bg-purple-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] group-hover:scale-150 transition-transform"></div>
           <h4 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-3">
             ✨ AI Daily Insights
           </h4>
           <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-purple-300">
             <ReactMarkdown>{data.aiInsight}</ReactMarkdown>
           </div>
        </div>
      </div>
    </div>
  );
}
