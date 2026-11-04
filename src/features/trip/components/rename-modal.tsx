import { useState } from 'react'
import { ConfirmDialog, TextField } from '@/shared/ui'

/** PRD 8.1 일정안 이름 1~30자 */
export const PLAN_NAME_MAX = 30

/** 일정안 메뉴 "이름 바꾸기" · FUNC-004-04 */
export function RenameModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: string
  onSave: (name: string) => void
}) {
  const [name, setName] = useState(initial)
  const trimmed = name.trim()
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      className="w-[440px]"
      title="일정안 이름 바꾸기"
      confirmLabel="바꾸기"
      onConfirm={() => trimmed && onSave(trimmed)}
    >
      <TextField
        aria-label="일정안 이름"
        value={name}
        maxLength={PLAN_NAME_MAX}
        onChange={(e) => setName(e.target.value)}
        error={trimmed ? undefined : '이름을 입력해 주세요'}
        suffix={
          <span className="font-mono text-xs text-muted">
            {name.length}/{PLAN_NAME_MAX}
          </span>
        }
      />
    </ConfirmDialog>
  )
}
