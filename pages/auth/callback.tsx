import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Center, Spinner, VStack, Text, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { Layout } from '../../components/Layout'
import api from '../../lib/api'
import { setAuthCookie, setRefreshCookie } from '../../lib/cookies'


/** Guarda tokens en cookies y redirige al home */
async function saveTokensAndRedirect(
  accessToken: string,
  refreshToken: string | undefined,
  router: any,
  setError: (e: string) => void
): Promise<void> {
  setAuthCookie(accessToken)
  if (refreshToken) {
    setRefreshCookie(refreshToken)
  }
  // Esperar para asegurar que las cookies se escriban
  await new Promise(resolve => setTimeout(resolve, 300))
  const cookiesVerified = document.cookie.includes('auth_token')
  if (cookiesVerified) {
    router.replace('/')
  } else {
    setError('Error al guardar cookies de autenticación. Por favor intenta de nuevo.')
  }
}
export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    const extractTokensFromEncodedData = (encodedData: string) => {
      const decodedData = JSON.parse(atob(encodedData))
      return {
        accessToken: decodedData.accessToken || decodedData.token,
        refreshToken: decodedData.refreshToken
      }
    }

    const exchangeCodeForTokens = async (code: string, state: string) => {
      const { data } = await api.get('/api/auth/kick-callback', {
        params: { code, state }
      })
      return {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken
      }
    }

    const processCallback = async () => {
      if (hasProcessedRef.current) return

      const { code, state, data: encodedData, error: oauthError } = router.query

      if (oauthError) {
        setError(`Error de autorización: ${oauthError}`)
        hasProcessedRef.current = true
        return
      }

      // Si no hay parámetros aún, esperar
      if (!encodedData && !code && !state) return

      hasProcessedRef.current = true

      try {
        let tokens: { accessToken?: string; refreshToken?: string } = {}

        if (encodedData) {
          tokens = extractTokensFromEncodedData(String(encodedData))
        } else if (code && state) {
          tokens = await exchangeCodeForTokens(String(code), String(state))
        }

        if (tokens.accessToken) {
          await saveTokensAndRedirect(tokens.accessToken, tokens.refreshToken, router, setError)
        } else {
          setError('No se recibió token del servidor')
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
