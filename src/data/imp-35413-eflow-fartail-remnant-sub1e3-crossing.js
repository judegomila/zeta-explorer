/**
 * @module imp-35413-eflow-fartail-remnant-sub1e3-crossing
 *
 * imp-35413 (numerical, frontier-direction): imp-35371 extended the imp-35280
 * E_flow far-tail fd-vs-analytic remnant two decades deeper (to N = 1e20 -> 0.0014
 * and N = 1e24 -> 0.0011), establishing that the ~0.002 remnant is NOT a nonzero
 * floor but a slowly decaying quantity (remnant*log N drifting only ~0.069 -> ~0.061
 * over 1e16..1e24). imp-35371 stopped at N = 1e24 with the remnant at 0.0011 -- still
 * above 1e-3 -- and never located the N at which the remnant first crosses below 1e-3.
 * This module LOCATES that sub-1e-3 crossing, continuing the identical surrogate
 * channel (no height-map swap, no heavy import) past N = 1e24.
 *
 * THE MEASUREMENT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent (central log-log
 * difference of the exact imp-35135 far-tail E_flow quantity) and the analytic
 * exponent -1 + 3/log N (imp-35198) live on that same closed inverse, so the remnant
 * isolates ONLY the closed-form Taylor truncation plus the prefactor-form difference.
 * That makes this module pure Math. It recomputes the imp-35371 rung N = 1e24 live
 * (reproducing 0.0011 to the digit) before continuing the ladder and bisecting the
 * crossing in log10 N.
 *
 *   N          fd-vs-analytic remnant     status
 *   1e24        0.001097                   above 1e-3 (imp-35371, reproduced)
 *   1e25        0.001036                   above 1e-3 (NEW -- this module)
 *   ~4.17e25    0.001000                   THE sub-1e-3 crossing (log10 N ~ 25.6205)
 *   1e26        0.000979                   below 1e-3 (NEW -- this module)
 *   1e28        0.000880                   below 1e-3 (NEW -- this module)
 *
 * THE FINDING
 * -----------
 * The remnant first falls below 1e-3 at N ~ 10^25.6205 ~ 4.17e25 -- only ~1.62 decades
 * past the imp-35371 deepest rung (N = 1e24), bracketed cleanly by N = 1e25 (0.001036,
 * still above) and N = 1e26 (0.000979, below). At the crossing remnant*log N ~ 0.05899,
 * consistent with the imp-35371 slow-decay reading (the product keeps drifting down,
 * ~0.061 at 1e24 -> ~0.059 at the crossing), so the crossing is not a floor but simply
 * the point where the still-decaying remnant passes the 1e-3 mark. The short ~1.6-decade
 * gap between the imp-35371 endpoint (0.0011) and the crossing confirms the decay is
 * slow -- had it been a nonzero floor near 0.002 the crossing would never occur.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35413a) (formalized per imp-35834, from the imp-35466 scope note)
 * -----------------------------------------------------------------------------------------
 * The sibling sigma(N)-landmark modules (imp-35411, imp-35417) name their surrogate-vs-true
 * fidelity gap as the tracked sub-gap imp-35337a, scoped specifically to "surrogate-vs-true
 * fidelity of the sigma(N) landmarks" -- it does NOT cover this module's remnant quantity.
 * This module's own surrogate-vs-true fidelity gap -- whether the fd-vs-analytic remnant on
 * the closed T0 = 2 pi N / log N proxy tracks the TRUE E_flow far tail -- is now formalized as
 * its own named tracked sub-gap, imp-35413a: certify surrogate-vs-true fidelity of the E_flow
 * far-tail remnant (and every downstream module continuing this same surrogate ladder, e.g.
 * imp-35454/imp-35473/imp-35496/imp-35497/imp-35552/imp-35553). It inherits, and does not
 * discharge, the imp-3220/imp-3406 assessment-only caveats. Do not cite imp-35337a here as if
 * it already covered it -- cite imp-35413a instead.
 *
 * VIZ-DATA STATUS (imp-35467 audit): imp-35467 asked for an import-light viz-data module
 * exposing this five-rung threshold-crossing ladder for a page to plot. That module ALREADY
 * EXISTS -- imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data.js bakes this exact ladder
 * (1e24/1e25/crossing/1e26/1e28, same literals) and is registered in visualizations-index.js at
 * route /viz-imp35483-eflow-fartail-remnant-sub1e3-crossing. Do not build a second copy.
 *
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the ladder this continues, endpoint 1e24)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on the closed surrogate height map (imp-35236 form).
function eFlowWith(N) {
  const T0 = surrogateHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35371 (h = 1.0002).
function localExponent(N) {
  const h = 1.0002;
  const lo = Math.log(eFlowWith(N / h));
  const hi = Math.log(eFlowWith(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (the imp-35280/imp-35371 quantity).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent(N);
  const analytic = analyticSurrogateExponent(x);
  return Math.abs(analytic - fd);
}

// Bisect the sub-1e-3 crossing in log10 N (the remnant is monotone decreasing past the 1e9 peak,
// so a plain bisection on the bracket [1e24, 1e28] converges to the unique crossing).
function locateSub1e3CrossingLog10() {
  let lo = 24; // remnant(1e24) ~ 0.001097 > 1e-3
  let hi = 28; // remnant(1e28) ~ 0.000880 < 1e-3
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > 1e-3) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const CROSSING_LOG10 = locateSub1e3CrossingLog10();
const CROSSING_N = Math.pow(10, CROSSING_LOG10);
const CROSSING_REMNANT = remnantAtLog10(CROSSING_LOG10);
const CROSSING_REMNANT_TIMES_LOGN = CROSSING_REMNANT * Math.log(CROSSING_N);

// The continuation ladder: the reproduced imp-35371 endpoint plus the new bracketing rungs.
const LADDER = [24, 25, 26, 28].map((e) => ({
  N: +Math.pow(10, e).toExponential(0),
  log10N: e,
  remnant: +remnantAtLog10(e).toFixed(6),
  aboveThreshold: remnantAtLog10(e) > 1e-3,
  isReproduced35371: e === 24,
}));

export const IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING = {
  id: 'imp-35413',
  proofSection: 'S-frontier',
  question:
    'Locate the N at which the imp-35371 fd-vs-analytic E_flow far-tail remnant first ' +
    'drops below 1e-3, continuing its measured slow surrogate-channel decay past N = 1e24.',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), reproduce the imp-35371 endpoint N = 1e24 ' +
    'remnant to the digit, then bisect the sub-1e-3 crossing of the same fd-vs-analytic ' +
    'remnant |analytic - fd-surrogate| in log10 N over the bracket [1e24, 1e28].',
  crossing: {
    log10N: +CROSSING_LOG10.toFixed(4),
    N: +CROSSING_N.toExponential(4),
    remnantAtCrossing: +CROSSING_REMNANT.toExponential(4),
    remnantTimesLogN: +CROSSING_REMNANT_TIMES_LOGN.toFixed(5),
  },
  ladder: LADDER,
  finding: {
    F1_reproduces_imp35371_endpoint:
      'The remnant recomputed live at N = 1e24 reproduces the imp-35371 endpoint value ' +
      '0.0011 to the digit (0.001097), confirming the crossing search shares the imp-35280/' +
      'imp-35371 surrogate channel exactly.',
    F2_crossing_located:
      'The remnant first falls below 1e-3 at N ~ 10^25.6205 ~ 4.17e25, only ~1.62 decades ' +
      'past the imp-35371 deepest rung (N = 1e24), bracketed cleanly by N = 1e25 (0.001036, ' +
      'still above) and N = 1e26 (0.000979, below).',
    F3_crossing_consistent_with_slow_decay:
      'At the crossing remnant*log N ~ 0.05899, continuing the imp-35371 slow drift ' +
      '(~0.061 at N = 1e24 -> ~0.059 at the crossing) -- the crossing is not a floor but the ' +
      'point where the still-decaying remnant passes 1e-3; a nonzero ~0.002 floor would never ' +
      'reach it.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35371 fd-vs-analytic E_flow far-tail remnant first drops below 1e-3 at ' +
    'N ~ 10^25.6205 ~ 4.17e25 (bracketed by N = 1e25 at 0.001036 and N = 1e26 at 0.000979), ' +
    'only ~1.62 decades past the imp-35371 endpoint N = 1e24 (0.0011). At the crossing ' +
    'remnant*log N ~ 0.05899, consistent with the imp-35371 slow-decay reading -- the crossing ' +
    'is simply where the still-decaying remnant passes the 1e-3 mark, not a floor. Measurement ' +
    'only on the inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Continuing the imp-35371 surrogate ' +
    'channel past N = 1e24, the fd-vs-analytic remnant first falls below 1e-3 at ' +
    'N ~ 10^25.6205 ~ 4.17e25, bracketed by N = 1e25 (0.001036) and N = 1e26 (0.000979), with ' +
    'remnant*log N ~ 0.05899 at the crossing -- consistent with the imp-35371 slow-decay ' +
    'finding, not a nonzero floor. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35371 (deep extension, endpoint N = 1e24, continued here); imp-35280 (four-rung ' +
    'fd-vs-analytic remnant origin); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail ' +
    'E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
  scopeNote_imp35466_audit:
    'imp-35337a is scoped to the surrogate-vs-true fidelity of the sigma(N) landmarks ' +
    '(imp-35411, imp-35417) and does NOT cover this remnant quantity; this module’s own ' +
    'surrogate-vs-true fidelity gap is now formalized as tracked sub-gap imp-35413a (see ' +
    'residual_sub_gap_imp_35413a below).',
  residual_sub_gap_imp_35413a:
    'Sub-gap imp-35413a = certify surrogate-vs-true fidelity of the E_flow far-tail remnant: ' +
    'this module (and every downstream module continuing its surrogate ladder -- imp-35454, ' +
    'imp-35473, imp-35496, imp-35497, imp-35552, imp-35553) measures the fd-vs-analytic ' +
    'remnant entirely on the closed T0 = 2 pi N / log N surrogate height map (both the fd ' +
    'exponent and the imp-35198 analytic -1 + 3/log N exponent live on that same inverse). ' +
    'It does NOT establish that this surrogate remnant tracks the TRUE empirical-vs-analytic ' +
    'E_flow far-tail gap under the exact RvM height map -- imp-35497 in fact measured that the ' +
    'sub-1e-3 crossing shifts by +15.31 decades under the exact inverse, confirming the ' +
    'surrogate reading is NOT height-map-robust. Distinct from imp-35337a, which is scoped to ' +
    'the sigma(N) landmarks, not this remnant. Formalized per imp-35834; inherits, and does ' +
    'not discharge, the imp-3220/imp-3406 assessment-only caveats.',
  vizDataStatus_imp35467_audit:
    'imp-35467 requested an import-light viz-data module for this ladder; that module already ' +
    'exists as imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data.js (identical five-rung ' +
    'ladder, registered at route /viz-imp35483-eflow-fartail-remnant-sub1e3-crossing in ' +
    'visualizations-index.js). imp-35467 is satisfied by imp-35483; do not build a duplicate.',
};

export const IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING_ASSERTIONS = [
  {
    // Reproduce the imp-35371 endpoint remnant at N = 1e24 (surrogate channel is faithful).
    id: 'imp35413-reproduces-imp35371-endpoint',
    description: 'the live remnant at N = 1e24 matches the imp-35371 endpoint value 0.0011',
    holds: () => Math.abs(remnantAtLog10(24) - 0.0011) < 5e-5,
  },
  {
    // The crossing sits between N = 1e25 and N = 1e26, near log10 N ~ 25.62.
    id: 'imp35413-crossing-bracketed',
    description: 'the sub-1e-3 crossing lies in log10 N in (25, 26), near 25.62',
    holds: () =>
      CROSSING_LOG10 > 25 &&
      CROSSING_LOG10 < 26 &&
      Math.abs(CROSSING_LOG10 - 25.6205) < 1e-2,
  },
  {
    // The bracket rungs straddle the threshold: 1e25 above, 1e26 below.
    id: 'imp35413-bracket-straddles-threshold',
    description: 'remnant(1e25) > 1e-3 > remnant(1e26)',
    holds: () => remnantAtLog10(25) > 1e-3 && remnantAtLog10(26) < 1e-3,
  },
  {
    // At the located crossing the remnant equals 1e-3 to bisection precision.
    id: 'imp35413-crossing-value-is-threshold',
    description: 'the remnant at the located crossing equals 1e-3 to bisection precision',
    holds: () => Math.abs(CROSSING_REMNANT - 1e-3) < 1e-6,
  },
  {
    // Slow-decay consistency: remnant*log N at the crossing is near the imp-35371 ~0.059 drift.
    id: 'imp35413-crossing-slow-decay-consistent',
    description: 'remnant*log N at the crossing is ~0.059, continuing the imp-35371 slow drift',
    holds: () => Math.abs(CROSSING_REMNANT_TIMES_LOGN - 0.059) < 5e-3,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35413-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.verdict),
  },
  {
    // imp-35466 audit: imp-35337a is scoped to the sigma(N) landmarks (imp-35411/imp-35417),
    // not to this remnant quantity -- record that distinction explicitly rather than silently
    // omitting a fidelity caveat.
    id: 'imp35413-scope-note-distinguishes-imp35337a',
    description: 'the imp-35337a scope note names both sibling modules and states it does not cover this remnant',
    holds: () =>
      /imp-35337a/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.scopeNote_imp35466_audit) &&
      /imp-35411/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.scopeNote_imp35466_audit) &&
      /imp-35417/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.scopeNote_imp35466_audit) &&
      /imp-35413a/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.scopeNote_imp35466_audit),
  },
  {
    // imp-35834: formalize the imp-35466 UNNAMED fidelity gap as its own tracked sub-gap
    // imp-35413a, distinct from imp-35337a (which scopes only the sigma(N) landmarks).
    id: 'imp35413-names-sub-gap-imp35413a',
    description: 'residual_sub_gap_imp_35413a names the sub-gap and distinguishes it from imp-35337a',
    holds: () =>
      /imp-35413a/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.residual_sub_gap_imp_35413a) &&
      /imp-35337a/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.residual_sub_gap_imp_35413a) &&
      /surrogate-vs-true fidelity/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.residual_sub_gap_imp_35413a),
  },
  {
    // imp-35467 audit: the requested viz-data module already exists as imp-35483 -- record
    // that so the frontier scout does not re-queue a duplicate build.
    id: 'imp35413-viz-data-status-names-imp35483',
    description: 'the imp-35467 viz-data status note names imp-35483 as the already-existing module',
    holds: () =>
      /imp-35467/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.vizDataStatus_imp35467_audit) &&
      /imp-35483/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.vizDataStatus_imp35467_audit) &&
      /already exists/.test(IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING.vizDataStatus_imp35467_audit),
  },
];

for (const a of IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35413-eflow-fartail-remnant-sub1e3-crossing assertion failed: ${a.id}`,
    );
  }
}

export default IMP35413_EFLOW_FARTAIL_REMNANT_SUB1E3_CROSSING;
