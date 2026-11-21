/**
 * @module imp-35763-req4-required-height-sigma-landmark-fill
 *
 * imp-35763 (numerical, measurement): FILL the interior of the imp-35722 REQ-4
 * required-height ladder with intermediate imp-33582 sigma-decay landmarks. The
 * imp-35722 ladder tabulates the REQ-4 required-height multiple 200 / log T0 (the
 * factor by which a landmark log-height must grow to reach the imp-35538 REQ-4
 * binding height log T0 >= 200, T0 >= e^200 ~ 7.23e86, an O(1/log T0) route-(i)
 * remainder needs to meet the 0.5% crossover budget) at only THREE rungs:
 *   - sigma-peak      (N ~ 9.22e5): log T0 ~ 13.23, multiple ~ 15.12x
 *   - E_coll=E_trunc  (N ~ 3.28e9): log T0 ~ 20.86, multiple ~  9.59x
 *   - Platt-Trudgian  (T0 = 3e12) : log T0 ~ 28.73, multiple ~  6.96x
 * leaving the wide interior between the sigma-peak and the PT anchor unpopulated.
 *
 * WHAT THIS MODULE MEASURES. It reads the three imp-33582 sigma-decay threshold
 * crossings -- the downslope heights at which the conditional share sigma(N) =
 * E_coll/E(N) first drops below 0.9, 0.5, 0.1 (N ~ 2.57e7, ~3.27e9, ~3.21e11) --
 * and, via the SAME imp-3220/imp-3406 Riemann-von Mangoldt surrogate log-height
 * log T0 = log(effectiveHeightForN(N)) that imp-35722/imp-35538 use, forms the
 * required-height multiple 200 / log T0 and the residual gap 200 - log T0 at each,
 * producing the intermediate rungs:
 *   - sigma < 0.9  (N ~ 2.57e7):  log T0 ~ 16.30, multiple ~ 12.27x  (NEW rung)
 *   - sigma < 0.5  (N ~ 3.27e9):  log T0 ~ 20.85, multiple ~  9.59x  (~coincides with the crossover rung)
 *   - sigma < 0.1  (N ~ 3.21e11): log T0 ~ 25.22, multiple ~  7.93x  (NEW rung)
 * Merged into the imp-35722 ladder they interleave cleanly and monotonically:
 * peak(13.23,15.12) < s0.9(16.30,12.27) < cross(20.86,9.59) ~ s0.5(20.85,9.59)
 * < s0.1(25.22,7.93) < PT(28.73,6.96). The sigma=0.5 rung landing on the crossover
 * rung is the imp-33582 F3 consistency check (sigma = 1/2 lands at the imp-3444
 * E_coll = E_trunc crossover) re-expressed on the required-height axis. Even the
 * deepest new interior rung (sigma < 0.1, log T0 ~ 25.22) still needs ~7.9x more
 * log-height, so no reachable interior landmark binds the natural rate either.
 *
 * Measurement only; re-reads the imp-33582 threshold crossings and the imp-35722 /
 * imp-35538 log-heights and forms new ratio columns on the same surrogate; derives
 * no remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays
 * OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35722-req4-required-height-landmark-ladder (the three-rung ladder this fills the interior of)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; source of the binding log-height 200 and the peak/cross/PT rungs)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source of the sigma < 0.9/0.5/0.1 downslope heights)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, the shared surrogate)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER } from './imp-35722-req4-required-height-landmark-ladder.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const TC = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.thresholdCrossings;

// The REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200, inherited from imp-35538.
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// The three imp-33582 sigma-decay downslope heights (N at which sigma first drops below the threshold).
const SIGMA_LANDMARKS = [
  { key: 'sigma0_9', label: 'sigma<0.9 downslope (N~2.57e7)', N: TC.sigma_below_0_9_at_N, sigma: 0.9 },
  { key: 'sigma0_5', label: 'sigma<0.5 downslope (N~3.27e9)', N: TC.sigma_below_0_5_at_N, sigma: 0.5 },
  { key: 'sigma0_1', label: 'sigma<0.1 downslope (N~3.21e11)', N: TC.sigma_below_0_1_at_N, sigma: 0.1 },
];

// New interior rungs: the same 200 / log T0 required-height multiple, on the same RvM surrogate.
const sigmaLadder = SIGMA_LANDMARKS.map((lm) => {
  const logT0 = Math.log(effectiveHeightForN(lm.N));
  return {
    key: lm.key,
    label: lm.label,
    sigma: lm.sigma,
    N: +lm.N.toExponential(4),
    logT0: +logT0.toFixed(4),
    requiredMultiple: +(LOG_T0_NEEDED / logT0).toFixed(4),
    logHeightGap: +(LOG_T0_NEEDED - logT0).toFixed(4),
  };
});

// The imp-35722 three-rung ladder (peak, crossover, PT anchor).
const baseLadder = IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER.ladder;

// Merge base + new interior rungs and sort ascending in log-height for the filled ladder.
const filledLadder = [
  ...baseLadder.map((r) => ({ key: r.key, label: r.label, logT0: r.logT0, requiredMultiple: r.requiredMultiple, source: 'imp-35722' })),
  ...sigmaLadder.map((r) => ({ key: r.key, label: r.label, logT0: r.logT0, requiredMultiple: r.requiredMultiple, source: 'imp-33582' })),
].sort((a, b) => a.logT0 - b.logT0);

const S0_9 = sigmaLadder.find((r) => r.key === 'sigma0_9');
const S0_5 = sigmaLadder.find((r) => r.key === 'sigma0_5');
const S0_1 = sigmaLadder.find((r) => r.key === 'sigma0_1');

export const IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL = {
  id: 'imp-35763',
  proofSection: 'S-frontier',
  question:
    'Filling the interior of the imp-35722 three-rung REQ-4 required-height ladder with the imp-33582 sigma-decay ' +
    'downslope landmarks (sigma < 0.9/0.5/0.1), by what multiple (200 / log T0) must each intermediate log-height ' +
    'grow to reach the imp-35538 REQ-4 binding log-height log T0 >= 200 (T0 >= e^200 ~ 7.23e86)?',
  method:
    'Read the imp-33582 sigma-decay threshold crossings (N at which sigma = E_coll/E(N) first drops below 0.9, 0.5, ' +
    '0.1) and form log T0 = log(effectiveHeightForN(N)) via the same imp-3220/imp-3406 Riemann-von Mangoldt surrogate ' +
    'imp-35722/imp-35538 use, then the required-height multiple 200 / log T0 and residual gap 200 - log T0 at each; ' +
    'merge with the imp-35722 peak/crossover/PT rungs sorted ascending in log-height.',
  logT0Needed: LOG_T0_NEEDED, // 200
  T0Needed: HR.T0Needed, // ~7.23e86
  sigma0_9Multiple: S0_9.requiredMultiple, // ~12.27 (NEW interior rung)
  sigma0_5Multiple: S0_5.requiredMultiple, // ~9.59 (~coincides with the crossover rung, imp-33582 F3)
  sigma0_1Multiple: S0_1.requiredMultiple, // ~7.93 (NEW interior rung)
  sigmaLadder,
  filledLadder,
  // The sigma=0.5 rung lands on the crossover rung (imp-33582 F3: sigma = 1/2 at the imp-3444 crossover).
  sigma0_5MatchesCrossover:
    Math.abs(S0_5.requiredMultiple - IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER.crossMultiple) < 0.05,
  // Even the deepest new interior rung still needs > 1x the log-height (no interior landmark binds the natural rate).
  evenDeepestInteriorFallsShort: S0_1.requiredMultiple > 1,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Filling the interior of the imp-35722 REQ-4 required-height ladder with the ' +
    'imp-33582 sigma-decay downslope landmarks: the binding log-height log T0 >= 200 (T0 >= e^200 ~ 7.23e86) that an ' +
    'O(1/log T0) route-(i) remainder needs is ~12.27x the sigma<0.9 log-height (~16.30, N~2.57e7), ~9.59x the ' +
    'sigma<0.5 log-height (~20.85, N~3.27e9), and ~7.93x the sigma<0.1 log-height (~25.22, N~3.21e11). Merged with ' +
    'the imp-35722 peak (~15.12x), crossover (~9.59x) and PT (~6.96x) rungs the ladder interleaves cleanly and ' +
    'descends monotonically in the multiple as log-height grows; the sigma=0.5 rung lands on the crossover rung ' +
    '(the imp-33582 F3 sigma = 1/2 at the imp-3444 E_coll = E_trunc crossover, re-expressed on the required-height ' +
    'axis). Even the deepest new interior rung (sigma<0.1) still needs ~7.9x more log-height, so no reachable ' +
    'interior landmark binds the natural rate. Re-reads the imp-33582 threshold crossings and the imp-35722/imp-35538 ' +
    'log-heights on the same surrogate; derives no remainder; discharges nothing; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35722 (three-rung REQ-4 required-height ladder filled here); imp-35538 (REQ 4; binding log-height 200); ' +
    'imp-33582 (sigma < 0.9/0.5/0.1 downslope heights); imp-3220/imp-3406 (RvM surrogate log-height); imp-3444 ' +
    '(E_coll = E_trunc crossover); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL_ASSERTIONS = [
  {
    // (1) each new interior rung satisfies multiple = 200 / log T0 and gap = 200 - log T0 on the shared surrogate.
    id: 'imp35763-sigma-rungs-internally-consistent',
    description: 'each sigma rung satisfies requiredMultiple * logT0 ~ 200, logHeightGap = 200 - logT0, logT0 = log(effectiveHeightForN(N))',
    holds: () =>
      sigmaLadder.length === 3 &&
      sigmaLadder.every((row) => {
        const lm = SIGMA_LANDMARKS.find((s) => s.key === row.key);
        const logT0 = Math.log(effectiveHeightForN(lm.N));
        return (
          Math.abs(row.requiredMultiple * row.logT0 - 200) < 0.02 &&
          Math.abs(row.logHeightGap - (200 - row.logT0)) < 1e-4 &&
          Math.abs(row.logT0 - logT0) < 1e-4
        );
      }),
  },
  {
    // (2) the new rungs fall strictly INSIDE the imp-35722 peak..PT log-height span (they fill the interior).
    id: 'imp35763-rungs-interior-to-peak-and-pt',
    description: 'the sigma < 0.9/0.5/0.1 log-heights lie strictly between the imp-35722 peak (~13.23) and PT anchor (~28.73)',
    holds: () => {
      const peakLog = baseLadder.find((r) => r.key === 'peak').logT0;
      const ptLog = baseLadder.find((r) => r.key === 'pt').logT0;
      return sigmaLadder.every((row) => row.logT0 > peakLog && row.logT0 < ptLog);
    },
  },
  {
    // (3) the sigma=0.5 rung reproduces the imp-35722 crossover multiple (imp-33582 F3 sigma = 1/2 at the crossover).
    id: 'imp35763-sigma-half-matches-crossover',
    description: 'the sigma<0.5 rung multiple ~9.59 reproduces the imp-35722 crossover multiple (imp-33582 F3 consistency)',
    holds: () =>
      Math.abs(S0_5.requiredMultiple - IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER.crossMultiple) < 0.05 &&
      IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL.sigma0_5MatchesCrossover === true,
  },
  {
    // (4) the merged filled ladder ascends in log-height and descends in the required multiple, and has 6 rungs.
    id: 'imp35763-filled-ladder-monotone',
    description: 'the merged 6-rung ladder ascends in logT0 and descends in requiredMultiple; even the deepest interior rung has multiple > 1',
    holds: () => {
      const ascendingHeight = filledLadder.every((row, i) => i === 0 || row.logT0 > filledLadder[i - 1].logT0);
      const descendingMultiple = filledLadder.every((row, i) => i === 0 || row.requiredMultiple < filledLadder[i - 1].requiredMultiple);
      return (
        filledLadder.length === 6 &&
        ascendingHeight && descendingMultiple &&
        S0_1.requiredMultiple > 1 &&
        IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL.evenDeepestInteriorFallsShort === true
      );
    },
  },
  {
    // (5) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35763-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35763-req4-required-height-sigma-landmark-fill assertion failed: ${a.id}`);
  }
}
