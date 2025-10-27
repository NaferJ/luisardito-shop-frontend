import NextLink from 'next/link'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { ArrowBackIcon } from '@chakra-ui/icons'

export default function Custom404() {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, gray.800)'
  )
  const cardBg = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Layout>
      <Box
        minH="70vh"
        bgGradient={bgGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={20}
      >
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            {/* Logo o imagen */}
            <Box>
              <Image
                src="/images/logo2.jpg"
                alt="Luisardito Shop"
                boxSize={20}
                borderRadius="xl"
                shadow="lg"
                mb={4}
              />
            </Box>

            {/* Contenido principal */}
            <Box
              bg={cardBg}
              p={10}
              borderRadius="2xl"
              shadow="xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <VStack spacing={6}>
                <Box>
                  <Heading
                    size="2xl"
                    mb={2}
                    bgGradient="linear(to-r, red.400, orange.400)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    404
                  </Heading>
                  <Heading size="lg" mb={3} color={useColorModeValue('gray.800', 'gray.100')}>
                    Página no encontrada
                  </Heading>
                  <Text fontSize="lg" color={textColor} maxW="md">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                  </Text>
                </Box>

                {/* Botones de acción */}
                <HStack spacing={4} pt={4}>
                  <Button
                    as={NextLink}
                    href="/"
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    🏠 Ir al inicio
                  </Button>
                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    borderRadius="xl"
                    leftIcon={<ArrowBackIcon />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                  >
                    Volver atrás
                  </Button>
                </HStack>

                {/* Enlaces útiles */}
                <Box pt={6} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                  <Text fontSize="sm" color={textColor} mb={3}>
                    ¿Necesitas ayuda? Prueba estos enlaces:
                  </Text>
                  <HStack spacing={4} justify="center" wrap="wrap">
                    <Button
                      as={NextLink}
                      href="/productos"
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                    >
                      Ver Productos
                    </Button>
                    <Button
                      as={NextLink}
                      href="/canjes"
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                    >
                      Ver Canjes
                    </Button>
                    <Button
                      as={NextLink}
                      href="/historial"
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                    >
                      Mi Historial
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            {/* Mensaje adicional */}
            <Text fontSize="sm" color={textColor} fontStyle="italic">
              Si crees que esto es un error, por favor contacta al administrador.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Layout>
  )
}
