import { useEffect, useState } from 'react'
import type { CryptoData, ListingsResponse } from '@/env'
import './index.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Star, StarOff } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fearGreedIndex, setFearGreedIndex] = useState<{
    value: number
    classification: string
  } | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('crypto-watchlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setError(null)
        const result: ListingsResponse = await window.cryptoAPI.getListings(100)

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data format received from API')
        }

        setCryptos(result.data)
      } catch (err) {
        console.error('Erreur chargement cryptos:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur est survenue lors du chargement des données'
        )
        setCryptos([]) // Reset cryptos on error
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
    const interval = setInterval(fetchCryptos, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Fear and Greed Index
  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const result = await window.cryptoAPI.getFearGreedIndex()
        setFearGreedIndex({
          value: result.data.value,
          classification: result.data.value_classification
        })
      } catch (err) {
        console.error('Erreur chargement Fear and Greed Index:', err)
        // Don't set error state to avoid blocking the whole app
      }
    }

    fetchFearGreedIndex()
    const interval = setInterval(fetchFearGreedIndex, 3600000) // Update every hour
    return () => clearInterval(interval)
  }, [])

  // Watchlist management functions
  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol])
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item !== symbol))
  }

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-900 dark:text-white text-xl">Chargement des données...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 p-8">
        <div className="w-full flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Dashboard Crypto
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Suivi en temps réel des principales cryptomonnaies
              </p>
            </div>
            <div className="flex-shrink-0 w-auto">
              <ModeToggle />
          </div>
        </div>


        <Alert variant="destructive" className="bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-white mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          Réessayer
        </Button>
      </div>
    )
  }

  const totalMarketCap = cryptos.reduce((acc, crypto) => acc + crypto.quote.USD.market_cap, 0)
  const avgChange =
    cryptos.reduce((acc, crypto) => acc + crypto.quote.USD.percent_change_24h, 0) / cryptos.length
  const gainers = cryptos.filter((c) => c.quote.USD.percent_change_24h > 0).length

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-8">
      {/* Header */}
      <div className="w-full flex items-start justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard Crypto
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Suivi en temps réel des principales cryptomonnaies
          </p>
        </div>
        <div className="flex-shrink-0 w-auto">
          <ModeToggle />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-300">Market Cap Total</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-500">Top 50 cryptos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${(totalMarketCap / 1e12).toFixed(2)}T
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-300">Variation Moyenne 24h</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-500">Toutes cryptos</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {avgChange >= 0 ? '+' : ''}
              {avgChange.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-300">Cryptos en Hausse</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-500">Sur 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {gainers} / {cryptos.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-300">Fear & Greed Index</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-500">Sentiment du marché</CardDescription>
          </CardHeader>
          <CardContent>
            {fearGreedIndex ? (
              <div className="flex flex-col items-center">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    fearGreedIndex.value > 50
                      ? 'text-green-500'
                      : fearGreedIndex.value < 30
                        ? 'text-red-500'
                        : 'text-yellow-500'
                  }`}
                >
                  {fearGreedIndex.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{fearGreedIndex.classification}</div>
              </div>
            ) : (
              <div className="text-slate-600 dark:text-slate-500 text-center">Chargement...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 dark:text-white">Watchlist</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-500">
                Vos cryptomonnaies favorites
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50">
                  <TableHead className="text-slate-600 dark:text-slate-400">Nom</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400">Symbole</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">Prix (USD)</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">Variation 24h</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">Market Cap</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptos
                  .filter((crypto) => watchlist.includes(crypto.symbol))
                  .map((crypto) => (
                    <TableRow
                      key={`watchlist-${crypto.id}`}
                      className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-white">{crypto.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700"
                        >
                          {crypto.symbol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-900 dark:text-white font-mono">
                        $
                        {crypto.quote.USD.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            crypto.quote.USD.percent_change_24h >= 0 ? 'default' : 'destructive'
                          }
                          className={
                            crypto.quote.USD.percent_change_24h >= 0
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-red-500/20 text-red-400 border-red-500/50'
                          }
                        >
                          {crypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}
                          {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-700 dark:text-slate-300 font-mono">
                        ${(crypto.quote.USD.market_cap / 1e9).toFixed(2)}B
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromWatchlist(crypto.symbol)}
                          className="h-8 w-8 text-red-400"
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Main Table */}
      <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-white">Top 100 Cryptomonnaies</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-500">
              Mis à jour toutes les minutes
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            Rafraîchir
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50">
                <TableHead className="text-slate-600 dark:text-slate-400">#</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400">Nom</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400">Symbole</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 text-right">Prix (USD)</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 text-right">Variation 24h</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 text-right">Market Cap</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 text-center">Watchlist</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptos.map((crypto, index) => (
                <TableRow
                  key={crypto.id}
                  className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="text-slate-600 dark:text-slate-500 font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white">{crypto.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700"
                    >
                      {crypto.symbol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-900 dark:text-white font-mono">
                    $
                    {crypto.quote.USD.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={crypto.quote.USD.percent_change_24h >= 0 ? 'default' : 'destructive'}
                      className={
                        crypto.quote.USD.percent_change_24h >= 0
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }
                    >
                      {crypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}
                      {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-700 dark:text-slate-300 font-mono">
                    ${(crypto.quote.USD.market_cap / 1e9).toFixed(2)}B
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        isInWatchlist(crypto.symbol)
                          ? removeFromWatchlist(crypto.symbol)
                          : addToWatchlist(crypto.symbol)
                      }
                      className={`h-8 w-8 ${isInWatchlist(crypto.symbol) ? 'text-yellow-400' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      {isInWatchlist(crypto.symbol) ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
