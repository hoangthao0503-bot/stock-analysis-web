import { getStockReviews } from '@/lib/data-loader';
import SearchDashboard from '@/components/SearchDashboard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Home() {
  const reviews = await getStockReviews();

  return (
    <main className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            SSI Stock Research
          </h1>
          <p className="text-slate-500 text-lg">Select a stock to view detailed analysis and recommendations</p>
        </header>

        <SearchDashboard initialReviews={reviews} />

        {reviews.length === 0 && (
          <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-xl font-medium">No research data found.</p>
            <p className="mt-2">Please ensure "Database SSI.csv" is in <code className="bg-slate-200 px-2 py-0.5 rounded text-slate-700">public/data/</code></p>
          </div>
        )}
      </div>
    </main>
  );
}
