import { defineSlotRecipe } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/react/anatomy';

export default defineSlotRecipe({
  slots: cardAnatomy.keys(),
  base: {
    root: {
      bg: 'secondary.200',
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
  },
  variants: {
    size: {
      md: {
        root: {
          width: { base: '100%', sm: '90%', md: '304px' },
          height: { base: 'auto', md: '160px' },
        },
      },
    },
    variant: {
      withImageHeader: {
        header: {
          bgSize: 'cover',
          bgPos: 'center',
          height: { base: '140px', md: '160px' },
        },
        root: {
          bg: 'secondary.200',
          width: { base: '100%', sm: '90%', md: '304px' },
          height: { base: 'auto', md: '160px' },
        },
      },
    },
  },
});
