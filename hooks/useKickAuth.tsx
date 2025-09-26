import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './useAuth'
import api from '../lib/api'

export function useKickAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Generar code_verifier y code_challenge para PKCE
  const generatePKCE = () => {
    // 1. Generar code_verifier aleatorio
    const codeVerifier = generateRandomString(128)

    // 2. Crear code_challenge usando SHA256
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)

    return crypto.subtle.digest('SHA-256', data).then(hash => {
      const codeChallenge = base64URLEncode(hash)
      return { codeVerifier, codeChallenge }
    })
  }

  // Generar URL de autorización de Kick con PKCE
  const getKickAuthUrl = async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE()
    const state = generateRandomState()

    // Guardar code_verifier para el callback
    localStorage.setItem('kick_code_verifier', codeVerifier)
    localStorage.setItem('kick_oauth_state', state)

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_KICK_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
      scope: process.env.NEXT_PUBLIC_KICK_SCOPE || 'user:read'
    })

    return `${process.env.NEXT_PUBLIC_KICK_OAUTH_URL}?${params.toString()}`
  }

  // Intercambiar código por token con PKCE (token exchange desde el frontend)
  const handleKickCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true)

    try {
      // Verificar state para seguridad
      const savedState = localStorage.getItem('kick_oauth_state')
      if (savedState !== state) {
        throw new Error('Estado OAuth inválido')
      }

      // Obtener code_verifier guardado
      const codeVerifier = localStorage.getItem('kick_code_verifier')
      if (!codeVerifier) {
        throw new Error('Code verifier no encontrado')
      }

      // Token exchange vía backend para evitar CORS y bloqueos de Cloudflare
      const response = await api.post('/api/auth/kick-callback', {
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        code_verifier: codeVerifier
      })

      const { token, usuario, isNewUser } = response.data

      // Usar el hook de auth existente para establecer la sesión
      localStorage.setItem('auth_token', token)

      // Redireccionar con mensaje apropiado
      if (isNewUser) {
        router.push('/?welcome=true')
      } else {
        router.push('/?login=kick')
      }

      return { success: true, isNewUser }
    } catch (error: any) {
      console.error('Error en callback de Kick:', error)
      const msg = error?.message || error?.response?.data?.error || 'Error al conectar con Kick'
      throw new Error(msg)
    } finally {
      setIsLoading(false)
      // Limpiar estado temporal
      localStorage.removeItem('kick_oauth_state')
      localStorage.removeItem('kick_code_verifier')
    }
  }, [router])

  // Iniciar flujo OAuth con PKCE
  const connectWithKick = async () => {
    try {
      // LÍNEA TEMPORAL PARA DEBUG - REMOVER DESPUÉS
      console.log('Variables de entorno:', {
        clientId: process.env.NEXT_PUBLIC_KICK_CLIENT_ID,
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        oauthUrl: process.env.NEXT_PUBLIC_KICK_OAUTH_URL,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      })

      const authUrl = await getKickAuthUrl()

      // LÍNEA TEMPORAL PARA DEBUG - REMOVER DESPUÉS  
      console.log('URL generada con PKCE:', authUrl)

      window.location.href = authUrl
    } catch (error) {
      console.error('Error al generar URL de autorización:', error)
    }
  }

  return {
    connectWithKick,
    handleKickCallback,
    isLoading,
    getKickAuthUrl
  }
}

// Función helper para generar estado aleatorio
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Función helper para generar string aleatorio
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

// Función helper para codificar en base64URL
function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
