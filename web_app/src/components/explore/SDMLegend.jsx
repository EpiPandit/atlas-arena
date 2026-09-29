import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import {
  MAP_COLORS,
  DEFAULT_OPACITY_SINGLE,
  DEFAULT_OPACITY_MULTIPLE,
  DEFAULT_LEGEND_VALUE,
  LEGEND_DELTA_VALUE,
  W_LEGEND,
} from '@/config/constants/general';
import {
  UNIT_SDM,
  UNIT_DELTA,
  LEGEND_SDM_TITLE,
} from '@/config/constants/constants.explore';
import LayerOpacityControl from '@/components/explore/LayerOpacityControl';

const ColorLegend = ({
  color = '',
  title = '',
  labels = [],
  handleChange = null,
  value = {},
  has_many = false,
}) => {
  let colors = MAP_COLORS[color];
  if (!color) {
    colors = [...MAP_COLORS.default];
  }
  const handleChangeOpacity = (ev) => {
    handleChange(title, ev);
  };

  let customTitle = `${title}`;
  const titleList = title.split(' ');
  if (titleList.length > 1) {
    customTitle = `${titleList[0][0]}. ${titleList.slice(1, titleList.length).join(' ')}`;
  }
  const opacity =
    title in value
      ? value[title]
      : has_many
        ? DEFAULT_OPACITY_MULTIPLE
        : DEFAULT_OPACITY_SINGLE;

  return (
    <Box as='li' display='flex' flexDirection='column' w='full'>
      <Flex
        display='flex'
        justifyContent='space-between'
        width='full'
        mb={0}
        bg='transparent'
        alignItems='center'
      >
        <Text
          fontSize='14px'
          fontWeight={600}
          fontStyle='italic'
          color='base.700'
          textTransform='capitalize'
        >
          <span aria-hidden='true'>{customTitle}</span>
          <Text as='span' srOnly>
            {title}
          </Text>
        </Text>
        <LayerOpacityControl
          name={title}
          value={opacity}
          handleChange={handleChangeOpacity}
        />
      </Flex>
      <Box
        h='10px'
        mb={0}
        display='flex'
        width='full'
        bgGradient={`linear(to-r, ${colors[0]}, ${colors[colors.length - 1]})`}
        aria-hidden='true'
      />
      <Box
        display='flex'
        mt={0}
        px={1}
        justifyContent='space-between'
        width='full'
        aria-hidden='true'
      >
        {labels &&
          labels.map((i) => (
            <Text key={i} fontSize='10px' color='gray.600'>
              {i}
            </Text>
          ))}
      </Box>
    </Box>
  );
};

const SDMLegend = ({
  labels = [],
  value = {},
  isDelta = false,
  handleChange = null,
}) => {
  const labelsUnits = isDelta ? LEGEND_DELTA_VALUE : DEFAULT_LEGEND_VALUE;
  const unit = isDelta ? UNIT_DELTA : UNIT_SDM;
  if (!labels || labels.length == 0) return null;

  const renderBoxLegend = labels.map((i) => (
    <ColorLegend
      key={i.title}
      {...i}
      has_many={labels.length > 1}
      labels={labelsUnits}
      value={value}
      handleChange={handleChange}
    />
  ));

  return (
    <Box
      as='section'
      aria-labelledby='legend-sdm-title'
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
        id='legend-sdm-title'
        fontSize='14px'
        fontWeight={600}
        color='base.700'
        textTransform='uppercase'
      >
        {LEGEND_SDM_TITLE} {unit}
      </Heading>
      <Text srOnly>
        {`Scale from ${labelsUnits[0]} to ${labelsUnits[labelsUnits.length - 1]}.`}
      </Text>
      <Box
        as='ul'
        listStyleType='none'
        display='flex'
        flexDirection='column'
        gap={2}
        mt={2}
        alignItems='start'
        width='full'
      >
        {renderBoxLegend}
      </Box>
    </Box>
  );
};
export default SDMLegend;
