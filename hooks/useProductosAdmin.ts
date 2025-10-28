import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'

// Hook para obtener todos los productos (incluyendo borradores) - SOLO ADMINISTRADORES
export function useProductosAdmin() {
  return useQuery<{ total: number, productos: Producto[] }, Error>({
    queryKey: ['productos-admin'],
    queryFn: async () => {
      try {
        // Intentar el endpoint de admin primero
        const { data } = await api.get('/api/productos/admin')
        return data
      } catch (error: any) {
        // Si falla (404), usar el endpoint debug como fallback
        if (error?.response?.status === 404) {
          const { data } = await api.get('/api/productos/debug/all')
          return data
        }
        throw error
      }
    }
  })
}

// Hook usando directamente el endpoint debug (más directo)
export function useProductosAdminDebug() {
  return useQuery<{ total: number, productos: Producto[] }, Error>({
    queryKey: ['productos-admin-debug'],
    queryFn: async () => {
      const { data } = await api.get('/api/productos/debug/all')
      return data
    }
  })
}

// Hook para crear producto
export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) => {
      const { data } = await api.post('/api/productos', productoData)
      return data
    },
    onSuccess: () => {
      // Invalidar todas las queries de productos (públicos y admin)
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // Incluye tanto 'public' como 'all'
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin-debug'] })
    }
  })
}

// Hook para actualizar producto
export function useUpdateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, productoData }: { id: number, productoData: Partial<Producto> }) => {
      const { data } = await api.put(`/api/productos/${id}`, productoData)
      return data
    },
    onSuccess: () => {
      // Invalidar todas las queries de productos (públicos y admin)
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // Incluye tanto 'public' como 'all'
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin-debug'] })
    }
  })
}

// Hook para eliminar producto
export function useDeleteProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/api/productos/${id}`)
      return data
    },
    onSuccess: () => {
      // Invalidar todas las queries de productos (públicos y admin)
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // Incluye tanto 'public' como 'all'
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin-debug'] })
    }
  })
}
