import { Link } from 'react-router'
import { cn } from '@/shared/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('text-xl font-extrabold tracking-[-0.02em] whitespace-nowrap', className)}
    >
      어디 갈래
    </Link>
  )
}
