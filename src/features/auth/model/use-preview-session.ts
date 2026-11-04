import { useSearchParams } from 'react-router'

/**
 * 퍼블리싱용 로그인 상태. 주소에 `?guest=1`이 있으면 비로그인으로 본다.
 * 세션 스토어(TRD 4장)를 만들면 이 훅을 그쪽으로 바꾼다.
 */
export function usePreviewSession() {
  const [params] = useSearchParams()
  const isGuest = params.get('guest') === '1'
  return { isLoggedIn: !isGuest }
}
