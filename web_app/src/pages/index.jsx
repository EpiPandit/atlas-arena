import React from 'react';
import { getMetadataMd, getMdContent } from '@/libs/markdown';

import { Box } from '@chakra-ui/react';
import { H_HEADER } from '@/config/constants/general';
import MapComponent from '@/components/home/MapComponent';
import OverlayComponent from '@/components/home/OverlayComponent';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const Home = ({ mddata = [], pageData = {} }) => {
  const {
    kicker,
    title,
    sub_title,
    contentHtml,
    title_climate,
    text_climate,
    title_patient,
    text_patient,
    title_virus,
    text_virus,
  } = pageData;

  const viruses = (mddata || []).filter((item) => item.layout === 'virus');
  const species = (mddata || []).filter((item) => item.layout === 'specie');

  return (
    <Box
      position='relative'
      h={`calc(100vh - ${H_HEADER}px)`}
      maxW='100vw'
      overflow='hidden'
    >
      <MapComponent accessToken={MAPBOX_ACCESS_TOKEN} mapStyle={MAPBOX_STYLE} />
      <OverlayComponent
        kicker={kicker}
        title={title}
        sub_title={sub_title}
        contentHtml={contentHtml}
        virus={viruses}
        species={species}
        title_climate={title_climate}
        text_climate={text_climate}
        title_patient={title_patient}
        text_patient={text_patient}
        title_virus={title_virus}
        text_virus={text_virus}
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
