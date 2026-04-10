'use client';

interface SentimentItem {
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  link: string;
}

export default function SentimentFeed({ sentimentData }: { sentimentData: SentimentItem[] | null }) {
  if (!sentimentData || sentimentData.length === 0) return (
    <div className="glass p-12 rounded-[2rem] text-center text-slate-500 italic">
      Đang phân tích tâm lý thị trường qua tin tức...
    </div>
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return { color: 'text-green-400', bg: 'bg-green-500/10', icon: '▲' };
      case 'negative': return { color: 'text-red-400', bg: 'bg-red-500/10', icon: '▼' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', icon: '—' };
    }
  };

  return (
    <div className="space-y-4">
      {sentimentData.map((item, index) => {
        const style = getSentimentIcon(item.sentiment);
        return (
          <a 
            key={index} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group glass p-6 rounded-[1.5rem] flex items-center gap-6 hover:bg-white/5 transition-all duration-300 border border-white/5 active:scale-[0.98]"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.color} font-black text-xl group-hover:scale-110 transition-transform`}>
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-bold text-lg mb-1 truncate leading-snug group-hover:text-blue-400 transition-colors">
                {item.title}
              </h5>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{item.source}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span>{item.date}</span>
              </div>
            </div>
            <div className="text-slate-700 group-hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        );
      })}
    </div>
  );
}
