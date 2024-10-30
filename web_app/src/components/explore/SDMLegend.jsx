import {
  Flex,
  Box,
  Icon,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { PiDrop } from 'react-icons/pi';
import {
  MAP_COLORS,
  DEFAULT_OPACITY_SINGLE,
  DEFAULT_OPACITY_MULTIPLE,
  DEFAULT_LEGEND_VALUE,
  LEGEND_DELTA_VALUE,
  W_LEGEND,
} from '@/config/constants/general';
import {
  LEGEND_OPACITY,
  UNIT_SDM,
  UNIT_DELTA,
  LEGEND_SDM_TITLE,
} from '@/config/constants/constants.explore';

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
    <Box my={1} display='flex' flexDirection='column' w='full'>
      <Flex
        display='flex'
        justifyContent='space-between'
        width='full'
        mb={0}
        bg='transparent'
      >
        <Text
          fontSize='14px'
          fontWeight={600}
          fontStyle='italic'
          color='base.700'
          textTransform='uppercase'
        >
          {customTitle}
        </Text>
        <Popover placement='bottom-end'>
          <PopoverTrigger>
            <Flex>
              <Icon as={PiDrop} boxSize={4} color='gray.500' cursor='pointer' />
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            w='163px'
            h='42px'
            p={0}
            mt={0}
            ml='127px'
            _focus={{ outline: 'none' }}
            zIndex={10}
          >
            <PopoverArrow />
            <PopoverCloseButton boxSize={3} />
            <PopoverBody p={1}>
              <Text fontSize='10px' m={0}>
                {LEGEND_OPACITY}
              </Text>
              <Slider
                aria-label='slider-ex-1'
                defaultValue={opacity}
                onChange={handleChangeOpacity}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <PiDrop />
                </SliderThumb>
              </Slider>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Box
        h='12px'
        mb={0}
        display='flex'
        width='full'
        bgGradient={`linear(to-r, ${colors[0]}, ${colors[colors.length - 1]})`}
      />
      <Box
        display='flex'
        mt={0}
        px={1}
        justifyContent='space-between'
        width='full'
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
      {...i}
      has_many={labels.length > 1}
      labels={labelsUnits}
      value={value}
      handleChange={handleChange}
    />
  ));

  return (
    <Box
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
      <Text
        fontSize='14px'
        fontWeight={600}
        color='base.700'
        textTransform='uppercase'
      >
        {LEGEND_SDM_TITLE}
      </Text>
      <Text fontSize='xs' color='base.700' textTransform='lowercase'>
        {unit}
      </Text>
      <Box
        display='flex'
        flexDirection='column'
        mt={4}
        alignItems='start'
        width='full'
      >
        {renderBoxLegend}
      </Box>
    </Box>
  );
};
export default SDMLegend;
