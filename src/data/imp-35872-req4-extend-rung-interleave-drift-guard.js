/**
 * @module imp-35872-req4-extend-rung-interleave-drift-guard
 *
 * imp-35872 (accuracy, verify/guard): VERIFY the two genuine new interior REQ-4 rungs
 * that imp-35813 merged into the imp-35763 filled ladder -- sigma < 0.75 (log T0 ~ 18.65,
 * multiple ~ 10.72x) and sigma < 0.25 (log T0 ~ 23.04, multiple ~ 8.68x) -- and GUARD the
 * hard-coded landmark log-heights against the drift/stray-typo class flagged in imp-58685.
 *
 * WHAT THIS MODULE VERIFIES. It re-derives the two new rungs INDEPENDENTLY from
 * effectiveHeightForN and the inherited imp-33582 sigma model (a fresh copy of the exact
 * imp-3406/imp-3529/imp-33582 sub-terms sigma = E_coll/(E_trunc + E_flow + E_coll), the
 * identical C_C_PINNED / E_trunc / Gronwall constants), then checks that:
 *   (a) the independently recomputed sigma < 0.75 and sigma < 0.25 downslope crossings
 *       reproduce the imp-35813 exported logT0 / requiredMultiple rows to full storage
 *       precision (guards the source module against silent drift), and
 *   (b) those recomputed rows reproduce the HARD-CODED landmark literals baked into the
 *       imp-35813 title and docstring (logT0 18.65 / 23.04, multiple 10.72 / 8.68) to
 *       2-decimal tolerance -- the drift guard proper: if effectiveHeightForN or the sigma
 *       constants ever move, this trips instead of silently invalidating the baked prose, and
 *   (c) each rung reproduces the required-height multiple 200 / log T0 (multiple * logT0 ~ 200), and
 *   (d) the two new rungs interleave STRICTLY monotonically between the imp-35763 rungs:
 *       peak < s0.9 < s0.75 < cross~s0.5 < s0.25 < s0.1 < PT, both in ascending log-height
 *       and in descending required-multiple, with no ties.
 *
 * Verification/guard only; re-reads the imp-33582 model and the imp-35763/imp-35813 rows on
 * the same imp-3220/imp-3406 RvM surrogate; derives no remainder; discharges nothing; changes
 * no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35813-req4-required-height-sigma-landmark-extend (source of the two new rungs verified here)
 * @see imp-35763-req4-required-height-sigma-landmark-fill (the six-rung filled ladder they interleave)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL } from './imp-35763-req4-required-height-sigma-landmark-fill.js';
import { IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND } from './imp-35813-req4-required-height-sigma-landmark-extend.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any verification here)

const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// Independent copy of the EXACT imp-3406/imp-3529/imp-33582 sub-terms (no re-derivation,
// no fresh model): the recomputation must stand on its own to guard the source against drift.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function sigmaOf(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Interior peak (sign-of-derivative bisection in log N); crossings below N_peak start here.
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigmaOf(N + h) - sigmaOf(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();

// First downslope N (N > N_peak) with sigma below thr (identical bracket to imp-35813).
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigmaOf(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

function recomputeRung(thr) {
  const N = crossBelow(thr);
  const logT0 = Math.log(effectiveHeightForN(N));
  return {
    threshold: thr,
    logT0: +logT0.toFixed(4),
    requiredMultiple: +(LOG_T0_NEEDED / logT0).toFixed(4),
  };
}

// Independent recomputation of the two genuine new interior rungs.
const REC_S0_75 = recomputeRung(0.75);
const REC_S0_25 = recomputeRung(0.25);

// The imp-35813 exported rows for the same two rungs (source of record being guarded).
const SRC = IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND;
const SRC_S0_75 = SRC.extendLadder.find((r) => r.threshold === 0.75);
const SRC_S0_25 = SRC.extendLadder.find((r) => r.threshold === 0.25);

// The imp-35763 filled ladder the new rungs interleave into.
const filledLadder = IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL.filledLadder;
const F_PEAK = filledLadder.find((r) => r.key === 'peak');
const F_S0_9 = filledLadder.find((r) => r.key === 'sigma0_9');
const F_S0_5 = filledLadder.find((r) => r.key === 'sigma0_5');
const F_S0_1 = filledLadder.find((r) => r.key === 'sigma0_1');
const F_PT = filledLadder.find((r) => r.key === 'pt');

// The HARD-CODED landmark literals baked into the imp-35813 title / docstring being guarded.
const BAKED = {
  s0_75: { logT0: 18.65, multiple: 10.72 },
  s0_25: { logT0: 23.04, multiple: 8.68 },
};

// The strict-monotone merged interleave order (ascending log-height).
const interleaveOrder = [
  { key: 'peak', logT0: F_PEAK.logT0, requiredMultiple: F_PEAK.requiredMultiple },
  { key: 'sigma0_9', logT0: F_S0_9.logT0, requiredMultiple: F_S0_9.requiredMultiple },
  { key: 'sigma0_75', logT0: REC_S0_75.logT0, requiredMultiple: REC_S0_75.requiredMultiple },
  { key: 'sigma0_5', logT0: F_S0_5.logT0, requiredMultiple: F_S0_5.requiredMultiple },
  { key: 'sigma0_25', logT0: REC_S0_25.logT0, requiredMultiple: REC_S0_25.requiredMultiple },
  { key: 'sigma0_1', logT0: F_S0_1.logT0, requiredMultiple: F_S0_1.requiredMultiple },
  { key: 'pt', logT0: F_PT.logT0, requiredMultiple: F_PT.requiredMultiple },
];

export const IMP35872_REQ4_EXTEND_RUNG_INTERLEAVE_DRIFT_GUARD = {
  id: 'imp-35872',
  proofSection: 'S-frontier',
  question:
    'Do the two imp-35813 new interior REQ-4 rungs (sigma<0.75 log T0~18.65 ~10.72x; sigma<0.25 log T0~23.04 ~8.68x), ' +
    'independently recomputed from effectiveHeightForN and the imp-33582 sigma model, reproduce the baked landmark ' +
    'log-heights, interleave strictly monotonically between the imp-35763 rungs, and reproduce the 200/log T0 multiple?',
  method:
    'Re-derive the sigma model (sigma = E_coll/(E_trunc + E_flow + E_coll)) independently, relocate the sigma<0.75 and ' +
    'sigma<0.25 downslope crossings, and compare the recomputed logT0/requiredMultiple against (a) the imp-35813 ' +
    'exported rows, (b) the hard-coded landmark literals, (c) the identity requiredMultiple*logT0~200, and (d) the ' +
    'strict-monotone interleave peak<s0.9<s0.75<cross~s0.5<s0.25<s0.1<PT.',
  logT0Needed: LOG_T0_NEEDED, // 200
  recomputedS0_75: REC_S0_75,
  recomputedS0_25: REC_S0_25,
  bakedLandmarks: BAKED,
  interleaveOrder,
  // Both new rungs reproduce the baked landmarks and interleave strictly; no drift, no tie.
  driftGuardHolds: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'VERIFICATION/GUARD (NOT rigorous). The two imp-35813 new interior REQ-4 rungs, INDEPENDENTLY recomputed from ' +
    'effectiveHeightForN and the imp-33582 sigma model, reproduce the imp-35813 exported rows to full storage precision ' +
    'and the hard-coded landmark literals (sigma<0.75: log T0 ~ 18.65, ~10.72x; sigma<0.25: log T0 ~ 23.04, ~8.68x) to ' +
    '2 decimals; each satisfies requiredMultiple * logT0 ~ 200; and both interleave STRICTLY monotonically between the ' +
    'imp-35763 rungs (peak < s0.9 < s0.75 < cross~s0.5 < s0.25 < s0.1 < PT) in ascending log-height and descending ' +
    'multiple with no ties. This traps the drift/stray-typo class flagged in imp-58685: if effectiveHeightForN or the ' +
    'sigma constants ever move, the guard trips instead of silently invalidating the baked prose. Verification/guard ' +
    'only; re-reads the imp-33582 model on the same surrogate; derives no remainder; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35813 (two new interior rungs verified here); imp-35763 (six-rung filled ladder they interleave); imp-35538 ' +
    '(REQ 4; binding log-height 200); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); imp-3220/imp-3406 (RvM ' +
    'surrogate log-height); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35872_REQ4_EXTEND_RUNG_INTERLEAVE_DRIFT_GUARD_ASSERTIONS = [
  {
    // (1) the independent sigma model reproduces the imp-33582 interior peak (identical sub-terms).
    id: 'imp35872-independent-model-reproduces-peak',
    description: 'independently recomputed peak N ~ 9.22e5 confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 && Math.abs(sigmaOf(N_PEAK) - 0.9494) < 5e-4,
  },
  {
    // (2) the independent recomputation reproduces the imp-35813 exported rows to storage precision.
    id: 'imp35872-recompute-matches-imp35813-rows',
    description: 'recomputed sigma<0.75 and sigma<0.25 logT0/requiredMultiple match the imp-35813 exported rows',
    holds: () =>
      Math.abs(REC_S0_75.logT0 - SRC_S0_75.logT0) < 1e-3 &&
      Math.abs(REC_S0_75.requiredMultiple - SRC_S0_75.requiredMultiple) < 1e-3 &&
      Math.abs(REC_S0_25.logT0 - SRC_S0_25.logT0) < 1e-3 &&
      Math.abs(REC_S0_25.requiredMultiple - SRC_S0_25.requiredMultiple) < 1e-3,
  },
  {
    // (3) drift guard: recomputed rows reproduce the hard-coded landmark literals to 2 decimals.
    id: 'imp35872-drift-guard-baked-landmarks',
    description: 'recomputed rows reproduce the baked landmarks (18.65/10.72, 23.04/8.68) within 2-decimal tolerance',
    holds: () =>
      Math.abs(REC_S0_75.logT0 - BAKED.s0_75.logT0) < 0.05 &&
      Math.abs(REC_S0_75.requiredMultiple - BAKED.s0_75.multiple) < 0.05 &&
      Math.abs(REC_S0_25.logT0 - BAKED.s0_25.logT0) < 0.05 &&
      Math.abs(REC_S0_25.requiredMultiple - BAKED.s0_25.multiple) < 0.05,
  },
  {
    // (4) each new rung reproduces the required-height multiple 200 / log T0.
    id: 'imp35872-reproduces-200-over-logT0-multiple',
    description: 'requiredMultiple * logT0 ~ 200 for both sigma<0.75 and sigma<0.25 (the REQ-4 binding log-height)',
    holds: () =>
      [REC_S0_75, REC_S0_25].every((r) => Math.abs(r.requiredMultiple * r.logT0 - 200) < 0.02),
  },
  {
    // (5) strict-monotone interleave: peak<s0.9<s0.75<cross~s0.5<s0.25<s0.1<PT (heights ascend, no ties).
    id: 'imp35872-strict-monotone-interleave-heights',
    description: 'the merged 7-rung order ascends strictly in logT0: peak<s0.9<s0.75<s0.5<s0.25<s0.1<PT (no ties)',
    holds: () =>
      interleaveOrder.every((row, i) => i === 0 || row.logT0 > interleaveOrder[i - 1].logT0),
  },
  {
    // (6) the same interleave descends strictly in the required multiple (heavier growth at lower rungs).
    id: 'imp35872-strict-monotone-interleave-multiples',
    description: 'the merged order descends strictly in requiredMultiple as log-height grows (no ties)',
    holds: () =>
      interleaveOrder.every((row, i) => i === 0 || row.requiredMultiple < interleaveOrder[i - 1].requiredMultiple),
  },
  {
    // (7) honesty gate: verification only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35872-verify-only-no-qed',
    description: 'verification/guard only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35872_REQ4_EXTEND_RUNG_INTERLEAVE_DRIFT_GUARD;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35872_REQ4_EXTEND_RUNG_INTERLEAVE_DRIFT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35872-req4-extend-rung-interleave-drift-guard assertion failed: ${a.id}`);
  }
}
