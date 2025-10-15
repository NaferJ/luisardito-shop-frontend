import axios from 'axios'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor para agregar token automáticamente (solo en cliente)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
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

    // Si no estamos en el cliente, rechazar el error directamente
    if (typeof window === 'undefined') {
      return Promise.reject(error)
    }

    // Si el error es 401 y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        // No hay refresh token, redirigir a login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Intentar refrescar el token
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken } = data

        // Guardar nuevos tokens
        localStorage.setItem('auth_token', accessToken)
        localStorage.setItem('refresh_token', newRefreshToken)

        // Actualizar header del request original
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken

        // Procesar cola de requests fallidos
        processQueue(null, accessToken)

        // Reintentar request original
        return api(originalRequest)
      } catch (refreshError) {
        // Error al refrescar, limpiar y redirigir
        processQueue(refreshError, null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
