import { StockReview } from '@/types';
import Link from 'next/link';

interface Props {
  industry: string;
  peers: StockReview[];
}

export default function PeerComparison({ industry, peers }: Props) {
  if (!peers || peers.length === 0) return null;

  return (
    <section className="glass p-8 rounded-[3rem] border border-white/5 bg-slate-900/40">
      <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">
        So sánh Ngành
      </h4>
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
        {industry} Focus
      </p>
      
      <div className="space-y-3">
        {peers.slice(0, 5).map((peer) => (
          <Link 
            key={peer.Symbol} 
            href={`/stocks/${peer.Symbol}`}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group"
          >
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 {peer.Symbol}
               </div>
               <div>
                  <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{peer.Symbol}</p>
                  <p className="text-[10px] text-slate-500 uppercase">View Analysis &rarr;</p>
               </div>
             </div>
             
             {/* A pseudo correlation bar for visual storytelling */}
             <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500/50 group-hover:bg-blue-400 transition-all rounded-full" 
                  style={{ width: `${Math.random() * 40 + 30}%` }}
                ></div>
             </div>
          </Link>
        ))}
      </div>
      
      {peers.length > 5 && (
         <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">+ {peers.length - 5} MÃ KHÁC CÙNG NGÀNH</p>
         </div>
      )}
    </section>
  );
}
