import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { StockReview } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export async function getStockReviews(): Promise<StockReview[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      return [];
    }

    // Get all valid data files and sort by modification time (newest first)
    const files = fs.readdirSync(DATA_DIR)
      .map(name => ({
        name,
        time: fs.statSync(path.join(DATA_DIR, name)).mtime.getTime(),
        ext: path.extname(name).toLowerCase()
      }))
      .filter(f => (f.ext === '.csv' || f.ext === '.xlsx' || f.ext === '.xls') && !f.name.includes('sample'))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.warn('No data files found in public/data');
      return [];
    }

    const newestFile = files[0];
    const filePath = path.join(DATA_DIR, newestFile.name);
    let rawData: any[] = [];

    console.log(`Loading newest data file: ${newestFile.name}`);

    if (newestFile.ext === '.xlsx' || newestFile.ext === '.xls') {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const result = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      rawData = result.data;
    }

    return rawData.map((row: any) => {
      try {
        return {
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
        };
      } catch (e) {
        return null;
      }
    }).filter((item): item is StockReview => item !== null && item.Symbol !== '');

  } catch (error) {
    console.error('Error loading stock reviews:', error);
    return [];
  }
}

export async function getStockBySymbol(symbol: string): Promise<StockReview | undefined> {
  const data = await getStockReviews();
  return data.find(d => d.Symbol.toLowerCase() === symbol.toLowerCase());
}
