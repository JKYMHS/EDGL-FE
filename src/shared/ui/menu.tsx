import { DropdownMenu } from 'radix-ui'
import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type MenuItem = {
  label: string
  onSelect?: () => void
  danger?: boolean
  /** 메뉴 아래 작은 설명 */
  hint?: string
  disabled?: boolean
}

/** ⋯ 버튼을 누르면 열리는 항목 메뉴 (디자인 10, 11-2) */
export function MoreMenu({
  label,
  items,
  className,
  triggerClassName,
  trigger,
}: {
  label: string
  items: MenuItem[]
  className?: string
  triggerClassName?: string
  /** ⋯ 대신 쓸 버튼 (asChild로 붙는다) */
  trigger?: ReactNode
}) {
  return (
    <DropdownMenu.Root modal={false}>
      {trigger ? (
        <DropdownMenu.Trigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger}
        </DropdownMenu.Trigger>
      ) : (
        <DropdownMenu.Trigger
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'grid size-7 place-items-center rounded-md text-sub hover:bg-black/5 data-[state=open]:bg-black/5',
            triggerClassName,
          )}
        >
          <MoreHorizontal size={16} strokeWidth={2.5} />
        </DropdownMenu.Trigger>
      )}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            'z-50 flex w-[200px] flex-col rounded-xl bg-white p-1.5 shadow-[0_10px_28px_rgba(30,36,32,.2)]',
            className,
          )}
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.onSelect}
              disabled={item.disabled}
              className={cn(
                'flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[highlighted]:bg-[#F5F8FA]',
                item.danger && 'mt-0.5 rounded-t-none border-t border-surface text-error',
              )}
            >
              {item.label}
              {item.hint && <span className="text-xs font-medium text-sub">{item.hint}</span>}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
