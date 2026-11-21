/**
 * @module imp-34557-hump-skew-mirror-viz-j5
 *
 * imp-34557 (ux, sonnet-4-6): imp-33851 visualized the M3 hump envelope head/tail mirror
 * (hump(9-j) vs hump(9+j)) only out to offset j = 3, matching the imp-33809 amplitude table it
 * had at the time. imp-34532 then extended the underlying hump(k) ladder to k = 4,5,14 and found
 * the head-heavy skew does NOT saturate at j = 4,5 -- it ACCELERATES: skew(j) = {1.2176, 1.5758,
 * 3.0426, 10.9549, 50.3270} for j = 1..5, with the successive-skew ratio itself growing {1.294,
 * 1.931, 3.600, 4.594}. There is still no viz covering the full j = 1..5 mirror. This module
 * VERBATIM-reuses the imp-33809 humpAmplitudes (k = 6..13) and the imp-34532 head/tail extension
 * amplitudes (k = 4,5,14) -- no fresh hump(k) computation -- and derives headFrac(j)/tailFrac(j) =
 * hump(9-j)/peak and hump(9+j)/peak for the full ladder, gated against the imp-34532
 * fullSkewLadder/fullAsymmetryLadder literals.
 *
 * Viz only -- NO QED. Measurement/presentation of already-published literals.
 *
 * @see imp-33851-hump-envelope-symmetry-vs-k (original mirror viz data, j = 1..3)
 * @see imp-34532-hump-skew-headside-extension-k5-k4 (source of the j = 4,5 extension + full ladders)
 * @see imp-33809-saturation-curvature-hump-vs-k (source of the k = 6..13 humpAmplitudes)
 */

import { IMP33809_SATURATION_CURVATURE_HUMP_VS_K } from './imp-33809-saturation-curvature-hump-vs-k.js';
import { IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4 } from './imp-34532-hump-skew-headside-extension-k5-k4.js';

const CROSSOVER_K = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.crossoverDecadeK; // 9
const HUMPS_6_13 = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes; // k = 6..13, index 0..7
const PEAK = IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.humpPeak; // 6.4758e-2 (hump(9))
const EXT = IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.headExtensionAmplitudes;

// hump(k) lookup for k = 4..14, all values reused verbatim (no recomputation).
function humpAt(k) {
  if (k === 4) return EXT.hump4;
  if (k === 5) return EXT.hump5;
  if (k === 13) return EXT.hump13;
  if (k === 14) return EXT.hump14;
  return HUMPS_6_13[k - 6];
}

// Mirror ladder j = 1..5: headK = 9-j, tailK = 9+j, both fractions of the k = 9 peak.
const MIRROR_LADDER = [1, 2, 3, 4, 5].map((j) => {
  const headK = CROSSOVER_K - j;
  const tailK = CROSSOVER_K + j;
  const headHump = humpAt(headK);
  const tailHump = humpAt(tailK);
  return {
    offset: j,
    headK,
    tailK,
    headHump: +headHump.toExponential(4),
    tailHump: +tailHump.toExponential(4),
    headFrac: +(headHump / PEAK).toFixed(4),
    tailFrac: +(tailHump / PEAK).toFixed(4),
    skew: +(headHump / tailHump).toFixed(4),
    asym: +((headHump - tailHump) / (headHump + tailHump)).toFixed(4),
  };
});

const SKEW_LADDER = MIRROR_LADDER.map((r) => r.skew);
const ASYM_LADDER = MIRROR_LADDER.map((r) => r.asym);
const SUCCESSIVE_SKEW_RATIOS = IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.successiveSkewRatios; // {1.294,1.931,3.600,4.594}

export const IMP34557_HUMP_SKEW_MIRROR_VIZ_J5 = {
  id: 'imp-34557',
  proofSection: 'S-frontier',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: PEAK,
  mirrorLadder: MIRROR_LADDER,
  skewLadder: SKEW_LADDER, // {1.2176, 1.5758, 3.0426, 10.9549, 50.3270}
  asymmetryLadder: ASYM_LADDER, // {0.0981, 0.2236, 0.5053, 0.8327, 0.9610}
  successiveSkewRatios: SUCCESSIVE_SKEW_RATIOS, // {1.294, 1.931, 3.600, 4.594}: the climb ACCELERATES
  verdict:
    'VISUALIZATION ONLY (measurement/presentation of already-published imp-34532 and imp-33809 ' +
    'literals, no fresh computation). Mirrors hump(9-j) against hump(9+j) about the k = 9 crossover ' +
    'out to j = 5: the skew(j) = hump(9-j)/hump(9+j) ladder {1.2176, 1.5758, 3.0426, 10.9549, ' +
    '50.3270} and asymmetry index {0.0981, 0.2236, 0.5053, 0.8327, 0.9610} both climb toward the ' +
    'head, with the j = 4,5 amplitudes sitting in the deep collision-dominated (sigma -> 1) regime ' +
    'where the inherited imp-3220/imp-3406 component model is least trustworthy. Changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33851 (original mirror viz, j = 1..3); imp-34532 (head-heavy skew ladder extended to ' +
    'j = 4,5, source of the fullSkewLadder/fullAsymmetryLadder reuse-gate); imp-33809 (per-k hump ' +
    'amplitudes, k = 6..13).',
};

export const IMP34557_HUMP_SKEW_MIRROR_VIZ_J5_ASSERTIONS = [
  {
    // Reuse gate: the mirror-derived skew/asym ladders reproduce the imp-34532 published literals.
    id: 'imp34557-skew-matches-imp34532',
    description: 'derived skew(j) ladder matches the imp-34532 fullSkewLadder to <1e-3',
    holds: () =>
      SKEW_LADDER.every(
        (v, i) => Math.abs(v - IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.fullSkewLadder[i]) < 1e-3
      ),
  },
  {
    id: 'imp34557-asym-matches-imp34532',
    description: 'derived asym(j) ladder matches the imp-34532 fullAsymmetryLadder to <1e-3',
    holds: () =>
      ASYM_LADDER.every(
        (v, i) => Math.abs(v - IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.fullAsymmetryLadder[i]) < 1e-3
      ),
  },
  {
    // Accelerating climb: successive-skew ratio itself grows, matching imp-34532 E1.
    id: 'imp34557-skew-accelerates',
    description: 'successive skew ratio skew(j+1)/skew(j) grows monotonically across j = 1..4',
    holds: () =>
      SUCCESSIVE_SKEW_RATIOS.every((v, i) => (i === 0 ? true : v > SUCCESSIVE_SKEW_RATIOS[i - 1])),
  },
  {
    id: 'imp34557-honesty-gate',
    description: 'verdict states viz-only, no fresh computation, no QED',
    holds: () =>
      /VISUALIZATION ONLY/.test(IMP34557_HUMP_SKEW_MIRROR_VIZ_J5.verdict) &&
      /NO QED/.test(IMP34557_HUMP_SKEW_MIRROR_VIZ_J5.verdict),
  },
];
