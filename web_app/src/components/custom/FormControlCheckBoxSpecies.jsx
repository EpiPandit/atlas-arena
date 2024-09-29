import { ALL_VIRUS } from '@/config/constants';
import { FormControl, FormLabel, Stack, Checkbox } from '@chakra-ui/react';

const FormControlCheckBoxSpecies = ({
  label,
  options,
  handleAction,
  values = [],
  filterValue = ALL_VIRUS,
}) => {
  if (!options.length) return null;

  // filter
  const renderOptions = options.map((item) => {
    let isDisabled = false;
    if (filterValue === ALL_VIRUS) {
      isDisabled = false;
    } else {
      isDisabled = !(item.virus || []).includes(filterValue);
    }

    return (
      <Checkbox
        isChecked={values.includes(item.name)}
        onChange={handleAction}
        key={item.key}
        id={item.key}
        isDisabled={isDisabled}
      >
        {item.name}
      </Checkbox>
    );
  });

  return (
    <FormControl my={4}>
      <FormLabel
        fontSize='sm'
        fontFamily='EB Garamond Variable'
        textTransform='uppercase'
      >
        {label}
      </FormLabel>
      <Stack pl={0} mt={1} spacing={1}>
        {renderOptions}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBoxSpecies;
