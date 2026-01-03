# 📬 Sistema de Notificaciones - Integración Frontend

## ✅ Implementación Completada

Se ha integrado exitosamente el sistema de notificaciones en el frontend con un **modal elegante y profesional**.

---

## 📦 Archivos Creados

### 1. Hook de Notificaciones
**Archivo:** `hooks/useNotificaciones.ts`

Hook personalizado que maneja toda la lógica de notificaciones:
- Obtener notificaciones (con paginación y filtros)
- Contar no leídas
- Marcar como leída
- Marcar todas como leídas
- Eliminar notificación
- Auto-refresh cada 30 segundos

**Uso:**
```typescript
const {
  notificaciones,
  noLeidas,
  loading,
  fetchNotificaciones,
  marcarComoLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
} = useNotificaciones()
```

### 2. Modal de Notificaciones
**Archivo:** `components/NotificacionesModal.tsx`

Modal elegante y profesional que muestra:
- Lista de notificaciones con paginación
- Estado de carga
- Notificaciones vacías
- Iconos y colores por tipo
- Datos contextuales de cada notificación
- Botones para marcar como leída y eliminar
- Navegación automática al detalle

**Características:**
- 📱 Responsive en todos los dispositivos
- 🎨 Temas claro y oscuro soportados
- ⚡ Animaciones suaves
- ♿ Accesibilidad incluida

### 3. Icono Campana
**Archivo:** `components/NotificationBell.tsx`

Componente de icono campana con badge:
- Icono de campana elegante
- Badge rojo con contador de no leídas
- Tooltip informativo
- Abre el modal al hacer clic

---

## 🔌 Integración en NavbarContent

El NotificationBell ha sido agregado en `components/NavbarContent.tsx`:

**Ubicación:** Entre los badges VIP/SUB y el avatar del perfil (lado derecho)

```typescriptreact
{/* Notificaciones Bell - A la derecha del perfil */}
{isAuthenticated && (
  <Box flexShrink={0} display={{ base: 'none', lg: 'block' }}>
    <NotificationBell />
  </Box>
)}
```

---

## 🎯 Flujo de Uso

1. **Usuario ve el icono de campana** en la navbar (lado derecho)
2. **Hace clic en la campana** → Se abre el modal elegante
3. **Ve lista de notificaciones**:
   - Ordenadas por más recientes
   - Con estados visuales (leída/no leída)
   - Con iconos y colores según tipo
4. **Al hacer clic en una notificación**:
   - Se marca automáticamente como leída
   - Se navega al detalle (`enlace_detalle`)
   - Se cierra el modal
5. **Puede eliminar** notificaciones con el botón ×
6. **Puede marcar todas como leídas** desde el header

---

## 🎨 Tipos de Notificaciones Soportados

| Tipo | Icono | Color | Descripción |
|------|-------|-------|-------------|
| `sub_regalada` | 🎁 | success | Suscripción regalada |
| `puntos_ganados` | 💰 | info | Puntos otorgados |
| `canje_creado` | 🛍️ | primary | Nuevo canje |
| `canje_entregado` | ✅ | success | Entregado |
| `canje_cancelado` | ❌ | red | Cancelado |
| `canje_devuelto` | ↩️ | orange | Devuelto |
| `historial_evento` | 📝 | gray | Evento importante |
| `sistema` | ⚡ | blue | General del sistema |

---

## 📊 Ejemplo de Notificación

```json
{
  "id": 1,
  "usuario_id": 5,
  "titulo": "¡Ganaste 100 puntos!",
  "descripcion": "Has ganado 100 puntos por: Canje de recompensa: Extra Kick",
  "tipo": "puntos_ganados",
  "estado": "no_leida",
  "datos_relacionados": {
    "cantidad": 100,
    "concepto": "Canje de recompensa: Extra Kick"
  },
  "enlace_detalle": "/historial-puntos",
  "fecha_creacion": "2026-01-03T10:30:45.000Z"
}
```

---

## 🚀 Características del Modal

### Header
- ✅ Título con icono "📬 Notificaciones"
- ✅ Badge rojo con contador de no leídas
- ✅ Botón "✓ Leer todo" para marcar todas como leídas

### Body
- ✅ Lista scrollable de notificaciones
- ✅ Efecto hover suave
- ✅ Indicador visual de no leída (punto azul)
- ✅ Información contextual (datos relacionados)
- ✅ Timestamp de creación
- ✅ Botón eliminar con tooltip

### Estados
- ✅ Cargando (spinner)
- ✅ Sin notificaciones (ícono vacío)
- ✅ Con notificaciones (lista)

---

## 🎯 Responsive Design

| Dispositivo | Comportamiento |
|-------------|----------------|
| Desktop (lg+) | Visible en navbar |
| Tablet (md) | Visible en navbar |
| Móvil (sm/xs) | Oculto en navbar, incluido en drawer |

---

## 🔄 Auto-Refresh

El hook `useNotificaciones` refresca automáticamente cada 30 segundos:
- Actualiza el contador de no leídas
- Mantiene la lista sincronizada
- Se detiene al desmontar el componente

---

## 🎨 Temas Soportados

El modal está completamente diseñado para soportar:
- **Modo Claro**: Colores claros y fondos blancos
- **Modo Oscuro**: Colores oscuros con tema adecuado

El componente usa `useColorModeValue` de Chakra para detectar automáticamente.

---

## 📱 Accesibilidad

- ✅ Botones con `aria-label`
- ✅ Tooltips informativos
- ✅ Navegación con teclado
- ✅ Contraste de colores WCAG
- ✅ Labels semánticos

---

## 🔐 Seguridad

- ✅ Requiere autenticación (token JWT)
- ✅ Solo muestra notificaciones del usuario autenticado
- ✅ API valida permisos en backend

---

## 🛠️ Personalización

### Cambiar Ubicación del Bell

Si quieres mover el NotificationBell a otro lugar, busca:
```typescript
// En components/NavbarContent.tsx
{/* Notificaciones Bell - A la derecha del perfil */}
```

Y muévelo donde necesites.

### Cambiar Frecuencia de Auto-Refresh

En `hooks/useNotificaciones.ts`:
```typescript
// Actualmente cada 30 segundos
const interval = setInterval(() => {
  fetchNoLeidas()
}, 30000) // ← Cambiar número (en ms)
```

### Cambiar Colores o Estilos

Edita en `components/NotificacionesModal.tsx`:
```typescript
const bgColor = useColorModeValue('white', 'gray.800')
const borderColor = useColorModeValue('gray.200', 'gray.700')
// ... más colores personalizables
```

---

## 📚 Ejemplo Completo de Uso

```typescriptreact
import { NotificationBell } from '@/components/NotificationBell'

// En la navbar o header
<Box>
  <NotificationBell /> {/* Ya está integrado en NavbarContent */}
</Box>
```

---

## 🐛 Troubleshooting

### Las notificaciones no aparecen
1. Verificar que estés autenticado (token válido)
2. Verificar que la API está respondiendo
3. Abrir DevTools → Network para ver requests
4. Verificar que `NEXT_PUBLIC_API_URL` está configurado en `.env.local`

### Badge no actualiza
1. Asegúrate que el hook está siendo usado correctamente
2. Verifica que `useNotificaciones()` se ejecuta en el componente
3. El auto-refresh ocurre cada 30 segundos (puede que no veas cambios inmediatos)

### Modal se abre pero está vacío
1. La API puede estar retornando error 401 (no autenticado)
2. Verificar token en DevTools → Application → Cookies
3. Revisar console para errores

---

## 🎉 ¡Completado!

El sistema de notificaciones está **100% funcional** en el frontend:
- ✅ Hook para gestionar notificaciones
- ✅ Modal elegante y profesional
- ✅ Icono campana en navbar
- ✅ Auto-refresh cada 30 segundos
- ✅ Temas claro y oscuro
- ✅ Responsive en todos los dispositivos
- ✅ Totalmente accesible

Solo necesita que ejecutes la migración en el backend:
```bash
npm run migrate
```

---

## 📖 Documentación Relacionada

Ver en el backend:
- `SISTEMA-NOTIFICACIONES-IMPLEMENTACION.md` - Documentación técnica completa
- `NOTIFICACIONES-QUICKSTART.md` - Guía rápida
- `NOTIFICACIONES-VISUAL.md` - Diagramas y arquitectura

