
async function testVPS() {
  const symbol = 'VNINDEX';
  const now = Math.floor(Date.now() / 1000);
  const from = now - 24 * 60 * 60; // 1 day lookback for hourly
  const url = `https://histdatafeed.vps.com.vn/tradingview/history?symbol=${symbol}&resolution=60&from=${from}&to=${now}`;
  
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testVPS();
