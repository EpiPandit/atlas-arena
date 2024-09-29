import React, { useRef, useEffect, useState } from 'react';
import { Flex, Box, Slide, Button, IconButton, Text } from '@chakra-ui/react';
import StaticMap, {
  NavigationControl,
  ScaleControl,
  Source,
  Layer,
} from 'react-map-gl';
import { useAppContext } from '@/store/context';
import { dynamicFilter } from '@/utils/utils';
import Sidebar from '@/components/Sidebar';
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from 'react-icons/io';
import RasterLayer from '@/components/RasterLayer';
import axios from 'axios';
import pako from 'pako';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;
const BASENAME = (process.env.PUBLIC_URL || '').replace('//', '/');

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
  const [boundariesAdm, setBoundariesAdm] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const handleFilterTilesId = (data_filter) => {
    const raw_data_filter = dynamicFilter([...raw_data], { ...data_filter });

    setFilterTilesId(raw_data_filter);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASENAME}/assets/data/filter_sa.geojson.gz`,
          {
            responseType: 'arraybuffer',
          }
        );
        const decompressed = pako.inflate(response.data, { to: 'string' });
        const jsonDataMapp = JSON.parse(decompressed);
        if (jsonDataMapp && jsonDataMapp.features) {
          setBoundariesAdm(jsonDataMapp);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  // const [initialState, setInitialState] = useState({ ...data });

  // const handleLoad = () => {
  //   const map = mapRef.current.getMap();
  //   map.resize();
  // };
  // console.log('Explore', data);

  const buildRender = filterTilesId
    .filter((i) => i.tileset_id)
    .map((item) => <RasterLayer key={item.tileset_id} item={item} />);

  const hasTilesId = filterTilesId.length !== 0;
  return (
    <Flex position='relative' flexDirection='row'>
      <Sidebar
        handleFilterTilesId={handleFilterTilesId}
        filterTilesId={filterTilesId}
      />
      <Box flex={1}>
        <Box h='calc(100vh - 56px)'>
          <StaticMap
            ref={mapRef}
            initialViewState={viewState}
            // onLoad={handleLoad}
            minZoom={4}
            maxZoom={10}
            mapStyle={MAPBOX_STYLE}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          >
            {boundariesAdm && (
              <Source id='adm_boundaries' type='geojson' data={boundariesAdm}>
                <Layer
                  id='adm_boundaries_layer'
                  type='line'
                  source='adm_boundaries'
                  paint={{
                    'line-width': hasTilesId ? 0.5 : 0,
                    'line-color': 'rgba(255, 255, 255, 0.8)',
                  }}
                />
              </Source>
            )}
            {buildRender}
            <ScaleControl position='top-left' />
            <NavigationControl position='top-left' />
          </StaticMap>
        </Box>
      </Box>
      <Button
        position='absolute'
        top='10px'
        right='10px'
        zIndex={9}
        onClick={togglePanel}
        bg='gray.100'
        color='black'
        hidden={isPanelOpen}
        p={2}
        size={'sm'}
      >
        {isPanelOpen ? 'Close Panel' : 'Open Panel'}{' '}
        <IconButton
          as='div'
          aria-label='Open panel'
          icon={<IoMdArrowRoundBack />}
          size='sm'
          variant='ghost'
          onClick={togglePanel}
        />
      </Button>
      <Slide direction='right' in={isPanelOpen} style={{ zIndex: 10 }}>
        <Box
          w='400px'
          h='calc(100vh - 64px)'
          bg='white'
          boxShadow='md'
          position='absolute'
          right={0}
          top={'64px'}
          p={2}
          zIndex={2}
        >
          <Flex
            justifyContent='space-between'
            alignItems='center'
            px={2}
            borderBottom='1px solid'
            borderColor='gray.200'
          >
            <Text fontSize='lg' fontWeight='bold'>
              PANEL
            </Text>
            <IconButton
              aria-label='Close panel'
              icon={<IoMdArrowRoundForward />}
              size='sm'
              variant='ghost'
              onClick={togglePanel}
            />
          </Flex>
        </Box>
      </Slide>
    </Flex>
  );
};

export default Explore;
