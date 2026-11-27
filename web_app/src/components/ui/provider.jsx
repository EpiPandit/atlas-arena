import { ChakraProvider } from '@chakra-ui/react';
import system from '@/config/theme';
import { Toaster } from '@/components/ui/toaster';

// Light mode only: the app has no dark palette, so there is no color mode
// provider (v3 only switches to dark when a `.dark` class is present).
export function Provider({ children }) {
  return (
    <ChakraProvider value={system}>
      {children}
      <Toaster />
    </ChakraProvider>
  );
}
