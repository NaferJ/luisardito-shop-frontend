## Problema de Login - Solución

### Causa
El error de login sucedía porque:
1. `.env.local` no estaba configurado
2. `lib/api.ts` tenía puerto 3001 por defecto en lugar de 3000

### Cambios Realizados

#### 1. Creado `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 2. Actualizado `lib/api.ts`
Cambié el puerto por defecto de 3001 a 3000:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
```

#### 3. Mejorado error handling en `hooks/useAuth.tsx`
- Mejor logging con detalles del error
- Muestra status code y datos de respuesta
- Captura múltiples formatos de error

#### 4. Mejorado error handling en `pages/auth/dev-login.tsx`
- Toast con detalles del error
- Logs completos para debugging
- Finally block para limpiar estado

### Qué hacer ahora

1. Asegúrate que el backend está corriendo:
```bash
cd luisardito-shop-backend
npm start
```

2. Inicia el frontend:
```bash
cd luisardito-shop-frontend
npm run dev
```

3. Intenta login nuevamente

### Si sigue fallando

Abre DevTools (F12) → Console y busca logs como:
- `Intentando login con: [nickname]`
- Si falla, verás error detallado con status HTTP

El error típico será 401 (no autorizado) o 400 (datos inválidos).

