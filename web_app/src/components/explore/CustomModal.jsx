import React, { useState } from 'react';
import { Box, Flex, Heading, Icon, Text, IconButton } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import markdownTheme from '@/config/md/markdownTheme';
import rehypeRaw from 'rehype-raw';
import { H_HEADER } from '@/config/constants/general';
import { FiChevronsUp, FiX } from 'react-icons/fi';
import { FIRST_LINE_MODAL } from '@/config/constants/constants.explore';

const CustomModal = ({ dataVirus = {} }) => {
  const { name, species, contentHtml } = dataVirus || {};
  const [isCentered, setisCentered] = useState(false);

  const toggleModal = () => {
    setisCentered(!isCentered);
  };

  const renderContent = contentHtml && (
    <Box py={2} px={2}>
      <ReactMarkdown
        components={ChakraUIRenderer(markdownTheme)}
        rehypePlugins={[rehypeRaw]}
        children={contentHtml}
        skipHtml={false}
      />
    </Box>
  );

  return (
    <>
      {isCentered && (
        <Box
          position='fixed'
          top={0}
          left={0}
          width='100vw'
          height='100vh'
          bg='rgba(0, 0, 0, 0.35)'
          backdropFilter='blur(8px)'
          zIndex={20000 - 5}
          onClick={toggleModal}
          overflow='none'
          overflowY='none'
        />
      )}

      <Box
        position='absolute'
        bottom={
          dataVirus && Object.keys(dataVirus).length && !isCentered
            ? 0
            : isCentered
              ? 'auto'
              : '0'
        }
        top={isCentered ? '5%' : 'auto'}
        left='50%'
        transform={isCentered ? 'translate(-50%, 0)' : 'translateX(-50%)'}
        width={isCentered ? ['90%', '80%', '900px'] : ['90%', '70%', '800px']}
        maxHeight={isCentered ? '80vh' : `calc(100vh - ${H_HEADER}px)`}
        marginY={isCentered ? 'auto' : 0}
        overflowY='auto'
        bg='white'
        boxShadow='lg'
        roundedTop={isCentered ? 'lg' : 'md'}
        roundedBottom={isCentered ? 'lg' : 'none'}
        zIndex={20000}
        transition='all 0.4s ease'
        opacity={dataVirus && Object.keys(dataVirus).length ? 1 : 0}
      >
        <Box p={3}>
          <Flex justifyContent='space-between' alignItems='center' p={0}>
            <Heading as='h2' variant='secondary-heading' fontSize='xl'>
              {name}
            </Heading>
            {isCentered && (
              <IconButton
                aria-label='Close Modal'
                icon={<FiX />}
                size='sm'
                onClick={toggleModal}
                color='gray.500'
              />
            )}
            {!isCentered && (
              <IconButton
                aria-label='Opem Modal'
                icon={<FiChevronsUp />}
                size='sm'
                color='gray.500'
                onClick={toggleModal}
              />
            )}
          </Flex>
        </Box>
        <Box px={3} pb={3}>
          {isCentered ? renderContent : <Text>{FIRST_LINE_MODAL}</Text>}
        </Box>
      </Box>
    </>
  );
};

export default CustomModal;
