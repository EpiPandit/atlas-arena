import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
import SkipLink from '@/components/custom/SkipLink';
import { useRouter } from 'next/router';
import { Box, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import axios from 'axios';
import {
  setRawData,
  delRawData,
  buildRawDataGoodleSheet,
} from '@/store/actions';

const DATA_API = process.env.NEXT_PUBLIC_DATA_API;

const MainApp = ({ children }) => {
  return (
    <Box position='relative' h='100%' overflow='hidden'>
      {children}
    </Box>
  );
};

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const isExplore = router.pathname === '/explore';

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(DATA_API);
        const raw_data = buildRawDataGoodleSheet(data);
        if (isMounted && raw_data && raw_data.length) {
          dispatch(setRawData(raw_data));
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          dispatch(delRawData());
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Flex direction='column' minH='100vh' p={0} m={0}>
      {isExplore && <SkipLink href='#explore-map'>Skip to map</SkipLink>}
      <SkipLink href='#main-content'>Skip to main content</SkipLink>
      <Header />
      <Flex
        as='main'
        id='main-content'
        tabIndex={-1}
        flex='1'
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
