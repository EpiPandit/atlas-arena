import React, { useRef, useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import StaticMap, { Source, Layer } from 'react-map-gl';
import { useAppContext } from '@/store/context';
import { dynamicFilter } from '@/utils/utils';
import Sidebar from '@/components/Sidebar';
import RasterLayer from '@/components/RasterLayer';
import axios from 'axios';
import pako from 'pako';
import ColorLegend from '@/components/explore/ColorLegend';

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
          </StaticMap>
        </Box>
        <Box
          position='absolute'
          maxH='calc(100vh - 56px)'
          top={4}
          right={6}
          display='flex'
          overflowY='auto'
          flexDirection='column'
          gap={4}
          zIndex={10}
        >
          <ColorLegend title='C. Callosus Distribution' />
        </Box>
      </Box>
    </Flex>
  );
};

export default Explore;
