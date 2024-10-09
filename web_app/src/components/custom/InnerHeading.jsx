import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownThemeHome from '@/config/markdownThemeHome';

const InnerHeading = ({
  kicker = '',
  title = '',
  sub_title = '',
  contentHtml = null,
}) => {
  const renderContent = contentHtml && (
    <Box py={2} px={2}>
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
        fontSize='xs'
        fontWeight='bold'
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
      fontSize='sm'
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
    <Box p={0} mx='auto' maxW='700px'>
      {renderKicker}
      <Box py={1} px={2}>
        <Text
          fontSize='6xl'
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
