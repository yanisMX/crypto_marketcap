import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Header } from './Header'

interface ErrorStateProps {
  error: Error | unknown
  refetch: () => void
}

export function ErrorState({ error, refetch }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-8">
      <Header
        title="Dashboard Crypto"
        description="Suivi en temps réel des principales cryptomonnaies"
      />

      <Alert variant="destructive" className="bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-white mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Une erreur est survenue'}
        </AlertDescription>
      </Alert>

      <Button
        onClick={() => refetch()}
        variant="outline"
        className="border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        Réessayer
      </Button>
    </div>
  )
}
