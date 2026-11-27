import { useId, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  Heading,
  IconButton,
  Portal,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LuBarChart3,
  LuPanelRightClose,
  LuPanelRightOpen,
} from 'react-icons/lu';
import JobMetrics from '@/components/explore/JobMetrics';
import { useJobMetrics } from '@/components/explore/useJobMetrics';
import { H_FILTER_BAR } from '@/config/constants/general';
import {
  METRICS_PANEL_TITLE,
  METRICS_PANEL_SHOW,
  METRICS_PANEL_HIDE,
} from '@/config/constants/constants.explore';

const W_PANEL = 330;
const W_RAIL = 40;

const PanelHeading = ({ id, species }) => (
  <Box>
    <Heading
      as='h2'
      id={id}
      fontSize='xs'
      fontWeight={600}
      letterSpacing='0.5px'
      color='gray.600'
      lineHeight='short'
      textTransform='uppercase'
    >
      {METRICS_PANEL_TITLE}
    </Heading>
    {species && (
      <Text fontSize='md' fontWeight={500} fontStyle='italic' color='blue.700'>
        {species}
      </Text>
    )}
  </Box>
);

// A finished model run's performance and feature importance, docked to the
// right of the map (a bottom sheet on mobile). Renders nothing for a job
// without metrics.
const MetricsPanel = ({ jobId, species }) => {
  const state = useJobMetrics(jobId);
  const headingId = useId();
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: 'md' }
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Older jobs have no summary tables.
  if (!state.loading && !state.error && !state.metrics) return null;

  if (isMobile) {
    return (
      <Drawer.Root
        open={isMobileOpen}
        onOpenChange={(e) => setIsMobileOpen(e.open)}
        placement='bottom'
      >
        <Drawer.Trigger asChild>
          <Button
            position='absolute'
            top={`${H_FILTER_BAR + 8}px`}
            left={2}
            zIndex={10}
            size='xs'
            colorPalette='blue'
            boxShadow='md'
          >
            <LuBarChart3 aria-hidden='true' />
            {METRICS_PANEL_TITLE}
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content
              maxH='75vh'
              bg='secondary.50'
              aria-labelledby={headingId}
            >
              <Drawer.Header pb={2}>
                <PanelHeading id={headingId} species={species} />
              </Drawer.Header>
              <Drawer.CloseTrigger asChild top='3' right='3'>
                <CloseButton size='sm' color='blue.500' />
              </Drawer.CloseTrigger>
              <Drawer.Body pt={0}>
                <JobMetrics {...state} />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  }

  return (
    <Box
      as='aside'
      aria-labelledby={headingId}
      w={`${isCollapsed ? W_RAIL : W_PANEL}px`}
      h='100%'
      flexShrink={0}
      bg='secondary.50'
      borderLeft='1px solid'
      borderColor='blackAlpha.100'
      boxShadow='sm'
      overflow='hidden'
      transition='width 0.3s ease'
    >
      {isCollapsed ? (
        // A rail rather than a floating tab, so it never covers the
        // "About the virus" tab on the map's right edge.
        <Button
          variant='plain'
          w='100%'
          h='auto'
          py={3}
          gap={2}
          color='blue.800'
          fontSize='xs'
          fontWeight={700}
          textTransform='uppercase'
          borderRadius={0}
          _hover={{ bg: 'secondary.100' }}
          css={{ writingMode: 'vertical-rl' }}
          aria-label={METRICS_PANEL_SHOW}
          aria-expanded={false}
          onClick={() => setIsCollapsed(false)}
        >
          <LuPanelRightOpen aria-hidden='true' />
          <span id={headingId}>{METRICS_PANEL_TITLE}</span>
        </Button>
      ) : null}
      {/* Hidden rather than unmounted, so "Show all features" stays as set. */}
      <Flex
        direction='column'
        display={isCollapsed ? 'none' : 'flex'}
        h='100%'
        minW={`${W_PANEL}px`}
      >
        <Flex
          align='flex-start'
          justify='space-between'
          gap={2}
          px={4}
          pt={4}
          pb={2}
        >
          <PanelHeading
            id={isCollapsed ? undefined : headingId}
            species={species}
          />
          <IconButton
            aria-label={METRICS_PANEL_HIDE}
            aria-expanded
            size='sm'
            variant='plain'
            color='blue.800'
            _hover={{ bg: 'secondary.100' }}
            onClick={() => setIsCollapsed(true)}
          >
            <LuPanelRightClose />
          </IconButton>
        </Flex>
        <Box flex={1} minH={0} overflowY='auto' px={4} pb={4}>
          <JobMetrics {...state} />
        </Box>
      </Flex>
    </Box>
  );
};

export default MetricsPanel;
