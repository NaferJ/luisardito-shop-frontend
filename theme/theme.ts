import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const colors = {
  brand: {
    50: '#f6f8fa', // GitHub light canvas
    100: '#eaeef2',
    200: '#d0d7de', // border-subtle
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#0d1117', // GitHub dark canvas
  },
}

const semanticTokens = {
  colors: {
    'bg.canvas': {
      default: 'white',
      _dark: 'brand.900',
    },
    'bg.subtle': {
      default: 'brand.50',
      _dark: 'brand.800',
    },
    'border.default': {
      default: 'brand.200',
      _dark: 'brand.700',
    },
    'text.primary': {
      default: '#24292f',
      _dark: '#c9d1d9',
    },
    'text.muted': {
      default: '#57606a',
      _dark: '#8b949e',
    },
    'accent.fg': {
      default: '#0969da',
      _dark: '#58a6ff',
    },
  },
}

const styles = {
  global: {
    'html, body, #__next': {
      height: '100%'
    },
    body: {
      bg: 'bg.canvas',
      color: 'text.primary',
      lineHeight: '1.5',
    },
    a: {
      color: 'accent.fg',
      _hover: { textDecoration: 'underline' },
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: 500,
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorScheme === 'gray' ? 'brand.200' : `${props.colorScheme}.500`,
        color: props.colorScheme === 'gray' ? 'text.primary' : 'white',
        _hover: {
          bg: props.colorScheme === 'gray' ? 'brand.300' : `${props.colorScheme}.600`,
        },
      }),
      subtle: {
        bg: 'bg.subtle',
        _hover: { bg: 'brand.100' },
      },
      ghost: (props: any) => ({
        color: 'text.primary',
        _hover: { bg: 'bg.subtle' },
      }),
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'border.default',
          _hover: { borderColor: 'brand.300' },
          _focusVisible: { borderColor: 'accent.fg', boxShadow: '0 0 0 1px var(--chakra-colors-accent-fg)' },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'bg.canvas',
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 'lg',
      },
    },
  },
}

const fonts = {
  heading: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
  body: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
}

const theme = extendTheme({ config, colors, semanticTokens, styles, components, fonts })
export default theme
