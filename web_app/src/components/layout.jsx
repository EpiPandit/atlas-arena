import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
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
      <Header />
      <Flex as='main' flex='1' direction='column' overflow='hidden'>
        <MainApp>{children}</MainApp>
      </Flex>
    </Flex>
  );
};

export default Layout;
