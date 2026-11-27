import { useMemo, useState } from 'react';
import {
  Combobox,
  Field,
  Portal,
  Tag,
  Text,
  Wrap,
  createListCollection,
  useFilter,
} from '@chakra-ui/react';
import { ALL_VIRUS } from '@/config/constants/general';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

// Multi-select species picker. Only species linked to the selected virus can
// be selected; each selected species shows as a closable tag below the input.
// handleAction is called with the full array of selected species keys.
const FormControlComboboxSpecies = ({
  label,
  options,
  handleAction,
  values = [],
  filterValue = ALL_VIRUS,
  info = '',
  isDisabled = false,
  isLocked = false,
  notice = '',
  noticeId,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { contains } = useFilter({ sensitivity: 'base' });

  const availableOptions = useMemo(
    () =>
      filterValue === ALL_VIRUS
        ? options
        : options.filter((item) => (item.virus || []).includes(filterValue)),
    [options, filterValue]
  );

  // Every species is listed; those not linked to the virus are disabled.
  const collection = useMemo(
    () =>
      createListCollection({
        items: options.filter((item) => contains(item.name, searchValue)),
        itemToString: (item) => item.name,
        itemToValue: (item) => item.key,
        isItemDisabled: (item) => !availableOptions.includes(item),
      }),
    [options, availableOptions, searchValue, contains]
  );

  if (!options.length) return null;

  const availableKeys = availableOptions.map((item) => item.key);
  const selectedOptions = availableOptions.filter((item) =>
    values.includes(item.key)
  );
  const isInactive = isDisabled || isLocked;

  const handleValueChange = (details) => {
    handleAction(details.value.filter((key) => availableKeys.includes(key)));
  };

  const handleRemove = (key) => {
    handleAction(values.filter((value) => value !== key));
  };

  return (
    <Field.Root py={2} disabled={isDisabled}>
      <FormLabelFlex label={label} info={info} isDisabled={isDisabled} />
      {notice && (
        <Text id={noticeId} fontSize='sm' fontWeight={600} color='blue.600'>
          {notice}
        </Text>
      )}
      <Combobox.Root
        multiple
        closeOnSelect={false}
        size='sm'
        width='full'
        collection={collection}
        value={values}
        onValueChange={handleValueChange}
        inputValue={searchValue}
        onInputValueChange={(details) => setSearchValue(details.inputValue)}
        onOpenChange={(details) => {
          if (!details.open) setSearchValue('');
        }}
        disabled={isInactive}
        openOnClick
        positioning={{ sameWidth: true }}
      >
        <Combobox.Control>
          <Combobox.Input
            bg='white'
            borderColor='gray.200'
            placeholder={
              selectedOptions.length ? 'Add species…' : 'Search species…'
            }
            aria-describedby={notice ? noticeId : undefined}
          />
          <Combobox.IndicatorGroup>
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>No matching species</Combobox.Empty>
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
      {selectedOptions.length > 0 && (
        <Wrap gap={1} mt={1} aria-label={`Selected ${label}`}>
          {selectedOptions.map((item) => (
            <Tag.Root
              key={item.key}
              size='md'
              colorPalette='gray'
              opacity={isInactive ? 0.4 : 1}
              aria-disabled={isInactive || undefined}
            >
              <Tag.Label>{item.name}</Tag.Label>
              {/* Kept while inactive so the tags don't shift */}
              <Tag.EndElement>
                <Tag.CloseTrigger
                  aria-label={`Remove ${item.name}`}
                  onClick={() => handleRemove(item.key)}
                  disabled={isInactive}
                  cursor={isInactive ? 'not-allowed' : 'pointer'}
                />
              </Tag.EndElement>
            </Tag.Root>
          ))}
        </Wrap>
      )}
    </Field.Root>
  );
};
export default FormControlComboboxSpecies;
