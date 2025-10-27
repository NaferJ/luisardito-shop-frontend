import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Container,
  VStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react'

interface RequireAdminProps {
  children: React.ReactNode
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // Si no está autenticado, redirigir al login
      router.push('/login')
    } else if (!isLoading && user && user.rol_id !== 3 && user.rol_id !== 4) {
      // Solo streamer (id: 3) y developer (id: 4) pueden acceder
      router.push('/')
    }
  }, [user, isLoading, router])

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Verificando permisos...</Text>
        </VStack>
      </Container>
    )
  }

  // Si no está autenticado
  if (!user) {
    return (
      <Container maxW="container.md" py={20}>
        <Alert status="warning" borderRadius="xl">
          <AlertIcon />
          <Box>
            <AlertTitle>Acceso no autorizado</AlertTitle>
            <AlertDescription>
              Debes iniciar sesión para acceder a esta página.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    )
  }

  // Si está autenticado pero no es streamer ni developer
  if (user.rol_id !== 3 && user.rol_id !== 4) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            <Box>
            <AlertTitle>Acceso denegado</AlertTitle>
            <AlertDescription>
              Solo el streamer y desarrolladores pueden acceder a esta página.
            </AlertDescription>
            </Box>
          </Alert>
          <Button colorScheme="blue" onClick={() => router.push('/')}>
            Volver al inicio
          </Button>
        </VStack>
      </Container>
    )
  }

  // Si es streamer o developer, mostrar el contenido
  return <>{children}</>
}
