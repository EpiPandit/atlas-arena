import React, { useRef, useEffect, useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownTheme from '@/config/md/markdownTheme';
import { getMetadataMd, getMdContent } from '@/libs/markdown';
import rehypeRaw from 'rehype-raw';
import InnerHeading from '@/components/custom/InnerHeading';

const DynamicMd = ({ slug, pageData }) => {
  return (
    <Container maxW='container.md' p={4} pt={4}>
      <Box my={2}>
        <InnerHeading title={'RESOURCES'} />
      </Box>
      <Box>
        <ReactMarkdown
          components={ChakraUIRenderer(MarkdownTheme)}
          rehypePlugins={[rehypeRaw]}
          children={pageData.contentHtml}
          skipHtml={false}
        />
      </Box>
    </Container>
  );
};

export async function getStaticProps({ params }) {
  if (!params) return { props: {} };
  const resourcesData = await getMdContent(`${params.slug}.md`, true);

  return {
    props: {
      ...params,
      pageData: resourcesData,
    },
  };
}

export async function getStaticPaths() {
  const dataPromises = getMetadataMd(['public', 'markdown'], true);
  const data = await Promise.all(dataPromises);

  const paths = data
    .filter((i) => ['virus', 'specie'].includes(i.layout))
    .map((i) => ({
      params: {
        slug: `${i.filename.replace('.md', '')}`,
      },
    }));
  return {
    paths: paths,
    fallback: false,
  };
}
export default DynamicMd;
