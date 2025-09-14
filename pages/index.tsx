import { Layout } from '../components/Layout'
import { SimpleGrid, Spinner, Center, Box, HStack, Text, Button } from '@chakra-ui/react'
import { useProductos } from '../hooks/useProductos'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../hooks/useAuth.tsx'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Home() {
  const { data: productos, isLoading, error } = useProductos()
  const { user } = useAuth()
  const router = useRouter()

  const isAdmin = !!(user?.rol_id && [3, 4, 5].includes(user.rol_id))

  if (isLoading) {
    return (
      <Layout>
        <Center mt={10}><Spinner size="xl" /></Center>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Center mt={10}>Error al cargar productos.</Center>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Banner de modo administrador */}
      {isAdmin && (
        <Box mb={6} p={4} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontWeight="bold" color="blue.800">
                🔧 Modo Administrador
              </Text>
              <Text fontSize="sm" color="blue.600">
                Puedes editar, eliminar y crear productos desde esta vista
              </Text>
            </Box>
            <HStack spacing={2}>
              <Link href="/admin/productos/nuevo" passHref>
                <Button colorScheme="teal" size="sm">
                  + Nuevo Producto
                </Button>
              </Link>
              <Link href="/admin/productos" passHref>
                <Button colorScheme="blue" variant="outline" size="sm">
                  Vista Tabla
                </Button>
              </Link>
              <Link href="/admin/usuarios" passHref>
                <Button colorScheme="purple" variant="outline" size="sm">
                  Usuarios
                </Button>
              </Link>
              <Link href="/admin/canjes" passHref>
                <Button colorScheme="orange" variant="outline" size="sm">
                  Canjes
                </Button>
              </Link>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Grid de productos */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4} p={4}>
        {productos?.map(producto => (
          <ProductCard 
            key={producto.id} 
            producto={producto} 
            isAdmin={isAdmin}
          />
        ))}
      </SimpleGrid>
    </Layout>
  )
}
