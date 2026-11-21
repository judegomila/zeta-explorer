/**
 * @module imp-33676-full-range-band-clearing-overview-viz-data
 *
 * imp-33676 (ux): extends the imp-33656 merged [400,900] band-clearing overview to the full
 * [400,1200] window by re-exporting the imp-33638 [900,1200] re-intensification digest
 * alongside the existing imp-33656 [400,900] merge. imp-33656 already merged the imp-33629
 * dense [400,700] scan with the imp-33621 coarse [700,900] tail digest; imp-33638 later
 * extended the identical scan into [900,1200] and found the envelope RE-INTENSIFIES rather
 * than hitting a ceiling (max ~143.6 ULP at n~1126, nearly double the [700,900] tail max
 * ~78.4). That extension has no chart of its own, so the ~doubling is not visible alongside
 * the earlier window in a single view.
 *
 * RESOLUTION CAVEAT: [400,700] stays dense per-integer (imp-33629). [700,1200] is a coarse
 * every-25th-rung digest (imp-33621 + imp-33638), with all sixteen cluster peaks (three
 * dense, thirteen coarse) marked exactly. No new computation happens here; everything is
 * re-exported literals from the three source modules.
 *
 * @see imp-33656-merged-band-clearing-overview-viz-data.js (the [400,900] half this extends)
 * @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the [900,1200] source)
 *
 * Ticket: imp-33676 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 * no refereed bound is changed; NO QED.
 */

import {
  IMP33656_BAND_ULP,
  IMP33656_WINDOW_LO,
  IMP33656_SPLIT_N,
  IMP33656_DENSE_SCAN,
  IMP33656_TAIL_DIGEST,
  IMP33656_CLUSTERS,
  IMP33656_DENSE_ENV_MAX,
  IMP33656_TAIL_ENV_MAX,
} from './imp-33656-merged-band-clearing-overview-viz-data.js';
import { IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200 } from './imp-33638-band-clearing-tail-reintensification-n900-1200.js';

const deep = IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200.measured;

export const IMP33676_BAND_ULP = IMP33656_BAND_ULP;
export const IMP33676_WINDOW_LO = IMP33656_WINDOW_LO;
export const IMP33676_WINDOW_HI = deep.deepWindowHi; // 1200
export const IMP33676_SPLIT_N = IMP33656_SPLIT_N; // 700 -- dense/coarse resolution boundary

// -- Dense [400,700] per-integer [n, floorUlp, envelope] triples, verbatim from imp-33656/imp-33629 --
export const IMP33676_DENSE_SCAN = IMP33656_DENSE_SCAN;

// -- Coarse every-25th-rung [700,1200] {n, floorUlp, envelope} digest: imp-33621 tail + imp-33638 deep --
export const IMP33676_TAIL_DIGEST = [...IMP33656_TAIL_DIGEST, ...deep.deepScanDigest];

// -- All sixteen disjoint band-clearing clusters across [400,1200], tagged by source resolution --
export const IMP33676_CLUSTERS = [
  ...IMP33656_CLUSTERS,
  ...deep.deepClusters.map((c) => ({ ...c, resolution: 'coarse' })),
];

export const IMP33676_DENSE_ENV_MAX = IMP33656_DENSE_ENV_MAX; // [400,700] max, ~76.1
export const IMP33676_TAIL_ENV_MAX = IMP33656_TAIL_ENV_MAX; // [700,900] max, ~78.4
export const IMP33676_DEEP_ENV_MAX = deep.deepEnvMax; // [900,1200] max, ~143.6 -- nearly double
export const IMP33676_OVERALL_ENV_MAX = Math.max(
  IMP33676_DENSE_ENV_MAX,
  IMP33676_TAIL_ENV_MAX,
  IMP33676_DEEP_ENV_MAX,
);
export const IMP33676_REINTENSIFY_RATIO = deep.reIntensifyRatio;
export const IMP33676_DEEP_ENV_MAX_N = deep.deepEnvMaxN;
