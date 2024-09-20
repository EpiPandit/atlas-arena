import React, { useRef, useEffect, useState, use } from 'react';
import { useAppContext } from '@/store/context';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlCheckBox from '@/components/custom/FormControlCheckBox';

import { Box } from '@chakra-ui/react';

const Sidebar = ({ handleFilterTilesId, filterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  // actions

  const handleVirusChange = (event) => {
    setSelectedVirus(event.target.value);
    setSelectedSpecies('');
    setSelectedTimeFrame([]);
    setSelectedModel('');
    // update
    handleFilterTilesId({
      virus: event.target.value,
      species: selectedSpecies,
      time_frame: selectedTimeFrame,
      model: selectedModel,
    });
  };

  const handleSpeciesChange = (event) => {
    setSelectedSpecies(event.target.value);
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

  const handleTimeFrameChange = (event) => {
    let timeFrame = [...selectedTimeFrame];
    const id = event.target.id;
    if (timeFrame.includes(id)) {
      timeFrame = timeFrame.filter((i) => id !== i);
    } else {
      timeFrame.push(id);
    }
    setSelectedTimeFrame([...timeFrame]);
    setSelectedModel('');
    // update
    handleFilterTilesId({
      virus: selectedVirus,
      species: selectedSpecies,
      time_frame: [...timeFrame],
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
      w='260px'
      maxW='260px'
      h='calc(100vh - 64px)'
      px='20px'
      bg='yellow.10'
      overflowY='auto'
    >
      <FormControlSelect
        options={allVirus}
        label='Virus'
        value={selectedVirus}
        handleAction={handleVirusChange}
      />
      <FormControlSelect
        options={allSpecies}
        label='species'
        value={selectedSpecies}
        handleAction={handleSpeciesChange}
      />

      <FormControlCheckBox
        label='Timeframe'
        options={allTimeFrame}
        values={selectedTimeFrame}
        handleAction={handleTimeFrameChange}
      />

      <FormControlSelect
        options={allModels}
        label='model algorithm'
        value={selectedModel}
        handleAction={handleModelChange}
      />
      {/* <FormControlSelect
        options={['Option1', 'Option2', 'Option3']}
        label='force infection'
      />  */}
      <p>filters</p>
      <p> virus : {selectedVirus}</p>
      <p> species : {selectedSpecies}</p>
      <p> time frame : {selectedTimeFrame}</p>
      <p> model : {selectedModel}</p>
      <hr />
      <p>filter tif count : {filterTilesId.length}</p>
      <p> {filterTilesId.map((i) => i.new_raster_name).join(' , ')}</p>
    </Box>
  );
};
export default Sidebar;
