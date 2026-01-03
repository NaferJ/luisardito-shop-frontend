## Notificaciones - Actualización a React-Query

### Cambios Realizados

#### 1. hooks/useNotificaciones.ts
✅ Convertido a usar react-query (mismo patrón que useCanjes, useProductos, etc.)
✅ Implementados hooks:
  - `useNotificaciones()` - obtiene lista de notificaciones
  - `useNoLeidasCount()` - obtiene contador de no leídas (refetch cada 30s)
  - `useMarcarComoLeida()` - mutation para marcar como leída
  - `useMarcarTodasLeidas()` - mutation para marcar todas
  - `useEliminarNotificacion()` - mutation para eliminar

✅ Usa `api` de `lib/api` correctamente
✅ Auto-invalidación de queries al hacer mutaciones

#### 2. components/NotificationBell.tsx
✅ Actualizado para usar los nuevos hooks
✅ Usa `useQuery` data con defaults:
  - `data: notificaciones = []`
  - `data: noLeidas = 0`
✅ Usa `mutateAsync()` para las acciones
✅ Maneja `isPending` de mutations para loading states
✅ Mantiene la interfaz igual

### Cómo Funciona Ahora

1. **Listar notificaciones**:
   ```typescript
   const { data: notificaciones = [], isLoading } = useNotificaciones()
   ```

2. **Contar no leídas** (actualiza cada 30s):
   ```typescript
   const { data: noLeidas = 0 } = useNoLeidasCount()
   ```

3. **Marcar como leída**:
   ```typescript
   const mutation = useMarcarComoLeida()
   await mutation.mutateAsync(id)
   ```

4. **Auto-invalidación**: Después de cada mutación, react-query invalida las queries relacionadas

### Ventajas de este patrón

✅ Consistente con otros hooks de la app
✅ Manejo automático de cache
✅ Auto-refresh integrado
✅ Loading states automáticos
✅ Error handling centralizado
✅ Deduplicación automática de requests

### Para Testing

1. Intenta marcar una notificación como leída
2. Intenta marcar todas como leídas
3. Intenta eliminar una notificación
4. Verifica que el badge se actualiza automáticamente

Ahora todo debería funcionar sin "Network Error".

