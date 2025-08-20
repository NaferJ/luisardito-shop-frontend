import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'

// Hook para crear producto
export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) => {
      const { data } = await api.post('/api/productos', productoData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
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
      queryClient.invalidateQueries({ queryKey: ['productos'] })
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
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })
}
