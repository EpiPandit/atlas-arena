import { useEffect, useId, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Circle,
  CloseButton,
  Field,
  FileUpload,
  Flex,
  Heading,
  HStack,
  VStack,
  Icon,
  Input,
  List,
  NativeSelect,
  Progress,
  Spinner,
  Stack,
  Text,
  useFileUpload,
  VisuallyHidden,
} from '@chakra-ui/react';
import {
  LuCheck,
  LuDownload,
  LuInfo,
  LuLink,
  LuUpload,
  LuX,
} from 'react-icons/lu';
import { useAppContext } from '@/store/context';
import { useAuth } from '@/store/auth';
import { speciesKey, useFoiParams } from '@/libs/foiParams';
import { downloadJobResults } from '@/libs/jobs';
import { toaster } from '@/components/ui/toaster';
import FormControlRadioTime from '@/components/custom/FormControlRadioTime';
import RunHistory from '@/components/explore/RunHistory';
import FormControlSwitch from '@/components/custom/FormControlSwitch';
import ComboboxSingle from '@/components/custom/ComboboxSingle';
import {
  TIMEFRAME_LABEL,
  TIMEFRAME_INFO,
  RUN_STEP_UPLOAD,
  RUN_SINGLE_SPECIES,
  RUN_STEP_SPECIES,
  RUN_STEP_PATHOGEN,
  RUN_PATHOGEN_BADGE,
  RUN_PATHOGEN_NO_SPECIES,
  RUN_PREVALENCE_LABEL,
  RUN_PREVALENCE_HINT,
  RUN_PREVALENCE_ERROR,
  RUN_K_LABEL,
  RUN_K_MIN_LABEL,
  RUN_K_MAX_LABEL,
  RUN_K_HINT,
  RUN_K_ERROR,
  RUN_K_ORDER_ERROR,
  RUN_SPECIES_LOADING,
  RUN_SPECIES_PLACEHOLDER,
  RUN_SPECIES_EMPTY,
  RUN_SPECIES_DETECTED,
  RUN_SPECIES_DETECTED_CHANGED,
  RUN_SPECIES_NOT_DETECTED,
  RUN_SPECIES_ERROR_TITLE,
  RUN_SPECIES_ERROR_TEXT,
  RUN_STEP_MODEL,
  RUN_SUBMIT,
  RUN_IN_PROGRESS,
  RUN_SERVER_NOTICE,
  UPLOAD_ACCEPT,
  UPLOAD_DROPZONE_TEXT,
  UPLOAD_DROPZONE_BROWSE,
  UPLOAD_DROPZONE_HINT,
  UPLOAD_DROPZONE_LABEL,
  UPLOAD_FILE_DETAILS,
  UPLOAD_REMOVE_FILE,
  UPLOAD_IN_PROGRESS,
  UPLOAD_ERROR_TITLE,
  UPLOAD_ERROR_TEXT,
  RESULTS_SPECIES_LABEL,
  RESULTS_POINTS,
  MAP_LAYERS_LABEL,
  UPLOAD_NEW_DATASET,
  CLEAR_UPLOADED_DATA,
  DOWNLOAD_RESULTS,
  DOWNLOAD_ERROR_TITLE,
  DOWNLOAD_ERROR_TEXT,
  JOB_STATUS_TEXT,
  SHOW_FOI_LABEL,
  SHOW_POINTS_LABEL,
} from '@/config/constants/constants.explore';

const STATUS = { IDLE: 'idle', UPLOADING: 'uploading', ERROR: 'error' };

const stepLabelProps = {
  fontSize: 'sm',
  fontWeight: 500,
  color: 'gray.700',
  m: 0,
};

// A numbered step: an ordered-list item with a circled step number. `wrap`
// puts the label and control inside their Field (or FileUpload) root.
const Step = ({ number, label, badge = null, wrap, children }) => (
  <List.Item display='block'>
    {wrap(
      <>
        <HStack gap={1} w='full'>
          <Circle
            size={5}
            bg='white'
            color='blue.700'
            boxShadow='0 0 0 0.5px currentColor'
            textAlign='center'
            lineHeight={1}
            fontSize='xs'
            fontWeight={600}
            aria-hidden='true'
          >
            {number}
          </Circle>
          {label}
          {badge && (
            <Badge
              ms='auto'
              variant='subtle'
              size='xs'
              colorPalette='gray'
              textTransform='uppercase'
            >
              {badge}
            </Badge>
          )}
        </HStack>
        {children}
      </>
    )}
  </List.Item>
);

// Parameters the user enters where the FOI table has no estimate, as typed:
// the species' K range and a prevalence (percent) per virus.
const NO_ENTERED = { k_min: '', k_max: '', prevalence: {} };

// A typed value as a number, or null when blank or not a number.
const toNumber = (value) => {
  if (value == null || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// [lo, hi] rounded for display, or null.
const roundRange = (range, digits = 0) =>
  range && range.map((value) => Number(value.toFixed(digits)));

// Errors for the entered values the form needs (`missing`, see
// foiParams.missingFor); a value still blank has no error but isn't valid.
// { prevalence: { [virus]: error }, k_min, k_max, complete }.
const checkEntered = (entered, missing) => {
  const errors = { prevalence: {}, k_min: null, k_max: null };
  let complete = true;
  missing.prevalence.forEach((virus) => {
    const raw = entered.prevalence[virus];
    const value = toNumber(raw);
    if (value == null || value < 0 || value > 100) complete = false;
    if (raw && (value == null || value < 0 || value > 100)) {
      errors.prevalence[virus] = RUN_PREVALENCE_ERROR;
    }
  });
  if (missing.k) {
    const min = toNumber(entered.k_min);
    const max = toNumber(entered.k_max);
    if (entered.k_min && (min == null || min < 0)) errors.k_min = RUN_K_ERROR;
    if (entered.k_max && (max == null || max < 0)) errors.k_max = RUN_K_ERROR;
    else if (min != null && max != null && max < min) {
      errors.k_max = RUN_K_ORDER_ERROR;
    }
    if (min == null || max == null || errors.k_min || errors.k_max) {
      complete = false;
    }
  }
  return { ...errors, complete };
};

// Under the species picker once a file is picked: whether its layer name
// matched a species, and whether the pick still is that species. Helper text
// of the step's Field, so screen readers hear it with the picker.
const SpeciesDetection = ({ detected, selectedSpecies, speciesName }) => {
  if (!detected.key) {
    return (
      <Field.HelperText m={0} fontSize='xs' color='gray.600'>
        {RUN_SPECIES_NOT_DETECTED}
      </Field.HelperText>
    );
  }
  if (detected.key !== selectedSpecies) {
    return (
      <Field.HelperText m={0} fontSize='xs' color='gray.600'>
        {RUN_SPECIES_DETECTED_CHANGED(speciesName(detected.key))}
      </Field.HelperText>
    );
  }
  return (
    <Field.HelperText
      m={0}
      display='flex'
      alignItems='center'
      gap={1}
      fontSize='xs'
      fontWeight={500}
      color='green.700'
    >
      <Icon as={LuCheck} boxSize={3} aria-hidden='true' />
      {RUN_SPECIES_DETECTED}
    </Field.HelperText>
  );
};

const fieldStep =
  (props = {}) =>
  (body) => (
    <Field.Root gap={2} {...props}>
      {body}
    </Field.Root>
  );

// A number input for an entered FOI parameter (inside its Field).
const EnteredInput = ({ value, onChange, max, disabled }) => (
  <Input
    type='number'
    inputMode='decimal'
    step='any'
    min={0}
    max={max}
    size='sm'
    bg='white'
    borderColor='gray.300'
    value={value}
    onChange={(event) => onChange(event.target.value)}
    disabled={disabled}
  />
);

// The "Run Models" tab: upload presence data and submit a model run, follow
// its progress, then show the result's controls. Uses the custom job hooks
// from useCustomJob (via Sidebar); this component only adds form state.
// Signed out, it only shows a linked model run's results.
const RunModelsPanel = ({
  customData = null,
  onUpload = null,
  onUploadSuccess = null,
  onFileChange = null,
  onClearCustomData = null,
  onClearToExplore = null,
  previewCount = null,
  previewName = null,
  linkedViruses = [],
  onScenarioChange,
  hasFoi = false,
  showFoi = true,
  onToggleFoi,
  hasPoints = false,
  showPoints = true,
  onTogglePoints,
}) => {
  const { allModels, allTimeFrame } = useAppContext();
  const { status: authStatus } = useAuth();
  const canRunModels = authStatus === 'signedIn';
  const pathogenHeadingId = useId();
  const kHeadingId = useId();
  const { foiParams, error: foiParamsError } = useFoiParams();
  const allSpecies = foiParams ? foiParams.species : [];

  const [species, setSpecies] = useState('');
  // The species matched from the picked file's layer name: { key } (key is
  // null when the file names no known species), or null without a file.
  const [detected, setDetected] = useState(null);
  // The checked pathogens, or null for all of the species' viruses.
  const [checkedPathogens, setCheckedPathogens] = useState(null);
  const [entered, setEntered] = useState(NO_ENTERED);
  const [model, setModel] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [pointCount, setPointCount] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const dropzoneRef = useRef(null);
  const focusDropzoneOnReset = useRef(false);

  const isUploading = status === STATUS.UPLOADING;
  const isSucceeded = customData && customData.status === 'SUCCEEDED';
  const isRunning = isUploading || (customData && !isSucceeded);
  // The species list (FOI params CSV) is fetched; the form waits for it.
  const isFormDisabled = isRunning || !foiParams;

  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: UPLOAD_ACCEPT,
    disabled: isRunning,
    translations: { dropzone: UPLOAD_DROPZONE_LABEL },
    onFileChange: ({ acceptedFiles }) => {
      const next = acceptedFiles[0] || null;
      setStatus(STATUS.IDLE);
      if (onFileChange) onFileChange(next);
    },
  });
  const file = fileUpload.acceptedFiles[0] || null;

  // No default species: it comes from the file, the user, or a loaded run.
  const selectedSpecies =
    species || speciesKey(customData && customData.species) || '';
  const selectedModel = model || (allModels[0] && allModels[0].key) || '';
  const speciesViruses = foiParams ? foiParams.virusesFor(selectedSpecies) : [];
  const speciesName = (key) =>
    (allSpecies.find((item) => item.key === key) || {}).name || key;
  const pathogens = checkedPathogens ?? speciesViruses;
  // What the table lacks for the checked pathogens, which the user enters.
  const missing = foiParams
    ? foiParams.missingFor(selectedSpecies, pathogens)
    : { k: false, prevalence: [] };
  const enteredErrors = checkEntered(entered, missing);
  const ranges = foiParams ? foiParams.ranges : {};

  // A new species starts with all of its pathogens checked.
  const selectSpecies = (key) => {
    setSpecies(key);
    setCheckedPathogens(null);
    setEntered(NO_ENTERED);
  };

  const enterPrevalence = (virus, value) =>
    setEntered((prev) => ({
      ...prev,
      prevalence: { ...prev.prevalence, [virus]: value },
    }));

  const togglePathogen = (virus) =>
    setCheckedPathogens(
      pathogens.includes(virus)
        ? pathogens.filter((v) => v !== virus)
        : speciesViruses.filter((v) => v === virus || pathogens.includes(v))
    );

  // Pre-select the species a picked file's layer name refers to (also once
  // the species list arrives, if the file was picked first).
  useEffect(() => {
    if (!previewName) {
      setDetected(null);
      return;
    }
    if (!foiParams) return;
    const key = foiParams.match(previewName);
    setDetected({ key });
    if (!key) return;
    setSpecies(key);
    setCheckedPathogens(null);
    setEntered(NO_ENTERED);
  }, [foiParams, previewName]);

  // After "Upload new dataset", the results are replaced by the form: move
  // focus to its first step so it isn't lost with the removed button.
  useEffect(() => {
    if (!customData && focusDropzoneOnReset.current) {
      focusDropzoneOnReset.current = false;
      if (dropzoneRef.current) dropzoneRef.current.focus();
    }
  }, [customData]);

  const handleRun = async () => {
    if (
      !onUpload ||
      !file ||
      !selectedSpecies ||
      !foiParams ||
      !enteredErrors.complete
    )
      return;
    setStatus(STATUS.UPLOADING);
    try {
      const result = await onUpload({
        species: speciesName(selectedSpecies),
        pathogens: foiParams.pathogens(selectedSpecies, pathogens, {
          k_min: toNumber(entered.k_min),
          k_max: toNumber(entered.k_max),
          prevalence: Object.fromEntries(
            missing.prevalence.map((virus) => [
              virus,
              toNumber(entered.prevalence[virus]),
            ])
          ),
        }),
        file,
      });
      const count = (result && result.pointCount) || 0;
      setPointCount(count);
      if (onUploadSuccess) {
        onUploadSuccess({
          ...result,
          species: speciesName(selectedSpecies),
          file,
          pointCount: count,
        });
      }
      // The job's own presence points replace the file preview.
      if (onFileChange) onFileChange(null);
      setStatus(STATUS.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(STATUS.ERROR);
    }
  };

  const resetForm = () => {
    fileUpload.clearFiles();
    selectSpecies('');
    setPointCount(null);
    setStatus(STATUS.IDLE);
  };

  // The run can also be cleared from the Explore tab (this panel stays
  // mounted), so the form resets whenever the loaded run goes away.
  const loadedJobId = customData ? customData.jobId : null;
  const prevJobId = useRef(loadedJobId);
  useEffect(() => {
    if (prevJobId.current && !loadedJobId) resetForm();
    prevJobId.current = loadedJobId;
  }, [loadedJobId]);

  const handleNewDataset = () => {
    resetForm();
    focusDropzoneOnReset.current = true;
    if (onClearCustomData) onClearCustomData();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadJobResults(customData.jobId);
    } catch {
      toaster.create({
        type: 'error',
        title: DOWNLOAD_ERROR_TITLE,
        description: DOWNLOAD_ERROR_TEXT,
        closable: true,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (isSucceeded) {
    const count = previewCount ?? pointCount;
    return (
      <Flex direction='column' flex={1} gap={2}>
        <Flex
          direction='column'
          borderWidth='1px'
          borderColor='gray.200'
          borderRadius='md'
          bg='white'
          p={3}
          gap={0.5}
        >
          <Text
            as='h2'
            fontSize='xs'
            fontWeight={600}
            letterSpacing='0.5px'
            color='gray.600'
            lineHeight='short'
            textTransform='uppercase'
          >
            {RESULTS_SPECIES_LABEL}
          </Text>
          <Text
            fontSize='md'
            fontWeight={500}
            fontStyle='italic'
            color='blue.700'
          >
            {customData.species}
          </Text>
          {count != null && (
            <Text fontSize='xs' color='gray.600'>
              {RESULTS_POINTS(count)}
            </Text>
          )}
          {linkedViruses.map((virus) => (
            <HStack key={virus} gap={1} fontSize='sm' fontWeight={600}>
              <Icon as={LuLink} boxSize={3} aria-hidden='true' />
              <Text>{virus}</Text>
            </HStack>
          ))}
        </Flex>
        <FormControlRadioTime
          label={TIMEFRAME_LABEL}
          info={TIMEFRAME_INFO}
          options={allTimeFrame}
          // Every run models all scenarios; this flips between its rasters.
          handleAction={([name]) => onScenarioChange(name)}
          value={customData.scenario}
          availableValues={customData.availableScenarios}
        />
        {(hasFoi || hasPoints) && (
          <Box role='group' aria-labelledby='map-layers-heading'>
            <Heading
              as='h2'
              id='map-layers-heading'
              fontSize='xs'
              fontWeight={600}
              letterSpacing='0.5px'
              color='gray.600'
              lineHeight='short'
              textTransform='uppercase'
            >
              {MAP_LAYERS_LABEL}
            </Heading>
            {hasFoi && (
              <FormControlSwitch
                label={SHOW_FOI_LABEL}
                value={showFoi}
                handleAction={onToggleFoi}
              />
            )}
            {hasPoints && (
              <FormControlSwitch
                label={SHOW_POINTS_LABEL}
                value={showPoints}
                handleAction={onTogglePoints}
              />
            )}
          </Box>
        )}
        <RunHistory currentJobId={customData.jobId} defaultOpen={false} />
        <Button
          mt='auto'
          variant='solid'
          colorPalette='blue'
          loading={downloading}
          onClick={handleDownload}
        >
          <Icon as={LuDownload} aria-hidden='true' />
          {DOWNLOAD_RESULTS}
        </Button>
        {canRunModels && (
          <Button
            variant='outline'
            colorPalette='blue'
            borderColor='currentColor'
            bg='white'
            onClick={handleNewDataset}
          >
            {UPLOAD_NEW_DATASET}
          </Button>
        )}
        {onClearToExplore && (
          <Button
            variant='ghost'
            colorPalette='blue'
            onClick={onClearToExplore}
          >
            <Icon as={LuX} aria-hidden='true' />
            {CLEAR_UPLOADED_DATA}
          </Button>
        )}
      </Flex>
    );
  }

  // Signed out: the linked run's results are loading (a run that isn't
  // finished never gets here; it is dropped as not available).
  if (!canRunModels) {
    return (
      <HStack gap={2} role='status'>
        <Spinner size='xs' color='blue.600' aria-hidden='true' />
        <Text fontSize='xs'>{JOB_STATUS_TEXT.LOADING}</Text>
      </HStack>
    );
  }

  const canSubmit =
    file && selectedSpecies && !isFormDisabled && enteredErrors.complete;

  const statusText = isUploading
    ? UPLOAD_IN_PROGRESS
    : customData && JOB_STATUS_TEXT[customData.status];

  return (
    <Flex direction='column' flex={1} gap={4}>
      <List.Root as='ol' variant='plain' gap={5}>
        <Step
          number={1}
          label={
            <FileUpload.Label {...stepLabelProps}>
              {RUN_STEP_UPLOAD}
            </FileUpload.Label>
          }
          wrap={(body) => (
            <FileUpload.RootProvider
              value={fileUpload}
              alignItems='stretch'
              gap={2}
            >
              {body}
            </FileUpload.RootProvider>
          )}
        >
          <HStack gap={1} color='blue.600' fontSize='sm' fontWeight={500}>
            <Icon as={LuInfo} boxSize={4} aria-hidden='true' />
            <Text fontSize='xs'>{RUN_SINGLE_SPECIES}</Text>
          </HStack>
          <FileUpload.HiddenInput />
          {!file && (
            <FileUpload.Dropzone
              ref={dropzoneRef}
              minH='auto'
              py={3}
              px={2}
              gap={1}
              borderWidth='2px'
              borderStyle='dashed'
              borderColor='blue.400'
              bg='blue.50'
              borderRadius='md'
              cursor='pointer'
              _dragging={{ bg: 'blue.100', borderColor: 'blue.600' }}
            >
              <Icon
                as={LuUpload}
                boxSize={4}
                color='blue.700'
                aria-hidden='true'
              />
              <FileUpload.DropzoneContent textAlign='center' gap={1}>
                <Text fontSize='sm' fontWeight={600} color='gray.800'>
                  {UPLOAD_DROPZONE_TEXT}
                </Text>
                <Text
                  fontSize='sm'
                  fontWeight={600}
                  color='blue.700'
                  textDecoration='underline'
                >
                  {UPLOAD_DROPZONE_BROWSE}
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  {UPLOAD_DROPZONE_HINT}
                </Text>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          )}
          <FileUpload.ItemGroup>
            {fileUpload.acceptedFiles.map((item) => (
              <FileUpload.Item
                key={item.name}
                file={item}
                bg='white'
                borderColor='gray.300'
                borderRadius='md'
                p={2}
                gap={2}
              >
                <Circle size={7} bg='green.100' color='green.700'>
                  <Icon as={LuCheck} boxSize={4} aria-hidden='true' />
                </Circle>
                <FileUpload.ItemContent lineHeight={1} overflow='hidden'>
                  <FileUpload.ItemName fontWeight={600} mb={1} />
                  <VStack gap={1} fontSize='xs' color='gray.600' align='start'>
                    <Text>
                      {UPLOAD_FILE_DETAILS(previewCount ?? pointCount)}
                    </Text>
                    <FileUpload.ItemSizeText />
                  </VStack>
                </FileUpload.ItemContent>
                {!isRunning && (
                  <FileUpload.ItemDeleteTrigger asChild>
                    <CloseButton
                      size='2xs'
                      colorPalette='gray'
                      aria-label={`${UPLOAD_REMOVE_FILE} ${item.name}`}
                      label={UPLOAD_REMOVE_FILE}
                    />
                  </FileUpload.ItemDeleteTrigger>
                )}
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
        </Step>

        <Step
          number={2}
          label={
            <Field.Label {...stepLabelProps}>{RUN_STEP_SPECIES}</Field.Label>
          }
          wrap={fieldStep()}
        >
          <ComboboxSingle
            options={allSpecies}
            value={selectedSpecies}
            handleAction={selectSpecies}
            placeholder={
              foiParams ? RUN_SPECIES_PLACEHOLDER : RUN_SPECIES_LOADING
            }
            emptyText={RUN_SPECIES_EMPTY}
            isDisabled={isFormDisabled}
            inputProps={{ borderColor: 'gray.300' }}
          />
          {detected && (
            <SpeciesDetection
              detected={detected}
              selectedSpecies={selectedSpecies}
              speciesName={speciesName}
            />
          )}
        </Step>

        <Step
          number={3}
          label={
            <Text id={pathogenHeadingId} {...stepLabelProps}>
              {RUN_STEP_PATHOGEN}
            </Text>
          }
          badge={selectedSpecies ? RUN_PATHOGEN_BADGE : null}
          // A plain group, not a Field: checkboxes inside a Field take its
          // ids, so they would all share one input id and label.
          wrap={(body) => (
            <Stack gap={2} role='group' aria-labelledby={pathogenHeadingId}>
              {body}
            </Stack>
          )}
        >
          <Stack gap={1}>
            {speciesViruses.map((virus) => (
              <Stack key={virus} gap={1}>
                <Checkbox.Root
                  size='sm'
                  colorPalette='blue'
                  checked={pathogens.includes(virus)}
                  onCheckedChange={() => togglePathogen(virus)}
                  disabled={isRunning}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontWeight='normal' fontStyle='italic'>
                    {virus}
                  </Checkbox.Label>
                </Checkbox.Root>
                {missing.prevalence.includes(virus) && (
                  <Field.Root
                    pb={1}
                    gap={1}
                    required
                    invalid={!!enteredErrors.prevalence[virus]}
                  >
                    <Field.Label fontSize='xs' fontWeight={500}>
                      {RUN_PREVALENCE_LABEL}
                      <VisuallyHidden>{` for ${virus}`}</VisuallyHidden>
                    </Field.Label>
                    <EnteredInput
                      value={entered.prevalence[virus] ?? ''}
                      onChange={(value) => enterPrevalence(virus, value)}
                      max={100}
                      disabled={isRunning}
                    />
                    <Field.ErrorText fontSize='xs'>
                      {enteredErrors.prevalence[virus]}
                    </Field.ErrorText>
                    <Field.HelperText fontSize='xs' color='gray.600'>
                      {RUN_PREVALENCE_HINT(roundRange(ranges.prevalence, 1))}
                    </Field.HelperText>
                  </Field.Root>
                )}
              </Stack>
            ))}
            {!selectedSpecies && (
              <Text fontSize='sm' color='gray.600'>
                {RUN_PATHOGEN_NO_SPECIES}
              </Text>
            )}
            {selectedSpecies && !speciesViruses.length && (
              <Text fontSize='sm'>—</Text>
            )}
          </Stack>
          {missing.k && (
            <Box role='group' aria-labelledby={kHeadingId}>
              <Text id={kHeadingId} fontSize='xs' fontWeight={500} mb={1}>
                {RUN_K_LABEL}
              </Text>
              <HStack gap={2} align='start'>
                <Field.Root gap={1} required invalid={!!enteredErrors.k_min}>
                  <Field.Label fontSize='xs' fontWeight={500}>
                    {RUN_K_MIN_LABEL}
                  </Field.Label>
                  <EnteredInput
                    value={entered.k_min}
                    onChange={(k_min) =>
                      setEntered((prev) => ({ ...prev, k_min }))
                    }
                    disabled={isRunning}
                  />
                  <Field.ErrorText fontSize='xs'>
                    {enteredErrors.k_min}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root gap={1} required invalid={!!enteredErrors.k_max}>
                  <Field.Label fontSize='xs' fontWeight={500}>
                    {RUN_K_MAX_LABEL}
                  </Field.Label>
                  <EnteredInput
                    value={entered.k_max}
                    onChange={(k_max) =>
                      setEntered((prev) => ({ ...prev, k_max }))
                    }
                    disabled={isRunning}
                  />
                  <Field.ErrorText fontSize='xs'>
                    {enteredErrors.k_max}
                  </Field.ErrorText>
                </Field.Root>
              </HStack>
              <Text fontSize='xs' color='gray.600' mt={1}>
                {RUN_K_HINT(roundRange(ranges.k_min), roundRange(ranges.k_max))}
              </Text>
            </Box>
          )}
        </Step>

        <Step
          number={4}
          label={
            <Field.Label {...stepLabelProps}>{RUN_STEP_MODEL}</Field.Label>
          }
          wrap={fieldStep()}
        >
          <NativeSelect.Root>
            <NativeSelect.Field
              disabled={isRunning}
              bg='white'
              borderColor='gray.300'
              value={selectedModel}
              onChange={(event) => setModel(event.target.value)}
            >
              {allModels.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Step>
      </List.Root>

      <Stack gap={3} mt='auto' pt={4}>
        {foiParamsError && (
          <Alert.Root status='error' role='alert'>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{RUN_SPECIES_ERROR_TITLE}</Alert.Title>
              <Alert.Description fontSize='xs' lineHeight='shorter'>
                {RUN_SPECIES_ERROR_TEXT}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        {status === STATUS.ERROR && (
          <Alert.Root status='error' role='alert'>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{UPLOAD_ERROR_TITLE}</Alert.Title>
              <Alert.Description fontSize='xs' lineHeight='shorter'>
                {UPLOAD_ERROR_TEXT}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        <Button
          colorPalette={canSubmit ? 'blue' : 'gray'}
          variant={canSubmit ? 'solid' : 'subtle'}
          disabled={!canSubmit}
          onClick={handleRun}
        >
          {isRunning ? RUN_IN_PROGRESS : RUN_SUBMIT}
        </Button>
        {isRunning && (
          <Box>
            <Progress.Root
              value={null}
              size='xs'
              colorPalette='blue'
              aria-label={RUN_IN_PROGRESS}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <HStack gap={2} mt={2} role='status'>
              <Spinner size='xs' color='blue.600' aria-hidden='true' />
              <Text fontSize='xs'>{statusText}</Text>
            </HStack>
          </Box>
        )}
        {isRunning && customData && (
          <Button
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={handleNewDataset}
          >
            {UPLOAD_NEW_DATASET}
          </Button>
        )}
        <Alert.Root status='info' variant='subtle' colorPalette='blue'>
          <Alert.Indicator />
          <Alert.Description fontSize='xs' lineHeight='shorter'>
            {RUN_SERVER_NOTICE}
          </Alert.Description>
        </Alert.Root>
        <RunHistory currentJobId={loadedJobId} />
      </Stack>
    </Flex>
  );
};

export default RunModelsPanel;
