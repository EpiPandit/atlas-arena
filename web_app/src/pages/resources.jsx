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
import { getMetadataMd } from '@/libs/markdown';

const Resources = ({ mdData }) => {
  const allVirus = (mdData || []).filter((item) => item.layout === 'virus');

  const renderTabs = allVirus.map((item) => (
    <Tab key={item.name}>{item.name} </Tab>
  ));

  const renderPanels = allVirus.map((item) => (
    <TabPanel key={item.filename}>
      <Box>
        <Text as='h2'>{item.name}</Text>
        <ReactMarkdown
          key={item.filename}
          components={ChakraUIRenderer(MarkdownTheme)}
          children={item.contentHtml}
          skipHtml
        />
      </Box>
    </TabPanel>
  ));

  return (
    <Container maxW='container.lg' p={4} pt={10}>
      <Box my={4}>
        <Heading
          as='h2'
          size='xs'
          my={2}
          color='blue.800'
          textTransform='uppercase'
        >
          Virus information
        </Heading>
        <Text
          fontSize='36px'
          my={2}
          textTransform='uppercase'
          fontStyle='italic'
          color='blue.800'
        >
          Resources
        </Text>
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

  return {
    props: {
      mdData: data,
    },
  };
}

export default Resources;
