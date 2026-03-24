'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-slate-900 leading-none mb-1">
            {session.user?.name || session.user?.email?.split('@')[0]}
          </p>
          <button 
            onClick={() => signOut()}
            className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
          >
            Đăng xuất
          </button>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 ring-2 ring-white">
          {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
    >
      Đăng nhập
    </Link>
  );
}
