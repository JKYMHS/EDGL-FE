import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { WithdrawModal } from '@/features/auth'
import { demoUser, withdrawSummary } from '@/mocks/data/member'
import { cn } from '@/shared/lib/cn'
import { ConfirmDialog } from '@/shared/ui'

const MENU = [
  { to: '/my/account', label: '계정' },
  { to: '/my/preferences', label: '취향 설정' },
  { to: '/my/calendar', label: '캘린더 연동' },
  { to: '/my/password', label: '비밀번호 변경' },
]

/** 마이페이지 사이드 메뉴 (디자인 13, 시안 C-4·C-5) · FUNC-001-04, 10~12, 14, 15, 005-01 */
export default function MyLayout() {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  return (
    <div className="relative flex min-h-0 flex-1">
      <aside className="flex w-[300px] shrink-0 flex-col gap-1 border-r border-line px-5 py-7">
        <div className="flex items-center gap-3 px-3 pb-5">
          <span className="size-11 rounded-full bg-map" />
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-bold">{demoUser.name}</span>
            <span className="text-xs text-sub">{demoUser.email}</span>
          </span>
        </div>
        <nav aria-label="마이페이지" className="flex flex-col gap-1">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-[10px] px-3.5 py-3 text-[15px]',
                  isActive
                    ? 'bg-sky-soft font-bold text-sky-text'
                    : 'font-medium hover:bg-[#F5F8FA]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="mt-auto px-3.5 py-3 text-left text-sm font-semibold text-sub"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={() => setWithdrawOpen(true)}
          className="px-3.5 pb-3 text-left text-[13px] text-error"
        >
          회원 탈퇴
        </button>
      </aside>
      <Outlet />
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="로그아웃할까요?"
        description="이 기기에서만 로그아웃돼요. 다른 기기는 그대로예요."
        confirmLabel="로그아웃"
        onConfirm={() => navigate('/login')}
      />
      {withdrawOpen && (
        <WithdrawModal
          open
          onOpenChange={setWithdrawOpen}
          summary={withdrawSummary}
          onWithdraw={() => navigate('/')}
        />
      )}
    </div>
  )
}
