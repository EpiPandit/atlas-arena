import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  Heading,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownTheme from '@/config/markdownTheme';
import { getMetadataMd, getMdContent } from '@/libs/markdown';
import rehypeRaw from 'rehype-raw';
import InnerHeading from '@/components/custom/InnerHeading';

const Resources = ({ mdData, pageData }) => {
  const allVirus = (mdData || []).filter((item) => item.layout === 'virus');

  const renderTabs = allVirus.map((item) => (
    <Tab key={item.name}>{item.name} </Tab>
  ));

  const renderPanels = allVirus.map((item) => (
    <TabPanel key={item.filename}>
      <Box>
        <ReactMarkdown
          key={item.filename}
          components={ChakraUIRenderer(MarkdownTheme)}
          rehypePlugins={[rehypeRaw]}
          children={item.contentHtml}
          skipHtml={false}
        />
      </Box>
    </TabPanel>
  ));

  return (
    <Container maxW='container.lg' p={4} pt={10}>
      <Box my={4}>
        <InnerHeading {...pageData} />
      </Box>
      <Box>
        <Tabs variant='enclosed'>
          <TabList>{renderTabs}</TabList>
          <TabPanels>{renderPanels}</TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export async function getStaticProps() {
  const dataPromises = getMetadataMd(['public', 'markdown'], true);
  const data = await Promise.all(dataPromises);
  const resourcesData = await getMdContent('resources.md', true);

  return {
    props: {
      mdData: data,
      pageData: resourcesData,
    },
  };
}

export default Resources;
