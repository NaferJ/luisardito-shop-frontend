# 📬 Sistema de Notificaciones - Ejemplos de Código

## 🎯 Ejemplos Prácticos

### 1. Usar el Hook en un Componente Personalizado

```typescript
// components/CustomNotifications.tsx
import { useNotificaciones } from '../hooks/useNotificaciones'
import { Box, Text } from '@chakra-ui/react'

export function CustomNotifications() {
  const { notificaciones, noLeidas, loading } = useNotificaciones()

  if (loading) return <Text>Cargando...</Text>

  return (
    <Box>
      <Text>Tienes {noLeidas} notificaciones no leídas</Text>
      {notificaciones.map(notif => (
        <div key={notif.id}>
          <h3>{notif.titulo}</h3>
          <p>{notif.descripcion}</p>
        </div>
      ))}
    </Box>
  )
}
```

---

### 2. Mostrar Toast al Recibir Notificación

```typescript
// hooks/useNotificacionesConToast.ts
import { useToast } from '@chakra-ui/react'
import { useNotificaciones } from './useNotificaciones'
import { useEffect } from 'react'

export function useNotificacionesConToast() {
  const toast = useToast()
  const { notificaciones, ...rest } = useNotificaciones()

  const iconMap: Record<string, string> = {
    sub_regalada: '🎁',
    puntos_ganados: '💰',
    canje_creado: '🛍️',
    // ... etc
  }

  // Mostrar toast cuando llega una notificación no leída
  useEffect(() => {
    const nuevaNoLeida = notificaciones.find(n => n.estado === 'no_leida')
    if (nuevaNoLeida) {
      toast({
        title: nuevaNoLeida.titulo,
        description: nuevaNoLeida.descripcion,
        status: 'info',
        duration: 5000,
        isClosable: true,
        icon: iconMap[nuevaNoLeida.tipo] || '📬',
      })
    }
  }, [notificaciones, toast])

  return { notificaciones, ...rest }
}
```

---

### 3. Filtrar Notificaciones por Tipo

```typescript
// hooks/useNotificacionesFiltradas.ts
import { useNotificaciones, Notificacion } from './useNotificaciones'
import { useMemo } from 'react'

export function useNotificacionesFiltradas(tipo?: string) {
  const { notificaciones, ...rest } = useNotificaciones()

  const filtradas = useMemo(() => {
    if (!tipo) return notificaciones
    return notificaciones.filter(n => n.tipo === tipo)
  }, [notificaciones, tipo])

  return { notificaciones: filtradas, ...rest }
}

// Uso:
// const { notificaciones } = useNotificacionesFiltradas('puntos_ganados')
```

---

### 4. Sidebar de Notificaciones Recientes

```typescript
// components/NotificationsSidebar.tsx
import { VStack, Box, Text, Badge, useColorModeValue } from '@chakra-ui/react'
import { useNotificaciones } from '../hooks/useNotificaciones'

export function NotificationsSidebar() {
  const { notificaciones } = useNotificaciones()
  const bgColor = useColorModeValue('gray.50', 'gray.800')

  const recientes = notificaciones.slice(0, 5)

  return (
    <Box bg={bgColor} p={4} borderRadius="lg">
      <Text fontWeight="bold" mb={3}>Recientes</Text>
      <VStack spacing={2} align="start">
        {recientes.map(notif => (
          <Box key={notif.id} w="100%" p={2} borderRadius="md" borderLeft="4px" borderLeftColor="blue.500">
            <Text fontSize="sm" fontWeight="500">{notif.titulo}</Text>
            <Text fontSize="xs" color="gray.500">{notif.descripcion.substring(0, 50)}...</Text>
            {notif.estado === 'no_leida' && (
              <Badge colorScheme="red" mt={1}>Nuevo</Badge>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
```

---

### 5. Widget de Estadísticas

```typescript
// components/NotificationsStats.tsx
import { SimpleGrid, Box, Text, useColorModeValue } from '@chakra-ui/react'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { useMemo } from 'react'

export function NotificationsStats() {
  const { notificaciones } = useNotificaciones()

  const stats = useMemo(() => {
    return {
      total: notificaciones.length,
      noLeidas: notificaciones.filter(n => n.estado === 'no_leida').length,
      porTipo: notificaciones.reduce((acc, n) => {
        acc[n.tipo] = (acc[n.tipo] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
  }, [notificaciones])

  const StatBox = ({ label, value }: { label: string; value: number }) => (
    <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="lg">
      <Text fontSize="sm" color="gray.500">{label}</Text>
      <Text fontSize="2xl" fontWeight="bold">{value}</Text>
    </Box>
  )

  return (
    <SimpleGrid columns={[2, 3]} gap={4}>
      <StatBox label="Total" value={stats.total} />
      <StatBox label="No leídas" value={stats.noLeidas} />
      {Object.entries(stats.porTipo).map(([tipo, count]) => (
        <StatBox key={tipo} label={tipo} value={count} />
      ))}
    </SimpleGrid>
  )
}
```

---

### 6. Timeline de Notificaciones

```typescript
// components/NotificationsTimeline.tsx
import { VStack, Box, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { useNotificaciones } from '../hooks/useNotificaciones'

const iconMap: Record<string, string> = {
  puntos_ganados: '💰',
  canje_creado: '🛍️',
  canje_entregado: '✅',
  sub_regalada: '🎁',
  // ... etc
}

export function NotificationsTimeline() {
  const { notificaciones } = useNotificaciones()
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <VStack spacing={0}>
      {notificaciones.map((notif, idx) => (
        <Box key={notif.id} w="100%" pb={4} borderLeft="2px" borderLeftColor={borderColor}>
          <HStack spacing={4} pl={4}>
            <Box fontSize="2xl" minW="2rem">
              {iconMap[notif.tipo] || '📬'}
            </Box>
            <Box flex={1}>
              <Text fontWeight="bold" fontSize="sm">{notif.titulo}</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(notif.fecha_creacion).toLocaleString('es-ES')}
              </Text>
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
```

---

### 7. Notificaciones en Página Separada

```typescript
// pages/notificaciones.tsx
import { Box, Container, Heading, VStack, Button } from '@chakra-ui/react'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { useState } from 'react'

export default function NotificacionesPage() {
  const {
    notificaciones,
    loading,
    fetchNotificaciones,
    marcarTodasLeidas,
  } = useNotificaciones()
  const [page, setPage] = useState(1)

  return (
    <Container maxW="container.md">
      <Heading mb={6}>Centro de Notificaciones</Heading>
      
      <Button onClick={marcarTodasLeidas} colorScheme="blue" mb={4}>
        Marcar todas como leídas
      </Button>

      <VStack spacing={4}>
        {notificaciones.map(notif => (
          <Box key={notif.id} w="100%" p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Heading fontSize="md">{notif.titulo}</Heading>
            <p>{notif.descripcion}</p>
          </Box>
        ))}
      </VStack>

      <Button onClick={() => setPage(page + 1)} mt={4}>
        Cargar más
      </Button>
    </Container>
  )
}
```

---

### 8. Notificaciones en Context API

```typescript
// context/NotificationsContext.tsx
import { createContext, useContext } from 'react'
import { useNotificaciones } from '../hooks/useNotificaciones'

const NotificationsContext = createContext<ReturnType<typeof useNotificaciones> | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotificaciones()

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotificationsContext debe estar dentro de NotificationsProvider')
  }
  return context
}

// Uso en _app.tsx:
// <NotificationsProvider>
//   <Component {...pageProps} />
// </NotificationsProvider>
```

---

### 9. Notificación con Sonido

```typescript
// hooks/useNotificacionesConSonido.ts
import { useNotificaciones } from './useNotificaciones'
import { useEffect, useRef } from 'react'

export function useNotificacionesConSonido() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { notificaciones, ...rest } = useNotificaciones()

  useEffect(() => {
    const nuevasNoLeidas = notificaciones.filter(n => n.estado === 'no_leida')
    
    if (nuevasNoLeidas.length > 0) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/notification.mp3')
      }
      audioRef.current.play().catch(() => {
        console.log('No se pudo reproducir sonido')
      })
    }
  }, [notificaciones])

  return { notificaciones, ...rest }
}
```

---

### 10. Badge Personalizado en Navbar

```typescript
// components/NotificationBadgeCustom.tsx
import { Badge, Box } from '@chakra-ui/react'
import { useNotificaciones } from '../hooks/useNotificaciones'

export function NotificationBadgeCustom() {
  const { noLeidas } = useNotificaciones()

  if (noLeidas === 0) return null

  return (
    <Badge
      position="absolute"
      top={-2}
      right={-2}
      bg="red.500"
      color="white"
      borderRadius="full"
      fontSize="xs"
      fontWeight="bold"
      px={2}
      py={1}
    >
      {noLeidas > 99 ? '99+' : noLeidas}
    </Badge>
  )
}
```

---

### 11. Marca Automática de Leídas

```typescript
// hooks/useNotificacionesAutoRead.ts
import { useNotificaciones } from './useNotificaciones'
import { useEffect } from 'react'

export function useNotificacionesAutoRead(delayMs = 5000) {
  const { notificaciones, marcarComoLeida } = useNotificaciones()

  useEffect(() => {
    notificaciones.forEach(notif => {
      if (notif.estado === 'no_leida') {
        const timeout = setTimeout(() => {
          marcarComoLeida(notif.id)
        }, delayMs)

        return () => clearTimeout(timeout)
      }
    })
  }, [notificaciones, marcarComoLeida, delayMs])

  return { notificaciones }
}
```

---

### 12. Filtrar y Paginar

```typescript
// hooks/useNotificacionesPaginadas.ts
import { useNotificaciones } from './useNotificaciones'
import { useState, useMemo } from 'react'

export function useNotificacionesPaginadas(
  itemsPerPage = 10,
  tipoFiltro?: string
) {
  const { notificaciones, ...rest } = useNotificaciones()
  const [page, setPage] = useState(1)

  const filtradas = useMemo(() => {
    let filtered = notificaciones
    if (tipoFiltro) {
      filtered = filtered.filter(n => n.tipo === tipoFiltro)
    }
    return filtered
  }, [notificaciones, tipoFiltro])

  const paginadas = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filtradas.slice(start, start + itemsPerPage)
  }, [filtradas, page, itemsPerPage])

  const totalPages = Math.ceil(filtradas.length / itemsPerPage)

  return {
    notificaciones: paginadas,
    page,
    setPage,
    totalPages,
    total: filtradas.length,
    ...rest,
  }
}
```

---

### 13. Exportar Notificaciones

```typescript
// utils/exportNotifications.ts
import { Notificacion } from '../hooks/useNotificaciones'

export function exportToCSV(notificaciones: Notificacion[]) {
  const headers = [
    'ID',
    'Título',
    'Descripción',
    'Tipo',
    'Estado',
    'Fecha',
  ]

  const rows = notificaciones.map(n => [
    n.id,
    n.titulo,
    n.descripcion,
    n.tipo,
    n.estado,
    new Date(n.fecha_creacion).toLocaleString('es-ES'),
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `notificaciones_${new Date().toISOString()}.csv`
  a.click()
}

// Uso:
// const { notificaciones } = useNotificaciones()
// <Button onClick={() => exportToCSV(notificaciones)}>Descargar CSV</Button>
```

---

### 14. Búsqueda en Notificaciones

```typescript
// hooks/useNotificacionesBuscadas.ts
import { useNotificaciones } from './useNotificaciones'
import { useMemo, useState } from 'react'

export function useNotificacionesBuscadas() {
  const { notificaciones, ...rest } = useNotificaciones()
  const [query, setQuery] = useState('')

  const resultados = useMemo(() => {
    if (!query) return notificaciones

    return notificaciones.filter(n =>
      n.titulo.toLowerCase().includes(query.toLowerCase()) ||
      n.descripcion.toLowerCase().includes(query.toLowerCase())
    )
  }, [notificaciones, query])

  return {
    notificaciones: resultados,
    query,
    setQuery,
    ...rest,
  }
}
```

---

### 15. Sincronizar Múltiples Tabs

```typescript
// hooks/useNotificacionesSincronizadas.ts
import { useNotificaciones } from './useNotificaciones'
import { useEffect } from 'react'

export function useNotificacionesSincronizadas() {
  const { fetchNoLeidas, ...rest } = useNotificaciones()

  useEffect(() => {
    // Escuchar storage changes (otro tab actualizado)
    const handleStorageChange = () => {
      fetchNoLeidas()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchNoLeidas])

  return { fetchNoLeidas, ...rest }
}
```

---

## 📚 Conclusión

Estos ejemplos muestran cómo extender y personalizar el sistema de notificaciones según tus necesidades:

- ✅ Mostrar en diferentes lugares
- ✅ Agregar filtros y búsqueda
- ✅ Integrar sonidos y toasts
- ✅ Paginar y exportar
- ✅ Sincronizar entre tabs
- ✅ Y mucho más...

¡Úsalos como base para tus propias implementaciones!

