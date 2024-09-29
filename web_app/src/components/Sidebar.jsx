import React, { useRef, useEffect, useState, use } from 'react';
import { useAppContext } from '@/store/context';
import FormControlCheckBoxSpecies from '@/components/custom/FormControlCheckBoxSpecies';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlRadioTime from './custom/FormControlRadioTime';
import { Box } from '@chakra-ui/react';
import { ALL_VIRUS } from '@/config/constants';

const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();
  const [selectedVirus, setSelectedVirus] = useState(ALL_VIRUS);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    const tmpSpecies = allSpecies.map((i) => i.name);
    setSelectedSpecies(tmpSpecies);
  }, [allSpecies]);
  // actions

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
    setSelectedTimeFrame([]);
    setSelectedModel('');

    // update
    handleFilterTilesId({
      virus: value,
      species: species,
      time_frame: selectedTimeFrame,
      model: selectedModel,
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
    setSelectedTimeFrame([]);
    setSelectedModel('');
    // update
    handleFilterTilesId({
      virus: selectedVirus,
      species: event.target.value,
      time_frame: selectedTimeFrame,
      model: selectedModel,
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
      <FormControlSelect
        options={allVirus}
        label='Virus'
        value={selectedVirus}
        handleAction={handleVirusChange}
      />
      <FormControlCheckBoxSpecies
        label='Reservoir Species'
        options={allSpecies}
        values={selectedSpecies}
        handleAction={handleSpeciesChange}
        filterValue={selectedVirus}
      />
      <FormControlRadioTime
        label='Timeframe'
        options={allTimeFrame}
        handleAction={handleTimeFrameChange}
      />

      <FormControlSelect
        options={allModels}
        label='model algorithm'
        value={selectedModel}
        handleAction={handleModelChange}
        info='model algoritm'
      />

      <FormControlSelect
        options={allModels}
        label='force infection'
        value={selectedModel}
        handleAction={handleModelChange}
      />
      <Box pt={4}>
        <p>
          <b>virus : </b>
          {selectedVirus}
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
