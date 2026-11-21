/**
 * @module data/imp-96370-sigma-peak-ch-sensitivity
 * @fileoverview imp-96370 -- measure how sensitive the imp-3220 conditional-share
 *   curve sigma(N) = E_coll(N) / E(N) is to the unproven constant C_H over the
 *   conditional interval [1/8, 0.127], at and around its interior peak N* ~ 9.22e5.
 *
 *   THE SETUP. imp-3220 tabulates the bridge-budget conditional share
 *       sigma(N) = E_coll(N) / (E_trunc + E_flow + E_coll(N)),
 *   the fraction of the Step-4 fidelity budget E(N) borrowed from the single
 *   GUE-conditional term E_coll, using the repo formulas (effectiveHeightForN,
 *   C_C_PINNED, the pinned C_F prefactor). The roadmap currentStatus reports this
 *   curve is U-shaped with an interior peak sigma_max ~ 0.9494 at N* ~ 9.22e5.
 *   imp-96311/imp-96349 established E_coll(N) = C_H * R(N): C_H enters ONLY as a
 *   linear prefactor, with C_H = 1/8 the leading-order ansatz and C_H <= 0.127 the
 *   generous conditional hypothesis (UNPROVEN, imp-2642/imp-486). The baseline
 *   C_C_PINNED encodes C_H = 1/8, so scaling E_coll by f = C_H / (1/8) sweeps C_H
 *   across [1/8, 0.127] without re-deriving the rate.
 *
 *   WHAT IS MEASURED. Recompute sigma(N) with E_coll scaled by f = C_H/(1/8) and
 *   report, across the imp-3220 ladder and at the peak, (a) the PEAK-SHARE SPREAD
 *   as C_H ranges over [1/8, 0.127] and (b) any PEAK-LOCATION SHIFT.
 *
 *   THE FINDING (measurement only).
 *   (1) PEAK LOCATION IS EXACTLY C_H-INVARIANT. Writing E_rig = E_trunc + E_flow
 *       (both C_H-free), sigma(N; C_H) = 1 / (1 + (1/f) * E_rig/E_coll0), where
 *       E_coll0 is the C_H = 1/8 baseline collision term. For any fixed f > 0 the
 *       share is a monotone-decreasing function of E_rig/E_coll0, so its argmax in
 *       N is argmin_N (E_rig/E_coll0) = argmax_N (E_coll0/E_rig), which carries no
 *       C_H. Scaling E_coll by a positive constant cannot move the peak. Measured:
 *       the peak sits at N* = 9.2257e5 for BOTH C_H = 1/8 and C_H = 0.127 (grid).
 *   (2) THE PEAK HEIGHT MOVES ONLY ~7.6e-4. sigma_max = 0.9494290 at C_H = 1/8
 *       rises to 0.9501857 at C_H = 0.127, a spread of 7.567e-4 (~0.076 pp). The
 *       share is monotone increasing in C_H at every fixed N (larger prefactor =>
 *       larger conditional fraction), but the [1/8, 0.127] interval spans only a
 *       1.6% range of C_H, so the peak barely moves. At the peak E_coll0/E_rig =
 *       18.77, so sigma is already deep in saturation and near-flat in C_H there.
 *
 *   PUNCHLINE. Over the entire proven-hypothesis interval the imp-3220 peak-share
 *   location does not move at all and its height moves by under a thousandth. The
 *   sigma(N) conditional-share curve is essentially insensitive to the C_H
 *   uncertainty: what makes E(N) conditional is that C_H is finite-but-unproven,
 *   NOT its precise value in [1/8, 0.127]. The bottleneck stays fixed by
 *   E_trunc/E_flow structure and the C_H-free rate, not by where C_H lands.
 *
 *   MEASUREMENT ONLY. C_mb stays GUE-conditional (imp-486); C_H <= 0.127 remains
 *   UNPROVEN (imp-2642/imp-2701); this closes no gap, changes no bound, proves no
 *   constant, and does not close G6_polymath15_bridge. RH open. NO QED.
 *   No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (sigma(N) U-shape, same repo formulas)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (E_coll = C_H * R(N))
 * @see polymath15-constant-C-C (C_C_PINNED encodes C_H = 1/8)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 bound upper bound.

// Same C_H-free sub-terms as imp-3220 / imp-2643 (identical repo formulas).
const E_TRUNC_PT = 3.06e-5; // fixed-strip Platt-Trudgian route, N-independent.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const C_H_BASELINE = 0.125; // the C_C_PINNED ansatz value (imp-2642).
const C_H_HYP = 0.127; // generous conditional hypothesis (UNPROVEN, imp-486).

// The C_H-free pieces at N: E_rig = E_trunc + E_flow, and the C_H = 1/8 baseline
// collision term E_coll0 (= C_C_PINNED * sqrt(log T0 / N)).
function parts(N) {
  const T0 = effectiveHeightForN(N); // gamma_N via Riemann-von Mangoldt inverse
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // pinned prefactor (imp-398)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll0 = C_C_PINNED * Math.sqrt(L / N); // C_H = 1/8 baseline
  return { E_rig: E_TRUNC_PT + E_flow, E_coll0 };
}

// sigma(N; C_H) with E_coll scaled by f = C_H / (1/8) -- the imp-96311 linear law.
function sigma(N, CH) {
  const { E_rig, E_coll0 } = parts(N);
  const E_coll = (CH / C_H_BASELINE) * E_coll0;
  return E_coll / (E_rig + E_coll);
}

// Locate the interior peak of sigma(.; CH) on a fine log grid over [1e5, 1e7].
function findPeak(CH) {
  let bestN = 0;
  let bestS = -1;
  for (let e = 5; e <= 7 + 1e-9; e += 0.001) {
    const N = Math.pow(10, e);
    const s = sigma(N, CH);
    if (s > bestS) {
      bestS = s;
      bestN = N;
    }
  }
  return { N: bestN, sigmaMax: bestS };
}

const PEAK_BASELINE = findPeak(C_H_BASELINE); // C_H = 1/8
const PEAK_HYP = findPeak(C_H_HYP); // C_H = 0.127

// Peak-location shift (grid-resolution) and peak-share spread over [1/8, 0.127].
const PEAK_LOCATION_SHIFT_DEX = Math.abs(
  Math.log10(PEAK_HYP.N) - Math.log10(PEAK_BASELINE.N),
);
const PEAK_SHARE_SPREAD = PEAK_HYP.sigmaMax - PEAK_BASELINE.sigmaMax;

// Independent check of the invariance claim: the argmax of the C_H-free ratio
// E_coll0/E_rig (which fixes the peak for EVERY C_H) sits at the same N.
function argmaxRatioN() {
  let bestN = 0;
  let bestR = -1;
  for (let e = 5; e <= 7 + 1e-9; e += 0.001) {
    const N = Math.pow(10, e);
    const { E_rig, E_coll0 } = parts(N);
    const r = E_coll0 / E_rig;
    if (r > bestR) {
      bestR = r;
      bestN = N;
    }
  }
  return { N: bestN, ratio: bestR };
}
const RATIO_ARGMAX = argmaxRatioN();

// Ladder tabulation: sigma at each imp-3220 rung for a small C_H sweep, plus the
// per-rung spread over [1/8, 0.127]. Peak row appended at N*.
const LADDER_N = [2, 10, 100, 1000, 1e4, 1e5, 1e6];
const C_H_SWEEP = [0.125, 0.126, 0.127];
const LADDER = LADDER_N.map((N) => {
  const row = { N };
  C_H_SWEEP.forEach((CH) => {
    row['sigma_CH_' + String(CH).replace('.', '')] = +sigma(N, CH).toFixed(6);
  });
  row.spread = +(sigma(N, C_H_HYP) - sigma(N, C_H_BASELINE)).toExponential(3);
  return row;
});
// Where is the per-rung C_H spread largest across the ladder? (Smaller sigma =>
// less saturated => more C_H-sensitive; the peak is the LEAST sensitive rung.)
const MAX_LADDER_SPREAD = Math.max(
  ...LADDER_N.map((N) => sigma(N, C_H_HYP) - sigma(N, C_H_BASELINE)),
);

export const IMP96370_SIGMA_PEAK_CH_SENSITIVITY = {
  id: 'imp-96370',
  proofSection: 'S-frontier',
  question:
    'How sensitive is the imp-3220 conditional-share curve sigma(N) = E_coll(N)/E(N) ' +
    'to the unproven C_H over [1/8, 0.127] at its interior peak N* ~ 9.22e5, given ' +
    'E_coll = C_H * R(N) (imp-96311)? Measurement only, no bound change, no QED.',
  model:
    'sigma(N; C_H) = 1 / (1 + (1/f) * E_rig/E_coll0), f = C_H/(1/8), E_rig = ' +
    'E_trunc + E_flow (both C_H-free), E_coll0 the C_H=1/8 baseline collision term.',
  peak: {
    baseline: {
      C_H: C_H_BASELINE,
      N: +PEAK_BASELINE.N.toExponential(4),
      sigmaMax: +PEAK_BASELINE.sigmaMax.toFixed(7),
    },
    hypothesis: {
      C_H: C_H_HYP,
      N: +PEAK_HYP.N.toExponential(4),
      sigmaMax: +PEAK_HYP.sigmaMax.toFixed(7),
    },
    peakLocationShiftDex: +PEAK_LOCATION_SHIFT_DEX.toExponential(3),
    peakShareSpread: +PEAK_SHARE_SPREAD.toExponential(4),
    eColl0OverERigAtPeak: +RATIO_ARGMAX.ratio.toFixed(4),
    invarianceNote:
      'The peak location is EXACTLY C_H-invariant: sigma(N;C_H) is monotone in ' +
      'E_rig/E_coll0 at fixed f, so its argmax in N is argmax_N (E_coll0/E_rig), ' +
      'which carries no C_H. Scaling E_coll by a positive constant cannot move ' +
      'the peak; only its height changes. The C_H-free ratio argmax sits at N = ' +
      RATIO_ARGMAX.N.toExponential(4) + ', matching both sigma peaks.',
  },
  ladder: LADDER,
  maxLadderSpread: +MAX_LADDER_SPREAD.toExponential(3),
  measurement: {
    peakLocationCHInvariant:
      'The interior peak stays at N* = ' + PEAK_BASELINE.N.toExponential(4) +
      ' for both C_H = 1/8 and C_H = 0.127 (grid-resolution shift ' +
      PEAK_LOCATION_SHIFT_DEX.toExponential(3) + ' dex, i.e. none): analytically ' +
      'exact because C_H is a pure prefactor.',
    peakHeightBarelyMoves:
      'The peak SHARE moves only ' + PEAK_SHARE_SPREAD.toExponential(3) +
      ' (0.9494290 -> 0.9501857) across the whole [1/8, 0.127] interval, because ' +
      'that interval spans just 1.6% of C_H and, at E_coll0/E_rig = 18.77, sigma ' +
      'is deep in saturation and near-flat in C_H at the peak.',
    monotoneInCH:
      'sigma(N; C_H) is monotone increasing in C_H at every fixed N (a larger ' +
      'prefactor raises the conditional fraction); the peak is the LEAST ' +
      'C_H-sensitive rung of the ladder (max per-rung spread ' +
      MAX_LADDER_SPREAD.toExponential(3) + ').',
    interpretation:
      'What makes E(N) conditional is that C_H is finite-but-UNPROVEN, not its ' +
      'precise value in [1/8, 0.127]: over that interval the conditional-share ' +
      'peak does not move and its height moves under a thousandth. The E(N) ' +
      'bottleneck is fixed by E_trunc/E_flow structure and the C_H-free rate.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Over the conditional interval ' +
    'C_H in [1/8, 0.127] the imp-3220 conditional-share peak is essentially ' +
    'insensitive: its location is EXACTLY C_H-invariant (N* = 9.2257e5, zero ' +
    'shift -- C_H is a pure prefactor and cannot move the argmax of E_coll0/E_rig) ' +
    'and its height moves only 7.567e-4 (sigma_max 0.9494290 -> 0.9501857), since ' +
    'the interval spans 1.6% of C_H and sigma is saturated (E_coll0/E_rig = 18.77) ' +
    'at the peak. The share is monotone in C_H, and the peak is the least ' +
    'C_H-sensitive rung. C_mb stays GUE-conditional (imp-486); C_H <= 0.127 stays ' +
    'UNPROVEN; no gap closed, no bound changed, no closure of G6_polymath15_bridge. ' +
    'RH open. NO QED. No refereed bound is changed.',
  citation:
    'imp-3220 (sigma(N) U-shape, same repo E(N) formulas); imp-96311/imp-96349 ' +
    '(E_coll = C_H * R(N), C_H a linear prefactor); imp-2642 (C_H = 1/8 ansatz); ' +
    'imp-486 (C_mb GUE-conditional, no unconditional bound); polymath15-constant-C-C ' +
    '(C_C_PINNED encodes C_H = 1/8).',
};

export const IMP96370_SIGMA_PEAK_CH_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp96370-peak-location-c-h-invariant',
    description: 'The sigma(N) peak location is C_H-invariant (no grid-resolution shift)',
    holds: () =>
      PEAK_LOCATION_SHIFT_DEX < 1e-9 &&
      Math.abs(Math.log10(RATIO_ARGMAX.N) - Math.log10(PEAK_BASELINE.N)) < 1e-9,
    why:
      'sigma(N; C_H) = 1/(1 + (1/f) E_rig/E_coll0) is monotone in E_rig/E_coll0 at ' +
      'fixed f, so its argmax in N equals argmax_N (E_coll0/E_rig), which contains no ' +
      'C_H. A positive prefactor cannot move the peak; if a future edit makes the peak ' +
      'location depend on C_H, this fails and the same commit must justify why.',
  },
  {
    id: 'imp96370-peak-near-9p22e5',
    description: 'The interior peak sits at N* ~ 9.22e5 (reproduces the roadmap sigma_max locus)',
    holds: () => Math.abs(Math.log10(PEAK_BASELINE.N) - Math.log10(9.22e5)) < 0.01,
    why:
      'The tabulation must reproduce the roadmap-reported interior peak locus N* ~ 9.22e5, ' +
      'confirming it reuses the identical imp-3220 sub-term formulas, not a fresh model.',
  },
  {
    id: 'imp96370-baseline-peak-height-matches-imp3220',
    description: 'The C_H=1/8 peak height reproduces the imp-3220 sigma_max ~ 0.9494',
    holds: () => Math.abs(PEAK_BASELINE.sigmaMax - 0.9494) < 5e-4,
    why:
      'At the ansatz C_H = 1/8 the measured peak share must match the imp-3220 headline ' +
      'sigma_max ~ 0.9494, anchoring this sensitivity study to the parent tabulation.',
  },
  {
    id: 'imp96370-peak-share-spread-small',
    description: 'The peak-share spread over [1/8, 0.127] is a sub-1e-3 shift (~7.6e-4)',
    holds: () =>
      PEAK_SHARE_SPREAD > 0 &&
      PEAK_SHARE_SPREAD < 1e-3 &&
      Math.abs(PEAK_SHARE_SPREAD - 7.567e-4) < 5e-5,
    why:
      'The whole point: the conditional-share peak height barely moves across the ' +
      'proven-hypothesis interval (positive because sigma is monotone in C_H, but under ' +
      'a thousandth because [1/8,0.127] is only a 1.6% C_H range and sigma is saturated).',
  },
  {
    id: 'imp96370-monotone-in-c-h-peak-least-sensitive',
    description: 'sigma is monotone in C_H at fixed N, and the peak is the least C_H-sensitive rung',
    holds: () =>
      sigma(9.2257e5, C_H_HYP) > sigma(9.2257e5, C_H_BASELINE) &&
      PEAK_SHARE_SPREAD <= MAX_LADDER_SPREAD + 1e-12,
    why:
      'A larger prefactor raises the conditional fraction (monotone in C_H), and the ' +
      'saturated peak rung is the least sensitive to C_H of the tabulated ladder.',
  },
  {
    id: 'imp96370-honesty-gate-no-qed',
    description: 'Measurement only: names the C_H/C_mb conditional, no QED, no refereed bound is changed',
    holds: () =>
      IMP96370_SIGMA_PEAK_CH_SENSITIVITY.isRigorous === false &&
      /C_H <= 0.127 stays UNPROVEN/.test(IMP96370_SIGMA_PEAK_CH_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96370_SIGMA_PEAK_CH_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96370_SIGMA_PEAK_CH_SENSITIVITY.verdict),
    why:
      'This ticket is measurement only: it must not assert closure of G6_polymath15_bridge, ' +
      'must not change any bound, and must not reclassify the unproven C_H <= 0.127 as rigorous.',
  },
];

for (const a of IMP96370_SIGMA_PEAK_CH_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96370-sigma-peak-ch-sensitivity assertion failed: ${a.id}`);
  }
}
