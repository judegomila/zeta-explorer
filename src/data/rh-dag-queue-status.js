/**
 * Lightweight bridge: improvement-queue → rh-dag status cross-check.
 *
 * Imports the canonical improvement-queue (no heavy zeros bundle — pure data)
 * and exports a compact {id → status} map used by the rh-dag.js
 * 'dag-status-matches-queue' assertion to detect stale DAG node statuses.
 *
 * imp-2979: wire RH-DAG node statuses to the live improvement-queue.
 */

import { IMPROVEMENT_QUEUE } from './improvement-queue.js';

const _map = {};
for (const t of IMPROVEMENT_QUEUE) {
  _map[t.id] = t.status;
}

/**
 * Map from improvement-queue ticket id to its canonical status string
 * ('pending' | 'completed' | 'partial' | 'in-progress').
 * Used in rh-dag.js assertions; do not import in page components
 * (improvement-queue.js is large — acceptable for build-time assertions,
 * not for React render paths).
 */
export const QUEUE_STATUS_BY_ID = _map;
