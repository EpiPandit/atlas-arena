import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlCheckBoxSpecies from '@/components/custom/FormControlCheckBoxSpecies';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import FormControlSwitch from '@/components/custom/FormControlSwitch';
import FormControlText from '@/components/custom/FormControlText';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LuChevronDown,
  LuChevronUp,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuSlidersHorizontal,
} from 'react-icons/lu';

import {
  ALL_VIRUS,
  DEFAULT_MODEL,
  DEFAULT_TIME,
  H_FILTER_BAR,
} from '@/config/constants/general';
import {
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
  VIRUS_LABEL,
  VIRUS_INFO,
  TIMEFRAME_LABEL,
  TIMEFRAME_INFO,
  SDM_TOGGLE_LABEL,
  SPECIES_LABEL,
  SPECIES_INFO,
  MODEL_LABEL,
  MODEL_INFO,
  FILTERS_SHOW,
  FILTERS_HIDE,
} from '@/config/constants/constants.explore';

const DEFAULT_SDM_TOGGLE = true;
const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();

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
  const [selectedHotSpot, setSelectedHotSpot] = useState(DEFAULT_SDM_TOGGLE);

  useEffect(() => {
    const tmpSpecies = allSpecies.map((i) => i.name);
    handleSetDefault(
      ALL_VIRUS,
      tmpSpecies,
      [DEFAULT_TIME],
      DEFAULT_MODEL,
      DEFAULT_SDM_TOGGLE
    );
  }, [allVirus]);
  // actions
  const handleSetDefault = (virus, species, time_frame, model, hotspot) => {
    setSelectedVirus(virus);
    setSelectedSpecies(species);
    setSelectedTimeFrame(time_frame);
    setSelectedModel(model);
    setSelectedHotSpot(hotspot);

    handleFilterTilesId({
      virus,
      species,
      time_frame,
      model,
      hotspot,
    });
  };

  const handleVirusChange = (event) => {
    const value = event.target.value;
    let species = [];
    if (selectedHotSpot) {
      if (value === ALL_VIRUS) {
        species = allSpecies.map((i) => i.name);
      } else {
        species = allSpecies.filter((i) => i.virus == value).map((i) => i.name);
      }
      setSelectedVirus(value);
      setSelectedSpecies(species);

      // update
      handleFilterTilesId({
        virus: value,
        species: species,
        time_frame: selectedTimeFrame,
        model: selectedModel,
        hotspot: true,
      });
    } else {
      setSelectedVirus(value);
      setSelectedSpecies([]);
      handleFilterTilesId({
        virus: value,
        species: [],
        time_frame: selectedTimeFrame,
        model: '',
        hotspot: true,
      });
    }
  };

  const handleSpeciesChange = (event) => {
    let species = [...selectedSpecies];
    const id = event.target.id;
    if (species.includes(id)) {
      species = species.filter((i) => id !== i);
    } else {
      species.push(id);
    }

    setSelectedSpecies([...species]);

    // update
    handleFilterTilesId({
      virus: selectedVirus,
      species: [...species],
      time_frame: selectedTimeFrame,
      model: selectedModel,
      hotspot: true,
    });
  };

  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value);
    // update
    handleFilterTilesId({
      virus: selectedVirus,
      species: selectedSpecies,
      time_frame: value,
      model: selectedModel,
      hotspot: true,
    });
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    // update State
    handleFilterTilesId({
      virus: selectedVirus,
      species: selectedSpecies,
      time_frame: selectedTimeFrame,
      model: event.target.value,
      hotspot: true,
    });
  };

  const handleHotSpotChange = () => {
    const newHotSpot = !selectedHotSpot;
    setSelectedHotSpot(newHotSpot);

    if (newHotSpot) {
      let species = [];
      if (selectedVirus === ALL_VIRUS) {
        species = allSpecies.map((i) => i.name);
      } else {
        species = allSpecies
          .filter((i) => i.virus == selectedVirus)
          .map((i) => i.name);
      }
      setSelectedSpecies(species);
      setSelectedModel(DEFAULT_MODEL);

      handleFilterTilesId({
        virus: selectedVirus,
        species: species,
        time_frame: selectedTimeFrame,
        model: DEFAULT_MODEL,
        hotspot: true,
      });
    } else {
      setSelectedSpecies([]);
      setSelectedModel('');

      handleFilterTilesId({
        virus: selectedVirus,
        species: [],
        time_frame: selectedTimeFrame,
        model: '',
        hotspot: true,
      });
    }
  };

  const filterControls = (
    <>
      <FormControlText label={SIDEBAR_TITLE} text={SIDEBAR_SUBTITLE} />
      <FormControlSelect
        label={VIRUS_LABEL}
        options={allVirus}
        info={VIRUS_INFO}
        value={selectedVirus}
        handleAction={handleVirusChange}
      />

      <FormControlRadioTime
        label={TIMEFRAME_LABEL}
        options={allTimeFrame}
        info={TIMEFRAME_INFO}
        handleAction={handleTimeFrameChange}
      />
      <FormControlSwitch
        label={SDM_TOGGLE_LABEL}
        value={selectedHotSpot}
        handleAction={handleHotSpotChange}
      />
      <FormControlCheckBoxSpecies
        label={SPECIES_LABEL}
        options={allSpecies}
        info={SPECIES_INFO}
        values={selectedSpecies}
        handleAction={handleSpeciesChange}
        filterValue={selectedVirus}
        isDisabled={!selectedHotSpot}
      />
      <FormControlSelect
        label={MODEL_LABEL}
        options={allModels}
        info={MODEL_INFO}
        value={selectedModel}
        handleAction={handleModelChange}
        isDisabled={!selectedHotSpot}
      />
    </>
  );

  if (isMobile) {
    return (
      // Not positioned: the panel below is placed against the Explore area,
      // so it can fill exactly the space under the bar.
      <Box w='100%'>
        <Button
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
          leftIcon={<Icon as={LuSlidersHorizontal} boxSize={4} />}
          rightIcon={
            <Icon as={isMobileOpen ? LuChevronUp : LuChevronDown} boxSize={4} />
          }
          aria-expanded={isMobileOpen}
          aria-controls='explore-filters'
          onClick={toggleSidebar}
        >
          <Box as='span' flex={1} textAlign='start'>
            {isMobileOpen ? FILTERS_HIDE : FILTERS_SHOW}
          </Box>
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
            {filterControls}
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
        p={isCollapsed ? 0 : '24px'}
        overflowX='hidden'
        overflowY='auto'
        boxShadow={isCollapsed ? 'none' : 'sm'}
        borderRight={isCollapsed ? 'none' : '1px solid'}
        borderColor='blackAlpha.400'
        transition='all 0.3s ease'
      >
        {/* Hidden rather than unmounted, so the filter controls keep their
            state (e.g. the selected climate scenario) while collapsed. */}
        <Box display={isCollapsed ? 'none' : 'block'} minW='282px'>
          {filterControls}
        </Box>
      </Box>
      {/* A tab docked to the sidebar's right edge (square on the left, flush
          with the panel), following it when collapsed. */}
      <IconButton
        aria-label={isCollapsed ? FILTERS_SHOW : FILTERS_HIDE}
        aria-expanded={!isCollapsed}
        aria-controls='explore-filters'
        icon={
          <Icon
            as={isCollapsed ? LuPanelLeftOpen : LuPanelLeftClose}
            boxSize={4}
          />
        }
        size='sm'
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
      />
    </Flex>
  );
};
export default Sidebar;
