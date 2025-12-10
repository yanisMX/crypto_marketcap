import { contextBridge, ipcRenderer } from 'electron'
import { CryptoData, ListingsResponse, QuotesResponse, FearAndGreedIndexResponse, ErrorResponse, CryptoAPI } from '../shared/types'

// Type guard to check if a response is an error
function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response
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
  },
  getFearGreedIndex: async () => {
    const response = await ipcRenderer.invoke('crypto:getFearGreedIndex')
    if (isErrorResponse(response)) {
      throw new Error(`Failed to get Fear and Greed Index: ${response.error}`)
    }
    return response as FearAndGreedIndexResponse
  }
}

contextBridge.exposeInMainWorld('cryptoAPI', cryptoAPI)
