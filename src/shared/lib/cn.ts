import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 조건부 클래스를 합치고 Tailwind 충돌은 뒤의 값으로 정리한다. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
