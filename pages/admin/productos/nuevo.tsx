import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { Container, useToast, Center, Spinner } from '@chakra-ui/react'
import { useCreateProducto } from '../../../hooks/useProductosAdmin'
import { useProducto } from '../../../hooks/useProducto'
import { ProductForm } from '../../../components/ProductForm'
import { Producto } from '../../../types'

export default function NuevoProductoPage() {
  const router = useRouter()
  const toast = useToast()
  const createProductoMutation = useCreateProducto()
  const [duplicateData, setDuplicateData] = useState<Producto | undefined>(undefined)
  const [isDuplicating, setIsDuplicating] = useState(false)

  // Check if we're duplicating a product
  const duplicateId = router.query.duplicate as string | undefined
  const { data: productToDuplicate, isLoading: loadingDuplicate } = useProducto(duplicateId || '', {
    enabled: !!duplicateId && router.isReady
  })

  // When product to duplicate is loaded, set it as initial data
  useEffect(() => {
    if (productToDuplicate && duplicateId) {
      setIsDuplicating(true)
      const mockProducto: Producto = {
        ...productToDuplicate,
        id: 0, // Temporary ID for new product
        nombre: `${productToDuplicate.nombre} (Copia)`,
        estado: 'borrador', // Always start as draft when duplicating
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setDuplicateData(mockProducto)
    }
  }, [productToDuplicate, duplicateId])

  const handleSubmit = async (payload: Record<string, unknown>) => {
    try {
      await createProductoMutation.mutateAsync(
        payload as Omit<Producto, 'id' | 'created_at' | 'updated_at'>
      )

      toast({
        title: 'Producto creado',
        description: `Producto "${payload.nombre}" creado exitosamente`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el producto',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      throw error
    }
  }

  // Show loading spinner while loading product to duplicate
  if (duplicateId && loadingDuplicate) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}>
            <Spinner size="xl" />
          </Center>
        </Layout>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <ProductForm
            mode="create"
            initialData={isDuplicating ? duplicateData : undefined}
            onSubmit={handleSubmit}
            isLoading={createProductoMutation.isPending}
          />
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
