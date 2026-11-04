import { Navigate, useLocation } from 'react-router'

/** 경로만 바꾸고 ?tab= 같은 쿼리는 그대로 넘긴다 (옛 주소 호환) */
export function RedirectKeepingSearch({ to }: { to: string }) {
  const { search } = useLocation()
  return <Navigate to={`${to}${search}`} replace />
}
