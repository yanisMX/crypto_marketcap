import { useCryptos, useFearGreedIndex } from './hooks/useCrypto'
import { useWatchlist } from './hooks/useWatchlist'
import './index.css'
import { Header } from '@/components/Header'
import { StatsCards } from '@/components/StatsCards'
import { MarketMovements } from '@/components/MarketMovements'
import { Watchlist } from '@/components/Watchlist'
import { CryptoRanking } from '@/components/CryptoRanking'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'

function App() {
  const { data: cryptos = [], isLoading, error, refetch } = useCryptos()
  const { data: fearGreedIndex } = useFearGreedIndex()
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist } = useWatchlist()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} refetch={refetch} />
  }

  const totalMarketCap = cryptos.reduce((acc, crypto) => acc + crypto.quote.USD.market_cap, 0)
  const avgChange =
    cryptos.reduce((acc, crypto) => acc + crypto.quote.USD.percent_change_24h, 0) / cryptos.length
  const gainers = cryptos.filter((c) => c.quote.USD.percent_change_24h > 0).length

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-8">
      <Header
        title="Dashboard Crypto"
        description="Suivi en temps réel des principales cryptomonnaies"
      />

      <StatsCards
        totalMarketCap={totalMarketCap}
        avgChange={avgChange}
        gainers={gainers}
        totalCryptos={cryptos.length}
        fearGreedIndex={fearGreedIndex}
      />

      <MarketMovements cryptos={cryptos} />

      <Watchlist
        cryptos={cryptos}
        watchlist={watchlist}
        removeFromWatchlist={removeFromWatchlist}
      />

      <CryptoRanking
        cryptos={cryptos}
        watchlist={watchlist}
        isInWatchlist={isInWatchlist}
        toggleWatchlist={toggleWatchlist}
        refetch={refetch}
      />
    </div>
  )
}

export default App
