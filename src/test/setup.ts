import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// 화면은 lazy route로 불러오므로 첫 import가 병렬 실행 중에는 1초를 넘길 수 있다
configure({ asyncUtilTimeout: 5000 })

// Radix가 쓰는 브라우저 API 중 jsdom에 없는 것
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}

afterEach(() => {
  cleanup()
})
