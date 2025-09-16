import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from '@chakra-ui/react'
import theme from '../theme/theme'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Ensure the initial color mode matches on first paint to avoid hydration mismatches */}
        <ColorModeScript initialColorMode={(theme as any).config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
