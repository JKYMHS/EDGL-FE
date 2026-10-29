import { DropdownMenu } from 'radix-ui'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type MenuItem = { label: string; onSelect?: () => void; danger?: boolean }

/** ⋯ 버튼을 누르면 열리는 항목 메뉴 (디자인 10, 11-2) */
export function MoreMenu({
  label,
  items,
  className,
  triggerClassName,
}: {
  label: string
  items: MenuItem[]
  className?: string
  triggerClassName?: string
}) {
  return (
    <DropdownMenu.Root modal={false}>
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
              className={cn(
                'cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold outline-none data-[highlighted]:bg-[#F5F8FA]',
                item.danger && 'mt-0.5 rounded-t-none border-t border-surface text-error',
              )}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
