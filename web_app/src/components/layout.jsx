import { useAppContext } from '@/store/context';
import Header from '@/components/Header';

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
