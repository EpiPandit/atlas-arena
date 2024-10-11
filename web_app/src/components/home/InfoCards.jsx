import React from 'react';
import { Text, Flex, Icon } from '@chakra-ui/react';
import VirusIcon from '@/assets/images/virus';
import ClimateIcon from '@/assets/images/climate';
import PatientIcon from '@/assets/images/patient';
import {
  CLIMATE_TITLE,
  CLIMATE_TEXT,
  PATIENT_TITLE,
  PATIENT_TEXT,
  VIRUS_TITLE,
  VIRUS_TEXT,
} from '@/config/constants/constants.home';
const InfoCard = ({ icon, title, text }) => {
  return (
    <Flex
      direction='column'
      alignItems='center'
      textAlign='center'
      p={4}
      bg='transparent'
      color='blue.900'
      w={{ base: '100%', md: '30%' }}
    >
      <Icon as={icon} boxSize={16} mb={4} color='blue.900' />
      <Text fontSize='lg' fontWeight='bold' textTransform='uppercase' mb={2}>
        {title}
      </Text>
      <Text fontSize='sm' color='gray.600' textAlign='start'>
        {text}
      </Text>
    </Flex>
  );
};

const InfoCards = ({}) => {
  return (
    <Flex justifyContent='space-between' wrap='wrap' p={4} w='100%'>
      <InfoCard icon={ClimateIcon} title={CLIMATE_TITLE} text={CLIMATE_TEXT} />
      <InfoCard icon={VirusIcon} title={VIRUS_TITLE} text={VIRUS_TEXT} />
      <InfoCard icon={PatientIcon} title={PATIENT_TITLE} text={PATIENT_TEXT} />
    </Flex>
  );
};

export default InfoCards;
