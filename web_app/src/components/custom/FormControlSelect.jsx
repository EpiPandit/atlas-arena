import { useMemo } from 'react';
import { Field, Portal, Select, createListCollection } from '@chakra-ui/react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

// handleAction is called with the selected option's key.
const FormControlSelect = ({
  label,
  options,
  handleAction,
  value = '',
  isDisabled = false,
  info = '',
  isLocked = false,
  describedBy,
}) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        itemToString: (item) => item.name,
        itemToValue: (item) => item.key,
      }),
    [options]
  );

  return (
    <Field.Root py={2} disabled={isDisabled}>
      <FormLabelFlex label={label} info={info} isDisabled={isDisabled} />
      <Select.Root
        collection={collection}
        size='sm'
        value={value ? [value] : []}
        onValueChange={(details) => handleAction(details.value[0])}
        disabled={isDisabled || isLocked}
        positioning={{ sameWidth: true }}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger
            bg='white'
            borderColor='gray.200'
            aria-describedby={isLocked ? describedBy : undefined}
          >
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item key={item.key} item={item}>
                  {item.name}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  );
};
export default FormControlSelect;
