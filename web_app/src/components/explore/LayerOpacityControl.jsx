import {
  Button,
  Icon,
  IconButton,
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
  Stack,
  Text,
} from '@chakra-ui/react';
import { PiDrop } from 'react-icons/pi';
import {
  LEGEND_OPACITY,
  LEGEND_SHOW_ONLY,
  LEGEND_SHOW_ALL,
} from '@/config/constants/constants.explore';

// Per-layer controls in the map legend: opacity, plus "show only this layer"
// so overlapping layers can be read one at a time instead of by blended
// color alone (WCAG 1.4.1).
const LayerOpacityControl = ({
  name = '',
  value = 100,
  handleChange = null,
  handleShowOnly = null,
  handleShowAll = null,
}) => {
  const controlLabel = `Layer options for ${name}`;
  return (
    <Popover placement='bottom-end' isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label={controlLabel}
          icon={<Icon as={PiDrop} boxSize={4} />}
          variant='ghost'
          size='xs'
          minW={6}
          h={6}
          color='gray.600'
        />
      </PopoverTrigger>
      <PopoverContent
        aria-label={controlLabel}
        w='180px'
        px={2}
        pt={0}
        mt={0}
        _focus={{ outline: 'none' }}
        zIndex={10}
      >
        <PopoverArrow />
        <PopoverCloseButton boxSize={3} />
        <PopoverBody p={1}>
          <Text fontSize='12px' m={0}>
            {LEGEND_OPACITY}
          </Text>
          <Slider
            aria-label={`${LEGEND_OPACITY} of ${name}`}
            getAriaValueText={(v) => `${v}%`}
            value={value}
            onChange={handleChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
          <Stack spacing={1} mt={1}>
            <Button size='xs' variant='outline' onClick={handleShowOnly}>
              {LEGEND_SHOW_ONLY}
            </Button>
            <Button size='xs' variant='ghost' onClick={handleShowAll}>
              {LEGEND_SHOW_ALL}
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default LayerOpacityControl;
