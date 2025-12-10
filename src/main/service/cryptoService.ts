import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let CMC_API_KEY = String(process.env.MAIN_VITE_CMC_API_KEY || '').trim()

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export class CryptoService {
  private getHeaders() {
    const headers = {
      'X-CMC_PRO_API_KEY': CMC_API_KEY,
      'Accept': 'application/json'
    };

    // Additional check to ensure API key is in headers
    if (!headers['X-CMC_PRO_API_KEY']) {
      console.error('API Key is missing from headers');
      headers['X-CMC_PRO_API_KEY'] = CMC_API_KEY;
    }

    return headers;
  }

  async getLatestListings(limit: number = 100) {
    try {
      if (!CMC_API_KEY) {
        throw new Error('API Key is missing or empty. Cannot make request to CoinMarketCap API.');
      }

      const headers = this.getHeaders();

      console.log('Request Headers:', JSON.stringify(headers));
      console.log('X-CMC_PRO_API_KEY value:', headers['X-CMC_PRO_API_KEY']);

      const response = await axios.get(`${BASE_URL}/cryptocurrency/listings/latest`, {
        headers,
        params: {
          start: 1,
          limit,
          convert: 'USD'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur API CoinMarketCap:', error);
      if (axios.isAxiosError(error)) {
        console.error('Request details:', error.config);
        console.error('Response details:', error.response?.data);
      }
      throw error;
    }
  }

  async getCryptoQuote(symbols: string[]) {
    try {
      // Ensure API key is not empty before making the request
      if (!CMC_API_KEY) {
        throw new Error('API Key is missing or empty. Cannot make request to CoinMarketCap API.');
      }

      // Get headers using the common method
      const headers = this.getHeaders();

      // Log headers for debugging
      console.log('Request Headers for quotes:', JSON.stringify(headers));
      console.log('X-CMC_PRO_API_KEY value for quotes:', headers['X-CMC_PRO_API_KEY']);

      const response = await axios.get(`${BASE_URL}/cryptocurrency/quotes/latest`, {
        headers,
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération quote:', error);
      if (axios.isAxiosError(error)) {
        console.error('Request details:', error.config);
        console.error('Response details:', error.response?.data);
      }
      throw error;
    }
  }
}
