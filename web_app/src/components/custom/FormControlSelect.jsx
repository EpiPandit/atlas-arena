import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';

const FormControlSelect = ({
  label,
  options,
  handleAction,
  value = '',
  isDisabled = false,
}) => {
  return (
    <FormControl py={2}>
      <FormLabel
        fontSize='md'
        fontStyle='italic'
        fontFamily='EB Garamond Variable'
        textTransform='uppercase'
      >
        {label}
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
