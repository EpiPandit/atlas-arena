import { useMemo, useState } from 'react';
import {
  Combobox,
  Portal,
  createListCollection,
  useFilter,
} from '@chakra-ui/react';

// Single-select combobox with typeahead, for use inside a Field (which labels
// it). options: [{ key, name }]. handleAction is called with the selected
// key; clearing calls it with defaultValue, or is ignored without one.
// The clear button shows only when defaultValue is set and not selected.
const ComboboxSingle = ({
  options,
  handleAction,
  value = '',
  defaultValue = '',
  placeholder = '',
  emptyText = '',
  isDisabled = false,
  inputProps = {},
}) => {
  // Text typed by the user. The input also shows the selected item's name,
  // which shouldn't filter the list, so only typing updates this.
  const [searchValue, setSearchValue] = useState('');
  const { contains } = useFilter({ sensitivity: 'base' });

  const collection = useMemo(
    () =>
      createListCollection({
        items: options.filter((item) => contains(item.name, searchValue)),
        itemToString: (item) => item.name,
        itemToValue: (item) => item.key,
      }),
    [options, searchValue, contains]
  );

  const handleValueChange = (details) => {
    const next = details.value[0] || defaultValue;
    if (next) handleAction(next);
  };

  return (
    <Combobox.Root
      size='sm'
      width='full'
      collection={collection}
      value={value ? [value] : []}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => {
        setSearchValue(
          details.reason === 'input-change' ? details.inputValue : ''
        );
      }}
      onOpenChange={(details) => {
        if (details.open && details.reason !== 'input-change') {
          setSearchValue('');
        }
      }}
      disabled={isDisabled}
      openOnClick
      positioning={{ sameWidth: true }}
    >
      <Combobox.Control>
        <Combobox.Input
          bg='white'
          borderColor='gray.200'
          placeholder={placeholder}
          {...inputProps}
        />
        <Combobox.IndicatorGroup>
          {defaultValue && value && value !== defaultValue && (
            <Combobox.ClearTrigger />
          )}
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>{emptyText}</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item key={item.key} item={item}>
                {item.name}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};
export default ComboboxSingle;
