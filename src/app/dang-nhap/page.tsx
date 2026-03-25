'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await signIn('credentials', { 
        email: email, 
        password: 'password', 
        redirect: true, 
        callbackUrl: '/' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-800/40 rounded-full blur-[120px]"></div>
      
      <div className="bg-white/95 backdrop-blur-xl max-w-md w-full rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-12 border border-white/20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/20 transform -rotate-6 group transition-transform hover:rotate-0">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
             </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">SSI RESEARCH</h1>
          <div className="flex justify-center">
            <span className="h-1 w-12 bg-blue-600 rounded-full"></span>
          </div>
          <p className="mt-4 text-slate-500 font-bold text-sm uppercase tracking-widest">Internal Portal</p>
        </div>

        <div className="space-y-8">
          {/* Method 1: Easy Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Access</label>
              <input 
                type="email" 
                placeholder="hotro@gmail.com" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Đăng nhập ngay'
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoặc</div>
          </div>

          {/* Method 2: Google Login */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-5 rounded-2xl font-black text-xs text-slate-600 uppercase tracking-widest hover:border-blue-600 hover:bg-blue-50/30 transition-all active:scale-[0.97]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Tiếp tục với Google
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Hệ thống quản lý dữ liệu nội bộ<br/>
            Cập nhật tự động từ SSI Research Database
          </p>
        </div>
      </div>
    </div>
  );
}
