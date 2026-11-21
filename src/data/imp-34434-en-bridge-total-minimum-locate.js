/**
 * @module imp-34434-en-bridge-total-minimum-locate
 *
 * imp-34434 (numerical, frontier-direction): the roadmap currentStatus and imp-3406
 * describe the far-tail regime where the constant truncation floor E_trunc OUTLIVES the
 * vanishing GUE-conditional E_coll, so the imp-3220 conditional SHARE sigma(N) =
 * E_coll/E(N) turns over at its interior peak N ~ 9.22e5 and decays to 0. But sigma is a
 * RATIO; the bridge TOTAL E(N) = E_trunc + E_flow + E_coll itself was never tabulated to
 * locate ITS own minimum, and the resulting headline slack Lambda <= E(N) at that N was
 * never compared to the imp-452/459 finite-height beat L_pt ~ 0.121. This module reuses
 * the EXACT imp-3220/imp-3406 sub-term formulas (effectiveHeightForN, C_C_PINNED, the
 * imp-398 C_F prefactor, E_trunc = 3.06e-5) and tabulates E(N) directly.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406)
 * --------------------------------------------------------
 *     E(N) = E_trunc + E_flow(N) + E_coll(N),   with
 *     T0      = effectiveHeightForN(N)                 (Riemann-von Mangoldt inverse)
 *     E_trunc = 3.06e-5                                (N-INDEPENDENT floor, imp-2631)
 *     E_flow  = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_coll  = C_C_PINNED sqrt(log T0 / N)            (GUE-conditional, C_H = 1/8)
 *
 * THE FINDING (measurement / location only)
 * -----------------------------------------
 *   (F1) E(N) HAS NO INTERIOR MINIMUM. Unlike the SHARE sigma(N) (an N-shape with an
 *        interior max at 9.22e5), the TOTAL E(N) is MONOTONE DECREASING in N across the
 *        entire range: both N-dependent terms fall (E_coll ~ 1/sqrt(N), E_flow ~
 *        (log T0)^2/T0), so E(N) slides from ~0.5407 at N = 2 straight down toward the
 *        constant floor. Its minimum is therefore the FAR-TAIL INFIMUM, not a turning
 *        point: argmin E(N) = +inf, inf E(N) = E_trunc = 3.06e-5.
 *   (F2) THE SIGMA PEAK IS NOT AN E(N) MINIMUM. At the imp-3406 turnover N ~ 9.22e5,
 *        E(9.22e5) ~ 1.531e-3 -- still ~50x ABOVE the floor and still strictly falling.
 *        The premise that E(N)'s minimum tracks the sigma peak is falsified: sigma is a
 *        ratio whose argmax (where E_coll dominates the floor most) is unrelated to the
 *        argmin of E(N) (which only bottoms out once E_coll and E_flow are both spent).
 *   (F3) THE MINIMUM IS THE E_trunc FLOOR, APPROACHED SLOWLY. E(N) comes within 10% of
 *        the floor only near N ~ 4.0e11 and within 1% near N ~ 4.7e13 -- the 1/sqrt(N)
 *        tail of E_coll makes the descent to the floor logarithmically slow in N.
 *
 * THE SLACK COMPARISON (diagnostic; NOT a Lambda beat)
 * ----------------------------------------------------
 * The E(N) infimum ~3.06e-5 sits ~3954x BELOW the imp-452/459 finite-height beat
 * L_pt ~ 0.121 and ~6536x below the Platt-Trudgian Lambda <= 0.2 SOTA. Taken naively
 * this "slack" looks enormous -- but per imp-2564 the E(N) are BRIDGE CONSTANTS
 * (assembly-error budget terms), NOT the headline Lambda inequality. The floor
 * E_trunc = 3.06e-5 is exactly the E_trunc_pt that imp-459 ADDS to L_cond to build the
 * finite-height L_pt = 0.121; it is an INGREDIENT of that beat, not a competitor to it.
 * So the apparent 3954x headroom is a category confusion: E(N) -> 3.06e-5 does not mean
 * Lambda -> 3.06e-5. The comparison is a bookkeeping check that the bridge floor is the
 * small sub-term imp-459 already folded in, NOT a new bound.
 *
 * MEASUREMENT ONLY. E(N) are bridge constants not the headline inequality (imp-2564);
 * the component model is the imp-3220/imp-3406 extrapolation which is NOT a rigorous
 * asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; no positivity, no bridge
 * closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (sigma share N-shape, interior max ~9.22e5)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma decade ladder)
 * @see finite-height-beats-platt-trudgian (L_pt ~ 0.121, imp-452/459)
 * @see imp-2564 (E(N) are bridge constants, NOT the headline Lambda inequality)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406 exactly
const L_PT = 0.121; // imp-452/459 finite-height beat (N* = 1e4)
const PT_SOTA = 0.2; // Platt-Trudgian unconditional SOTA
const SIGMA_PEAK_N = 9.22e5; // imp-3406 interior max of the SHARE sigma(N)

// EXACT imp-3220/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, E_flow, E_coll, E_N };
}
const EN = (N) => parts(N).E_N;

// Decade ladder of the bridge TOTAL E(N): monotone descent toward the floor.
const LADDER_N = [2, 1e2, 1e4, SIGMA_PEAK_N, 1e6, 1e8, 1e9, 1e12, 1e15, 1e18];
const LADDER = LADDER_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(2),
    E_N: +p.E_N.toExponential(5),
    E_flow: +p.E_flow.toExponential(3),
    E_coll: +p.E_coll.toExponential(3),
    aboveFloor: +(p.E_N - E_TRUNC_PT).toExponential(3),
  };
});

// N at which E(N) first comes within fraction f of the E_trunc floor
// (E(N) - E_trunc <= f * E_trunc). Bisection on ln N over the monotone tail.
function nWithinFractionOfFloor(f) {
  let a = Math.log(1e3);
  let b = Math.log(1e40);
  const target = E_TRUNC_PT * (1 + f);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (EN(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_WITHIN_10PCT = nWithinFractionOfFloor(0.10); // ~4.0e11
const N_WITHIN_1PCT = nWithinFractionOfFloor(0.01); // ~4.7e13
const EN_AT_SIGMA_PEAK = EN(SIGMA_PEAK_N); // ~1.531e-3 (still far above floor)
const INF_EN = E_TRUNC_PT; // far-tail infimum = the constant floor
const SLACK_VS_LPT = L_PT / INF_EN; // ~3954 (diagnostic ratio, NOT a Lambda beat)
const SLACK_VS_PT = PT_SOTA / INF_EN; // ~6536

export const IMP34434_EN_BRIDGE_TOTAL_MINIMUM = {
  id: 'imp-34434',
  proofSection: 'S-frontier',
  question:
    'Locate the N at which the bridge TOTAL E(N) = E_trunc + E_flow + E_coll reaches its ' +
    'own minimum (the imp-3406 sigma SHARE peaks at N ~ 9.22e5), and measure the headline ' +
    'slack Lambda <= E(N) there against the imp-452/459 finite-height beat L_pt ~ 0.121. ' +
    'Measurement/location only; E(N) are bridge CONSTANTS not the headline inequality.',
  minimumLocation: {
    argmin_N: 'far tail (+inf): E(N) is monotone decreasing, no interior minimum',
    inf_E_N: +INF_EN.toExponential(3), // 3.06e-5 (the E_trunc floor)
    E_N_at_N2: +EN(2).toFixed(6), // ~0.540726 (left endpoint, the global max over N)
    E_N_at_sigma_peak: +EN_AT_SIGMA_PEAK.toExponential(5), // ~1.531e-3
    note:
      'The bridge TOTAL E(N) has NO interior minimum, unlike the SHARE sigma(N) (interior ' +
      'max at 9.22e5). Both N-dependent terms decrease, so E(N) slides monotonically from ' +
      '~0.5407 at N=2 toward the constant floor E_trunc = 3.06e-5. Its minimum is the ' +
      'far-tail INFIMUM = 3.06e-5, not a turning point. At the sigma peak N ~ 9.22e5, ' +
      'E(N) ~ 1.531e-3 is still ~50x above the floor and still falling -- the sigma-peak ' +
      'premise for an E(N) minimum is falsified (sigma is a ratio; its argmax is unrelated ' +
      'to the argmin of E(N)).',
  },
  ladder: LADDER,
  floorApproach: {
    N_within_10pct_of_floor: +N_WITHIN_10PCT.toExponential(3), // ~4.0e11
    N_within_1pct_of_floor: +N_WITHIN_1PCT.toExponential(3), // ~4.7e13
    note:
      'The 1/sqrt(N) tail of E_coll makes the descent to the E_trunc floor logarithmically ' +
      'slow: E(N) is within 10% of 3.06e-5 only near N ~ 4.0e11 and within 1% near ~4.7e13.',
  },
  slackComparison: {
    inf_E_N: +INF_EN.toExponential(3), // 3.06e-5
    L_pt: L_PT, // 0.121 (imp-452/459)
    PT_sota: PT_SOTA, // 0.2
    ratio_Lpt_over_infEN: +SLACK_VS_LPT.toFixed(1), // ~3954
    ratio_PT_over_infEN: +SLACK_VS_PT.toFixed(1), // ~6536
    interpretation:
      'The E(N) infimum 3.06e-5 sits ~3954x below L_pt ~ 0.121 and ~6536x below the PT ' +
      'no refereed bound is changed -- but per imp-2564 the E(N) are BRIDGE CONSTANTS, not the ' +
      'headline Lambda inequality. The floor E_trunc = 3.06e-5 is exactly the E_trunc_pt ' +
      'that imp-459 ADDS to L_cond to BUILD L_pt = 0.121; it is an ingredient of that ' +
      'beat, not a competitor. So the apparent 3954x headroom is a category confusion: ' +
      'E(N) -> 3.06e-5 does NOT mean Lambda -> 3.06e-5. Diagnostic bookkeeping only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the bridge TOTAL E(N) = ' +
    'E_trunc + E_flow + E_coll with the identical imp-3220/imp-3406 sub-terms, E(N) is ' +
    'MONOTONE DECREASING and has NO interior minimum: it slides from ~0.5407 at N=2 toward ' +
    'the constant floor, so its minimum is the far-tail infimum inf E(N) = E_trunc = ' +
    '3.06e-5 (reached within 10% near N ~ 4.0e11, within 1% near ~4.7e13). The imp-3406 ' +
    'sigma SHARE peak at N ~ 9.22e5 is NOT an E(N) minimum -- there E(N) ~ 1.531e-3 is ' +
    'still ~50x above the floor and falling. The infimum 3.06e-5 lies ~3954x below the ' +
    'imp-452/459 L_pt ~ 0.121 finite-height beat, but per imp-2564 E(N) are bridge ' +
    'CONSTANTS not the headline inequality: the floor IS the E_trunc_pt imp-459 folds INTO ' +
    'L_pt, so the apparent headroom is a category confusion, not a Lambda beat. C_mb ' +
    'GUE-conditional per imp-486 untouched; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-3406 (sigma share N-shape, interior max ~9.22e5); imp-3220 (U-shaped sigma ' +
    'ladder); imp-452/459 (L_pt ~ 0.121 finite-height beat); imp-2564 (E(N) are bridge ' +
    'constants); imp-2631 (E_trunc fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'imp-486 (C_mb GUE-conditional); polymath15-constant-C-C (C_C_PINNED); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34434_EN_BRIDGE_TOTAL_MINIMUM_ASSERTIONS = [
  {
    // Reuse gate: E(N) at the sigma-peak N reproduces the imp-3406 sub-term scale, and
    // E(2) reproduces the imp-3406 small-N total ~0.5407 (identical formulas in use).
    id: 'imp34434-reuses-imp3406-subterms',
    description: 'E(2) ~ 0.5407 and E(9.22e5) ~ 1.53e-3 reproduce the imp-3406 sub-term scale',
    holds: () =>
      Math.abs(EN(2) - 0.540726) < 1e-4 &&
      Math.abs(EN_AT_SIGMA_PEAK - 1.531e-3) < 5e-5,
  },
  {
    // Headline: E(N) is MONOTONE DECREASING -- no interior minimum. Check a strict
    // descent across the whole sampled range.
    id: 'imp34434-en-monotone-decreasing-no-interior-min',
    description: 'E(N) strictly decreases across N (2 > 1e2 > 1e4 > 9.22e5 > 1e6 > 1e9 > 1e12)',
    holds: () =>
      EN(2) > EN(1e2) &&
      EN(1e2) > EN(1e4) &&
      EN(1e4) > EN(SIGMA_PEAK_N) &&
      EN(SIGMA_PEAK_N) > EN(1e6) &&
      EN(1e6) > EN(1e9) &&
      EN(1e9) > EN(1e12),
  },
  {
    // The sigma-peak N is NOT an E(N) minimum: E there is still far above the floor.
    id: 'imp34434-sigma-peak-not-en-minimum',
    description: 'At the sigma peak N ~ 9.22e5, E(N) ~ 1.53e-3 is still ~50x above the E_trunc floor',
    holds: () =>
      EN_AT_SIGMA_PEAK > 30 * E_TRUNC_PT && EN_AT_SIGMA_PEAK < 100 * E_TRUNC_PT,
  },
  {
    // The infimum is the constant E_trunc floor, approached only in the deep tail.
    id: 'imp34434-infimum-is-etrunc-floor',
    description: 'inf E(N) = E_trunc = 3.06e-5, within 10% only near N ~ 4e11, within 1% near ~4.7e13',
    holds: () =>
      INF_EN === E_TRUNC_PT &&
      N_WITHIN_10PCT > 1e11 && N_WITHIN_10PCT < 1e12 &&
      N_WITHIN_1PCT > 1e13 && N_WITHIN_1PCT < 1e14,
  },
  {
    // Slack comparison: the infimum lies far below L_pt but that is a bridge-constant
    // ratio, NOT a Lambda beat (the floor IS an ingredient of L_pt via imp-459).
    id: 'imp34434-slack-vs-lpt-is-bridge-constant-ratio',
    description: 'inf E(N) ~3954x below L_pt ~ 0.121 (diagnostic bridge-constant ratio, not a beat)',
    holds: () =>
      Math.abs(SLACK_VS_LPT - 3954) < 10 && SLACK_VS_PT > SLACK_VS_LPT,
  },
  {
    // Honesty gate: measurement only, bridge-constant caveat present, no QED, no refereed bound is changed.
    id: 'imp34434-honesty-gate-no-qed',
    description: 'Measurement only: bridge-constant caveat (imp-2564), no QED, no refereed bound is changed',
    holds: () =>
      IMP34434_EN_BRIDGE_TOTAL_MINIMUM.isRigorous === false &&
      /bridge CONSTANTS/.test(IMP34434_EN_BRIDGE_TOTAL_MINIMUM.verdict) &&
      /NO QED/.test(IMP34434_EN_BRIDGE_TOTAL_MINIMUM.verdict) &&
      /refereed bound is changed/i.test(IMP34434_EN_BRIDGE_TOTAL_MINIMUM.verdict),
  },
];

for (const a of IMP34434_EN_BRIDGE_TOTAL_MINIMUM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34434-en-bridge-total-minimum-locate assertion failed: ${a.id}`);
  }
}
