import React, { useRef, useEffect, useState } from 'react';
import { Flex, Box, HStack, Icon, Text } from '@chakra-ui/react';
import { LuFile, LuUpload } from 'react-icons/lu';
import Map from 'react-map-gl/maplibre';
import { useAppContext } from '@/store/context';
import { dynamicFilter, getUniqueCombinations, sortList } from '@/utils/utils';
import Sidebar, { SIDEBAR_TABS } from '@/components/explore/Sidebar';
import SDMLegend from '@/components/explore/SDMLegend';
import { getMetadataMd } from '@/libs/markdown';
import SidePanel from '@/components/explore/SidePanel';
import MetricsPanel from '@/components/explore/MetricsPanel';
import {
  ALL_VIRUS,
  BASEMAP_STYLE,
  DEFAULT_OPACITY_MULTIPLE,
  DEFAULT_OPACITY_SINGLE,
  MAX_ZOOM_MAP,
  MIN_ZOOM_MAP,
} from '@/config/constants/general';
import DeckOverlay from '@/components/explore/DeckOverlay';
import { buildCogLayer } from '@/components/explore/cogLayer';
import PresenceLayer from '@/components/explore/PresenceLayer';
import { useCustomJob } from '@/components/explore/useCustomJob';
import { setHashParams, useHashParams } from '@/libs/hashParams';
import { showRuns } from '@/libs/runHistory';
import { FOI_RANGE, distinctColors } from '@/libs/catalog';
import {
  LEGEND_FOI_TITLE,
  LEGEND_FOI_TICKS,
  MAP_POINTS_EMPTY,
  MAP_POINTS_LOADED,
} from '@/config/constants/constants.explore';
import { useAuth } from '@/store/auth';
import PageTitle from '@/components/custom/PageTitle';
import { buildPageTitle } from '@/config/constants/general';
import { MAP_REGION_LABEL } from '@/config/constants/constants.explore';

const initialViewState = {
  latitude: -19,
  longitude: -55,
  zoom: 3.1,
};

const Explore = ({ mddata }) => {
  const { raw_data } = useAppContext();

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.resize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const [viewState, setViewState] = useState({ ...initialViewState });
  const [filterTilesId, setFilterTilesId] = useState([]);
  const [catalogFoiRows, setCatalogFoiRows] = useState([]);
  const [opacityFilter, setLayerStyle] = useState({});

  const [dataVirus, setDataVirus] = useState({});
  const [hasDeltaValue, setHasDeltaValue] = useState(false);
  const [dataFilter, setDataFilter] = useState({});

  const customJob = useCustomJob();
  const { customData } = customJob;
  const { status: authStatus } = useAuth();

  // Sidebar tab. A loaded model run opens Run Models (its results, for anyone
  // with the link); otherwise signing out leaves it.
  const [sidebarTab, setSidebarTab] = useState(SIDEBAR_TABS.EXPLORE);
  const customJobId = customData ? customData.jobId : null;
  // The job the map was last fitted to; cleared with the job so reopening it fits again.
  const fittedJobRef = useRef(null);
  useEffect(() => {
    if (customJobId) setSidebarTab(SIDEBAR_TABS.RUN);
    else fittedJobRef.current = null;
  }, [customJobId]);
  useEffect(() => {
    if (authStatus !== 'signedIn' && !customJobId)
      setSidebarTab(SIDEBAR_TABS.EXPLORE);
  }, [authStatus, customJobId]);
  // #tab=run (the account menu's "Previous jobs") opens Run Models once signed in,
  // then leaves the URL.
  const { tab: tabParam } = useHashParams();
  useEffect(() => {
    if (tabParam !== SIDEBAR_TABS.RUN || authStatus === 'loading') return;
    if (authStatus === 'signedIn') {
      setSidebarTab(SIDEBAR_TABS.RUN);
      showRuns();
    }
    setHashParams({ tab: null });
  }, [tabParam, authStatus]);
  const pointCount = customJob.points ? customJob.points.features.length : null;
  const showPointsHint = sidebarTab === SIDEBAR_TABS.RUN && !customData;

  const handleFilterTilesId = (data_filter) => {
    // A species hosting several viruses has one SDM row per virus, all with
    // the same raster: under "All (combined)" draw it once.
    const seenUrls = new Set();
    const raw_data_filter = dynamicFilter(
      raw_data.filter((i) => i.variable !== 'foi'),
      { ...data_filter }
    ).filter((i) => !seenUrls.has(i.url) && seenUrls.add(i.url));
    // FOI follows the same virus/species/scenario but not the model.
    setCatalogFoiRows(
      dynamicFilter(
        raw_data.filter((i) => i.variable === 'foi'),
        {
          virus: data_filter.virus,
          species: data_filter.foi_species || [],
          time_frame: data_filter.time_frame,
        }
      )
    );
    const hasDelta =
      data_filter &&
      data_filter.time_frame &&
      data_filter.time_frame.length &&
      data_filter.time_frame.filter((i) =>
        `${i}`.toLowerCase().includes('delta')
      ).length > 0;
    setHasDeltaValue(hasDelta);
    setFilterTilesId(raw_data_filter);
    setDataFilter(data_filter);

    // show virus draw
    const { virus } = data_filter;

    if (virus && mddata) {
      setDataVirus(mddata[virus] || {});
    } else {
      setDataVirus({});
    }
  };

  const handleChangeLayerStyle = (specie, val) => {
    let tmpOpacityFilter = { ...opacityFilter };
    tmpOpacityFilter[specie] = val;
    setLayerStyle({ ...tmpOpacityFilter });
  };

  // While custom data is loaded it replaces the catalog SDM layers; the SDM
  // toggle (off clears the model filter) still hides it.
  const customItems =
    customData && customJob.rasterUrl && dataFilter.model
      ? [
          {
            species: customData.species,
            url: customJob.rasterUrl,
            range: customJob.isDelta ? [-1, 1] : [0, 1],
            color: customJob.speciesColor,
          },
        ]
      : [];
  // Catalog FOI is hidden while a model run is shown: the run brings its own.
  const catalogFoi = customData ? [] : catalogFoiRows;
  const catalogFoiViruses = [...new Set(catalogFoi.map((i) => i.virus))].sort();

  // One ramp per species and per FOI virus on the map, no two alike: most
  // catalog species have no colour of their own.
  const catalogSpecies = customData
    ? []
    : [...new Set(filterTilesId.map((i) => i.species))].sort();
  const firstOf = (rows, key, value) => rows.find((i) => i[key] === value);
  const rampColors = distinctColors([
    ...catalogSpecies.map(
      (name) => firstOf(filterTilesId, 'species', name).color
    ),
    ...catalogFoiViruses.map(
      (name) => firstOf(catalogFoi, 'virus', name).color_virus
    ),
  ]);
  const speciesRamp = Object.fromEntries(
    catalogSpecies.map((name, i) => [name, rampColors[i]])
  );
  const virusRamp = Object.fromEntries(
    catalogFoiViruses.map((name, i) => [
      name,
      rampColors[catalogSpecies.length + i],
    ])
  );

  const sdmItems = customData
    ? customItems
    : filterTilesId.map((i) => ({ ...i, color: speciesRamp[i.species] }));

  // Same default as the legend's opacity slider (SDMLegend's has_many).
  const speciesCount = new Set(sdmItems.map((i) => i.species)).size;
  const defaultOpacity =
    speciesCount > 1 ? DEFAULT_OPACITY_MULTIPLE : DEFAULT_OPACITY_SINGLE;
  // A model run's raster zooms the map to its extent, once per job: scenario
  // switches load a new raster but keep the user's view.
  const fitToCustomRaster = (_, { geographicBounds }) => {
    if (!mapRef.current || fittedJobRef.current === customJobId) return;
    fittedJobRef.current = customJobId;
    const { west, south, east, north } = geographicBounds;
    mapRef.current.fitBounds([
      [west, south],
      [east, north],
    ]);
  };
  const sdmLayers = sdmItems.map((item) =>
    buildCogLayer({
      item,
      opacity: (opacityFilter[item.species] ?? defaultOpacity) / 100,
      onGeoTIFFLoad: customData ? fitToCustomRaster : undefined,
    })
  );

  // A custom job's FOI outputs, per virus, following the Virus dropdown.
  // Opacity key: `<virus> FOI`.
  const shownFoi = customJob.showFoi
    ? customJob.foiLayers.filter(
        (i) => dataFilter.virus === ALL_VIRUS || dataFilter.virus === i.virus
      )
    : [];
  const foiOpacityKey = (virus) => `${virus} FOI`;
  const foiDefaultOpacity =
    shownFoi.length > 1 ? DEFAULT_OPACITY_MULTIPLE : DEFAULT_OPACITY_SINGLE;
  const catalogFoiLayers = catalogFoi.map((i) =>
    buildCogLayer({
      item: { url: i.url, range: i.range, color: virusRamp[i.virus] },
      opacity:
        (opacityFilter[foiOpacityKey(i.virus)] ??
          (catalogFoiViruses.length > 1
            ? DEFAULT_OPACITY_MULTIPLE
            : DEFAULT_OPACITY_SINGLE)) / 100,
    })
  );
  // One legend row per virus, each on that virus's FOI range.
  const formatTick = (value) => `${Number(value.toPrecision(3))}`;
  const labelsCatalogFoi = catalogFoiViruses.map((name) => {
    const [min, max] = firstOf(catalogFoi, 'virus', name).range;
    return {
      title: foiOpacityKey(name),
      name,
      color: virusRamp[name],
      ticks: [min, (min + max) / 2, max].map(formatTick),
    };
  });

  const cogLayers = [
    ...sdmLayers,
    ...catalogFoiLayers,
    ...shownFoi
      .filter((i) => i.foiUrl)
      .map((i) =>
        buildCogLayer({
          item: { url: i.foiUrl, range: FOI_RANGE, color: i.color },
          opacity:
            (opacityFilter[foiOpacityKey(i.virus)] ?? foiDefaultOpacity) / 100,
        })
      ),
  ];
  const labelsFoi = shownFoi.map((i) => ({
    title: foiOpacityKey(i.virus),
    name: i.virus,
    color: i.color,
  }));

  const labelSDM = sortList(
    getUniqueCombinations(
      sdmItems.filter((i) => i.species),
      'species',
      'color'
    ).map((i) => ({
      title: i.species,
      color: i.color,
    })),
    'title'
  );

  return (
    <Flex
      position='relative'
      h='100%'
      flexDirection={{ base: 'column', md: 'row' }}
    >
      <PageTitle title={buildPageTitle('Explore')} />
      <Sidebar
        handleFilterTilesId={handleFilterTilesId}
        filterTilesId={filterTilesId}
        tab={sidebarTab}
        onTabChange={setSidebarTab}
        customData={customData}
        previewCount={pointCount}
        previewName={customJob.previewName}
        linkedViruses={customJob.foiLayers.map((layer) => layer.virus)}
        onUpload={customJob.upload}
        onUploadSuccess={customJob.onUploadSuccess}
        onFileChange={customJob.previewFile}
        onClearCustomData={customJob.clear}
        hasPoints={customJob.hasPoints}
        showPoints={customJob.showPoints}
        onTogglePoints={() => customJob.setShowPoints((show) => !show)}
        hasFoi={customJob.foiLayers.length > 0}
        showFoi={customJob.showFoi}
        onToggleFoi={() => customJob.setShowFoi((show) => !show)}
        onScenarioChange={customJob.setScenario}
      />
      <Box flex={1} minH={0} minW={0} position='relative'>
        <Box
          id='explore-map'
          role='region'
          aria-label={MAP_REGION_LABEL}
          tabIndex={-1}
          _focus={{ outline: 'none' }}
          h='100%'
        >
          <Box ref={mapContainerRef} h='100%' w='100%'>
            <Map
              ref={mapRef}
              initialViewState={viewState}
              // onLoad={handleLoad}
              minZoom={MIN_ZOOM_MAP}
              maxZoom={MAX_ZOOM_MAP}
              dragRotate={false}
              mapStyle={BASEMAP_STYLE}
            >
              <DeckOverlay layers={cogLayers} />
              <PresenceLayer data={customJob.points} />
            </Map>
          </Box>
        </Box>
        {showPointsHint && (
          <HStack
            position='absolute'
            top={4}
            left='50%'
            transform='translateX(-50%)'
            zIndex={10}
            gap={2}
            px={4}
            py={2}
            bg='white'
            borderRadius='full'
            boxShadow='md'
            fontSize='sm'
            fontWeight={600}
            color='gray.800'
            whiteSpace='nowrap'
            role='status'
          >
            <Icon
              as={pointCount ? LuFile : LuUpload}
              boxSize={4}
              color='blue.700'
              aria-hidden='true'
            />
            <Text>
              {pointCount ? MAP_POINTS_LOADED(pointCount) : MAP_POINTS_EMPTY}
            </Text>
          </HStack>
        )}
        <Box
          position='absolute'
          maxH='calc(100% - 32px)'
          bottom={4}
          left={4}
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
          gap={2}
          zIndex={10}
          width={{ base: '90%', md: 'auto' }}
        >
          <SDMLegend
            labels={labelSDM}
            value={opacityFilter}
            isDelta={customData ? customJob.isDelta : hasDeltaValue}
            handleChange={handleChangeLayerStyle}
          />
          <SDMLegend
            labels={labelsFoi}
            value={opacityFilter}
            heading={LEGEND_FOI_TITLE}
            ticks={LEGEND_FOI_TICKS}
            handleChange={handleChangeLayerStyle}
          />
          <SDMLegend
            labels={labelsCatalogFoi}
            value={opacityFilter}
            heading={LEGEND_FOI_TITLE}
            handleChange={handleChangeLayerStyle}
          />
        </Box>
        <SidePanel dataVirus={dataVirus} />
      </Box>
      {customData && customData.status === 'SUCCEEDED' && (
        <MetricsPanel
          key={customData.jobId}
          jobId={customData.jobId}
          species={customData.species}
        />
      )}
    </Flex>
  );
};

export async function getStaticProps() {
  const dataPromises = getMetadataMd(['public', 'markdown'], true);
  const data = await Promise.all(dataPromises);
  const result = data
    .filter((item) => item.layout === 'virus')
    .reduce((acc, item) => {
      acc[item.name] = { ...item };
      return acc;
    }, {});
  // home data
  return {
    props: {
      mddata: result,
    },
  };
}

export default Explore;
