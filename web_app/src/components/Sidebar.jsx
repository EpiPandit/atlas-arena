import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '@/store/context';
import FormControlSelect from '@/components/custom/FormControlSelect';
import FormControlCheckBox from '@/components/custom/FormControlCheckBox';

import { Box } from '@chakra-ui/react';

const Sidebar = () => {
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
        options={['Option1', 'Option2', 'Option3']}
        label='Virus'
      />
      <FormControlSelect
        options={['Option1', 'Option2', 'Option3']}
        label='species'
      />
      <FormControlCheckBox
        options={['Option1', 'Option2', 'Option3']}
        deltaOption={true}
        label='Timeframe'
      />
      <FormControlSelect
        options={['Option1', 'Option2', 'Option3']}
        label='model algorithm'
      />
      <FormControlSelect
        options={['Option1', 'Option2', 'Option3']}
        label='force infection'
      />
    </Box>
  );
};
export default Sidebar;
