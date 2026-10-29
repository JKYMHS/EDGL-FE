import { Check } from 'lucide-react'
import { Link } from 'react-router'
import { Button, Modal } from '@/shared/ui'
import { LOGIN_GATE_COPY, type LoginGateReason } from '../model/login-gate'
import { GoogleButton } from './google-button'

type LoginRequiredModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: LoginGateReason
  /** 찜하려던 장소 이름. 있으면 설명을 "OO를 찜 목록에 저장하려면…"으로 바꾼다 (14-1) */
  targetName?: string
}

/** 로그인 필요 모달. 모달은 하나, 문구만 상황에 맞게 바꾼다 (디자인 14-1, 14-2). */
export function LoginRequiredModal({
  open,
  onOpenChange,
  reason,
  targetName,
}: LoginRequiredModalProps) {
  const copy = LOGIN_GATE_COPY[reason]
  const description =
    reason === 'wish' && targetName ? (
      <>
        <strong className="font-semibold text-ink">{targetName}</strong>를 찜 목록에 저장하려면
        로그인이 필요해요.
      </>
    ) : (
      copy.body
    )

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      className="w-[460px] gap-5 rounded-[20px] px-7 pt-8 pb-6"
      icon={
        <span className="grid size-14 place-items-center rounded-full bg-sky-soft">
          <span className="grid size-6 -rotate-45 place-items-center rounded-[50%_50%_50%_0] bg-sky">
            <span className="size-2 rounded-full bg-white" />
          </span>
        </span>
      }
      title={copy.title}
      description={description}
    >
      <ul className="flex flex-col gap-2.5 rounded-xl bg-[#F8FAFB] px-4 py-3.5 text-sm">
        <li className="flex items-center gap-2.5">
          <Check size={14} strokeWidth={3.5} className="text-sky" />
          찜한 곳을 지도에서 모아 비교
        </li>
        <li className="flex items-center gap-2.5">
          <Check size={14} strokeWidth={3.5} className="text-sky" />
          취향대로 AI 코스 추천 <span className="font-mono text-xs text-sub">하루 10회</span>
        </li>
        <li className="flex items-center gap-2.5">
          <Check size={14} strokeWidth={3.5} className="text-sky" />
          여행 일정을 구글 캘린더로
        </li>
      </ul>
      <div className="flex flex-col gap-2">
        <Button asChild size="xl" className="h-[50px] w-full">
          <Link to="/login">로그인</Link>
        </Button>
        <GoogleButton className="h-[50px]" />
      </div>
      <div className="flex items-center justify-between pt-0.5 text-sm">
        <span className="text-sub">
          처음이세요?{' '}
          <Link to="/signup" className="font-semibold text-sky-text">
            회원가입
          </Link>
        </span>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="font-semibold text-sub"
        >
          {copy.dismiss}
        </button>
      </div>
      <p className="border-t border-surface pt-3.5 text-center text-xs text-muted">{copy.after}</p>
    </Modal>
  )
}
