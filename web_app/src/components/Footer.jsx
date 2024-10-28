import { Box, Flex, Text, Image } from '@chakra-ui/react';
import wellcomeLogo from '@/assets/images/wellcome.png';
import ucdavisLogo from '@/assets/images/expanded_logo_blue.png';
import devseedLogo from '@/assets/images/devseed.png';
import geocompasLogo from '@/assets/images/geocompas.webp';

const Footer = () => {
  return (
    <Box
      py={3}
      mt={4}
      mb={8}
      textAlign='center'
      minH='150px'
      w='100%'
      position='relative'
    >
      <Text
        fontSize='lg'
        fontWeight={600}
        color='blue.900'
        mb={4}
        textTransform='uppercase'
      >
        Presented by:
      </Text>

      <Flex
        justifyContent='center'
        alignItems='center'
        gap={{ base: 3, md: 6, sm: 2 }}
        mb={2}
        wrap='wrap'
        px={4}
        w='100%'
      >
        <Image
          src={wellcomeLogo.src}
          alt='Wellcome logo'
          boxSize={{ base: '35px', md: '55px' }}
          objectFit='contain'
        />
        <Image
          src={ucdavisLogo.src}
          alt='UC Davis logo'
          w={{ base: '130px', md: '175px' }}
          objectFit='contain'
        />
        <Image
          src={devseedLogo.src}
          alt='Development Seed logo'
          w={{ base: '150px', md: '235px' }}
          objectFit='contain'
        />
        <Image
          src={geocompasLogo.src}
          alt='Geocompas'
          w={{ base: '150px', md: '230px' }}
          objectFit='contain'
        />
      </Flex>
    </Box>
  );
};

export default Footer;
