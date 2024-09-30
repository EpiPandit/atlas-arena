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
import { MAP_COLORS } from '@/config/constants';
import { useState } from 'react';

const ColorLegend = ({
  color = '',
  title = '',
  labels = ['0.0', '0.5', '1'],
  handleChange = null,
  value = {},
}) => {
  let colors = MAP_COLORS[color];
  if (!color) {
    colors = [...MAP_COLORS.default];
  }
  const handleChangeOpacity = (ev) => {
    handleChange(title, ev);
  };

  let customTitle = `${title} distribution `;
  const titleList = title.split(' ');
  if (titleList.length > 1) {
    customTitle = `${titleList[0][0]}. ${titleList.slice(1, titleList.length).join(' ')} distribution`;
  }
  const opacity = title in value ? value[title] : 100;
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
        <Popover placement='right-end'>
          <PopoverTrigger>
            <Icon as={PiDrop} boxSize={4} color='gray.500' cursor='pointer' />
          </PopoverTrigger>
          <PopoverContent
            w='163px'
            h='42px'
            p={0}
            mt={7}
            ml='127px'
            _focus={{ outline: 'none' }}
            zIndex={10}
          >
            <PopoverArrow />
            <PopoverCloseButton boxSize={3} />
            <PopoverBody p={1}>
              <Text fontSize='10px' m={0}>
                Opacity
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
                  <Box color='blue.500' as={PiDrop} />
                </SliderThumb>
              </Slider>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <Box h='12px' mb={0} display='flex' width='full'>
        {colors.map((color, index) => (
          <Box key={index} w='20%' h='full' bg={color}></Box>
        ))}
      </Box>

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
