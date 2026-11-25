import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlComboboxSpecies from '@/components/custom/FormControlComboboxSpecies';
import FormControlComboboxVirus from '@/components/custom/FormControlComboboxVirus';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import FormControlSwitch from '@/components/custom/FormControlSwitch';
import FormControlText from '@/components/custom/FormControlText';
import RunModelsPanel from '@/components/explore/RunModelsPanel';
import { useAuth } from '@/store/auth';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Portal,
  Tabs,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LuChevronDown,
  LuChevronUp,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuSlidersHorizontal,
  LuX,
} from 'react-icons/lu';

import { ALL_VIRUS, H_FILTER_BAR } from '@/config/constants/general';
import { getCatalogDefaults } from '@/libs/catalog';
import {
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
  VIRUS_LABEL,
  VIRUS_INFO,
  TIMEFRAME_LABEL,
  TIMEFRAME_INFO,
  SDM_TOGGLE_LABEL,
  FOI_TOGGLE_LABEL,
  SPECIES_LABEL,
  SPECIES_INFO,
  MODEL_LABEL,
  MODEL_INFO,
  CUSTOM_DATA_NOTICE,
  CLEAR_UPLOADED_DATA,
  TAB_EXPLORE,
  TAB_RUN,
  TAB_RUN_SIGNED_OUT,
  RUN_DESCRIPTION,
  RESULTS_DESCRIPTION,
  SHARED_RESULTS_DESCRIPTION,
  FILTERS_SHOW,
  FILTERS_HIDE,
} from '@/config/constants/constants.explore';

// Shared by the locked controls (aria-describedby) while custom data is shown
const CUSTOM_DATA_NOTICE_ID = 'custom-data-notice';
export const SIDEBAR_TABS = { EXPLORE: 'explore', RUN: 'run' };

// customData: details of the loaded custom model run, or null.
// tab / onTabChange: the selected sidebar tab (SIDEBAR_TABS), owned by the page.
const Sidebar = ({
  handleFilterTilesId,
  filterTilesId,
  tab = SIDEBAR_TABS.EXPLORE,
  onTabChange,
  customData = null,
  previewCount = null,
  previewName = null,
  linkedViruses = [],
  onUpload,
  onUploadSuccess,
  onFileChange,
  onClearCustomData,
  hasPoints = false,
  showPoints = true,
  onTogglePoints,
  hasFoi = false,
  showFoi = true,
  onToggleFoi,
  onScenarioChange,
}) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();
  const { status: authStatus } = useAuth();
  const canRunModels = authStatus === 'signedIn';
  // Signed out, Run Models only shows a linked model run's results.
  const canOpenRun = canRunModels || Boolean(customData);

  // Desktop: side panel, open by default. Mobile: top bar with a panel that
  // slides down over the map, closed by default so the map is visible.
  // Static export: render the desktop layout first, switch after mount.
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: 'md' }
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [showSdm, setShowSdm] = useState(true);
  const [showCatalogFoi, setShowCatalogFoi] = useState(true);

  const speciesOfVirus = (virus) =>
    allSpecies
      .filter((i) => virus === ALL_VIRUS || (i.virus || []).includes(virus))
      .map((i) => i.name);

  // Initial selection: catalog.json's `defaults` block (see getCatalogDefaults).
  useEffect(() => {
    const defaults = getCatalogDefaults();
    const available = speciesOfVirus(defaults.virus);
    const species = defaults.species
      ? defaults.species.filter((name) => available.includes(name))
      : available;
    setSelectedVirus(defaults.virus);
    setSelectedSpecies(species);
    setSelectedTimeFrame([defaults.time_frame]);
    setSelectedModel(defaults.model);
    setShowSdm(defaults.showSdm);
    setShowCatalogFoi(defaults.showFoi);
    updateTiles({
      virus: defaults.virus,
      species,
      time_frame: [defaults.time_frame],
      model: defaults.model,
      sdm: defaults.showSdm,
      foi: defaults.showFoi,
    });
  }, [allVirus]);

  // While "Show SDM" is off the selections are kept but no SDM layers are
  // requested, so toggling it back on restores them. FOI follows the same
  // virus, species and scenario, behind its own toggle.
  const updateTiles = ({
    virus = selectedVirus,
    species = selectedSpecies,
    time_frame = selectedTimeFrame,
    model = selectedModel,
    sdm = showSdm,
    foi = showCatalogFoi,
  }) => {
    handleFilterTilesId({
      virus,
      species: sdm ? species : [],
      time_frame,
      model: sdm ? model : '',
      foi_species: foi ? species : [],
    });
  };

  const handleVirusChange = (value) => {
    const species = speciesOfVirus(value);
    setSelectedVirus(value);
    setSelectedSpecies(species);
    updateTiles({ virus: value, species });
  };

  const handleSpeciesChange = (species) => {
    setSelectedSpecies([...species]);
    updateTiles({ species: [...species] });
  };

  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value);
    updateTiles({ time_frame: value });
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    updateTiles({ model });
  };

  const handleSdmToggle = () => {
    const newShowSdm = !showSdm;
    setShowSdm(newShowSdm);
    updateTiles({ sdm: newShowSdm });
  };

  const handleFoiToggle = () => {
    const newShowFoi = !showCatalogFoi;
    setShowCatalogFoi(newShowFoi);
    updateTiles({ foi: newShowFoi });
  };

  const handleClearToExplore = () => {
    onClearCustomData();
    onTabChange(SIDEBAR_TABS.EXPLORE);
  };

  const exploreControls = (
    <>
      <FormControlComboboxVirus
        label={VIRUS_LABEL}
        options={allVirus}
        info={VIRUS_INFO}
        value={selectedVirus}
        defaultValue={ALL_VIRUS}
        handleAction={handleVirusChange}
      />

      <FormControlRadioTime
        label={TIMEFRAME_LABEL}
        options={allTimeFrame}
        info={TIMEFRAME_INFO}
        // A model run has every scenario: the switcher flips between its rasters
        // instead of filtering the catalog.
        handleAction={
          customData
            ? ([name]) => onScenarioChange(name)
            : handleTimeFrameChange
        }
        value={customData ? customData.scenario : undefined}
        availableValues={customData ? customData.availableScenarios : []}
        describedBy={customData ? CUSTOM_DATA_NOTICE_ID : undefined}
      />
      <FormControlSwitch
        label={SDM_TOGGLE_LABEL}
        value={showSdm}
        handleAction={handleSdmToggle}
      />
      <FormControlSwitch
        label={FOI_TOGGLE_LABEL}
        value={showCatalogFoi}
        handleAction={handleFoiToggle}
        // A model run brings its own FOI layers (Run Models tab).
        isDisabled={!!customData}
      />
      <FormControlComboboxSpecies
        label={SPECIES_LABEL}
        options={allSpecies}
        info={SPECIES_INFO}
        values={selectedSpecies}
        handleAction={handleSpeciesChange}
        filterValue={selectedVirus}
        isDisabled={!showSdm && !showCatalogFoi}
        isLocked={!!customData}
        notice={
          customData && customData.species
            ? CUSTOM_DATA_NOTICE(customData.species)
            : ''
        }
        noticeId={CUSTOM_DATA_NOTICE_ID}
      />
      <FormControlSelect
        label={MODEL_LABEL}
        options={allModels}
        info={MODEL_INFO}
        value={selectedModel}
        handleAction={handleModelChange}
        isDisabled={!showSdm}
        isLocked={!!customData}
        describedBy={CUSTOM_DATA_NOTICE_ID}
      />
      {customData && onClearCustomData && (
        <Button
          mt='auto'
          variant='ghost'
          colorPalette='blue'
          onClick={onClearCustomData}
        >
          <LuX aria-hidden='true' />
          {CLEAR_UPLOADED_DATA}
        </Button>
      )}
    </>
  );

  const runTrigger = (
    <Tabs.Trigger
      value={SIDEBAR_TABS.RUN}
      disabled={!canOpenRun}
      pointerEvents={canOpenRun ? undefined : 'none'}
      flex={1}
      whiteSpace='nowrap'
    >
      {TAB_RUN}
    </Tabs.Trigger>
  );

  const panelContent = (
    <>
      <Tabs.Root
        value={tab}
        onValueChange={(e) => onTabChange(e.value)}
        variant='enclosed'
        colorPalette='blue'
        fitted
        display='flex'
        flexDirection='column'
        flex={1}
      >
        <Tabs.List w='full'>
          <Tabs.Trigger
            value={SIDEBAR_TABS.EXPLORE}
            flex={1}
            whiteSpace='nowrap'
          >
            {TAB_EXPLORE}
          </Tabs.Trigger>
          {canOpenRun ? (
            runTrigger
          ) : (
            <Tooltip.Root openDelay={100} positioning={{ placement: 'top' }}>
              <Tooltip.Trigger asChild>
                <Box as='span' display='flex' flex={1}>
                  {runTrigger}
                </Box>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    <Tooltip.Arrow>
                      <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    {TAB_RUN_SIGNED_OUT}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          )}
          <Tabs.Indicator rounded='l2' />
        </Tabs.List>
        <Tabs.Content
          value={SIDEBAR_TABS.EXPLORE}
          flex={1}
          pt={1}
          flexDirection='column'
          css={{ '&:not([hidden])': { display: 'flex' } }}
        >
          <FormControlText label={SIDEBAR_TITLE} text={SIDEBAR_SUBTITLE} />
          {exploreControls}
        </Tabs.Content>
        <Tabs.Content
          value={SIDEBAR_TABS.RUN}
          flex={1}
          pt={1}
          flexDirection='column'
          css={{ '&:not([hidden])': { display: 'flex' } }}
        >
          <FormControlText
            label={TAB_RUN}
            text={
              !canRunModels
                ? SHARED_RESULTS_DESCRIPTION
                : customData && customData.status === 'SUCCEEDED'
                  ? RESULTS_DESCRIPTION
                  : RUN_DESCRIPTION
            }
          />
          <RunModelsPanel
            customData={customData}
            onUpload={onUpload}
            onUploadSuccess={onUploadSuccess}
            onFileChange={onFileChange}
            onClearCustomData={onClearCustomData}
            onClearToExplore={onClearCustomData ? handleClearToExplore : null}
            previewCount={previewCount}
            previewName={previewName}
            linkedViruses={linkedViruses}
            onScenarioChange={onScenarioChange}
            hasFoi={hasFoi}
            showFoi={showFoi}
            onToggleFoi={onToggleFoi}
            hasPoints={hasPoints}
            showPoints={showPoints}
            onTogglePoints={onTogglePoints}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );

  if (isMobile) {
    return (
      // Not positioned: the panel below is placed against the Explore area,
      // so it can fill exactly the space under the bar.
      <Box w='100%'>
        <Button
          variant='plain'
          w='100%'
          h={`${H_FILTER_BAR}px`}
          px={4}
          borderRadius={0}
          justifyContent='space-between'
          bg='secondary.50'
          color='blue.800'
          fontSize='sm'
          fontWeight={700}
          borderBottom='1px solid'
          borderColor='blackAlpha.400'
          _hover={{ bg: 'secondary.100' }}
          _active={{ bg: 'secondary.100' }}
          aria-expanded={isMobileOpen}
          aria-controls='explore-filters'
          onClick={toggleSidebar}
        >
          <LuSlidersHorizontal />
          <Box as='span' flex={1} textAlign='start'>
            {isMobileOpen ? FILTERS_HIDE : FILTERS_SHOW}
          </Box>
          {isMobileOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
        {/* Panel slides down from under the bar, over the map. The clip box
            spans the area below the bar but never takes pointer events, so
            the map stays usable around (and without) the panel. */}
        <Box
          position='absolute'
          top={`${H_FILTER_BAR}px`}
          bottom={0}
          left={0}
          right={0}
          overflow='hidden'
          pointerEvents='none'
          zIndex={1000}
        >
          <Box
            id='explore-filters'
            bg='secondary.50'
            px={4}
            pt={2}
            pb={4}
            maxH='100%'
            overflowY='auto'
            pointerEvents={isMobileOpen ? 'auto' : 'none'}
            borderBottom='1px solid'
            borderColor='blackAlpha.400'
            boxShadow='md'
            transform={isMobileOpen ? 'translateY(0)' : 'translateY(-100%)'}
            visibility={isMobileOpen ? 'visible' : 'hidden'}
            transition={`transform 0.3s ease, visibility 0s linear ${
              isMobileOpen ? '0s' : '0.3s'
            }`}
          >
            {panelContent}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Flex direction='column' position='relative' h='100%'>
      <Box
        id='explore-filters'
        w={isCollapsed ? '0px' : '330px'}
        maxW='330px'
        bg={isCollapsed ? 'transparent' : 'secondary.50'}
        h='100%'
        p={isCollapsed ? 0 : 4}
        overflowX='hidden'
        overflowY='auto'
        boxShadow={isCollapsed ? 'none' : 'sm'}
        borderRight={isCollapsed ? 'none' : '1px solid'}
        borderColor='blackAlpha.100'
        transition='all 0.3s ease'
      >
        {/* Hidden rather than unmounted, so the filter controls keep their
            state (e.g. the selected climate scenario) while collapsed. */}
        <Box
          display={isCollapsed ? 'none' : 'flex'}
          flexDirection='column'
          mb={4}
          h='full'
          minW='282px'
        >
          {panelContent}
        </Box>
      </Box>
      {/* A tab docked to the sidebar's right edge (square on the left, flush
          with the panel), following it when collapsed. */}
      <IconButton
        aria-label={isCollapsed ? FILTERS_SHOW : FILTERS_HIDE}
        aria-expanded={!isCollapsed}
        aria-controls='explore-filters'
        size='sm'
        variant='plain'
        bg='secondary.50'
        color='blue.800'
        border='1px solid'
        borderColor='blackAlpha.400'
        borderLeftWidth={0}
        borderLeftRadius={0}
        boxShadow='sm'
        _hover={{ bg: 'secondary.100' }}
        position='absolute'
        top='10px'
        left={isCollapsed ? 0 : '330px'}
        transition='left 0.3s ease, background-color 0.2s'
        onClick={toggleSidebar}
        zIndex={1000}
      >
        {isCollapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
      </IconButton>
    </Flex>
  );
};
export default Sidebar;
