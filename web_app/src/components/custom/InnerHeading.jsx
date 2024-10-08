import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import MarkdownThemeHome from '@/config/markdownThemeHome';

const InnerHeading = ({ kicker = '', title = '', contentHtml = null }) => {
  const renderContent = contentHtml && (
    <Box py={4} px={2}>
      <ReactMarkdown
        components={ChakraUIRenderer(MarkdownThemeHome)}
        children={contentHtml}
        skipHtml={false}
      />
    </Box>
  );

  return (
    <Box p={0} mx='auto' maxW='700px'>
      <Flex py={1} justifyContent='center'>
        <Text
          fontSize='xs'
          fontWeight='bold'
          color='blue.900'
          textTransform='uppercase'
          letterSpacing='wider'
          textAlign='center'
          borderBottom={2}
          p={0}
          m={0}
          borderBottomColor='blue.800'
          borderStyle='solid'
        >
          {kicker}
        </Text>
      </Flex>
      <Box py={1} px={2}>
        <Text
          fontSize={{ base: '4xl', md: '6xl' }}
          fontWeight='bold'
          color='blue.900'
          lineHeight='shorter'
          letterSpacing='wider'
          fontStyle='italic'
          textAlign='center'
        >
          {title}
        </Text>
      </Box>
      {renderContent}
    </Box>
  );
};

export default InnerHeading;
