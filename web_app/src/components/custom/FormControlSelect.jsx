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
  filter_dict = {},
  isvalid = true,
  helpText = '',
  errorText = '',
}) => {
  return (
    <FormControl isInvalid={!isvalid} my={4}>
      <FormLabel fontSize='sm' className='uppercase'>
        {label}
      </FormLabel>
      <Select
        placeholder='Select option'
        bg='gray.50'
        value={value}
        onChange={handleAction}
      >
        {options.map((i) => (
          <option key={i.key} value={i.key}>
            {i.name}
          </option>
        ))}
      </Select>
      {helpText && <FormHelperText>{helpText}</FormHelperText>}
      {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
    </FormControl>
  );
};
export default FormControlSelect;
