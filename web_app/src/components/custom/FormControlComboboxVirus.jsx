import { Field } from '@chakra-ui/react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';
import ComboboxSingle from '@/components/custom/ComboboxSingle';

// Single-select picker with typeahead. Clearing it falls back to
// defaultValue, so there is always a selection.
// handleAction is called with the selected option's key.
const FormControlComboboxVirus = ({
  label,
  options,
  handleAction,
  value = '',
  defaultValue,
  info = '',
  isDisabled = false,
}) => (
  <Field.Root py={2} disabled={isDisabled}>
    <FormLabelFlex label={label} info={info} isDisabled={isDisabled} />
    <ComboboxSingle
      options={options}
      handleAction={handleAction}
      value={value}
      defaultValue={defaultValue}
      placeholder='Search viruses…'
      emptyText='No matching viruses'
      isDisabled={isDisabled}
    />
  </Field.Root>
);
export default FormControlComboboxVirus;
