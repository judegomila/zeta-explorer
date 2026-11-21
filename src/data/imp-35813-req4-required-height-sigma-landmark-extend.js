/**
 * @module imp-35813-req4-required-height-sigma-landmark-extend
 *
 * imp-35813 (numerical, measurement): EXTEND the imp-35763 REQ-4 required-height
 * ladder with three ADDITIONAL imp-33582 sigma-decay landmarks (sigma < 0.99, 0.75,
 * 0.25) to further populate the peak-to-PT interior. imp-35763 filled the imp-35722
 * three-rung ladder (peak / crossover / PT anchor) with the sigma < 0.9/0.5/0.1
 * downslope crossings but left wide gaps between those rungs. This module reads the
 * intermediate downslope heights and forms the SAME required-height multiple
 * 200 / log T0 (the factor by which a landmark log-height must grow to reach the
 * imp-35538 REQ-4 binding log-height log T0 >= 200, T0 >= e^200 ~ 7.23e86, an
 * O(1/log T0) route-(i) remainder needs to meet the 0.5% crossover budget) and the
 * residual gap 200 - log T0, on the shared imp-3220/imp-3406 Riemann-von Mangoldt
 * surrogate log T0 = log(effectiveHeightForN(N)).
 *
 * WHAT THIS MODULE MEASURES. It replicates the EXACT inherited imp-3406/imp-3529/
 * imp-33582 sub-terms (sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the identical
 * C_C_PINNED / E_trunc / Gronwall constants) and locates the downslope N at which
 * sigma first drops below 0.99, 0.75, 0.25, then forms the required-height columns:
 *   - sigma < 0.99: DEGENERATE. The imp-33582/imp-3406 interior peak sigma_max ~ 0.9494
 *     never reaches 0.99, so there is no downslope crossing below 0.99; the bisection
 *     pins to the peak N ~ 9.22e5 (log T0 ~ 13.23, multiple ~ 15.12x), i.e. the
 *     sigma < 0.99 landmark COINCIDES with the imp-35722 peak rung -- it cannot
 *     populate the interior. An honest boundary finding, not a new interior rung.
 *   - sigma < 0.75 (N ~ 3.17e8):  log T0 ~ 18.65, multiple ~ 10.72x  (NEW interior rung)
 *   - sigma < 0.25 (N ~ 3.26e10): log T0 ~ 23.04, multiple ~  8.68x  (NEW interior rung)
 * Merged with the imp-35763 filled ladder the two genuine new rungs interleave cleanly
 * and monotonically between the existing sigma rungs:
 *   peak(13.23,15.12) < s0.9(16.30,12.27) < s0.75(18.65,10.72) < cross~s0.5(20.85,9.59)
 *   < s0.25(23.04,8.68) < s0.1(25.22,7.93) < PT(28.73,6.96).
 * Even the deepest new interior rung (sigma < 0.25, log T0 ~ 23.04) still needs ~8.7x
 * more log-height, so no reachable interior landmark binds the natural rate either.
 *
 * Measurement only; re-reads the imp-33582 model and the imp-35763/imp-35722/imp-35538
 * log-heights and forms new ratio columns on the same surrogate; derives no remainder;
 * discharges nothing; changes no bound; establishes no operator positivity; C_C =
 * (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35763-req4-required-height-sigma-landmark-fill (the 6-rung filled ladder this extends)
 * @see imp-35722-req4-required-height-landmark-ladder (the base peak/crossover/PT ladder)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL } from './imp-35763-req4-required-height-sigma-landmark-fill.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// The REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200, inherited from imp-35538.
const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// EXACT imp-3406/imp-3529/imp-33582 sub-terms (no re-derivation, no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior peak: sign-of-derivative bisection in log N (reproduces imp-33582 N ~ 9.22e5).
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
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
const N_PEAK = locatePeak(); // ~9.218633e5
const SIGMA_MAX = sigma(N_PEAK); // ~0.949429

// Downslope threshold crossing (N > N_peak): first N with sigma below thr. When thr exceeds
// SIGMA_MAX no crossing exists and the bisection pins to N_peak (the degenerate sigma<0.99 case).
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The three additional near-peak thresholds requested by imp-35813.
const NEW_THRESHOLDS = [0.99, 0.75, 0.25];

const extendLadder = NEW_THRESHOLDS.map((thr) => {
  const N = crossBelow(thr);
  const logT0 = Math.log(effectiveHeightForN(N));
  // sigma<0.99 is unreachable (SIGMA_MAX ~ 0.9494 < 0.99): the crossing pins to the peak.
  const degenerate = thr > SIGMA_MAX;
  return {
    key: `sigma${String(thr).replace('.', '_')}`,
    label: `sigma<${thr} downslope`,
    threshold: thr,
    N: +N.toExponential(4),
    sigmaAtCross: +sigma(N).toFixed(4),
    logT0: +logT0.toFixed(4),
    requiredMultiple: +(LOG_T0_NEEDED / logT0).toFixed(4),
    logHeightGap: +(LOG_T0_NEEDED - logT0).toFixed(4),
    degenerate, // true only for sigma<0.99, which coincides with the imp-35722 peak rung
  };
});

const S0_99 = extendLadder.find((r) => r.threshold === 0.99);
const S0_75 = extendLadder.find((r) => r.threshold === 0.75);
const S0_25 = extendLadder.find((r) => r.threshold === 0.25);

// The imp-35763 six-rung filled ladder (peak, s0.9, cross, s0.5, s0.1, PT).
const filledLadder = IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL.filledLadder;

// Only the two genuine new interior rungs (drop the degenerate sigma<0.99) are merged.
const newInteriorRungs = extendLadder
  .filter((r) => !r.degenerate)
  .map((r) => ({ key: r.key, label: r.label, logT0: r.logT0, requiredMultiple: r.requiredMultiple, source: 'imp-35813' }));

const extendedLadder = [
  ...filledLadder.map((r) => ({ key: r.key, label: r.label, logT0: r.logT0, requiredMultiple: r.requiredMultiple, source: r.source })),
  ...newInteriorRungs,
].sort((a, b) => a.logT0 - b.logT0);

export const IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND = {
  id: 'imp-35813',
  proofSection: 'S-frontier',
  question:
    'Extending the imp-35763 REQ-4 required-height ladder with the additional imp-33582 sigma-decay downslope ' +
    'landmarks (sigma < 0.99/0.75/0.25), by what multiple (200 / log T0) must each intermediate log-height grow to ' +
    'reach the imp-35538 REQ-4 binding log-height log T0 >= 200 (T0 >= e^200 ~ 7.23e86)?',
  method:
    'Replicate the exact imp-3406/imp-33582 sub-terms (sigma = E_coll/(E_trunc + E_flow + E_coll)), locate the ' +
    'downslope N at which sigma first drops below 0.99, 0.75, 0.25, and form log T0 = log(effectiveHeightForN(N)) via ' +
    'the same imp-3220/imp-3406 RvM surrogate, then the required-height multiple 200 / log T0 and residual gap ' +
    '200 - log T0; merge the two genuine new interior rungs with the imp-35763 six-rung filled ladder, sorted ' +
    'ascending in log-height.',
  logT0Needed: LOG_T0_NEEDED, // 200
  T0Needed: HR.T0Needed, // ~7.23e86
  sigmaMax: +SIGMA_MAX.toFixed(6), // ~0.949429 (why sigma<0.99 has no downslope crossing)
  // sigma<0.99 is unreachable: the interior peak never reaches 0.99, so it coincides with the peak rung.
  sigma0_99Degenerate: S0_99.degenerate, // true
  sigma0_99Multiple: S0_99.requiredMultiple, // ~15.12 (== imp-35722 peak rung)
  sigma0_75Multiple: S0_75.requiredMultiple, // ~10.72 (NEW interior rung)
  sigma0_25Multiple: S0_25.requiredMultiple, // ~8.68 (NEW interior rung)
  extendLadder,
  extendedLadder,
  // Even the deepest new interior rung still needs > 1x log-height (no interior landmark binds the natural rate).
  evenDeepestInteriorFallsShort: S0_25.requiredMultiple > 1,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-35763 REQ-4 required-height ladder with the additional imp-33582 ' +
    'sigma-decay downslope landmarks: the sigma < 0.99 landmark is DEGENERATE -- the imp-33582/imp-3406 interior peak ' +
    'sigma_max ~ 0.9494 never reaches 0.99, so there is no downslope crossing and it coincides with the imp-35722 ' +
    'peak rung (log T0 ~ 13.23, ~15.12x). The two genuine new interior rungs are sigma < 0.75 (log T0 ~ 18.65, ' +
    'N ~ 3.17e8, ~10.72x) and sigma < 0.25 (log T0 ~ 23.04, N ~ 3.26e10, ~8.68x). Merged with the imp-35763 rungs ' +
    '(peak ~15.12x, s0.9 ~12.27x, cross ~9.59x, s0.5 ~9.59x, s0.1 ~7.93x, PT ~6.96x) the ladder interleaves cleanly ' +
    'and descends monotonically in the multiple as log-height grows. Even the deepest new interior rung ' +
    '(sigma < 0.25) still needs ~8.7x more log-height, so no reachable interior landmark binds the natural rate. ' +
    'Re-reads the imp-33582 model and the imp-35763/imp-35722/imp-35538 log-heights on the same surrogate; derives ' +
    'no remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a ' +
    'stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35763 (six-rung filled REQ-4 required-height ladder extended here); imp-35722 (base peak/crossover/PT ' +
    'ladder); imp-35538 (REQ 4; binding log-height 200); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); ' +
    'imp-3220/imp-3406 (RvM surrogate log-height); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc ' +
    'floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian ' +
    '2021 (Lambda <= 0.2).',
};

export const IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND_ASSERTIONS = [
  {
    // (1) the model reproduces the imp-33582 interior peak sigma_max ~ 0.9494 (identical sub-terms).
    id: 'imp35813-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5, sigma_max ~ 0.9494 -- confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.9494) < 5e-4,
  },
  {
    // (2) sigma<0.99 is degenerate: no downslope crossing, pins to the peak (~15.12x), coincides with peak rung.
    id: 'imp35813-sigma99-degenerate-at-peak',
    description: 'sigma<0.99 has no downslope crossing (thr > sigma_max): pins to N_peak, multiple ~15.12x = imp-35722 peak rung',
    holds: () => {
      const peakRung = filledLadder.find((r) => r.key === 'peak');
      return (
        S0_99.degenerate === true &&
        S0_99.threshold > SIGMA_MAX &&
        Math.abs(S0_99.N / (+N_PEAK.toExponential(4)) - 1) < 1e-3 &&
        Math.abs(S0_99.requiredMultiple - peakRung.requiredMultiple) < 0.05
      );
    },
  },
  {
    // (3) each genuine new rung satisfies multiple = 200/log T0, gap = 200 - log T0, sigma at cross ~ threshold.
    id: 'imp35813-new-rungs-internally-consistent',
    description: 'sigma<0.75 and sigma<0.25 satisfy requiredMultiple * logT0 ~ 200, gap = 200 - logT0, sigma(N_cross) ~ threshold',
    holds: () =>
      [S0_75, S0_25].every(
        (row) =>
          Math.abs(row.requiredMultiple * row.logT0 - 200) < 0.02 &&
          Math.abs(row.logHeightGap - (200 - row.logT0)) < 1e-4 &&
          Math.abs(row.sigmaAtCross - row.threshold) < 1e-3 &&
          row.degenerate === false,
      ),
  },
  {
    // (4) the two new rungs interleave: s0.75 between imp-35763 s0.9 and s0.5, s0.25 between s0.5 and s0.1.
    id: 'imp35813-new-rungs-interleave-imp35763',
    description: 'sigma<0.75 logT0 lies between the imp-35763 s0.9 and s0.5 rungs; sigma<0.25 between s0.5 and s0.1',
    holds: () => {
      const s0_9 = filledLadder.find((r) => r.key === 'sigma0_9');
      const s0_5 = filledLadder.find((r) => r.key === 'sigma0_5');
      const s0_1 = filledLadder.find((r) => r.key === 'sigma0_1');
      return (
        S0_75.logT0 > s0_9.logT0 && S0_75.logT0 < s0_5.logT0 &&
        S0_25.logT0 > s0_5.logT0 && S0_25.logT0 < s0_1.logT0
      );
    },
  },
  {
    // (5) the merged extended ladder ascends in log-height and descends in the required multiple, 8 rungs.
    id: 'imp35813-extended-ladder-monotone',
    description: 'the merged 8-rung ladder ascends in logT0 and descends in requiredMultiple; deepest new rung has multiple > 1',
    holds: () => {
      const ascendingHeight = extendedLadder.every((row, i) => i === 0 || row.logT0 > extendedLadder[i - 1].logT0);
      const descendingMultiple = extendedLadder.every((row, i) => i === 0 || row.requiredMultiple < extendedLadder[i - 1].requiredMultiple);
      return (
        extendedLadder.length === 8 &&
        ascendingHeight && descendingMultiple &&
        S0_25.requiredMultiple > 1 &&
        IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND.evenDeepestInteriorFallsShort === true
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35813-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND;
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

for (const a of IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35813-req4-required-height-sigma-landmark-extend assertion failed: ${a.id}`);
  }
}
