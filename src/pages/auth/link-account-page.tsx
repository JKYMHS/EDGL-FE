import { useState } from 'react'
import { Link } from 'react-router'
import { PasswordField } from '@/features/auth'
import { accountDemo } from '@/mocks/data/member'
import { MapCanvas } from '@/shared/map'
import { Button, Logo } from '@/shared/ui'

/** 구글 계정 연결 (시안 A-4) · FUNC-001-02, 001-04 · ACCOUNT_LINK_REQUIRED */
export default function LinkAccountPage() {
  const [password, setPassword] = useState('')

  return (
    <div className="flex h-full min-h-[720px]">
      <section className="relative flex-1 overflow-hidden" aria-hidden>
        <MapCanvas river="low">
          <div className="absolute top-[42%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[18px]">
            <span className="grid size-[72px] place-items-center rounded-[20px] bg-white text-[15px] font-extrabold shadow-[0_6px_20px_rgba(30,36,32,.12)]">
              갈래
            </span>
            <span className="w-16 border-t-[3px] border-dotted border-sky" />
            <span className="grid size-[72px] place-items-center rounded-[20px] bg-white text-[26px] font-bold text-[#4285F4] shadow-[0_6px_20px_rgba(30,36,32,.12)]">
              G
            </span>
          </div>
        </MapCanvas>
        <Logo className="absolute top-14 left-14 text-[22px]" />
        <div className="absolute bottom-16 left-14 flex flex-col gap-2.5">
          <p className="text-[40px] leading-[1.2] font-bold tracking-[-0.025em]">
            한 계정으로,
            <br />
            어느 쪽으로든 로그인.
          </p>
          <p className="text-base text-sub">연결하면 이메일과 구글 모두로 로그인할 수 있어요.</p>
        </div>
      </section>
      <section className="flex w-[640px] shrink-0 items-center justify-center">
        <form className="flex w-[400px] flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold tracking-[-0.015em]">이미 가입한 계정이 있어요</h1>
            <p className="text-[15px] leading-normal text-sub">
              <b className="text-ink">{accountDemo.email}</b>으로 가입한 계정에 이 구글 계정을
              연결할까요? 본인 확인을 위해 비밀번호를 입력해 주세요.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <span className="grid size-9 place-items-center rounded-full bg-map font-bold text-[#4285F4]">
              G
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{accountDemo.name}</span>
              <span className="text-xs text-sub">{accountDemo.email} · Google</span>
            </span>
          </div>
          <PasswordField
            label="비밀번호"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <Button type="submit" size="xl" disabled={!password}>
            연결하고 로그인
          </Button>
          <div className="flex justify-between text-sm font-semibold text-sub">
            <Link to="/password/reset">비밀번호 찾기</Link>
            <Link to="/login">연결하지 않고 돌아가기</Link>
          </div>
        </form>
      </section>
    </div>
  )
}
