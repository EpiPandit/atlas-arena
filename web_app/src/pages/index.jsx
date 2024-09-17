import React, { useRef, useEffect, useState } from 'react';
import { loadContent } from '@/libs/loadYamlContent';
import { Flex } from '@chakra-ui/react';

export default function Home({ content }) {
  return (
    <Flex flexDirection='column'>
      <h1>about index</h1>
    </Flex>
  );
}

export async function getStaticProps() {
  const content = loadContent('config.yaml');

  return {
    props: {
      content,
    },
  };
}
