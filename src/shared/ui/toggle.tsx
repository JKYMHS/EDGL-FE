import { Switch } from 'radix-ui'
import { cn } from '@/shared/lib/cn'

const sizes = {
  sm: { root: 'h-[18px] w-8', thumb: 'size-3.5 data-[state=checked]:translate-x-3.5' },
  md: { root: 'h-[26px] w-11', thumb: 'size-[22px] data-[state=checked]:translate-x-[18px]' },
} as const

type ToggleProps = {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  size?: keyof typeof sizes
  className?: string
}

/** 켜고 끄는 스위치 (디자인 06, 07-4, 13) */
export function Toggle({ checked, onCheckedChange, label, size = 'md', className }: ToggleProps) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className={cn(
        'relative shrink-0 rounded-full bg-line p-0.5 transition-colors data-[state=checked]:bg-sky',
        sizes[size].root,
        className,
      )}
    >
      <Switch.Thumb
        className={cn(
          'block rounded-full bg-white shadow-[0_1px_3px_rgba(30,36,32,.2)] transition-transform',
          sizes[size].thumb,
        )}
      />
    </Switch.Root>
  )
}
