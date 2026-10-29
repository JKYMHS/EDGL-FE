import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { LoginRequiredModal, usePreviewSession, type LoginGateReason } from '@/features/auth'
import { cn } from '@/shared/lib/cn'
import { Button, Logo } from '@/shared/ui'
import { HeaderSearch } from './header-search'

type MenuItem = { to: string; label: string; match: string[]; gate?: LoginGateReason }

const MENU: MenuItem[] = [
  { to: '/explore', label: '탐색', match: ['/explore', '/places'] },
  { to: '/recommend', label: 'AI 추천', match: ['/recommend'], gate: 'recommend' },
  { to: '/trips', label: '내 여행', match: ['/trips'], gate: 'trip' },
  { to: '/likes', label: '찜', match: ['/likes'], gate: 'wish' },
]

/** 글로벌 헤더: 로고 · 검색창 · 메뉴 · 프로필 (PRD 6.1, 디자인 04, 14-1) */
export function GlobalHeader() {
  const { pathname } = useLocation()
  const { isLoggedIn } = usePreviewSession()
  const onExplore = pathname.startsWith('/explore') || pathname.startsWith('/places')
  const [gate, setGate] = useState<LoginGateReason>()

  return (
    <header className="flex h-[76px] shrink-0 items-center gap-9 border-b border-line px-8">
      <Logo />
      <HeaderSearch emphasized={onExplore} />
      <nav aria-label="주요 메뉴" className="ml-auto flex h-full gap-7 text-[15px] font-semibold">
        {MENU.map((item) => {
          const active = item.match.some((m) => pathname.startsWith(m))
          const locked = Boolean(item.gate) && !isLoggedIn
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => {
                // 비로그인이면 이동하지 않고 로그인 필요 모달을 띄운다 (PRD 5.0)
                if (!locked) return
                e.preventDefault()
                setGate(item.gate)
              }}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 border-b-2 border-transparent',
                active
                  ? 'border-sky text-ink'
                  : locked
                    ? 'text-[#A3AAB0]'
                    : 'text-sub hover:text-ink',
              )}
            >
              {item.label}
              {locked && item.to === '/recommend' && <Lock size={11} aria-label="로그인 필요" />}
            </NavLink>
          )
        })}
      </nav>
      {isLoggedIn ? (
        <Link
          to="/my/preferences"
          aria-label="마이페이지"
          className={cn(
            'size-[34px] shrink-0 rounded-full',
            pathname.startsWith('/my') ? 'bg-sky ring-2 ring-white ring-offset-0' : 'bg-map',
          )}
        />
      ) : (
        <div className="-ml-5 flex gap-2">
          <Button asChild variant="secondary" size="sm" className="h-[38px] px-3.5">
            <Link to="/login">로그인</Link>
          </Button>
          <Button asChild size="sm" className="h-[38px] px-3.5">
            <Link to="/signup">회원가입</Link>
          </Button>
        </div>
      )}
      {gate && (
        <LoginRequiredModal
          open
          onOpenChange={(open) => !open && setGate(undefined)}
          reason={gate}
        />
      )}
    </header>
  )
}
