import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlCheckBoxSpecies from '@/components/custom/FormControlCheckBoxSpecies';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import FormControlSwitch from '@/components/custom/FormControlSwitch';
import FormControlText from '@/components/custom/FormControlText';
import { Box } from '@chakra-ui/react';
import {
  ALL_VIRUS,
  DEFAULT_MODEL,
  DEFAULT_TIME,
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
} from '@/config/constants';
import {
  INFO_VIRUS,
  INFO_TIMEFRAME,
  INFO_SPECIES,
  INFO_MODEL,
} from '@/config/constants.info';

const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDistribution, setSelectedDistribution] = useState(true);

  useEffect(() => {
    const tmpSpecies = allSpecies.map((i) => i.name);
    handleSetDefault(
      ALL_VIRUS,
      tmpSpecies,
      [DEFAULT_TIME],
      DEFAULT_MODEL,
      true
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
    setSelectedDistribution(!selectedDistribution);
    // update stats
    handleFilterTilesId({
      virus: selectedVirus,
      species: selectedSpecies,
      time_frame: selectedTimeFrame,
      model: event.target.value,
      distribution: !selectedDistribution,
    });
  };

  return (
    <Box
      w='330px'
      maxW='330px'
      h='calc(100vh - 55px)'
      p='32px'
      bg='yellow.10'
      overflowY='auto'
    >
      <FormControlText label={SIDEBAR_TITLE} text={SIDEBAR_SUBTITLE} />
      <FormControlSelect
        label='Virus'
        options={allVirus}
        info={INFO_VIRUS}
        value={selectedVirus}
        handleAction={handleVirusChange}
      />

      <FormControlRadioTime
        label='Timeframe'
        options={allTimeFrame}
        info={INFO_TIMEFRAME}
        handleAction={handleTimeFrameChange}
      />
      <FormControlSwitch
        label='Show rodent reservoirs distribution'
        value={selectedDistribution}
        handleAction={handleDistributionChange}
      />
      <FormControlCheckBoxSpecies
        label='Reservoir Species'
        options={allSpecies}
        info={INFO_SPECIES}
        values={selectedSpecies}
        handleAction={handleSpeciesChange}
        filterValue={selectedVirus}
      />
      <FormControlSelect
        label='model algorithm'
        options={allModels}
        info={INFO_MODEL}
        value={selectedModel}
        handleAction={handleModelChange}
      />

      <Box pt={4}>
        <p>
          <b>virus : </b>
          <small>{selectedVirus}</small>
        </p>
        <p>
          <b>species ({selectedSpecies.length}) : </b>
          <small>{selectedSpecies.join(' , ')}</small>
        </p>
        <p>
          <b> time frame ({selectedTimeFrame.length}): </b>
          <small>{selectedTimeFrame.join(' , ')}</small>
        </p>
        <p>
          <b>model : </b>
          <small>{selectedModel}</small>
        </p>
        <hr />
        <p>
          <b>filter tif count : </b>
          {filterTilesId.length}
        </p>
        <p>
          {' '}
          <small>
            {filterTilesId.map((i) => i.new_raster_name).join(' , ')}
          </small>
        </p>
      </Box>
    </Box>
  );
};
export default Sidebar;
