import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlCheckBoxSpecies from '@/components/custom/FormControlCheckBoxSpecies';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import FormControlSwitch from '@/components/custom/FormControlSwitch';
import FormControlText from '@/components/custom/FormControlText';
import { Box, Icon, IconButton, Flex } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import {
  ALL_VIRUS,
  DEFAULT_MODEL,
  DEFAULT_TIME,
  H_HEADER,
} from '@/config/constants/general';
import {
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
  VIRUS_LABEL,
  VIRUS_INFO,
  TIMEFRAME_LABEL,
  TIMEFRAME_INFO,
  RODENT_DISTRIBUTION_LABEL,
  SPECIES_LABEL,
  SPECIES_INFO,
  MODEL_LABEL,
  MODEL_INFO,
} from '@/config/constants/constants.explore';

const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDistribution, setSelectedDistribution] = useState(false);

  useEffect(() => {
    const tmpSpecies = allSpecies.map((i) => i.name);
    handleSetDefault(
      ALL_VIRUS,
      tmpSpecies,
      [DEFAULT_TIME],
      DEFAULT_MODEL,
      false
    );
  }, [allVirus]);
  // actions
  const handleSetDefault = (
    virus,
    species,
    time_frame,
    model,
    distribution
  ) => {
    setSelectedVirus(virus);
    setSelectedSpecies(species);
    setSelectedTimeFrame(time_frame);
    setSelectedModel(model);
    setSelectedDistribution(distribution);

    handleFilterTilesId({
      virus,
      species,
      time_frame,
      model,
      distribution,
    });
  };

  const handleVirusChange = (event) => {
    const value = event.target.value;
    let species = [];
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
      distribution: selectedDistribution,
    });
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
      distribution: selectedDistribution,
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
      distribution: selectedDistribution,
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
      distribution: selectedDistribution,
    });
  };

  const handleDistributionChange = () => {
    const newDistribution = !selectedDistribution;
    setSelectedDistribution(newDistribution);

    if (newDistribution) {
      setSelectedSpecies([]);
      setSelectedModel('');
      handleFilterTilesId({
        virus: selectedVirus,
        species: [],
        time_frame: selectedTimeFrame,
        model: '',
        distribution: selectedDistribution,
      });
    } else {
      let species = allSpecies
        .filter((i) => i.virus == selectedVirus)
        .map((i) => i.name);
      if (selectedVirus === ALL_VIRUS) {
        species = allSpecies.map((i) => i.name);
      }
      setSelectedModel(DEFAULT_MODEL);
      setSelectedSpecies([...species]);
      handleFilterTilesId({
        virus: selectedVirus,
        species: [...species],
        time_frame: selectedTimeFrame,
        model: DEFAULT_MODEL,
        distribution: newDistribution,
      });
    }
    // update stats
  };

  return (
    <Flex
      direction='column'
      position='relative'
      maxH={`calc(100vh - ${H_HEADER}px)`}
    >
      <Box
        w={
          isCollapsed
            ? { base: '0px', md: '330px' }
            : { base: '100%', md: '330px' }
        }
        maxW={{ base: '100%', md: '330px' }}
        bg={isCollapsed ? 'transparent' : 'yellow.10'}
        h='100%'
        p={isCollapsed ? 0 : { base: '16px', md: '32px' }}
        overflowY='auto'
        transition='all 0.3s ease'
      >
        {!isCollapsed && (
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
              label={RODENT_DISTRIBUTION_LABEL}
              value={selectedDistribution}
              handleAction={handleDistributionChange}
            />
            <FormControlCheckBoxSpecies
              label={SPECIES_LABEL}
              options={allSpecies}
              info={SPECIES_INFO}
              values={selectedSpecies}
              handleAction={handleSpeciesChange}
              filterValue={selectedVirus}
              isDisabled={selectedDistribution}
            />
            <FormControlSelect
              label={MODEL_LABEL}
              options={allModels}
              info={MODEL_INFO}
              value={selectedModel}
              handleAction={handleModelChange}
              isDisabled={selectedDistribution}
            />
          </>
        )}
      </Box>

      <IconButton
        aria-label='Toggle Sidebar'
        backgroundColor='white'
        sx={{ border: '1px solid gray' }}
        icon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} />}
        position='absolute'
        top='10px'
        left={isCollapsed ? '-5px' : '345px'}
        size='md'
        onClick={toggleSidebar}
        zIndex={1000}
        display={{ base: 'block', md: 'none' }}
      />
    </Flex>
  );
};
export default Sidebar;
