import { Box, Text, Heading } from '@chakra-ui/react';

// Page title for tool surfaces (Explore sidebar): the page's <h1>.
const FormControlText = ({ label, text = '' }) => {
  return (
    <Box py={2}>
      <Heading
        as='h1'
        fontSize='md'
        fontWeight={700}
        lineHeight='20px'
        textTransform='uppercase'
        color='blue.700'
        mb={2}
      >
        {label}
      </Heading>
      <Text fontSize='sm' textAlign='start' fontWeight={400} color='initial'>
        {text}
      </Text>
    </Box>
  );
};

export default FormControlText;
