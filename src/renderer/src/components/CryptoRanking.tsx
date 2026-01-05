import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Star, StarOff } from 'lucide-react'
import { Crypto } from '@/shared/types'
import { SymbolBadge, PriceValue, ChangeBadge, MarketCapValue } from '@/components/crypto/CryptoCells'

interface CryptoRankingProps {
  cryptos: Crypto[]
  watchlist: string[]
  isInWatchlist: (symbol: string) => boolean
  toggleWatchlist: (symbol: string) => void
  refetch: () => void
}

export function CryptoRanking({ cryptos, watchlist, isInWatchlist, toggleWatchlist, refetch }: CryptoRankingProps) {
  return (
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
          onClick={() => refetch()}
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
                  <SymbolBadge symbol={crypto.symbol} />
                </TableCell>
                <TableCell className="text-right text-slate-900 dark:text-white font-mono">
                  <PriceValue price={crypto.quote.USD.price} />
                </TableCell>
                <TableCell className="text-right">
                  <ChangeBadge change={crypto.quote.USD.percent_change_24h} />
                </TableCell>
                <TableCell className="text-right text-slate-700 dark:text-slate-300 font-mono">
                  <MarketCapValue marketCapUsd={crypto.quote.USD.market_cap} />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleWatchlist(crypto.symbol)}
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
  )
}
