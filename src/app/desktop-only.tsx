import { useSyncExternalStore, type ReactNode } from 'react'
import { MIN_DESKTOP_WIDTH } from '@/shared/config/layout'

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function isWideEnough() {
  return window.innerWidth >= MIN_DESKTOP_WIDTH
}

/** 화면 폭이 1280px 미만이면 안내 화면만 그린다 (TRD 3장). */
export function DesktopOnly({ children }: { children: ReactNode }) {
  const wide = useSyncExternalStore(subscribe, isWideEnough)
  if (wide) return children

  return (
    <main className="grid h-full place-items-center bg-field px-6 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-[22px] font-bold">더 넓은 화면에서 이용해 주세요</p>
        <p className="text-sm text-sub">
          어디 갈래는 데스크톱 화면(가로 {MIN_DESKTOP_WIDTH}px 이상)에 맞춰 만들었어요.
        </p>
      </div>
    </main>
  )
}
