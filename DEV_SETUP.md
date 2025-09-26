# Guía de Desarrollo Local

## Configuración Recomendada (Más Rápida)

### Backend + DB en Docker, Frontend Nativo

Esta es la configuración más eficiente para desarrollo:

1. **Backend**: Corre en Docker (incluye base de datos)
2. **Frontend**: Corre nativo con `npm run dev`

## Setup Inicial

### 1. Instalar Dependencias del Frontend
```bash
npm install
```

### 2. Configurar Variables de Entorno
Asegúrate de tener el archivo `.env.development` con la configuración local.

### 3. Levantar Backend (en Docker)
En el directorio del backend:
```bash
docker-compose up
```
El backend estará disponible en: `http://localhost:3001`

### 4. Levantar Frontend (Nativo)
En este directorio:
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:3002`

## Ventajas de Esta Configuración

✅ **Hot reload instantáneo** en el frontend
✅ **No esperar 5+ minutos** en cada cambio
✅ **Fácil debugging** del frontend
✅ **Base de datos y backend aislados** en Docker
✅ **Configuración de producción intacta**

## Alternativa: Todo en Docker (Más Lento)

Si necesitas usar Docker para el frontend:

```bash
# Usar la versión optimizada
docker-compose -f docker-compose.dev.yml up

# O la versión original (más lenta)
docker-compose up
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo (puerto 3002)
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter

## Configuración API

El frontend apunta automáticamente a:
- **Desarrollo**: `http://localhost:3001` (backend local)
- **Producción**: Variable `NEXT_PUBLIC_API_URL`

No necesitas cambiar nada en el código para desarrollo local.

## Troubleshooting

### El frontend no encuentra el backend
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Revisa el archivo `.env.development`

### Puerto ocupado
- El frontend usa puerto `3002` por defecto
- El backend debe usar puerto `3001`
- Cambia los puertos en caso de conflicto
