import { checkPassword, isValidEmail, isValidPassword } from './password-policy'

describe('비밀번호 정책 (PRD 8.1)', () => {
  it('8~20자, 영문·숫자 포함, 공백 없음을 모두 만족해야 한다', () => {
    expect(isValidPassword('trip2026')).toBe(true)
    expect(isValidPassword('trip2026!@')).toBe(true)
    expect(isValidPassword('trip202')).toBe(false)
    expect(isValidPassword('a'.repeat(19) + '1' + 'b')).toBe(false)
    expect(isValidPassword('onlyletters')).toBe(false)
    expect(isValidPassword('12345678')).toBe(false)
    expect(isValidPassword('trip 2026')).toBe(false)
  })

  it('규칙마다 통과 여부를 알려 준다', () => {
    expect(checkPassword('tripseoul').map((r) => [r.id, r.ok])).toEqual([
      ['length', true],
      ['letter', true],
      ['digit', false],
      ['space', true],
    ])
  })

  it('빈 값은 공백 규칙도 통과하지 않는다', () => {
    expect(checkPassword('').every((r) => !r.ok)).toBe(true)
  })
})

describe('이메일 형식', () => {
  it('local@domain 형식만 받는다', () => {
    expect(isValidEmail('minji@example.com')).toBe(true)
    expect(isValidEmail('minji@example')).toBe(false)
    expect(isValidEmail('abc@')).toBe(false)
    expect(isValidEmail('a b@example.com')).toBe(false)
  })
})
