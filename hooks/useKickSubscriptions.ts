import { useState, useEffect } from 'react'
import { kickSubscriptionApi } from '../lib/kickApi'
import type { KickSubscription } from '../types'

export function useKickSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<KickSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await kickSubscriptionApi.getLocalSubscriptions()

      // Validar que la respuesta tenga el formato esperado
      const data = response.data
      console.log('Datos recibidos de suscripciones:', data)

      if (Array.isArray(data)) {
        // Validar cada elemento del array
        const validData = data.filter((item: any) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.event_type === 'string' &&
          typeof item.broadcaster_user_id === 'string' &&
          typeof item.status === 'string'
        )
        setSubscriptions(validData)
      } else if (data && Array.isArray(data.data)) {
        const validData = data.data.filter((item: any) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.event_type === 'string' &&
          typeof item.broadcaster_user_id === 'string' &&
          typeof item.status === 'string'
        )
        setSubscriptions(validData)
      } else {
        console.warn('Formato inesperado de datos de suscripciones:', data)
        setSubscriptions([])
        setError('Formato de datos no válido recibido del servidor')
      }
    } catch (err: any) {
      console.error('Error al cargar suscripciones:', err)
      setError(err.response?.data?.error || err.message || 'Error al cargar suscripciones')
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const createSubscriptions = async (
    broadcasterUserId: string | number,
    events: Array<{ name: string; version: number }>
  ) => {
    try {
      setError(null)
      await kickSubscriptionApi.createSubscriptions({
        broadcaster_user_id: broadcasterUserId,
        events,
      })
      await fetchSubscriptions()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear suscripciones')
      throw err
    }
  }

  const deleteSubscriptions = async (subscriptionIds: string[]) => {
    try {
      setError(null)
      await kickSubscriptionApi.deleteSubscriptions(subscriptionIds)
      await fetchSubscriptions()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar suscripciones')
      throw err
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return {
    subscriptions,
    loading,
    error,
    refresh: fetchSubscriptions,
    createSubscriptions,
    deleteSubscriptions,
  }
}
