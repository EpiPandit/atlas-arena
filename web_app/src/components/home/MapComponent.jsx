import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import indexImage from '@/assets/images/index_image.webp';

const BackdropBlur = () => (
  <Box
    position='absolute'
    top={0}
    left={0}
    right={0}
    height='100%'
    backdropFilter='blur(20px)'
    zIndex={2}
    css={{
      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
      maskImage: 'linear-gradient(to bottom, black, transparent)',
      WebkitMaskSize: 'cover',
      maskSize: 'cover',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
    }}
  />
);

const MapComponent = () => {
  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      w='100vw'
      h='100vh'
      mt={{ base: '15%', md: '30%' }}
      zIndex={1}
      overflow='hidden'
      px={0}
    >
      <Box w='full' h='full' bgColor='secondary.50'>
        <BackdropBlur />
        <Image
          src={indexImage.src}
          alt=''
          objectFit='cover'
          mixBlendMode='multiply'
          w='full'
          h='full'
        />
      </Box>
    </Box>
  );
};

export default MapComponent;
