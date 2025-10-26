import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from '../theme/theme'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon en múltiples formatos para compatibilidad */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/images/logo2.jpg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo2.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo2.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo2.jpg" />

        {/* Meta tags para SEO y apariencia */}
        <meta name="description" content="Luisardito Shop - Tienda de puntos y canjes para la comunidad de Kick" />
        <meta name="keywords" content="tienda, puntos, canjes, kick, streaming, luisardito" />
        <meta name="author" content="Luisardito Shop" />
        <meta name="theme-color" content="#6366f1" />

        {/* Configuración para cross-origin y cookies */}
        <meta httpEquiv="Access-Control-Allow-Credentials" content="true" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph para redes sociales */}
        <meta property="og:title" content="Luisardito Shop" />
        <meta property="og:description" content="Tienda de puntos y canjes para la comunidad" />
        <meta property="og:image" content="/images/logo2.jpg" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Luisardito Shop" />
        <meta name="twitter:description" content="Tienda de puntos y canjes para la comunidad" />
        <meta name="twitter:image" content="/images/logo2.jpg" />
      </Head>
      <body>
        {/* Ensure the initial color mode matches on first paint to avoid hydration mismatches */}
        <ColorModeScript
          initialColorMode={
            (theme as { config: import('@chakra-ui/react').ThemeConfig }).config.initialColorMode
          }
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
