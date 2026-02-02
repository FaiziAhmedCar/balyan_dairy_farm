'use client'

import { useAuth } from '../contexts/AuthContext'
import Login from './Login'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  return <>{children}</>
}
