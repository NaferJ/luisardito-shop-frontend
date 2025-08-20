import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth.tsx'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
