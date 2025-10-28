import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'
import { useAuth } from './useAuth'

export function useProductos() {
  const { user } = useAuth()

  // Determinar si el usuario tiene permisos para ver todos los productos
  // Solo streamer (3), developer (4) y moderador (5)
  const canSeeAllProducts = user && [3, 4, 5].includes(user.rol_id)

  return useQuery<Producto[], Error>({
    queryKey: ['productos', canSeeAllProducts ? 'all' : 'public'],
    queryFn: async () => {
      if (canSeeAllProducts) {
        // Para administradores: necesitamos combinar datos para obtener imágenes
        try {
          // Primero obtener la lista completa con IDs
          const debugResponse = await api.get('/api/productos/debug/all')
          const allProductIds = debugResponse.data.productos.map((p: any) => p.id)

          // Luego obtener los productos públicos con datos completos (incluyendo imágenes)
          const publicResponse = await api.get<Producto[]>('/api/productos')
          const publicProducts = publicResponse.data

          // Obtener productos individuales para los que no están en público
          const publicIds = publicProducts.map(p => p.id)
          const missingIds = allProductIds.filter((id: number) => !publicIds.includes(id))

          // Obtener datos completos para productos faltantes
          const missingProducts: Producto[] = []
          for (const id of missingIds) {
            try {
              const productResponse = await api.get<Producto>(`/api/productos/${id}`)
              missingProducts.push(productResponse.data)
            } catch (error) {
              // Si no podemos obtener el producto individual, crear uno básico
              const basicProduct = debugResponse.data.productos.find((p: any) => p.id === id)
              if (basicProduct) {
                missingProducts.push({
                  ...basicProduct,
                  descripcion: basicProduct.descripcion || '',
                  imagen_url: basicProduct.imagen_url || null
                })
              }
            }
          }

          // Combinar todos los productos
          return [...publicProducts, ...missingProducts]

        } catch (error: any) {
          // Si todo falla, al menos devolver los productos públicos
          console.warn('Error obteniendo productos completos para admin, fallback a público:', error)
          const { data } = await api.get<Producto[]>('/api/productos')
          return data
        }
      } else {
        // Si es usuario normal o suscriptor, solo productos publicados
        const { data } = await api.get<Producto[]>('/api/productos')
        return data
      }
    },
    enabled: true
  })
}
