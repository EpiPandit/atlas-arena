import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import { getMdContent } from '@/libs/markdown';

import InnerHeading from '@/components/custom/InnerHeading';

const Methodology = ({ pageData }) => {
  return (
    <Container maxW='container.lg' p={4}>
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
