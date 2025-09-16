import { useState, FormEvent } from 'react'
import NextLink from 'next/link'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  Grid,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'

export default function RegisterPage() {
  const { register } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await register({ nombre, email, password })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const mutedBg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} minH="100vh">
      {/* Left column: brand + form */}
      <Flex direction="column" gap={4} p={{ base: 6, md: 10 }}>
        <Flex justify={{ base: 'center', md: 'flex-start' }}>
          <ChakraLink as={NextLink} href="#" display="flex" alignItems="center" gap={2} fontWeight="medium">
            <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={6} rounded="md" objectFit="cover" />
            Luisardito Shop
          </ChakraLink>
        </Flex>
        <Flex flex="1" align="center" justify="center">
          <Box w="full" maxW="xs">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Box textAlign="center">
                  <Heading size="md" mb={1}>Crea tu cuenta</Heading>
                  <Text fontSize="sm" color="gray.500">Ingresa tus datos para registrarte</Text>
                </Box>

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Nombre</FormLabel>
                    <Input value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Tu nombre" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@ejemplo.com" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Contraseña</FormLabel>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </FormControl>
                  {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                  <Button type="submit" colorScheme="blue" w="full">Registrarse</Button>
                </VStack>

                <Text textAlign="center" fontSize="sm">
                  ¿Ya tienes una cuenta?{' '}
                  <ChakraLink as={NextLink} href="/login" textDecor="underline" _hover={{ textDecor: 'none' }}>
                    Inicia sesión
                  </ChakraLink>
                </Text>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Flex>

      {/* Right column: image area */}
      <Box display={{ base: 'none', lg: 'block' }} position="relative" bg={mutedBg}>
        <Image src="/images/banner.png" alt="Register image" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      </Box>
    </Grid>
  )
}
