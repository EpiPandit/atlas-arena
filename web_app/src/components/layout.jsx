import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box } from '@chakra-ui/react';
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
      // maxW='1280px'
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
    <Box className='flex flex-col min-h-screen' bg='gray.50'>
      <Header />
      <MainApp>{children}</MainApp>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
