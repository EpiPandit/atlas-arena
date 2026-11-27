import React, { useEffect, useState } from 'react';
import { Box, Container, Text, Flex, VStack, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import ReactMarkdown from 'react-markdown';
import MarkdownTheme from '@/config/md/markdownTheme';
import { markdownComponents } from '@/config/md/markdownComponents';
import { getMetadataMd, getMdContent } from '@/libs/markdown';
import rehypeRaw from 'rehype-raw';
import InnerHeading from '@/components/custom/InnerHeading';
import { sortList } from '@/utils/utils';
import PageTitle from '@/components/custom/PageTitle';
import { buildPageTitle } from '@/config/constants/general';

const toSlug = (name = '') => name.toLowerCase().replace(/\s+/g, '_');

const SideNavBar = ({ navigationItems, handleNavigation, selectedItem }) => {
  if (!navigationItems) return null;
  return (
    <Box
      w={{ xs: '100%', md: '20%' }}
      pt={{ xs: 0, md: 10 }}
      pr={{ xs: 0, md: 4 }}
      borderRight={{ xs: 'none', md: '1px solid' }}
      borderColor={{ xs: null, md: 'gray.200' }}
      overflowY='auto'
    >
      <VStack align='start' gap={4}>
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
                    fontWeight={
                      selectedItem === toSlug(item) ? 'bold' : 'normal'
                    }
                    color={
                      selectedItem === toSlug(item) ? 'blue.800' : 'gray.500'
                    }
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
      setSelectedItem(toSlug(queryItem));
    }
  }, [queryItem, mdData]);

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
    setSelectedItem(toSlug(navigationItems[0].items[0]));
  }

  const handleNavigation = (item) => {
    const newItem = toSlug(item);
    setSelectedItem(newItem);
    router.push(`/resources?item=${newItem}`, undefined, { shallow: true });
  };
  let data = { contentHtml: '' };
  try {
    data = mdData.filter((item) => toSlug(item.name) == selectedItem)[0];
    if (!data) {
      data = { contentHtml: '' };
    }
  } catch (error) {
    console.error(error, selectedItem);
  }

  return (
    <Container maxW='1024px' p={4}>
      <PageTitle title={buildPageTitle('Resources')} />
      <Box my={4}>
        <InnerHeading {...pageData} />
      </Box>
      <Flex flexDir={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 4 }}>
        <SideNavBar
          navigationItems={navigationItems}
          handleNavigation={handleNavigation}
          selectedItem={selectedItem}
        />
        <Box flex='1' p={{ xs: 0, md: 4 }}>
          <ReactMarkdown
            components={markdownComponents(MarkdownTheme)}
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
