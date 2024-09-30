import { FormControl, FormLabel, Flex, Select } from '@chakra-ui/react';
import InfoTooltip from '@/components/custom/InfoTooltip';

const FormControlSelect = ({
  label,
  options,
  handleAction,
  value = '',
  isDisabled = false,
  info = '',
}) => {
  return (
    <FormControl py={2}>
      <FormLabel
        fontSize='md'
        fontStyle='italic'
        fontFamily='EB Garamond Variable'
        textTransform='uppercase'
        px={0}
        mx={0}
      >
        <Flex justifyContent='space-between' alignItems='center'>
          {label}
          <InfoTooltip label={info} />
        </Flex>
      </FormLabel>
      <Select
        bg='white'
        borderColor='gray.200'
        value={value}
        onChange={handleAction}
        fontFamily='Montserrat Variable'
      >
        {options.map((i) => (
          <option key={i.key} value={i.key}>
            {i.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
export default FormControlSelect;
