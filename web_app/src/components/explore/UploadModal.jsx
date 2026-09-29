import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
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
import { FiCheck, FiPlusCircle, FiX } from 'react-icons/fi';
import { useAppContext } from '@/store/context';
import { DEFAULT_TIME } from '@/config/constants/general';
import {
  UPLOAD_TITLE,
  UPLOAD_DESCRIPTION,
  UPLOAD_SCENARIO_LABEL,
  UPLOAD_SPECIES_LABEL,
  UPLOAD_DROPZONE_TEXT,
  UPLOAD_DROPZONE_HINT,
  UPLOAD_ACCEPT,
  UPLOAD_CANCEL,
  UPLOAD_SUBMIT,
  UPLOAD_SUCCESS_TITLE,
  UPLOAD_SUCCESS_TEXT,
  UPLOAD_DONE,
  UPLOAD_ERROR_TITLE,
  UPLOAD_ERROR_TEXT,
  UPLOAD_RETRY,
} from '@/config/constants/constants.explore';

// form -> uploading -> success | error
const STATUS = {
  FORM: 'form',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const StatusMessage = ({ icon, iconBg, title, text, role }) => (
  <Box role={role}>
    <Flex alignItems='center' gap={2} mb={2}>
      <Flex
        alignItems='center'
        justifyContent='center'
        boxSize={6}
        borderRadius='full'
        bg={iconBg}
        flexShrink={0}
        aria-hidden='true'
      >
        <Icon as={icon} boxSize={4} color='white' strokeWidth={3} />
      </Flex>
      <Text fontSize='lg' fontWeight={600} color='black'>
        {title}
      </Text>
    </Flex>
    <Text fontSize='sm' color='gray.700'>
      {text}
    </Text>
  </Box>
);

// onUpload({ scenario, species, file }) should return a promise that resolves
// to { pointCount } on success and rejects on failure; onUploadSuccess is then
// called with the upload details. `initialStatus` lets a
// state be previewed before the upload is wired up.
const UploadModal = ({
  isOpen,
  onClose,
  onUpload = null,
  onUploadSuccess = null,
  accept = UPLOAD_ACCEPT,
  initialStatus = STATUS.FORM,
}) => {
  const { allTimeFrame, allSpecies } = useAppContext();

  const scenarios = allTimeFrame.filter(
    (i) => !`${i.name}`.toLowerCase().includes('delta')
  );

  const [scenario, setScenario] = useState(DEFAULT_TIME);
  const [species, setSpecies] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [pointCount, setPointCount] = useState(0);
  const resultActionRef = useRef(null);

  // Move focus to the result's primary action; the Upload button that had
  // focus is removed when the status changes.
  useEffect(() => {
    if (resultActionRef.current) resultActionRef.current.focus();
  }, [status]);

  const selectedSpecies = species || (allSpecies[0] && allSpecies[0].key) || '';

  const handleClose = () => {
    setScenario(DEFAULT_TIME);
    setSpecies('');
    setFile(null);
    setIsDragging(false);
    setStatus(initialStatus);
    setPointCount(0);
    onClose();
  };

  const handleRetry = () => {
    setFile(null);
    setStatus(STATUS.FORM);
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

  const handleUpload = async () => {
    if (!onUpload) return;
    setStatus(STATUS.UPLOADING);
    try {
      const result = await onUpload({
        scenario,
        species: selectedSpecies,
        file,
      });
      const count = (result && result.pointCount) || 0;
      setPointCount(count);
      setStatus(STATUS.SUCCESS);
      if (onUploadSuccess) {
        onUploadSuccess({
          scenario,
          species: selectedSpecies,
          file,
          pointCount: count,
        });
      }
    } catch (error) {
      console.error(error);
      setStatus(STATUS.ERROR);
    }
  };

  const renderForm = (
    <>
      <Text fontSize='sm' color='gray.700' mb={4}>
        {UPLOAD_DESCRIPTION}
      </Text>

      <FormControl mb={4} isDisabled={status === STATUS.UPLOADING}>
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

      {/* The whole drop zone is the file input's label: click or
          Enter/Space on the focused input opens the file picker. */}
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
        mb={4}
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
        <Text fontSize='xs' color='gray.600'>
          {UPLOAD_DROPZONE_HINT}
        </Text>
        <Input
          type='file'
          accept={accept}
          onChange={handleFileChange}
          isDisabled={status === STATUS.UPLOADING}
          srOnly
        />
      </Box>
      <FormControl
        as='fieldset'
        mb={4}
        isDisabled={status === STATUS.UPLOADING}
      >
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
    </>
  );

  const content = {
    [STATUS.SUCCESS]: {
      body: (
        <StatusMessage
          role='status'
          icon={FiCheck}
          iconBg='green.400'
          title={UPLOAD_SUCCESS_TITLE}
          text={UPLOAD_SUCCESS_TEXT(pointCount)}
        />
      ),
      footer: (
        <Button colorScheme='blue' onClick={handleClose} ref={resultActionRef}>
          {UPLOAD_DONE}
        </Button>
      ),
    },
    [STATUS.ERROR]: {
      body: (
        <StatusMessage
          role='alert'
          icon={FiX}
          iconBg='red.300'
          title={UPLOAD_ERROR_TITLE}
          text={UPLOAD_ERROR_TEXT}
        />
      ),
      footer: (
        <>
          <Button onClick={handleClose}>{UPLOAD_CANCEL}</Button>
          <Button
            colorScheme='blue'
            onClick={handleRetry}
            ref={resultActionRef}
          >
            {UPLOAD_RETRY}
          </Button>
        </>
      ),
    },
  };

  const formFooter = (
    <>
      <Button onClick={handleClose} isDisabled={status === STATUS.UPLOADING}>
        {UPLOAD_CANCEL}
      </Button>
      <Button
        colorScheme='blue'
        onClick={handleUpload}
        isDisabled={!file}
        isLoading={status === STATUS.UPLOADING}
      >
        {UPLOAD_SUBMIT}
      </Button>
    </>
  );

  const result = content[status];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='md' isCentered>
      <ModalOverlay />
      <ModalContent borderRadius='md' mx={4}>
        <ModalHeader fontSize='lg' fontWeight={700} color='gray.800' pr={12}>
          {UPLOAD_TITLE}
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody>{result ? result.body : renderForm}</ModalBody>
        <ModalFooter gap={3}>{result ? result.footer : formFooter}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
