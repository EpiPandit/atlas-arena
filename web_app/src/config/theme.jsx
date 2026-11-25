import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import tabs from '@/config/styles/components.tabs';
import card from '@/config/styles/components.card';
import button from '@/config/styles/components.button';

const config = defineConfig({
  globalCss: {
    body: {
      overflowX: 'hidden',
      bg: 'secondary.50',
      color: 'gray.800',
      fontFamily: 'body',
    },
    // Keyboard focus on the map canvas, matching the theme's focus ring.
    '.maplibregl-canvas:focus-visible': {
      outline: '3px solid {colors.blue.900}',
      outlineOffset: '-3px',
    },
  },
  theme: {
    breakpoints: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
    },
    tokens: {
      colors: {
        blue: {
          50: { value: '#DAE7F7' },
          100: { value: '#B3CDF5' },
          200: { value: '#98C0F5' },
          300: { value: '#77A9E5' },
          400: { value: '#5096F2' },
          500: { value: '#3776ED' },
          600: { value: '#3564E5' },
          700: { value: '#365AD9' },
          800: { value: '#334BB5' },
          900: { value: '#2C3F85' },
        },
        secondary: {
          50: { value: '#F9FAFA' },
          100: { value: '#eef1f2' },
          200: { value: '#dae0e2' },
          300: { value: '#bdc8cc' },
          400: { value: '#95a6ac' },
          500: { value: '#70878f' },
          600: { value: '#5b6f76' },
          700: { value: '#485a60' },
          800: { value: '#364549' },
          900: { value: '#273235' },
        },
        gray: {
          50: { value: '#f7f7f8' },
          100: { value: '#ededf1' },
          200: { value: '#d8d9df' },
          300: { value: '#b6b7c3' },
          400: { value: '#8e90a2' },
          500: { value: '#707287' },
          600: { value: '#5a5b6f' },
          700: { value: '#49495b' },
          800: { value: '#3f404d' },
          900: { value: '#383842' },
        },
      },
      shadows: {
        // For custom focus states (e.g. focus-within): a 2px light gap plus a
        // 2px blue.900 ring.
        outline: { value: '0 0 0 2px #FFFFFF, 0 0 0 4px #2C3F85' },
      },
      fonts: {
        body: { value: `'Montserrat Variable', sans-serif` },
        heading: { value: `'Montserrat Variable', sans-serif` },
      },
    },
    semanticTokens: {
      colors: {
        // Focus ring color for the palettes in use. blue.900 measures 9.4:1
        // against the page background (WCAG 1.4.11 needs 3:1); v3's ring is
        // drawn 2px outside the element, leaving a light gap that keeps it
        // distinguishable from dark blue buttons.
        gray: { focusRing: { value: '{colors.blue.900}' } },
        blue: { focusRing: { value: '{colors.blue.900}' } },
      },
    },
    recipes: {
      button,
      // Keep v2's bold headings (v3 defaults to semibold).
      heading: { base: { fontWeight: 'bold' } },
    },
    slotRecipes: {
      tabs,
      card,
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
