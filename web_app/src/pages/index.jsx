import React, { useRef, useEffect, useState } from 'react';
import { loadContent } from '@/libs/loadYamlContent';
import { Container, Box, Text, VStack } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import StaticMap from 'react-map-gl';
import MarkdownThemeHome from '@/config/markdownThemeHome';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const initialViewState = {
  latitude: 12.1543810681043,
  longitude: -74.59673635723772,
  zoom: 2.5,
};

const OverlayComponent = ({
  subHeader = '',
  header = '',
  intros = [],
  species = [],
  virus = [],
}) => {
  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      w='100vw'
      h='100vh'
      zIndex={2}
      display='flex'
      flexDirection='column'
      justifyContent='start'
      alignItems='center'
      pt={{ base: 4, md: 8, lg: 12 }}
    >
      <Container
        textAlign='center'
        px={{ base: 4, md: 8, lg: 12 }}
        py={4}
        maxW='container.lg'
        bg='rgba(0, 0, 0, 0.6)'
      >
        <Box
          borderColor='blue.800'
          borderStyle='solid'
          borderWidth={1}
          p={0}
          maxW='700px'
          mx='auto'
        >
          <Box
            py={1}
            px={2}
            borderBottom={1}
            borderBottomColor='blue.800'
            borderStyle='solid'
          >
            <Text
              fontSize='xs'
              fontWeight='bold'
              color='blue.900'
              textTransform='uppercase'
              letterSpacing='wider'
              textAlign='start'
            >
              {subHeader}
            </Text>
          </Box>
          <Box
            py={1}
            px={2}
            borderBottom={1}
            borderBottomColor='blue.800'
            borderStyle='solid'
          >
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight='bold'
              color='blue.900'
              lineHeight='shorter'
              letterSpacing='wider'
              textAlign='start'
              fontStyle='italic'
            >
              {header}
            </Text>
          </Box>
          <Box py={4} px={2}>
            {intros &&
              intros.map((item) => (
                <ReactMarkdown
                  key={item.id}
                  components={ChakraUIRenderer(MarkdownThemeHome)}
                  children={item.content}
                  skipHtml
                />
              ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const MapComponent = () => {
  const mapRef = useRef(null);

  const handleLoad = () => {
    const map = mapRef.current.getMap();
    map.resize();
    map.setFog({
      color: 'rgba(0, 0, 0, 0.01)',
      'high-color': 'rgba(0, 0, 0, 0.001)',
      'horizon-blend': 0.01,
      'space-color': 'rgba(0, 0, 0, 0.001)',
      'star-intensity': 0.015,
    });
  };

  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      w='100vw'
      h='100vh'
      mt='35%'
      zIndex={1}
      overflow='hidden'
    >
      <Box w='full' h='full'>
        <StaticMap
          ref={mapRef}
          latitude={-18.1543810681043}
          longitude={-60.59673635723772}
          zoom={2.3}
          onLoad={handleLoad}
          mapStyle={MAPBOX_STYLE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          projection='globe'
        />
      </Box>
    </Box>
  );
};

export default function Home({ content }) {
  const { sub_header, header, intros } = content;

  return (
    <Box position='relative' h='calc(100vh - 56px)' w='100vw' overflow='hidden'>
      <MapComponent />
      <OverlayComponent
        subHeader={sub_header}
        header={header}
        intros={intros}
      />
    </Box>
  );
}

export async function getStaticProps() {
  const content = loadContent('general.yaml');

  return {
    props: {
      content,
    },
  };
}
