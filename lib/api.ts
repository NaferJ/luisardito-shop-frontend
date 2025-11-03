import axios from 'axios'
import { getAuthCookie, getRefreshCookie, setAuthCookie, setRefreshCookie, clearAuthCookies } from './cookies'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Gestor de refresh de tokens con estado encapsulado
 * Previene problemas de estado global entre navegaciones
 */
class RefreshTokenManager {
  private isRefreshing: boolean = false
  private failedQueue: Array<{ resolve: Function; reject: Function }> = []

  /**
   * Resetea el estado del manager
   * Útil para limpiar estado corrupto
   */
  reset(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 [RefreshManager] Reseteando estado')
    }
    this.isRefreshing = false
    this.failedQueue = []
  }

  setRefreshing(value: boolean): void {
    this.isRefreshing = value
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing
  }

  addToQueue(resolve: Function, reject: Function): void {
    this.failedQueue.push({ resolve, reject })
  }

  processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedQueue = []
  }

  getQueueSize(): number {
    return this.failedQueue.length
  }
}

// Instancia única del manager
const refreshManager = new RefreshTokenManager()

// Resetear el manager en navegación del navegador (back/forward)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    refreshManager.reset()
  })

  // También exponer globalmente para debugging en desarrollo
  if (process.env.NODE_ENV === 'development') {
    (window as any).refreshManager = refreshManager
  }
}

// Interceptor para agregar token automáticamente (solo en cliente)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAuthCookie()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para manejar respuestas y errores con auto-refresh
api.interceptors.response.use(
  (response) => {
    // Validar que la respuesta tenga el formato esperado
    if (response.data && typeof response.data === 'object') {
      return response
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log del error solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error en API:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
    }

    // Si no estamos en el cliente, rechazar el error directamente
    if (typeof window === 'undefined') {
      return Promise.reject(error)
    }

    // Para endpoints de Kick, no hacer refresh automático - simplemente devolver el error
    const isKickEndpoint = originalRequest?.url?.includes('/kick') ||
                          originalRequest?.url?.includes('/kick-admin')

    if (isKickEndpoint) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Endpoint de Kick falló, pero no se intentará refresh automático:', originalRequest?.url)
      }
      return Promise.reject(error)
    }

    // Si el error es 401 y no hemos intentado refrescar (solo para endpoints normales)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshManager.isCurrentlyRefreshing()) {
        // Si ya se está refrescando, agregar a la cola
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [RefreshManager] Agregando request a la cola, tamaño:', refreshManager.getQueueSize() + 1)
        }
        return new Promise((resolve, reject) => {
          refreshManager.addToQueue(resolve, reject)
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      refreshManager.setRefreshing(true)

      const refreshToken = getRefreshCookie()

      if (!refreshToken) {
        // No hay refresh token
        clearAuthCookies()
        refreshManager.reset()

        // No redirigir automáticamente si es un endpoint de kick-admin o kick/broadcaster
        // ya que pueden no estar disponibles en el backend
        const isKickEndpoint = originalRequest?.url?.includes('/kick') ||
                              originalRequest?.url?.includes('/kick-admin')

        if (!isKickEndpoint && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        // Intentar refrescar el token
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [RefreshManager] Intentando refrescar token...')
        }

        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken, expiresIn } = data

        if (!accessToken) {
          throw new Error('No se recibió access token del servidor')
        }

        // Guardar nuevos tokens en cookies
        setAuthCookie(accessToken)
        if (newRefreshToken) {
          setRefreshCookie(newRefreshToken)
        }

        // Log para debugging solo en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [RefreshManager] Token refrescado exitosamente', {
            hasNewRefreshToken: !!newRefreshToken,
            expiresIn,
            queueSize: refreshManager.getQueueSize()
          })
        }

        // Actualizar header del request original
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken

        // Procesar cola de requests fallidos
        refreshManager.processQueue(null, accessToken)

        // Reintentar request original
        return api(originalRequest)
      } catch (refreshError: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ [RefreshManager] Error al refrescar token:', {
            error: refreshError.response?.data || refreshError.message,
            status: refreshError.response?.status
          })
        }

        // Error al refrescar, limpiar cookies y redirigir
        refreshManager.processQueue(refreshError, null)
        clearAuthCookies()
        refreshManager.reset()

        // No redirigir automáticamente si es un endpoint de kick
        const isKickEndpoint = originalRequest?.url?.includes('/kick') ||
                              originalRequest?.url?.includes('/kick-admin')

        // Solo redirigir si no estamos ya en login y no es un endpoint de Kick
        if (!isKickEndpoint && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        refreshManager.setRefreshing(false)
      }
    }

    return Promise.reject(error)
  }
)

export default api
