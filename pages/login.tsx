import { useState, FormEvent } from 'react'
import NextLink from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useKickAuth } from '../hooks/useKickAuth'
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
  Divider,
  HStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'

export default function LoginPage() {
  const { login } = useAuth()
  const { connectWithKick, isLoading: isKickLoading } = useKickAuth()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(nickname, password)
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
                  <Heading size="md" mb={1}>Inicia sesión en tu cuenta</Heading>
                  <Text fontSize="sm" color="gray.500">Ingresa tu nickname para acceder</Text>
                </Box>

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Nickname</FormLabel>
                    <Input value={nickname} onChange={e => setNickname(e.target.value)} required placeholder="tu_nickname" />
                  </FormControl>
                  <FormControl>
                    <HStack justify="space-between" mb={1}>
                      <FormLabel m={0}>Contraseña</FormLabel>
                      <ChakraLink as={NextLink} href="#" fontSize="sm" textDecor="underline" _hover={{ textDecor: 'none' }}>
                        ¿Olvidaste tu contraseña?
                      </ChakraLink>
                    </HStack>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </FormControl>
                  {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                  <Button type="submit" colorScheme="blue" w="full">Entrar</Button>

                  <HStack my={2} align="center" spacing={4}>
                    <Divider />
                    <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">O continuar con</Text>
                    <Divider />
                  </HStack>

                  <Button variant="outline" w="full" onClick={connectWithKick} isLoading={isKickLoading}>
                    Conectar con Kick
                  </Button>
                </VStack>

                <Text textAlign="center" fontSize="sm">
                  ¿No tienes una cuenta?{' '}
                  <ChakraLink as={NextLink} href="/register" textDecor="underline" _hover={{ textDecor: 'none' }}>
                    Regístrate
                  </ChakraLink>
                </Text>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Flex>

      {/* Right column: image area */}
      <Box display={{ base: 'none', lg: 'block' }} position="relative" bg={mutedBg}>
        <Image src="/images/login.jpg" alt="Login image" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      </Box>
    </Grid>
  )
}
