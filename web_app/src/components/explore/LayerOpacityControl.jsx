import {
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
  Text,
} from '@chakra-ui/react';
import { PiDrop } from 'react-icons/pi';
import { LEGEND_OPACITY } from '@/config/constants/constants.explore';

// Per-layer opacity control in the map legend. The trigger is a real,
// labelled button so it is reachable by keyboard and screen readers.
const LayerOpacityControl = ({
  name = '',
  value = 100,
  handleChange = null,
}) => {
  const controlLabel = `Adjust opacity of ${name}`;
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
        w='163px'
        px={2}
        pt={0}
        mt={0}
        ml='127px'
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
            defaultValue={value}
            onChange={handleChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default LayerOpacityControl;
