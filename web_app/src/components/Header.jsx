import NextLink from 'next/link';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { LuMenu, LuX } from 'react-icons/lu';
import { useEffect, useRef } from 'react';
import AALogo from '/public/assets/img/AALogo.svg';
import NavLink from '@/components/custom/NavLink';
import AuthButton from '@/components/AuthButton';
import {
  LINK_HEADER,
  MENU_CLOSE,
  MENU_OPEN,
  PAGE_TITLE,
} from '@/config/constants/general';

const Header = () => {
  const { open, onToggle } = useDisclosure();
  const headerRef = useRef(null);

  // Publish the real header height as --header-h for elements that sit
  // below it but can't use the page's flex layout (e.g. portaled drawers).
  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${header.offsetHeight}px`
      );
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      as='header'
      bg='white'
      ref={headerRef}
      py={2}
      px={[4, null, 6]}
      borderBottom='1px solid'
      borderBottomColor='gray.100'
      boxShadow='sm'
    >
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link
            display='flex'
            alignItems='center'
            _hover={{
              textDecoration: 'none',
            }}
            asChild
          >
            <NextLink href={'/'}>
              <Image
                src={AALogo.src}
                alt=''
                height='48px'
                objectFit='cover'
                m='-4'
                pt='2'
              />
              <Text
                fontSize='md'
                ml='-1'
                color='blue.800'
                fontWeight={600}
                lineHeight='21px'
                letterSpacing={0.5}
                textTransform='uppercase'
              >
                {PAGE_TITLE}
              </Text>
            </NextLink>
          </Link>
        </Box>
        <HStack as='nav' gap={4} py='2' display={{ base: 'none', md: 'flex' }}>
          {LINK_HEADER.map((item) => (
            <NavLink key={item.text} {...item} />
          ))}
          <AuthButton />
        </HStack>
        <IconButton
          size='sm'
          aria-label={open ? MENU_CLOSE : MENU_OPEN}
          aria-expanded={open}
          aria-controls='mobile-nav'
          colorPalette='blue'
          display={{ md: 'none' }}
          variant='ghost'
          onClick={onToggle}
        >
          {open ? <LuX /> : <LuMenu />}
        </IconButton>
      </Flex>
      {open ? (
        <Box
          display={{ md: 'none' }}
          zIndex={100}
          position='relative'
          mt={6}
          bg='white'
        >
          <Stack as='nav' id='mobile-nav' gap={4}>
            {LINK_HEADER.map((item) => (
              <NavLink key={item.text} {...item} />
            ))}
            <Box>
              <AuthButton />
            </Box>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
export default Header;
