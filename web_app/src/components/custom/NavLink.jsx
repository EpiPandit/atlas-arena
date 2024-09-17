import { useColorModeValue } from '@chakra-ui/react';
import { Link as NextLink } from '@chakra-ui/next-js';
import { useRouter } from 'next/router';

const NavLink = ({ href, text, isExternal = false }) => {
  const router = useRouter();
  const isActive = router.pathname === `/${href}`;

  const activeColor = useColorModeValue('blue.500', 'blue.300');
  const defaultColor = useColorModeValue('gray.500', 'gray.200');

  return (
    <NextLink
      py={1}
      href={href || '/'}
      target={isExternal ? '_blank' : '_self'}
      fontWeight={isActive ? 'bold' : 'normal'}
      color={isActive ? activeColor : defaultColor}
      borderBottom={isActive ? '2px solid' : 'none'}
      _hover={{
        textDecoration: 'none',
        color: activeColor,
        borderBottom: '2px solid',
      }}
      className='uppercase'
    >
      {text}
    </NextLink>
  );
};

export default NavLink;
