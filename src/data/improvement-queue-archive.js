/**
 * Improvement Queue Archive — long-term storage for completed items.
 *
 * Policy: completed items older than ~30 days may be moved here from
 * src/data/improvement-queue.js to keep the live queue focused on
 * pending + recent work and to slow the unbounded growth of that file.
 *
 * Schema is identical to IMPROVEMENT_QUEUE entries — pages that want the
 * full historical view should import IMPROVEMENT_QUEUE_ALL from this module
 * (which concatenates the live queue and the archive). Pages that want only
 * the live working set can keep importing IMPROVEMENT_QUEUE directly.
 *
 * Migration of entries is intentionally manual / incremental: any time the
 * live queue starts to feel unwieldy, oldest completed items get moved here
 * in a single mechanical commit, with no semantic change.
 */

import { IMPROVEMENT_QUEUE } from './improvement-queue.js';

export const IMPROVEMENT_QUEUE_ARCHIVE = [
  // Empty for now. Items will be migrated here in follow-up batches.
];

export const IMPROVEMENT_QUEUE_ALL = [
  ...IMPROVEMENT_QUEUE,
  ...IMPROVEMENT_QUEUE_ARCHIVE,
];
