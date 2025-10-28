import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DevPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente al login de desarrollo
    router.replace('/auth/dev-login')
  }, [router])

  return null // No renderizar nada, solo redirigir
}
