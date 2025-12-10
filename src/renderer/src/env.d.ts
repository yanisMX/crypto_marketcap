export interface CryptoData {
  id: number
  name: string
  symbol: string
  quote: {
    USD: {
      price: number
      percent_change_24h: number
      market_cap: number
    }
  }
}

export interface ListingsResponse {
  data: CryptoData[]
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
  }
}

export interface QuotesResponse {
  data: {
    [symbol: string]: CryptoData
  }
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
  }
}

export interface ErrorResponse {
  error: string
  originalError?: string
}

declare global {
  interface Window {
    cryptoAPI: {
      getListings: (limit?: number) => Promise<ListingsResponse>
      getQuotes: (symbols: string[]) => Promise<QuotesResponse>
    }
  }
}
