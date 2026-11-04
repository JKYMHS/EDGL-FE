import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const sizes = {
  sm: 'size-5 rounded-md',
  md: 'size-[22px] rounded-md',
  lg: 'size-6 rounded-[7px]',
  xl: 'size-[26px] rounded-[7px]',
} as const

type CheckboxProps = {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: keyof typeof sizes
  label: string
  className?: string
}

/** 체크박스. 화면에는 상자만 보이고 label은 보조 기술에 읽힌다. */
export function Checkbox({
  checked,
  onCheckedChange,
  size = 'md',
  label,
  className,
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'grid shrink-0 place-items-center border-[1.5px] border-line-strong bg-white text-white transition-colors',
        'data-[state=checked]:border-sky data-[state=checked]:bg-sky',
        sizes[size],
        className,
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check size={size === 'sm' ? 12 : 14} strokeWidth={3.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

/** 체크 표시 (모양만). 카드 전체가 버튼일 때 안쪽에 쓴다. */
export function CheckMark({
  checked,
  size = 'md',
  className,
}: {
  checked: boolean
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center border-[1.5px] text-white transition-colors',
        checked ? 'border-sky bg-sky' : 'border-line-strong bg-white',
        sizes[size],
        className,
      )}
    >
      {checked && <Check size={size === 'sm' ? 12 : 14} strokeWidth={3.5} />}
    </span>
  )
}
