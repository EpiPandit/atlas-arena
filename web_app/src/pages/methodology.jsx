import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import { getMdContent } from '@/libs/markdown';

import InnerHeading from '@/components/custom/InnerHeading';
import PageTitle from '@/components/custom/PageTitle';
import { buildPageTitle } from '@/config/constants/general';

const Methodology = ({ pageData }) => {
  return (
    <Container maxW='1024px' p={4}>
      <PageTitle title={buildPageTitle('Methodology')} />
      <Box my={4}>
        <InnerHeading {...pageData} />
      </Box>
    </Container>
  );
};

export async function getStaticProps() {
  const resourcesData = await getMdContent('methodology.md', true);

  return {
    props: {
      pageData: resourcesData,
    },
  };
}

export default Methodology;
