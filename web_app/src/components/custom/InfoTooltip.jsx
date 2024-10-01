import { Icon, Tooltip } from '@chakra-ui/react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

const InfoTooltip = ({ label = '', props = {} }) => {
  if (!label) return null;
  return (
    <Tooltip hasArrow label={label} {...props}>
      <span>
        <Icon as={IoMdInformationCircleOutline} ml={2} cursor='pointer' />
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
