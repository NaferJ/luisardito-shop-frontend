import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  useToast,
  Badge,
  Divider,
  HStack,
  Image,
  useColorModeValue,
  Link as ChakraLink,
  Grid,
  Flex,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../hooks/useAuth'

export default function DevLoginPage() {
  const { login } = useAuth()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const mutedBg = useColorModeValue('black.100', 'black.700')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nickname || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(nickname, password)

      // Esperar un momento para que se guarden las cookies
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Login exitoso',
        description: `Bienvenido ${nickname}`,
        status: 'success',
        duration: 2000,
      })

      // Forzar redirección completa
      window.location.href = '/'

    } catch (err: any) {
      console.error('Error en login dev:', err)
      setError(err.message || 'Error de autenticación')
      toast({
        title: 'Error de login',
        description: err.message || 'Error de autenticación',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} minH="100vh">
      {/* Left column: brand + form */}
      <Flex direction="column" gap={4} p={{ base: 6, md: 10 }}>
        {/* Header con badge de desarrollo */}
        <VStack spacing={4}>
          <Flex justify={{ base: 'center', md: 'flex-start' }} w="full">
            <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" gap={2} fontWeight="medium">
              <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={6} rounded="md" objectFit="cover" />
              Luisardito Shop
            </ChakraLink>
          </Flex>

          <Badge colorScheme="red" fontSize="md" px={4} py={2} borderRadius="full">
            🔧 MODO DESARROLLO
          </Badge>
        </VStack>

        <Flex flex="1" align="center" justify="center">
          <Box w="full" maxW="xs">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Box textAlign="center">
                  <Heading size="md" mb={1}>Login de Desarrollo</Heading>
                  <Text fontSize="sm" color="black.500">Ingresa tu nickname y contraseña</Text>
                </Box>

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Nickname</FormLabel>
                    <Input
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      required
                      placeholder="tu_nickname"
                      size="lg"
                      borderRadius="xl"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      size="lg"
                      borderRadius="xl"
                    />
                  </FormControl>

                  {error && (
                    <Alert status="error" borderRadius="xl">
                      <AlertIcon />
                      <Text fontSize="sm">{error}</Text>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    size="lg"
                    borderRadius="xl"
                    py={6}
                    fontSize="md"
                    fontWeight="semibold"
                    isLoading={loading}
                    loadingText="Iniciando sesión..."
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'lg'
                    }}
                  >
                    Entrar (DEV)
                  </Button>

                  <Divider />

                  {/* Enlaces útiles */}
                  <VStack spacing={2}>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => router.push('/login')}
                      size="sm"
                    >
                      → Login normal (Kick OAuth)
                    </Button>
                    <Button
                      variant="link"
                      colorScheme="black"
                      onClick={() => router.push('/')}
                      size="sm"
                    >
                      → Página principal
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </form>
          </Box>
        </Flex>

        {/* Advertencia en la parte inferior */}
        <Alert status="warning" borderRadius="xl" size="sm">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="sm">Solo para desarrollo</Text>
            <Text fontSize="xs">
              Esta página usa el login tradicional con nickname/contraseña.
            </Text>
          </VStack>
        </Alert>
      </Flex>

      {/* Right column: image area */}
      <Box display={{ base: 'none', lg: 'block' }} position="relative" bg={mutedBg}>
        <Image src="/images/login.jpg" alt="Login image" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      </Box>
    </Grid>
  )
}
