import React, { useRef, useEffect, useState } from 'react';
import { loadContent } from '@/libs/loadYamlContent';
import { useAppContext } from '@/store/context';
import { Flex } from '@chakra-ui/react';

export default function Publications({ content }) {
  return (
    <Flex flexDirection='column'>
      <h1>publications</h1>
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
