export interface PricePoint {
  time: number;
  close: number;
}

export interface TechnicalIndicators {
  currentPrice: number;
  prevPrice: number;
  ma20: number | null;
  ma50: number | null;
  ma200: number | null;
  rsi14: number | null;
  signals: TASignal[];
  aiInsight: string;
}

export interface TASignal {
  id: string;
  type: 'bullish' | 'bearish' | 'neutral';
  title: string;
  description: string;
}

// ---- Indicator Calculations ----

export function calculateSMA(data: PricePoint[], period: number): number | null {
  if (data.length < period) return null;
  const slice = data.slice(data.length - period);
  const sum = slice.reduce((acc, point) => acc + point.close, 0);
  return +(sum / period).toFixed(2);
}

export function calculateRSI(data: PricePoint[], period: number = 14): number | null {
  if (data.length <= period) return null;

  let gains = 0;
  let losses = 0;

  // Initial step: simple average of gains and losses over the first "period"
  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder's smoothing method for remaining data
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    let currentGain = 0;
    let currentLoss = 0;

    if (diff > 0) currentGain = diff;
    else currentLoss = Math.abs(diff);

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return +rsi.toFixed(2);
}

// ---- Signal Generation ----

export function generateSignals(
  price: number,
  prevPrice: number,
  ma20: number | null,
  ma50: number | null,
  ma200: number | null,
  rsi: number | null
): TASignal[] {
  const signals: TASignal[] = [];

  // Trend MAs
  if (ma20 && ma50) {
    if (ma20 > ma50 && prevPrice <= ma50) {
      signals.push({
        id: 'ma20_cross_50',
        type: 'bullish',
        title: 'Tính hiệu Mua Ngắn Hạn (Golden Cross cạn)',
        description: 'Đường MA20 cắt lên MA50 cho thấy lực kéo ngắn hạn đang quay trở lại mạnh mẽ.',
      });
    } else if (ma20 < ma50 && prevPrice >= ma50) {
       signals.push({
        id: 'ma20_cross_50_down',
        type: 'bearish',
        title: 'Cảnh báo Bán Ngắn Hạn (Death Cross nhẹ)',
        description: 'MA20 cắt xuống MA50. Xu hướng ngắn hạn bắt đầu suy yếu.',
      });
    }
  }

  // Golden / Death Cross MA50 & MA200
  if (ma50 && ma200 && ma20) {
    if (ma50 > ma200 && ma20 > ma200) {
      signals.push({
         id: 'uptrend',
         type: 'bullish',
         title: 'Uptrend Dài Hạn',
         description: 'Đường giá và các cấu trúc trung hạn đều nằm trên MA200 dài hạn. Cơ hội nắm giữ.',
      });
    }
  }

  if (ma50 && price > ma50 && prevPrice <= ma50) {
    signals.push({
      id: 'price_cross_ma50',
      type: 'bullish',
      title: 'Dòng tiền vào trung hạn',
      description: 'Giá phá vỡ thành công đường Trung bình 50 ngày (MA50).',
    });
  } else if (ma50 && price < ma50 && prevPrice >= ma50) {
      signals.push({
      id: 'price_cross_ma50_down',
      type: 'bearish',
      title: 'Gãy MA50 Trung hạn',
      description: 'Giá xuyên thủng đường MA50 báo hiệu lực bán tiềm ẩn rủi ro dài hơn.',
    });
  }

  // RSI
  if (rsi !== null) {
    if (rsi > 70) {
      signals.push({
        id: 'rsi_overbought',
        type: 'bearish',
        title: 'Quá mua (RSI > 70)',
        description: `RSI đạt ${rsi}. Áp lực chốt lời gia tăng, cẩn trọng khi thực hiện giải ngân mới.`,
      });
    } else if (rsi < 30) {
      signals.push({
        id: 'rsi_oversold',
        type: 'bullish',
        title: 'Quá bán (RSI < 30)',
        description: `RSI đạt ${rsi}. Cổ phiếu rơi vào vùng chiết khấu sâu, theo dõi tín hiệu đảo chiều.`,
      });
    }
  }

  return signals;
}

// ---- AI Storytelling Engine ----

export function generateDailyInsight(symbol: string, indicators: TechnicalIndicators): string {
  const { currentPrice, rsi14, ma50, ma200, signals } = indicators;
  
  let insight = `Đóng cửa phiên giao dịch, cơ cấu giá của **${symbol}** (${currentPrice.toLocaleString()} đ) `;
  
  if (ma200 && currentPrice > ma200) {
    insight += 'vẫn duy trì được vị thế **Uptrend dài hạn** vững chắc. ';
  } else if (ma200 && currentPrice < ma200) {
    insight += 'đang nằm trong chu kỳ **Downtrend kéo dài** (dưới MA200), ưu tiên quản trị rủi ro. ';
  } else {
    insight += 'đang trong giai đoạn lưỡng lự tích lũy. ';
  }

  if (ma50) {
    if (currentPrice > ma50) {
      insight += `Dòng tiền trung hạn ủng hộ khá rõ nét khi giá giao dịch cao hơn MA50 (${ma50}). `;
    } else {
      insight += `Phe gấu (Bears) đang tạm thời làm chủ xu hướng trung hạn do giá giảm qua MA50 (${ma50}). `;
    }
  }

  if (rsi14) {
    if (rsi14 >= 70) {
      insight += `Tuy nhiên, độ nén kỹ thuật đã quá căng (RSI = ${rsi14}). Rất dễ xảy ra các cú Shake-out phân phối đỉnh. Vui lòng cân nhắc hạ tỷ trọng Margin để hiện thực hoá lợi nhuận thay vì rượt đuổi lệnh mua mới.`;
    } else if (rsi14 <= 30) {
      insight += `Hiện tại cổ phiếu đã bị bán sâu quá đà (Oversold - RSI = ${rsi14}). Dấu hiệu giải chấp có thể đã qua, chờ đợi dòng tiền thông minh càn quét trở lại để mở mua thăm dò.`;
    } else if (rsi14 >= 50) {
      insight += `Động lượng sức mạnh giá (RSI = ${rsi14}) đang giữ nhịp dao động tích cực, phe mua có thể đẩy giá đi xa hơn.`;
    } else {
       insight += `Lực cầu đang hụt hơi đi kèm phe bán áp đảo (RSI = ${rsi14}). Cần một cú hích thanh khoản hoặc chất xúc tác nền tảng (Catalyst) để lấy lại đà tăng.`;
    }
  }

  const bullishCount = signals.filter(s => s.type === 'bullish').length;
  const bearishCount = signals.filter(s => s.type === 'bearish').length;

  if (bullishCount > bearishCount + 1) {
    insight += `\n\n**Hành động:** Hệ thống phát hiện ${bullishCount} tín hiệu Kỹ Thuật đà tăng, khuyến nghị có thể gia tăng tỷ trọng ở các nhịp Test cung rung lắc.`;
  } else if (bearishCount > bullishCount) {
    insight += `\n\n**Hành động:** Xuất hiện ${bearishCount} chỉ báo rủi ro bạo phát. Khuyến nghị thiết lập chốt chặn Stop-loss chặt chẽ để bảo toàn vốn.`;
  } else {
    insight += `\n\n**Hành động:** Chờ đợi sự xác nhận rõ ràng hơn từ xu hướng thị trường chung (VN-Index) trước khi ra quyết định lớn.`;
  }

  return insight;
}

export function processTradingData(symbol: string, rawData: any): TechnicalIndicators | null {
  if (rawData.s !== 'ok' || !rawData.t || rawData.t.length < 50) {
    return null; // Must have at least 50 days of data for MA50
  }

  const prices: PricePoint[] = rawData.t.map((timestamp: number, index: number) => ({
    time: timestamp,
    close: rawData.c[index]
  }));

  const currentPrice = prices[prices.length - 1].close;
  const prevPrice = prices[prices.length - 2].close;

  const ma20 = calculateSMA(prices, 20);
  const ma50 = calculateSMA(prices, 50);
  const ma200 = calculateSMA(prices, 200);
  const rsi14 = calculateRSI(prices, 14);

  const signals = generateSignals(currentPrice, prevPrice, ma20, ma50, ma200, rsi14);
  const insight = generateDailyInsight(symbol, { currentPrice, prevPrice, ma20, ma50, ma200, rsi14, signals, aiInsight: '' });

  return {
    currentPrice,
    prevPrice,
    ma20,
    ma50,
    ma200,
    rsi14,
    signals,
    aiInsight: insight
  };
}
