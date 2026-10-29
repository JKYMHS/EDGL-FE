import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () =>
      import('@/pages/search-start/search-start-page').then((m) => ({ Component: m.default })),
  },
])
