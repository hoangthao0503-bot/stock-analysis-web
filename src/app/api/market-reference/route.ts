import { NextResponse } from 'next/server';
import { fetchAndSaveMarketData, getMarketReferenceData } from '@/lib/market-scheduler';

// GET /api/market-reference → Returns cached market data from JSON file
export async function GET() {
  const data = getMarketReferenceData();

  if (!data) {
    return NextResponse.json(
      { error: 'Chưa có dữ liệu thị trường. Hệ thống đang cập nhật, vui lòng thử lại sau vài giây.' },
      { status: 503 }
    );
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

// POST /api/market-reference → Force refresh market data immediately
export async function POST() {
  try {
    const data = await fetchAndSaveMarketData();
    return NextResponse.json({
      message: 'Dữ liệu thị trường đã được cập nhật thành công.',
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật dữ liệu.', details: err.message },
      { status: 500 }
    );
  }
}
