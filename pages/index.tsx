import { Layout } from '../components/Layout'
import { SimpleGrid, Spinner, Center } from '@chakra-ui/react'
import { useProductos } from '../hooks/useProductos'
import { ProductCard } from '../components/ProductCard'

export default function Home() {
  const { data: productos, isLoading, error } = useProductos()

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
      <SimpleGrid columns={[1, 2, 3]} spacing={4} p={4}>
        {productos?.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}
