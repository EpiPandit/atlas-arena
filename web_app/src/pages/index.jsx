import React from 'react';
import { getMetadataMd, getMdContent } from '@/libs/markdown';

import { Box } from '@chakra-ui/react';

import MapComponent from '@/components/home/MapComponent';
import OverlayComponent from '@/components/home/OverlayComponent';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const Home = ({ mddata = [], pageData = {} }) => {
  const { kicker, title, contentHtml } = pageData;
  const viruses = (mddata || []).filter((item) => item.layout === 'virus');
  const species = (mddata || []).filter((item) => item.layout === 'specie');

  return (
    <Box position='relative' h='calc(100vh - 56px)' w='100vw' overflow='hidden'>
      <MapComponent accessToken={MAPBOX_ACCESS_TOKEN} mapStyle={MAPBOX_STYLE} />
      <OverlayComponent
        subHeader={kicker}
        header={title}
        intros={contentHtml}
        virus={viruses}
        species={species}
      />
    </Box>
  );
};

export async function getStaticProps() {
  const dataPromises = getMetadataMd(['public', 'markdown']);
  const data = await Promise.all(dataPromises);
  // home data
  const homeData = await getMdContent('home.md', true);
  return {
    props: {
      mddata: data,
      pageData: homeData,
    },
  };
}

export default Home;
