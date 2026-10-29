import { Heart } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

/** 찜 하트. 누르면 찜하거나 뺀다. */
export function LikeButton({
  liked,
  name,
  onClick,
  className,
}: {
  liked: boolean
  name: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? `${name} 찜 빼기` : `${name} 찜하기`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn('grid place-items-center p-1', className)}
    >
      <Heart
        size={17}
        fill="currentColor"
        strokeWidth={0}
        className={liked ? 'text-like' : 'text-line-strong'}
      />
    </button>
  )
}
