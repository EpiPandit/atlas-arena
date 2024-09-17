import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  colors: {
    gray: {
      700: '#1f2733',
    },
    yellow: {
      10: '#f9f7f4',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      600: '#24388a',
      700: '#1b254b',
      800: '#111c44',
      900: '#0b1437',
    },
    brand: {
      100: '#f7fafc',
      900: '#1a202c',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('yellow.50', '#FFFFF0')(props),
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '12px',
      },
      html: {
        fontFamily: 'Helvetica, sans-serif',
      },
    }),
  },
});
export default theme;
