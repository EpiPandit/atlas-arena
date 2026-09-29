import { Link } from '@chakra-ui/react';

// Visually hidden until focused; lets keyboard and screen-reader users bypass
// the header (and, on Explore, the filter panel). WCAG 2.4.1.
const SkipLink = ({ href, children }) => {
  return (
    <Link
      href={href}
      position='absolute'
      top={2}
      left={2}
      zIndex='skipLink'
      px={4}
      py={2}
      bg='white'
      color='blue.900'
      fontWeight={700}
      fontSize='sm'
      borderRadius='md'
      transform='translateY(-200%)'
      _focus={{ transform: 'translateY(0)', boxShadow: 'outline' }}
    >
      {children}
    </Link>
  );
};

export default SkipLink;
