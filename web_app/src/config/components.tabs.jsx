import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  tab: {
    fontFamily: 'Montserrat Variable',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    borderBottom: '2px solid',
    color: 'gray.800',
    _selected: {
      color: 'blue.600',
    },
  },
  tabpanel: {
    fontFamily: 'Montserrat Variable',
    paddingLeft: '0px',
    paddingRight: '0px',
  },
});

export default defineMultiStyleConfig({ baseStyle });
