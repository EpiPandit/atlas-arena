import { defineRecipe } from '@chakra-ui/react';

// The solid blue button is white on blue.600 (5.11:1, WCAG AA), which is the
// v3 default. v3's default hover fades the fill to 90% opacity, which drops
// the contrast to ~4.27:1. Darken on hover/active instead, for every palette.
const darken = (amount) =>
  `color-mix(in srgb, {colors.colorPalette.solid}, black ${amount})`;

export default defineRecipe({
  variants: {
    variant: {
      solid: {
        _hover: { bg: darken('12%') },
        _expanded: { bg: darken('12%') },
        _active: { bg: darken('24%') },
      },
    },
  },
});
