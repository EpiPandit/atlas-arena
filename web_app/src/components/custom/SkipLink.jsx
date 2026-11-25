import { Link } from '@chakra-ui/react';

// Visually hidden until focused; lets keyboard and screen-reader users bypass
// the header (and, on Explore, the filter panel). WCAG 2.4.1.
// Focus moves by hand: following the fragment link would overwrite the page
// state kept in the URL fragment (see libs/hashParams.js).
const SkipLink = ({ href, children }) => {
  const onClick = (event) => {
    const target = document.getElementById(href.replace(/^#/, ''));
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView?.({ block: 'start' });
  };
  return (
    <Link
      href={href}
      onClick={onClick}
      position='absolute'
      top={2}
      left={2}
      zIndex='skipNav'
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
