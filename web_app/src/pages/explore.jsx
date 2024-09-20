import React, { useRef, useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import StaticMap, {
  NavigationControl,
  ScaleControl,
  Source,
  Layer,
} from 'react-map-gl';
import { useAppContext } from '@/store/context';
import { dynamicFilter } from '@/utils/utils';
import Sidebar from '@/components/Sidebar';
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const initialViewState = {
  latitude: 8.44830069039078,
  longitude: -76.68246056031643,
  zoom: 6,
};

const Explore = () => {
  const { raw_data } = useAppContext();

  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ ...initialViewState });
  const [filterTilesId, setFilterTilesId] = useState([]);

  const handleFilterTilesId = (data_filter) => {
    console.log({ ...data_filter });
    const raw_data_filter = dynamicFilter([...raw_data], { ...data_filter });

    console.log(raw_data_filter.length, raw_data_filter);
    setFilterTilesId(raw_data_filter);
  };

  // const [initialState, setInitialState] = useState({ ...data });

  // const handleLoad = () => {
  //   const map = mapRef.current.getMap();
  //   map.resize();
  // };
  // console.log('Explore', data);
  return (
    <Flex flexDirection='row'>
      <Sidebar
        handleFilterTilesId={handleFilterTilesId}
        filterTilesId={filterTilesId}
      />
      <Box flex={1}>
        <Box h='calc(100vh - 64px)'>
          <StaticMap
            ref={mapRef}
            initialViewState={viewState}
            // onLoad={handleLoad}
            minZoom={4}
            maxZoom={10}
            mapStyle={MAPBOX_STYLE}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          >
            <Source
              id='raster-tiles'
              type='raster'
              url='mapbox://ynctstgeocomp.g_zb_cu_rf_pp'
              tileSize={256}
              rasterNoData={0}
            >
              <Layer
                id='raster-layer'
                type='raster'
                source='raster-tiles'
                paint={{
                  'raster-resampling': 'nearest',
                  'raster-fade-duration': 0,
                  'raster-opacity': 0.8,
                  'raster-color': [
                    'interpolate',
                    ['linear'],
                    ['raster-value'],
                    0,
                    'rgba(68, 1, 84, 1)',
                    0.25,
                    'rgba(59, 82, 139, 1)',
                    0.5,
                    'rgba(33, 145, 140, 1)',
                    0.75,
                    'rgba(94, 201, 98, 1)',
                    1,
                    'rgba(253, 231, 37, 1)',
                  ],
                }}
              />
            </Source>
            {/* <ScaleControl position='top-left' />
            <NavigationControl position='top-left' /> */}
          </StaticMap>
        </Box>
      </Box>
    </Flex>
  );
};

export default Explore;
