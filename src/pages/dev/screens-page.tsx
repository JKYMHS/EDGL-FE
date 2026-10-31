import { Link } from 'react-router'
import { DRAFT_SCREENS, SCREENS, type ScreenLink } from './screens'

/** 개발용: 기준 디자인 화면 목록 (개발 서버에서만 열림) */
export default function ScreensPage() {
  return (
    <main className="mx-auto flex max-w-[880px] flex-col gap-6 px-6 py-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[34px] font-bold tracking-[-0.015em]">화면 목록</h1>
        <p className="text-sm text-sub">
          기준 디자인 `어디 갈래 전체 화면 (명세 반영).html`의 27개 화면이에요. 주소 끝에
          `guest=1`을 붙이면 비로그인으로 볼 수 있어요.
        </p>
      </div>
      <ScreenList screens={SCREENS} />
      <h2 className="mt-6 text-[22px] font-bold">디자인 없던 화면 (시안)</h2>
      <ScreenList screens={DRAFT_SCREENS} />
    </main>
  )
}

function ScreenList({ screens }: { screens: ScreenLink[] }) {
  return (
    <ol className="flex flex-col border-t border-line">
      {screens.map((s) => (
        <li
          key={s.id}
          className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-3"
        >
          <span className="font-mono text-sm font-semibold text-sky-text">{s.id}</span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">{s.name}</span>
            {s.note && <span className="text-xs text-sub">{s.note}</span>}
          </span>
          <Link to={s.path} className="font-mono text-xs text-sub hover:text-sky-text">
            {s.path}
          </Link>
        </li>
      ))}
    </ol>
  )
}
