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
  DEFAULT_OPACITY_MULTIPLE,
  W_LEGEND,
} from '@/config/constants/general';
import {
  LEGEND_OPACITY,
  LEGEND_HOTSPOT_TITLE,
  LEGEND_HOTSPOT_DESC,
} from '@/config/constants/constants.explore';
import { FaCircle } from 'react-icons/fa';

const VirusLegend = ({ title, color, value, handleChange }) => {
  const handleChangeOpacity = (ev) => {
    handleChange(title, ev);
  };
  const customTitle = `${title} hotspots`
    .toLocaleLowerCase()
    .replace('virus', '')
    .trim();

  const opacity =
    title in value ? value[title] : DEFAULT_OPACITY_MULTIPLE * 0.6;
  let colors = MAP_COLORS[color];
  if (!color) {
    colors = [...MAP_COLORS.default];
  }
  return (
    <Flex
      display='flex'
      justifyContent='space-between'
      width='full'
      my={1}
      bg='transparent'
    >
      <Flex>
        <Icon as={FaCircle} mr={2} color={colors[2]} />
        <Text
          fontSize='14px'
          color='base.700'
          fontWeight={600}
          textTransform='capitalize'
        >
          {customTitle}
        </Text>
      </Flex>
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
  );
};

const HotSpotLegend = ({ labels = [], value = {}, handleChange = null }) => {
  if (!labels || labels.length == 0) return null;
  const renderBoxLegend = labels.map((i) => (
    <VirusLegend {...i} value={value} handleChange={handleChange} />
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
        {LEGEND_HOTSPOT_TITLE}
      </Text>
      <Text fontSize='xs' color='base.700' textTransform='lowercase'>
        {LEGEND_HOTSPOT_DESC}
      </Text>
      <Box
        display='flex'
        flexDirection='column'
        mt={2}
        alignItems='start'
        width='full'
      >
        {renderBoxLegend}
      </Box>
    </Box>
  );
};

export default HotSpotLegend;
