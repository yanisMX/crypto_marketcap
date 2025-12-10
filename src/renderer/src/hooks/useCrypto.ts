import { useQuery } from '@tanstack/react-query'
import type { CryptoData, ListingsResponse } from '../../../shared/types'
import { API_REFRESH_INTERVAL, FEAR_GREED_REFRESH_INTERVAL } from '../../../shared/constants'

export function useCryptos() {
  return useQuery({
    queryKey: ['cryptos'],
    queryFn: async (): Promise<CryptoData[]> => {
      const result: ListingsResponse = await window.cryptoAPI.getListings(100)

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API')
      }

      return result.data
    },
    refetchInterval: API_REFRESH_INTERVAL,
    staleTime: API_REFRESH_INTERVAL / 2,
    retry: 2
  })
}

export function useFearGreedIndex() {
  return useQuery({
    queryKey: ['fearGreedIndex'],
    queryFn: async () => {
      const result = await window.cryptoAPI.getFearGreedIndex()
      return {
        value: result.data.value,
        classification: result.data.value_classification
      }
    },
    refetchInterval: FEAR_GREED_REFRESH_INTERVAL,
    staleTime: FEAR_GREED_REFRESH_INTERVAL,
    retry: 1
  })
}
