import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSI Stock Research",
  description: "Comprehensive reviews and recommendations for major stocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white antialiased`}>
        <NextAuthProvider>
          <nav className="border-b border-slate-100 py-4 px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <a href="/" className="text-xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors">
                SSI RESEARCH
              </a>
              <AuthButton />
            </div>
          </nav>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
