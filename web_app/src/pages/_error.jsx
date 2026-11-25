import { Flex, Box, Text, Icon, Button, Heading } from '@chakra-ui/react';
import { LuAlertTriangle } from 'react-icons/lu';
import PageTitle from '@/components/custom/PageTitle';
import { buildPageTitle } from '@/config/constants/general';

const ErrorPage = ({ statusCode }) => {
  const heading = statusCode ? `Error ${statusCode}` : 'Application error';
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
      <PageTitle title={buildPageTitle(heading)} />
      <Icon
        as={LuAlertTriangle}
        boxSize={64}
        color='red.500'
        mb={4}
        aria-hidden='true'
      />
      <Box textAlign='center'>
        <Heading
          as='h1'
          fontSize='4xl'
          fontWeight='bold'
          lineHeight='shorter'
          color='gray.700'
          mb={2}
        >
          {heading}
        </Heading>
        <Text fontSize='lg' color='gray.500' mb={6}>
          Ups !{' '}
          {statusCode
            ? `An error occurred on the server.`
            : 'An error occurred on the client.'}
        </Text>

        <Button
          variant='subtle'
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
