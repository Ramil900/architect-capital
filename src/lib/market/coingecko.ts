const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchCryptoPrice(coinId: string): Promise<number | null> {
  try {
    const key = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = key ? { "x-cg-demo-api-key": key } : {};

    const res = await fetch(
      `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const price = json?.[coinId]?.usd as number | undefined;
    return price ?? null;
  } catch {
    return null;
  }
}
