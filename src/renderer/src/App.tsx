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
import { AlertCircle } from 'lucide-react'

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des données')
        setCryptos([]) // Reset cryptos on error
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
    const interval = setInterval(fetchCryptos, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des données...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Crypto</h1>
          <p className="text-slate-400">Suivi en temps réel des principales cryptomonnaies</p>
        </div>

        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
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
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Crypto</h1>
        <p className="text-slate-400">Suivi en temps réel des principales cryptomonnaies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300">Market Cap Total</CardTitle>
            <CardDescription className="text-slate-500">Top 50 cryptos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(totalMarketCap / 1e12).toFixed(2)}T
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300">Variation Moyenne 24h</CardTitle>
            <CardDescription className="text-slate-500">Toutes cryptos</CardDescription>
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

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300">Cryptos en Hausse</CardTitle>
            <CardDescription className="text-slate-500">Sur 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {gainers} / {cryptos.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Top 50 Cryptomonnaies</CardTitle>
            <CardDescription className="text-slate-500">
              Mis à jour toutes les minutes
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Rafraîchir
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">#</TableHead>
                <TableHead className="text-slate-400">Nom</TableHead>
                <TableHead className="text-slate-400">Symbole</TableHead>
                <TableHead className="text-slate-400 text-right">Prix (USD)</TableHead>
                <TableHead className="text-slate-400 text-right">Variation 24h</TableHead>
                <TableHead className="text-slate-400 text-right">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptos.map((crypto, index) => (
                <TableRow
                  key={crypto.id}
                  className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="text-slate-500 font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium text-white">{crypto.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-slate-800 text-slate-300 border-slate-700"
                    >
                      {crypto.symbol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-white font-mono">
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
                  <TableCell className="text-right text-slate-300 font-mono">
                    ${(crypto.quote.USD.market_cap / 1e9).toFixed(2)}B
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
