# Instrucciones Personalizadas para GitHub Copilot

**Última Actualización**: 5 de enero de 2026  
**Repositorio**: luisardito-shop-frontend  
**Versión**: 1.0  
**Frecuencia de Mantenimiento**: Actualizar en cambios mayores de dependencias, cambios arquitectónicos o actualizaciones de flujo de trabajo (revisión mensual recomendada)

---

## Descripción General del Proyecto

**Propósito**: Frontend para la plataforma de overlays en tiempo real y gestión de tienda para el ecosistema Luisardito, integrando autenticación con Kick, gestión de productos, promociones y overlays interactivos.

**Tipo**: Aplicación Frontend (Next.js con React)  
**Stack Tecnológico**: 
- **Frontend**: Next.js v15.5.9, React v19.1.0, TypeScript v5
- **UI**: Chakra UI v2.8.2, Framer Motion v6.5.1
- **Estado y API**: TanStack Query v5.85.5, Axios v1.11.0
- **Infraestructura**: Docker, Docker Compose, VPS Linux
- **DevOps**: GitHub Actions
- **Librerías Clave**: @chakra-ui/react, @tanstack/react-query, axios, framer-motion

**Escala del Código**: Aplicación Next.js con páginas, componentes, hooks y tipos TypeScript; <1000 archivos indexables

**Entorno Actual**: VSCode con extensión GitHub Copilot + integración navegador; Perplexity Pro para investigación profunda

---

## Estructura de Directorios y Rutas Clave

```
luisardito-shop-frontend/
├── components/
│   ├── ActionsMenu.tsx
│   ├── AdminDynamicTable.tsx
│   ├── BroadcasterPanel.tsx
│   ├── ColorModeToggle.tsx
│   ├── Countdown.tsx
│   ├── CuponInput.tsx
│   ├── Footer.tsx
│   ├── ImageUpload.tsx
│   ├── LandingPage.tsx
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── NavbarContent.tsx
│   ├── NotificacionesModal.tsx
│   ├── NotificationBell.tsx
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── ProductFormPreview.tsx
│   ├── RequireAdmin.tsx
│   ├── RequireAuth.tsx
│   ├── SearchUserCombobox.tsx
│   ├── StyledModal.tsx
│   ├── TransparentCard.tsx
│   ├── UserBadge.tsx
├── hooks/
│   ├── useAdminCanjes.ts
│   ├── useAdminUsuario.ts
│   ├── useAdminUsuarioCanjes.ts
│   ├── useAdminUsuarios.ts
│   ├── useAuth.tsx
│   ├── useBotCommands.ts
│   ├── useBroadcasterInfo.ts
│   ├── useCanjes.ts
│   ├── useHistorialPuntos.ts
│   ├── useKickAdminConfig.ts
│   ├── useKickAuth.tsx
│   ├── useKickBroadcaster.ts
│   ├── useKickPointsConfig.ts
│   ├── useKickSubscriptions.ts
│   ├── useNotificaciones.ts
│   ├── useProducto.ts
│   ├── useProductoPromociones.ts
│   ├── useProductos.ts
│   ├── useProductosAdmin.ts
│   ├── usePromocion.ts
│   ├── usePromociones.ts
│   ├── usePublicKickPointsConfig.ts
├── lib/
│   ├── api.ts
│   ├── authHealthCheck.ts
│   ├── cookies.ts
│   ├── kickApi.ts
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── 404.tsx
│   ├── canjes.tsx
│   ├── comandos.tsx
│   ├── dev.tsx
│   ├── historial.tsx
│   ├── index.tsx
│   ├── landing.tsx
│   ├── leaderboard.tsx
│   ├── login.tsx
│   ├── perfil.tsx
│   ├── promociones.tsx
│   ├── admin/
│   │   ├── canjes/
│   │   │   └── index.tsx
│   │   ├── comandos/
│   │   │   └── index.tsx
│   │   ├── kick/
│   │   │   ├── index-old.tsx
│   │   │   ├── index.tsx
│   │   │   ├── puntos-old.tsx
│   │   │   ├── puntos.tsx
│   │   ├── productos/
│   │   │   ├── index.tsx
│   │   │   ├── nuevo.tsx
│   │   │   ├── [id]/
│   │   │       └── editar.tsx
│   │   ├── promociones/
│   │   │   ├── crear.tsx
│   │   │   ├── index.tsx
│   │   │   ├── [id]/
│   │   │       ├── editar.tsx
│   │   │       └── estadisticas.tsx
│   │   ├── usuarios/
│   │       ├── [id].tsx
│   │       └── index.tsx
│   ├── api/
│   │   └── hello.ts
│   ├── auth/
│   │   ├── callback.tsx
│   │   └── dev-login.tsx
│   ├── productos/
│   │   ├── [slug].tsx
│   │   └── index.tsx
├── public/
│   ├── manifest.json
│   ├── images/
├── styles/
│   ├── globals.css
│   ├── Home.module.css
├── theme/
│   └── theme.ts
├── types/
│   └── index.ts
├── utils/
│   └── cloudinary.ts
│   └── slug.ts
├── docker-compose.frontend.yml
├── Dockerfile
├── eslint.config.mjs
├── instrucciones-copilot.md
├── LICENSE
├── luisardito-shop.postman_collection.json
├── luisardito-shop.postman_environment.json
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── tsconfig.json
```

---

## Comandos de Build, Test y Validación

### Prerrequisitos
```bash
# Verifica versiones requeridas (exactas para evitar incompatibilidades)
node --version          # Esperado: v20+
npm --version           # Esperado: v9.0.0+
docker --version        # Esperado: Docker 24.0+
docker-compose --version # Esperado: v2.20+
```

### 1. Bootstrap y Dependencias

**SIEMPRE ejecuta estos comandos PRIMERO antes de cualquier otro paso:**

```bash
# Instalación limpia (recomendado para CI/CD o checkout nuevo)
npm ci

# O instalación estándar (desarrollo local)
npm install

# Nota: package-lock.json debe estar comprometido; no elimines node_modules manualmente
# Si hay problemas de dependencias: rm -rf node_modules && npm ci
```

### 2. Entorno de Desarrollo

```bash
# Inicia servidor local con recarga en caliente en puerto 3002
npm run dev
# Salida esperada: "Ready - started server on 0.0.0.0:3002"
# Toma ~10-15 segundos en iniciarse

# Si usas Docker Compose para stack completo
docker-compose -f docker-compose.frontend.yml up
# Servicios: app (puerto 3002)
# Nota: Primera ejecución puede tomar 1-2 minutos para inicializar
```

### 3. Proceso de Build

```bash
# Build de imagen Docker
docker build -t luisardito-shop-frontend:latest .

# Etiqueta para registro (si usas GitHub Container Registry)
docker tag luisardito-shop-frontend:latest ghcr.io/tu-usuario/luisardito-shop-frontend:latest
docker push ghcr.io/tu-usuario/luisardito-shop-frontend:latest
```

### 4. Testing

```bash
# Ejecuta pruebas (actualmente no implementadas)
npm test
# Salida: "No tests configured"

# Cuando se implemente, usar:
npm test -- --coverage
npm run test:watch
```

### 5. Linting y Calidad de Código

```bash
# Ejecuta ESLint
npm run lint

# Formatea código con Prettier
npm run format
npm run format:fix
```

### 6. Validación Completa Pre-commit (Pipeline Completo)

```bash
# Esto es lo que GitHub Actions ejecuta—replícalo localmente antes de push:
npm ci                          # Instalación limpia
npm run lint                    # Linting
npm test                        # Pruebas (actualmente no implementadas)
docker build -t luisardito-shop-frontend:test .  # Build de Docker

# Tiempo total esperado: 1-2 minutos
# Todos los pasos deben pasar para merge exitoso
```

### 7. Validación de Docker

```bash
# Build y test de imagen Docker localmente
docker build -t luisardito-shop-frontend:test .

# Ejecuta contenedor con variables de entorno
docker run -p 3002:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  luisardito-shop-frontend:test

# Verifica que el servicio esté saludable
curl http://localhost:3002
# Respuesta esperada: HTML de la página principal
```

---

## Arquitectura y Patrones Clave

### Arquitectura del Frontend (Next.js)
- **Páginas y Rutas**: Estructura de páginas en `/pages` con rutas dinámicas
- **Componentes**: Reutilizables en `/components`, hooks personalizados en `/hooks`
- **Estado**: TanStack Query para gestión de estado del servidor, contexto React para estado local
- **API**: Axios para llamadas HTTP, rewrites en Next.js para proxy a backend
- **Autenticación**: Middleware para rutas protegidas, integración con Kick OAuth
- **UI**: Chakra UI con tema personalizado, Framer Motion para animaciones

### Integraciones
- **API Backend**: Proxy a backend via rewrites en Next.js
- **Kick Integration**: OAuth para autenticación, APIs para broadcaster info
- **Cloudinary**: Subida de imágenes
- **WebSockets**: Para notificaciones en tiempo real (potencial futura)

### Patrón de Componentes

```tsx
// components/ProductCard.tsx
import { Box, Image, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={product.image} alt={product.name} />
      <Box p="6">
        <Text fontWeight="bold">{product.name}</Text>
        <Text>${product.price}</Text>
        <Button onClick={() => router.push(`/productos/${product.id}`)}>
          Ver Detalles
        </Button>
      </Box>
    </Box>
  );
}
```

### Patrón de Hooks Personalizados

```tsx
// hooks/useProductos.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useProductos() {
  return useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await axios.get('/api/productos');
      return data;
    },
  });
}
```

---

## Variables de Entorno y Configuración

### Variables de Entorno Requeridas (Siempre establecer antes de desplegar)

```bash
# .env.local (desarrollo) o .env.frontend.production (producción)

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Config
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=Luisardito Shop
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_ENABLE_DEBUG=false

# Kick OAuth
NEXT_PUBLIC_KICK_CLIENT_ID=
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3002/auth/callback
NEXT_PUBLIC_KICK_OAUTH_URL=https://kick.com/oauth/authorize
NEXT_PUBLIC_KICK_TOKEN_URL=https://kick.com/oauth/token
NEXT_PUBLIC_KICK_USER_URL=https://kick.com/api/v1/users/me
NEXT_PUBLIC_KICK_SCOPE=channel:read

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### Desarrollo Local (.env.local)

```bash
# Simplificado para testing local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**Prioridad de Configuración**: Variables de entorno > defaults en next.config.ts

---

## Pipeline de CI/CD y GitHub Actions

### Verificaciones Automatizadas (GitHub Actions)

**Ubicación**: `.github/workflows/ci.yml` y `prod-cd.yml`

**Se activa en**: `git push` a `dev` o pull requests; `push` a `main` para CD

**Etapas del pipeline CI**:
1. **Instalación de Dependencias** (npm ci)
2. **Linting** (npm run lint)
3. **Pruebas** (npm test)
4. **Build de Docker** → Construye imagen Docker con build args

**Etapas del pipeline CD**:
1. **Build de Docker** con secrets de producción
2. **Copia imagen a servidor de producción** via SCP
3. **Despliegue** con docker-compose

### Despliegue Manual

```bash
# Despliega a VPS de producción
git push origin main

# O despliegue manual por CLI (si está disponible)
npm run build
docker-compose -f docker-compose.frontend.yml up -d

# Verifica despliegue
curl https://frontend.luisardito.com
```

### Monitoreo y Rollback

- **Logs**: Docker logs para contenedor
- **Health Checks**: Endpoint `/` (página principal)

---

## Patrones de Codificación Comunes y Convenciones

### Patrón de Página Next.js

```tsx
// pages/productos/[slug].tsx
import { GetServerSideProps } from 'next';
import { useProducto } from '@/hooks/useProducto';

interface ProductoPageProps {
  slug: string;
}

export default function ProductoPage({ slug }: ProductoPageProps) {
  const { data: producto, isLoading } = useProducto(slug);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{producto?.name}</h1>
      {/* Contenido */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      slug: params?.slug as string,
    },
  };
};
```

### Conventional Commits

Todos los commits DEBEN seguir este formato (enforazado por generación de commits con Copilot):

```
<tipo>(<alcance>): <asunto> (en español o inglés)

<cuerpo> (opcional, explica por qué no qué)
```

**Tipos Válidos**: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore` | `ci`

**Ejemplos**:
- `feat(productos): agregar página de detalles de producto`
- `fix(auth): corregir redirección después de login`
- `style(components): actualizar estilos de ProductCard`

---

## Gestión de Dependencias y Seguridad

### Dependencias Críticas (No Actualizar Sin Testing)

| Dependencia | Versión | Razón | Cadencia de Actualización |
|---|---|---|---|
| Next.js | 15.5.9 | Framework principal | Semestralmente |
| React | 19.1.0 | Librería base | Semestralmente |
| @chakra-ui/react | 2.8.2 | UI components | Trimestral |
| @tanstack/react-query | 5.85.5 | Estado del servidor | Trimestral |
| Axios | 1.11.0 | Cliente HTTP | Semestralmente |
| TypeScript | 5 | Tipado | Anualmente |

### Checklist de Actualización

```bash
# Verifica paquetes obsoletos
npm outdated

# Audita vulnerabilidades de seguridad
npm audit

# Arregla vulnerabilidades de bajo riesgo
npm audit fix

# Para actualizaciones manuales
npm update <paquete>@latest
npm run lint  # Siempre verifica linting después de actualizar dependencias
```

### Excluidos de Actualizaciones Automáticas

- **Versión de Node**: Nunca saltes versiones menores (20.x → 20.y OK, pero no 20 → 21 automático)
- **Imagen base de Docker**: Usa versiones fijas (`node:20-bookworm-slim` no `node:latest`)

---

## Rendimiento y Pautas de Optimización

### Optimización del Frontend

- **Tamaño de bundle**: Mantener <2MB comprimido (rastreado en build)
- **Imágenes**: Optimización automática de Next.js, subida a Cloudinary
- **Carga perezosa**: Componentes con dynamic imports
- **Caché**: Next.js ISR para páginas estáticas

### Monitoreo

```bash
# Monitorea contenedor en ejecución
docker stats luisardito-shop-frontend  # Uso de CPU, memoria, red

# Verifica logs de la aplicación
docker-compose logs -f luisardito-shop-frontend
```

---

## Troubleshooting y Problemas Comunes

### Problema: `npm run dev` no inicia en puerto correcto

**Causa Raíz**: Puerto ocupado o configuración incorrecta  
**Solución**:
```bash
# Verifica puerto
lsof -i :3002

# Cambia puerto si necesario
npm run dev -- --port 3003
```

### Problema: Build falla por errores de TypeScript

**Causa Raíz**: Errores de tipo no resueltos  
**Solución**:
```bash
# Verifica tipos
npx tsc --noEmit

# Ignorar en build si es necesario (configurado en next.config.ts)
```

### Problema: API calls fallan en desarrollo

**Causa**: NEXT_PUBLIC_API_URL no configurado  
**Solución**:
```bash
# Verifica variable
echo $NEXT_PUBLIC_API_URL

# Asegúrate de que el backend esté corriendo en el puerto correcto
```

---

## Cadencia de Actualización y Cronograma de Mantenimiento

| Tarea | Frecuencia | Responsable | Notas |
|---|---|---|---|
| Actualizar `instrucciones-copilot.md` | Mensual o después de cambios mayores | Responsable | Revisa log de Conventional Commits para cambios arquitectónicos |
| Revisar dependencias | Semanal (npm outdated) | DevOps | Actualiza si hay patches de seguridad |
| Ejecutar pipeline de validación completa | Antes de cada merge | CI/CD | GitHub Actions lo enforza |
| Reconstruir imágenes Docker | Después de actualizaciones de dependencias | DevOps | Etiqueta con fecha (ej: `2026-01-05`) |
| Auditoría de seguridad | Mensual | Seguridad | `npm audit`, escaneos SCA |

### Cuándo Actualizar Este Documento

- **Siempre actualiza si**:
  - Nueva versión major de dependencia adoptada
  - Estructura de directorios cambia significativamente
  - Comandos de build/test se modifican
  - Se requieren nuevas variables de entorno
  - Proceso de despliegue cambia
  - Patrones de arquitectura cambian

- **Actualiza header**: Cambia fecha de "Última Actualización" después de editar
- **Número de versión**: Incrementa en cambios estructurales/contenido mayor

---

## Pro Tips para Agentes de Copilot

1. **Usa @workspace en VSCode**: Referencia explícitamente `@workspace` en Copilot Chat para asegurar que cargue el contexto del codebase
   ```
   @workspace: "Agregar componente de overlay para alertas de raid"
   ```

2. **Fija este archivo en Chat**: Adjunta `instrucciones-copilot.md` como contexto antes de tareas complejas
   ```
   "Referenciando: instrucciones-copilot.md"
   ```

3. **Para trabajo multi-repo**: Incluye etiqueta de dominio en solicitudes
   ```
   "[Frontend] Arreglar flujo de autenticación en middleware OAuth de Kick"
   ```

4. **Valida sugerencias localmente**: 
   - Desarrollo: `npm run dev` y verifica logs
   - Docker: `docker-compose up` y prueba endpoints
   - Siempre ejecuta antes de commit

5. **Valida cambios de Docker**: Usa `docker-compose -f docker-compose.frontend.yml up && curl http://localhost:3002` para verificar cambios de configuración de contenedor

---

## Soporte y Referencias

- **Documentación Next.js**: https://nextjs.org/docs
- **Documentación Chakra UI**: https://chakra-ui.com/docs
- **Documentación TanStack Query**: https://tanstack.com/query
- **Slack del Equipo**: #soporte-tecnico
- **Contactos Críticos**: lider-tecnico@luisardito.com

---

**Fin de Instrucciones para Copilot. Última revisión: 5 de enero de 2026 v1.0**