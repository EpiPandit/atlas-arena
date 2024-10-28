import { ALL_VIRUS } from '@/config/constants/general';
import { FormControl, Stack, Checkbox } from '@chakra-ui/react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

const FormControlCheckBoxSpecies = ({
  label,
  options,
  handleAction,
  values = [],
  filterValue = ALL_VIRUS,
  info = '',
  isDisabled = false,
}) => {
  if (!options.length) return null;

  // filter
  const renderOptions = options.map((item) => {
    let isDisabledTmp = false;
    if (filterValue === ALL_VIRUS) {
      isDisabledTmp = false;
    } else {
      isDisabledTmp = !(item.virus || []).includes(filterValue);
    }

    return (
      <Checkbox
        isChecked={values.includes(item.name)}
        onChange={handleAction}
        key={item.key}
        id={item.key}
        isDisabled={isDisabled || isDisabledTmp}
      >
        {item.name}
      </Checkbox>
    );
  });

  return (
    <FormControl my={4} isDisabled={isDisabled}>
      <FormLabelFlex label={label} info={info} isDisabled={isDisabled} />
      <Stack pl={0} mt={1} spacing={1}>
        {renderOptions}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBoxSpecies;
