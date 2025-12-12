import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FearGreedIndex } from '@/shared/types'

interface StatsCardsProps {
  totalMarketCap: number
  avgChange: number
  gainers: number
  totalCryptos: number
  fearGreedIndex?: FearGreedIndex
}

export function StatsCards({ totalMarketCap, avgChange, gainers, totalCryptos, fearGreedIndex }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-300">Market Cap Total</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-500">Top 100 cryptos</CardDescription>
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
            {gainers} / {totalCryptos}
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
  )
}
