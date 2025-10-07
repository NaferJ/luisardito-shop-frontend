import { useState } from 'react'

export function useKickAuth() {
  const [isLoading, setIsLoading] = useState(false)

  // Iniciar flujo OAuth delegando 100% al backend
  const connectWithKick = async () => {
    try {
      setIsLoading(true)
      const apiBase = process.env.NEXT_PUBLIC_API_URL
      if (!apiBase) {
        console.error('NEXT_PUBLIC_API_URL no está configurado')
        return
      }
      // Redirigimos al endpoint del backend que firma el state y gestiona PKCE
      window.location.href = `${apiBase.replace(/\/$/, '')}/api/auth/kick`
    } catch (error) {
      console.error('Error iniciando flujo OAuth con Kick:', error)
    } finally {
      // No se limpia isLoading aquí porque la navegación reemplazará la página
      // Si falla antes de navegar, mostramos de nuevo el botón
      setIsLoading(false)
    }
  }

  return {
    connectWithKick,
    isLoading,
  }
}
