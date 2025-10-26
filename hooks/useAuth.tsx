import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'
import { Usuario } from '../types'
import {
  getAuthCookie,
  setAuthCookie,
  getRefreshCookie,
  setRefreshCookie,
  clearAuthCookies,
  CookieManager
} from '../lib/cookies'

interface AuthContextType {
  user: Usuario | null
  token: string | null
  login: (nickname: string, password: string) => Promise<void>
  register: (userData: { nombre: string; email: string; password: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUserKickInfo: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      // Primero intentar migrar desde localStorage si existe
      CookieManager.migrateFromLocalStorage()

      // Luego obtener el token desde cookies
      return getAuthCookie()
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Función para refrescar el token proactivamente
  const refreshTokenIfNeeded = async () => {
    const refreshToken = getRefreshCookie()
    if (!refreshToken) return

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Refrescando token proactivamente...')
      }

      const { data } = await api.post('/api/auth/refresh', { refreshToken })

      const accessToken = data.accessToken || data.token
      const newRefreshToken = data.refreshToken

      if (accessToken) {
        setAuthCookie(accessToken)
        setToken(accessToken)

        if (newRefreshToken) {
          setRefreshCookie(newRefreshToken)
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Token refrescado proactivamente')
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al refrescar token proactivamente:', error)
      }
      // Si falla el refresh proactivo, no hacer logout automático
      // Dejar que el interceptor maneje los 401
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getAuthCookie()
      if (savedToken) {
        setToken(savedToken)
        try {
          await fetchUser()
          // Intentar refrescar el token al inicializar
          await refreshTokenIfNeeded()
        } catch (error) {
          logout()
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  // Actualizar información de Kick automáticamente si el usuario está conectado con Kick
  useEffect(() => {
    if (user && user.kick_username && !user.kick_avatar) {
      // Si tiene kick_username pero no kick_avatar, intentar actualizar
      updateUserKickInfo()
    }
  }, [user?.kick_username, user?.kick_avatar])

  // Configurar refresh automático cada 30 minutos
  useEffect(() => {
    if (!token) return

    const interval = setInterval(() => {
      refreshTokenIfNeeded()
    }, 30 * 60 * 1000) // 30 minutos

    return () => clearInterval(interval)
  }, [token])

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/usuarios/me')
      setUser(data)
    } catch (error) {
      throw error
    }
  }

  // Función para actualizar la información del usuario incluyendo avatar de Kick
  const updateUserKickInfo = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Sincronizando información de Kick...')
      }

      // Llamar al endpoint que sincroniza la info de Kick con Cloudinary
      const response = await api.post('/api/usuarios/sync-kick-info')

      // Actualizar el estado del usuario con los datos sincronizados
      if (response.data) {
        setUser(response.data)
      } else {
        // Si no hay datos en la respuesta, refrescar manualmente
        await fetchUser()
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Información de Kick sincronizada exitosamente')
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al sincronizar información de Kick:', error)
      }
      throw error
    }
  }

  const login = async (nickname: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/login', { nickname, password })

      // El backend ahora devuelve accessToken y refreshToken
      const accessToken = data.accessToken || data.token
      const refreshToken = data.refreshToken
      const expiresIn = data.expiresIn

      if (process.env.NODE_ENV === 'development') {
        console.log('Login exitoso:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          expiresIn
        })
      }

      setToken(accessToken)
      setUser(data.user || data.usuario)

      // Guardar tokens en cookies cross-domain
      setAuthCookie(accessToken)
      if (refreshToken) {
        setRefreshCookie(refreshToken)
        if (process.env.NODE_ENV === 'development') {
          console.log('Refresh token guardado en cookies')
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('No se recibió refresh token del backend')
      }

      router.push('/')
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en login:', error.response?.data)
      }
      throw new Error(error.response?.data?.error || 'Error en el login')
    }
  }

  const register = async (userData: { nombre: string; email: string; password: string }) => {
    try {
      // Mapear el campo de UI "nombre" al campo que espera el backend: "nickname"
      const payload = {
        nickname: userData.nombre,
        email: userData.email,
        password: userData.password,
      }
      const { data } = await api.post('/api/auth/register', payload)

      // El backend ahora devuelve accessToken y refreshToken
      const accessToken = data.accessToken || data.token
      const refreshToken = data.refreshToken

      setToken(accessToken)
      setUser(data.user || data.usuario)

      // Guardar tokens en cookies cross-domain
      setAuthCookie(accessToken)
      if (refreshToken) {
        setRefreshCookie(refreshToken)
      }

      router.push('/')
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error en el registro')
    }
  }

  const logout = async () => {
    try {
      const refreshToken = getRefreshCookie()
      if (refreshToken) {
        // Llamar al endpoint de logout para revocar el refresh token
        await api.post('/api/auth/logout', { refreshToken }).catch(() => {
          // Ignorar errores del logout en el backend
        })
      }
    } finally {
      setToken(null)
      setUser(null)
      clearAuthCookies()
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshUser: fetchUser,
        updateUserKickInfo,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
