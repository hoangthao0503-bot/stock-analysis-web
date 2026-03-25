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
          <AuthButton />
        </div>
      </nav>
      {children}
    </>
  );
}
