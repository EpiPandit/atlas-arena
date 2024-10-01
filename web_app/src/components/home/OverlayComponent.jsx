import React from 'react';
import {
  Container,
  Box,
  Text,
  Card,
  CardHeader,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownThemeHome from '@/config/markdownThemeHome';
import { Link as NextLink } from '@chakra-ui/next-js';

const CustomCard = ({ title = '', subTitle = '', href = '' }) => {
  return (
    <Card variant='withImageHeader' size='md'>
      <CardHeader>
        <Box
          position='absolute'
          bottom='0'
          display='flex'
          flexDirection='column'
          justifyContent='flex-end'
          alignItems='start'
          color='white'
          p={2}
        >
          <NextLink
            fontSize='md'
            href={`/explore`}
            color='blue.900'
            fontWeight={700}
          >
            {title}
          </NextLink>
          <Text fontSize='md' color='blue.900'>
            {subTitle}
          </Text>
        </Box>
      </CardHeader>
    </Card>
  );
};

const OverlayComponent = ({
  subHeader = '',
  header = '',
  intros = [],
  virus = [],
  species = [],
}) => {
  const renderViruses = virus.map((item) => (
    <CustomCard
      key={item.name}
      title={item.name}
      subTitle={`${(item.species || []).length}  reservoir species`}
    />
  ));
  const renderSpecies = species.map((item) => (
    <CustomCard key={item.name} title={item.name} subTitle={item.virus} />
  ));

  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      w='100vw'
      h='100vh'
      zIndex={2}
      display='flex'
      flexDirection='column'
      justifyContent='start'
      overflowY='auto'
      pt={{ base: 4, md: 8, lg: 12 }}
    >
      <Container px={2} py={2} maxW='960px'>
        <Box p={0} maxW='700px' mx='auto'>
          <Flex py={1} justifyContent='center'>
            <Text
              fontSize='xs'
              fontWeight='bold'
              color='blue.900'
              textTransform='uppercase'
              letterSpacing='wider'
              textAlign='center'
              borderBottom={2}
              p={0}
              m={0}
              borderBottomColor='blue.800'
              borderStyle='solid'
            >
              {subHeader}
            </Text>
          </Flex>

          <Box py={1} px={2}>
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight='bold'
              color='blue.900'
              lineHeight='shorter'
              letterSpacing='wider'
              fontStyle='italic'
              textAlign='center'
            >
              {header}
            </Text>
          </Box>
          <Box py={4} px={2}>
            {intros &&
              intros.map((item) => (
                <ReactMarkdown
                  key={item.id}
                  components={ChakraUIRenderer(MarkdownThemeHome)}
                  children={item.content}
                  skipHtml
                />
              ))}
          </Box>
        </Box>
      </Container>
      <Container textAlign='start' px={0} py={2} maxW='960px'>
        <Tabs variant='unstyled'>
          <TabList justifyContent='center'>
            <Tab>VIRUSES</Tab>
            <Tab>RESERVOIRS</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
                spacing={4}
                px={0}
              >
                {renderViruses}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
                spacing={4}
                px={0}
              >
                {renderSpecies}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default OverlayComponent;
