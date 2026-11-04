/** 비밀번호 정책 (PRD 8.1): 8~20자, 영문·숫자 각 1자 이상, 공백 불가. 특수문자는 선택 */
export const PASSWORD_RULES = [
  { id: 'length', label: '8~20자', test: (v: string) => v.length >= 8 && v.length <= 20 },
  { id: 'letter', label: '영문 포함', test: (v: string) => /[A-Za-z]/.test(v) },
  { id: 'digit', label: '숫자 포함', test: (v: string) => /\d/.test(v) },
  { id: 'space', label: '공백 없음', test: (v: string) => v.length > 0 && !/\s/.test(v) },
] as const

export function checkPassword(value: string) {
  return PASSWORD_RULES.map((rule) => ({ id: rule.id, label: rule.label, ok: rule.test(value) }))
}

export function isValidPassword(value: string) {
  return PASSWORD_RULES.every((rule) => rule.test(value))
}

/** 이메일 형식 (local@domain, 최대 254자) */
export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
