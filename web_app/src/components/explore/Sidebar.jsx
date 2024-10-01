import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlCheckBoxSpecies from '@/components/custom/FormControlCheckBoxSpecies';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import FormControlRadioCard from '../custom/FormControlRadioCard';
import { Box } from '@chakra-ui/react';
import {
  ALL_VIRUS,
  DEFAULT_MODEL,
  DEFAULT_TIME,
  FORCE_INFECTION,
} from '@/config/constants';

const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();
  const viewModeOptions = ['Species Distribution', 'Viral Hotspots'];

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFI, setSelectedFI] = useState('');
  const [selectedViewM, setSelectedViewM] = useState(viewModeOptions[0]);

  useEffect(() => {
    const tmpSpecies = allSpecies.map((i) => i.name);
    handleSetDefault(
      ALL_VIRUS,
      tmpSpecies,
      [DEFAULT_TIME],
      DEFAULT_MODEL,
      viewModeOptions[0]
    );
  }, [allVirus]);
  // actions
  const handleSetDefault = (virus, species, time_frame, model, view_mode) => {
    setSelectedVirus(virus);
    setSelectedSpecies(species);
    setSelectedTimeFrame(time_frame);
    setSelectedModel(model);

    handleFilterTilesId({
      virus,
      species,
      time_frame,
      model,
      view_mode,
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
      view_mode: selectedViewM,
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
      view_mode: selectedViewM,
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
      view_mode: selectedViewM,
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
      view_mode: selectedViewM,
    });
  };

  const handleViewModeChange = (value) => {
    setSelectedViewM(value);
    // update State
    handleFilterTilesId({
      virus: selectedVirus,
      species: selectedSpecies,
      time_frame: selectedTimeFrame,
      model: selectedModel,
      view_mode: value,
    });
  };
  const handleFIChange = (value) => {
    setSelectedFI(value);
  };

  const isForceActive = selectedViewM === 'Species Distribution';

  return (
    <Box
      w='330px'
      maxW='330px'
      h='calc(100vh - 55px)'
      p='32px'
      bg='yellow.10'
      overflowY='auto'
    >
      <FormControlRadioCard
        label='view mode'
        options={viewModeOptions}
        value={selectedViewM}
        handleAction={handleViewModeChange}
        isDisabled={!isForceActive}
        info='info'
      />
      <FormControlSelect
        options={allVirus}
        label='Virus'
        value={selectedVirus}
        handleAction={handleVirusChange}
        isDisabled={!isForceActive}
      />
      <FormControlCheckBoxSpecies
        label='Reservoir Species'
        options={allSpecies}
        values={selectedSpecies}
        handleAction={handleSpeciesChange}
        filterValue={selectedVirus}
        isDisabled={!isForceActive}
      />
      <FormControlRadioTime
        label='Timeframe'
        options={allTimeFrame}
        handleAction={handleTimeFrameChange}
        isDisabled={!isForceActive}
        info='Timeframe'
      />

      <FormControlSelect
        options={allModels}
        label='model algorithm'
        value={selectedModel}
        handleAction={handleModelChange}
        isDisabled={!isForceActive}
        info='model algoritm'
      />

      <FormControlSelect
        options={FORCE_INFECTION}
        label='force of infection'
        value={selectedFI}
        handleAction={handleFIChange}
        isDisabled={isForceActive}
        info='force infectio'
      />

      <Box pt={4}>
        <p>
          <b>viewmode : </b>
          <small>{selectedViewM}</small>
        </p>
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
