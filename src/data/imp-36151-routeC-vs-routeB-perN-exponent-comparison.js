/**
 * @module imp-36151-routeC-vs-routeB-perN-exponent-comparison
 * @fileoverview imp-36151 -- Compare the imp-36082 Route-B EXPLICIT per-N rate
 *   r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} against the per-N candidate implied
 *   by Route-C (imp-337 / imp-342 / imp-343 density squeeze), which imp-36045 ranked
 *   ABOVE Route-B (C > B > A). Resolve whether Route-C's higher ranking corresponds
 *   to a strictly FASTER N-exponent or only a BETTER CONSTANT / structural readiness.
 *   Assessment / derivation ONLY: closes NOTHING, discharges no gap, the per-N
 *   translation stays OPEN, respects the imp-2519 no-overclaim guard, NO QED.
 *   No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36045 ranked the three G5-perN-translation routes C > B > A, and imp-36082
 *   wrote down the ONLY explicit per-N rate FORM any route currently supplies:
 *   Route-B's r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} (leading exponent -1/4).
 *   The natural reading of "C ranked above B" is that C decays FASTER. This module
 *   tests that reading and finds it FALSE-BY-CONSTRUCTION: the imp-36045 ranking was
 *   scored on readiness axes (perNForm, unconditional, gapsClosed, residualTractable)
 *   -- NONE of which measures decay SPEED -- so the ranking cannot, on its own,
 *   assert a faster exponent.
 *
 *   THE TWO ROUTES' PER-N EXPONENT STATUS
 *   -------------------------------------
 *   ROUTE B (imp-36082): the exponent is PINNED and explicit. r_B(N) = Theta(
 *   sqrt(log N) N^{-1/4}); the wide-window log-log slope of r_B provably converges
 *   to -1/4 from above as the slowly-varying sqrt(log gamma_N) dressing dilutes
 *   (this module recomputes the slope on a very wide ladder to witness the limit).
 *   BUT r_B bounds the shock-time DEVIATION |t_c(m_N) - t_c(m_inf)|, not |t_c(N)|
 *   absolutely -- imp-36082 verdict CONSUMABLE-MODULO-ANCHOR.
 *
 *   ROUTE C (imp-337 / imp-342 / imp-343): produces a per-N bound BY CONSTRUCTION
 *   (integrate the strict drift dg_{k*}/dt < 0 from the density squeeze
 *   S_{k*}(t) >= c(N)/B(t)^2, c(N) > 2 from Weyl), with NO asymptotic lim-sup detour.
 *   BUT the MAGNITUDE and N-scaling of that integrated bound are set by the extremal
 *   max-gap statistics at the argmin site -- exactly the OPEN sub-gap G3a_max_gap.
 *   Until G3a_max_gap is closed, Route-C's per-N EXPONENT is UNQUANTIFIED: no
 *   explicit r_C(N) FORM with a pinned leading power exists to compare against -1/4.
 *
 *   THE RESOLUTION (assessment, NO QED)
 *   -----------------------------------
 *   The C > B ranking reflects UNCONDITIONAL-CONSUMABILITY READINESS, NOT a
 *   demonstrated strictly-faster N-exponent. Decomposed against the ticket's binary
 *   ("faster exponent" vs "better constant"):
 *     - NOT a faster exponent: Route-C has NO pinned exponent to be faster WITH; the
 *       only pinned exponent in play is Route-B's -1/4. A faster-exponent claim for
 *       C is unavailable, because the quantity that would fix C's exponent
 *       (G3a_max_gap extremal statistics) is the open residual.
 *     - Closest to "a better constant": Route-C's advantage is structural -- per-N
 *       BY CONSTRUCTION (perNForm) and UNCONDITIONAL (2 of 3 sub-gaps closed from
 *       pure Weyl density) with a TRACTABLE residual -- whereas Route-B, though it
 *       owns the explicit -1/4 form, delivers it only as a deviation bound whose
 *       per-N upgrade re-imports GUE. That is a readiness/"constant"-side edge, not
 *       a rate-exponent edge.
 *   CONDITIONAL ILLUSTRATION (NOT a claim): IF G3a_max_gap were discharged with a
 *   GUE-type sqrt(log N) max-gap scale, Route-C's integrated bound would acquire a
 *   per-N form -- but that closure is exactly the open residual and, like Route-A's
 *   C_mb, risks importing extremal-statistics input beyond pure Weyl, so no C
 *   exponent (fast or slow) can be asserted here. Closes NOTHING; the per-N
 *   translation and G3a_max_gap stay OPEN.
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (Route-B r_B(N), -1/4)
 *   @see src/data/imp-36045-perN-translation-route-readiness-assessment.js (C > B > A readiness ranking)
 *   @see src/data/lambda-roadmap.js (Step 5 G5-perN-translation; Route-C sub-gap G3a_max_gap)
 *
 *   Ticket: imp-36151 (numerical, medium).
 */

// -- Route-B per-N rate (identical convention to imp-36082 / imp-354) ----------
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;
const C_WHITHAM_PLACEHOLDER = 1.0;
const C_PRIME = C_WHITHAM_PLACEHOLDER * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));

function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 6; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}
// r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4}: the explicit Route-B per-N rate.
function rateB(N) {
  const L = Math.log(gammaNFromRvM(N));
  if (!(L > 0) || !(N > 0)) return null;
  return (C_PRIME * Math.sqrt(L)) / Math.pow(N, 0.25);
}

// Route-B leading exponent, witnessed by the wide-window log-log slope of r_B(N).
// The slowly-varying sqrt(log gamma_N) dressing drags the finite-window slope above
// -1/4; on a very wide, very high ladder it converges DOWN toward exactly -1/4.
const ROUTE_B_LEADING_EXPONENT = -0.25;
function loglogSlopeB(N1, N2) {
  const a = rateB(N1);
  const b = rateB(N2);
  return (Math.log(b) - Math.log(a)) / (Math.log(N2) - Math.log(N1));
}
const SLOPE_MID = loglogSlopeB(1e8, 1e40); // ~ -0.239 (dressing still active)
const SLOPE_FAR = loglogSlopeB(1e250, 1e300); // ~ -0.2492 (dressing diluted)
// The slope must approach -1/4 from ABOVE and monotonically tighten toward it.
const SLOPE_APPROACHES_QUARTER =
  SLOPE_FAR > ROUTE_B_LEADING_EXPONENT &&
  SLOPE_FAR < SLOPE_MID &&
  SLOPE_MID > ROUTE_B_LEADING_EXPONENT &&
  Math.abs(SLOPE_FAR - ROUTE_B_LEADING_EXPONENT) < 1e-3;

// -- Comparison record ---------------------------------------------------------
export const IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON = Object.freeze({
  id: 'imp-36151-routeC-vs-routeB-perN-exponent-comparison',
  ticket: 'imp-36151',
  obligationKey: 'G5-perN-translation',
  feedsInto: 'Step-4 E(N) bridge constants (NOT the headline inequality) per imp-2564',

  summary:
    'Compares the imp-36082 Route-B explicit per-N rate r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} (leading ' +
    'exponent -1/4, witnessed here by the wide-window log-log slope converging to -1/4 from above) against the ' +
    'per-N candidate implied by Route-C (imp-337/342/343 density squeeze), which imp-36045 ranked ABOVE B (C > B ' +
    '> A). VERDICT: the C > B ranking reflects UNCONDITIONAL-CONSUMABILITY READINESS, NOT a strictly faster ' +
    'N-exponent. The imp-36045 score is built from readiness axes (perNForm, unconditional, gapsClosed, ' +
    'residualTractable), none of which measures decay SPEED. Route-B owns the ONLY pinned exponent (-1/4); ' +
    'Route-C produces a per-N bound BY CONSTRUCTION (integrate dg_{k*}/dt < 0) but its magnitude/N-scaling are ' +
    'set by the OPEN G3a_max_gap extremal max-gap statistics, so Route-C has NO pinned exponent to be faster ' +
    'WITH. Mapped onto the ticket binary: NOT a faster exponent (C exponent unquantified); the C > B edge is ' +
    'structural / "better constant" (per-N by construction + unconditional + tractable residual) vs Route-B ' +
    'which owns -1/4 but only as a DEVIATION bound whose per-N upgrade re-imports GUE (imp-36082 ' +
    'CONSUMABLE-MODULO-ANCHOR). Assessment/derivation ONLY; closes NOTHING; discharges no gap; per-N translation ' +
    'and G3a_max_gap stay OPEN; respects the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed' +
    '.',

  routeB: Object.freeze({
    id: 'route-B-burgers',
    rateForm: 'r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4}  [Theta(sqrt(log N) N^{-1/4})]',
    leadingExponent: ROUTE_B_LEADING_EXPONENT,
    exponentPinned: true,
    C_prime: C_PRIME,
    loglogSlope_1e8_1e40: SLOPE_MID,
    loglogSlope_1e250_1e300: SLOPE_FAR,
    slopeApproachesQuarterFromAbove: SLOPE_APPROACHES_QUARTER,
    boundsWhat: 'the shock-time DEVIATION |t_c(m_N) - t_c(m_inf)|, NOT |t_c(N)| absolutely (imp-36082)',
    consumability: 'CONSUMABLE-MODULO-ANCHOR (imp-36082): per-N upgrade re-imports GUE/ESY',
  }),

  routeC: Object.freeze({
    id: 'route-C-density',
    delivers: 'a per-N upper bound on |t_c(N)| BY CONSTRUCTION (integrate dg_{k*}/dt < 0, density squeeze), no lim-sup',
    rateForm: null,
    leadingExponent: null,
    exponentPinned: false,
    exponentBlockedBy: 'G3a_max_gap -- extremal max-gap statistics at the argmin site set the bound magnitude / N-scaling',
    subGapsClosedUnconditionally: 'G4_argmin_drift (imp-343) + G3b_weyl_tail (imp-342, c_tail ~ 1.290 < 2) from pure Weyl density',
    residualTractable: true,
    residualProvenIrreducible: false,
  }),

  resolution: Object.freeze({
    question: 'Does the C > B ranking correspond to a strictly FASTER N-exponent or only a BETTER CONSTANT?',
    answer: 'NEITHER on the rate axis: the ranking is on a THIRD axis -- UNCONDITIONAL CONSUMABILITY READINESS.',
    isStrictlyFasterExponent: false,
    isBetterConstantOnly: false,
    rankingReflects:
      'unconditional-consumability readiness (perNForm + unconditional + gapsClosed + residualTractable); the ' +
      'imp-36045 scoring axes do NOT measure decay speed, so the ranking cannot assert a faster exponent',
    whyNotFasterExponent:
      'Route-C has NO pinned per-N exponent: its bound magnitude / N-scaling are fixed by the OPEN G3a_max_gap ' +
      'extremal statistics. The only pinned exponent in play is Route-B -1/4, so no C-vs-B exponent race exists.',
    whereItLandsOnBinary:
      'closest to the "better constant" branch: Route-C wins on STRUCTURE (per-N by construction + unconditional ' +
      '+ tractable residual), not on a demonstrated faster rate. Route-B owns the -1/4 form but only as a ' +
      'deviation bound whose per-N upgrade re-imports GUE.',
    conditionalIllustration:
      'IF G3a_max_gap were discharged with a GUE-type sqrt(log N) max-gap scale, Route-C would acquire a per-N ' +
      'form -- but that closure is the open residual itself and risks importing extremal-statistics input beyond ' +
      'pure Weyl (cf. Route-A C_mb), so NO Route-C exponent (fast or slow) can be asserted. NOT a claim.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    comparesExponents: true,
    routeCExponentPinned: false,
    rankingImpliesFasterExponent: false,
    g3aMaxGapStaysOpen: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Comparison of the Route-B explicit per-N exponent (-1/4) against Route-C, resolving that the imp-36045 ' +
      'C > B > A ranking reflects unconditional-consumability readiness, NOT a strictly faster N-exponent ' +
      '(Route-C exponent unquantified, gated on the open G3a_max_gap). Closes nothing; per-N translation and ' +
      'G3a_max_gap stay OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON_ASSERTIONS = [
  {
    id: 'imp36151-routeB-exponent-minus-quarter-pinned',
    why: 'Route-B is the only route with an explicit per-N rate; its leading exponent must be -1/4 and the ' +
         'wide-window log-log slope of r_B(N) must approach -1/4 from ABOVE as the sqrt(log) dressing dilutes.',
    holds: () =>
      ROUTE_B_LEADING_EXPONENT === -0.25 &&
      SLOPE_APPROACHES_QUARTER === true &&
      SLOPE_FAR > ROUTE_B_LEADING_EXPONENT &&
      SLOPE_FAR < SLOPE_MID,
  },
  {
    id: 'imp36151-routeC-exponent-unquantified',
    why: 'Route-C supplies a per-N bound BY CONSTRUCTION but has NO pinned exponent: its N-scaling is gated on ' +
         'the OPEN G3a_max_gap extremal max-gap statistics, so no explicit r_C(N) power exists to compare.',
    holds: () => {
      const c = IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.routeC;
      return (
        c.exponentPinned === false &&
        c.leadingExponent === null &&
        c.rateForm === null &&
        /G3a_max_gap/.test(c.exponentBlockedBy)
      );
    },
  },
  {
    id: 'imp36151-ranking-is-readiness-not-faster-exponent',
    why: 'CORE RESOLUTION: the C > B ranking reflects unconditional-consumability readiness, NOT a strictly ' +
         'faster N-exponent -- the imp-36045 scoring axes do not measure decay speed.',
    holds: () => {
      const r = IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.resolution;
      return (
        r.isStrictlyFasterExponent === false &&
        /readiness/.test(r.rankingReflects) &&
        /do NOT measure decay speed/i.test(r.rankingReflects)
      );
    },
  },
  {
    id: 'imp36151-lands-on-constant-not-rate-axis',
    why: 'Mapped onto the ticket binary, the C > B edge is structural (per-N by construction + unconditional + ' +
         'tractable residual) -- the "better constant" branch -- NOT a faster rate exponent.',
    holds: () => {
      const r = IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.resolution;
      return (
        /better constant/.test(r.whereItLandsOnBinary) &&
        /STRUCTURE|structural/.test(r.whereItLandsOnBinary) &&
        /G3a_max_gap/.test(r.whyNotFasterExponent)
      );
    },
  },
  {
    id: 'imp36151-conditional-illustration-not-a-claim',
    why: 'The GUE-type sqrt(log N) max-gap illustration is explicitly CONDITIONAL and NOT a claim -- closing ' +
         'G3a_max_gap that way risks importing extremal statistics beyond pure Weyl (cf. Route-A C_mb).',
    holds: () => {
      const r = IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.resolution;
      return /NOT a claim/.test(r.conditionalIllustration) && /beyond\s+pure\s+Weyl/.test(r.conditionalIllustration);
    },
  },
  {
    id: 'imp36151-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a COMPARISON that closes NOTHING, discharges no gap, does not pin the Route-C ' +
         'exponent, keeps G3a_max_gap OPEN, carries NO RH verdict, no refereed bound is changed.',
    holds: () => {
      const h = IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.comparesExponents === true &&
        h.routeCExponentPinned === false &&
        h.rankingImpliesFasterExponent === false &&
        h.g3aMaxGapStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36151-routeC-vs-routeB-perN-exponent-comparison assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON;
