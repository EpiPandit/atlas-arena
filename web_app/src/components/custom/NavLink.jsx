import { Link as NextLink } from '@chakra-ui/next-js';
import { useRouter } from 'next/router';

const NavLink = ({ href, text, isExternal = false }) => {
  const router = useRouter();
  const isActive = router.pathname === `/${href}`;

  return (
    <NextLink
      py={1}
      href={href || '/'}
      target={isExternal ? '_blank' : '_self'}
      fontWeight={700}
      fontSize='xs'
      color={isActive ? 'blue.800' : 'gray.500'}
      borderBottom={isActive ? '2px solid' : 'none'}
      _hover={{
        textDecoration: 'none',
        color: 'blue.800',
      }}
      textTransform='uppercase'
    >
      {text}
    </NextLink>
  );
};

export default NavLink;
