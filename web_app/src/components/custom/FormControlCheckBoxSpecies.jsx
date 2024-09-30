import { ALL_VIRUS } from '@/config/constants';
import {
  FormControl,
  FormLabel,
  Stack,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import InfoTooltip from '@/components/custom/InfoTooltip';

const FormControlCheckBoxSpecies = ({
  label,
  options,
  handleAction,
  values = [],
  filterValue = ALL_VIRUS,
  info = '',
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
        px={0}
        mx={0}
      >
        <Flex justifyContent='space-between' alignItems='center'>
          {label}
          <InfoTooltip label={info} />
        </Flex>
      </FormLabel>
      <Stack pl={0} mt={1} spacing={1}>
        {renderOptions}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBoxSpecies;
