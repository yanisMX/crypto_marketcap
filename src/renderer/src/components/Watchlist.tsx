import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StarOff } from 'lucide-react'
import { Crypto } from '@/shared/types'
import { SymbolBadge, PriceValue, ChangeBadge, MarketCapValue } from '@/components/crypto/CryptoCells'

interface WatchlistProps {
  cryptos: Crypto[]
  watchlist: string[]
  removeFromWatchlist: (symbol: string) => void
}

export function Watchlist({ cryptos, watchlist, removeFromWatchlist }: WatchlistProps) {
  if (watchlist.length === 0) {
    return null
  }

  return (
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
  )
}
