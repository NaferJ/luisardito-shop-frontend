import { useState, useEffect } from 'react'
import { kickBroadcasterApi } from '../lib/kickApi'
import { getAuthCookie } from '../lib/cookies'
import type { KickConnectionStatus } from '../types'

export function useKickBroadcaster() {
  const [status, setStatus] = useState<KickConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    // Solo hacer la llamada si hay token de autenticación
    const authToken = getAuthCookie()
    if (!authToken) {
      setStatus({ connected: false })
      setLoading(false)
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data } = await kickBroadcasterApi.getConnectionStatus()
      setStatus(data)
    } catch (err: any) {
      console.warn('Error al cargar estado de Kick broadcaster:', err)

      // Si es 401, no mostrar error y simplemente marcar como desconectado
      if (err.response?.status === 401) {
        setStatus({ connected: false })
        setError(null) // No mostrar error para 401
      } else if (err.response?.status === 404) {
        // Endpoint no existe, marcar como desconectado
        setStatus({ connected: false })
        setError('Endpoint de Kick no disponible')
      } else {
        setError(err.response?.data?.error || 'Error al cargar estado de conexión')
      }
    } finally {
      setLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      setError(null)
      await kickBroadcasterApi.disconnect()
      await fetchStatus()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al desconectar')
      throw err
    }
  }

  useEffect(() => {
    // Solo hacer la llamada si hay un token de autenticación
    const authToken = getAuthCookie()
    if (authToken) {
      fetchStatus()
    } else {
      // Si no hay token, marcar como desconectado sin hacer llamada
      setStatus({ connected: false })
      setLoading(false)
      setError(null)

      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 useKickBroadcaster: No hay token de autenticación, saltando llamada API')
      }
    }
  }, []) // Solo ejecutar una vez al montar

  return {
    status,
    loading,
    error,
    refresh: fetchStatus,
    disconnect,
  }
}
