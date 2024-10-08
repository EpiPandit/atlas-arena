import { Flex, FormControl, Switch, Text } from '@chakra-ui/react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

const FormControlSwitch = ({
  label,
  handleAction,
  value = false,
  isDisabled = false,
}) => {
  return (
    <FormControl py={2} isDisabled={isDisabled}>
      <FormLabelFlex />
      <Flex justifyContent='start' alignItems='center'>
        <Switch size='md' mr={2} onChange={handleAction} isChecked={value} />
        <Text as='label' fontSize='xs' color='gray.700'>
          {label}
        </Text>
      </Flex>
    </FormControl>
  );
};
export default FormControlSwitch;
