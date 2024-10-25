import React from 'react';
import { getMetadataMd, getMdContent } from '@/libs/markdown';

import { Box } from '@chakra-ui/react';
import { H_HEADER } from '@/config/constants/general';
import MapComponent from '@/components/home/MapComponent';
import OverlayComponent from '@/components/home/OverlayComponent';

const Home = ({ mddata = [], pageData = {} }) => {
  const { kicker, title, sub_title, contentHtml } = pageData;

  const viruses = (mddata || []).filter((item) => item.layout === 'virus');
  const species = (mddata || []).filter((item) => item.layout === 'specie');

  return (
    <Box
      position='relative'
      h={`calc(100vh - ${H_HEADER}px)`}
      maxW='100vw'
      overflow='hidden'
    >
      <MapComponent />
      <OverlayComponent
        kicker={kicker}
        title={title}
        sub_title={sub_title}
        contentHtml={contentHtml}
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
