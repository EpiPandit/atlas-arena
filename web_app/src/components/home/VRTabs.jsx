import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  Box,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
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

const VRTabs = ({ virus = [], species = [] }) => {
  const renderViruses =
    virus &&
    virus.map((item) => (
      <CustomCard
        key={item.name}
        title={item.name}
        subTitle={`${(item.species || []).length}  reservoir species`}
      />
    ));
  const renderSpecies =
    species &&
    species.map((item) => (
      <CustomCard key={item.name} title={item.name} subTitle={item.virus} />
    ));

  return (
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
  );
};

export default VRTabs;
