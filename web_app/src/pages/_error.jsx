import { Flex, Box, Text, Icon, Button } from '@chakra-ui/react';
import { IoWarningOutline } from 'react-icons/io5';

const ErrorPage = ({ statusCode }) => {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      h='100vh - 64px'
      bg='yellow.10'
      p={4}
      my='auto'
    >
      <Icon as={IoWarningOutline} boxSize={64} color='red.500' mb={4} />
      <Box textAlign='center'>
        <Text fontSize='4xl' fontWeight='bold' color='gray.700' mb={2}>
          {statusCode ? `Error ${statusCode}` : 'Application error'}
        </Text>
        <Text fontSize='lg' color='gray.500' mb={6}>
          Ups !{' '}
          {statusCode
            ? `An error occurred on the server.`
            : 'An error occurred on the client.'}
        </Text>

        <Button
          colorScheme='gray'
          size='lg'
          onClick={() => (window.location.href = '/')}
        >
          Back to Home
        </Button>
      </Box>
    </Flex>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
