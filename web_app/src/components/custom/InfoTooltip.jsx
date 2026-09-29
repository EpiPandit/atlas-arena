import { Icon, Tooltip } from '@chakra-ui/react';
import { LuInfo } from 'react-icons/lu';

const InfoTooltip = ({ label = '', props = {} }) => {
  if (!label) return null;
  return (
    <Tooltip hasArrow label={label} {...props}>
      <span>
        <Icon as={LuInfo} ml={2} cursor='pointer' />
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
