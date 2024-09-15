import { Box, useColorModeValue } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';

const NavLink = ({ href, text, isExternal = false }) => {
  return (
    <Box
      as='div'
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      <Link href={href} target={isExternal ? '_blank' : '_self'}>
        {text}
      </Link>
    </Box>
  );
};

export default NavLink;
