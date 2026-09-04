import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/authStore'

export function RouteGuard({ children }: PropsWithChildren) {
  const status = useAuthStore((state) => state.status)
  if (status === 'loading') return <div className="state-screen">Loading your Amanat...</div>
  if (status === 'signed-out') return <Navigate to="/sign-in" replace />
  return children
}
