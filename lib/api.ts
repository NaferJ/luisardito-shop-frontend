import axios from 'axios'
import { getAuthCookie, getRefreshCookie, setAuthCookie, setRefreshCookie, clearAuthCookies } from './cookies'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const api = axios.create({
  baseURL: typeof window === 'undefined' ? API_BASE_URL : '',
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
  private failedQueue: Array<{ resolve: (value: string | null) => void; reject: (reason?: unknown) => void }> = []
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
  addToQueue(resolve: (value: string | null) => void, reject: (reason?: unknown) => void): void {
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
const refreshManager = new RefreshTokenManager()
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    refreshManager.reset()
  })
  if (process.env.NODE_ENV === 'development') {
    (window as any).refreshManager = refreshManager
  }
}
// --- Helpers para reducir complejidad cognitiva del interceptor ---
/** Verifica si una URL pertenece a endpoints de Kick */
function isKickRelatedUrl(url?: string): boolean {
  return !!(url?.includes('/kick') || url?.includes('/kick-admin'))
}
/** Maneja el caso cuando ya se está refrescando: encola el request */
function enqueueFailedRequest(originalRequest: any): Promise<any> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [RefreshManager] Agregando request a la cola, tamaño:', refreshManager.getQueueSize() + 1)
  }
  return new Promise((resolve, reject) => {
    refreshManager.addToQueue(resolve, reject)
  }).then(token => {
    originalRequest.headers['Authorization'] = 'Bearer ' + token
    return api(originalRequest)
  })
}
/** Maneja la ausencia de refresh token */
function handleMissingRefreshToken(originalRequest: any, error: any): never {
  clearAuthCookies()
  refreshManager.reset()
  if (!isKickRelatedUrl(originalRequest?.url) && globalThis.location.pathname !== '/login') {
    globalThis.location.href = '/login'
  }
  throw error
}
/** Intenta refrescar el token y reintentar el request original */
async function attemptTokenRefresh(originalRequest: any, refreshToken: string): Promise<any> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [RefreshManager] Intentando refrescar token...')
  }
  // Relative path -> goes through the Next.js rewrite proxy (same-origin, no CORS).
  // This only runs on the client (the response interceptor throws early on SSR),
  // so a relative URL is safe here.
  const { data } = await axios.post('/api/auth/refresh', { refreshToken })
  const { accessToken, refreshToken: newRefreshToken, expiresIn } = data
  if (!accessToken) {
    throw new Error('No se recibió access token del servidor')
  }
  setAuthCookie(accessToken)
  if (newRefreshToken) {
    setRefreshCookie(newRefreshToken)
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [RefreshManager] Token refrescado exitosamente', {
      hasNewRefreshToken: !!newRefreshToken,
      expiresIn,
      queueSize: refreshManager.getQueueSize()
    })
  }
  originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
  refreshManager.processQueue(null, accessToken)
  return api(originalRequest)
}
/** Maneja el fallo del refresh de token */
function handleRefreshFailure(originalRequest: any, refreshError: any): never {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ [RefreshManager] Error al refrescar token:', {
      error: refreshError.response?.data || refreshError.message,
      status: refreshError.response?.status
    })
  }
  refreshManager.processQueue(refreshError, null)
  clearAuthCookies()
  refreshManager.reset()
  if (!isKickRelatedUrl(originalRequest?.url) && globalThis.location.pathname !== '/login') {
    globalThis.location.href = '/login'
  }
  throw refreshError
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error en API:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
    }
    if (typeof window === 'undefined') {
      throw error
    }
    if (isKickRelatedUrl(originalRequest?.url)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Endpoint de Kick falló, pero no se intentará refresh automático:', originalRequest?.url)
      }
      throw error
    }
    const isUnauthorized = error.response?.status === 401 && !originalRequest._retry
    if (!isUnauthorized) {
      throw error
    }
    if (refreshManager.isCurrentlyRefreshing()) {
      return enqueueFailedRequest(originalRequest)
    }
    originalRequest._retry = true
    refreshManager.setRefreshing(true)
    const refreshToken = getRefreshCookie()
    if (!refreshToken) {
      handleMissingRefreshToken(originalRequest, error)
    }
    try {
      return await attemptTokenRefresh(originalRequest, refreshToken)
    } catch (refreshError: any) {
      handleRefreshFailure(originalRequest, refreshError)
    } finally {
      refreshManager.setRefreshing(false)
    }
  }
)
export default api
