import React, { useRef, useEffect, useState } from 'react';
// import { loadContent } from '@/libs/yaml';
import { Container } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

const Publications = ({ content }) => {
  const { title, description, sections } = content;
  return (
    <Container
      maxW={[
        'container.sm',
        'container.md',
        'container.lg',
        'container.xl',
        'container.2xl',
      ]}
      p={[2, 4]}
    ></Container>
  );
};

export async function getStaticProps() {
  const content = {};

  return {
    props: {
      content,
    },
  };
}

export default Publications;
