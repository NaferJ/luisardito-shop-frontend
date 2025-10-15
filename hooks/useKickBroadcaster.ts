import { useState, useEffect } from 'react'
import { kickBroadcasterApi } from '../lib/kickApi'
import type { KickConnectionStatus } from '../types'

export function useKickBroadcaster() {
  const [status, setStatus] = useState<KickConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await kickBroadcasterApi.getConnectionStatus()
      setStatus(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar estado de conexión')
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
    fetchStatus()
  }, [])

  return {
    status,
    loading,
    error,
    refresh: fetchStatus,
    disconnect,
  }
}
