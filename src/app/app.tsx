import { RouterProvider } from 'react-router'
import { DesktopOnly } from './desktop-only'
import { router } from './router'

export function App() {
  return (
    <DesktopOnly>
      <RouterProvider router={router} />
    </DesktopOnly>
  )
}
