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
          // Solo validar que el token funcione obteniendo el usuario
          await fetchUser()

          // FIX: NO hacer refresh proactivo aquí
          // Si el token es nuevo (del callback de OAuth), puede no estar listo en el backend
          // El interceptor se encargará de refrescar cuando expire naturalmente

        } catch (error) {
          // FIX: Si falla fetchUser, intentar recuperar antes de hacer logout
          // El token podría estar válido pero el backend temporalmente no responde
          const refreshToken = getRefreshCookie()

          if (refreshToken) {
            try {
              if (process.env.NODE_ENV === 'development') {
                console.log('🔄 [Auth] fetchUser falló, intentando recuperar con refresh token...')
              }

              const { data } = await api.post('/api/auth/refresh', { refreshToken })
              const accessToken = data.accessToken || data.token

              if (accessToken) {
                setAuthCookie(accessToken)
                setToken(accessToken)

                if (data.refreshToken) {
                  setRefreshCookie(data.refreshToken)
                }

                // Reintentar fetchUser
                try {
                  await fetchUser()
                  if (process.env.NODE_ENV === 'development') {
                    console.log('✅ [Auth] Recuperación exitosa')
                  }
                } catch (retryError) {
                  // Si aún falla después del refresh, entonces sí hacer logout
                  if (process.env.NODE_ENV === 'development') {
                    console.error('❌ [Auth] fetchUser falló después de refresh, haciendo logout')
                  }
                  logout()
                }
              }
            } catch (refreshError) {
              // El refresh falló, hacer logout
              if (process.env.NODE_ENV === 'development') {
                console.error('❌ [Auth] Refresh falló en initAuth, haciendo logout')
              }
              logout()
            }
          } else {
            // No hay refresh token, logout directo
            logout()
          }
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

  // FIX: Detectar cambios en cookies (para cuando callback.tsx setea cookies)
  // Esto previene race conditions eliminando la necesidad de window.location.href
  useEffect(() => {
    const checkCookieChange = setInterval(() => {
      const currentToken = getAuthCookie()

      // Si hay un token nuevo diferente al actual, actualizar
      if (currentToken && currentToken !== token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [Auth] Nuevo token detectado en cookies, actualizando...')
        }
        setToken(currentToken)

        // Intentar cargar el usuario con el nuevo token
        fetchUser().catch(() => {
          // Si falla, dejar que el interceptor maneje
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ [Auth] fetchUser falló con nuevo token, el interceptor lo manejará')
          }
        })
      }
    }, 500) // Check cada 500ms

    return () => clearInterval(checkCookieChange)
  }, [token])

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
      const user = data.user || data.usuario

      if (!accessToken) {
        throw new Error('No se recibió token de acceso del servidor')
      }

      // Guardar tokens en cookies cross-domain PRIMERO
      setAuthCookie(accessToken)
      if (refreshToken) {
        setRefreshCookie(refreshToken)
      }

      // Luego actualizar estado
      setToken(accessToken)
      setUser(user)


    } catch (error: any) {
      console.error('Error en login:', error.response?.data || error.message)
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
