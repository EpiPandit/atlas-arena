import { useAppContext } from '@/store/context';

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();

  return <main>{children}</main>;
};

export default Layout;
