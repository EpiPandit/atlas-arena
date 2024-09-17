import { FormControl, FormLabel, Stack, Checkbox } from '@chakra-ui/react';

const FormControlCheckBox = ({ options, label, deltaOption = false }) => {
  return (
    <FormControl my={4}>
      <FormLabel fontSize='sm' className='uppercase'>
        {label}
      </FormLabel>
      <Stack pl={6} mt={1} spacing={1}>
        {options.map((i) => (
          <Checkbox isChecked={false} key={i}>
            {i}
          </Checkbox>
        ))}
        {deltaOption && (
          <Checkbox isChecked={true} mt={4}>
            Show Delta
          </Checkbox>
        )}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBox;
