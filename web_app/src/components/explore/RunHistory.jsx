import {
  Badge,
  Box,
  Button,
  Collapsible,
  Flex,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import {
  LuAlertTriangle,
  LuCheck,
  LuChevronDown,
  LuClock,
  LuLoader2,
  LuX,
} from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { setHashParams } from '@/libs/hashParams';
import { SHOW_RUNS_EVENT, useRunHistory } from '@/libs/runHistory';
import {
  RUN_HISTORY_CLEAR,
  RUN_HISTORY_COUNT,
  RUN_HISTORY_CURRENT,
  RUN_HISTORY_EMPTY,
  RUN_HISTORY_NOTE,
  RUN_HISTORY_REMOVE,
  RUN_HISTORY_STATUS,
} from '@/config/constants/constants.explore';

// Status badges carry an icon and a word, not just a colour.
const STATUS_STYLE = {
  SUBMITTED: { icon: LuClock, palette: 'blue' },
  RUNNING: { icon: LuLoader2, palette: 'blue' },
  SUCCEEDED: { icon: LuCheck, palette: 'green' },
  FAILED: { icon: LuAlertTriangle, palette: 'red' },
  UNKNOWN: { icon: LuAlertTriangle, palette: 'red' },
  UNAVAILABLE: { icon: LuX, palette: 'gray' },
};
// Runs that can't be opened: loading them only shows an error.
const DEAD_STATUSES = ['FAILED', 'UNKNOWN', 'UNAVAILABLE'];

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS = [
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
];
const timeAgo = (ms) => {
  const diff = ms - Date.now();
  const [unit, size] = UNITS.find(([, s]) => Math.abs(diff) >= s) || UNITS[2];
  return relativeTime.format(Math.round(diff / size), unit);
};

const virusSummary = (viruses = []) =>
  viruses.length > 2
    ? `${viruses.slice(0, 2).join(', ')} +${viruses.length - 2}`
    : viruses.join(', ');

const StatusBadge = ({ status }) => {
  const { icon, palette } = STATUS_STYLE[status] || STATUS_STYLE.UNKNOWN;
  return (
    <Badge size='xs' variant='subtle' colorPalette={palette} flexShrink={0}>
      <Icon as={icon} boxSize={3} aria-hidden='true' />
      {RUN_HISTORY_STATUS[status] || status}
    </Badge>
  );
};

const RunRow = ({ run, isCurrent, onRemove }) => {
  const isDead = DEAD_STATUSES.includes(run.status);
  const viruses = virusSummary(run.viruses);
  return (
    <Flex as='li' align='center' gap={1}>
      <Button
        variant='ghost'
        size='xs'
        flex={1}
        minW={0}
        h='auto'
        py={1.5}
        px={2}
        justifyContent='space-between'
        gap={2}
        textAlign='start'
        fontWeight={400}
        bg={isCurrent ? 'secondary.100' : undefined}
        aria-current={isCurrent ? 'true' : undefined}
        disabled={isCurrent || isDead}
        _disabled={{ opacity: isCurrent ? 1 : 0.6, cursor: 'default' }}
        onClick={() =>
          setHashParams({ job: run.id, scenario: null }, { push: true })
        }
      >
        <Box minW={0}>
          <Text
            fontSize='sm'
            fontStyle='italic'
            fontWeight={500}
            color='blue.700'
            truncate
          >
            {run.species}
          </Text>
          <Text fontSize='2xs' color='gray.600' truncate>
            {[viruses, timeAgo(run.submittedAt)].filter(Boolean).join(' · ')}
          </Text>
        </Box>
        {isCurrent ? (
          <Badge size='xs' variant='outline' colorPalette='blue' flexShrink={0}>
            {RUN_HISTORY_CURRENT}
          </Badge>
        ) : (
          <StatusBadge status={run.status} />
        )}
      </Button>
      <IconButton
        aria-label={RUN_HISTORY_REMOVE(run.species)}
        size='2xs'
        variant='ghost'
        color='gray.600'
        onClick={() => onRemove(run.id)}
      >
        <LuX />
      </IconButton>
    </Flex>
  );
};

// The signed-in user's past runs (libs/runHistory); clicking one loads it.
// currentJobId: the run on the map. The account menu's "Previous jobs" fires
// SHOW_RUNS_EVENT (via explore.jsx), which opens the list and brings it into
// view.
const RunHistory = ({ currentJobId = null, defaultOpen = true }) => {
  const { runs, remove, clear, enabled } = useRunHistory();
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const show = () => {
      setOpen(true);
      // After the tab switch has unhidden the panel and the list has opened.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          rootRef.current?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
          triggerRef.current?.focus({ preventScroll: true });
        })
      );
    };
    window.addEventListener(SHOW_RUNS_EVENT, show);
    return () => window.removeEventListener(SHOW_RUNS_EVENT, show);
  }, []);

  if (!enabled) return null;

  return (
    <Collapsible.Root
      ref={rootRef}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      borderTopWidth='1px'
      borderColor='gray.200'
      pt={2}
    >
      <Collapsible.Trigger asChild>
        <Button
          ref={triggerRef}
          variant='plain'
          size='xs'
          px={0}
          w='full'
          justifyContent='space-between'
          fontSize='xs'
          fontWeight={600}
          letterSpacing='0.5px'
          color='gray.600'
          textTransform='uppercase'
          css={{
            '& svg': { transition: 'transform 0.2s' },
            '&[data-state=open] svg': { transform: 'rotate(180deg)' },
          }}
        >
          {RUN_HISTORY_COUNT(runs.length)}
          <LuChevronDown aria-hidden='true' />
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Text fontSize='2xs' color='gray.600' mb={1}>
          {runs.length ? RUN_HISTORY_NOTE : RUN_HISTORY_EMPTY}
        </Text>
        {runs.length > 0 && (
          <>
            <Flex as='ul' direction='column' gap={0.5} listStyleType='none'>
              {runs.map((run) => (
                <RunRow
                  key={run.id}
                  run={run}
                  isCurrent={run.id === currentJobId}
                  onRemove={remove}
                />
              ))}
            </Flex>
            <Button
              variant='ghost'
              size='xs'
              colorPalette='gray'
              mt={1}
              onClick={clear}
            >
              {RUN_HISTORY_CLEAR}
            </Button>
          </>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default RunHistory;
