import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  breakpoints: {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1440px',
    '2xl': '1920px',
  },
  colors: {
    blue: {
      50: '#edf5ff',
      100: '#d7e7ff',
      200: '#b9d7ff',
      300: '#88beff',
      400: '#509bff',
      500: '#2873ff',
      600: '#0f4fff',
      700: '#0a3beb',
      800: '#0f30be',
      900: '#132f95',
    },
    secondary: {
      50: '#fbf8ef',
      100: '#f3eace',
      200: '#e8d69f',
      300: '#dcbd6d',
      400: '#d3a74c',
      500: '#ca8d36',
      600: '#b26e2d',
      700: '#945229',
      800: '#794227',
      900: '#653722',
    },
    gray: {
      50: '#f7f7f8',
      100: '#ededf1',
      200: '#d8d9df',
      300: '#b6b7c3',
      400: '#8e90a2',
      500: '#707287',
      600: '#5a5b6f',
      700: '#49495b',
      800: '#3f404d',
      900: '#383842',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('secondary.50', 'gray.900')(props),
        fontFamily:
          "'Montserrat Variable', 'EB Garamond Variable', 'sans-serif'",
      },
    }),
  },
});
export default theme;
