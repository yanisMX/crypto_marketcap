import { WATCHLIST_STORAGE_KEY } from './constants'

export const getWatchlist = (): string[] => {
  const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export const saveWatchlist = (watchlist: string[]): void => {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist))
}

export const addToWatchlist = (watchlist: string[], symbol: string): string[] => {
  if (!watchlist.includes(symbol)) {
    return [...watchlist, symbol]
  }
  return watchlist
}

export const removeFromWatchlist = (watchlist: string[], symbol: string): string[] => {
  return watchlist.filter((item) => item !== symbol)
}

export const isInWatchlist = (watchlist: string[], symbol: string): boolean => {
  return watchlist.includes(symbol)
}

export const createWatchlistHandlers = (
  watchlist: string[],
  setWatchlist: (watchlist: string[]) => void
) => {
  return {
    add: (symbol: string) => {
      const newWatchlist = addToWatchlist(watchlist, symbol)
      setWatchlist(newWatchlist)
      saveWatchlist(newWatchlist)
    },
    remove: (symbol: string) => {
      const newWatchlist = removeFromWatchlist(watchlist, symbol)
      setWatchlist(newWatchlist)
      saveWatchlist(newWatchlist)
    },
    isIn: (symbol: string) => isInWatchlist(watchlist, symbol),
    toggle: (symbol: string) => {
      const newWatchlist = isInWatchlist(watchlist, symbol)
        ? removeFromWatchlist(watchlist, symbol)
        : addToWatchlist(watchlist, symbol)
      setWatchlist(newWatchlist)
      saveWatchlist(newWatchlist)
    }
  }
}
