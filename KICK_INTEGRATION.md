# Integración con Kick - Guía de Uso

## 📋 Resumen

Este frontend ahora está completamente integrado con el sistema de Kick del backend. Permite gestionar:

1. **Autenticación con Refresh Tokens** (duración de 90 días)
2. **Conexión del Broadcaster de Kick**
3. **Configuración de Puntos por Eventos**
4. **Visualización de Suscripciones a Eventos**

---

## 🔐 Sistema de Refresh Tokens

### ¿Qué cambió?

El sistema de autenticación ahora usa **dos tokens**:

- **Access Token**: Válido por 1 hora, se usa en cada request
- **Refresh Token**: Válido por 90 días, se usa para renovar el access token automáticamente

### Flujo Automático

```
1. Usuario hace login
   └─ Recibe accessToken (1h) + refreshToken (90d)

2. Frontend guarda ambos tokens en localStorage

3. Usuario usa la app normalmente
   └─ Cada request usa el accessToken

4. Cuando el accessToken expira (después de 1h)
   └─ Axios interceptor detecta error 401
   └─ Automáticamente llama al endpoint /api/auth/refresh
   └─ Obtiene NUEVO accessToken + NUEVO refreshToken
   └─ Reintenta el request original
   └─ Usuario NO SE DA CUENTA

5. Esto se repite automáticamente por 90 días
```

### Implementación Técnica

**Archivos modificados:**
- `lib/api.ts` - Interceptor con lógica de auto-refresh
- `hooks/useAuth.tsx` - Manejo de tokens en login/logout
- `pages/auth/callback.tsx` - Callback de OAuth actualizado

---

## 🎮 Administración de Kick

### Acceso

Solo usuarios con rol de administrador (rol_id 3, 4 o 5) pueden acceder a:

```
/admin/kick - Panel principal
/admin/kick/puntos - Configuración de puntos
/admin/kick/suscripciones - Gestión de suscripciones
```

### Panel Principal (`/admin/kick`)

**Características:**

1. **Estado de Conexión**
   - Muestra si el broadcaster está conectado
   - Información del broadcaster (username, ID)
   - Estado del token (válido/expirado)
   - Número de suscripciones activas

2. **Botón "Conectar con Kick"**
   - Redirige al OAuth de Kick
   - Al conectar, automáticamente:
     - Guarda el token del broadcaster
     - Se suscribe a TODOS los eventos necesarios
     - Queda listo para recibir webhooks

3. **Botón "Desconectar"**
   - Revoca la conexión del broadcaster
   - Limpia tokens almacenados

---

## ⚙️ Configuración de Puntos (`/admin/kick/puntos`)

### Puntos Configurables

| Evento | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `chat_points_regular` | Mensaje de usuario regular | 10 puntos |
| `chat_points_subscriber` | Mensaje de suscriptor | 20 puntos |
| `follow_points` | Nuevo seguidor | 50 puntos |
| `subscription_new_points` | Nueva suscripción | 500 puntos |
| `subscription_renewal_points` | Renovación de suscripción | 300 puntos |
| `gift_given_points` | Por cada sub regalada | 100 puntos |
| `gift_received_points` | Recibir sub regalo | 400 puntos |

### Funcionalidades

1. **Editar Puntos**
   - Cambiar valor de puntos (0 a 10,000)
   - Activar/Desactivar evento específico
   - Guardar cambios individualmente

2. **Inicializar/Restablecer**
   - Crear configuración con valores por defecto
   - Restablecer a valores por defecto

### Sistema de Cooldown

- **Mensajes de chat**: 5 minutos de cooldown por usuario
- **Follows/Subs**: Solo otorga puntos la primera vez

---

## 📡 Suscripciones de Eventos (`/admin/kick/suscripciones`)

### Eventos Automáticos

Cuando el broadcaster se conecta, se suscriben automáticamente a:

1. `chat.message.sent` - Mensajes de Chat
2. `channel.followed` - Nuevos Seguidores
3. `channel.subscription.new` - Nuevas Suscripciones
4. `channel.subscription.renewal` - Renovaciones
5. `channel.subscription.gifts` - Regalos de Suscripción
6. `livestream.status.updated` - Estado del Stream
7. `livestream.metadata.updated` - Metadatos del Stream

### Vista de Suscripciones

- Lista todas las suscripciones activas
- Muestra tipo de evento, estado, broadcaster, fecha
- Botón para refrescar estado

---

## 🔧 Estructura de Archivos Nuevos

```
frontend/
├── lib/
│   └── kickApi.ts                    # API services para Kick
├── hooks/
│   ├── useKickBroadcaster.ts        # Hook para broadcaster
│   ├── useKickPointsConfig.ts       # Hook para config de puntos
│   └── useKickSubscriptions.ts      # Hook para suscripciones
├── pages/
│   └── admin/
│       └── kick/
│           ├── index.tsx             # Panel principal
│           ├── puntos.tsx            # Config de puntos
│           └── suscripciones.tsx    # Gestión de suscripciones
└── components/
    └── Navbar.tsx                    # Actualizado con enlace a Kick
```

---

## 🚀 Flujo Completo de Uso

### Primera Vez (Setup Inicial)

1. **Admin inicia sesión**
   ```
   /login → Ingresar credenciales
   ```

2. **Acceder a administración de Kick**
   ```
   Navbar → Kick
   O directamente: /admin/kick
   ```

3. **Conectar broadcaster**
   ```
   Click "Conectar con Kick"
   → OAuth de Kick
   → Aceptar permisos
   → Callback automático
   → ✅ Conectado y auto-suscrito
   ```

4. **Configurar puntos (opcional)**
   ```
   /admin/kick/puntos
   → Editar valores según preferencias
   → Guardar
   ```

### Uso Diario

- Los webhooks llegan automáticamente al backend
- Los puntos se otorgan según configuración
- Los usuarios ven sus puntos actualizados en tiempo real
- No requiere intervención manual

### Mantenimiento

- **Ver estado**: `/admin/kick`
- **Ajustar puntos**: `/admin/kick/puntos`
- **Verificar suscripciones**: `/admin/kick/suscripciones`

---

## 🛡️ Seguridad

1. **Refresh Tokens**
   - Rotación automática en cada refresh
   - Revocación en logout
   - Expiración de 90 días

2. **Roles de Admin**
   - Solo rol_id 3, 4, 5 acceden a `/admin/kick`
   - Protección con `RequireAdmin`

3. **Tokens de Kick**
   - Almacenados en backend
   - Auto-renovación antes de expirar

---

## 📝 Endpoints Backend Utilizados

```javascript
// Auth
POST /api/auth/login           // Login con refresh token
POST /api/auth/refresh         // Renovar access token
POST /api/auth/logout          // Revocar refresh token
GET  /api/auth/kick            // Iniciar OAuth de Kick
GET  /api/auth/kick-callback   // Callback de OAuth

// Kick Broadcaster
GET  /api/kick/broadcaster/status      // Estado de conexión
POST /api/kick/broadcaster/disconnect  // Desconectar
GET  /api/kick/broadcaster/token       // Ver token (admin)

// Kick Points Config
GET  /api/kick/points-config           // Obtener config
PUT  /api/kick/points-config           // Actualizar config
PUT  /api/kick/points-config/bulk      // Actualizar múltiple
POST /api/kick/points-config/initialize // Inicializar

// Kick Subscriptions
GET  /api/kick/subscriptions           // Suscripciones de Kick API
POST /api/kick/subscriptions           // Crear suscripciones
DELETE /api/kick/subscriptions         // Eliminar suscripciones
GET  /api/kick/local-subscriptions     // Suscripciones locales
```

---

## 🐛 Troubleshooting

### Token expirado

**Síntoma**: Usuario es redirigido a login después de inactividad

**Solución**:
- Si pasaron menos de 90 días: Debería renovarse automáticamente
- Si pasaron más de 90 días: Usuario debe hacer login nuevamente

### Broadcaster no conectado

**Síntoma**: Panel muestra "No conectado"

**Solución**:
1. Ir a `/admin/kick`
2. Click "Conectar con Kick"
3. Aceptar permisos en Kick
4. Verificar que el callback funcione

### No se otorgan puntos

**Síntoma**: Eventos no generan puntos

**Checklist**:
1. Broadcaster está conectado (`/admin/kick`)
2. Configuración inicializada (`/admin/kick/puntos`)
3. Eventos están activados (toggle en verde)
4. Suscripciones activas (`/admin/kick/suscripciones`)

---

## ✨ Mejoras Implementadas

1. ✅ Sistema de refresh tokens automático
2. ✅ Panel completo de administración de Kick
3. ✅ Configuración editable de puntos
4. ✅ Vista de suscripciones activas
5. ✅ Auto-suscripción al conectar broadcaster
6. ✅ Enlace en navbar para fácil acceso
7. ✅ Feedback visual (spinners, toasts, badges)
8. ✅ Responsive design (desktop y mobile)

---

## 📞 Soporte

Para dudas o problemas, revisa:
- Backend: `C:\Users\NaferJ\Projects\Private\luisardito-shop-backend`
- Documentación de Kick API: https://kick.com/developer-docs
