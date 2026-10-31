import { Slot } from 'radix-ui'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const variants = {
  primary: 'bg-sky text-white hover:bg-[#1890DA]',
  secondary: 'bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-[#F8FAFB]',
  soft: 'bg-sky-soft text-sky-text hover:bg-[#DDF0FD]',
  ghost: 'text-sub hover:text-ink',
  danger: 'bg-error text-white hover:bg-[#9E3328]',
} as const

const sizes = {
  xs: 'h-9 rounded-[9px] px-3.5 text-[13px]',
  sm: 'h-10 rounded-[10px] px-4 text-sm',
  md: 'h-11 rounded-[10px] px-5 text-[15px]',
  lg: 'h-12 rounded-xl px-5 text-[15px]',
  xl: 'h-[52px] rounded-xl px-6 text-base',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** 자식 요소(예: Link)에 버튼 스타일을 입힌다 */
  asChild?: boolean
}

/** 디자인 00 버튼: 주요 · 보조 · 연한 강조 · 비활성 */
export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 font-semibold whitespace-nowrap transition-colors',
        'disabled:pointer-events-none disabled:bg-field disabled:text-[#A3AAB0] disabled:shadow-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
