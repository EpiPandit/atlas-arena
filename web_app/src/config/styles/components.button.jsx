import { defineStyleConfig } from '@chakra-ui/react';

// Chakra's default solid blue button (white on blue.500, #3776ED) measures
// 4.21:1, under the 4.5:1 WCAG AA minimum. Shift the solid blue scheme one
// step darker so white text passes (blue.600 = 5.11:1).
const variants = {
  solid: ({ colorScheme }) => {
    if (colorScheme !== 'blue') return {};
    return {
      bg: 'blue.600',
      color: 'white',
      _hover: {
        bg: 'blue.700',
        _disabled: { bg: 'blue.600' },
      },
      _active: { bg: 'blue.800' },
    };
  },
};

export default defineStyleConfig({ variants });
