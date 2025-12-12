import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, StarOff } from 'lucide-react'
import { Crypto } from '@/shared/types'

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
