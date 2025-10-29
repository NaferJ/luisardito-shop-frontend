import { Box, Container, VStack, Heading, Text, Button, Icon } from '@chakra-ui/react'
import { MdHome } from 'react-icons/md'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'

export default function Custom404() {
  const router = useRouter()

  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} textAlign="center">
          <VStack spacing={4}>
            <Text fontSize="8xl" fontWeight="bold" color="black.300">
              404
            </Text>
            <Heading size="xl" color="black.700">
              Página no encontrada
            </Heading>
            <Text fontSize="lg" color="black.600" maxW="md">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </Text>
          </VStack>

          <Button
            leftIcon={<Icon as={MdHome} />}
            colorScheme="purple"
            size="lg"
            onClick={() => router.push('/')}
            borderRadius="xl"
            px={8}
            py={6}
            fontSize="md"
            fontWeight="semibold"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
          >
            Volver al inicio
          </Button>
        </VStack>
      </Container>
    </Layout>
  )
}
