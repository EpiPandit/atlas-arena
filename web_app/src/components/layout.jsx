import { useAppContext } from '@/store/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box, Grid } from '@chakra-ui/react';

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
  console.log('layout');
  return (
    <Box className='flex flex-col min-h-screen' bg='gray.50'>
      <Header />
      <MainApp>{children}</MainApp>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
