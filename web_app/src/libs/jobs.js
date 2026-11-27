import axios from 'axios';
import { zipSync } from 'fflate';
import { apiFetch } from '@/libs/api';
import { parseRows, toNumber } from '@/libs/csv';
import { JOBS_URL } from '@/config/constants/general';

// Custom-data model runs on the atlasarena-model-infra API: POST jobs with the
// presence GeoJSON inline, then poll GET jobs/{id} (signed in) until it
// finishes. A finished job's outputs are public in S3 (JOBS_URL), so anyone
// with its id reads them, signed in or not: see getJobResult.

export const POLL_INTERVAL_MS = 5000;
export const TERMINAL_STATUSES = ['SUCCEEDED', 'FAILED', 'UNKNOWN'];

const MIN_POINTS = 20;

// Fast settings (same as the model-infra demo frontend); the API defaults
// make for a multi-hour job.
const JOB_SETTINGS = {
  pseudo_absence: { n_replicates: 2, min_distance_km: 0 },
  sdm: { models: ['rf', 'et'], cv: 2, feature_selection_mode: 'none' },
  seed: 42,
};

// Scenario key (catalog.json time_frames) -> API scenario. Delta keys show the
// future scenario's difference from Current.
const API_SCENARIOS = { current: 'Current', ssp2: 'SSP2', ssp5: 'SSP5' };
const DELTA_SCENARIOS = { delta_ssp2: 'SSP2', delta_ssp5: 'SSP5' };
export const SCENARIO_KEYS = [
  ...Object.keys(API_SCENARIOS),
  ...Object.keys(DELTA_SCENARIOS),
];
export const isScenario = (key) => SCENARIO_KEYS.includes(key);
export const isDeltaScenario = (key) => key in DELTA_SCENARIOS;
const toScenario = (key) =>
  API_SCENARIOS[key] || DELTA_SCENARIOS[key] || API_SCENARIOS.current;

// Job ids are 12 hex characters (atlasarena.config).
export const isJobId = (id) => /^[0-9a-f]{12}$/.test(id || '');

// Reads and checks a presence file; throws if the API would reject it.
export const readPresence = async (file) => {
  const fc = JSON.parse(await file.text());
  if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
    throw new Error('Presence file is not a GeoJSON FeatureCollection');
  }
  const bad = fc.features.find(
    (f) => !['Point', 'MultiPoint'].includes(f && f.geometry && f.geometry.type)
  );
  if (bad) throw new Error('Presence features must be Points or MultiPoints');
  if (fc.features.length < MIN_POINTS) {
    throw new Error(`Presence needs at least ${MIN_POINTS} points`);
  }
  // The layer name (e.g. 'abrothrix_longipilis_(waterhouse_1837)_presence'),
  // used to pre-select the species.
  const layerName = fc.name || fc.features[0]?.properties?.name || null;
  return { fc, pointCount: fc.features.length, layerName };
};

// Returns the new job's id. pathogens is the API's foi.pathogens
// ([{ virus, prevalence, k_min, k_max }], see libs/foiParams); force of
// infection runs for those, and is off when there are none. The API fills in
// the population rasters from the deployment's defaults. Leaves out
// predictors.scenarios: the API defaults to all of Current, SSP2 and SSP5,
// which the scenario switcher flips between.
export const submitJob = async ({ species, presence, pathogens = [] }) => {
  const { data } = await apiFetch('jobs', {
    method: 'POST',
    data: {
      species_name: species,
      presence,
      ...JOB_SETTINGS,
      foi: pathogens.length ? { enabled: true, pathogens } : { enabled: false },
    },
  });
  return data.job_id;
};

// { job_id, status, species_name, error, ... }; needs a signed-in user.
export const getJob = async (jobId) => {
  const { data } = await apiFetch(`jobs/${encodeURIComponent(jobId)}`);
  return data;
};

// Thrown by getJobResult for a job with no public result: unknown, or not
// finished (S3 answers 403 for a missing object it won't list).
export class JobNotAvailable extends Error {}

const jobBaseUrl = (jobId) => `${JOBS_URL}jobs/${encodeURIComponent(jobId)}/`;

// A finished job's public result: { job_id, species_name, rasters }, rasters
// being public COG URLs keyed by stem (as pickRaster and foiRasters expect).
// result.json is the worker's last write, so it exists only once the job has
// succeeded. Its raster URIs are GDAL paths (/vsis3/<bucket>/jobs/<id>/<file>);
// the files sit next to it, so only their basenames are used.
export const getJobResult = async (jobId) => {
  const base = jobBaseUrl(jobId);
  let data;
  try {
    ({ data } = await axios.get(`${base}result.json`));
  } catch (err) {
    if ([403, 404].includes(err.response?.status)) throw new JobNotAvailable();
    throw err;
  }
  const rasters = Object.fromEntries(
    Object.values(data.rasters || {}).map((uri) => {
      const file = uri.split('/').pop();
      return [file.replace(/\.tif$/, ''), `${base}${file}`];
    })
  );
  return { job_id: data.job_id, species_name: data.species_name, rasters };
};

// A stats table's contents, or null if the job doesn't have it: older jobs
// don't, and S3 answers 403 for a missing object it won't list.
const fetchJobTable = async (jobId, file, responseType) => {
  try {
    const { data } = await axios.get(`${jobBaseUrl(jobId)}${file}`, {
      responseType,
    });
    return data;
  } catch (err) {
    if ([403, 404].includes(err.response?.status)) return null;
    throw err;
  }
};

// metrics_summary.csv as [{ id, metrics: { test_auc_roc: { mean, std }, ... } }].
// std is null for a single replicate.
const parseModelMetrics = (text) =>
  parseRows(text).map(({ model, ...columns }) => ({
    id: model,
    metrics: Object.fromEntries(
      Object.keys(columns)
        .filter((column) => column.endsWith('_mean'))
        .map((column) => {
          const metric = column.replace(/_mean$/, '');
          return [
            metric,
            {
              mean: toNumber(columns[column]),
              std: toNumber(columns[`${metric}_std`]),
            },
          ];
        })
    ),
  }));

// feature_importances_summary.csv as { [model]: [{ feature, mean, std }] },
// largest first. Estimators without importances have a blank mean: left out.
const parseImportances = (text) => {
  const importances = {};
  parseRows(text).forEach(
    ({ model, feature, importance_mean, importance_std }) => {
      const mean = toNumber(importance_mean);
      if (mean == null) return;
      (importances[model] = importances[model] || []).push({
        feature,
        mean,
        std: toNumber(importance_std),
      });
    }
  );
  Object.values(importances).forEach((rows) =>
    rows.sort((a, b) => b.mean - a.mean)
  );
  return importances;
};

// A finished job's summary stats (public): { models, importances }, as parsed
// above, or null for a job with neither table. Either can be empty on its own.
export const getJobMetrics = async (jobId) => {
  const [summary, importances] = await Promise.all([
    fetchJobTable(jobId, 'metrics_summary.csv', 'text'),
    fetchJobTable(jobId, 'feature_importances_summary.csv', 'text'),
  ]);
  if (summary == null && importances == null) return null;
  return {
    models: summary == null ? [] : parseModelMetrics(summary),
    importances: importances == null ? {} : parseImportances(importances),
  };
};

// The job's uploaded points (public). Older jobs, and ones submitted with a
// path/URI presence, have none: fetching it then fails.
export const presenceUrl = (jobId) =>
  `${JOBS_URL}_control/${encodeURIComponent(jobId)}/presence.geojson`;

// Probability raster for the timeframe: stems are <species_slug>_<Scenario>
// (e.g. calomys_musculinus_SSP2), next to _diff_, _foi_ and _hotspots_ ones.
// Delta keys pick <species_slug>_diff_<Scenario>_minus_current.
export const pickRaster = (rasters, scenarioKey) => {
  const scenario = toScenario(scenarioKey).toLowerCase();
  const stem = Object.keys(rasters || {}).find((key) => {
    const lower = key.toLowerCase();
    if (isDeltaScenario(scenarioKey)) {
      return lower.endsWith(`_diff_${scenario}_minus_current`);
    }
    return (
      lower.endsWith(`_${scenario}`) && !/_(diff|foi|hotspots)_/.test(lower)
    );
  });
  return stem ? rasters[stem] : null;
};

// The scenario keys a job has a probability raster for. Jobs submitted before
// every run covered all three scenarios may only have some.
export const jobScenarios = (rasters) =>
  SCENARIO_KEYS.filter((key) => pickRaster(rasters, key));

// FOI outputs for the timeframe, one entry per virus the species has FOI
// parameters for: stems are <species_slug>__<virus_slug>_foi_<scenario>.
// Returns [{ virusSlug, foi }] (URLs). The ..._hotspots_<scenario> rasters
// next to them aren't shown, only downloaded. There are no FOI differences:
// delta keys get their future scenario's.
export const foiRasters = (rasters, scenarioKey) => {
  const scenario = toScenario(scenarioKey).toLowerCase();
  const pattern = new RegExp(`^(.*)__(.+?)_foi_${scenario}$`);
  return Object.entries(rasters || {}).flatMap(([stem, url]) => {
    const match = stem.toLowerCase().match(pattern);
    return match ? [{ virusSlug: match[2], foi: url }] : [];
  });
};

// The presence GeoJSON at presenceUrl. Plain axios: S3 needs no Authorization.
export const fetchPresence = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const STATS_FILES = [
  'metrics.csv',
  'metrics_summary.csv',
  'feature_importances_summary.csv',
];

// Saves a succeeded job's outputs as one zip,
// atlasarena_<species_slug>_<job_id>.zip with a <stem>.tif per raster and the
// stats tables the job has. The COGs are already DEFLATE-compressed and the
// CSVs are tiny, so the zip only stores them.
export const downloadJobResults = async (jobId) => {
  const job = await getJobResult(jobId);
  const rasters = Object.entries(job.rasters || {});
  if (!rasters.length) throw new Error('This job has no rasters');
  const [rasterFiles, statsFiles] = await Promise.all([
    Promise.all(
      rasters.map(async ([stem, url]) => {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        return [`${stem}.tif`, new Uint8Array(data)];
      })
    ),
    Promise.all(
      STATS_FILES.map(async (file) => {
        const data = await fetchJobTable(jobId, file, 'arraybuffer');
        return data && [file, new Uint8Array(data)];
      })
    ),
  ]);
  const files = Object.fromEntries([
    ...rasterFiles,
    ...statsFiles.filter(Boolean),
  ]);
  const zipped = zipSync(files, { level: 0 });
  const slug = (job.species_name || 'species')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const href = URL.createObjectURL(
    new Blob([zipped], { type: 'application/zip' })
  );
  const link = document.createElement('a');
  link.href = href;
  link.download = `atlasarena_${slug}_${jobId}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke after the click has handed the blob to the browser's download.
  setTimeout(() => URL.revokeObjectURL(href), 0);
};
