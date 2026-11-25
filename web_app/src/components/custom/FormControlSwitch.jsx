import { Switch, Field } from '@chakra-ui/react';

const FormControlSwitch = ({
  label,
  handleAction,
  value = false,
  isDisabled = false,
}) => {
  return (
    <Field.Root py={2} disabled={isDisabled}>
      {/* Switch.Root is a <label> wrapping the input, so the label text
          becomes the switch's accessible name. */}
      <Switch.Root
        size='sm'
        colorPalette='blue'
        checked={value}
        onCheckedChange={handleAction}
        display='flex'
        alignItems='center'
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label fontSize='xs' fontWeight='normal' color='gray.700'>
          {label}
        </Switch.Label>
      </Switch.Root>
    </Field.Root>
  );
};
export default FormControlSwitch;
