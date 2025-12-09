import axios from 'axios';

const CMC_API_KEY = process.env.MAIN_VITE_CMC_API_KEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export class CryptoService {
  async getLatestListings(limit: number = 100) {
    try {
      const response = await axios.get(`${BASE_URL}/cryptocurrency/listings/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        },
        params: {
          start: 1,
          limit,
          convert: 'USD'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur API CoinMarketCap:', error);
      throw error;
    }
  }

  async getCryptoQuote(symbols: string[]) {
    try {
      const response = await axios.get(`${BASE_URL}/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        },
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération quote:', error);
      throw error;
    }
  }
}
