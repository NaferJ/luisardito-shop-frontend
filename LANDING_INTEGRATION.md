# 🔗 Integración: Cómo Agregar Landing Page al Navbar Existente

## Opción 1: Agregar enlace en el Navbar (Recomendado)

Si quieres que los usuarios puedan navegar a la landing page desde tu navbar actual, puedes agregar un botón o enlace.

### Modificación del Navbar (`components/Navbar.tsx`)

Agrega un nuevo enlace o botón que dirija a `/landing`:

```typescript
import NextLink from 'next/link'

// Dentro de tu componente Navbar, añade:
<NextLink href="/landing">
  <Button
    variant="ghost"
    size="sm"
    colorScheme="blue"
  >
    Visitar Landing
  </Button>
</NextLink>
```

---

## Opción 2: Establecer la Landing Page como Página Principal

Si quieres reemplazar completamente tu página actual (`pages/index.tsx`) con la landing:

### 1. Respaldar la página actual
```bash
# Copia de seguridad
cp pages/index.tsx pages/index.backup.tsx
```

### 2. Opción A: Redirigir completamente
En `pages/index.tsx`:
```typescript
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/landing')
  }, [router])
  
  return null
}
```

### 3. Opción B: Mostrar la landing si no está autenticado
En `pages/index.tsx`:
```typescript
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Landing from './landing'
import { Layout } from '../components/Layout'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Si está autenticado, mostrar la tienda actual
  if (!loading && user) {
    // Aquí va tu contenido actual de index.tsx
    return <Layout>{/* Tu tienda */}</Layout>
  }

  // Si no está autenticado, mostrar landing
  if (!loading) {
    return <Landing />
  }

  return null
}
```

---

## Opción 3: Crear una Ruta Alternativa

Mantén ambas páginas:
- `/` - Tu página principal actual (tienda)
- `/landing` - Landing page pública
- `/inicio` - Otra opción si lo necesitas

---

## Cambiar Rutas en Componentes de Landing

Si necesitas cambiar las rutas que usa la landing (login, register, etc.):

### En `components/LandingPage.tsx`, busca y modifica:

```typescript
// Cambiar:
<NextLink href="/register">

// Por:
<NextLink href="/tu-ruta-registrada">
```

Ejemplos:
```typescript
// Si tu ruta es /auth/register
<NextLink href="/auth/register">

// Si es /signup
<NextLink href="/signup">
```

---

## Agregar Analytics a los CTAs

Para rastrear clics en los botones CTA:

```typescript
// En LandingPage.tsx, dentro de HeroSection:

const handleCTAClick = (destination: string) => {
  // Aquí puedes agregar analytics
  console.log(`CTA clicked: ${destination}`)
  // Si usas Google Analytics:
  // gtag('event', 'cta_click', { destination })
}

// Luego en los botones:
<NextLink href="/register">
  <Button onClick={() => handleCTAClick('register')}>
    Start free trial
  </Button>
</NextLink>
```

---

## Personalizar Colores de la Landing

Los colores se definen en cada componente usando `useColorModeValue`:

```typescript
const accentColor = useColorModeValue('emerald.400', 'emerald.300')
```

Para cambiar a otro color (ej: blue):
```typescript
const accentColor = useColorModeValue('blue.400', 'blue.300')
```

Opciones de colores Chakra UI:
- `emerald` (actual)
- `blue`
- `purple`
- `pink`
- `orange`
- `green`

---

## Agregar Logo Real

En `components/LandingPage.tsx`, dentro de `LandingNavbar`:

```typescript
// Cambiar esto:
<Box w={6} h={6} borderRadius="md" bg={accentColor} />

// Por tu logo:
<Image 
  src="/images/logo.png" 
  alt="Luisardito" 
  w={6} 
  h={6} 
/>
```

---

## Cambiar Contenido Lorem Ipsum

### Para cambiar el hero:

En `components/LandingPage.tsx`:
```typescript
export const loremContent = {
  short: 'Tu tagline aquí',
  medium: 'Tu descripción aquí',
  // ...
}
```

### Para cambiar features:
```typescript
export const featuresList = [
  { 
    title: 'Tu Feature 1', 
    description: 'Descripción aquí' 
  },
  // ...
]
```

### Para cambiar FAQ:
```typescript
export const faqItems = [
  { 
    question: 'Tu pregunta?', 
    answer: 'Tu respuesta aquí' 
  },
  // ...
]
```

---

## Agregar Mock Images/Componentes

En lugar de los `Box` grises (mock), puedes agregar:

### Imagen fija:
```typescript
<Image 
  src="/images/dashboard-screenshot.png" 
  alt="Dashboard" 
  w="full" 
  h="256px" 
  objectFit="cover" 
  borderRadius="xl"
/>
```

### Componente personalizado:
```typescript
<CustomDashboardComponent />
```

### Video embed:
```typescript
<Box
  as="iframe"
  src="https://youtube.com/embed/VIDEO_ID"
  w="full"
  h="256px"
  borderRadius="xl"
/>
```

---

## Testing

Para verificar que la landing se ve bien:

```bash
# En desarrollo
npm run dev

# Abre: http://localhost:3002/landing

# Verifica:
# - ✓ Navbar visible
# - ✓ Hero section
# - ✓ Todas las secciones visible
# - ✓ Responsive en mobile
# - ✓ Dark/light mode
# - ✓ Clicks en botones
```

---

## Solución de Problemas

### "No funciona la landing"
1. Verifica que `pages/landing.tsx` existe
2. Verifica que `components/LandingPage.tsx` existe
3. Reinicia el servidor de desarrollo: `npm run dev`

### "Los estilos no se ven"
1. Verifica que Chakra UI está importado
2. Verifica que el provider está en `_app.tsx`
3. Limpia cache: `rm -rf .next && npm run dev`

### "El botón no funciona"
1. Verifica que Next/Link está importado
2. Verifica que la ruta existe (`/login`, `/register`)

---

## 🎉 ¡Listo!

Tu landing page está lista para usar. Puedes visitarla en:
```
http://localhost:3002/landing
```

¿Necesitas más ayuda? Revisa los archivos:
- `pages/landing.tsx` - Página principal
- `components/LandingPage.tsx` - Componentes reutilizables
- `LANDING_PAGE_SETUP.md` - Documentación general

