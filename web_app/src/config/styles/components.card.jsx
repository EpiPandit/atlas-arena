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
    height: { base: '140px', md: '160px' },
    position: 'relative',
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      width: { base: '100%', sm: '90%', md: '304px' },
      height: { base: 'auto', md: '160px' },
    },
  }),
};

const variants = {
  withImageHeader: definePartsStyle({
    header: {
      bgSize: 'cover',
      bgPos: 'center',
      height: { base: '140px', md: '160px' },
    },
    container: {
      backgroundColor: 'secondary.200',
      width: { base: '100%', sm: '90%', md: '304px' },
      height: { base: 'auto', md: '160px' },
    },
  }),
};

export default defineMultiStyleConfig({ baseStyle, sizes, variants });
