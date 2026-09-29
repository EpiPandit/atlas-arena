import { FormControl, FormLabel, HStack, Flex } from '@chakra-ui/react';
import RadioCard from '@/components/custom/RadioCard';
import { useRadioGroup } from '@chakra-ui/react';
import { useId } from 'react';
import FormLabelFlex from '@/components/custom/FormLabelFlex';

const FormControlRadioCard = ({
  label,
  options,
  handleAction,
  value = '',
  info = '',
  isDisabled = false,
}) => {
  const headingId = useId();
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'view_moce',
    defaultValue: value,
    onChange: handleAction,
  });

  const group = getRootProps();

  return (
    <FormControl py={2} isDisabled={isDisabled} aria-labelledby={headingId}>
      <FormLabelFlex
        id={headingId}
        label={label}
        info={info}
        isDisabled={isDisabled}
        isGroup
      />
      <HStack {...group} aria-labelledby={headingId} gap={0}>
        {options.map((value, k) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} isFirst={k == 0} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
    </FormControl>
  );
};

export default FormControlRadioCard;
