import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { StockReview } from '@/types';

// Use a dynamic path for public/data that works in both dev and production
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export async function getStockReviews(): Promise<StockReview[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      return [];
    }

    const files = fs.readdirSync(DATA_DIR)
      .map(name => ({
        name,
        time: fs.statSync(path.join(DATA_DIR, name)).mtime.getTime(),
        ext: path.extname(name).toLowerCase()
      }))
      .filter(f => (f.ext === '.csv' || f.ext === '.xlsx' || f.ext === '.xls') && !f.name.includes('sample'))
      .sort((a, b) => {
        // Prioritise database.csv (Luahoa data) first, then by newest mtime
        if (a.name === 'database.csv') return -1;
        if (b.name === 'database.csv') return 1;
        return b.time - a.time;
      });

    if (files.length === 0) {
      return [];
    }

    const newestFile = files[0];
    const filePath = path.join(DATA_DIR, newestFile.name);
    let rawData: any[] = [];

    if (newestFile.ext === '.xlsx' || newestFile.ext === '.xls') {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      // Read with UTF-8 BOM stripping for Vietnamese CSV files (Luahoa.streamlit format)
      const fileContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
      const result = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      rawData = result.data;
    }

    return rawData.map((row: any) => ({
      Symbol: (row['Mã CK'] || row['Symbol'] || '').toString().trim(),
      Industry: (row['Ngành'] || row['Industry'] || '').toString().trim(),
      Summary: (row['Tóm tắt'] || '').toString(),
      FullReview: (
        row['----------------------------------------------------Review về KQKD / Khuyến nghị từ SSI Research----------------------------------------------------'] || 
        row['--------------------------------------------Review về KQKD / Khuyến nghị từ SSI Research--------------------------------------------'] ||
        row['Review'] || 
        ''
      ).toString(),
      LastUpdated: (row['Cập nhật mới nhất'] || row['Updated'] || '').toString(),
    })).filter(item => item.Symbol !== '' && item.Symbol.length <= 10);

  } catch (error) {
    console.error('Error loading stock reviews:', error);
    return [];
  }
}

export async function getStockBySymbol(symbol: string): Promise<StockReview | undefined> {
  const data = await getStockReviews();
  return data.find(d => d.Symbol.toLowerCase() === symbol.toLowerCase());
}

export async function getPeersByIndustry(industry: string, currentSymbol: string): Promise<StockReview[]> {
  const data = await getStockReviews();
  return data.filter(d => 
    d.Industry.toLowerCase() === industry.toLowerCase() && 
    d.Symbol.toLowerCase() !== currentSymbol.toLowerCase()
  );
}

export async function getRiskMetrics(symbol: string) {
  try {
    const filePath = path.join(DATA_DIR, 'risk', `${symbol.toUpperCase()}_risk.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export async function getSentimentData(symbol: string) {
  try {
    const filePath = path.join(DATA_DIR, 'sentiment', `${symbol.toUpperCase()}_sentiment.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export async function getBacktestData(symbol: string) {
  try {
    const filePath = path.join(DATA_DIR, 'backtest', `${symbol.toUpperCase()}_backtest.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export async function getMarketReference() {
  try {
    const filePath = path.join(DATA_DIR, 'market_reference.json');
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// ---- Phân tích Kỹ thuật & Data Storytelling (VPS API) ----
import { processTradingData, TechnicalIndicators } from '@/lib/technical-analysis';

export async function getTechnicalAnalysis(symbol: string): Promise<TechnicalIndicators | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 365 * 24 * 60 * 60; // 1 year of data

    const url = `https://histdatafeed.vps.com.vn/tradingview/history?symbol=${symbol}&resolution=D&from=${from}&to=${now}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    
    if (!res.ok) return null;
    const data = await res.json();
    return processTradingData(symbol, data);
  } catch (error) {
    console.error('Failed to get technical analysis:', error);
    return null;
  }
}
