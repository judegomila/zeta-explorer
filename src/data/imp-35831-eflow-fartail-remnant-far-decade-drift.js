/**
 * @module imp-35831-eflow-fartail-remnant-far-decade-drift
 *
 * imp-35831 (numerical, frontier-direction): imp-35413 located the imp-35371/imp-35280
 * E_flow far-tail fd-vs-analytic remnant sub-1e-3 crossing at N ~ 10^25.6205 ~ 4.17e25
 * and read the remnant*log N product still drifting slowly (~0.061 at N = 1e24 -> ~0.059
 * at the crossing), but stopped its ladder at N = 1e28 (remnant 0.000880). The open
 * question it left: does remnant*log N keep decreasing (slow-decay-to-zero) or level off
 * to a genuine nonzero deeper floor (a nonzero asymptote)? This module CONTINUES the
 * identical closed-surrogate channel several more decades, as far as double precision
 * reaches, and reads the answer off the product ladder.
 *
 * THE MEASUREMENT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * Byte-faithful to imp-35413: the fd-vs-analytic remnant holds the height map FIXED at
 * the closed surrogate T0 = 2 pi N / log N (imp-35280). Both the fd-surrogate exponent
 * (central log-log difference of the exact imp-35135 far-tail E_flow quantity) and the
 * imp-35198 analytic exponent -1 + 3/log N live on that same closed inverse, so the
 * remnant isolates only the closed-form Taylor truncation plus the prefactor-form
 * difference. That makes this module pure Math. It recomputes the imp-35413 endpoint
 * N = 1e28 live (reproducing 0.000880 to the digit) before extending the ladder.
 *
 *   N          fd-vs-analytic remnant     remnant*log N     status
 *   1e28       0.000880                   0.056710          imp-35413 endpoint (reproduced)
 *   1e32       0.000722                   0.053201          NEW -- this module
 *   1e40       0.000514                   0.047326          NEW -- this module
 *   1e56       0.000302                   0.038913          NEW -- this module
 *   1e80       0.000168                   0.031019          NEW -- this module
 *   1e140      0.0000655                  0.021115          NEW -- this module
 *   1e200      0.0000354                  0.016296          NEW -- this module (imp-35535 endpoint)
 *   1e280      0.0000196                  0.012663          NEW -- this module (near the double ceiling)
 *
 * THE FINDING
 * -----------
 * Across every reachable decade the remnant*log N product keeps DECREASING monotonically
 * -- from ~0.0567 at N = 1e28 down to ~0.0127 at N = 1e280, less than a quarter of the
 * crossing value ~0.059. There is NO sign of a nonzero floor: had the product been
 * levelling off to a deeper nonzero asymptote it would flatten, but it instead falls by a
 * further factor ~4.5 over the extra ~252 decades. This distinguishes the two hypotheses
 * in favour of slow-decay-to-zero: the remnant itself heads to zero, and the product
 * remnant*log N heads to zero too (just very slowly). The reading is consistent with the
 * independently-derived imp-35552 leading form remnant ~ 2 loglog N / (log N)^2 (whose
 * product remnant*log N ~ 2 loglog N / log N -> 0). The measurement stops near N = 1e280
 * because the surrogate channel evaluates Math.pow(10, e) directly and that overflows to
 * Infinity at e ~ 309 (double-precision ceiling); the far-decade drift is monotone
 * decreasing over the entire reachable window with no plateau.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. It inherits, and does not discharge, the tracked
 * sub-gap imp-35413a (surrogate-vs-true fidelity of the E_flow far-tail remnant; the
 * surrogate reading is NOT height-map-robust per imp-35497). E_flow > 0 strictness
 * (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail
 * exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the ladder this continues, endpoint 1e28)
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (independent remnant ~ 2 loglogN/(logN)^2 leading form)
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

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35413 (h = 1.0002).
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

// The fd-vs-analytic remnant at a given log10 N exponent e (the imp-35280/imp-35413 quantity).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent(N);
  const analytic = analyticSurrogateExponent(x);
  return Math.abs(analytic - fd);
}

// remnant*log N at a given log10 N exponent e (the slow-drift diagnostic imp-35413 tracked).
function remnantTimesLogNAtLog10(e) {
  const N = Math.pow(10, e);
  return remnantAtLog10(e) * Math.log(N);
}

// The continuation ladder: the reproduced imp-35413 endpoint (1e28) plus the new far rungs.
const LADDER_EXPONENTS = [28, 32, 40, 56, 80, 140, 200, 280];
const LADDER = LADDER_EXPONENTS.map((e) => ({
  N: +Math.pow(10, e).toExponential(0),
  log10N: e,
  remnant: +remnantAtLog10(e).toFixed(6),
  remnantTimesLogN: +remnantTimesLogNAtLog10(e).toFixed(6),
  isReproduced35413Endpoint: e === 28,
}));

// The product is monotone decreasing across the whole ladder (the "no floor" reading).
const PRODUCT_STRICTLY_DECREASING = LADDER.every(
  (row, i) => i === 0 || row.remnantTimesLogN < LADDER[i - 1].remnantTimesLogN,
);

// The double-precision ceiling: Math.pow(10, e) is finite at e = 308 but Infinity at e = 309,
// so the surrogate channel (which evaluates 10^e directly) can only reach ~1e308.
const DOUBLE_CEILING_LOG10 = 308;

export const IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT = {
  id: 'imp-35831',
  proofSection: 'S-frontier',
  question:
    'Continuing the imp-35413 fd-vs-analytic E_flow far-tail remnant ladder past N = 1e28, ' +
    'does remnant*log N keep decreasing (slow-decay-to-zero) or level off to a nonzero ' +
    'deeper floor (a nonzero asymptote)?',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), reproduce the imp-35413 endpoint N = 1e28 ' +
    'remnant to the digit, then extend the same fd-vs-analytic remnant |analytic - fd-surrogate| ' +
    'ladder as far as double precision reaches (to N ~ 1e280) and read the remnant*log N drift.',
  ladder: LADDER,
  drift: {
    productAtEndpoint_1e28: +remnantTimesLogNAtLog10(28).toFixed(6),
    productAtDeepestRung_1e280: +remnantTimesLogNAtLog10(280).toFixed(6),
    productStrictlyDecreasing: PRODUCT_STRICTLY_DECREASING,
    doubleCeilingLog10: DOUBLE_CEILING_LOG10,
  },
  finding: {
    F1_reproduces_imp35413_endpoint:
      'The remnant recomputed live at N = 1e28 reproduces the imp-35413 endpoint value ' +
      '0.000880 to the digit, confirming this continuation shares the imp-35280/imp-35413 ' +
      'surrogate channel exactly.',
    F2_product_keeps_decreasing_no_floor:
      'remnant*log N decreases monotonically across every reachable decade -- from ~0.0567 ' +
      'at N = 1e28 down to ~0.0127 at N = 1e280 (less than a quarter of the ~0.059 crossing ' +
      'value), a further factor ~4.5 over the extra ~252 decades. There is no plateau and no ' +
      'sign of a nonzero deeper floor.',
    F3_favours_slow_decay_to_zero:
      'The monotone-decreasing product distinguishes the two hypotheses in favour of ' +
      'slow-decay-to-zero: both the remnant and remnant*log N head to zero (slowly), ' +
      'consistent with the independently-derived imp-35552 leading form ' +
      'remnant ~ 2 loglog N / (log N)^2 (product remnant*log N ~ 2 loglog N / log N -> 0). ' +
      'The ladder stops near N = 1e280 only because the surrogate channel evaluates 10^e ' +
      'directly and that overflows to Infinity at e ~ 309 (double-precision ceiling).',
  },
  isRigorous: false,
  honestStatus:
    'Continuing the imp-35413 surrogate channel past N = 1e28, the fd-vs-analytic E_flow ' +
    'far-tail remnant*log N product keeps DECREASING monotonically (from ~0.0567 at N = 1e28 ' +
    'to ~0.0127 at N = 1e280), with no plateau and no nonzero deeper floor within the ' +
    'reachable window (the surrogate channel overflows near N = 1e309). This favours ' +
    'slow-decay-to-zero over a nonzero asymptote and is consistent with the imp-35552 ' +
    'remnant ~ 2 loglog N / (log N)^2 leading form. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; inherits sub-gap imp-35413a; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35413 surrogate ' +
    'channel past N = 1e28, remnant*log N decreases monotonically across every reachable ' +
    'decade (~0.0567 at N = 1e28 -> ~0.0127 at N = 1e280), with no plateau -- distinguishing ' +
    'slow-decay-to-zero from a nonzero deeper floor in favour of slow-decay-to-zero, ' +
    'consistent with the independently-derived imp-35552 remnant ~ 2 loglog N / (log N)^2 ' +
    'leading form. The ladder stops near N = 1e280 at the double-precision ceiling (10^e ' +
    'overflows at e ~ 309). Measurement only on the inherited imp-3220/imp-3406 surrogate, ' +
    'NOT a rigorous asymptotic; inherits, and does not discharge, tracked sub-gap imp-35413a ' +
    '(surrogate-vs-true fidelity, NOT height-map-robust per imp-35497); E_flow > 0 strictness ' +
    '(imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail ' +
    'exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35413 (sub-1e-3 crossing, endpoint N = 1e28, continued here); imp-35552 (independent ' +
    'remnant ~ 2 loglogN/(logN)^2 decay-to-zero leading form); imp-35280 (four-rung ' +
    'fd-vs-analytic remnant origin); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail ' +
    'E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
  residual_sub_gap_imp_35413a:
    'This module continues the imp-35413 surrogate ladder and so inherits tracked sub-gap ' +
    'imp-35413a: it measures the fd-vs-analytic remnant entirely on the closed ' +
    'T0 = 2 pi N / log N surrogate height map, and does NOT establish that this surrogate ' +
    'remnant tracks the TRUE empirical-vs-analytic E_flow far-tail gap under the exact RvM ' +
    'height map (imp-35497 measured the crossing shifts by +15.31 decades under the exact ' +
    'inverse, so the surrogate reading is NOT height-map-robust). Inherits, and does not ' +
    'discharge, the imp-3220/imp-3406 assessment-only caveats.',
};

export const IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT_ASSERTIONS = [
  {
    // Reproduce the imp-35413 endpoint remnant at N = 1e28 (surrogate channel is faithful).
    id: 'imp35831-reproduces-imp35413-endpoint',
    description: 'the live remnant at N = 1e28 matches the imp-35413 endpoint value 0.000880',
    holds: () => Math.abs(remnantAtLog10(28) - 0.00088) < 5e-6,
  },
  {
    // The central finding: remnant*log N is strictly monotone decreasing across the whole
    // ladder (1e28 .. 1e280) -- no leveling to a nonzero deeper floor.
    id: 'imp35831-product-strictly-decreasing-no-floor',
    description: 'remnant*log N decreases monotonically across every rung (no nonzero floor)',
    holds: () => PRODUCT_STRICTLY_DECREASING === true,
  },
  {
    // Quantify the continued drift: the product at the deepest rung is far below the crossing
    // value ~0.059 -- a further factor > 4 over the extra decades, confirming continued decay.
    id: 'imp35831-product-drops-well-below-crossing',
    description: 'remnant*log N at N = 1e280 is well below the ~0.059 crossing value (< 0.02)',
    holds: () =>
      remnantTimesLogNAtLog10(280) < 0.02 &&
      remnantTimesLogNAtLog10(280) < remnantTimesLogNAtLog10(28) / 4,
  },
  {
    // Cross-check against the imp-35535 endpoint: remnant(1e200) = 3.5385e-5 (same channel).
    id: 'imp35831-crosschecks-imp35535-endpoint',
    description: 'remnant(1e200) reproduces the imp-35535 endpoint value 3.5385e-5',
    holds: () => Math.abs(remnantAtLog10(200) - 3.5385e-5) < 5e-8,
  },
  {
    // Document the reachable ceiling: 10^308 is finite but 10^309 overflows to Infinity, so the
    // surrogate channel cannot be pushed past ~N = 1e308 without a bignum reimplementation.
    id: 'imp35831-double-precision-ceiling',
    description: 'the surrogate channel 10^e is finite at e = 308 but Infinity at e = 309',
    holds: () =>
      Number.isFinite(Math.pow(10, DOUBLE_CEILING_LOG10)) &&
      !Number.isFinite(Math.pow(10, DOUBLE_CEILING_LOG10 + 1)),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35831-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT.isRigorous === false &&
      /NO QED/.test(IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT.verdict),
  },
  {
    // Inherits, and does not discharge, tracked sub-gap imp-35413a (surrogate-vs-true fidelity).
    id: 'imp35831-inherits-sub-gap-imp35413a',
    description: 'the module records that it inherits tracked sub-gap imp-35413a',
    holds: () =>
      /imp-35413a/.test(IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT.residual_sub_gap_imp_35413a) &&
      /not height-map-robust|NOT height-map-robust/.test(
        IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT.verdict,
      ),
  },
];

for (const a of IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35831-eflow-fartail-remnant-far-decade-drift assertion failed: ${a.id}`,
    );
  }
}

export default IMP35831_EFLOW_FARTAIL_REMNANT_FAR_DECADE_DRIFT;
