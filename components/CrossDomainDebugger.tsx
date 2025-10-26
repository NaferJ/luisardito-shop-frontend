import { useState, useEffect } from 'react'
import { Box, VStack, Text, Badge, Button, useColorModeValue } from '@chakra-ui/react'
import { getAuthCookie, getRefreshCookie, CookieManager } from '../lib/cookies'

export function CrossDomainDebugger() {
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [domain, setDomain] = useState<string>('')
  const [hasLocalStorage, setHasLocalStorage] = useState<boolean>(false)

  const bg = useColorModeValue('gray.50', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthToken(getAuthCookie())
      setRefreshToken(getRefreshCookie())
      setDomain(window.location.hostname)

      // Verificar si hay tokens en localStorage (para migración)
      setHasLocalStorage(!!(
        localStorage.getItem('auth_token') ||
        localStorage.getItem('refresh_token')
      ))
    }
  }, [])

  const handleMigrate = () => {
    CookieManager.migrateFromLocalStorage()
    // Refrescar estado
    setAuthToken(getAuthCookie())
    setRefreshToken(getRefreshCookie())
    setHasLocalStorage(!!(
      localStorage.getItem('auth_token') ||
      localStorage.getItem('refresh_token')
    ))
  }

  const handleRefresh = () => {
    setAuthToken(getAuthCookie())
    setRefreshToken(getRefreshCookie())
  }

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Box
      position="fixed"
      top={4}
      right={4}
      p={4}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      zIndex={9999}
      minW="300px"
      shadow="lg"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontWeight="bold" fontSize="sm">Debug: Cross-Domain Auth</Text>

        <Box>
          <Text fontSize="xs" color="gray.500">Dominio actual:</Text>
          <Badge colorScheme="blue" fontSize="xs">{domain}</Badge>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500">Auth Token (Cookie):</Text>
          <Badge
            colorScheme={authToken ? "green" : "red"}
            fontSize="xs"
            wordBreak="break-all"
          >
            {authToken ? `${authToken.substring(0, 20)}...` : 'No encontrado'}
          </Badge>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500">Refresh Token (Cookie):</Text>
          <Badge
            colorScheme={refreshToken ? "green" : "red"}
            fontSize="xs"
            wordBreak="break-all"
          >
            {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'No encontrado'}
          </Badge>
        </Box>

        {hasLocalStorage && (
          <Box>
            <Text fontSize="xs" color="orange.500">⚠️ Tokens en localStorage</Text>
            <Button size="xs" colorScheme="orange" onClick={handleMigrate}>
              Migrar a Cookies
            </Button>
          </Box>
        )}

        <Button size="xs" onClick={handleRefresh}>
          Actualizar Estado
        </Button>
      </VStack>
    </Box>
  )
}
