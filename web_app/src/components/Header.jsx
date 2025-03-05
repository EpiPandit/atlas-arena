import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  useDisclosure,
  Text,
  Stack,
} from '@chakra-ui/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiCloseFill } from 'react-icons/ri';
import { Icon } from '@chakra-ui/react';
import { Link as NextLink } from '@chakra-ui/next-js';
import AALogo from '/public/assets/img/AALogo.svg';
import NavLink from '@/components/custom/NavLink';
import { LINK_HEADER, PAGE_TITLE } from '@/config/constants/general';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      bg='secondary.50'
      py={4}
      px={6}
      borderBottom={'1px'}
      borderBottomColor='gray.200'
    >
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={<Icon as={isOpen ? RiCloseFill : RxHamburgerMenu} />}
          aria-label={'Open Menu'}
          color="blue.800"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Box>
          <NextLink
            display='flex' 
            alignItems='center'
            href={'/'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Image
              src={AALogo.src}
              height='70px'
              objectFit='cover'
              m='-6'
              pt="2"
            />
            <Text
              fontSize='xl'
              ml="-2"
              color='blue.800'
              fontWeight={500}
              lineHeight='21px'
              letterSpacing={-0.5}
              textTransform='uppercase'
            >
              {PAGE_TITLE}
            </Text>
          </NextLink>
        </Box>
        <HStack as={'nav'} spacing={4} py="2" display={{ base: 'none', md: 'flex' }}>
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
