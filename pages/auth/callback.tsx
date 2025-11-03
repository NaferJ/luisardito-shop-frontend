import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Center, Spinner, VStack, Text, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { Layout } from '../../components/Layout'
import api from '../../lib/api'
import { setAuthCookie, setRefreshCookie } from '../../lib/cookies'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessedRef.current) return

      const { code, state, data: encodedData, error: oauthError } = router.query

      // Si hay error de OAuth
      if (oauthError) {
        setError(`Error de autorización: ${oauthError}`)
        hasProcessedRef.current = true
        return
      }

      // Si no hay parámetros aún, esperar
      if (!encodedData && !code && !state) return

      hasProcessedRef.current = true

      try {
        // Caso 1: El backend ya procesó todo y envió los datos codificados
        if (encodedData) {
          const decodedData = JSON.parse(atob(String(encodedData)))

          // Guardar tokens en cookies cross-domain
          if (decodedData.accessToken || decodedData.token) {
            const accessToken = decodedData.accessToken || decodedData.token

            setAuthCookie(accessToken)

            if (decodedData.refreshToken) {
              setRefreshCookie(decodedData.refreshToken)
            }

            // FIX: Esperar un poco más para asegurar que las cookies se escriban
            // Y verificar que realmente se guardaron antes de redirigir
            await new Promise(resolve => setTimeout(resolve, 300))

            const cookiesVerified = document.cookie.includes('auth_token')

            if (cookiesVerified) {
              // Usar router.replace para navegación más controlada
              // Esto previene race conditions con el AuthProvider
              router.replace('/')
            } else {
              // Fallback: Si las cookies no se guardaron, mostrar error
              setError('Error al guardar cookies de autenticación. Por favor intenta de nuevo.')
            }

            return
          } else {
            setError('No se recibió token del servidor')
          }
          return
        }

        // Caso 2: Flujo original - intercambiar code/state por token
        if (code && state) {
          const { data } = await api.get('/api/auth/kick-callback', {
            params: {
              code: String(code),
              state: String(state)
            }
          })

          // Guardar tokens en cookies cross-domain
          if (data.accessToken || data.token) {
            const accessToken = data.accessToken || data.token
            setAuthCookie(accessToken)

            if (data.refreshToken) {
              setRefreshCookie(data.refreshToken)
            }

            // FIX: Esperar y verificar que las cookies se guardaron
            await new Promise(resolve => setTimeout(resolve, 300))

            const cookiesVerified = document.cookie.includes('auth_token')

            if (cookiesVerified) {
              // Usar router.replace para navegación más controlada
              router.replace('/')
            } else {
              setError('Error al guardar cookies de autenticación. Por favor intenta de nuevo.')
            }
          } else {
            setError('No se recibió token del servidor')
          }
        }
      } catch (err: any) {
        console.error('Error procesando callback de Kick:', err)
        setError(err.response?.data?.error || 'Error al procesar la autenticación')
      }
    }

    if (router.isReady) {
      processCallback()
    }
  }, [router.isReady, router.query])

  if (error) {
    return (
      <Layout>
        <Center minH="50vh">
          <VStack spacing={4} maxW="md" textAlign="center">
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>

            <VStack spacing={2}>
              <Text fontSize="sm" color="text.muted">
                Puedes intentar conectar nuevamente o usar el login tradicional.
              </Text>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/login')}
              >
                Ir a Login
              </Button>
            </VStack>
          </VStack>
        </Center>
      </Layout>
    )
  }

  return (
    <Layout>
      <Center minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="accent.fg" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold">
              Conectando con Kick...
            </Text>
            <Text fontSize="sm" color="text.muted">
              Procesando tu autenticación, por favor espera un momento.
            </Text>
          </VStack>
        </VStack>
      </Center>
    </Layout>
  )
}
