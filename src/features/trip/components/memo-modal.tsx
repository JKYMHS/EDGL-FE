import { useState } from 'react'
import { ConfirmDialog } from '@/shared/ui'

/** PRD 8.1 일정 항목 메모 최대 200자 */
export const MEMO_MAX = 200

/** 일정 편집 항목 메뉴 "메모 추가·수정" · FUNC-004-02 */
export function MemoModal({
  open,
  onOpenChange,
  placeName,
  initial = '',
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeName: string
  initial?: string
  /** 빈 문자열이면 메모를 지운다 */
  onSave: (memo: string) => void
}) {
  const [memo, setMemo] = useState(initial)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      className="w-[480px]"
      title={initial ? '메모 수정' : '메모 추가'}
      description={placeName}
      confirmLabel="저장"
      onConfirm={() => onSave(memo.trim())}
    >
      <div className="flex flex-col gap-1.5">
        <textarea
          aria-label="메모"
          value={memo}
          maxLength={MEMO_MAX}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="예: 수문장 교대식 10시, 한복 입으면 무료 입장"
          className="resize-none rounded-[10px] border border-line px-3.5 py-3 text-[15px] outline-none placeholder:text-muted focus:border-[1.5px] focus:border-sky"
        />
        <span className="self-end font-mono text-xs text-muted">
          {memo.length}/{MEMO_MAX}
        </span>
      </div>
    </ConfirmDialog>
  )
}
