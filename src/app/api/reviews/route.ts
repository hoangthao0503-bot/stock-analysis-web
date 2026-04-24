import { NextResponse } from 'next/server';
import { getStockReviews } from '@/lib/data-loader';

export async function GET() {
  const reviews = await getStockReviews();
  
  return NextResponse.json(reviews, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
