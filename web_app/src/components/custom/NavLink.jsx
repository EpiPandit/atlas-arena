import { useColorModeValue } from '@chakra-ui/react';
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
      fontFamily='sans-serif'
      fontWeight={700}
      fontSize={12}
      color={isActive ? 'blue.800' : 'gray.500'}
      borderBottom={isActive ? '2px solid' : 'none'}
      _hover={{
        textDecoration: 'none',
        borderBottom: '2px solid',
      }}
      className='uppercase'
    >
      {text}
    </NextLink>
  );
};

export default NavLink;
