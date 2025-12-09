export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      market_cap: number;
    }
  }
}

declare global {
  interface Window {
    cryptoAPI: {
      getListings: (limit?: number) => Promise<{ data: CryptoData[] }>;
      getQuotes: (symbols: string[]) => Promise<any>;
    }
  }
}
