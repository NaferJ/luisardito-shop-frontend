import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface BroadcasterStream {
  is_live: boolean
  status: 'online' | 'offline' | 'unknown'
  title: string | null
  category: string | null
  category_id: number | null
  language: string
  has_mature_content: boolean
  started_at: string | null
  uptime_minutes: number | null
  last_live_ago: string | null
}

export interface BroadcasterMetadata {
  last_status_update: string | null
  last_metadata_update: string | null
  data_updated_at: string
}

export interface BroadcasterInfo {
  username: string
  user_id: string
  profile_picture: string
  channel_url: string
  is_verified: boolean
  stream: BroadcasterStream
  metadata: BroadcasterMetadata
}

interface UseBroadcasterInfoReturn {
  broadcasterInfo: BroadcasterInfo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook personalizado para obtener información del broadcaster principal
 * Incluye polling automático para actualizar el estado en tiempo real
 * 
 * @param pollInterval - Intervalo de polling en milisegundos (default: 30000ms = 30s)
 * @param enabled - Si el polling está activo (default: true)
 */
export function useBroadcasterInfo(
  pollInterval: number = 30000,
  enabled: boolean = true
): UseBroadcasterInfoReturn {
  const [broadcasterInfo, setBroadcasterInfo] = useState<BroadcasterInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBroadcasterInfo = async () => {
    try {
      const response = await api.get('/api/broadcaster/info')
      
      if (response.data.success) {
        setBroadcasterInfo(response.data.data)
        setError(null)
      } else {
        setError('No se pudo obtener la información del broadcaster')
      }
    } catch (err) {
      console.error('Error obteniendo broadcaster info:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    // Fetch inicial
    fetchBroadcasterInfo()

    // Polling
    const interval = setInterval(fetchBroadcasterInfo, pollInterval)

    return () => clearInterval(interval)
  }, [pollInterval, enabled])

  return {
    broadcasterInfo,
    loading,
    error,
    refetch: fetchBroadcasterInfo
  }
}
