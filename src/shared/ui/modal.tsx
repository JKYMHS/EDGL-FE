import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  /** 제목 위 그림 */
  icon?: ReactNode
  children?: ReactNode
  /** 오른쪽 위 닫기(×) 버튼 */
  closeButton?: boolean
  className?: string
}

/** 가운데 모달 (디자인 11-4, 14-1). 바깥을 누르거나 Esc로 닫힌다. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  closeButton = false,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(30,36,32,.45)]" />
        <Dialog.Content
          // 닫기 버튼에 바로 초점 테두리가 생기지 않도록 상자 자체에 초점을 둔다
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement).focus()
          }}
          className={cn(
            'outline-none',
            'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-48px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[22px] bg-white p-7 shadow-[0_24px_64px_rgba(30,36,32,.28)]',
            className,
          )}
        >
          {closeButton && (
            <Dialog.Close
              aria-label="닫기"
              className="absolute top-5 right-5 p-1 text-muted hover:text-ink"
            >
              <X size={18} />
            </Dialog.Close>
          )}
          {icon && <div aria-hidden>{icon}</div>}
          <div className="flex flex-col gap-1.5">
            <Dialog.Title className="text-[22px] font-bold tracking-[-0.01em]">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="text-[15px] leading-normal text-sub">
                {description}
              </Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
