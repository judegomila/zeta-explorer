import { useState, useEffect } from 'react';

/**
 * imp-848: Shared useAsyncMetric hook.
 *
 * Runs computeFn() asynchronously and exposes {loading, value, error}.
 * Re-runs whenever the computeFn reference changes — callers wrap their
 * compute with useCallback([refreshKey]) so the identity change triggers
 * a fresh run.
 *
 * imp-847 bug history: an earlier version used useMemo(() => ..., []),
 * which never re-ran when computeFn changed, making Refresh/Recompute
 * buttons silent no-ops on DashboardPage and HealthPage. This extraction
 * deduplicates the corrected implementation so future fixes apply once.
 */
export function useAsyncMetric(computeFn) {
  const [state, setState] = useState({ loading: true, value: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, value: null, error: null });
    Promise.resolve().then(async () => {
      try {
        const value = await computeFn();
        if (!cancelled) setState({ loading: false, value, error: null });
      } catch (err) {
        if (!cancelled) setState({ loading: false, value: null, error: err.message });
      }
    });
    return () => { cancelled = true; };
  }, [computeFn]);

  return state;
}

export default useAsyncMetric;
