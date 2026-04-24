// Next.js Instrumentation Hook
// This file is automatically executed by Next.js when the server starts.
// It initializes background tasks like the market data scheduler.
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // Only run the scheduler on the server side (Node.js runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startMarketScheduler } = await import('@/lib/market-scheduler');
    startMarketScheduler();
  }
}
