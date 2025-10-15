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
      const { data } = await kickSubscriptionApi.getLocalSubscriptions()
      setSubscriptions(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar suscripciones')
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
