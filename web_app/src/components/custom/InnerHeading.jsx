import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownThemeHome from '@/config/md/markdownThemeHome';

const InnerHeading = ({
  kicker = '',
  title = '',
  sub_title = '',
  contentHtml = null,
}) => {
  const renderContent = contentHtml && (
    <Box py={0} px={0}>
      <ReactMarkdown
        components={ChakraUIRenderer(MarkdownThemeHome)}
        children={contentHtml}
        skipHtml={false}
      />
    </Box>
  );
  const renderKicker = kicker && kicker !== '' && (
    <Flex py={3} justifyContent='center'>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        fontWeight='semibold'
        color='blue.900'
        textTransform='uppercase'
        letterSpacing='wider'
        textAlign='center'
        borderBottom={2}
        borderBottomColor='blue.800'
        borderStyle='solid'
      >
        {kicker}
      </Text>
    </Flex>
  );
  const renderSubTitle = sub_title && sub_title !== '' && (
    <Text
      fontSize={{ base: 'sm', md: 'md' }}
      fontWeight={600}
      color='blue.900'
      lineHeight='shorter'
      letterSpacing='wider'
      textAlign='start'
      textTransform='uppercase'
    >
      {sub_title}
    </Text>
  );

  return (
    <Box p={1} mx='auto' >
      {renderKicker}
      <Box py={{ base: 2, md: 4 }}>
        <Text
          fontSize={['3xl', '4xl', '5xl', '6xl']}
          fontWeight={600}
          color='blue.900'
          lineHeight='shorter'
          letterSpacing='wider'
          textAlign='start'
          textTransform='uppercase'
          sx={{
            '&::first-letter': {
              textDecoration: 'underline',
              textUnderlineOffset: '16px',
            },
          }}
          mb={4}
        >
          {title}
        </Text>
        {renderSubTitle}
      </Box>
      {renderContent}
    </Box>
  );
};

export default InnerHeading;
