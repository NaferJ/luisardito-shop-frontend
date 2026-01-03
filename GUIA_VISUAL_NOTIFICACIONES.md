# 📬 Sistema de Notificaciones - Guía Visual

## 🎨 Apariencia Visual

### Header de Navbar
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo        │  Iconos Centrales  │  Badges  🔔  Badge  Avatar  Hamburguesa
│  Luisardito │                    │  VIP SUB ↑   puntos         
│  Shop       │                    │          El icono nuevo está aquí
└─────────────────────────────────────────────────────────────────────────┘
```

### Icono Campana
```
┌──────┐
│  🔔  │  ← Icono elegante
│  9+  │  ← Badge rojo con contador
└──────┘

Al pasar el mouse:
┌──────┐
│  🔔  │ ✨ Escala 1.1 + cambio de fondo
│  9+  │
└──────┘
```

---

## 📋 Modal de Notificaciones

### Estructura Completa

```
┌─────────────────────────────────────────────────────────────────┐
│ 📬 Notificaciones            [9]    [✓ Leer todo]     [X]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 💰  ¡Ganaste 100 puntos!                         [Nuevo] [×] ││
│ │     Has ganado 100 puntos por: Canje de...       ●           ││
│ │     +100 puntos                                              ││
│ │     3/1/2026 10:30                                           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🎁  ¡Recibiste un regalo de suscripción!                [×] ││
│ │     luisardito te regaló 1 suscripción(es)                  ││
│ │     De: luisardito                                          ││
│ │     3/1/2026 09:15                                          ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ✅  ¡Tu canje fue entregado!                          [×]  ││
│ │     Tu canje de "VIP Mensual" ha sido entregado            ││
│ │     Producto: VIP Mensual                                  ││
│ │     2/1/2026 15:42                                         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Estados del Modal

### Estado: Sin Notificaciones
```
┌─────────────────────────────────────────────────────────────────┐
│ 📬 Notificaciones                                       [X]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│                          📭                                       │
│                    No tienes notificaciones                       │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Estado: Cargando
```
┌─────────────────────────────────────────────────────────────────┐
│ 📬 Notificaciones                                       [X]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│                          ⏳                                       │
│                  Cargando notificaciones...                       │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Estado: Con Notificaciones No Leídas
```
┌─────────────────────────────────────────────────────────────────┐
│ 📬 Notificaciones      [3]    [✓ Leer todo]              [X]     │
├─────────────────────────────────────────────────────────────────┤
│ ... lista de notificaciones ...
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Elementos Visuales

### Notificación No Leída
```
Fondo: Azul claro (unread)
┌─────────────────────────────────────────────────────────┐
│ ICONO  CONTENIDO                              DELETE  ● │
│        - Título en negrita                             │
│        - Descripción                                    │
│        - Datos relacionados                             │
│        - Timestamp                                      │
└─────────────────────────────────────────────────────────┘
          ↑                                              ↑
      Icono por tipo                          Punto azul = no leída
```

### Notificación Leída
```
Fondo: Normal
┌─────────────────────────────────────────────────────────┐
│ ICONO  CONTENIDO                              DELETE    │
│        - Título                                         │
│        - Descripción                                    │
│        - Datos relacionados                             │
│        - Timestamp                                      │
└─────────────────────────────────────────────────────────┘
          Sin indicador azul
```

---

## 🌈 Colores por Tipo

### Claro (Light Mode)
```
sub_regalada   → 🎁 Verde (success)
puntos_ganados → 💰 Azul (info)
canje_creado   → 🛍️ Azul Primario
canje_entregado→ ✅ Verde (success)
canje_cancelado→ ❌ Rojo (danger)
canje_devuelto → ↩️ Naranja (warning)
historial_evento→ 📝 Gris (secondary)
sistema        → ⚡ Azul (info)
```

### Oscuro (Dark Mode)
```
Mismos iconos pero con tonos más claros y brillantes
```

---

## 🔄 Interacciones

### Clic en Notificación
```
ANTES:
┌─────────────────────────────────────────┐
│ 💰  ¡Ganaste 100 puntos!      [Nuevo] ●│
└─────────────────────────────────────────┘

1. Usuario hace clic
2. Se marca como leída (automático)
3. Se navega a /historial-puntos
4. Modal se cierra

DESPUÉS:
┌─────────────────────────────────────────┐
│ 💰  ¡Ganaste 100 puntos!               │
└─────────────────────────────────────────┘
(Sin [Nuevo] ni ●)
```

### Hover en Notificación
```
NORMAL:
┌─────────────────────────────────────────┐
│ 💰  ¡Ganaste 100 puntos!                │
└─────────────────────────────────────────┘

HOVER:
┌─────────────────────────────────────────┐
│ 💰  ¡Ganaste 100 puntos!                │  ← Fondo gris/oscuro
│     (Apariencia más destacada)           │
└─────────────────────────────────────────┘
```

### Botón "Leer Todo"
```
[✓ Leer todo]  ← Solo visible si hay no leídas

Al hacer clic:
1. Todas las notificaciones se marcan como leídas
2. Desaparece el badge del header
3. Se actualizan los estados visuales
4. El botón se oculta
```

---

## 📊 Flujo de Usuario Completo

```
┌─────────────────────────┐
│   Usuario en la app     │
└───────────┬─────────────┘
            │
            ▼
┌──────────────────────────┐
│  Aparece notificación en │
│  header (badge rojo "3") │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│  Usuario hace clic en 🔔 │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│     Se abre modal elegante                │
│  Muestra notificaciones no leídas primero │
└───────────┬──────────────────────────────┘
            │
     ┌──────┴──────┬──────────┬─────────┐
     │             │          │         │
     ▼             ▼          ▼         ▼
Hace clic   Marca todas   Elimina    Cierra
 en una     como leídas     una    sin hacer nada
     │             │          │         │
     ▼             ▼          ▼         ▼
Auto-      Todas pasan   Desaparece Modal se
marca      a estado       de la lista cierra
como leída "leída"                  
     │
Navega al
detalle
(enlace_detalle)
```

---

## 🚀 Ejemplos de Notificaciones

### Ejemplo 1: Puntos Ganados
```
ICONO: 💰
TITULO: ¡Ganaste 100 puntos!
DESC: Has ganado 100 puntos por: Canje de recompensa: Extra Kick
DATOS:
  - +100 puntos
  - Canje de recompensa: Extra Kick
ENLACE: /historial-puntos
TIMESTAMP: 3/1/2026 10:30
```

### Ejemplo 2: Suscripción Regalada
```
ICONO: 🎁
TITULO: ¡Recibiste un regalo de suscripción!
DESC: luisardito te regaló 1 suscripción(es)
DATOS:
  - De: luisardito
  - Suscripción(es): 1
  - Puntos: 500
ENLACE: /suscripciones
TIMESTAMP: 3/1/2026 09:15
```

### Ejemplo 3: Canje Entregado
```
ICONO: ✅
TITULO: ¡Tu canje fue entregado!
DESC: Tu canje de "VIP Mensual" ha sido entregado
DATOS:
  - Producto: VIP Mensual
  - Estado: Entregado
ENLACE: /canjes/42
TIMESTAMP: 2/1/2026 15:42
```

### Ejemplo 4: Canje Cancelado
```
ICONO: ❌
TITULO: Tu canje fue cancelado
DESC: Tu canje de "Emote Premium" ha sido cancelado
DATOS:
  - Producto: Emote Premium
  - Motivo: Stock agotado
ENLACE: /canjes/41
TIMESTAMP: 2/1/2026 14:20
```

---

## 🎯 Ubicación en la Navbar

### Desktop (Visible)
```
Logo    Iconos Centrales    │   Sugerencia  🌓  Badges VIP/SUB  🔔  Puntos  Avatar
                             │   (si no hay badges) (toggle)   ← Aquí   (badges)  (menu)
```

### Tablet (Visible)
```
Logo    Iconos    │   Badges VIP/SUB  🔔  Avatar
        (reducidos)│
```

### Móvil (Oculto en Navbar)
```
Logo    Hamburguesa
        ├─ Opciones
        ├─ Notificaciones ← Se accede desde drawer
        └─ ...
```

---

## 🎨 Tema Claro vs Oscuro

### Tema Claro
```
┌─────────────────────────────────────────┐
│ Fondo: Blanco                           │
│ Texto: Gris oscuro                      │
│ Bordes: Gris claro                      │
│ Hover: Gris muy claro                   │
│ Sombra: Suave, sutilmente gris          │
│ No leída: Azul claro                    │
└─────────────────────────────────────────┘
```

### Tema Oscuro
```
┌─────────────────────────────────────────┐
│ Fondo: Gris muy oscuro                  │
│ Texto: Blanco/Gris claro                │
│ Bordes: Gris oscuro                     │
│ Hover: Gris más claro                   │
│ Sombra: Suave, sutilmente negra         │
│ No leída: Azul oscuro                   │
└─────────────────────────────────────────┘
```

---

## ⌨️ Atajos de Teclado

- `Tab` - Navegar entre elementos
- `Enter` - Hacer clic en notificaciones y botones
- `Esc` - Cerrar modal
- `Shift+Tab` - Navegar hacia atrás

---

## 🌐 Responsive

| Tamaño | Comportamiento |
|--------|----------------|
| xs (< 480px) | Hidden en navbar |
| sm (480px - 768px) | Hidden en navbar |
| md (768px - 1024px) | Visible pero comprimido |
| lg (1024px - 1536px) | Completamente visible |
| xl (> 1536px) | Completamente visible |

---

## 🎉 Conclusión

El sistema de notificaciones tiene una **apariencia profesional y elegante** con:
- ✅ Diseño limpio y moderno
- ✅ Animaciones suaves
- ✅ Responsive en todos los dispositivos
- ✅ Soporta temas claro y oscuro
- ✅ Completamente accesible
- ✅ Interacciones intuitivas

