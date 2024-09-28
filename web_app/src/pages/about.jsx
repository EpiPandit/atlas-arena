import React, { useRef, useEffect, useState } from 'react';
// import { loadContent } from '@/libs/yaml';
import { Container, Box, Heading, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

export default function Home({ content }) {
  const { title, description, sections } = content;
  return (
    <Container maxW='container.lg' p={2}>
      <Box my={4}>
        <Text
          fontSize='xl'
          my={2}
          textTransform='uppercase'
          fontStyle='italic'
          color='blue.800'
        >
          About
        </Text>
        <Text
          fontSize='lg'
          my={2}
          textTransform='uppercase'
          fontStyle='italic'
          color='blue.800'
        >
          Team
        </Text>
      </Box>
    </Container>
  );
}

export async function getStaticProps() {
  const content = {};

  return {
    props: {
      content,
    },
  };
}
