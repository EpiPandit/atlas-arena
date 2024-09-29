import { Icon, Tooltip } from '@chakra-ui/react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

const InfoTooltip = ({ label = '' }) => {
  if (!label) return null;
  return (
    <Tooltip hasArrow label={label}>
      <span>
        <Icon as={IoMdInformationCircleOutline} ml={2} cursor='pointer' />
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
