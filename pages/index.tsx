import { Layout } from '../components/Layout'
import { Heading, Text, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <Layout>
      <VStack spacing={6} align="center" textAlign="center">
        <Heading size="xl" color="purple.600">
          Bienvenido a Luisardito Shop
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Aquí aparecerá el catálogo de productos una vez tengas tu API de productos lista.
        </Text>
      </VStack>
    </Layout>
  )
}
