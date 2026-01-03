# 🗺️ MAPA DE LA LANDING PAGE

## Estructura Completa con Rutas

```
http://localhost:3002/landing
│
├─ NAVBAR (LandingNavbar)
│  ├─ Logo / Home → /landing
│  ├─ Links de navegación
│  │  ├─ Features → #features (scroll)
│  │  ├─ Why → #people (scroll)
│  │  ├─ Blog → #blog (scroll)
│  │  └─ Docs → #docs (scroll)
│  └─ Auth
│     ├─ Login → /login
│     └─ Start free trial → /register
│
├─ HERO SECTION (HeroSection)
│  ├─ Tagline: "An alternative to traditional platforms"
│  ├─ Headline: "Fast, private, realtime web analytics"
│  ├─ Description: Lorem ipsum
│  ├─ CTA 1: "Start free trial" → /register
│  ├─ CTA 2: "See demo" → #
│  ├─ Benefit: "No credit card required"
│  ├─ Mock Dashboard Image (vacío)
│  └─ 3-Column Features Grid
│     ├─ GDPR compliant
│     ├─ No cookie banners
│     └─ Simple setup
│
├─ PEOPLE SECTION (ContentSection #people)
│  ├─ Label: "People"
│  ├─ Title: "Understand your visitors..."
│  ├─ Description: Lorem ipsum
│  └─ Mock Image (derecha)
│
├─ PERFORMANCE SECTION (ContentSection #performance)
│  ├─ Mock Image (izquierda - invertida)
│  ├─ Label: "Performance"
│  ├─ Title: "Website performance..."
│  └─ Description: Lorem ipsum
│
├─ REALTIME SECTION (ContentSection #realtime)
│  ├─ Label: "Realtime"
│  ├─ Title: "Experience your live visitors..."
│  ├─ Description: Lorem ipsum
│  ├─ Bullet List (3 items)
│  └─ Mock Image (derecha)
│
├─ PRICING SECTION (PricingSection #pricing)
│  ├─ Title: "Simplified pricing"
│  ├─ Description: Lorem ipsum
│  ├─ Toggle: Monthly / Annually -20%
│  └─ Pricing Card
│     ├─ Price: $9 per month
│     ├─ Events: 10,000
│     ├─ Features (3)
│     ├─ CTA: "Start free trial" → /register
│     └─ Note: "No credit card required"
│
├─ FAQ SECTION (FAQSection #faq)
│  ├─ Title: "Frequently asked questions"
│  └─ 5 Expandible Items
│     ├─ Is this platform GDPR compliant?
│     ├─ How long does data retention last?
│     ├─ Can I use this on multiple websites?
│     ├─ What payment methods do you accept?
│     └─ Is there a free trial available?
│
├─ CTA FINAL SECTION (CTASection)
│  ├─ Title: "A new age of web analytics"
│  ├─ Description: Lorem ipsum
│  ├─ CTA 1: "Start free trial" → /register
│  ├─ CTA 2: "See demo" → #
│  └─ Tagline: "Built with passion..."
│
└─ FOOTER (LandingFooter)
   ├─ Brand Column
   │  ├─ Logo + Name
   │  ├─ © 2026
   │  └─ Operational Status
   ├─ Product Column
   │  ├─ Home
   │  ├─ Login
   │  ├─ Register
   │  └─ Docs
   ├─ Features Column
   │  ├─ Analytics
   │  ├─ Realtime
   │  ├─ Performance
   │  └─ Profiles
   ├─ Company Column
   │  ├─ Contact
   │  ├─ Privacy
   │  └─ Terms
   └─ Social Column
      ├─ Twitter
      ├─ GitHub
      └─ Discord
```

---

## Componentes Utilizados

| Componente | Archivo | Localización | Props |
|-----------|---------|--------------|-------|
| `LandingNavbar` | LandingPage.tsx | Arriba | - |
| `HeroSection` | LandingPage.tsx | Hero | - |
| `ContentSection` | LandingPage.tsx | Contenido | id, label, title, description, imagePosition, showList |
| `PricingSection` | LandingPage.tsx | Precios | - |
| `FAQSection` | LandingPage.tsx | FAQ | - |
| `CTASection` | LandingPage.tsx | CTA | - |
| `LandingFooter` | LandingPage.tsx | Footer | - |

---

## Variables Exportadas

```typescript
// En components/LandingPage.tsx:

export const loremContent = {
  short: '...',
  medium: '...',
  long: '...',
  longList: ['...', '...', '...']
}

export const featuresList = [
  { title: '...', description: '...' },
  { title: '...', description: '...' },
  { title: '...', description: '...' }
]

export const faqItems = [
  { question: '...?', answer: '...' },
  // ... 5 total
]
```

---

## Flujos de Navegación

### Flujo de Registro
```
Landing Page
    ↓
[Start Free Trial] Button
    ↓
/register Page
```

### Flujo de Login
```
Landing Page Navbar
    ↓
[Login] Link
    ↓
/login Page
```

### Navegación Interna (Scroll)
```
Navbar Links
    ↓
#people, #performance, #realtime, #pricing, #faq
    ↓
Smooth Scroll a la Sección
```

---

## Responsive Breakpoints

| Tamaño | Dispositivo | Layout |
|--------|-----------|--------|
| < 768px | Mobile | 1 columna, stack vertical |
| 768px - 1024px | Tablet | 2 columnas, ajustado |
| > 1024px | Desktop | 2 columnas, full width |

---

## Dark Mode Adaptación

```typescript
// Light Mode (por defecto)
const bgColor = 'white'           // Fondo blanco
const textColor = 'gray.800'      // Texto oscuro
const accentColor = 'emerald.400' // Acentos verdes

// Dark Mode (automático)
const bgColor = 'gray.950'         // Fondo casi negro
const textColor = 'gray.50'        // Texto claro
const accentColor = 'emerald.300'  // Acentos verde claro
```

El cambio es **automático** según el sistema del usuario.

---

## Archivos de Contenido

| Archivo | Responsable de |
|---------|---|
| `loremContent.short` | Taglines y subtítulos |
| `loremContent.medium` | Descripciones principales |
| `loremContent.long` | Textos extensos (no usado actualmente) |
| `loremContent.longList` | Listas de beneficios |
| `featuresList` | Grid de features en hero |
| `faqItems` | Preguntas frecuentes (5) |

---

## Modificaciones Comunes

### Cambiar un título
```typescript
// En HeroSection():
"Fast, private, realtime web analytics"
↓ Cambiar por:
"Tu nuevo título aquí"
```

### Agregar más preguntas FAQ
```typescript
// En export const faqItems:
export const faqItems = [
  { question: 'Pregunta 1?', answer: 'Respuesta 1' },
  { question: 'Pregunta 2?', answer: 'Respuesta 2' },
  // AGREGAR AQUÍ:
  { question: 'Pregunta 6?', answer: 'Respuesta 6' },
]
```

### Cambiar precio
```typescript
// En PricingSection():
$9 per month
↓ Cambiar por:
$4.99 per month
```

### Cambiar imágenes mock
```typescript
// Reemplazar este:
<Box h="256px" w="full" borderRadius="xl" bg={cardBg} />

// Con esto:
<Image 
  src="/images/tu-imagen.png" 
  alt="Descripción" 
  w="full" 
  h="256px" 
  objectFit="cover"
/>
```

---

## Eventos y Acciones

| Acción | Destino | Componente |
|--------|---------|-----------|
| Logo click | /landing | Navbar |
| Login click | /login | Navbar |
| Start trial click | /register | Navbar, Hero, Pricing, CTA |
| See demo click | # | Hero, CTA |
| Link click (navbar) | Scroll a #id | Navbar |
| FAQ expand | Toggle contenido | FAQ |
| Pricing toggle | Monthly ↔ Yearly | Pricing |

---

## Performance Optimizaciones

✅ **Sin imágenes pesadas** - Usando boxes grises como placeholders
✅ **CSS-in-JS** - Con Chakra UI, no hay archivos CSS adicionales
✅ **Code splitting** - Cada página se carga independientemente
✅ **SSR** - Next.js maneja la renderización del servidor
✅ **Zero JS libraries nuevas** - Solo tu stack actual

---

## SEO Metadata

```typescript
// En pages/landing.tsx:

<Head>
  <title>Luisardito Shop - Analytics Platform</title>
  <meta name="description" content="Fast, private, realtime web analytics" />
</Head>
```

Puedes mejorar agregando:
- Meta keywords
- Open Graph tags
- Structured data (JSON-LD)
- Canonical URLs

---

## Colores Disponibles (Chakra UI)

```
Paleta Primaria: emerald.{50-900}
Paleta Secundaria: gray.{50-900}
Otras opciones: blue, purple, red, pink, orange, green, yellow, etc.
```

---

## Conclusión

Tu landing page está **estructurada de forma profesional** y lista para:
- ✅ Verse en tiempo real
- ✅ Ser personalizada fácilmente
- ✅ Recibir contenido real
- ✅ Escalar en funcionalidades

¡Navega a `/landing` y disfruta! 🚀

