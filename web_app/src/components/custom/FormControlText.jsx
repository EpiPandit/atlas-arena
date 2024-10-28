import { FormControl, FormLabel, Flex, Text, Heading } from '@chakra-ui/react';

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
          <Heading size="sm" as="h4">{label}</Heading>
        </Flex>
      </FormLabel>
      <Text fontSize='sm' textAlign='start' borderBottom={2} fontWeight={400} color="initial">
        {text}
      </Text>
    </FormControl>
  );
};

export default FormControlText;
