import { defineSlotRecipe } from '@chakra-ui/react';
import { tabsAnatomy } from '@chakra-ui/react/anatomy';

export default defineSlotRecipe({
  slots: tabsAnatomy.keys(),
  base: {
    content: {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },
  variants: {
    variant: {
      line: {
        trigger: {
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '20px',
          borderBottom: '2px solid',
          color: 'gray.800',
          _selected: {
            color: 'blue.600',
          },
        },
      },
    },
  },
});
