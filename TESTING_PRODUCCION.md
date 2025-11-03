# 🧪 GUÍA DE TESTING EN PRODUCCIÓN

## 📋 Checklist Rápido

Después de hacer deploy, verifica estos puntos:

### ✅ Test Básico (5 minutos)
- [ ] Login con Kick funciona
- [ ] No hay redirect a login después de autorizar
- [ ] Usuario autenticado correctamente
- [ ] Navbar muestra información del usuario
- [ ] `debugAuth()` funciona en consola

### ✅ Test con Usuario Afectado (10 minutos)
- [ ] Contactar usuario que tenía el problema
- [ ] Pedirle que intente login con Kick
- [ ] Confirmar que funciona correctamente
- [ ] Si falla, pedirle screenshot de `debugAuth()`

### ✅ Test de Navegación (5 minutos)
- [ ] Login → Navegar a varias páginas
- [ ] Usar botón "Atrás"
- [ ] Usar botón "Adelante"
- [ ] Sesión se mantiene correctamente

---

## 🔍 Comandos de Debugging

### En la Consola del Navegador

#### Ver estado completo de autenticación
```javascript
debugAuth()
```

**Output esperado (usuario autenticado):**
```
🔧 DEBUG AUTH - Estado Completo
  📊 Estado de Salud: ✅ SALUDABLE
  📋 Detalles
    Auth Token presente: ✅
    Refresh Token presente: ✅
    Auth Token válido: ✅
    Refresh Token válido: ✅
    Auth Token expirado: ✅ NO
    Refresh Token expirado: ✅ NO
    Total de cookies: 3
    Dominio: shop.luisardito.com
    Protocolo: https:
  🎫 Auth Token Payload
    User ID: 123
    Expira en: 03/11/2025, 15:30:00
    Emitido en: 03/11/2025, 14:30:00
  ...
```

---

#### Verificar salud de autenticación (programático)
```javascript
const health = verifyAuthHealth()
console.log('Es saludable:', health.isHealthy)
console.log('Problemas:', health.issues)
console.log('Detalles:', health.details)
```

**Output esperado (usuario autenticado):**
```javascript
{
  isHealthy: true,
  issues: [],
  details: {
    hasAuthToken: true,
    hasRefreshToken: true,
    authTokenValid: true,
    refreshTokenValid: true,
    authTokenExpired: false,
    refreshTokenExpired: false,
    cookiesCount: 3,
    domain: "shop.luisardito.com",
    protocol: "https:"
  }
}
```

---

#### Ver estado del RefreshManager (solo desarrollo)
```javascript
// Verificar que el manager está limpio
window.refreshManager.getQueueSize() // Debe ser 0
window.refreshManager.isCurrentlyRefreshing() // Debe ser false

// Si hay problemas, forzar reset
window.refreshManager.reset()
```

---

#### Ver todas las cookies
```javascript
debugCookies() // Ya estaba disponible antes
```

---

## 🐛 Escenarios de Prueba Específicos

### Escenario 1: Login Exitoso Normal

**Pasos:**
1. Abrir navegador en incógnito
2. Ir a `https://shop.luisardito.com/login`
3. Click "Iniciar Sesión con Kick"
4. Autorizar en Kick
5. Esperar redirect

**Resultado esperado:**
- ✅ Redirect a `/` (homepage)
- ✅ Navbar muestra usuario
- ✅ No hay errores en consola
- ✅ `debugAuth()` muestra estado saludable

**Si falla:**
```javascript
// Ejecutar inmediatamente
debugAuth()

// Capturar screenshot del output
// Enviar a desarrollo
```

---

### Escenario 2: Refresh del Navegador Durante Sesión

**Pasos:**
1. Usuario ya autenticado
2. Hacer F5 en cualquier página
3. Esperar recarga

**Resultado esperado:**
- ✅ Sesión se mantiene
- ✅ No redirect a login
- ✅ Estado del manager resetado

**Verificación en consola:**
```javascript
// Debe aparecer en los logs:
// 🔄 [RefreshManager] Reseteando estado
```

---

### Escenario 3: Múltiples Tabs Abiertas

**Pasos:**
1. Abrir 3 tabs en `shop.luisardito.com`
2. En tab 1: Login con Kick
3. Esperar que complete
4. Cambiar a tab 2 y tab 3

**Resultado esperado:**
- ✅ Tab 1 autenticada
- ✅ Tab 2 y 3 detectan autenticación automáticamente (listener)
- ✅ Navbar en todas las tabs muestra usuario

**Tiempo esperado de sincronización:** <1 segundo (listener revisa cada 500ms)

---

### Escenario 4: Token Expira Durante Uso

**Setup:**
Este test requiere esperar 1 hora o modificar temporalmente el backend para que los tokens expiren en 1 minuto.

**Pasos:**
1. Usuario autenticado
2. Esperar a que access token expire (1 hora por defecto)
3. Hacer cualquier acción que requiera API (ej: ver productos)

**Resultado esperado:**
- ✅ Request inicial falla con 401
- ✅ Interceptor detecta y hace refresh automático
- ✅ Request original se reintenta y completa
- ✅ Usuario NO nota nada

**Verificación en consola:**
```javascript
// Debe aparecer:
// 🔄 [RefreshManager] Intentando refrescar token...
// ✅ [RefreshManager] Token refrescado exitosamente
```

---

### Escenario 5: Usuario con Problema Reportado Previamente

**Pasos:**
1. Contactar usuario que reportó el problema
2. Pedirle que cierre todas las tabs de la app
3. Limpiar cookies (opcional, para test limpio)
4. Pedirle que intente login con Kick

**Resultado esperado:**
- ✅ Login funciona a la primera
- ✅ No bucle de login
- ✅ Usuario queda autenticado

**Si sigue fallando (MUY IMPROBABLE):**
```javascript
// Pedirle que ejecute y envíe screenshot:
debugAuth()

// Y también:
console.log('User Agent:', navigator.userAgent)
console.log('Cookies habilitadas:', navigator.cookieEnabled)
```

---

## 📊 Monitoreo de Logs

### Logs Esperados en Producción

#### Durante Login Exitoso (consola del navegador):
```
🔍 [Auth Callback] Datos codificados recibidos
🔍 [Auth Callback] Datos decodificados: {hasAccessToken: true, ...}
🍪 [Auth Callback] Guardando tokens en cookies...
🍪 [CookieManager] Configurando cookie: {name: "auth_token", ...}
🍪 [Auth Callback] Cookies verificadas: true
🔄 [Auth] Nuevo token detectado en cookies, actualizando...
```

#### Durante Refresh Automático:
```
🔄 [RefreshManager] Intentando refrescar token...
✅ [RefreshManager] Token refrescado exitosamente {hasNewRefreshToken: true, expiresIn: "1h"}
```

#### Durante Reset de Estado:
```
🔄 [RefreshManager] Reseteando estado
```

---

### Logs que Indican Problemas

#### ⚠️ Warning (no crítico):
```
⚠️ [CookieManager] auth_token en localStorage no es válido, omitiendo migración
```
**Acción:** Normal, solo indica que había datos viejos en localStorage

#### ❌ Error (crítico):
```
❌ [RefreshManager] Error al refrescar token: {error: "...", status: 401}
❌ [Auth] fetchUser falló después de refresh, haciendo logout
```
**Acción:** Investigar. Posible problema en backend.

---

## 🚨 Troubleshooting

### Problema: Usuario sigue en bucle de login

**Diagnóstico:**
```javascript
debugAuth()
```

**Posibles causas:**

#### Caso 1: No hay cookies
```
⚠️ Problemas Detectados
  - No se encontró auth_token en cookies
  - No se encontró refresh_token en cookies
```
**Solución:** 
- Problema en el backend (no está seteando cookies)
- Revisar configuración de CORS del backend
- Revisar headers de Set-Cookie

#### Caso 2: Tokens inválidos
```
⚠️ Problemas Detectados
  - auth_token no es un JWT válido
```
**Solución:**
- Backend está seteando cookies corruptas
- Investigar backend

#### Caso 3: Tokens expirados
```
⚠️ Problemas Detectados
  - auth_token está expirado
  - refresh_token está expirado
```
**Solución:**
- Tokens muy viejos (más de 90 días)
- Usuario debe hacer login de nuevo

---

### Problema: Funciona en incógnito pero no en normal

**Diagnóstico:**
```javascript
// En modo normal
debugAuth()

// Revisar localStorage
console.log('localStorage:', {
  auth: localStorage.getItem('auth_token'),
  refresh: localStorage.getItem('refresh_token')
})
```

**Posible causa:**
- Datos viejos en localStorage interfiriendo
- Cookies viejas interfiriendo

**Solución:**
```javascript
// Limpiar todo
localStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
})
// Hacer F5 e intentar login de nuevo
```

---

### Problema: Funciona al principio pero después de un rato falla

**Diagnóstico:**
```javascript
// Verificar expiración
const health = verifyAuthHealth()
console.log('Auth expirado:', health.details.authTokenExpired)
console.log('Refresh expirado:', health.details.refreshTokenExpired)
```

**Posible causa:**
- Refresh token expiró (>90 días)
- Backend rechazando refresh tokens

**Solución:**
- Si refresh token expirado: Normal, usuario debe login de nuevo
- Si refresh token válido pero backend rechaza: Investigar backend

---

## 📞 Información para Usuario si Reporta Problema

Si un usuario reporta problema, pedirle lo siguiente:

### Template de Mensaje

```
Hola [Usuario],

Para ayudarte a resolver el problema, ¿puedes hacer lo siguiente?

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Escribe: debugAuth()
4. Presiona Enter
5. Envíame un screenshot completo de lo que aparece

También ayudaría saber:
- ¿Qué navegador usas? (Chrome, Firefox, etc.)
- ¿En qué dispositivo? (PC, Mac, Móvil)
- ¿Te funciona en modo incógnito?

Gracias!
```

---

## ✅ Checklist Final Pre-Deploy

Antes de hacer push a producción:

- [ ] Revisar que no hay errores de TypeScript (solo warnings)
- [ ] Confirmar que archivos modificados son solo los esperados
- [ ] Hacer commit con mensaje descriptivo
- [ ] Hacer push a rama de producción
- [ ] Esperar a que deploy complete
- [ ] Hacer test básico inmediatamente después
- [ ] Monitorear logs por 30 minutos
- [ ] Contactar usuario que tenía el problema
- [ ] Confirmar que el fix funciona

---

## 📈 Métricas a Monitorear

En las próximas 48 horas después del deploy:

### Métricas de Éxito
- [ ] Tasa de login exitoso >99%
- [ ] Tickets de "bucle de login" = 0
- [ ] Tiempo promedio de login <5 segundos
- [ ] No más errores de "refresh token" innecesarios

### Señales de Alerta
- ⚠️ Usuario reporta bucle de login
- ⚠️ Errores 401 en masa en logs
- ⚠️ Tasa de login <95%

---

## 🎉 Si Todo Funciona

¡Felicidades! El problema está resuelto. 

**Próximos pasos:**
- [ ] Marcar ticket como resuelto
- [ ] Agregar nota en changelog
- [ ] Archivar documentos técnicos para futura referencia
- [ ] Celebrar 🎊

---

**Documento creado:** 2025-11-03
**Úsalo para:** Testing post-deploy y troubleshooting
**Estado:** ✅ LISTO PARA USAR

