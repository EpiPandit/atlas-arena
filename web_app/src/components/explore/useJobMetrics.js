import { useEffect, useState } from 'react';
import { getJobMetrics } from '@/libs/jobs';

// { metrics, loading, error } for a finished job: metrics is getJobMetrics'
// { models, importances }, or null while loading and for a job without any.
export const useJobMetrics = (jobId) => {
  const [state, setState] = useState({
    metrics: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let active = true;
    setState({ metrics: null, loading: true, error: null });
    getJobMetrics(jobId).then(
      (metrics) => active && setState({ metrics, loading: false, error: null }),
      (error) => {
        console.error(error);
        if (active) setState({ metrics: null, loading: false, error });
      }
    );
    return () => {
      active = false;
    };
  }, [jobId]);
  return state;
};
