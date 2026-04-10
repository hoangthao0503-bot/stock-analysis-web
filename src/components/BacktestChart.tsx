'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Area, 
  AreaChart 
} from 'recharts';

interface ChartData {
  date: string;
  stock: number;
  vnindex: number;
}

export default function BacktestChart({ data }: { data: ChartData[] | null }) {
  if (!data || data.length === 0) return (
    <div className="glass h-[400px] rounded-[3rem] flex items-center justify-center text-slate-500 italic">
      Đang mô phỏng dữ liệu Backtesting (6 tháng)...
    </div>
  );

  return (
    <div className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
      <h4 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
        <span className="w-1.5 h-8 premium-gradient rounded-full"></span>
        Hiệu quả đầu tư (6 Tháng) vs VN-Index
      </h4>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVNI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(str) => str.split('-').slice(1).join('/')}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.25rem',
                backdropFilter: 'blur(10px)',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area 
              type="monotone" 
              dataKey="stock" 
              name="Chiến lược Mô hình" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorStock)" 
              dot={false}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#0f172a' }}
            />
            <Area 
              type="monotone" 
              dataKey="vnindex" 
              name="VN-Index (Thị trường)" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorVNI)" 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 flex justify-center gap-12 border-t border-white/5 pt-8">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ suất sinh lời</p>
          <p className="text-2xl font-black text-blue-400">
            {data[data.length-1].stock > 0 ? '+' : ''}{data[data.length-1].stock}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alpha (vs VNI)</p>
          <p className="text-2xl font-black text-cyan-400">
            {(data[data.length-1].stock - data[data.length-1].vnindex).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
