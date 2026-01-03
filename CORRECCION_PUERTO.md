## Corrección de Puerto

### Problema
Cambié el puerto a 3000 por error. El backend corre en puerto 3001.

### Solución
Revertí todos los cambios al puerto correcto (3001):

1. **lib/api.ts** - Vuelto a 3001
   ```typescript
   export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
   ```

2. **.env.local** - Actualizado a 3001
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **hooks/useNotificaciones.ts** - Vuelto a 3001
   ```typescript
   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
   ```

### Para testing
1. Asegúrate que backend está corriendo en puerto 3001: `npm start`
2. Frontend en 3002: `npm run dev`
3. Intenta login nuevamente

El error `net::ERR_CONNECTION_REFUSED` debe desaparecer.

