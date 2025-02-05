import { Box, Flex, Text, Image, Link } from '@chakra-ui/react';

import { PRESENTED_BY, LOGOS } from '@/config/constants/constants.home';

const Footer = () => {
  const renderLogos = (LOGOS || []).map((item) => (
    <Link key={item.id} href={item.href} isExternal>
      <Image
        src={item.image}
        alt={item.alt}
        boxSize={{ ...item.boxSize }}
        w={{ ...item.w }}
        objectFit='contain'
      />
    </Link>
  ));
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
        {PRESENTED_BY}
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
        {renderLogos}
      </Flex>
    </Box>
  );
};

export default Footer;
