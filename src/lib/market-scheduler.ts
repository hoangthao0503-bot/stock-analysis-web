import fs from 'fs';
import path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MarketIndex {
  name: string;           // e.g. "VNINDEX", "HNX", "VN30"
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface StockSnapshot {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
}

export interface MarketReferenceData {
  lastUpdated: string;           // ISO timestamp
  lastUpdatedVN: string;         // Vietnam time string
  fetchStatus: 'success' | 'partial' | 'error';
  errors: string[];
  indices: MarketIndex[];
  vn30Stocks: StockSnapshot[];
  topGainers: StockSnapshot[];
  topLosers: StockSnapshot[];
  topVolume: StockSnapshot[];
  marketBreadth: MarketBreadth;
}

// ─── Configuration ───────────────────────────────────────────────────────────

const VN30_TICKERS = [
  'ACB','BCM','BID','BVH','CTG','FPT','GAS','GVR','HDB','HPG',
  'MBB','MSN','MWG','PLX','PNJ','POW','SAB','SHB','SSB','SSI',
  'STB','TCB','TPB','VCB','VHM','VIB','VIC','VJC','VNM','VPB'
];

const INDEX_SYMBOLS = ['VNINDEX', 'VN30', 'HNX'];

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'market_reference.json');

// VPS TradingView-compatible API (publicly accessible, no auth needed)
const VPS_HISTORY_BASE = 'https://histdatafeed.vps.com.vn/tradingview/history';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function vnNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
}

function isMarketHours(): boolean {
  const now = vnNow();
  const day = now.getDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h * 60 + m;
  // Market: 09:00 – 15:00 Vietnam time
  return t >= 8 * 60 + 45 && t <= 15 * 60 + 5;
}

function todayTimestamps(): { from: number; to: number } {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 7 * 24 * 60 * 60; // Look back 7 days to ensure we get data
  return { from, to: now };
}

async function safeFetch(url: string, label: string, errors: string[]): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      errors.push(`${label}: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    errors.push(`${label}: ${err.message || 'Unknown error'}`);
    return null;
  }
}

// ─── VPS TradingView API Data Fetcher ────────────────────────────────────────
// Response format: { symbol, s: "ok"|"no_data", t: [timestamps], c: [close], o: [open], h: [high], l: [low], v: [volume] }

interface VPSBarData {
  symbol: string;
  s: string;
  t: number[];
  c: number[];
  o: number[];
  h: number[];
  l: number[];
  v: number[];
}

function makeVPSUrl(symbol: string): string {
  const { from, to } = todayTimestamps();
  return `${VPS_HISTORY_BASE}?symbol=${symbol}&resolution=D&from=${from}&to=${to}`;
}

function parseLatestBar(data: VPSBarData): {
  price: number; open: number; high: number; low: number;
  volume: number; prevClose: number; change: number; changePercent: number;
} | null {
  if (data.s !== 'ok' || !data.t || data.t.length === 0) return null;

  const lastIdx = data.t.length - 1;
  const price = data.c[lastIdx];
  const open = data.o[lastIdx];
  const high = data.h[lastIdx];
  const low = data.l[lastIdx];
  const volume = data.v[lastIdx];

  // Previous close from second-to-last bar, or use open as fallback
  const prevClose = data.t.length >= 2 ? data.c[lastIdx - 1] : open;
  const change = +(price - prevClose).toFixed(2);
  const changePercent = prevClose !== 0 ? +((change / prevClose) * 100).toFixed(2) : 0;

  return { price, open, high, low, volume, prevClose, change, changePercent };
}

// ─── Fetch indices (VNINDEX, VN30, HNX) ─────────────────────────────────────

async function fetchIndices(errors: string[]): Promise<MarketIndex[]> {
  const indices: MarketIndex[] = [];

  // Fetch all indices in parallel
  const results = await Promise.all(
    INDEX_SYMBOLS.map(async (sym) => {
      const data = await safeFetch(makeVPSUrl(sym), `Index ${sym}`, errors) as VPSBarData | null;
      return { sym, data };
    })
  );

  for (const { sym, data } of results) {
    if (data) {
      const bar = parseLatestBar(data);
      if (bar) {
        indices.push({
          name: sym,
          price: bar.price,
          change: bar.change,
          changePercent: bar.changePercent,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          volume: bar.volume,
        });
        continue;
      }
    }
    // Fallback for failed fetches
    indices.push({
      name: sym, price: 0, change: 0, changePercent: 0,
      open: 0, high: 0, low: 0, volume: 0,
    });
  }

  return indices;
}

// ─── Fetch VN30 stocks ──────────────────────────────────────────────────────

async function fetchVN30Stocks(errors: string[]): Promise<StockSnapshot[]> {
  // Fetch all 30 stocks in parallel (use batches to avoid overwhelming the API)
  const batchSize = 10;
  const stocks: StockSnapshot[] = [];

  for (let i = 0; i < VN30_TICKERS.length; i += batchSize) {
    const batch = VN30_TICKERS.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (ticker) => {
        const data = await safeFetch(makeVPSUrl(ticker), `Stock ${ticker}`, errors) as VPSBarData | null;
        return { ticker, data };
      })
    );

    for (const { ticker, data } of results) {
      if (data) {
        const bar = parseLatestBar(data);
        if (bar) {
          stocks.push({
            ticker,
            price: bar.price,
            change: bar.change,
            changePercent: bar.changePercent,
            volume: bar.volume,
            high: bar.high,
            low: bar.low,
            open: bar.open,
            prevClose: bar.prevClose,
          });
          continue;
        }
      }
      // If fetch failed, push placeholder
      stocks.push({
        ticker, price: 0, change: 0, changePercent: 0,
        volume: 0, high: 0, low: 0, open: 0, prevClose: 0,
      });
    }

    // Small delay between batches to be polite
    if (i + batchSize < VN30_TICKERS.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return stocks;
}

// ─── Main fetch & save ──────────────────────────────────────────────────────

export async function fetchAndSaveMarketData(): Promise<MarketReferenceData> {
  const errors: string[] = [];
  const now = new Date();
  const vnTime = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  console.log(`[MarketScheduler] Fetching market data at ${vnTime}...`);

  // Fetch indices and VN30 stocks in parallel
  const [indices, vn30Stocks] = await Promise.all([
    fetchIndices(errors),
    fetchVN30Stocks(errors),
  ]);

  // Compute derived data from VN30 stocks
  const validStocks = vn30Stocks.filter(s => s.price > 0);

  // Top Gainers (sorted by changePercent desc)
  const topGainers = [...validStocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);

  // Top Losers (sorted by changePercent asc)
  const topLosers = [...validStocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 10);

  // Top Volume (sorted by volume desc)
  const topVolume = [...validStocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  // Market breadth
  const breadth: MarketBreadth = {
    advances: validStocks.filter(s => s.change > 0).length,
    declines: validStocks.filter(s => s.change < 0).length,
    unchanged: validStocks.filter(s => s.change === 0).length,
  };

  const hasData = validStocks.length > 0 || indices.some(i => i.price > 0);
  const result: MarketReferenceData = {
    lastUpdated: now.toISOString(),
    lastUpdatedVN: vnTime,
    fetchStatus: errors.length === 0 ? 'success' : (hasData ? 'partial' : 'error'),
    errors,
    indices,
    vn30Stocks,
    topGainers,
    topLosers,
    topVolume,
    marketBreadth: breadth,
  };

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');

  const successCount = validStocks.length;
  console.log(`[MarketScheduler] ✓ Saved market_reference.json (${successCount}/${VN30_TICKERS.length} stocks, ${errors.length} errors)`);

  return result;
}

// ─── Scheduler ──────────────────────────────────────────────────────────────

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const MARKET_HOURS_INTERVAL = 5 * 60 * 1000;   // 5 minutes
const OFF_HOURS_INTERVAL = 30 * 60 * 1000;      // 30 minutes

export function startMarketScheduler() {
  if (isRunning) {
    console.log('[MarketScheduler] Already running, skipping duplicate start.');
    return;
  }
  isRunning = true;

  console.log('[MarketScheduler] 🚀 Starting background market data scheduler...');
  console.log(`[MarketScheduler] 📊 Data source: VPS TradingView API (histdatafeed.vps.com.vn)`);
  console.log(`[MarketScheduler] ⏱  Market hours: every ${MARKET_HOURS_INTERVAL / 60000}min | Off-hours: every ${OFF_HOURS_INTERVAL / 60000}min`);

  // Fetch immediately on startup
  fetchAndSaveMarketData().catch(err => {
    console.error('[MarketScheduler] Initial fetch failed:', err);
  });

  // Schedule periodic updates with smart interval
  schedulerInterval = setInterval(async () => {
    try {
      await fetchAndSaveMarketData();
    } catch (err) {
      console.error('[MarketScheduler] Periodic fetch failed:', err);
    }
  }, isMarketHours() ? MARKET_HOURS_INTERVAL : OFF_HOURS_INTERVAL);

  console.log('[MarketScheduler] ✓ Scheduler active.');
}

export function stopMarketScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    isRunning = false;
    console.log('[MarketScheduler] ⏹ Scheduler stopped.');
  }
}

// ─── Read cached data ────────────────────────────────────────────────────────

export function getMarketReferenceData(): MarketReferenceData | null {
  try {
    if (!fs.existsSync(OUTPUT_FILE)) return null;
    const raw = fs.readFileSync(OUTPUT_FILE, 'utf8');
    return JSON.parse(raw) as MarketReferenceData;
  } catch {
    return null;
  }
}
