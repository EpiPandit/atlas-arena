import { Link as NextLink } from '@chakra-ui/next-js';
import { useRouter } from 'next/router';

const NavLink = ({ href, text, isExternal = false }) => {
  const router = useRouter();
  const isActive =
    router.pathname === `/${href}` ||
    (router.pathname.includes('resources') && href.includes('resources'));

  return (
    <NextLink
      href={isExternal ? href : `/${href}`}
      target={isExternal ? '_blank' : '_self'}
      fontWeight={700}
      fontSize='xs'
      color={isActive ? 'blue.800' : 'gray.500'}
      letterSpacing={0.8}
      boxShadow={isActive ? '0 2px 0 0 var(--chakra-colors-blue-800)' : 'none'}
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
