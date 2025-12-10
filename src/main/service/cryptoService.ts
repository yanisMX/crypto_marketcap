import axios, { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

let CMC_API_KEY = String(process.env.MAIN_VITE_CMC_API_KEY || '').trim()

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1'
const FEAR_GREED_INDEX_URL = 'https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest'

// Define error class for API-related errors
export class CryptoServiceError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'CryptoServiceError'
  }
}

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

export class CryptoService {
  private getHeaders(): Record<string, string> {
    const headers = {
      'X-CMC_PRO_API_KEY': CMC_API_KEY,
      Accept: 'application/json'
    }

    if (!headers['X-CMC_PRO_API_KEY']) {
      console.error('API Key is missing from headers')
      headers['X-CMC_PRO_API_KEY'] = CMC_API_KEY
    }

    return headers
  }

  async getLatestListings(limit: number = 100): Promise<ListingsResponse> {
    try {
      if (!CMC_API_KEY) {
        throw new CryptoServiceError(
          'API Key is missing or empty. Cannot make request to CoinMarketCap API.'
        )
      }

      const headers = this.getHeaders()

      const response = await axios.get<ListingsResponse>(
        `${BASE_URL}/cryptocurrency/listings/latest`,
        {
          headers,
          params: {
            start: 1,
            limit,
            convert: 'USD'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur API CoinMarketCap:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        console.error('Request details:', axiosError.config)
        console.error('Response details:', axiosError.response?.data)

        throw new CryptoServiceError(`API request failed: ${axiosError.message}`, axiosError)
      }

      throw new CryptoServiceError(
        'Failed to fetch cryptocurrency listings',
        error instanceof Error ? error : undefined
      )
    }
  }

  async getFearAndGreedIndex(): Promise<FearAndGreedIndexResponse> {
    try {
      if (!CMC_API_KEY) {
        throw new CryptoServiceError(
          'API Key is missing or empty. Cannot make request to CoinMarketCap API.'
        )
      }
      const headers = this.getHeaders()

      const response = await axios.get<any>(FEAR_GREED_INDEX_URL, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Erreur récupération Fear and Greed Index:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        console.error('Request details:', axiosError.config)
        console.error('Response details:', axiosError.response?.data)

        throw new CryptoServiceError(
          `Fear and Greed Index request failed: ${axiosError.message}`,
          axiosError
        )
      }

      throw new CryptoServiceError(
        'Failed to fetch Fear and Greed Index',
        error instanceof Error ? error : undefined
      )
    }
  }

  async getCryptoQuote(symbols: string[]): Promise<QuotesResponse> {
    try {
      if (!symbols || symbols.length === 0) {
        throw new CryptoServiceError('No symbols provided for quote request')
      }

      if (!CMC_API_KEY) {
        throw new CryptoServiceError(
          'API Key is missing or empty. Cannot make request to CoinMarketCap API.'
        )
      }

      const headers = this.getHeaders()

      const response = await axios.get<QuotesResponse>(`${BASE_URL}/cryptocurrency/quotes/latest`, {
        headers,
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erreur récupération quote:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        console.error('Request details:', axiosError.config)
        console.error('Response details:', axiosError.response?.data)

        throw new CryptoServiceError(`Quote request failed: ${axiosError.message}`, axiosError)
      }

      throw new CryptoServiceError(
        'Failed to fetch cryptocurrency quotes',
        error instanceof Error ? error : undefined
      )
    }
  }
}
