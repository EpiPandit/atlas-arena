import { FormControl, Switch, Text } from '@chakra-ui/react';

const FormControlSwitch = ({
  label,
  handleAction,
  value = false,
  isDisabled = false,
}) => {
  return (
    <FormControl py={2} isDisabled={isDisabled}>
      {/* Label text is a child of the Switch so it lands inside the same
          <label> as the input and becomes its accessible name. */}
      <Switch
        size='md'
        onChange={handleAction}
        isChecked={value}
        display='flex'
        alignItems='center'
      >
        <Text as='span' fontSize='xs' color='gray.700'>
          {label}
        </Text>
      </Switch>
    </FormControl>
  );
};
export default FormControlSwitch;
