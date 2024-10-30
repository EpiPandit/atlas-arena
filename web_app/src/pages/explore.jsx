import React, { useRef, useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import StaticMap from 'react-map-gl';
import { useAppContext } from '@/store/context';
import { dynamicFilter, getUniqueCombinations } from '@/utils/utils';
import Sidebar from '@/components/explore/Sidebar';
import RasterLayer from '@/components/explore/RasterLayer';
import axios from 'axios';
import pako from 'pako';
import SDMLegend from '@/components/explore/SDMLegend';
import { getMetadataMd } from '@/libs/markdown';
import SidePanel from '@/components/explore/SidePanel';
import { H_HEADER } from '@/config/constants/general';
import FoiVectorLayer from '@/components/explore/FoiVectorLayer';
import HotSpotLegend from '@/components/explore/HotSpotLegend';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE_EXPLORE;
const BASENAME = (process.env.PUBLIC_URL || '').replace('//', '/');

const initialViewState = {
  latitude: -19,
  longitude: -55,
  zoom: 3.1,
};

const Explore = ({ mddata }) => {
  const { raw_data } = useAppContext();

  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ ...initialViewState });
  const [filterTilesId, setFilterTilesId] = useState([]);
  const [foiHotspot, setFoiHotspot] = useState(null);
  const [opacityFilter, setLayerStyle] = useState({});

  const [dataVirus, setDataVirus] = useState({});
  const [hasDeltaValue, setHasDeltaValue] = useState(false);
  const [dataFilter, setDataFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASENAME}/assets/data/hotspots.geojson.gz`,
          {
            responseType: 'arraybuffer',
          }
        );
        const decompressed = pako.inflate(response.data, { to: 'string' });
        const jsonDataMapp = JSON.parse(decompressed);
        if (jsonDataMapp && jsonDataMapp.features) {
          setFoiHotspot(jsonDataMapp);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleFilterTilesId = (data_filter) => {
    const raw_data_filter = dynamicFilter([...raw_data], { ...data_filter });
    const hasDelta =
      data_filter &&
      data_filter.time_frame &&
      data_filter.time_frame.length &&
      data_filter.time_frame.filter((i) =>
        `${i}`.toLowerCase().includes('delta')
      ).length > 0;
    setHasDeltaValue(hasDelta);
    setFilterTilesId(raw_data_filter);
    setDataFilter(data_filter);

    // show virus draw
    const { virus } = data_filter;

    if (virus && mddata) {
      setDataVirus(mddata[virus] || {});
    } else {
      setDataVirus({});
    }
  };

  const handleChangeLayerStyle = (specie, val) => {
    let tmpOpacityFilter = { ...opacityFilter };
    tmpOpacityFilter[specie] = val;
    setLayerStyle({ ...tmpOpacityFilter });
  };

  const buildRender = filterTilesId
    .filter((i) => i.tileset_id)
    .map((item) => (
      <RasterLayer
        key={item.tileset_id}
        item={item}
        opacity_filter={opacityFilter}
        has_many={filterTilesId.length > 0}
      />
    ));

  const labelSDM = getUniqueCombinations(
    filterTilesId.filter((i) => i.virus && dataFilter.hotspot),
    'species',
    'color'
  ).map((i) => ({
    title: i.species,
    color: i.color,
  }));

  const labelsHotSpot = getUniqueCombinations(
    filterTilesId.filter((i) => i.virus && dataFilter.hotspot),
    'virus',
    'color_virus'
  ).map((i) => ({
    title: i.virus,
    color: i.color_virus,
  }));

  return (
    <Flex position='relative' flexDirection={{ base: 'column', md: 'row' }}>
      <Sidebar
        handleFilterTilesId={handleFilterTilesId}
        filterTilesId={filterTilesId}
      />
      <Box flex={1} position='relative'>
        <Box h={`calc(100vh - ${H_HEADER}px)`} flex={1}>
          <Box h='100%' w='100%'>
            <StaticMap
              ref={mapRef}
              initialViewState={viewState}
              // onLoad={handleLoad}
              minZoom={2}
              maxZoom={10}
              dragRotate={false}
              mapStyle={MAPBOX_STYLE}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
              projection='mercator'
            >
              <FoiVectorLayer
                jsonData={foiHotspot}
                hotspot={dataFilter.hotspot}
                time_frame={dataFilter.time_frame}
                virus={dataFilter.virus}
                opacity_filter={opacityFilter}
              />
              {buildRender}
            </StaticMap>
          </Box>
        </Box>
        <Box
          position='absolute'
          maxH={`calc(100vh - ${H_HEADER}px)`}
          bottom={4}
          left={4}
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
          gap={2}
          zIndex={10}
          width={{ base: '90%', md: 'auto' }}
        >
          <SDMLegend
            labels={labelSDM}
            value={opacityFilter}
            isDelta={hasDeltaValue}
            handleChange={handleChangeLayerStyle}
          />
          <HotSpotLegend
            labels={labelsHotSpot}
            value={opacityFilter}
            handleChange={handleChangeLayerStyle}
          />
        </Box>
        <SidePanel dataVirus={dataVirus} />
      </Box>
    </Flex>
  );
};

export async function getStaticProps() {
  const dataPromises = getMetadataMd(['public', 'markdown'], true);
  const data = await Promise.all(dataPromises);
  const result = data
    .filter((item) => item.layout === 'virus')
    .reduce((acc, item) => {
      acc[item.name] = { ...item };
      return acc;
    }, {});
  // home data
  return {
    props: {
      mddata: result,
    },
  };
}

export default Explore;
