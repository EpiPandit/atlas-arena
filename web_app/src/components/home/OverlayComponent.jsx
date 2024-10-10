import React from 'react';
import { Container, Box, Text, Flex, Icon } from '@chakra-ui/react';
import InnerHeading from '@/components/custom/InnerHeading';
// import VRTabs from '@/components/home/VRTabs';
import InfoCards from '@/components/home/InfoCards';

const OverlayComponent = ({
  kicker = '',
  title = '',
  subTitle = '',
  contentHtml = '',
  title_climate = '',
  text_climate = '',
  title_patient = '',
  text_patient = '',
  title_virus = '',
  text_virus = '',
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
      justifyContent='start'
      overflowY='auto'
      pt={{ base: 4, md: 8, lg: 12 }}
      pb={{ base: 4, md: 8, lg: 12 }}
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
      </Container>
      <Container
        textAlign='start'
        px={0}
        py={4}
        maxW={{ base: '90%', md: '80%', lg: '960px' }}
      >
        <InfoCards
          title_climate={title_climate}
          text_climate={text_climate}
          title_patient={title_patient}
          text_patient={text_patient}
          title_virus={title_virus}
          text_virus={text_virus}
        />
      </Container>
    </Box>
  );
};

export default OverlayComponent;
