import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { GoogleButton } from '@/features/auth'
import { demoUser } from '@/mocks/data/member'
import { MapCanvas, NumberMarker, RouteLine } from '@/shared/map'
import { Button, Logo, TextField, Toast } from '@/shared/ui'

const COURSE = [
  { x: 27.6, y: 54.2 },
  { x: 43.4, y: 41.7 },
  { x: 61.8, y: 33.3 },
  { x: 71, y: 49 },
]

/** 로그인 (디자인 01) · FUNC-001-01, 02 */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [params] = useSearchParams()
  // 비밀번호 찾기를 마치고 오면 완료 알림 (FUNC-001-09)
  const [resetDone, setResetDone] = useState(params.get('reset') === 'done')

  return (
    <div className="flex h-full min-h-[720px]">
      <section className="relative flex-1 overflow-hidden" aria-hidden>
        <MapCanvas
          river="low"
          svg={
            <>
              <RouteLine mode="walk" color="#1E9DEB" points={[COURSE[0], COURSE[1]]} />
              <RouteLine mode="transit" color="#1E9DEB" points={[COURSE[1], COURSE[2]]} />
              <RouteLine mode="taxi" color="#1E9DEB" points={[COURSE[2], COURSE[3]]} />
            </>
          }
        >
          {COURSE.map((point, i) => (
            <NumberMarker key={i} point={point} n={i + 1} color="#1E9DEB" className="shadow-none" />
          ))}
        </MapCanvas>
        <Logo className="absolute top-14 left-14 text-[22px]" />
        <div className="absolute bottom-16 left-14 flex flex-col gap-2.5">
          <p className="text-[40px] leading-[1.2] font-bold tracking-[-0.025em]">
            취향대로 짠 여행 코스,
            <br />
            지도 위에서 바로.
          </p>
          <p className="text-base text-sub">축제를 찾고, 비교하고, AI에게 코스를 맡기세요.</p>
        </div>
      </section>
      <section className="flex w-[640px] shrink-0 items-center justify-center">
        <form className="flex w-[400px] flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold tracking-[-0.015em]">로그인</h1>
            <p className="text-[15px] text-sub">저장한 일정과 찜을 이어서 볼 수 있어요</p>
          </div>
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            defaultValue={demoUser.email}
          />
          <TextField
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            defaultValue="password"
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[13px] font-semibold text-sub"
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            }
          />
          <Button type="submit" size="xl">
            로그인
          </Button>
          <div className="flex items-center gap-3 text-[13px] text-muted">
            <span className="h-px flex-1 bg-line" />
            또는
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton />
          <div className="flex justify-between text-sm font-semibold">
            <Link to="/password/reset" className="text-sub">
              비밀번호 찾기
            </Link>
            <Link to="/signup" className="text-sky-text">
              회원가입
            </Link>
          </div>
        </form>
      </section>
      {resetDone && (
        <Toast onClose={() => setResetDone(false)}>
          비밀번호를 바꿨어요. 새 비밀번호로 로그인해 주세요.
        </Toast>
      )}
    </div>
  )
}
