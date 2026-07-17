import "@/styles/globals.css";
import "@/styles/tailwind-v2.css";
import { Manrope } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../hooks/useAuth'
import type { AppProps } from "next/app";
import theme from '../theme/theme'
import Head from 'next/head'
import Script from 'next/script'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

// Importar utilidades de debugging (se auto-registran globalmente)
import '../lib/authHealthCheck'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.variable}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-41BXX3T8F1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-41BXX3T8F1');
        `}
      </Script>
      <Head>
        <title>Luisardito Shop</title>
      </Head>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </div>
  );
}
