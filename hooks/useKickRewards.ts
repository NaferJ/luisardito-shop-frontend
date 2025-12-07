import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface KickReward {
  id: number
  kick_reward_id: string
  title: string
  description: string | null
  cost: number
  background_color: string
  puntos_a_otorgar: number
  is_enabled: boolean
  is_paused: boolean
  is_user_input_required: boolean
  should_redemptions_skip_request_queue: boolean
  auto_accept: boolean
  total_redemptions: number
  last_synced_at: string
  createdAt: string
  updatedAt: string
}

export interface KickRewardStats {
  total: number
  enabled: number
  disabled: number
  paused: number
  with_user_input: number
  total_redemptions: number
  total_points_configured: number
  most_redeemed: Array<{
    title: string
    total_redemptions: number
    puntos_a_otorgar: number
  }>
}

export function useKickRewards() {
  const [rewards, setRewards] = useState<KickReward[]>([])
  const [stats, setStats] = useState<KickRewardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/kick-admin/kick-rewards')
      
      if (response.data.success) {
        setRewards(response.data.rewards || [])
      } else {
        setError(response.data.message || 'Error al cargar recompensas')
      }
    } catch (err) {
      console.error('Error fetching rewards:', err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Error al cargar recompensas')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/kick-admin/kick-rewards/stats')
      
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const syncFromKick = async () => {
    try {
      const response = await api.post('/api/kick-admin/kick-rewards/sync')
      
      if (response.data.success) {
        await fetchRewards()
        await fetchStats()
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error syncing rewards:', err)
      const error = err as { response?: { data?: { message?: string } } }
      return { success: false, error: error.response?.data?.message || 'Error al sincronizar' }
    }
  }

  const updateRewardPoints = async (id: number, puntos_a_otorgar: number, auto_accept: boolean) => {
    try {
      const response = await api.patch(`/api/kick-admin/kick-rewards/${id}/points`, {
        puntos_a_otorgar,
        auto_accept,
      })
      
      if (response.data.success) {
        await fetchRewards()
        await fetchStats()
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error updating reward points:', err)
      const error = err as { response?: { data?: { message?: string } } }
      return { success: false, error: error.response?.data?.message || 'Error al actualizar' }
    }
  }

  const updateReward = async (id: number, data: Partial<KickReward>) => {
    try {
      const response = await api.patch(`/api/kick-admin/kick-rewards/${id}`, data)
      
      if (response.data.success) {
        await fetchRewards()
        await fetchStats()
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error updating reward:', err)
      const error = err as { response?: { data?: { message?: string } } }
      return { success: false, error: error.response?.data?.message || 'Error al actualizar' }
    }
  }

  const createReward = async (data: {
    title: string
    description?: string
    cost: number
    puntos_a_otorgar: number
    background_color?: string
    is_enabled?: boolean
    is_user_input_required?: boolean
    auto_accept?: boolean
  }) => {
    try {
      const response = await api.post('/api/kick-admin/kick-rewards', data)
      
      if (response.data.success) {
        await fetchRewards()
        await fetchStats()
        return { success: true, reward: response.data.reward }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error creating reward:', err)
      const error = err as { response?: { data?: { message?: string } } }
      return { success: false, error: error.response?.data?.message || 'Error al crear' }
    }
  }

  const deleteReward = async (id: number) => {
    try {
      const response = await api.delete(`/api/kick-admin/kick-rewards/${id}`)
      
      if (response.data.success) {
        await fetchRewards()
        await fetchStats()
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error deleting reward:', err)
      const error = err as { response?: { data?: { message?: string } } }
      return { success: false, error: error.response?.data?.message || 'Error al eliminar' }
    }
  }

  useEffect(() => {
    fetchRewards()
    fetchStats()
  }, [])

  return {
    rewards,
    stats,
    loading,
    error,
    syncFromKick,
    updateRewardPoints,
    updateReward,
    createReward,
    deleteReward,
    refresh: fetchRewards,
  }
}
