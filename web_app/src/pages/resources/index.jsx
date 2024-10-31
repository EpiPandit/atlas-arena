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
  Flex,
  VStack,
  Link,
  layout,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownTheme from '@/config/md/markdownTheme';
import { getMetadataMd, getMdContent } from '@/libs/markdown';
import rehypeRaw from 'rehype-raw';
import InnerHeading from '@/components/custom/InnerHeading';
import { sortList } from '@/utils/utils';

const SideNavBar = ({ navigationItems, handleNavigation, selectedItem }) => {
  if (!navigationItems) return null;
  return (
    <Box
      w='20%'
      p={4}
      pt={10}
      borderRight='1px solid'
      borderColor='gray.200'
      overflowY='auto'
    >
      <VStack align='start' spacing={4}>
        {navigationItems
          .filter((i) => i.items && i.items.length)
          .map((section) => (
            <Box key={section.name} w='full'>
              <Text fontWeight='bold' fontSize='sm' color='gray.600' mb={2}>
                {section.name.toUpperCase()}
              </Text>
              <Flex flexDirection='column' gap={2}>
                {section.items.map((item) => (
                  <Link
                    key={item}
                    onClick={() => handleNavigation(item)}
                    fontWeight={selectedItem === item ? 'bold' : 'normal'}
                    color={selectedItem === item ? 'blue.800' : 'gray.500'}
                  >
                    {item}
                  </Link>
                ))}
              </Flex>
            </Box>
          ))}
      </VStack>
    </Box>
  );
};
const Resources = ({ mdData, pageData }) => {
  const router = useRouter();
  const { item: queryItem } = router.query;
  const [selectedItem, setSelectedItem] = useState(queryItem || null);

  useEffect(() => {
    if (queryItem) {
      setSelectedItem(queryItem);
    }
  }, [queryItem]);

  const navigationItems = [
    {
      name: 'virus resources',
      items: sortList(
        mdData.filter((i) => i.layout == 'virus'),
        'name'
      ).map((i) => i.name),
    },
    {
      name: 'reservoir species',
      items: sortList(
        mdData.filter((i) => i.layout == 'specie'),
        'name'
      ).map((i) => i.name),
    },
    {
      name: 'publications',
      items: sortList(
        mdData.filter((i) => i.layout == 'publications'),
        'name'
      ).map((i) => i.name),
    },
  ];

  if (!selectedItem) {
    setSelectedItem(navigationItems[0].items[0]);
  }

  const handleNavigation = (item) => {
    const newItem = (item || '').toLowerCase().replace(' ', '_');
    setSelectedItem(newItem);
    router.push(`/resources?item=${newItem}`, undefined, { shallow: true });
  };
  let data = { contentHtml: '' };
  try {
    data = mdData.filter(
      (item) =>
        (item.name || '').toLowerCase().replace(' ', '_') == selectedItem
    )[0];
    if (!data) {
      data = { contentHtml: '' };
    }
  } catch (error) {
    console.error(error, selectedItem);
  }

  return (
    <Container maxW='container.lg' p={4}>
      <Box my={4}>
        <InnerHeading {...pageData} />
      </Box>
      <Flex>
        <SideNavBar
          navigationItems={navigationItems}
          handleNavigation={handleNavigation}
          selectedItem={selectedItem}
        />
        <Box flex='1' p={4}>
          <ReactMarkdown
            components={ChakraUIRenderer(MarkdownTheme)}
            rehypePlugins={[rehypeRaw]}
            children={data.contentHtml}
            skipHtml={false}
          />
        </Box>
      </Flex>
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
