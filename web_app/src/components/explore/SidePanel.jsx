import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';

import ReactMarkdown from 'react-markdown';
import markdownTheme from '@/config/md/markdownTheme';
import { markdownComponents } from '@/config/md/markdownComponents';
import rehypeRaw from 'rehype-raw';
import { HEADER_HEIGHT_CSS } from '@/config/constants/general';
import { LuMoveLeft, LuMoveRight } from 'react-icons/lu';

const components = markdownComponents(markdownTheme);

const SidePanel = ({ dataVirus = {} }) => {
  const { contentHtml } = dataVirus || {};
  const { open, onToggle, setOpen } = useDisclosure();

  const renderContent = contentHtml && (
    <Box py={2} px={2}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw]}
        children={contentHtml}
        skipHtml={false}
      />
    </Box>
  );
  const hasData = Boolean(contentHtml);

  useEffect(() => {
    if (!hasData) setOpen(false);
  }, [hasData]);
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
        onClick={onToggle}
        minH='fit-content'
        colorPalette='blue'
        fontSize='xs'
        fontWeight={700}
        right={open ? 'auto' : '0'}
        display='flex'
        alignItems='center'
        justifyContent='center'
        rounded='sm'
        disabled={!hasData}
        px={4}
        gap={2}
        textTransform='uppercase'
        css={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
        zIndex={11}
      >
        {open ? <LuMoveLeft /> : <LuMoveRight />} About the virus
      </Button>
      {/* Non-modal: the map stays usable while the panel is open. */}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement='end'
        size='md'
        modal={false}
        closeOnInteractOutside={false}
      >
        <Portal>
          <Drawer.Positioner pointerEvents='none'>
            <Drawer.Content
              pointerEvents='auto'
              maxH={`calc(100vh - ${HEADER_HEIGHT_CSS})`}
              mt={HEADER_HEIGHT_CSS}
              bg='secondary.50'
            >
              <Drawer.CloseTrigger asChild top='4' right='4'>
                <CloseButton size='sm' color='blue.500' />
              </Drawer.CloseTrigger>
              <Drawer.Body px={2}>{renderContent}</Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default SidePanel;
