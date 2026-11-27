import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
import SkipLink from '@/components/custom/SkipLink';
import { SKIP_TO_MAIN, SKIP_TO_MAP } from '@/config/constants/general';
import { useRouter } from 'next/router';
import { Box, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { setRawData } from '@/store/actions';
import { getCatalogRows } from '@/libs/catalog';

const MainApp = ({ children }) => {
  return (
    <Box position='relative' h='100%' overflow='hidden'>
      {children}
    </Box>
  );
};

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch(setRawData(getCatalogRows()));
  }, []);

  // Home and Explore fill exactly the viewport: the header takes its
  // natural height and main gets the rest, so no fixed header height is
  // assumed. dvh accounts for mobile browser toolbars where supported.
  const router = useRouter();
  const isFullHeight = ['/', '/explore'].includes(router.pathname);
  const isExplore = router.pathname === '/explore';

  return (
    <Flex
      direction='column'
      minH='100vh'
      h={isFullHeight ? '100vh' : undefined}
      css={
        isFullHeight
          ? {
              '@supports (height: 100dvh)': {
                height: '100dvh',
                minHeight: '100dvh',
              },
            }
          : undefined
      }
      p={0}
      m={0}
    >
      {isExplore && <SkipLink href='#explore-map'>{SKIP_TO_MAP}</SkipLink>}
      <SkipLink href='#main-content'>{SKIP_TO_MAIN}</SkipLink>
      <Header />
      <Flex
        as='main'
        id='main-content'
        tabIndex={-1}
        flex='1'
        minH={0}
        direction='column'
        overflow='hidden'
        _focus={{ outline: 'none' }}
      >
        <MainApp>{children}</MainApp>
      </Flex>
    </Flex>
  );
};

export default Layout;
