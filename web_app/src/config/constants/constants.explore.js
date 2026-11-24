// ======
// SIDEBAR
// ======

export const SIDEBAR_TITLE = 'EXPLORE';
export const SIDEBAR_SUBTITLE = 'Explore the risk of Arenaviruses';
export const FILTERS_SHOW = 'Show filters';
export const FILTERS_HIDE = 'Hide filters';

// VIRUS FILTER
export const VIRUS_LABEL = 'virus';
export const VIRUS_INFO = 'virus';

// SCENARIOS
export const TIMEFRAME_LABEL = 'Climate Scenarios';
export const TIMEFRAME_INFO = 'Shared Socio-economic Pathways (SSPs)';

// RODENT DISTRIBUTION
export const SDM_TOGGLE_LABEL = 'Show Species Distribution Maps';
export const FOI_TOGGLE_LABEL = 'Show Force of Infection';

// SPECIES
export const SPECIES_LABEL = 'Reservoir Species';
export const SPECIES_INFO = 'species';

// MODEL
export const MODEL_LABEL = 'model algorithm';
export const MODEL_INFO = 'model';

// LEGEND
export const LEGEND_OPACITY = 'Opacity';
export const LEGEND_OPACITY_OF = (name = '') => `${LEGEND_OPACITY} of ${name}`;
export const LEGEND_ADJUST_OPACITY = (name = '') => `Adjust opacity of ${name}`;
export const LEGEND_SCALE = (min = '', max = '') =>
  `Scale from ${min} to ${max}.`;
export const LEGEND_SDM_TITLE = 'Species distribution';

export const UNIT_SDM = 'probability';
export const UNIT_DELTA = 'change';

// SIDEBAR TABS
export const TAB_EXPLORE = 'Explore Models';
export const TAB_RUN = 'Run Models';
export const TAB_RUN_SIGNED_OUT = 'Log in to run custom models';

// RUN MODELS (custom data upload and model run)
export const CUSTOM_DATA_NOTICE = (species = '') =>
  `Results for ${species} are based on your uploaded data`;
export const RUN_DESCRIPTION =
  'Upload presence points for one species. Points are linked to known zoonotic hantaviruses and arenaviruses to generate species distribution models (SDMs) and force-of-infection (FOI) hazard layers.';
export const RUN_STEP_UPLOAD = 'Upload presence data';
export const RUN_SINGLE_SPECIES = 'Please upload a single species only.';
export const RUN_STEP_SPECIES = 'Species';
export const RUN_STEP_PATHOGEN = 'Pathogen association';
export const RUN_PATHOGEN_BADGE = 'Auto-selected';
// Entered parameters, for species/virus pairs the FOI table has no estimate for.
// Ranges are [lo, hi] across the table, or null.
const typical = (range, unit = '') =>
  range ? ` Typical: ${range[0]}–${range[1]}${unit}.` : '';
export const RUN_PREVALENCE_LABEL = 'Prevalence (%)';
export const RUN_PREVALENCE_HINT = (range) =>
  `No published estimate. Enter one to include this pathogen.${typical(range, '%')}`;
export const RUN_PREVALENCE_ERROR = 'Enter a percentage from 0 to 100.';
export const RUN_K_LABEL = 'Carrying capacity (K)';
export const RUN_K_MIN_LABEL = 'Min';
export const RUN_K_MAX_LABEL = 'Max';
export const RUN_K_HINT = (minRange, maxRange) =>
  `No published estimate for this species. Enter a range to compute force of infection.${
    minRange && maxRange
      ? ` Typical: min ${minRange[0]}–${minRange[1]}, max ${maxRange[0]}–${maxRange[1]}.`
      : ''
  }`;
export const RUN_K_ERROR = 'Enter a number of 0 or more.';
export const RUN_K_ORDER_ERROR = 'Max must be at least min.';
export const RUN_SPECIES_LOADING = 'Loading species…';
export const RUN_SPECIES_PLACEHOLDER = 'Select or search for a species';
export const RUN_PATHOGEN_NO_SPECIES = 'Choose a species first.';
export const RUN_SPECIES_EMPTY = 'No matching species';
export const RUN_SPECIES_DETECTED = 'Detected from your file';
export const RUN_SPECIES_DETECTED_CHANGED = (name) =>
  `Your file suggested ${name}`;
export const RUN_SPECIES_NOT_DETECTED =
  'We couldn’t detect the species from your file. Choose it from the list.';
export const RUN_SPECIES_ERROR_TITLE = 'Couldn’t load species list';
export const RUN_SPECIES_ERROR_TEXT =
  'Species and pathogen parameters are unavailable. Reload the page to try again.';
export const RUN_STEP_MODEL = 'Model';
export const RUN_SUBMIT = 'Run Model';
export const RUN_IN_PROGRESS = 'Running model…';
export const RUN_SERVER_NOTICE =
  'Model inferencing runs on the server. You can close your browser or navigate away from this tab.';
export const UPLOAD_DROPZONE_TEXT = 'Drag & drop a GeoJSON file here';
export const UPLOAD_DROPZONE_BROWSE = 'or browse files';
export const UPLOAD_DROPZONE_HINT =
  'Single species · [lon, lat] points · EPSG:4326';
export const UPLOAD_DROPZONE_LABEL = `Upload presence data: ${UPLOAD_DROPZONE_TEXT} ${UPLOAD_DROPZONE_BROWSE}`;
export const UPLOAD_FILE_DETAILS = (count) =>
  count == null
    ? 'EPSG:4326'
    : `${count.toLocaleString('en-US')} points · EPSG:4326`;
export const UPLOAD_REMOVE_FILE = 'Remove file';
export const UPLOAD_ACCEPT = '.geojson,.json,application/geo+json';
export const UPLOAD_IN_PROGRESS = 'Uploading presence data';
export const UPLOAD_ERROR_TITLE = 'Upload failed';
export const UPLOAD_ERROR_TEXT = 'We couldn’t process this file.';
export const MAP_POINTS_EMPTY =
  'Your uploaded presence points will appear here';
export const MAP_POINTS_LOADED = (count = 0) =>
  `${count.toLocaleString('en-US')} presence points loaded`;
export const RESULTS_DESCRIPTION =
  'Results for the data you uploaded. Switch climate scenarios to see projected change.';
export const SHARED_RESULTS_DESCRIPTION =
  'Results of a shared model run. Switch climate scenarios to see projected change.';
export const RESULTS_SPECIES_LABEL = 'Uploaded species';
export const RESULTS_POINTS = (count = 0) =>
  `${count.toLocaleString('en-US')} presence points`;
export const MAP_LAYERS_LABEL = 'Map layers';
export const UPLOAD_NEW_DATASET = 'Upload new dataset';
export const CLEAR_UPLOADED_DATA = 'Clear uploaded data';
export const DOWNLOAD_RESULTS = 'Download results';
export const DOWNLOAD_ERROR_TITLE = 'Download failed';
export const DOWNLOAD_ERROR_TEXT =
  'We couldn’t download the results. Please try again.';
// CUSTOM JOB METRICS (right-hand panel, once a run has succeeded)
export const METRICS_PANEL_TITLE = 'Model metrics';
export const METRICS_PANEL_SHOW = 'Show model metrics';
export const METRICS_PANEL_HIDE = 'Hide model metrics';
export const METRICS_PERFORMANCE_LABEL = 'Model performance';
export const METRICS_PERFORMANCE_NOTE =
  'Values are means; hover for ± standard deviation.';
export const METRICS_IMPORTANCE_LABEL = 'Feature importance';
export const METRICS_LOADING = 'Loading model metrics';
export const METRICS_ERROR = 'We couldn’t load the model metrics.';
export const METRICS_SHOW_ALL = 'Show all features';
export const METRICS_SHOW_FEWER = 'Show fewer features';
export const METRICS_SPLITS = [
  { prefix: 'test', label: 'Held-out test' },
  { prefix: 'cv', label: 'Cross-validation' },
];
export const METRICS_NAMES = {
  accuracy: 'Accuracy',
  precision: 'Precision',
  recall: 'Recall',
  auc_roc: 'AUC-ROC',
};
export const METRICS_MODEL_NAMES = { rf: 'Random forest', et: 'Extra trees' };
// CUSTOM JOB STATUS (sidebar, while custom data is loaded)
export const JOB_STATUS_TEXT = {
  LOADING: 'Loading model run',
  SUBMITTED: 'Queued: waiting for the model to start',
  RUNNING: 'Model running: this can take a few minutes',
  SUCCEEDED: 'Results ready',
};
export const RUN_HISTORY_TITLE = 'Previous jobs';
export const RUN_HISTORY_COUNT = (n) => `Previous jobs (${n})`;
export const RUN_HISTORY_NOTE = 'Jobs submitted from this browser';
export const RUN_HISTORY_REMOVE = (species) =>
  `Remove ${species} from previous jobs`;
export const RUN_HISTORY_EMPTY =
  'No previous jobs yet. Jobs you submit from this browser will appear here.';
export const RUN_HISTORY_CLEAR = 'Clear list';
export const RUN_HISTORY_CURRENT = 'Showing';
export const RUN_HISTORY_STATUS = {
  SUBMITTED: 'Queued',
  RUNNING: 'Running',
  SUCCEEDED: 'Ready',
  FAILED: 'Failed',
  UNKNOWN: 'Failed',
  UNAVAILABLE: 'Unavailable',
};
export const SHOW_POINTS_LABEL = 'Show uploaded presence points';
export const SHOW_FOI_LABEL = 'Show Force of Infection';
export const LEGEND_FOI_TITLE = 'Force of infection';
export const LEGEND_FOI_TICKS = ['0', '0.025', '0.05'];
export const JOB_NOT_AVAILABLE_TITLE = 'Results not available yet';
export const JOB_NOT_AVAILABLE_TEXT =
  'This model run hasn’t finished, or the link is wrong. Check back later.';
export const JOB_FAILED_TITLE = 'Model run failed';
export const JOB_NOT_FOUND_TITLE = 'Model run not found';

// MAP
export const MAP_REGION_LABEL = 'Arenavirus risk map';
// MODAL

export const FIRST_LINE_MODAL = 'About the virus';
