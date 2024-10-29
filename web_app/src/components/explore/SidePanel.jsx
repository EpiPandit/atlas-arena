import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Icon,
} from '@chakra-ui/react';

import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import markdownTheme from '@/config/md/markdownTheme';
import rehypeRaw from 'rehype-raw';
import { H_HEADER } from '@/config/constants/general';
import { FiChevronsLeft, FiX } from 'react-icons/fi';
import { FIRST_LINE_MODAL } from '@/config/constants/constants.explore';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
// import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';

const VerticalTextButton = ({ onOpen, isExpanded, btnRef }) => (
  <Button
    ref={btnRef}
    position='absolute'
    top='50%'
    right={isExpanded ? 'auto' : '0'}
    left={isExpanded ? '0' : 'auto'}
    transform='translateY(-50%)'
    height='120px'
    width='40px'
    display='flex'
    alignItems='center'
    justifyContent='center'
    fontSize='sm'
    fontWeight='bold'
    color='white'
    bg='blue.500'
    _hover={{ bg: 'blue.600' }}
    onClick={onOpen}
    sx={{
      writingMode: 'vertical-rl',
    }}
  >
    About
  </Button>
);

const CustomModal = ({ dataVirus = {} }) => {
  const { contentHtml } = dataVirus || {};
  const [isCentered, setisCentered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePanel = () => {
    if (isExpanded) {
      onClose();
    } else {
      onOpen();
    }
    setIsExpanded(!isExpanded);
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
  const hasData = contentHtml && contentHtml != '';
  return (
    <Box
      position='absolute'
      top={0}
      right={0}
      display='flex'
      flexDirection='row-reverse'
      alignItems='center'
      zIndex={10}
      gap={0}
    >
      <Button
        onClick={togglePanel}
        height='130px'
        bg='secondary.50'
        fontSize='xs'
        fontWeight={700}
        color={hasData ? 'blue.800' : 'gray.500'}
        right={isExpanded ? 'auto' : '0'}
        display='flex'
        alignItems='center'
        justifyContent='center'
        rounded='sm'
        isDisabled={!hasData}
        p={0}
        gap={2}
        sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
        zIndex={11}
      >
        {isExpanded ? <FaArrowLeftLong /> : <FaArrowRightLong />} ABOUT VIRUS
      </Button>

      <Drawer isOpen={isOpen} placement='right' onClose={togglePanel} size='md'>
        <DrawerOverlay />
        <DrawerContent
          maxH={`calc(100vh - ${H_HEADER}px)`}
          mt={`${H_HEADER}px`}
        >
          <DrawerCloseButton
            top='4'
            right='4'
            size='md'
            fontWeight={700}
            color='blue.500'
          />
          <DrawerBody px={2}>{renderContent}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CustomModal;
