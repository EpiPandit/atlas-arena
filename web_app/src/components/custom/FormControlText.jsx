import { FormControl, FormLabel, Flex, Text } from '@chakra-ui/react';

const FormControlText = ({ label, text = '' }) => {
  return (
    <FormControl py={2}>
      <FormLabel
        fontSize='md'
        fontWeight={700}
        lineHeight='20px'
        textTransform='uppercase'
        color='blue.700'
        px={0}
        mx={0}
      >
        <Flex justifyContent='space-between' alignItems='center'>
          {label}
        </Flex>
      </FormLabel>
      <Text fontSize='sm' textAlign='start' borderBottom={2} fontWeight={400}>
        {text}
      </Text>
    </FormControl>
  );
};

export default FormControlText;
