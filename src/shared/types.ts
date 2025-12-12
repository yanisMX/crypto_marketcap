// Crypto API Types
export type Crypto = CryptoData;

export interface CryptoData {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  num_market_pairs: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  last_updated: string
  date_added: string
  tags: string[]
  platform: any
  quote: {
    [currency: string]: Quote
  }
}

export interface FearGreedIndex {
  value: number
  classification: string
  timestamp: string
}

export interface Quote {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  last_updated: string
}

export interface FiatCurrency {
  id: number
  name: string
  sign: string
  symbol: string
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

export interface FearAndGreedIndexResponse {
  data: {
    value: number
    value_classification: string
    update_time: string
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

// Theme Types
export type Theme = "dark" | "light" | "system"

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Crypto API Type
export type CryptoAPI = {
  getListings: (limit?: number) => Promise<ListingsResponse>
  getQuotes: (symbols: string[]) => Promise<QuotesResponse>
  getFearGreedIndex: () => Promise<FearAndGreedIndexResponse>
}

// Window API Extension
declare global {
  interface Window {
    cryptoAPI: CryptoAPI
  }
}
