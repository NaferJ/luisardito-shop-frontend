import { useRouter } from 'next/router'
import { Layout } from '../../../../components/Layout'
import { RequireAdmin } from '../../../../components/RequireAdmin'
import { Container, useToast, Center, Spinner, Text, VStack, Button } from '@chakra-ui/react'
import { useProducto } from '../../../../hooks/useProducto'
import { useUpdateProducto } from '../../../../hooks/useProductosAdmin'
import { ProductForm } from '../../../../components/ProductForm'
import api from '../../../../lib/api'
import { useQueryClient } from '@tanstack/react-query'

export default function EditarProductoPage() {
  const router = useRouter()
  const { id } = router.query
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: producto, isLoading: loadingProducto, error } = useProducto(id as string)
  const updateProductoMutation = useUpdateProducto()

  const handleSubmit = async (payload: Record<string, unknown>) => {
    try {
      // Extraer promocion_ids antes de actualizar el producto
      const promocionIds = payload.promocion_ids as number[] | undefined
      const productoData = { ...payload }
      delete productoData.promocion_ids
      
      // 1. Actualizar el producto
      await updateProductoMutation.mutateAsync({
        id: producto!.id,
        productoData
      })
      
      // 2. Actualizar promociones si se proporcionaron
      if (promocionIds !== undefined) {
        await api.put(`/api/productos/${producto!.id}/promociones`, {
          promocion_ids: promocionIds
        })
      }
      
      // 3. Invalidar queries para recargar datos actualizados
      // Invalidar TODAS las queries relacionadas con productos
      await queryClient.invalidateQueries({ queryKey: ['producto'] })
      await queryClient.invalidateQueries({ queryKey: ['productos'] })
      await queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      await queryClient.invalidateQueries({ queryKey: ['productos-admin-debug'] })
      
      // Forzar refetch inmediato
      await queryClient.refetchQueries({ queryKey: ['productos'] })
      await queryClient.refetchQueries({ queryKey: ['productos-admin'] })

      toast({
        title: 'Producto actualizado',
        description: `Producto "${payload.nombre}" actualizado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      // Pequeño delay para asegurar que las queries se actualicen antes de navegar
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      throw error
    }
  }

  if (loadingProducto) {
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

  if (error || !producto) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="red.500">
                Producto no encontrado
              </Text>
              <Button onClick={() => router.push('/')}>Volver al catálogo</Button>
            </VStack>
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
            mode="edit"
            initialData={producto}
            onSubmit={handleSubmit}
            isLoading={updateProductoMutation.isPending}
          />
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
