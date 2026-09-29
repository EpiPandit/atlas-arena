import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  MAP_SUMMARY_TITLE,
  MAP_TABLE_SHOW,
  MAP_TABLE_HIDE,
  MAP_TABLE_CAPTION,
  MAP_SDM_NOTE,
} from '@/config/constants/constants.explore';

export const MAP_SUMMARY_TEXT_ID = 'map-summary-text';
const TABLE_ID = 'map-summary-table';
const TOP_COUNTRIES = 3;

const formatNumber = (n) => n.toLocaleString('en-US');

const formatList = (items) => {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

// Mirrors the time-frame filter used by the hotspot map layers
// (FoiVectorLayer / HeadMapLayer): a hotspot time_frame is shown when it is a
// substring of the selected scenario; delta scenarios drop 'current'.
const getHotspotTimeFrames = (timeFrame = [], available = []) => {
  let selected = timeFrame.join('').toLowerCase();
  if (selected.includes('delta')) {
    selected = selected.replace('current', '');
  }
  return available.filter((key) => selected.includes(key));
};

const getVirusStats = (summary, virus, timeFrame) => {
  const byTime = summary[virus] || {};
  const keys = getHotspotTimeFrames(timeFrame, Object.keys(byTime));
  const byCountry = {};
  keys.forEach((key) =>
    byTime[key].countries.forEach(({ name, count }) => {
      byCountry[name] = (byCountry[name] || 0) + count;
    })
  );
  const countries = Object.entries(byCountry)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  return {
    virus,
    total: countries.reduce((acc, i) => acc + i.count, 0),
    countries,
  };
};

// Text alternative for the Explore map (WCAG 1.1.1): a generated summary
// that tracks the current filters, plus an optional data table.
const MapSummary = ({
  summary = {},
  timeFrame = [],
  model = '',
  hotspotLayers = [],
  sdmLayers = [],
  opacity = {},
}) => {
  const [showTable, setShowTable] = useState(false);

  const scenario = timeFrame.join(', ');
  const stats = hotspotLayers.map(({ title }) =>
    getVirusStats(summary, title, timeFrame)
  );
  const hidden = [...hotspotLayers, ...sdmLayers]
    .map(({ title }) => title)
    .filter((title) => opacity[title] === 0);

  const hotspotSentences = stats.length
    ? stats.map(({ virus, total, countries }) => {
        if (!total) return `${virus}: no hotspot grid cells in this scenario.`;
        const top = countries
          .slice(0, TOP_COUNTRIES)
          .map(({ name, count }) => `${name} (${formatNumber(count)})`);
        return `${virus}: ${formatNumber(total)} hotspot grid cells, mostly in ${formatList(top)}.`;
      })
    : ['No viral hotspot layers are shown.'];

  const sdmSentence = sdmLayers.length
    ? `Species distribution probability layers${model ? ` (${model} model)` : ''} are shown for ${formatList(sdmLayers.map(({ title }) => title))}. ${MAP_SDM_NOTE}`
    : 'No species distribution layers are shown.';

  // table rows: one per country, one column per visible virus
  const rows = {};
  stats.forEach(({ virus, countries }) =>
    countries.forEach(({ name, count }) => {
      rows[name] = rows[name] || { name, total: 0 };
      rows[name][virus] = count;
      rows[name].total += count;
    })
  );
  const tableRows = Object.values(rows).sort((a, b) => b.total - a.total);
  const hasTotal = stats.length > 1;

  return (
    <Box
      as='section'
      aria-labelledby='map-summary-title'
      mt={6}
      pt={4}
      borderTop='1px solid'
      borderColor='blackAlpha.300'
    >
      <Heading
        as='h2'
        id='map-summary-title'
        fontSize='sm'
        fontWeight={700}
        textTransform='uppercase'
        mb={2}
      >
        {MAP_SUMMARY_TITLE}
      </Heading>
      <Box
        id={MAP_SUMMARY_TEXT_ID}
        aria-live='polite'
        fontSize='xs'
        color='gray.700'
      >
        {scenario && <Text mb={1}>Climate scenario: {scenario}.</Text>}
        {hotspotSentences.map((sentence) => (
          <Text key={sentence} mb={1}>
            {sentence}
          </Text>
        ))}
        <Text mb={1}>{sdmSentence}</Text>
        {hidden.length > 0 && (
          <Text mb={1}>Hidden layers: {formatList(hidden)}.</Text>
        )}
      </Box>
      {tableRows.length > 0 && (
        <>
          <Button
            size='xs'
            variant='outline'
            colorScheme='blue'
            mt={2}
            aria-expanded={showTable}
            aria-controls={TABLE_ID}
            onClick={() => setShowTable(!showTable)}
          >
            {showTable ? MAP_TABLE_HIDE : MAP_TABLE_SHOW}
          </Button>
          <TableContainer
            id={TABLE_ID}
            hidden={!showTable}
            display={showTable ? 'block' : 'none'}
            mt={2}
          >
            <Table size='sm' variant='simple'>
              <TableCaption placement='top' m={0} px={0} textAlign='start'>
                {MAP_TABLE_CAPTION}
                {scenario ? ` (${scenario})` : ''}
              </TableCaption>
              <Thead>
                <Tr>
                  <Th scope='col' px={1}>
                    Country
                  </Th>
                  {stats.map(({ virus }) => (
                    <Th scope='col' key={virus} isNumeric px={1}>
                      {virus.replace(/ virus$/i, '')}
                    </Th>
                  ))}
                  {hasTotal && (
                    <Th scope='col' isNumeric px={1}>
                      Total
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {tableRows.map((row) => (
                  <Tr key={row.name}>
                    <Th
                      scope='row'
                      px={1}
                      fontWeight={400}
                      textTransform='none'
                      letterSpacing='normal'
                      whiteSpace='normal'
                      fontSize='xs'
                      color='gray.700'
                    >
                      {row.name}
                    </Th>
                    {stats.map(({ virus }) => (
                      <Td key={virus} isNumeric px={1} fontSize='xs'>
                        {formatNumber(row[virus] || 0)}
                      </Td>
                    ))}
                    {hasTotal && (
                      <Td isNumeric px={1} fontSize='xs' fontWeight={600}>
                        {formatNumber(row.total)}
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default MapSummary;
