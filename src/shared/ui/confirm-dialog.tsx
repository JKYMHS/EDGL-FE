import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from './button'
import { Modal } from './modal'

/** 짧은 확인창: 제목 · 설명 · [취소] [확인] (시안 C-1, C-4) */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'primary',
  onConfirm,
  className = 'w-[400px]',
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  onConfirm: () => void
  /** 폭 (기본 400px) */
  className?: string
  children?: ReactNode
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className={cn('gap-[18px] rounded-[20px]', className)}
    >
      {children}
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button variant={tone} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
