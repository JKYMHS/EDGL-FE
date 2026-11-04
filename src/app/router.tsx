import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { MainLayout } from './layouts/main-layout'

type PageModule = { default: ComponentType }
const page = (load: () => Promise<PageModule>) => () =>
  load().then((m) => ({ Component: m.default }))

/** 퍼블리싱 확인용 화면 (개발 서버에서만) */
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      { path: '/__screens', lazy: page(() => import('@/pages/dev/screens-page')) },
      { path: '/__design', lazy: page(() => import('@/pages/dev/design-elements-page')) },
    ]
  : []

/** PRD 6.2 · TRD 3장 경로표 */
export const routes: RouteObject[] = [
  {
    HydrateFallback: () => null,
    children: [
      { path: '/', lazy: page(() => import('@/pages/search-start/search-start-page')) },
      { path: '/login', lazy: page(() => import('@/pages/auth/login-page')) },
      { path: '/signup', lazy: page(() => import('@/pages/auth/signup-page')) },
      { path: '/password/reset', lazy: page(() => import('@/pages/auth/password-reset-page')) },
      { path: '/link-account', lazy: page(() => import('@/pages/auth/link-account-page')) },
      { path: '/onboarding', lazy: page(() => import('@/pages/onboarding/onboarding-page')) },
      { path: '/recommend', lazy: page(() => import('@/pages/recommend/recommend-request-page')) },
      {
        element: <MainLayout />,
        children: [
          { path: '/explore', lazy: page(() => import('@/pages/explore/explore-page')) },
          {
            path: '/places/:id',
            lazy: page(() => import('@/pages/place-detail/place-detail-page')),
          },
          { path: '/likes', lazy: page(() => import('@/pages/likes/likes-page')) },
          {
            path: '/recommend/:requestId',
            lazy: page(() => import('@/pages/recommend/recommend-result-page')),
          },
          { path: '/trips', lazy: page(() => import('@/pages/trips/trips-page')) },
          { path: '/trips/:tripId', lazy: page(() => import('@/pages/trips/trip-detail-page')) },
          {
            path: '/trips/:tripId/plans/:planId/edit',
            lazy: page(() => import('@/pages/plan-edit/plan-edit-page')),
          },
          {
            path: '/trips/:tripId/calendar',
            lazy: page(() => import('@/pages/calendar-upload/calendar-upload-page')),
          },
          {
            path: '/my',
            lazy: page(() => import('@/pages/my/my-layout')),
            children: [
              { index: true, element: <Navigate to="/my/preferences" replace /> },
              { path: 'preferences', lazy: page(() => import('@/pages/my/preferences-page')) },
              { path: 'account', lazy: page(() => import('@/pages/my/account-page')) },
              { path: 'calendar', lazy: page(() => import('@/pages/my/calendar-page')) },
              { path: 'password', lazy: page(() => import('@/pages/my/password-page')) },
            ],
          },
        ],
      },
      ...devRoutes,
    ],
  },
]

export const router = createBrowserRouter(routes)
