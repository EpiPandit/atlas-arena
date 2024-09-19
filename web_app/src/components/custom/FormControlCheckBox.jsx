import { FormControl, FormLabel, Stack, Checkbox } from '@chakra-ui/react';

const FormControlCheckBox = ({
  label,
  options,
  handleAction,
  values = [],
  deltaOption = false,
}) => {
  if (!options.length) return null;
  const hasDelta = options.filter((i) =>
    `${i.name}`.toLowerCase().includes('delta')
  ).length;
  return (
    <FormControl my={4}>
      <FormLabel fontSize='sm' className='uppercase'>
        {label}
      </FormLabel>
      <Stack pl={0} mt={1} spacing={1}>
        {options
          .filter((i) => !`${i.name}`.toLowerCase().includes('delta'))
          .map((i) => (
            <Checkbox
              isChecked={values.includes(i.name)}
              onChange={handleAction}
              key={i.key}
              id={i.key}
            >
              {i.name}
            </Checkbox>
          ))}
        {hasDelta && (
          <div className='mt-4'>
            {options
              .filter((i) => `${i.name}`.toLowerCase().includes('delta'))
              .map((i) => (
                <Checkbox
                  isChecked={values.includes(i.name)}
                  onChange={handleAction}
                  key={i.key}
                  id={i.key}
                >
                  {i.name}
                </Checkbox>
              ))}
          </div>
        )}
      </Stack>
    </FormControl>
  );
};
export default FormControlCheckBox;
