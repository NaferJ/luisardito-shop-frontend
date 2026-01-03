# 📬 Sistema de Notificaciones - Frontend

## ⚡ Quick Start

El sistema de notificaciones está **100% integrado** en el frontend. 

### ✅ Lo que se incluye:

1. **Hook `useNotificaciones`** - Gestión completa de notificaciones
2. **Modal `NotificacionesModal`** - Interfaz elegante para ver notificaciones
3. **Componente `NotificationBell`** - Icono campana con badge en la navbar
4. **Integración en `NavbarContent`** - Ya está conectado

---

## 🚀 Para Empezar

### Paso 1: Verificar Importes
El archivo `components/NavbarContent.tsx` ya tiene:
```typescript
import { NotificationBell } from './NotificationBell'
```

### Paso 2: Verificar Ubicación del Bell
En NavbarContent ya está integrado en la sección derecha:
```typescriptreact
{/* Notificaciones Bell - A la derecha del perfil */}
{isAuthenticated && (
  <Box flexShrink={0} display={{ base: 'none', lg: 'block' }}>
    <NotificationBell />
  </Box>
)}
```

### Paso 3: Verificar API
Asegúrate de que tienes la variable de entorno:

En `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
# O tu URL de producción
```

### Paso 4: Iniciar el Servidor
```bash
npm run dev
```

### Paso 5: Acceder a http://localhost:3002
1. Inicia sesión
2. Deberías ver el icono 🔔 en la navbar (lado derecho)
3. Haz clic para ver el modal

---

## 📁 Archivos del Sistema

```
frontend/
├── hooks/
│   └── useNotificaciones.ts        ← Hook principal
├── components/
│   ├── NotificationBell.tsx        ← Icono campana
│   ├── NotificacionesModal.tsx     ← Modal elegante
│   └── NavbarContent.tsx           ← Integración
├── INTEGRACION_NOTIFICACIONES.md   ← Documentación técnica
└── GUIA_VISUAL_NOTIFICACIONES.md   ← Guía visual
```

---

## 🎯 Cómo Funciona

### 1. Hook `useNotificaciones`
```typescript
const {
  notificaciones,      // Array de notificaciones
  noLeidas,            // Número de no leídas
  loading,             // Si está cargando
  marcarComoLeida,     // Función para marcar leída
  marcarTodasLeidas,   // Función para marcar todas
  eliminarNotificacion // Función para eliminar
} = useNotificaciones()
```

### 2. Flujo de Datos
```
Backend envía evento
       ↓
Se crea notificación en BD
       ↓
Frontend hace request cada 30s
       ↓
Hook obtiene las notificaciones
       ↓
Modal las muestra
       ↓
Usuario interactúa (click, eliminar, etc.)
```

### 3. Auto-Refresh
El hook refresca automáticamente cada 30 segundos para:
- Actualizar el contador de no leídas
- Obtener nuevas notificaciones

---

## 🎨 Personalización

### Cambiar Ubicación del Bell

Busca en `NavbarContent.tsx`:
```typescript
{/* Notificaciones Bell - A la derecha del perfil */}
```

Y mueve ese bloque donde necesites.

### Cambiar Frecuencia de Refresh

En `hooks/useNotificaciones.ts`:
```typescript
// Línea ~104
const interval = setInterval(() => {
  fetchNoLeidas()
}, 30000) // Cambiar 30000 (30s) por otro valor en ms
```

### Cambiar Estilos

En `components/NotificacionesModal.tsx` hay variables de color:
```typescript
const bgColor = useColorModeValue('white', 'gray.800')
const borderColor = useColorModeValue('gray.200', 'gray.700')
// ... más variables
```

---

## 🧪 Testing Manual

### Crear una Notificación de Prueba

Desde el backend:
```javascript
// En una terminal Node
const { Notificacion } = require('./src/models');
await Notificacion.create({
  usuario_id: 1,
  titulo: "Test",
  descripcion: "Notificación de prueba",
  tipo: "sistema",
  estado: "no_leida",
  datos_relacionados: {},
  enlace_detalle: "/"
});
```

O crear un canje (que genera notificación automáticamente):
```bash
POST /api/canjes
{
  "producto_id": 1
}
```

### Ver las Notificaciones

1. Abre la app
2. Haz clic en 🔔
3. Deberías ver la notificación en el modal

---

## 🔍 Debugging

### DevTools Network
Abre DevTools (F12) → Network → Filtra por "notificaciones"

Deberías ver requests como:
- `GET /api/notificaciones`
- `GET /api/notificaciones/no-leidas/contar`
- `PATCH /api/notificaciones/:id/leido`

### Console Logs
El hook usa `console.error()` para errores:
```
Error contando no leídas: ...
Error: ...
```

### LocalStorage
El token JWT se guarda en localStorage o cookies. Verifica que sea válido:
```javascript
// En console
localStorage.getItem('token') // O la clave que uses
```

---

## 🐛 Problemas Comunes

### "El bell no aparece"
- Verificar que estés autenticado
- Verificar que `display={{ base: 'none', lg: 'block' }}` → En desktop debería verse
- En móvil no aparece en navbar (está en drawer)

### "El modal se abre pero está vacío"
- Verificar que `NEXT_PUBLIC_API_URL` está correcta
- Verificar que la API está corriendo en ese puerto
- Revisar Network en DevTools para ver el request/response

### "No actualiza el contador"
- El auto-refresh ocurre cada 30s, no en tiempo real
- Para agregar en tiempo real necesitarías WebSockets (opcional)

### "Las notificaciones no se marcan como leídas"
- Verificar que el token es válido
- Ver error en Network (status code)
- El backend valida que el usuario sea propietario

---

## 📊 Estructura de Notificación

```typescript
interface Notificacion {
  id: number
  usuario_id: number
  titulo: string
  descripcion: string
  tipo: 'sub_regalada' | 'puntos_ganados' | 'canje_creado' | ...
  estado: 'leida' | 'no_leida'
  datos_relacionados: Record<string, any>
  enlace_detalle: string
  fecha_lectura: string | null
  deleted_at: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}
```

---

## 🌐 Variables de Entorno

En `.env.local`:
```
# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

En producción cambiar a:
```
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

---

## 📚 Documentación Completa

- `INTEGRACION_NOTIFICACIONES.md` - Documentación técnica
- `GUIA_VISUAL_NOTIFICACIONES.md` - Guía visual y diseño
- Backend: `SISTEMA-NOTIFICACIONES-IMPLEMENTACION.md`

---

## ✨ Características

- ✅ **Auto-refresh cada 30s** - Mantiene sincronizado
- ✅ **Modal elegante** - Diseño profesional
- ✅ **Temas claro/oscuro** - Soporta ambos
- ✅ **Responsive** - Funciona en móvil, tablet, desktop
- ✅ **Accesible** - Cumple WCAG
- ✅ **Animaciones suaves** - Transiciones agradables
- ✅ **Iconos por tipo** - 8 tipos diferentes
- ✅ **Datos contextuales** - Información relevante
- ✅ **Navegación automática** - Va al detalle al hacer clic

---

## 🎯 Próximos Pasos

1. **Backend**: Ejecutar migración
   ```bash
   npm run migrate
   ```

2. **Frontend**: Verificar que todo está visible
   - Icono 🔔 en navbar
   - Modal se abre
   - Muestra notificaciones

3. **Testing**: Crear notificaciones de prueba
   - Crear canje
   - Ver notificación
   - Verificar que se marca como leída

4. **(Opcional) WebSockets**: Para notificaciones en tiempo real
   - Requiere setup adicional
   - Hay ejemplos en documentación backend

---

## 🎉 ¡Listo!

El sistema está funcionando. Solo asegúrate de:
- ✅ API corriendo
- ✅ Variables de entorno configuradas
- ✅ Frontend iniciado
- ✅ Usuario autenticado

¡A disfrutar de las notificaciones! 🚀

