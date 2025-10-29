import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useKickAuth } from '../hooks/useKickAuth'
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  Grid,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'

export default function LoginPage() {
  const router = useRouter()
  const { connectWithKick, isLoading: isKickLoading } = useKickAuth()

  const mutedBg = useColorModeValue('black.100', 'black.700')

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
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="md" mb={1}>Inicia sesión en tu cuenta</Heading>
                <Text fontSize="sm" color="black.500">Conecta con tu cuenta de Kick para acceder</Text>
              </Box>

              <VStack spacing={4} align="stretch">
                <Button
                  colorScheme="green"
                  size="lg"
                  w="full"
                  onClick={connectWithKick}
                  isLoading={isKickLoading}
                  borderRadius="xl"
                  py={6}
                  fontSize="md"
                  fontWeight="semibold"
                  _hover={{
                    bg: 'green.400',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(34, 197, 94, 0.4)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  leftIcon={<Image src="/images/logokick.png" alt="Kick logo" boxSize={5} />}
                >
                  Iniciar Sesión con Kick
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Flex>

      {/* Right column: image area */}
      <Box display={{ base: 'none', lg: 'block' }} position="relative" bg={mutedBg}>
        <Image src="/images/login.jpg" alt="Login image" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      </Box>

      {/* Dev login link - solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          position="fixed"
          bottom={4}
          left={4}
          zIndex={1000}
        >
          <Button
            size="xs"
            variant="ghost"
            colorScheme="black"
            opacity={0.3}
            _hover={{ opacity: 1 }}
            onClick={() => router.push('/auth/dev-login')}
          >
            🔧 dev
          </Button>
        </Box>
      )}
    </Grid>
  )
}
