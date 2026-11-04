import { useState } from 'react'
import { PasswordField, isValidPassword } from '@/features/auth'
import { accountDemo } from '@/mocks/data/member'
import { Button } from '@/shared/ui'
import { MySection } from './my-section'

/** 마이페이지 — 비밀번호 변경 (시안 C-3) · FUNC-001-10. 구글 전용 계정은 "비밀번호 설정" */
export default function PasswordPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [wrongCurrent, setWrongCurrent] = useState(false)
  const ok = current && isValidPassword(next) && next === confirm

  return (
    <MySection
      title={accountDemo.googleOnly ? '비밀번호 설정' : '비밀번호 변경'}
      description="바꾸면 이 기기를 뺀 다른 기기에서는 로그아웃돼요."
    >
      <form
        className="flex w-[440px] flex-col gap-5 pt-2"
        onSubmit={(e) => {
          e.preventDefault()
          // 퍼블리싱용: 서버 확인 대신 "wrong"을 넣으면 틀린 상태를 보여 준다
          setWrongCurrent(current === 'wrong')
        }}
      >
        <PasswordField
          label="현재 비밀번호"
          value={current}
          onChange={(v) => {
            setCurrent(v)
            setWrongCurrent(false)
          }}
          autoComplete="current-password"
          error={wrongCurrent ? '현재 비밀번호가 맞지 않아요' : undefined}
        />
        <PasswordField label="새 비밀번호" value={next} onChange={setNext} showRules />
        <PasswordField
          label="새 비밀번호 확인"
          value={confirm}
          onChange={setConfirm}
          matchWith={next}
          placeholder="한 번 더 입력"
          error={confirm && confirm !== next ? '비밀번호가 같지 않아요' : undefined}
        />
        <div>
          <Button type="submit" disabled={!ok} className="px-[22px]">
            비밀번호 바꾸기
          </Button>
        </div>
      </form>
      <div className="mt-[18px] w-[440px] rounded-xl bg-[#F8FAFB] px-4 py-3.5">
        <p className="mb-1 text-[13px] font-bold">구글로만 가입했다면</p>
        <p className="text-[13px] leading-normal text-sub">
          이 탭 이름이 <b className="text-ink">비밀번호 설정</b>이 되고, 현재 비밀번호 대신 이메일
          인증(6자리 코드)을 먼저 받아요.
        </p>
      </div>
    </MySection>
  )
}
