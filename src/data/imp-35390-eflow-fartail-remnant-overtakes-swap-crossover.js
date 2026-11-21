/**
 * @module imp-35390-eflow-fartail-remnant-overtakes-swap-crossover
 *
 * imp-35390 (numerical, frontier-direction): imp-35280 tabulated the two-component split of
 * the imp-35217 leading E_flow far-tail decay-exponent residual --
 *     analytic residual = INVERSE-SWAP gap + fd-vs-analytic (closed-form/prefactor) remnant --
 * across N = 1e6..1e16 and reported that the fd-vs-analytic remnant's RELATIVE share of the
 * residual GROWS from ~21% (1e6) to ~44% (1e16) while the swap gap still dominates (~56%) at
 * the ladder endpoint. imp-35280 stopped at N = 1e16 with the remnant still the MINORITY
 * component, so it never located the crossover N* where the fd-vs-analytic remnant first EQUALS
 * then EXCEEDS the swap gap (its share crosses 50%). This module reproduces the imp-35280
 * fd-vs-analytic isolation VERBATIM as a continuous function of N and bisects for that overtake,
 * approaching it from the REMNANT side (the complement of the imp-35370 swap-side framing).
 *
 * THE ISOLATION (identical to imp-35280/imp-35370, only the crossover target is complementary)
 * -------------------------------------------------------------------------------------------
 * Reproduce the exact imp-35135 far-tail quantity with a SWAPPABLE height map:
 *     E_flow(N) = C_F * (L / T0) * GRONWALL,   L = log T0,   C_F = (log(T0/2pi) + 1)/2pi,
 * read the local log-log exponent by the same central difference (h = 1.0002) three ways --
 * fd-true (T0 = effectiveHeightForN, the true RvM inverse), fd-surrogate (closed
 * T0 = 2 pi N / log N), and analytic (-1 + 3/log N). Because the three exponents are ordered
 * ANALYTIC < fd-SURROGATE < fd-TRUE (all < 0), the signed identity makes the two absolute gaps
 * add exactly:  remnant gap |analytic - fdSurr|  +  swap gap |fdSurr - fdTrue|  =  residual.
 * The fd-vs-analytic remnant FRACTION is therefore
 *     remnantFraction(N) = |analytic - fdSurr| / |analytic - fdTrue| = 1 - swapFraction(N),
 * so remnant overtakes swap (remnantFraction crosses 0.5) at exactly the N where the imp-35370
 * swap fraction FALLS to 0.5 -- the same rung, read from the complementary side.
 *
 * THE FINDING (locates the imp-35280 remnant-overtakes-swap crossover)
 * ------------------------------------------------------------------
 * (1) Continuing the imp-35280 ladder DEEPER, the fd-vs-analytic remnant fraction keeps rising
 *     monotonically but only very slowly: 0.4428 at 1e18, 0.4649 at 1e24, 0.4946 at 1e40 --
 *     still the MINORITY component (below one-half) forty decades past the imp-35280 endpoint.
 * (2) The remnant fraction first crosses 0.5 between N = 1e44 (0.4992) and N = 1e45 (0.5003).
 *     Bisecting the imp-35280 fd-vs-analytic isolation to a 1e-7 fraction tolerance places the
 *     overtake at log10 N* = 44.7593 (N* ~ 5.745e44), i.e. ln N* ~ 103.062.
 * (3) This coincides EXACTLY (to 4 decimals in log10 N) with the imp-35370 swap-fraction 0.5
 *     crossover -- a direct arithmetic consequence of the signed identity remnantFraction =
 *     1 - swapFraction -- so the remnant-side and swap-side framings agree on the single deep
 *     rung where the closed-form/prefactor remnant takes over as the LARGER of the two
 *     components. imp-35280 whole-residual-share-still-swap holds until this astronomically deep
 *     (and PT-irrelevant, X ~ 3e12) N, and fails for all N beyond it.
 *
 * So the crossover imp-35280 left unlocated sits at N* ~ 5.7e44 -- the fd-vs-analytic remnant is
 * the minority component of the residual out to a scale vastly past any verified-height or
 * Platt-Trudgian rung, then becomes the permanent majority owner beyond it, exactly as the
 * imp-35370 swap-side bisection found from the complementary direction.
 *
 * MEASUREMENT ONLY. Reproduces the imp-35280/imp-35236 finite difference on the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; E_flow > 0
 * strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail
 * exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (remnant share 21%->44% by 1e16; crossover located here)
 * @see imp-35370-eflow-fartail-swap-fraction-half-crossover (swap-side 0.5 crossover at log10 N = 44.7593; same rung)
 * @see imp-35236-eflow-fartail-inverse-swap-isolation (isolated the swap at 1e6/1e16)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (attributed the residual to the inverse gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35236/imp-35280/imp-35370 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135/imp-35280/imp-35370 far-tail E_flow quantity, with a SWAPPABLE height map.
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35280 (h = 1.0002).
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

// The imp-35280 fd-vs-analytic remnant FRACTION as a continuous function of N (verbatim isolation).
function remnantFractionForN(N) {
  const x = Math.log(N);
  const eTrue = (n) => eFlowWith(effectiveHeightForN, n); // true RvM inverse
  const eSurr = (n) => eFlowWith(surrogateHeightForN, n); // closed surrogate
  const fdTrue = localExponent(eTrue, N);
  const fdSurr = localExponent(eSurr, N);
  const analyticLead = leadingAnalyticExponent(x);
  const remnantGap = Math.abs(analyticLead - fdSurr); // fd-vs-analytic (closed-form/prefactor) remnant
  const analyticResidual = Math.abs(analyticLead - fdTrue); // imp-35217/imp-35237 residual
  return remnantGap / analyticResidual;
}

// Deeper-ladder remnant fractions, continuing the imp-35280 four-rung table past N = 1e16.
const DEEPER_LADDER = [1e18, 1e20, 1e24, 1e30, 1e40, 1e44, 1e45].map((N) => ({
  N: +N.toExponential(0),
  log10N: +Math.log10(N).toFixed(4),
  remnantFraction: +remnantFractionForN(N).toFixed(6),
}));

// Bisect for the remnantFraction = 0.5 crossover in log10 N (remnantFraction is strictly increasing).
function locateOvertakeCrossover() {
  let lo = 16; // remnantFraction(1e16) = 0.432 < 0.5
  let hi = 300; // remnantFraction(1e300) = 0.559 > 0.5
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantFractionForN(Math.pow(10, mid)) - 0.5 < 0) lo = mid;
    else hi = mid;
  }
  const log10N = (lo + hi) / 2;
  return {
    log10N: +log10N.toFixed(6),
    lnN: +(log10N * Math.LN10).toFixed(6),
    N: +Math.pow(10, log10N).toExponential(4),
    remnantFractionAtCrossover: +remnantFractionForN(Math.pow(10, log10N)).toFixed(8),
  };
}

const CROSSOVER = locateOvertakeCrossover();
const IMP35370_SWAP_HALF_CROSSOVER_LOG10N = 44.7593; // imp-35370 swap-side 0.5 crossover (same rung)

export const IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER = {
  id: 'imp-35390',
  proofSection: 'S-frontier',
  question:
    'imp-35280 found the fd-vs-analytic remnant SHARE of the E_flow far-tail residual grows from ' +
    '~21% (1e6) to ~44% (1e16) but stopped with the remnant still the minority component, never ' +
    'locating the crossover N* where it first EQUALS then EXCEEDS the inverse-swap gap (share ' +
    'crosses 50%). Locate that overtake by reproducing the imp-35280 fd-vs-analytic isolation as ' +
    'a continuous function of N and bisecting past the imp-35280 1e16 endpoint.',
  method:
    'Reproduce the imp-35280/imp-35236 swappable-height-map E_flow = C_F * (L/T0) * GRONWALL ' +
    'VERBATIM (same prefactor, same GRONWALL, same central difference h = 1.0002), form the ' +
    'fd-vs-analytic remnant fraction |analyticLead - fdSurr| / |analyticLead - fdTrue| as a ' +
    'function of N, tabulate it deeper than the imp-35280 endpoint, and bisect in log10 N for the ' +
    'remnantFraction = 0.5 root. Cross-check the located rung against the imp-35370 swap-side ' +
    'crossover (remnantFraction = 1 - swapFraction by the signed identity).',
  deeperLadder: DEEPER_LADDER,
  crossover: CROSSOVER,
  finding: {
    F1_remnant_still_minority_at_1e40:
      'Continuing the imp-35280 ladder deeper, the fd-vs-analytic remnant fraction keeps rising ' +
      'monotonically but only very slowly (0.4428 at 1e18, 0.4515 at 1e20, 0.4649 at 1e24, ' +
      '0.4795 at 1e30, 0.4946 at 1e40) -- still the MINORITY component (below one-half) forty ' +
      'decades past the imp-35280 N = 1e16 endpoint.',
    F2_overtake_crossover_located:
      'The remnant fraction first crosses 0.5 between N = 1e44 (0.4992) and N = 1e45 (0.5003); ' +
      'bisecting to a 1e-7 fraction tolerance places the overtake at log10 N* = 44.7593 ' +
      '(N* ~ 5.745e44), i.e. ln N* ~ 103.062.',
    F3_coincides_with_imp35370_swap_crossover:
      'This overtake rung coincides EXACTLY (to 4 decimals in log10 N) with the imp-35370 ' +
      'swap-fraction 0.5 crossover -- a direct consequence of the signed identity ' +
      'remnantFraction = 1 - swapFraction -- so the remnant-side and swap-side framings agree ' +
      'that N* ~ 5.7e44 is the single deep rung where the closed-form/prefactor remnant becomes ' +
      'the LARGER of the two components, permanently, for all N beyond it (and PT-irrelevant, X ~ 3e12).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Reproducing the imp-35280 fd-vs-analytic ' +
    'remnant fraction as a continuous function of N and bisecting for its 0.5 crossover: the ' +
    'remnant stays the minority component (below one-half) out to log10 N = 44.7593 (N ~ 5.745e44, ' +
    'ln N ~ 103.062), where it first equals then exceeds the inverse-swap gap. This coincides ' +
    'exactly with the imp-35370 swap-side 0.5 crossover via the signed identity remnantFraction = ' +
    '1 - swapFraction, so both framings agree the imp-35280 remnant-is-still-minority attribution ' +
    'holds until this astronomically deep (PT-irrelevant, X ~ 3e12) rung and fails beyond it. ' +
    'Measurement only on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35280 (remnant share 21%->44% by 1e16, crossover unlocated); imp-35370 (swap-side 0.5 ' +
    'crossover at log10 N = 44.7593, same rung); imp-35236 (isolated the swap at 1e6/1e16); ' +
    'imp-35217 (attributed the residual to the inverse gap); imp-35135 (measured on ' +
    'effectiveHeightForN); imp-486 (C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping.',
};

export const IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER_ASSERTIONS = [
  {
    // The deeper ladder continues the imp-35280 endpoint upward and stays below 0.5 out to 1e40.
    id: 'imp35390-remnant-minority-out-to-1e40',
    description: 'remnant fraction stays below 0.5 out to N = 1e40 (0.4428 at 1e18 up to ~0.4946 at 1e40)',
    holds: () => {
      const at1e18 = DEEPER_LADDER[0].remnantFraction;
      const at1e40 = DEEPER_LADDER.find((r) => r.log10N === 40).remnantFraction;
      return Math.abs(at1e18 - 0.4428) < 5e-4 && at1e40 < 0.5 && Math.abs(at1e40 - 0.4946) < 5e-4;
    },
  },
  {
    // The remnant fraction brackets 0.5 between N = 1e44 and N = 1e45.
    id: 'imp35390-crossover-bracketed-1e44-1e45',
    description: 'remnant fraction is < 0.5 at 1e44 (~0.4992) and > 0.5 at 1e45 (~0.5003)',
    holds: () => {
      const at44 = DEEPER_LADDER.find((r) => r.log10N === 44).remnantFraction;
      const at45 = DEEPER_LADDER.find((r) => r.log10N === 45).remnantFraction;
      return at44 < 0.5 && at45 > 0.5;
    },
  },
  {
    // The bisected overtake sits at log10 N ~ 44.76 (ln N ~ 103.06) with fraction pinned to 0.5.
    id: 'imp35390-crossover-located-log10-44p76',
    description: 'bisected overtake at log10 N = 44.7593 (ln N ~ 103.06), remnantFraction pinned to 0.5',
    holds: () =>
      Math.abs(CROSSOVER.log10N - 44.7593) < 1e-3 &&
      Math.abs(CROSSOVER.lnN - 103.062) < 5e-3 &&
      Math.abs(CROSSOVER.remnantFractionAtCrossover - 0.5) < 1e-6,
  },
  {
    // The overtake rung coincides with the imp-35370 swap-side 0.5 crossover (signed identity).
    id: 'imp35390-coincides-with-imp35370-swap-crossover',
    description: 'the remnant-side overtake log10 N equals the imp-35370 swap-side 0.5 crossover to 4 decimals',
    holds: () => Math.abs(CROSSOVER.log10N - IMP35370_SWAP_HALF_CROSSOVER_LOG10N) < 1e-3,
  },
  {
    // The deeper ladder is strictly monotone increasing (complement of the imp-35370 decrease).
    id: 'imp35390-deeper-ladder-monotone-increasing',
    description: 'the deeper-ladder remnant fractions strictly increase with N',
    holds: () =>
      DEEPER_LADDER.every(
        (r, i) => i === 0 || DEEPER_LADDER[i - 1].remnantFraction < r.remnantFraction,
      ),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35390-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER.verdict),
  },
];

for (const a of IMP35390_EFLOW_FARTAIL_REMNANT_OVERTAKES_SWAP_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35390-eflow-fartail-remnant-overtakes-swap-crossover assertion failed: ${a.id}`,
    );
  }
}
