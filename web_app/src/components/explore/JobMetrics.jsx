import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import { findFeature, featureGroups } from '@/libs/features';
import {
  METRICS_PERFORMANCE_LABEL,
  METRICS_PERFORMANCE_NOTE,
  METRICS_IMPORTANCE_LABEL,
  METRICS_LOADING,
  METRICS_ERROR,
  METRICS_SHOW_ALL,
  METRICS_SHOW_FEWER,
  METRICS_SPLITS,
  METRICS_NAMES,
  METRICS_MODEL_NAMES,
} from '@/config/constants/constants.explore';

// Basic display of a finished run's stats, for restyling: all the data comes
// from useJobMetrics (called by MetricsPanel), and this file only decides how
// it looks.

const TOP_FEATURES = 10;

const modelName = (id) => METRICS_MODEL_NAMES[id] || id;

const formatStat = ({ mean, std } = {}, digits = 2) => {
  if (mean == null) return '–';
  const value = mean.toFixed(digits);
  return std == null ? value : `${value} ± ${std.toFixed(digits)}`;
};

const SectionHeading = ({ children }) => (
  <Heading
    as='h3'
    fontSize='xs'
    fontWeight={600}
    letterSpacing='0.5px'
    color='gray.600'
    lineHeight='short'
    textTransform='uppercase'
  >
    {children}
  </Heading>
);

// One table per split (held-out test, cross-validation): a row per metric, a
// column per model. Cells show the mean; the ± spread is in the hover title.
const PerformanceTable = ({ models, split }) => (
  <Table.Root size='sm' textStyle='xs' aria-label={split.label}>
    <Table.Header>
      <Table.Row bg='transparent'>
        <Table.ColumnHeader p={1}>{split.label}</Table.ColumnHeader>
        {models.map(({ id }) => (
          <Table.ColumnHeader key={id} p={1} textAlign='end'>
            {modelName(id)}
          </Table.ColumnHeader>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {Object.entries(METRICS_NAMES).map(([metric, name]) => (
        <Table.Row key={metric} bg='transparent'>
          <Table.Cell p={1}>{name}</Table.Cell>
          {models.map(({ id, metrics }) => {
            const stat = metrics[`${split.prefix}_${metric}`];
            return (
              <Table.Cell
                key={id}
                p={1}
                textAlign='end'
                fontVariantNumeric='tabular-nums'
                whiteSpace='nowrap'
                title={stat?.std != null ? formatStat(stat) : undefined}
              >
                {formatStat({ mean: stat?.mean })}
              </Table.Cell>
            );
          })}
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

// Swatches for the feature groups shown, since bars are coloured by group.
const GroupLegend = ({ groups }) => (
  <Flex as='ul' wrap='wrap' gap={3} listStyleType='none' fontSize='2xs'>
    {groups.map(({ key, label, color }) => (
      <Flex as='li' key={key} align='center' gap={1} color='gray.700'>
        <Box w='8px' h='8px' borderRadius='2px' bg={color} aria-hidden='true' />
        {label}
      </Flex>
    ))}
  </Flex>
);

// Bars are scaled to the model's largest importance. Rows show the feature's
// short label; the full name is in the tooltip and read by screen readers.
const ImportanceBars = ({ model, rows }) => {
  const max = rows[0]?.mean || 1;
  return (
    <Box>
      <Text as='h4' fontSize='xs' fontWeight={600} color='gray.700' mb={1}>
        {modelName(model)}
      </Text>
      <Flex as='ul' direction='column' gap='3px' listStyleType='none'>
        {rows.map((row) => {
          const feature = findFeature(row.feature);
          const units = feature.units ? ` (${feature.units})` : '';
          return (
            <Flex
              as='li'
              key={row.feature}
              align='center'
              gap={2}
              fontSize='2xs'
              lineHeight='short'
              title={`${feature.name}${units}: ${formatStat(row, 3)}`}
            >
              <Text w='7.5rem' flexShrink={0} color='gray.700' truncate>
                <span aria-hidden='true'>{feature.label}</span>
                <VisuallyHidden>{feature.name}</VisuallyHidden>
              </Text>
              <Box flex={1} minW={0} aria-hidden='true'>
                <Box
                  h='8px'
                  w={`${Math.max((row.mean / max) * 100, 0)}%`}
                  bg={feature.color}
                  borderRightRadius='3px'
                />
              </Box>
              <Text
                w='2rem'
                flexShrink={0}
                textAlign='end'
                color='gray.600'
                fontVariantNumeric='tabular-nums'
              >
                {row.mean.toFixed(3)}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

// metrics / loading / error: useJobMetrics' state.
const JobMetrics = ({ metrics, loading, error }) => {
  const [showAll, setShowAll] = useState(false);

  if (loading || error) {
    return (
      <Text fontSize='xs' color='gray.600'>
        {error ? METRICS_ERROR : METRICS_LOADING}
      </Text>
    );
  }
  // Older jobs have no summary tables.
  if (!metrics) return null;

  const { models, importances } = metrics;
  const importanceEntries = Object.entries(importances);
  const shownImportances = importanceEntries.map(([model, rows]) => [
    model,
    showAll ? rows : rows.slice(0, TOP_FEATURES),
  ]);
  const hasMore = importanceEntries.some(
    ([, rows]) => rows.length > TOP_FEATURES
  );

  return (
    <Flex direction='column' gap={3}>
      {models.length > 0 && (
        <Flex direction='column' gap={2}>
          <SectionHeading>{METRICS_PERFORMANCE_LABEL}</SectionHeading>
          <Flex direction='column' gap={3} py={1}>
            {METRICS_SPLITS.map((split) => (
              <PerformanceTable
                key={split.prefix}
                models={models}
                split={split}
              />
            ))}
          </Flex>
          <Text fontSize='2xs' color='gray.600'>
            {METRICS_PERFORMANCE_NOTE}
          </Text>
        </Flex>
      )}
      {importanceEntries.length > 0 && (
        <Flex direction='column' gap={2}>
          <SectionHeading>{METRICS_IMPORTANCE_LABEL}</SectionHeading>
          <GroupLegend
            groups={featureGroups(
              shownImportances.flatMap(([, rows]) =>
                rows.map((row) => row.feature)
              )
            )}
          />
          {shownImportances.map(([model, rows]) => (
            <ImportanceBars key={model} model={model} rows={rows} />
          ))}
          {hasMore && (
            <Button
              size='xs'
              variant='ghost'
              colorPalette='blue'
              alignSelf='stretch'
              aria-expanded={showAll}
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? METRICS_SHOW_FEWER : METRICS_SHOW_ALL}
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default JobMetrics;
