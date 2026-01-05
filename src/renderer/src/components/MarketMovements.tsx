import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Crypto } from '@/shared/types'
import { SymbolBadge, ChangeBadge } from '@/components/crypto/CryptoCells'

interface MarketMovementsProps {
  cryptos: Crypto[]
}

export function MarketMovements({ cryptos }: MarketMovementsProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-slate-900 dark:text-white">Mouvements du Marché</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-500">
            Les plus fortes hausses et baisses sur 24h
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <div>
            <h3 className="text-lg font-semibold text-green-500 mb-4">Top Hausses</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50">
                  <TableHead className="text-slate-600 dark:text-slate-400">Nom</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400">Symbole</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">Variation 24h</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...cryptos]
                  .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
                  .slice(0, 3)
                  .map((crypto) => (
                    <TableRow
                      key={`gainer-${crypto.id}`}
                      className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-white">{crypto.name}</TableCell>
                      <TableCell>
                        <SymbolBadge symbol={crypto.symbol} />
                      </TableCell>
                      <TableCell className="text-right">
                        <ChangeBadge change={crypto.quote.USD.percent_change_24h} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Top Losers */}
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-4">Top Baisses</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50">
                  <TableHead className="text-slate-600 dark:text-slate-400">Nom</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400">Symbole</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">Variation 24h</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...cryptos]
                  .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
                  .slice(0, 3)
                  .map((crypto) => (
                    <TableRow
                      key={`loser-${crypto.id}`}
                      className="border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-white">{crypto.name}</TableCell>
                      <TableCell>
                        <SymbolBadge symbol={crypto.symbol} />
                      </TableCell>
                      <TableCell className="text-right">
                        <ChangeBadge change={crypto.quote.USD.percent_change_24h} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
