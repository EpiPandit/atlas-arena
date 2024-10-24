import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Text,
  Stack,
} from '@chakra-ui/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiCloseFill } from 'react-icons/ri';
import { Icon } from '@chakra-ui/react';
import { Link as NextLink } from '@chakra-ui/next-js';

import NavLink from '@/components/custom/NavLink';
import { LINK_HEADER, PAGE_TITLE, H_HEADER } from '@/config/constants/general';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      bg='secondary.50'
      py={3}
      px={4}
      borderBottom={'1px'}
      borderBottomColor='gray.300'
      h={`${H_HEADER}px`}
    >
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={<Icon as={isOpen ? RiCloseFill : RxHamburgerMenu} />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Box>
          <Text
            fontSize='md'
            color='blue.800'
            fontWeight={600}
            lineHeight='21px'
            letterSpacing={2}
            textTransform='uppercase'
          >
            <NextLink
              href={'/'}
              _hover={{
                textDecoration: 'none',
              }}
            >
              {PAGE_TITLE}
            </NextLink>
          </Text>
        </Box>
        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
          {LINK_HEADER.map((item) => (
            <NavLink key={item.text} {...item} />
          ))}
        </HStack>
      </Flex>
      {isOpen ? (
        <Box
          p={2}
          display={{ md: 'none' }}
          zIndex={100}
          position='relative'
          bg='secondary.50'
          sx={{ borderBottomRadius: '10px' }}
        >
          <Stack as={'nav'} spacing={4}>
            {LINK_HEADER.map((item) => (
              <NavLink key={item.text} {...item} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
export default Header;
