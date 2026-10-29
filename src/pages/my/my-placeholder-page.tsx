import { useLocation } from 'react-router'
import { NotDesigned } from '@/shared/ui'

const NAMES: Record<string, string> = {
  '/my/account': '마이페이지 — 계정',
  '/my/calendar': '마이페이지 — 캘린더 연동',
  '/my/password': '마이페이지 — 비밀번호 변경',
}

/** 디자인이 없는 마이페이지 탭 (PRD 6.2) */
export default function MyPlaceholderPage() {
  const { pathname } = useLocation()
  return <NotDesigned name={NAMES[pathname] ?? '마이페이지'} />
}
