import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiCloseFill } from 'react-icons/ri';
import { Icon } from '@chakra-ui/react';

import NavLink from '@/components/custom/NavLink';
import { LINK_HEADER } from '@/config/constants';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={<Icon as={isOpen ? RiCloseFill : RxHamburgerMenu} />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Box>Logo</Box>
        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
          {LINK_HEADER.map((item) => (
            <NavLink key={item.text} {...item} />
          ))}
        </HStack>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
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
