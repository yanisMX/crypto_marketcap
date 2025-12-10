// Crypto API Types
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
