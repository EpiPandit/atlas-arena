import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiPlusCircle } from 'react-icons/fi';
import { useAppContext } from '@/store/context';
import { DEFAULT_TIME } from '@/config/constants/general';
import {
  UPLOAD_TITLE,
  UPLOAD_DESCRIPTION,
  UPLOAD_SCENARIO_LABEL,
  UPLOAD_SPECIES_LABEL,
  UPLOAD_DROPZONE_TEXT,
  UPLOAD_CANCEL,
  UPLOAD_SUBMIT,
} from '@/config/constants/constants.explore';

const UploadModal = ({ isOpen, onClose, onUpload = null, accept }) => {
  const { allTimeFrame, allSpecies } = useAppContext();

  const scenarios = allTimeFrame.filter(
    (i) => !`${i.name}`.toLowerCase().includes('delta')
  );

  const [scenario, setScenario] = useState(DEFAULT_TIME);
  const [species, setSpecies] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedSpecies = species || (allSpecies[0] && allSpecies[0].key) || '';

  const handleClose = () => {
    setScenario(DEFAULT_TIME);
    setSpecies('');
    setFile(null);
    setIsDragging(false);
    onClose();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0] || null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = () => {
    if (onUpload) {
      onUpload({ scenario, species: selectedSpecies, file });
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='md' isCentered>
      <ModalOverlay />
      <ModalContent borderRadius='md' mx={4}>
        <ModalHeader fontSize='lg' fontWeight={700} color='gray.800' pr={12}>
          {UPLOAD_TITLE}
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody>
          <Text fontSize='sm' color='gray.700' mb={4}>
            {UPLOAD_DESCRIPTION}
          </Text>

          <FormControl as='fieldset' mb={4}>
            <FormLabel as='legend' fontSize='sm' fontWeight={700} mb={2}>
              {UPLOAD_SCENARIO_LABEL}
            </FormLabel>
            <RadioGroup value={scenario} onChange={setScenario}>
              <Stack spacing={1}>
                {scenarios.map((item) => (
                  <Radio key={item.key} value={item.key} size='md'>
                    <Text as='span' fontSize='sm'>
                      {item.name}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel fontSize='sm' fontWeight={700} mb={2}>
              {UPLOAD_SPECIES_LABEL}
            </FormLabel>
            <Select
              value={selectedSpecies}
              onChange={(event) => setSpecies(event.target.value)}
              bg='white'
              borderColor='gray.200'
            >
              {allSpecies.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Box
            as='label'
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={2}
            minH='110px'
            px={4}
            py={6}
            textAlign='center'
            cursor='pointer'
            border='1px dashed'
            borderColor={isDragging ? 'blue.500' : 'gray.300'}
            borderRadius='md'
            bg={isDragging ? 'blue.50' : 'gray.100'}
            transition='background-color 0.2s, border-color 0.2s'
            _hover={{ borderColor: 'gray.400' }}
            _focusWithin={{ boxShadow: 'outline' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon
              as={FiPlusCircle}
              boxSize={6}
              color='gray.500'
              strokeWidth={1.5}
              aria-hidden='true'
            />
            <Text fontSize='sm' color='gray.800'>
              {file ? file.name : UPLOAD_DROPZONE_TEXT}
            </Text>
            <Input
              type='file'
              accept={accept}
              onChange={handleFileChange}
              srOnly
            />
          </Box>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button onClick={handleClose}>{UPLOAD_CANCEL}</Button>
          <Button colorScheme='blue' onClick={handleUpload} isDisabled={!file}>
            {UPLOAD_SUBMIT}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
