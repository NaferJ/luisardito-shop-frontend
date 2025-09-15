import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { Center, Spinner } from '@chakra-ui/react'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const isAdmin = user?.rol_id && [3, 4].includes(user.rol_id) // streamer o developer

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace('/') // Redirigir al home si no es admin
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return <Center mt={10}><Spinner size="xl" /></Center>
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}
