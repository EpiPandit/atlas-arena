import React, { useRef, useEffect, useState, use } from 'react';
import { useAppContext } from '@/store/context';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlCheckBox from '@/components/custom/FormControlCheckBox';

import { Box } from '@chakra-ui/react';

const Sidebar = ({ handleFilterTilesId }) => {
  const { allVirus, allSpecies, allTimeFrame, allModels } = useAppContext();

  const [selectedVirus, setSelectedVirus] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTiff, setSelectedTiff] = useState([]);
  // actions

  const handleVirusChange = (event) => {
    setSelectedVirus(event.target.value);
    setSelectedSpecies('');
    setSelectedTimeFrame([]);
    setSelectedModel('');
    setSelectedTiff('');
  };

  const handleSpeciesChange = (event) => {
    setSelectedSpecies(event.target.value);
    setSelectedTimeFrame([]);
    setSelectedModel('');
    setSelectedTiff('');
  };

  const handleTimeFrameChange = (event) => {
    let timeFrame = [...selectedTimeFrame];
    const id = event.target.id;
    if (timeFrame.includes(id)) {
      timeFrame.pop(id);
    } else {
      timeFrame.push(id);
    }
    setSelectedTimeFrame([...timeFrame]);
    setSelectedModel('');
    setSelectedTiff('');
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setSelectedTiff('');
  };

  handleFilterTilesId({
    virus: selectedVirus,
    species: selectedSpecies,
    times_frame: selectedTimeFrame,
    model: selectedModel,
  });

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
      <p> selectedVirus : {selectedVirus}</p>
      <p> selectedSpecies : {selectedSpecies}</p>
      <p> selectedTimeFrame : {selectedTimeFrame}</p>
      <p> selectedModel : {selectedModel}</p>
      <hr />
      <p> count tiff : {selectedTiff.length}</p>
      <p> selectedTiff : {selectedTiff}</p>
    </Box>
  );
};
export default Sidebar;
