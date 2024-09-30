import { FormControl, FormLabel, HStack, Flex } from '@chakra-ui/react';
import RadioCard from '@/components/custom/RadioCard';
import { useRadioGroup } from '@chakra-ui/react';
import InfoTooltip from '@/components/custom/InfoTooltip';

const FormControlRadioCard = ({
  label,
  options,
  handleAction,
  value = '',
  info = '',
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'view_moce',
    defaultValue: value,
    onChange: handleAction,
  });

  const group = getRootProps();

  return (
    <FormControl py={2}>
      <FormLabel
        fontSize='md'
        fontStyle='italic'
        fontFamily='EB Garamond Variable'
        textTransform='uppercase'
        px={0}
        mx={0}
      >
        <Flex justifyContent='space-between' alignItems='center'>
          {label}
          <InfoTooltip label={info} />
        </Flex>
      </FormLabel>
      <HStack {...group} gap={0}>
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
