import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
} from '@chakra-ui/react';

const FormControlSelect = ({
  options,
  label,
  isvalid = true,
  helpText = '',
  errorText = '',
}) => {
  return (
    <FormControl isInvalid={!isvalid} my={4}>
      <FormLabel fontSize='sm' className='uppercase'>
        {label}
      </FormLabel>
      <Select placeholder='Select option' bg='gray.50'>
        {options.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Select>
      {helpText && <FormHelperText>{helpText}</FormHelperText>}
      {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
    </FormControl>
  );
};
export default FormControlSelect;
