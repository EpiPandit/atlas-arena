import { ALL_VIRUS } from '@/config/constants/general';
import { FormControl, Stack, Checkbox, Text } from '@chakra-ui/react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';
import { useId } from 'react';

const FormControlCheckBoxSpecies = ({
  label,
  options,
  handleAction,
  values = [],
  filterValue = ALL_VIRUS,
  info = '',
  isDisabled = false,
  isLocked = false,
  notice = '',
}) => {
  const headingId = useId();
  const noticeId = useId();
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
        isDisabled={isDisabled || isLocked || isDisabledTmp}
      >
        {item.name}
      </Checkbox>
    );
  });

  return (
    <FormControl
      my={4}
      isDisabled={isDisabled}
      aria-labelledby={headingId}
      aria-describedby={notice ? noticeId : undefined}
    >
      <FormLabelFlex
        id={headingId}
        label={label}
        info={info}
        isDisabled={isDisabled}
        isGroup
      />
      {notice && (
        <Text id={noticeId} fontSize='sm' fontWeight={600} color='blue.600'>
          {notice}
        </Text>
      )}
      <Stack pl={0} mt={1} spacing={1}>
        {renderOptions}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBoxSpecies;
