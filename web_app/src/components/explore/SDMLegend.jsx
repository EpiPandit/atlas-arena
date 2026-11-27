import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import { useId } from 'react';
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
  LEGEND_SCALE,
} from '@/config/constants/constants.explore';
import LayerOpacityControl from '@/components/explore/LayerOpacityControl';

// `title` keys the opacity value; `name` (optional) is shown instead of the
// abbreviated species-style title.
const ColorLegend = ({
  color = '',
  title = '',
  name = null,
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

  let customTitle = name ?? `${title}`;
  const titleList = title.split(' ');
  if (!name && titleList.length > 1) {
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
          fontSize='xs'
          fontWeight={500}
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
        bgGradient='to-r'
        gradientFrom={colors[0]}
        gradientTo={colors[colors.length - 1]}
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

// `heading` and `ticks` override the species-distribution defaults, so the
// same legend serves other rasters (force of infection); a label's own `ticks`
// override `ticks` for that row.
const SDMLegend = ({
  labels = [],
  value = {},
  isDelta = false,
  handleChange = null,
  heading = null,
  ticks = null,
}) => {
  // Unique per instance: the legend renders once for species and once for FOI.
  const headingId = useId();
  const labelsUnits =
    ticks || (isDelta ? LEGEND_DELTA_VALUE : DEFAULT_LEGEND_VALUE);
  const unit = isDelta ? UNIT_DELTA : UNIT_SDM;
  if (!labels || labels.length == 0) return null;

  // A label may carry its own `ticks` (FOI rows, each on its virus's range).
  const renderBoxLegend = labels.map(({ ticks: rowTicks, ...i }) => (
    <ColorLegend
      key={i.title}
      {...i}
      has_many={labels.length > 1}
      labels={rowTicks || labelsUnits}
      value={value}
      handleChange={handleChange}
    />
  ));

  return (
    <Box
      as='section'
      aria-labelledby={headingId}
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
      boxShadow='sm'
    >
      <Heading
        as='h2'
        id={headingId}
        fontSize='xs'
        fontWeight={600}
        lineHeight='shorter'
        color='base.600'
        textTransform='uppercase'
      >
        {heading || `${LEGEND_SDM_TITLE} ${unit}`}
      </Heading>
      <Text srOnly>
        {LEGEND_SCALE(labelsUnits[0], labelsUnits[labelsUnits.length - 1])}
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
