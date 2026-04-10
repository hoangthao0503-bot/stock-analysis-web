import AuthButton from "@/components/AuthButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="border-b border-slate-100 py-4 px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors">
            SSI RESEARCH
          </a>
          <div className="flex items-center gap-4">
            <a 
              href="https://iboard.ssi.com.vn/open-account/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 items-center justify-center"
            >
              Mở tài khoản
            </a>
            <AuthButton />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
