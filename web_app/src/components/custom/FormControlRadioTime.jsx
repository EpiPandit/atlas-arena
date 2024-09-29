import { ALL_VIRUS } from '@/config/constants';
import {
  FormControl,
  FormLabel,
  Stack,
  Radio,
  RadioGroup,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';

const FormControlRadioTime = ({ label, options, handleAction }) => {
  const [selectRadio, setSelectRadio] = useState('');
  const [selectCheck, setSelectCheck] = useState(false);

  if (!options.length) return null;

  // filter
  const renderOptions = options
    .filter((i) => !`${i.name}`.toLowerCase().includes('delta'))
    .map((item) => {
      return (
        <Radio
          isChecked={selectRadio === item.name}
          key={item.key}
          value={item.key}
          isDisabled={false}
        >
          {item.name}
        </Radio>
      );
    });
  const deltaOptions = options
    .filter((i) => `${i.name}`.toLowerCase().includes('delta'))
    .map((item) => item.name);

  // action
  const sendAction = (radioVal, checkVal) => {
    let newVal = [];
    if (radioVal) {
      newVal.push(radioVal);
    }
    if (checkVal && deltaOptions.length) {
      newVal = newVal.concat(deltaOptions);
    }
    handleAction([...newVal]);
  };
  const handleChangeRadio = (val) => {
    setSelectRadio(val);
    sendAction(val, selectCheck);
  };
  const handleChangeCheck = () => {
    setSelectCheck(!selectCheck);
    sendAction(selectRadio, !selectCheck);
  };

  return (
    <FormControl my={4}>
      <FormLabel
        fontSize='sm'
        fontFamily='EB Garamond Variable'
        textTransform='uppercase'
      >
        {label}
      </FormLabel>
      <RadioGroup onChange={handleChangeRadio}>
        <Stack pl={0} py={1} spacing={1}>
          {renderOptions}
        </Stack>
      </RadioGroup>
      <Stack pl={0} pt={2} spacing={1}>
        <Checkbox
          onChange={handleChangeCheck}
          isChecked={selectCheck}
          isDisabled={deltaOptions.length === 0}
        >
          Show Delta
        </Checkbox>
      </Stack>
    </FormControl>
  );
};
export default FormControlRadioTime;
