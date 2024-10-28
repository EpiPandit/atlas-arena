import { Box, useRadio } from '@chakra-ui/react';

const RadioCard = (props) => {
  const { isFirst } = props;
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();
  const customBorders = isFirst
    ? {
        borderLeftRadius: '4px',
        borderRightRadius: '0px',
      }
    : {
        borderLeftRadius: '0px',
        borderRightRadius: '4px',
      };
  return (
    <Box as='label' flex={isFirst ? 1 : null}>
      <input {...input} />
      <Box
        {...checkbox}
        {...customBorders}
        cursor='pointer'
        borderWidth='1px'
        boxShadow='none'
        borderColor='blue.700'
        color='blue.700'
        fontSize='xs'
        fontWeight='semibold'
        _checked={{
          bg: 'blue.50',
        }}
        _focus={{
          boxShadow: 'none',
        }}
        p={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;
