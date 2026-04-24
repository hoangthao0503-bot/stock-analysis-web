
import fs from 'fs';
import path from 'path';

// Redefine enough of the scheduler logic to fetch and save data without triggering the whole app
const INDEX_SYMBOLS = ['VNINDEX', 'VN30', 'HNX'];
const VPS_HISTORY_BASE = 'https://histdatafeed.vps.com.vn/tradingview/history';
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'market_reference.json');

function todayTimestamps() {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 7 * 24 * 60 * 60;
  return { from, to: now };
}

async function safeFetch(url, label) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`${label} failed:`, err);
    return null;
  }
}

function parseLatestBar(data) {
  if (data.s !== 'ok' || !data.t || data.t.length === 0) return null;
  const lastIdx = data.t.length - 1;
  const price = data.c[lastIdx];
  const open = data.o[lastIdx];
  const high = data.h[lastIdx];
  const low = data.l[lastIdx];
  const volume = data.v[lastIdx];
  const prevClose = data.t.length >= 2 ? data.c[lastIdx - 1] : open;
  const change = +(price - prevClose).toFixed(2);
  const changePercent = prevClose !== 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
  return { price, open, high, low, volume, prevClose, change, changePercent };
}

async function update() {
  console.log('Fetching fresh market data...');
  const indices = [];
  for (const sym of INDEX_SYMBOLS) {
    const { from, to } = todayTimestamps();
    const url = `${VPS_HISTORY_BASE}?symbol=${sym}&resolution=D&from=${from}&to=${to}`;
    const data = await safeFetch(url, sym);
    if (data) {
      const bar = parseLatestBar(data);
      if (bar) {
        indices.push({
          name: sym,
          ...bar
        });
        continue;
      }
    }
    indices.push({ name: sym, price: 0, change: 0, changePercent: 0, open: 0, high: 0, low: 0, volume: 0 });
  }

  const now = new Date();
  const vnTime = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  
  // Read existing data to preserve other fields like vn30Stocks
  let existingData = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  }

  const result = {
    ...existingData,
    lastUpdated: now.toISOString(),
    lastUpdatedVN: vnTime,
    indices,
    fetchStatus: 'success'
  };

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  console.log('Market data updated successfully in market_reference.json');
}

update();
