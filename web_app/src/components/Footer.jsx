import { Box, Flex, Text, Image } from '@chakra-ui/react';
import wellcomeLogo from '@/assets/images/wellcome.png';
import ucdavisLogo from '@/assets/images/ucdavis.jpg';
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
          boxSize={{ base: '50px', md: '80px' }}
          objectFit='contain'
        />
        <Image
          src={ucdavisLogo.src}
          alt='UC Davis logo'
          w={{ base: '130px', md: '186px' }}
          objectFit='contain'
        />
        <Image
          src={devseedLogo.src}
          alt='Development Seed logo'
          w={{ base: '130px', md: '186px' }}
          objectFit='contain'
        />
        <Image
          src={geocompasLogo.src}
          alt='Geocompas'
          w={{ base: '150px', md: '186px' }}
          objectFit='contain'
        />
      </Flex>
    </Box>
  );
};

export default Footer;
