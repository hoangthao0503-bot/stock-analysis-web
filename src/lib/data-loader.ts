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
