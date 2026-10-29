import { Outlet } from 'react-router'
import { GlobalHeader } from './global-header'

/** 글로벌 헤더가 있는 화면의 틀 (1440 × 960 디자인을 화면 전체로 늘린다) */
export function MainLayout() {
  return (
    <div className="flex h-full min-h-[720px] flex-col">
      <GlobalHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
