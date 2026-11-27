import { IconButton, Popover } from '@chakra-ui/react';
import { LuInfo } from 'react-icons/lu';
import {
  INFO_BUTTON_LABEL,
  INFO_POPOVER_LABEL,
} from '@/config/constants/general';

// A real <button> trigger so the help text is reachable by keyboard (Tab,
// Enter/Space) and announced to screen readers, not just revealed on hover.
const InfoTooltip = ({ label = '', name = '' }) => {
  if (!label) return null;
  return (
    <Popover.Root lazyMount positioning={{ placement: 'right' }}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label={INFO_BUTTON_LABEL(name)}
          variant='ghost'
          size='2xs'
          minW={6}
          h={6}
          ml={2}
          color='gray.600'
          _hover={{ color: 'blue.900', bg: 'blackAlpha.100' }}
        >
          <LuInfo />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          aria-label={INFO_POPOVER_LABEL(name)}
          w='auto'
          maxW='xs'
          color='white'
          borderColor='gray.700'
          css={{ '--popover-bg': '{colors.gray.700}' }}
        >
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body
            p={3}
            fontSize='sm'
            textTransform='none'
            fontWeight={400}
          >
            {label}
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};

export default InfoTooltip;
