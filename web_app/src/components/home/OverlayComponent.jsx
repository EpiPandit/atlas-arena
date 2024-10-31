import React from 'react';
import { Container, Box, Flex } from '@chakra-ui/react';
import InnerHeading from '@/components/custom/InnerHeading';
// import VRTabs from '@/components/home/VRTabs';
import InfoCards from '@/components/home/InfoCards';
import Footer from '@/components/Footer';
import ButtonLink from '@/components/custom/ButtonLink';

const OverlayComponent = ({
  kicker = '',
  title = '',
  subTitle = '',
  contentHtml = '',
}) => {
  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      right={0}
      w='100vw'
      minH={{ base: '100vh', md: 'auto' }}
      maxH={{ base: '100vh', md: 'auto' }}
      zIndex={2}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      overflowY='auto'
      pt={{ base: 4, md: 8, lg: 8 }}
      pb={{ base: 4, md: 8, lg: 8 }}
    >
      <Container
        px={{ base: 2, md: 4 }}
        py={2}
        maxW={{ base: '90%', md: '80%', lg: '960px' }}
      >
        <InnerHeading
          kicker={kicker}
          title={title}
          subTitle={subTitle}
          contentHtml={contentHtml}
        />
        <Flex
          py={2}
          mx='auto'
          maxW={{ base: '95%', md: '700px' }}
          gap={2}
          justifyContent='flex-end'
        >
          <ButtonLink href='/resources' text='Lear more' variant='outline' />
          <ButtonLink
            href='/explore'
            text='Start Exploring'
            colorScheme='blue'
          />
        </Flex>
      </Container>
      <Container
        textAlign='start'
        px={0}
        py={4}
        maxW={{ base: '90%', md: '80%', lg: '960px' }}
      >
        <InfoCards />
      </Container>
      <Footer />
    </Box>
  );
};

export default OverlayComponent;
