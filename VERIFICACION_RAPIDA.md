## Verificación Rápida

### 1. Archivo .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Pasos para Testing
1. Asegúrate que el backend está corriendo en puerto 3000
2. Frontend debe estar en puerto 3002
3. Abre DevTools (F12)
4. Ve a Console
5. Autentícate
6. Haz clic en el icono de campana
7. Verifica los logs en Console (deberías ver "Fetching notificaciones...")

### 3. Si ves "Failed to fetch"
- Verificar que backend está corriendo: `npm start` en backend
- Verificar CORS está habilitado en backend
- Verificar que el URL es correcto: `http://localhost:3000`
- Abrir Network tab en DevTools para ver respuestas HTTP

### 4. Debugging
Todos los endpoints ahora loguean en Console:
- `Fetching notificaciones: ...`
- `Fetching no leídas: ...`
- `Marcando como leída: ...`
- `Eliminando notificación: ...`
- `Marcando todas como leídas: ...`

Busca estos logs para identificar dónde falla.

