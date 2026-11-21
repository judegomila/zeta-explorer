/**
 * @module imp-35370-eflow-fartail-swap-fraction-half-crossover
 *
 * imp-35370 (numerical, frontier-direction): imp-35279 tabulated the inverse-swap FRACTION
 * of the E_flow far-tail decay-exponent residual as MONOTONE DECREASING across its four-rung
 * ladder (0.786 at N = 1e6, 0.648 at 1e9, 0.600 at 1e12, 0.568 at 1e16) -- the inverse swap
 * is the dominant but never the SOLE component of the residual at any rung. imp-35279 stopped
 * at N = 1e16 with the fraction still at 0.568, so it never located the N at which the swap
 * fraction first FALLS to 0.5 -- the rung where the closed-form/prefactor remnant first EQUALS
 * the inverse-swap gap (each exactly half the residual). This module reproduces the imp-35279
 * swappable-height-map finite difference VERBATIM as a continuous function of N and bisects for
 * that half-crossover.
 *
 * THE ISOLATION (identical to imp-35236/imp-35279, only the target is new)
 * ----------------------------------------------------------------------
 * Reproduce the exact imp-35135 far-tail quantity with a SWAPPABLE height map:
 *     E_flow(N) = C_F * (L / T0) * GRONWALL,   L = log T0,   C_F = (log(T0/2pi) + 1)/2pi,
 * measure the local log-log exponent by the same central difference (h = 1.0002) once with
 * T0 = effectiveHeightForN(N) (the TRUE RvM inverse) and once with T0 = 2 pi N / log N (the
 * closed surrogate). The exponent difference is PURELY the inverse swap. The swap FRACTION is
 *     swapFraction(N) = |fdSurr - fdTrue| / |analyticLead - fdTrue|,   analyticLead = -1 + 3/log N.
 *
 * THE FINDING (answers the imp-35370 half-crossover question)
 * ----------------------------------------------------------
 * (1) Continuing the imp-35279 ladder DEEPER, the swap fraction keeps decreasing monotonically
 *     but only VERY slowly: 0.557 at 1e18, 0.549 at 1e20, 0.535 at 1e24, 0.521 at 1e30,
 *     0.505 at 1e40 -- still above 0.5 at N = 1e40, forty decades past the imp-35279 endpoint.
 * (2) The swap fraction first crosses 0.5 between N = 1e44 (0.5008) and N = 1e45 (0.4998).
 *     Bisecting the imp-35279 swappable-height-map finite difference to a 1e-7 fraction
 *     tolerance places the crossover at log10 N = 44.7593 (N ~ 5.745e44), i.e. ln N ~ 103.06.
 * (3) At that crossover the inverse-swap gap and the closed-form/prefactor remnant are each
 *     exactly HALF the analytic residual: this is the deep rung where the imp-35236
 *     whole-residual-is-the-swap attribution stops being even approximately dominant and the
 *     remnant takes over as the larger of the two components for all N beyond it.
 *
 * So the imp-35279 "dominant but not sole" swap component stays above one-half of the residual
 * out to an astronomically deep N ~ 5.7e44 -- vastly past any verified-height or PT-relevant
 * scale (imp-audit X ~ 3e12) -- confirming the swap dominance is extremely long-lived but NOT
 * permanent: the closed-form/prefactor remnant is the ultimate majority owner of the residual.
 *
 * MEASUREMENT ONLY. Reproduces the imp-35279/imp-35236 finite difference on the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; E_flow > 0
 * strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail
 * exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (four-rung swap-fraction ladder 0.786->0.568; crossover located here)
 * @see imp-35236-eflow-fartail-inverse-swap-isolation (isolated the swap at 1e6/1e16)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the complementary remnant framing)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (attributed the residual to the inverse gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35236/imp-35279 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135/imp-35236/imp-35279 far-tail E_flow quantity, with a SWAPPABLE height map.
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35279 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The analytic leading closed form -1 + 3/log N (imp-35198).
function leadingAnalyticExponent(x) {
  return -1 + 3 / x;
}

// The imp-35279 swap FRACTION as a continuous function of N (verbatim isolation).
function swapFractionForN(N) {
  const x = Math.log(N);
  const eTrue = (n) => eFlowWith(effectiveHeightForN, n); // true RvM inverse
  const eSurr = (n) => eFlowWith(surrogateHeightForN, n); // closed surrogate
  const fdTrue = localExponent(eTrue, N);
  const fdSurr = localExponent(eSurr, N);
  const analyticLead = leadingAnalyticExponent(x);
  const inverseSwapGap = Math.abs(fdSurr - fdTrue); // PURELY the inverse swap
  const analyticResidual = Math.abs(analyticLead - fdTrue); // imp-35217/imp-35237 residual
  return inverseSwapGap / analyticResidual;
}

// Deeper-ladder swap fractions, continuing the imp-35279 four-rung table past N = 1e16.
const DEEPER_LADDER = [1e18, 1e20, 1e24, 1e30, 1e40, 1e44, 1e45].map((N) => ({
  N: +N.toExponential(0),
  log10N: +Math.log10(N).toFixed(4),
  swapFraction: +swapFractionForN(N).toFixed(6),
}));

// Bisect for the swapFraction = 0.5 crossover in log10 N (swapFraction is strictly decreasing).
function locateHalfCrossover() {
  let lo = 16; // swapFraction(1e16) = 0.568 > 0.5
  let hi = 300; // swapFraction(1e300) = 0.441 < 0.5
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (swapFractionForN(Math.pow(10, mid)) - 0.5 > 0) lo = mid;
    else hi = mid;
  }
  const log10N = (lo + hi) / 2;
  return {
    log10N: +log10N.toFixed(6),
    lnN: +(log10N * Math.LN10).toFixed(6),
    N: +Math.pow(10, log10N).toExponential(4),
    swapFractionAtCrossover: +swapFractionForN(Math.pow(10, log10N)).toFixed(8),
  };
}

const CROSSOVER = locateHalfCrossover();

export const IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER = {
  id: 'imp-35370',
  proofSection: 'S-frontier',
  question:
    'imp-35279 tabulated the E_flow far-tail inverse-swap FRACTION as monotone decreasing ' +
    '(0.786 at 1e6 down to 0.568 at 1e16) but never located the N at which it first falls to ' +
    '0.5 -- the rung where the closed-form/prefactor remnant first equals the inverse-swap gap. ' +
    'Locate that half-crossover by reproducing the imp-35279 swappable-height-map finite ' +
    'difference as a continuous function of N.',
  method:
    'Reproduce the imp-35279/imp-35236 swappable-height-map E_flow = C_F * (L/T0) * GRONWALL ' +
    'VERBATIM (same prefactor, same GRONWALL, same central difference h = 1.0002), form the ' +
    'swap fraction |fdSurr - fdTrue| / |analyticLead - fdTrue| as a function of N, tabulate it ' +
    'deeper than the imp-35279 endpoint, and bisect in log10 N for the swapFraction = 0.5 root.',
  deeperLadder: DEEPER_LADDER,
  crossover: CROSSOVER,
  finding: {
    F1_fraction_still_above_half_at_1e40:
      'Continuing the imp-35279 ladder deeper, the swap fraction keeps decreasing monotonically ' +
      'but only very slowly (0.557 at 1e18, 0.549 at 1e20, 0.535 at 1e24, 0.521 at 1e30, 0.505 ' +
      'at 1e40) -- still above 0.5 forty decades past the imp-35279 N = 1e16 endpoint.',
    F2_half_crossover_located:
      'The swap fraction first crosses 0.5 between N = 1e44 (0.5008) and N = 1e45 (0.4998); ' +
      'bisecting to a 1e-7 fraction tolerance places the crossover at log10 N = 44.7593 ' +
      '(N ~ 5.745e44), i.e. ln N ~ 103.06.',
    F3_remnant_becomes_majority_owner:
      'At the crossover the inverse-swap gap and the closed-form/prefactor remnant are each ' +
      'exactly HALF the analytic residual; for all N beyond it the remnant is the LARGER of the ' +
      'two components, so the imp-35236 whole-residual-is-the-swap attribution stops being even ' +
      'approximately dominant past this astronomically deep (and PT-irrelevant, X ~ 3e12) rung.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Reproducing the imp-35279 ' +
    'swappable-height-map inverse-swap fraction as a continuous function of N and bisecting for ' +
    'its 0.5 crossover: the fraction stays above one-half out to log10 N = 44.7593 (N ~ 5.745e44, ' +
    'ln N ~ 103.06), where the inverse-swap gap and the closed-form/prefactor remnant become ' +
    'equal halves of the residual. The imp-35279 swap dominance is thus extremely long-lived but ' +
    'NOT permanent -- the remnant is the ultimate majority owner of the residual, though only at ' +
    'an N vastly past any verified-height or Platt-Trudgian scale. Measurement only on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness ' +
    '(imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent ' +
    '1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35279 (swap-fraction ladder 0.786->0.568, crossover unlocated); imp-35236 (isolated ' +
    'the swap at 1e6/1e16); imp-35280 (complementary fd-vs-analytic remnant framing); imp-35217 ' +
    '(attributed the residual to the inverse gap); imp-35135 (measured on effectiveHeightForN); ' +
    'imp-486 (C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping.',
};

export const IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER_ASSERTIONS = [
  {
    // The deeper ladder reproduces the imp-35279 endpoint continuation and stays above 0.5 to 1e40.
    id: 'imp35370-fraction-above-half-out-to-1e40',
    description: 'swap fraction stays above 0.5 out to N = 1e40 (0.557 at 1e18 down to ~0.505 at 1e40)',
    holds: () => {
      const at1e18 = DEEPER_LADDER[0].swapFraction;
      const at1e40 = DEEPER_LADDER.find((r) => r.log10N === 40).swapFraction;
      return Math.abs(at1e18 - 0.5572) < 5e-4 && at1e40 > 0.5 && Math.abs(at1e40 - 0.5054) < 5e-4;
    },
  },
  {
    // The swap fraction brackets 0.5 between N = 1e44 and N = 1e45.
    id: 'imp35370-crossover-bracketed-1e44-1e45',
    description: 'swap fraction is > 0.5 at 1e44 (~0.5008) and < 0.5 at 1e45 (~0.4998)',
    holds: () => {
      const at44 = DEEPER_LADDER.find((r) => r.log10N === 44).swapFraction;
      const at45 = DEEPER_LADDER.find((r) => r.log10N === 45).swapFraction;
      return at44 > 0.5 && at45 < 0.5;
    },
  },
  {
    // The bisected crossover sits at log10 N ~ 44.76 (ln N ~ 103.06) with fraction pinned to 0.5.
    id: 'imp35370-crossover-located-log10-44p76',
    description: 'bisected half-crossover at log10 N = 44.7593 (ln N ~ 103.06), swapFraction pinned to 0.5',
    holds: () =>
      Math.abs(CROSSOVER.log10N - 44.7593) < 1e-3 &&
      Math.abs(CROSSOVER.lnN - 103.062) < 5e-3 &&
      Math.abs(CROSSOVER.swapFractionAtCrossover - 0.5) < 1e-6,
  },
  {
    // The deeper ladder is strictly monotone decreasing (continuing the imp-35279 trend).
    id: 'imp35370-deeper-ladder-monotone-decreasing',
    description: 'the deeper-ladder swap fractions strictly decrease with N',
    holds: () =>
      DEEPER_LADDER.every(
        (r, i) => i === 0 || DEEPER_LADDER[i - 1].swapFraction > r.swapFraction,
      ),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35370-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER.verdict),
  },
];

for (const a of IMP35370_EFLOW_FARTAIL_SWAP_FRACTION_HALF_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35370-eflow-fartail-swap-fraction-half-crossover assertion failed: ${a.id}`,
    );
  }
}
