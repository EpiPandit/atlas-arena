import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container, Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setRawData, delRawData } from '@/store/actions';

const DATA_API = process.env.NEXT_PUBLIC_DATA_API;

const MainApp = ({ children }) => {
  return (
    <Box
      as='main'
      flex='1'
      bg='brand.100'
      w='full'
      mx='auto'
      // px={4}
      // py={6}
    >
      {children}
    </Box>
  );
};

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(DATA_API);
        if (data && data.length) {
          dispatch(setRawData(data));
        }
      } catch (err) {
        console.error(err);
        dispatch(delRawData(data));
      }
    };
    fetchData();
  }, []);

  return (
    <Flex direction='column' bg='gray.50' minH='100vh' p={0}>
      <Header />
      <Flex as='main' flex='1'>
        <MainApp>{children}</MainApp>
      </Flex>
      {/* <Footer /> */}
    </Flex>
  );
};

export default Layout;
