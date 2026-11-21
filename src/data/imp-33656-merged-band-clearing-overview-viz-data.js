/**
 * @module imp-33656-merged-band-clearing-overview-viz-data
 *
 * imp-33656 (ux): lightweight, import-light viz-data module that MERGES the imp-33629
 * [400,700] wide-range floorUlp(n) band-crossing envelope chart data with the imp-33621
 * [700,900] tail extension, into a single consolidated [400,900] cross-window overview.
 * Each existing viz surface covers only one half of the window (imp-33629 has a dedicated
 * page; imp-33621 has none), so the imp-33638 tail re-intensification -- the [700,900] max
 * (~78.4 ULP at n~709) EXCEEDING the [400,700] max (~76.1 ULP at n~526) -- is not visible
 * in one view.
 *
 * RESOLUTION CAVEAT: [400,700] is re-exported at full per-integer resolution (the
 * imp-33629 IMP33629_SCAN triples). [700,900] has no published full per-integer array --
 * imp-33621 baked only a coarse every-25th-rung digest plus exact cluster peak/edge
 * summaries -- so the merged envelope trace is DENSE over [400,700] and COARSE (every 25
 * rungs) over [700,900], with all nine cluster peaks (three dense, six coarse) marked
 * exactly. No new computation happens here; everything is re-exported literals from the
 * two source modules.
 *
 * @see imp-33629-wide-range-band-crossing-envelope-viz-data.js (the [400,700] dense source)
 * @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the [700,900] tail source)
 * @see imp-33599-wide-range-band-crossing-envelope-law.js (the original [400,700] scan)
 *
 * Ticket: imp-33656 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 * no refereed bound is changed; NO QED.
 */

import {
  IMP33629_BAND_ULP,
  IMP33629_WINDOW_LO,
  IMP33629_CLUSTERS,
  IMP33629_SCAN,
} from './imp-33629-wide-range-band-crossing-envelope-viz-data.js';
import { IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN } from './imp-33621-band-clearing-cluster-decay-and-tail-scan.js';

const tail = IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN.measured;

export const IMP33656_BAND_ULP = IMP33629_BAND_ULP;
export const IMP33656_WINDOW_LO = IMP33629_WINDOW_LO;
export const IMP33656_WINDOW_HI = tail.tailWindowHi; // 900
export const IMP33656_SPLIT_N = tail.tailWindowLo; // 700 -- the dense/coarse resolution boundary

// -- Dense [400,700] per-integer [n, floorUlp, envelope] triples, verbatim from imp-33629 --
export const IMP33656_DENSE_SCAN = IMP33629_SCAN;

// -- Coarse every-25th-rung [700,900] {n, floorUlp, envelope} digest, verbatim from imp-33621 --
export const IMP33656_TAIL_DIGEST = tail.tailScanDigest;

// -- All nine disjoint band-clearing clusters across the full [400,900] window, tagged by source resolution --
export const IMP33656_CLUSTERS = [
  ...IMP33629_CLUSTERS.map((c) => ({ ...c, resolution: 'dense' })),
  ...tail.tailClusters.map((c) => ({ ...c, resolution: 'coarse' })),
];

export const IMP33656_DENSE_ENV_MAX = tail.clusterWindowEnvMax; // ~76.0753, the [400,700] envelope max
export const IMP33656_TAIL_ENV_MAX = tail.tailEnvMax; // ~78.4, the [700,900] envelope max -- EXCEEDS the dense max
export const IMP33656_OVERALL_ENV_MAX = Math.max(IMP33656_DENSE_ENV_MAX, IMP33656_TAIL_ENV_MAX);
