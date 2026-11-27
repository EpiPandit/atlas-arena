import {
  CloseButton,
  IconButton,
  Popover,
  Slider,
  Text,
} from '@chakra-ui/react';
import { LuDroplet } from 'react-icons/lu';
import {
  LEGEND_OPACITY,
  LEGEND_OPACITY_OF,
  LEGEND_ADJUST_OPACITY,
} from '@/config/constants/constants.explore';

// Per-layer opacity control in the map legend. The trigger is a real,
// labelled button so it is reachable by keyboard and screen readers.
const LayerOpacityControl = ({
  name = '',
  value = 100,
  handleChange = null,
}) => {
  const controlLabel = LEGEND_ADJUST_OPACITY(name);
  return (
    <Popover.Root lazyMount positioning={{ placement: 'bottom-end' }}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label={controlLabel}
          variant='ghost'
          size='2xs'
          minW={6}
          h={6}
          color='gray.600'
        >
          <LuDroplet />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          aria-label={controlLabel}
          w='163px'
          px={2}
          pt={0}
          mt={0}
          ml='127px'
          _focus={{ outline: 'none' }}
          zIndex={10}
        >
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.CloseTrigger asChild position='absolute' top={1} right={1}>
            <CloseButton size='2xs' />
          </Popover.CloseTrigger>
          <Popover.Body p={1}>
            <Text fontSize='12px' m={0}>
              {LEGEND_OPACITY}
            </Text>
            <Slider.Root
              size='sm'
              colorPalette='blue'
              aria-label={[LEGEND_OPACITY_OF(name)]}
              getAriaValueText={(details) => `${details.value}%`}
              defaultValue={[value]}
              onValueChange={(details) => handleChange(details.value[0])}
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs boxSize={4} />
              </Slider.Control>
            </Slider.Root>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};

export default LayerOpacityControl;
