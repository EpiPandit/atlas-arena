import { Flex, Box, Heading, Icon, Text } from '@chakra-ui/react';
import {
  MAP_COLORS,
  DEFAULT_OPACITY_MULTIPLE,
  W_LEGEND,
} from '@/config/constants/general';
import {
  LEGEND_HOTSPOT_TITLE,
  LEGEND_HOTSPOT_DESC,
} from '@/config/constants/constants.explore';
import { FaCircle } from 'react-icons/fa';
import LayerOpacityControl from '@/components/explore/LayerOpacityControl';

const VirusLegend = ({
  title,
  color,
  value,
  handleChange,
  handleShowOnly,
  handleShowAll,
}) => {
  const handleChangeOpacity = (ev) => {
    handleChange(title, ev);
  };
  const customTitle = `${title} hotspots`
    .toLocaleLowerCase()
    .replace('virus', '')
    .trim();

  const opacity = title in value ? value[title] : DEFAULT_OPACITY_MULTIPLE;
  let colors = MAP_COLORS[color];
  if (!color) {
    colors = [...MAP_COLORS.default];
  }
  return (
    <Flex
      as='li'
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      width='full'
      bg='transparent'
    >
      <Flex alignItems='center'>
        <Icon as={FaCircle} mr={2} color={colors[2]} aria-hidden='true' />
        <Text
          fontSize='14px'
          color='base.700'
          fontWeight={600}
          textTransform='capitalize'
        >
          {customTitle}
        </Text>
      </Flex>
      <LayerOpacityControl
        name={title}
        value={opacity}
        handleChange={handleChangeOpacity}
        handleShowOnly={() => handleShowOnly(title)}
        handleShowAll={handleShowAll}
      />
    </Flex>
  );
};

const HotSpotLegend = ({
  labels = [],
  value = {},
  handleChange = null,
  handleShowOnly = null,
  handleShowAll = null,
}) => {
  if (!labels || labels.length == 0) return null;
  const renderBoxLegend = labels.map((i) => (
    <VirusLegend
      key={i.title}
      {...i}
      value={value}
      handleChange={handleChange}
      handleShowOnly={handleShowOnly}
      handleShowAll={handleShowAll}
    />
  ));
  return (
    <Box
      as='section'
      aria-labelledby='legend-hotspot-title'
      w={`${W_LEGEND}px`}
      h='auto'
      p={2}
      borderRadius='md'
      bg='white'
      rounded='3px'
      display='flex'
      flexDirection='column'
      alignItems='start'
      position='relative'
      justifyContent='space-between'
    >
      <Heading
        as='h2'
        id='legend-hotspot-title'
        fontSize='14px'
        fontWeight={600}
        color='base.700'
        textTransform='uppercase'
      >
        {LEGEND_HOTSPOT_TITLE}
      </Heading>
      <Text fontSize='xs' color='base.700' textTransform='lowercase'>
        {LEGEND_HOTSPOT_DESC}
      </Text>
      <Box
        as='ul'
        listStyleType='none'
        display='flex'
        flexDirection='column'
        mt={2}
        gap={2}
        alignItems='center'
        width='full'
      >
        {renderBoxLegend}
      </Box>
    </Box>
  );
};

export default HotSpotLegend;
