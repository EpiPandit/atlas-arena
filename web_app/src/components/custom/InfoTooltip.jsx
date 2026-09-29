import {
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

// A real <button> trigger so the help text is reachable by keyboard (Tab,
// Enter/Space) and announced to screen readers, not just revealed on hover.
const InfoTooltip = ({ label = '', name = '' }) => {
  if (!label) return null;
  const buttonLabel = name
    ? `More information about ${name}`
    : 'More information';
  return (
    <Popover placement='right' isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label={buttonLabel}
          icon={<Icon as={IoMdInformationCircleOutline} boxSize={4} />}
          variant='ghost'
          size='xs'
          minW={6}
          h={6}
          ml={2}
          color='gray.600'
          _hover={{ color: 'blue.900', bg: 'blackAlpha.100' }}
        />
      </PopoverTrigger>
      <PopoverContent
        aria-label={name ? `About ${name}` : 'More information'}
        w='auto'
        maxW='xs'
        bg='gray.700'
        color='white'
        borderColor='gray.700'
      >
        <PopoverArrow bg='gray.700' />
        <PopoverBody fontSize='sm' textTransform='none' fontWeight={400}>
          {label}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default InfoTooltip;
