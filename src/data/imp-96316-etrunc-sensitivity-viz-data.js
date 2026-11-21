/**
 * imp-96316 -- viz panel for the imp-96187 N_peak/N_flow vs E_trunc-scaling sensitivity sweep.
 *
 * imp-96187 F3 showed that scaling the fixed-strip E_trunc floor by 0.25x..16x drives the imp-3220
 * U-shape peak-location ratio N_peak/N_flow smoothly from 0.637 down to 0.357, sweeping THROUGH
 * 1/sqrt(3) = 0.57735 at the actual E_trunc = 3.06e-5 with no plateau or fixed point there --
 * decisive evidence that the 0.577 ~ 1/sqrt(3) proximity (imp-96162 F2) is an ACCIDENT of the
 * inherited constants, not a forced identity. That six-point sweep was never plotted. This module
 * RECOMPUTES the same sweep from the identical inherited component model (E_trunc frozen fixed-strip
 * value scaled by a multiplier, Gronwall E_flow, GUE-conditional E_coll) at a finer grid to expose
 * the smooth crossing for charting -- no new derivation, same formulas as imp-96187.
 *
 * Import-light: only imports effectiveHeightForN + C_C_PINNED (the same two imp-96187 imports) plus
 * the imp-96187 module's own frozen landmarks/sensitivity for a consistency check -- NO zeros bundle.
 *
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (F3 sensitivity sweep this renders)
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (F2 flagged the 0.577 ~ 1/sqrt3 coincidence)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION as SRC } from './imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96162/imp-96187 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited, no re-derivation) -- identical to imp-96187.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { E_flow, E_coll, E_N: E_trunc + E_flow + E_coll };
}
const sigmaOf = (N, E_trunc) => {
  const p = parts(N, E_trunc);
  return p.E_coll / p.E_N;
};

function peakN(E_trunc) {
  let bestN = 0;
  let bestS = -1;
  for (let k = 3; k <= 9; k += 0.001) {
    const N = Math.pow(10, k);
    const s = sigmaOf(N, E_trunc);
    if (s > bestS) {
      bestS = s;
      bestN = N;
    }
  }
  return bestN;
}
function nFlow(E_trunc) {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid, E_trunc).E_flow > E_trunc) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
function ratioAtScale(scale) {
  const Et = E_TRUNC_PT * scale;
  return peakN(Et) / nFlow(Et);
}

const ONE_OVER_SQRT3 = 1 / Math.sqrt(3);

// Fine log-spaced sweep of the E_trunc scale factor, 0.2x .. 20x, for a smooth curve (imp-96187 F3
// used only 6 points: 0.25, 0.5, 1, 2, 4, 16).
const SCALE_STEPS = 24;
const LN_LO = Math.log(0.2);
const LN_HI = Math.log(20);
export const IMP96316_SWEEP = Object.freeze(
  Array.from({ length: SCALE_STEPS + 1 }, (_, i) => {
    const scale = Math.exp(LN_LO + (LN_HI - LN_LO) * (i / SCALE_STEPS));
    return Object.freeze({ scale, ratio: ratioAtScale(scale) });
  }),
);

// Bisect (in log-scale) for the exact E_trunc-scale multiplier where the ratio crosses 1/sqrt(3).
let sLo = 0.2;
let sHi = 20;
for (let i = 0; i < 50; i++) {
  const mid = Math.sqrt(sLo * sHi);
  if (ratioAtScale(mid) > ONE_OVER_SQRT3) sLo = mid;
  else sHi = mid;
}
const CROSSING_SCALE = Math.sqrt(sLo * sHi);
const RATIO_AT_1X = ratioAtScale(1);

export const IMP96316_SUMMARY = Object.freeze({
  one_over_sqrt3: ONE_OVER_SQRT3,
  ratio_at_1x: RATIO_AT_1X,
  crossing_scale: CROSSING_SCALE,
  ratio_at_low: IMP96316_SWEEP[0].ratio,
  ratio_at_high: IMP96316_SWEEP[SCALE_STEPS].ratio,
  scale_at_low: IMP96316_SWEEP[0].scale,
  scale_at_high: IMP96316_SWEEP[SCALE_STEPS].scale,
});

export const IMP96316_CAVEAT_BANNER =
  'Presentation only: recomputes the imp-96187 F3 N_peak/N_flow vs E_trunc-scale sensitivity sweep ' +
  'from the identical inherited component model (Gronwall E_flow, GUE-conditional C_C_PINNED E_coll, ' +
  'E_trunc scaled from its fixed-strip value) at a finer grid purely to expose the smooth crossing for ' +
  'charting -- no new derivation. The 1/sqrt(3) proximity is a crossing point, not a fixed point: ' +
  'nothing pins N_peak/N_flow there. The C_mb GUE-conditional share (imp-486) stays GUE-conditional and ' +
  'UNTOUCHED; changes no bound; establishes no operator positivity; no RH claim; no refereed bound is changed' +
  '; NO QED.';

export const IMP96316_ASSERTIONS = [
  {
    id: 'imp96316-endpoints-match-imp96187-landmarks',
    description:
      'ratio at scale=1 and the coarse-sweep endpoints reproduce the frozen imp-96187 landmarks to 5e-3',
    holds: () =>
      Math.abs(RATIO_AT_1X - SRC.landmarks.peak_over_N_flow_measured) < 5e-3 &&
      Math.abs(SRC.sensitivity.ratio_at_quarter - ratioAtScale(0.25)) < 5e-3 &&
      Math.abs(SRC.sensitivity.ratio_at_16x - ratioAtScale(16)) < 5e-3,
  },
  {
    id: 'imp96316-monotone-and-straddles',
    description:
      'ratio decreases monotonically across the fine sweep and straddles 1/sqrt(3) partway through, no plateau',
    holds: () => {
      let monotone = true;
      for (let i = 1; i < IMP96316_SWEEP.length; i++) {
        if (IMP96316_SWEEP[i].ratio >= IMP96316_SWEEP[i - 1].ratio) monotone = false;
      }
      return (
        monotone &&
        IMP96316_SWEEP[0].ratio > ONE_OVER_SQRT3 &&
        IMP96316_SWEEP[SCALE_STEPS].ratio < ONE_OVER_SQRT3 &&
        CROSSING_SCALE > IMP96316_SWEEP[0].scale &&
        CROSSING_SCALE < IMP96316_SWEEP[SCALE_STEPS].scale
      );
    },
  },
  {
    id: 'imp96316-honesty-gate-no-qed',
    description: 'caveat banner keeps the GUE-conditional / no-bound / NO QED guardrail',
    holds: () =>
      /GUE-conditional/.test(IMP96316_CAVEAT_BANNER) &&
      /NO QED/.test(IMP96316_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP96316_CAVEAT_BANNER),
  },
];

for (const a of IMP96316_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96316-etrunc-sensitivity-viz-data assertion failed: ${a.id}`);
  }
}
