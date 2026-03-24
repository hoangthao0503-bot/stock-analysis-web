import Link from 'next/link';
import { getStockBySymbol } from '@/lib/data-loader';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);
  const review = await getStockBySymbol(decodedSymbol);

  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 mb-10 transition-colors uppercase tracking-widest">
          &larr; Back to Dashboard
        </Link>
        
        <header className="mb-12 border-b border-slate-100 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded mb-4 inline-block uppercase tracking-wider">
                {review.Industry}
              </span>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">
                {review.Symbol}
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Updated</span>
              <span className="text-lg font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded">
                {review.LastUpdated}
              </span>
            </div>
          </div>
        </header>

        <article className="space-y-16">
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
              Executive Summary
            </h3>
            <div className="bg-slate-50 rounded-3xl p-8 text-slate-700 leading-relaxed text-lg border border-slate-100 italic">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {review.Summary}
              </ReactMarkdown>
            </div>
          </section>
          
          <section className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-700 prose-p:leading-loose prose-strong:text-slate-900 prose-li:text-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
              SSI Research Analysis & Recommendation
            </h3>
            <div className="bg-white rounded-3xl p-2 md:p-0">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {review.FullReview}
              </ReactMarkdown>
            </div>
          </section>
        </article>

        <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium italic">
            Source: SSI Research Database - For Internal Research Purposes Only
          </p>
        </footer>
      </div>
    </div>
  );
}
