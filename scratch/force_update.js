
const { fetchAndSaveMarketData } = require('./src/lib/market-scheduler');

async function forceUpdate() {
  console.log('Starting force update...');
  try {
    const result = await fetchAndSaveMarketData();
    console.log('Update complete!');
    console.log('Last updated (VN):', result.lastUpdatedVN);
    console.log('Indices count:', result.indices.length);
  } catch (err) {
    console.error('Update failed:', err);
  }
}

forceUpdate();
