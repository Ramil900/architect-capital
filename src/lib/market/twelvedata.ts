const BASE_URL = "https://api.twelvedata.com";

function getApiKey(): string | undefined {
  return process.env.TWELVEDATA_API_KEY;
}

export async function fetchStockPrice(ticker: string): Promise<number | null> {
  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${BASE_URL}/price?symbol=${ticker}&apikey=${key}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const price = parseFloat(json?.price);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}
