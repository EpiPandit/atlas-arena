import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';

import StaticMap from 'react-map-gl';

const MapComponent = ({ mapStyle, accessToken }) => {
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
          mapStyle={mapStyle}
          mapboxAccessToken={accessToken}
          projection='globe'
        />
      </Box>
    </Box>
  );
};

export default MapComponent;
