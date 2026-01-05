import React from 'react'
import { Badge } from '@/components/ui/badge'

interface SymbolBadgeProps {
  symbol: string
  className?: string
}

export function SymbolBadge({ symbol, className }: SymbolBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={
        `bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 ${
          className ?? ''
        }`
      }
    >
      {symbol}
    </Badge>
  )
}

interface PriceValueProps {
  price: number
}

export function PriceValue({ price }: PriceValueProps) {
  return (
    <span>
      $
      {price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
    </span>
  )
}

interface ChangeBadgeProps {
  change: number // percent change over 24h
  className?: string
}

export function ChangeBadge({ change, className }: ChangeBadgeProps) {
  const positive = change >= 0
  const variant = positive ? 'default' : 'destructive'
  const colorClasses = positive
    ? 'bg-green-500/20 text-green-400 border-green-500/50'
    : 'bg-red-500/20 text-red-400 border-red-500/50'

  return (
    <Badge variant={variant as any} className={`${colorClasses} ${className ?? ''}`}>
      {positive ? '+' : ''}
      {change.toFixed(2)}%
    </Badge>
  )
}

interface MarketCapValueProps {
  marketCapUsd: number
}

export function MarketCapValue({ marketCapUsd }: MarketCapValueProps) {
  return <span>${(marketCapUsd / 1e9).toFixed(2)}B</span>
}
