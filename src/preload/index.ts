import { contextBridge, ipcRenderer } from 'electron'

// Define the structure of cryptocurrency data
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

// Define API response types
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

// Define error response type
export interface ErrorResponse {
  error: string
  originalError?: string
}

// Type guard to check if a response is an error
function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response
}

export type CryptoAPI = {
  getListings: (limit?: number) => Promise<ListingsResponse>
  getQuotes: (symbols: string[]) => Promise<QuotesResponse>
}

const cryptoAPI: CryptoAPI = {
  getListings: async (limit?: number) => {
    const response = await ipcRenderer.invoke('crypto:getListings', limit)
    if (isErrorResponse(response)) {
      throw new Error(`Failed to get listings: ${response.error}`)
    }
    return response as ListingsResponse
  },
  getQuotes: async (symbols: string[]) => {
    const response = await ipcRenderer.invoke('crypto:getQuotes', symbols)
    if (isErrorResponse(response)) {
      throw new Error(`Failed to get quotes: ${response.error}`)
    }
    return response as QuotesResponse
  }
}

contextBridge.exposeInMainWorld('cryptoAPI', cryptoAPI)
