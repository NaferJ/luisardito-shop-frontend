# Luisardito Shop - Frontend

Interfaz web moderna desarrollada en Next.js para sistema de puntos gamificado con integración de plataformas de streaming, tienda de recompensas y panel de administración.

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.8-teal)](https://chakra-ui.com/)

## Descripción

Aplicación web completa para gestión de puntos y recompensas en comunidades de streaming. Incluye autenticación OAuth, catálogo de productos con visualización dinámica, sistema de redenciones, leaderboards históricos y panel administrativo completo.

Proyecto en producción con usuarios activos en [https://shop.luisardito.com](https://shop.luisardito.com)

## Stack Tecnológico

- Framework: Next.js 15.5.9 con App Router  
- Lenguaje: TypeScript 5.x  
- UI Library: Chakra UI 2.8.19 + Framer Motion 6.5.1  
- Gestión de Estado: React Query 5.85.5  
- Autenticación: JWT + OAuth 2.0 (PKCE)  
- HTTP Client: Axios 1.11.0  
- Deployment: Docker + GitHub Actions CI/CD  
- Cloudinary: Gestión de imágenes en la nube  

## Características Principales

- Sistema de autenticación con Discord y Kick usando flujo OAuth PKCE  
- Catálogo de productos responsive con tarjetas interactivas  
- Sistema completo de carrito y redenciones  
- Leaderboards con visualización de rankings históricos y actuales  
- Visualización de historial de watchtime por usuario  
- Panel administrativo con gestión de:
  - Usuarios y permisos  
  - Productos con carga de imágenes a Cloudinary  
  - Redenciones con estados (pendiente, completada, cancelada)  
  - Promociones con fechas de inicio y fin  
  - Configuración de puntos de Kick  
- Notificaciones en tiempo real  
- Diseño responsive optimizado para móviles y desktop  
- Dark mode integrado con Chakra UI  
- Middleware de autenticación para rutas protegidas  

## Deployment con Docker

El proyecto incluye configuración completa de Docker:

- Multi-stage build optimizado para producción  
- Variables de entorno configurables en tiempo de build para Next.js  
- Imagen final ligera basada en Node.js 20-bookworm-slim  
- Health checks y logging configurado  

Docker Compose configurado para:

- Integración con backend API  
- Variables de entorno para URLs y configuración de terceros  
- Volúmenes para desarrollo local  

## CI/CD

Pipeline automatizado mediante GitHub Actions:

- Calidad de Código: Verificación con ESLint y Prettier en cada push  
- Build de Producción: Compilación de Next.js en workflow  
- Deployment: Despliegue automático a VPS al hacer merge a main  
- Actualización de Imagen Docker: Build y deploy de contenedor optimizado  

## Estructura del Proyecto

```
├── components/          # Componentes React reutilizables
│   ├── admin/          # Componentes del panel administrativo
│   ├── layout/         # Layout y navegación
│   └── ui/             # Componentes UI genéricos
├── pages/              # Páginas Next.js
│   ├── admin/          # Rutas administrativas
│   ├── auth/           # Páginas de autenticación
│   └── api/            # API routes
├── lib/                # Utilidades y configuración
│   ├── api.ts          # Cliente HTTP configurado
│   ├── kickApi.ts      # APIs de Kick
│   └── cookies.ts      # Gestión de cookies
├── hooks/              # Custom React hooks
├── types/              # Definiciones TypeScript
├── utils/              # Funciones auxiliares
├── styles/             # Estilos globales
└── theme/              # Tema personalizado Chakra UI
```

## Seguridad

- Autenticación basada en JWT con refresh automático  
- Flujo OAuth 2.0 PKCE para autenticación de terceros  
- Variables de entorno para todas las credenciales  
- Middleware de Next.js para protección de rutas  
- Gestión segura de cookies con httpOnly y secure flags  
- Validación de tokens en cliente y servidor  
- CORS configurado para orígenes confiables  

## Rendimiento

- Server-side rendering con Next.js para SEO optimizado  
- Static generation para páginas públicas  
- Lazy loading de imágenes con next/image  
- React Query para caché de datos de API  
- Code splitting automático por página  
- Optimización de imágenes con Cloudinary  
- Bundle size optimizado con tree shaking  

## Integración con Backend

El frontend se comunica con la API REST del backend:

- Endpoints centralizados en `lib/api.ts`  
- Gestión automática de tokens de autenticación  
- Reintentos automáticos en caso de fallo  
- Manejo de errores centralizado  
- Refresh automático de tokens expirados  

## Licencia

Este software y su código fuente son propiedad exclusiva de NaferJ. Queda estrictamente prohibido el uso, copia, distribución, modificación o publicación sin autorización expresa y por escrito del titular.

## Autor

<img src="https://github.com/NaferJ.png" width="120" style="border-radius: 10px;" />

**NaferJ**

GitHub: [https://github.com/NaferJ](https://github.com/NaferJ)  
Proyecto en Producción: [https://shop.luisardito.com](https://shop.luisardito.com)  

Para el repositorio del backend, ver luisardito-shop-backend

[NaferJ/luisardito-shop-backend](https://github.com/NaferJ/luisardito-shop-backend)
