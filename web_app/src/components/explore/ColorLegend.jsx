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
} from '@/config/constants/general';
import { LEGEND_OPACITY } from '@/config/constants/constants.explore';

const ColorLegend = ({
  color = '',
  title = '',
  labels = ['0.0', '0.5', '1'],
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
    <Box
      w='303px'
      h='64px'
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

      <Box display='flex' mt={0} justifyContent='space-between' width='full'>
        {labels.map((i) => (
          <Text key={i} fontSize='10px' color='gray.600'>
            {i}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default ColorLegend;
