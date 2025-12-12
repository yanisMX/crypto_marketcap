import { ModeToggle } from '@/components/mode-toggle'

interface HeaderProps {
  title: string
  description: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="w-full flex items-start justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 w-auto">
        <ModeToggle />
      </div>
    </div>
  )
}
