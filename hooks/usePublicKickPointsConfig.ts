import { useState, useEffect } from 'react'
import { KickPointsConfig } from '../types'
import { kickPointsConfigApi } from '../lib/kickApi'

export const usePublicKickPointsConfig = () => {
  const [configs, setConfigs] = useState<KickPointsConfig[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      setError(null)
      // Use the public endpoint
      const response = await kickPointsConfigApi.getConfig()

      // Logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Public points config response:', {
          status: response.status,
          data: response.data,
          hasConfigArray: response.data && Array.isArray(response.data.config),
          configLength: response.data?.config?.length || 'N/A',
          total: response.data?.total,
          initialized: response.data?.initialized
        })
      }

      // Extract the config array
      if (response.data && response.data.config && Array.isArray(response.data.config)) {
        setConfigs(response.data.config)
      } else if (Array.isArray(response.data)) {
        setConfigs(response.data)
      } else {
        console.warn('Unexpected response structure:', response.data)
        setConfigs([])
      }
    } catch (err: any) {
      console.warn('Error loading public points config:', err)
      setError(err.response?.data?.message || 'Error loading points config')
      // For public access, set empty array on error
      setConfigs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  return {
    configs,
    loading,
    error,
    refetch: fetchConfigs
  }
}
