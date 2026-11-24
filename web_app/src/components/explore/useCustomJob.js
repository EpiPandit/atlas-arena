import { useCallback, useEffect, useRef, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useAuth } from '@/store/auth';
import { setHashParams, useHashParams } from '@/libs/hashParams';
import {
  distinctColors,
  findSpeciesColor,
  findVirus,
  timeFrameKey,
  timeFrameName,
} from '@/libs/catalog';
import {
  POLL_INTERVAL_MS,
  TERMINAL_STATUSES,
  JobNotAvailable,
  fetchPresence,
  foiRasters,
  getJob,
  getJobResult,
  isDeltaScenario,
  isJobId,
  isScenario,
  jobScenarios,
  pickRaster,
  presenceUrl,
  readPresence,
  submitJob,
} from '@/libs/jobs';
import { addRun, updateRun } from '@/libs/runHistory';
import {
  JOB_FAILED_TITLE,
  JOB_NOT_AVAILABLE_TEXT,
  JOB_NOT_AVAILABLE_TITLE,
  JOB_NOT_FOUND_TITLE,
} from '@/config/constants/constants.explore';

// The custom-data model run shown on Explore. The URL fragment is the source
// of truth (#job=<id>&scenario=<time_frames key>): uploading pushes it,
// clearing removes it, and loading, reloading, shared links and Back/Forward
// all just follow it. Every job models all scenarios, so switching scenario
// only re-picks rasters from the loaded job. A finished job's results are
// public, so anyone with the link sees them; following a running job's status
// needs a signed-in user.
export const useCustomJob = () => {
  const { job: jobParam, scenario: scenarioParam } = useHashParams();
  const { status: authStatus, user } = useAuth();
  // For the run history (libs/runHistory), which is kept per account.
  const email = user?.email || null;
  const emailRef = useRef(email);
  emailRef.current = email;

  const jobId = jobParam || null;
  const requestedScenario = isScenario(scenarioParam)
    ? scenarioParam
    : 'current';
  const signedIn = authStatus === 'signedIn';
  // Waits for auth: whether a job that isn't finished can be followed depends
  // on it.
  const active = Boolean(jobId) && authStatus !== 'loading';

  // Latest status for jobId: GET jobs/{id}'s while it runs, then the public
  // result (getJobResult's, with status SUCCEEDED). Null until the first.
  const [job, setJob] = useState(null);
  // { jobId, fc }: points uploaded in this tab, or fetched from presenceUrl.
  const [presence, setPresence] = useState(null);
  const presenceRef = useRef(presence);
  presenceRef.current = presence;
  const [showPoints, setShowPoints] = useState(true);
  const [showFoi, setShowFoi] = useState(true);
  // Points of the file picked in the upload modal, before it's submitted.
  const [previewFc, setPreviewFc] = useState(null);
  // Its layer name, which may name the species.
  const [previewName, setPreviewName] = useState(null);
  const previewFileRef = useRef(null);

  // Toast, then drop the job from the URL (replace: the link was bad).
  const dropJob = useCallback((title, description) => {
    toaster.create({
      type: 'error',
      title,
      description,
      closable: true,
      duration: 8000,
    });
    setHashParams({ job: null, scenario: null });
  }, []);

  useEffect(() => {
    setShowPoints(true);
    setShowFoi(true);
  }, [jobId]);

  useEffect(() => {
    setJob(null);
    if (!active) return;
    if (!isJobId(jobId)) {
      dropJob(JOB_NOT_FOUND_TITLE);
      return;
    }
    let cancelled = false;
    let timer = null;

    // Points uploaded in this tab are already there; jobs without any (older
    // ones) just fail to fetch.
    if (presenceRef.current?.jobId !== jobId) {
      fetchPresence(presenceUrl(jobId))
        .then((fc) => {
          if (!cancelled) setPresence({ jobId, fc });
        })
        .catch(() => {});
    }

    const markRun = (status) => updateRun(emailRef.current, jobId, { status });

    const fail = (err) => {
      if (cancelled) return;
      if (err instanceof JobNotAvailable) {
        markRun('UNAVAILABLE');
        dropJob(JOB_NOT_AVAILABLE_TITLE, JOB_NOT_AVAILABLE_TEXT);
      } else dropJob(JOB_FAILED_TITLE, err.message);
    };

    const loadResult = async () => {
      const result = await getJobResult(jobId);
      if (cancelled) return;
      if (!pickRaster(result.rasters, 'current')) {
        dropJob(JOB_FAILED_TITLE, 'The model run produced no rasters');
      } else {
        setJob({ ...result, status: 'SUCCEEDED' });
      }
    };

    // Signed in: follows a job that isn't finished until it is.
    const poll = async () => {
      let data;
      try {
        data = await getJob(jobId);
      } catch (err) {
        if (cancelled) return;
        clearInterval(timer);
        const status = err.response?.status;
        // apiFetch has signed out, which reloads the job as anonymous.
        if (status === 401) return;
        if (status === 404) {
          markRun('UNAVAILABLE');
          dropJob(JOB_NOT_FOUND_TITLE);
        } else
          dropJob(JOB_FAILED_TITLE, err.response?.data?.detail || err.message);
        return;
      }
      if (cancelled) return;
      if (TERMINAL_STATUSES.includes(data.status)) clearInterval(timer);
      if (data.status === 'FAILED' || data.status === 'UNKNOWN') {
        markRun(data.status);
        dropJob(JOB_FAILED_TITLE, data.error || `Job status ${data.status}`);
      } else if (data.status === 'SUCCEEDED') {
        loadResult().catch(fail);
      } else {
        setJob(data);
      }
    };

    // A finished job loads straight from its public result; anything else is
    // followed through the API when signed in, and not available otherwise.
    loadResult().catch((err) => {
      if (cancelled) return;
      if (signedIn && err instanceof JobNotAvailable) {
        poll();
        timer = setInterval(poll, POLL_INTERVAL_MS);
      } else {
        fail(err);
      }
    });
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active, signedIn, jobId, dropJob]);

  // Keeps the history's status up to date while the run is loaded (failures
  // are recorded where they're caught, since they drop the job).
  const jobStatus = job?.status;
  useEffect(() => {
    if (jobId && jobStatus)
      updateRun(emailRef.current, jobId, { status: jobStatus });
  }, [jobId, jobStatus]);

  // Run Models hooks (RunModelsPanel's onUpload / onUploadSuccess / onFileChange).
  const upload = async ({ species, pathogens, file }) => {
    const { fc, pointCount } = await readPresence(file);
    const newJobId = await submitJob({ species, pathogens, presence: fc });
    addRun(email, {
      id: newJobId,
      species,
      viruses: pathogens.map(({ virus }) => virus),
    });
    return { pointCount, jobId: newJobId, fc };
  };

  // Keeps the scenario picked before the upload, if any.
  const onUploadSuccess = ({ jobId: newJobId, fc }) => {
    setPresence({ jobId: newJobId, fc });
    setHashParams(
      { job: newJobId, scenario: requestedScenario },
      { push: true }
    );
  };

  // Replaces rather than pushes: switching scenarios isn't Back/Forward history.
  const setScenario = (timeFrame) =>
    setHashParams({ scenario: timeFrameKey(timeFrame) });

  const previewFile = (file) => {
    previewFileRef.current = file;
    if (!file) {
      setPreviewFc(null);
      setPreviewName(null);
      return;
    }
    readPresence(file)
      .then(({ fc, layerName }) => {
        if (previewFileRef.current !== file) return;
        setPreviewFc(fc);
        setPreviewName(layerName);
      })
      .catch(() => {
        if (previewFileRef.current !== file) return;
        setPreviewFc(null);
        setPreviewName(null);
      });
  };

  const clear = () =>
    setHashParams({ job: null, scenario: null }, { push: true });

  const succeeded = active && job?.status === 'SUCCEEDED';
  // Scenarios the job has rasters for; empty until it has succeeded. A
  // scenario the job lacks (older jobs, edited links) shows Current instead.
  const availableScenarios = succeeded ? jobScenarios(job.rasters) : [];
  const scenario =
    !succeeded || availableScenarios.includes(requestedScenario)
      ? requestedScenario
      : 'current';
  const jobPresence = active && presence?.jobId === jobId ? presence.fc : null;

  // The job's species and each FOI virus get distinct ramps, so its SDM and
  // FOI layers never share one. Viruses claim their catalog colours first (the
  // same as the catalog hotspots), sorted so a virus keeps its ramp across
  // scenarios; the species takes its own if still free.
  const foiOutputs = succeeded
    ? foiRasters(job.rasters, scenario)
        .map((output) => ({ ...output, ...findVirus(output.virusSlug) }))
        .sort((a, b) => a.virusSlug.localeCompare(b.virusSlug))
    : [];
  const colors = distinctColors([
    ...foiOutputs.map((output) => output.color),
    findSpeciesColor(job?.species_name),
  ]);
  const speciesColor = colors[colors.length - 1];

  return {
    // { jobId, scenario and availableScenarios (display names), species,
    // status } while a job is loaded.
    customData: active
      ? {
          jobId,
          scenario: timeFrameName(scenario),
          availableScenarios: availableScenarios.map(timeFrameName),
          species: job?.species_name,
          status: job ? job.status : 'LOADING',
        }
      : null,
    rasterUrl: succeeded ? pickRaster(job.rasters, scenario) : null,
    // The MAP_COLORS ramp for the job's species layer.
    speciesColor,
    isDelta: isDeltaScenario(scenario),
    setScenario,
    // [{ virus (catalog name), color, foiUrl }] once it succeeded; empty when
    // the species has no FOI parameters.
    foiLayers: foiOutputs.map(({ name, foi }, i) => ({
      virus: name,
      color: colors[i],
      foiUrl: foi,
    })),
    showFoi,
    setShowFoi,
    points: previewFc || (showPoints ? jobPresence : null),
    previewName,
    hasPoints: Boolean(jobPresence),
    showPoints,
    setShowPoints,
    upload,
    onUploadSuccess,
    previewFile,
    clear,
  };
};
