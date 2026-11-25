import { Box, Stack, RadioGroup, Checkbox } from '@chakra-ui/react';
import { useId, useState } from 'react';
import { DEFAULT_TIME } from '@/config/constants/general';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

const FormControlRadioTime = ({
  label,
  options,
  handleAction,
  info = '',
  isDisabled = false,
  // Controlled by a model run: value is the shown time frame (possibly a delta
  // one), and availableValues, when non-empty, the ones the run has.
  value,
  availableValues = [],
  describedBy,
}) => {
  const [localRadio, setLocalRadio] = useState(DEFAULT_TIME);
  const [localCheck, setLocalCheck] = useState(false);
  const headingId = useId();

  if (!options.length) return null;

  const isDeltaName = (name) => `${name}`.toLowerCase().includes('delta');
  const radioOptions = options.filter((i) => !isDeltaName(i.name));
  const deltaOptions = options
    .filter((i) => isDeltaName(i.name))
    .map((item) => item.name);
  // The delta time frame for a scenario, e.g. 'SSP 2 (...)' -> 'Delta SSP 2 - current'.
  const deltaFor = (radioVal) => {
    const typeSSP = `${radioVal}`.substring(0, 6).trim().toLowerCase();
    return deltaOptions.find((item) => item.toLowerCase().includes(typeSSP));
  };
  const isControlled = value !== undefined;
  const isAvailable = (val) =>
    !isControlled || !availableValues.length || availableValues.includes(val);

  const valueIsDelta = isControlled && deltaOptions.includes(value);
  const selectRadio = !isControlled
    ? localRadio
    : valueIsDelta
      ? radioOptions.find((i) => deltaFor(i.name) === value)?.name ||
        DEFAULT_TIME
      : value;
  const selectCheck = isControlled ? valueIsDelta : localCheck;
  const deltaAvailable =
    selectRadio !== DEFAULT_TIME && isAvailable(deltaFor(selectRadio));

  // filter
  const renderOptions = radioOptions.map((item) => {
    return (
      <RadioGroup.Item
        key={item.key}
        value={item.key}
        disabled={!isAvailable(item.name)}
      >
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator />
        <RadioGroup.ItemText>{item.name}</RadioGroup.ItemText>
      </RadioGroup.Item>
    );
  });
  // action
  const sendAction = (radioVal = '', checkVal = false) => {
    const newVal = [];

    if (!radioVal || radioVal === DEFAULT_TIME) {
      newVal.push(DEFAULT_TIME);
    } else {
      if (checkVal) {
        const filteredOption = deltaFor(radioVal);
        if (filteredOption) {
          newVal.push(filteredOption);
        }
      } else {
        newVal.push(radioVal);
      }
    }

    handleAction([...newVal]);
  };

  const handleChangeRadio = (val) => {
    // Keep showing the delta only if the run has it for the new scenario.
    const check =
      val != DEFAULT_TIME && selectCheck && isAvailable(deltaFor(val));
    if (!isControlled) {
      setLocalRadio(val);
      setLocalCheck(check);
    }
    sendAction(val, check);
  };
  const handleChangeCheck = () => {
    let newValue = !selectCheck;

    if (!isControlled) setLocalCheck(newValue);
    sendAction(selectRadio, newValue);
  };

  return (
    // A plain group, not a Field: the Show Delta checkbox would take the
    // Field's ids.
    <Box
      my={4}
      role='group'
      aria-labelledby={headingId}
      aria-describedby={describedBy}
    >
      <FormLabelFlex
        id={headingId}
        label={label}
        info={info}
        isDisabled={isDisabled}
        isGroup
      />
      <RadioGroup.Root
        aria-labelledby={headingId}
        size='sm'
        colorPalette='blue'
        value={selectRadio}
        onValueChange={(e) => handleChangeRadio(e.value)}
        disabled={isDisabled}
      >
        <Stack pl={0} py={1} gap={1}>
          {renderOptions}
        </Stack>
      </RadioGroup.Root>
      <Stack pl={0} pt={2} gap={1}>
        <Checkbox.Root
          size='sm'
          colorPalette='blue'
          checked={selectCheck}
          onCheckedChange={handleChangeCheck}
          disabled={!deltaAvailable}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontWeight='normal'>Show Delta</Checkbox.Label>
        </Checkbox.Root>
      </Stack>
    </Box>
  );
};
export default FormControlRadioTime;
