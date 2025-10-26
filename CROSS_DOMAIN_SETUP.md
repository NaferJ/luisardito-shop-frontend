# Configuración Backend para Cookies Cross-Domain

## Archivo: backend/middleware/cors.js o similar

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests de subdominios de luisardito.com
    const allowedOrigins = [
      'https://luisardito.com',
      'https://shop.luisardito.com',
      'https://www.luisardito.com',
      'http://localhost:3000', // Para desarrollo
      'http://127.0.0.1:3000'  // Para desarrollo
    ];
    
    // Permitir requests sin origin (para apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // IMPORTANTE: Permitir cookies cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // Cache preflight por 24 horas
};

module.exports = cors(corsOptions);
```

## Archivo: backend/routes/auth.js o similar

```javascript
// En el endpoint de login
app.post('/api/auth/login', async (req, res) => {
  try {
    // ... lógica de autenticación ...
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Configurar cookies con dominio compartido
    const cookieOptions = {
      httpOnly: false, // Permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS en producción
      sameSite: 'lax', // Permitir cross-site para subdominios
      domain: process.env.NODE_ENV === 'production' ? '.luisardito.com' : 'localhost',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    };
    
    res.cookie('auth_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000 // 90 días para refresh
    });
    
    res.json({
      accessToken,
      refreshToken,
      user,
      expiresIn: '30d'
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// En el endpoint de logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    // Limpiar cookies
    const clearOptions = {
      domain: process.env.NODE_ENV === 'production' ? '.luisardito.com' : 'localhost',
      path: '/'
    };
    
    res.clearCookie('auth_token', clearOptions);
    res.clearCookie('refresh_token', clearOptions);
    
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Variables de entorno (.env)

```env
# Agregar estas variables
COOKIE_DOMAIN=.luisardito.com
FRONTEND_URLS=https://luisardito.com,https://shop.luisardito.com
```

## IMPORTANTE: Configuración del servidor web

Si usas Nginx, agregar en la configuración:

```nginx
# Para shop.luisardito.com
server {
    listen 443 ssl;
    server_name shop.luisardito.com;
    
    # Configuración SSL...
    
    # Headers para cookies cross-domain
    add_header Access-Control-Allow-Origin "https://luisardito.com" always;
    add_header Access-Control-Allow-Credentials "true" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    
    location / {
        # Tu configuración actual...
    }
}
```
