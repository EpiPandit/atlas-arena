import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    backgroundColor: 'secondary.200',
    borderRadius: 'sm',
    boxShadow: 'sm',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    padding: 2,
    bgSize: 'cover',
    bgPos: 'center',
    height: '160px',
    position: 'relative',
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      width: { base: 'full', md: '304px' },
      height: '160px',
    },
  }),
};

const variants = {
  withImageHeader: definePartsStyle({
    header: {
      bgSize: 'cover',
      bgPos: 'center',
    },
    container: {
      backgroundColor: 'secondary.200',
    },
  }),
};

export default defineMultiStyleConfig({ baseStyle, sizes, variants });
