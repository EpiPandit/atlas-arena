import React from 'react';
import { Text, Flex, Icon } from '@chakra-ui/react';
import { FiCloud, FiAlertCircle, FiActivity } from 'react-icons/fi';
import VirusIcon from '@/assets/images/virus';
import ClimateIcon from '@/assets/images/climate';
import PatientIcon from '@/assets/images/patient';

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

const InfoCards = ({
  title_climate = '',
  text_climate = '',
  title_patient = '',
  text_patient = '',
  title_virus = '',
  text_virus = '',
}) => {
  return (
    <Flex justifyContent='space-between' wrap='wrap' p={4} w='100%'>
      <InfoCard icon={ClimateIcon} title={title_climate} text={text_climate} />
      <InfoCard icon={VirusIcon} title={title_virus} text={text_virus} />
      <InfoCard icon={PatientIcon} title={title_patient} text={text_patient} />
    </Flex>
  );
};

export default InfoCards;
