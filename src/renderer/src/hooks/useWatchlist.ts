import { useState, useEffect } from 'react'
import {
  getWatchlist,
  saveWatchlist,
  addToWatchlist as addUtil,
  removeFromWatchlist as removeUtil,
  isInWatchlist as isInUtil
} from '../../../shared/watchlist-functions'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(getWatchlist)

  useEffect(() => {
    saveWatchlist(watchlist)
  }, [watchlist])

  const addToWatchlist = (symbol: string) => {
    setWatchlist(addUtil(watchlist, symbol))
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(removeUtil(watchlist, symbol))
  }

  const isInWatchlist = (symbol: string) => {
    return isInUtil(watchlist, symbol)
  }

  const toggleWatchlist = (symbol: string) => {
    if (isInWatchlist(symbol)) {
      removeFromWatchlist(symbol)
    } else {
      addToWatchlist(symbol)
    }
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist
  }
}
