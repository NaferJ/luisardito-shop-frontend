import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'
import { Usuario } from '../types'

interface AuthContextType {
  user: Usuario | null
  token: string | null
  login: (nickname: string, password: string) => Promise<void>
  register: (userData: { nombre: string; email: string; password: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        setToken(savedToken)
        try {
          await fetchUser()
        } catch (error) {
          logout()
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/usuarios/me', { headers: { 'Cache-Control': 'no-cache' } })
      setUser(data)
    } catch (error) {
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      await fetchUser()
    } catch (error) {
      // opcional: manejar error silencioso
    }
  }

  const login = async (nickname: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/login', { nickname, password })
      setToken(data.token)
      setUser(data.usuario)
      localStorage.setItem('auth_token', data.token)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error en el login')
    }
  }

  const register = async (userData: { nombre: string; email: string; password: string }) => {
    try {
      const { data } = await api.post('/api/auth/register', userData)
      setToken(data.token)
      setUser(data.usuario)
      localStorage.setItem('auth_token', data.token)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error en el registro')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isLoading,
        refreshUser
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
