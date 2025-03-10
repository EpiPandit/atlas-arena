import React, { useRef, useEffect, useState } from 'react';
// import { loadContent } from '@/libs/yaml';
import { Container, Box, Heading, Text } from '@chakra-ui/react';
import InnerHeading from '@/components/custom/InnerHeading';
import { getMdContent } from '@/libs/markdown';
import UserCards from '@/components/about/UserCards';

const About = ({ pageData }) => {
  return (
    <Container maxW='container.lg' p={2}>
      <Box my={4}>
        <InnerHeading {...pageData} />
      </Box>
      <Box>
        <UserCards />
      </Box>
    </Container>
  );
};

export async function getStaticProps() {
  const resourcesData = await getMdContent('about.md', true);

  return {
    props: {
      pageData: resourcesData,
    },
  };
}

export default About;
