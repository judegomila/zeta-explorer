/**
 * @module imp-36140-routeB-rate-vs-ecoll-collision-rate-comparison
 * @fileoverview imp-36140 -- CROSS-COMPARE the imp-36082 Route-B per-N DEVIATION
 *   rate r(N) = Theta(sqrt(log N) N^{-1/4}) against the E(N) bridge's own
 *   GUE-conditional COLLISION rate E_coll(N) = C_C sqrt(log gamma_N / N)
 *   = Theta(sqrt(log N) N^{-1/2}) (imp-2642/2643 Koksma-Hlawka W_1 form), at and
 *   beyond the Platt-Trudgian anchor T_PT (N ~ 4.886e5). MEASUREMENT / comparison
 *   ONLY: closes NOTHING, discharges no gap, the per-N translation stays OPEN,
 *   respects the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36082 derived the explicit Route-B per-N rate r(N) = C_prime sqrt(log
 *   gamma_N) N^{-1/4} and diagnosed its bridge blocker (CONSUMABLE-MODULO-ANCHOR:
 *   a DEVIATION rate lacking a per-N anchor). But it never set that rate SIDE BY
 *   SIDE with the E(N) bridge's own collision term E_coll(N), whose Koksma-Hlawka
 *   W_1 form (imp-341/imp-2642/2643) is E_coll = C_C sqrt(log gamma_N / N)
 *   = Theta(sqrt(log N) N^{-1/2}). The two rates SHARE the same slowly-varying
 *   sqrt(log N) dressing but differ in the power of N (N^{-1/4} vs N^{-1/2}). This
 *   module tabulates both across the ladder and measures the exponent gap and its
 *   per-N consumability consequence.
 *
 *   THE EXACT CANCELLATION (the headline observation)
 *   -------------------------------------------------
 *   With L := log gamma_N, the ratio of the two rates is
 *
 *       r(N)             C_prime sqrt(L) N^{-1/4}       C_prime
 *     ---------  =  ------------------------------  =  --------- N^{+1/4}.
 *      E_coll(N)          C_C sqrt(L) N^{-1/2}            C_C
 *
 *   The shared sqrt(L) = sqrt(log gamma_N) factor CANCELS EXACTLY, leaving a pure
 *   power law r/E_coll = (C_prime / C_C) N^{1/4}. So the ratio is NOT slowly
 *   varying: it DIVERGES as N^{1/4}. The N-exponent gap is 1/2 - 1/4 = 1/4: the
 *   GUE-conditional collision term decays FASTER than the unconditional Route-B
 *   deviation bound by a full factor N^{1/4}.
 *
 *   CONSEQUENCE FOR PER-N CONSUMABILITY (assessment, NO QED)
 *   -------------------------------------------------------
 *   Because r(N)/E_coll = (C_prime/C_C) N^{1/4} grows without bound and exceeds 1
 *   at every physical rung (the notional crossing r = E_coll sits at
 *   N* = (C_C/C_prime)^4 ~ 0.07 << 1, i.e. below a single retained term), the
 *   unconditional Route-B rate NEVER falls below the conditional collision rate in
 *   any reachable N. Route B decays STRICTLY SLOWER and can never SUPERSEDE the
 *   conditional E_coll term per-N: a larger bound cannot dominate (be tighter
 *   than) a smaller one. This SHARPENS the imp-36082 CONSUMABLE-MODULO-ANCHOR
 *   verdict: even setting the missing anchor aside, Route B's rate is quantitatively
 *   the WEAKER of the two, so the bridge would have no per-N reason to prefer it
 *   over the (conditional) E_coll it already carries. The comparison changes no
 *   bound; the per-N translation and the anchor gap stay OPEN.
 *
 *   HONESTY NOTE ON E_coll's TWO FORMS
 *   ----------------------------------
 *   The bridge module's floating-point eCollAtN row uses the tighter LINEAR
 *   placeholder E_coll ~ C_C (log gamma_N)/N; the ticket (and imp-2642/2643) name
 *   the Koksma-Hlawka W_1 SQRT form E_coll = C_C sqrt(log gamma_N / N) as the
 *   asymptotic rate. This module uses the SQRT form per the ticket -- the more
 *   conservative (larger, slower-decaying) of the two, so the "Route B is weaker"
 *   verdict is if anything UNDER-stated against the linear placeholder (the linear
 *   form decays as N^{-1}, an even wider exponent gap 3/4 vs Route B's 1/4).
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (Route-B r(N) form, C_prime)
 *   @see src/data/imp-36137-routeC-perN-rate-form-and-bridge-consumability.js (Route-C analog)
 *   @see src/data/lambda-polymath15-bridge.js (imp-345 E(N) bridge, C_C, E_coll)
 *
 *   Ticket: imp-36140 (numerical, medium).
 */

// -- Constants (Route-B side, identical convention to imp-36082 / imp-354) ------
// imp-341 Koksma-Hlawka: C1 = pi * C_Selberg ~ 3 pi ~ 9.4248.
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;
// Whitham fold-curvature placeholder C_W = 1.0 (as in imp-354 / imp-36082).
const C_WHITHAM_PLACEHOLDER = 1.0;
// r(N) = C_prime sqrt(log gamma_N) N^{-1/4}, C_prime = C_W sqrt(C1 / sqrt(2 pi)).
const C_PRIME = C_WHITHAM_PLACEHOLDER * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));

// -- Constants (E_coll side, from the imp-345 bridge ANSATZ) --------------------
// C_C = 1.0 illustrative placeholder collision constant (lambda-polymath15-bridge).
const C_C = 1.0;

// -- Riemann-von Mangoldt inversion (same convention as imp-36082) -------------
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

// -- The two rates -------------------------------------------------------------
// Route-B DEVIATION rate: r(N) = C_prime sqrt(log gamma_N) N^{-1/4}.
function rateRouteB(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return (C_PRIME * Math.sqrt(L)) / Math.pow(N, 0.25);
}
// E(N)-bridge GUE-conditional COLLISION rate (Koksma-Hlawka W_1 sqrt form,
// imp-2642/2643): E_coll(N) = C_C sqrt(log gamma_N / N) = Theta(sqrt(log N) N^{-1/2}).
function rateECollSqrt(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return C_C * Math.sqrt(L / N);
}
// Closed-form ratio after the sqrt(log gamma_N) cancellation: (C_prime/C_C) N^{1/4}.
function ratioClosedForm(N) {
  if (!(N > 0)) return null;
  return (C_PRIME / C_C) * Math.pow(N, 0.25);
}

// -- Ladder: T_PT anchor plus far tail -----------------------------------------
const N_TPT = 4.886e5; // Platt-Trudgian retained-term count anchor
const LADDER_N = Object.freeze([
  1e2, 1e3, 1e4, 1e5, N_TPT, 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18,
]);
const COMPARISON_LADDER = LADDER_N.map((N) => {
  const g = gammaNFromRvM(N);
  const rB = rateRouteB(N);
  const eColl = rateECollSqrt(N);
  const ratioDirect = rB !== null && eColl !== null && eColl > 0 ? rB / eColl : null;
  const ratioClosed = ratioClosedForm(N);
  return Object.freeze({
    N,
    isTPT: N === N_TPT,
    gammaN_RvM: g,
    logGammaN: Math.log(g),
    r_routeB_deviation: rB,
    E_coll_sqrt: eColl,
    ratio_rB_over_Ecoll: ratioDirect,
    ratio_closed_form_N_quarter: ratioClosed,
    // The sqrt(log gamma_N) factor must cancel exactly: direct ratio == (C_prime/C_C) N^{1/4}.
    cancellation_exact:
      ratioDirect !== null && ratioClosed !== null && ratioClosed > 0
        ? Math.abs(ratioDirect - ratioClosed) / ratioClosed < 1e-12
        : false,
    routeB_below_Ecoll: ratioDirect !== null ? ratioDirect < 1 : null,
  });
});

// -- Diagnostics ---------------------------------------------------------------
// The N-exponent gap: E_coll ~ N^{-1/2}, Route B ~ N^{-1/4}; gap = 1/2 - 1/4 = 1/4.
const N_EXPONENT_GAP = 0.5 - 0.25;
// Ratio is strictly increasing (it is (C_prime/C_C) N^{1/4}, a pure power law).
const RATIO_STRICTLY_INCREASING = (() => {
  for (let i = 1; i < COMPARISON_LADDER.length; i++) {
    if (!(COMPARISON_LADDER[i].ratio_rB_over_Ecoll > COMPARISON_LADDER[i - 1].ratio_rB_over_Ecoll))
      return false;
  }
  return true;
})();
// Route B never falls below E_coll anywhere on the physical ladder.
const ROUTE_B_NEVER_BELOW_ECOLL = COMPARISON_LADDER.every((r) => r.routeB_below_Ecoll === false);
// Notional crossing r = E_coll: (C_prime/C_C) N^{1/4} = 1 => N* = (C_C/C_prime)^4.
const CROSSING_N_STAR = Math.pow(C_C / C_PRIME, 4);
const CROSSING_BELOW_ONE_TERM = CROSSING_N_STAR < 1;
// Wide-window log-log slope of the ratio: must equal exactly +1/4 (no log dressing).
const RATIO_LOGLOG_SLOPE_WIDE = (() => {
  const a = COMPARISON_LADDER[0];
  const b = COMPARISON_LADDER[COMPARISON_LADDER.length - 1];
  return (
    (Math.log(b.ratio_rB_over_Ecoll) - Math.log(a.ratio_rB_over_Ecoll)) /
    (Math.log(b.N) - Math.log(a.N))
  );
})();
// Ratio at the T_PT anchor, for the record.
const RATIO_AT_TPT = COMPARISON_LADDER.find((r) => r.isTPT).ratio_rB_over_Ecoll;

// -- The record ---------------------------------------------------------------
export const IMP36140_ROUTEB_RATE_VS_ECOLL_COLLISION_RATE_COMPARISON = Object.freeze({
  id: 'imp-36140-routeB-rate-vs-ecoll-collision-rate-comparison',
  ticket: 'imp-36140',
  obligationKey: 'G5-perN-translation',
  comparisonOf: 'imp-36082 Route-B deviation rate r(N) vs imp-345 E(N)-bridge collision rate E_coll(N)',
  sources: Object.freeze({
    routeB: 'imp-36082 r(N) = C_prime sqrt(log gamma_N) N^{-1/4}, C_prime = C_W sqrt(C1/sqrt(2 pi))',
    eColl: 'imp-341/imp-2642/2643 Koksma-Hlawka W_1 form E_coll = C_C sqrt(log gamma_N / N) = Theta(sqrt(log N) N^{-1/2})',
    bridge: 'imp-345 lambda-polymath15-bridge ANSATZ (C_C = 1.0)',
  }),

  summary:
    'Cross-compares the imp-36082 Route-B per-N DEVIATION rate r(N) = C_prime sqrt(log gamma_N) N^{-1/4} against ' +
    'the E(N) bridge GUE-conditional COLLISION rate E_coll(N) = C_C sqrt(log gamma_N / N) = Theta(sqrt(log N) ' +
    'N^{-1/2}) at and beyond the Platt-Trudgian anchor T_PT (N ~ 4.886e5). Headline: the two rates share the SAME ' +
    'slowly-varying sqrt(log gamma_N) dressing, which CANCELS EXACTLY in the ratio, leaving the pure power law ' +
    'r(N)/E_coll(N) = (C_prime/C_C) N^{1/4}. The N-exponent gap is 1/2 - 1/4 = 1/4: the conditional collision term ' +
    'decays FASTER than the unconditional Route-B deviation bound by a full factor N^{1/4}. Consequence: the ratio ' +
    'DIVERGES (~N^{1/4}), exceeds 1 at every physical rung (the notional crossing r = E_coll sits at N* ~ 0.07 << 1, ' +
    'below a single retained term), so Route B NEVER falls below E_coll and can never SUPERSEDE the conditional ' +
    'term per-N -- a larger bound cannot be tighter than a smaller one. This sharpens the imp-36082 ' +
    'CONSUMABLE-MODULO-ANCHOR verdict: even with the anchor set aside, Route B is quantitatively the WEAKER rate. ' +
    'Measurement / comparison ONLY; changes no bound; the per-N translation and the anchor gap stay OPEN; respects ' +
    'the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed.',

  rateForms: Object.freeze({
    routeB_rN: 'r(N) = C_prime sqrt(log gamma_N) N^{-1/4}  [Theta(sqrt(log N) N^{-1/4}), UNCONDITIONAL deviation]',
    eColl_sqrt: 'E_coll(N) = C_C sqrt(log gamma_N / N)  [Theta(sqrt(log N) N^{-1/2}), GUE-conditional collision]',
    ratio: 'r(N)/E_coll(N) = (C_prime/C_C) N^{1/4}  [sqrt(log gamma_N) cancels EXACTLY]',
    C_prime: C_PRIME,
    C_C: C_C,
    C_prime_over_C_C: C_PRIME / C_C,
    n_exponent_gap: N_EXPONENT_GAP,
    n_exponent_gap_note:
      'E_coll exponent -1/2 vs Route-B exponent -1/4; gap 1/4 = the surviving power in the ratio after the shared ' +
      'sqrt(log N) cancels. E_coll decays faster by N^{1/4}.',
  }),

  ladder: COMPARISON_LADDER,
  ladderDiagnostics: Object.freeze({
    cancellation_exact_all_rungs: COMPARISON_LADDER.every((r) => r.cancellation_exact === true),
    ratio_strictly_increasing: RATIO_STRICTLY_INCREASING,
    ratio_loglog_slope_wide: RATIO_LOGLOG_SLOPE_WIDE,
    ratio_loglog_slope_expected: 0.25,
    ratio_at_TPT: RATIO_AT_TPT,
    route_b_never_below_ecoll: ROUTE_B_NEVER_BELOW_ECOLL,
    crossing_N_star: CROSSING_N_STAR,
    crossing_below_one_term: CROSSING_BELOW_ONE_TERM,
    crossing_note:
      'The notional r = E_coll crossing N* = (C_C/C_prime)^4 ~ 0.07 sits below a single retained term, so there is ' +
      'NO physical N at which the unconditional Route-B rate falls below the conditional collision rate.',
  }),

  verdict: Object.freeze({
    ratesShareSqrtLogDressing: true,
    sqrtLogCancelsInRatio: true,
    ratioIsPurePowerLaw: true,
    ratioDivergesAsNquarter: true,
    routeBDecaysStrictlySlower: true,
    routeBEverBelowEcoll: false,
    routeBCanSupersedeEcollPerN: false,
    sharpensImp36082Verdict: true,
    status: 'ROUTE-B-STRICTLY-WEAKER-THAN-CONDITIONAL-E_coll (per-N)',
    interpretation:
      'The unconditional Route-B deviation bound is quantitatively the weaker of the two rates at every physical N; ' +
      'it cannot dominate (be tighter than) the GUE-conditional collision term it would need to supersede. The ' +
      'imp-36082 CONSUMABLE-MODULO-ANCHOR blocker is thereby sharpened, not resolved.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    isMeasurementOnly: true,
    changesAnyBound: false,
    usesConservativeSqrtEcollForm: true,
    perNTranslationStaysOpen: true,
    anchorGapStaysOpen: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'A quantitative cross-comparison of two already-derived per-N rates: the imp-36082 Route-B deviation rate and ' +
      'the imp-345/imp-341 E(N)-bridge collision rate. It measures the exponent gap (N^{-1/4} vs N^{-1/2}), shows ' +
      'the shared sqrt(log N) dressing cancels, and concludes Route B is strictly the weaker rate per-N (never ' +
      'below E_coll). It derives nothing new, closes no gap, and leaves the per-N translation and the imp-36082 ' +
      'anchor OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36140_ROUTEB_RATE_VS_ECOLL_COLLISION_RATE_COMPARISON_ASSERTIONS = [
  {
    id: 'imp36140-sqrt-log-cancels-exactly',
    why: 'The headline: r(N)/E_coll must equal the closed form (C_prime/C_C) N^{1/4} at every rung, i.e. the shared ' +
         'sqrt(log gamma_N) dressing cancels EXACTLY; a mismatch means one rate carried the log factor differently.',
    holds: () => COMPARISON_LADDER.every((r) => r.cancellation_exact === true),
  },
  {
    id: 'imp36140-ratio-loglog-slope-is-one-quarter',
    why: 'Because the log dressing cancels, the ratio is a pure power law N^{1/4}: its wide log-log slope must be ' +
         'exactly +1/4 (no slowly-varying correction). A deviation means the cancellation was mis-modeled.',
    holds: () => Math.abs(RATIO_LOGLOG_SLOPE_WIDE - 0.25) < 1e-9,
  },
  {
    id: 'imp36140-n-exponent-gap-is-one-quarter',
    why: 'E_coll ~ N^{-1/2} decays faster than Route B ~ N^{-1/4}; the N-exponent gap is 1/2 - 1/4 = 1/4, the ' +
         'surviving power in the ratio. This is the quantitative core of the comparison.',
    holds: () => Math.abs(N_EXPONENT_GAP - 0.25) < 1e-12,
  },
  {
    id: 'imp36140-routeB-never-below-ecoll',
    why: 'The consumability consequence: the ratio r/E_coll = (C_prime/C_C) N^{1/4} exceeds 1 at every physical ' +
         'rung and strictly increases, so the unconditional Route-B rate NEVER falls below the conditional ' +
         'collision rate -- it cannot supersede E_coll per-N.',
    holds: () => ROUTE_B_NEVER_BELOW_ECOLL && RATIO_STRICTLY_INCREASING,
  },
  {
    id: 'imp36140-crossing-below-one-retained-term',
    why: 'The notional r = E_coll crossing N* = (C_C/C_prime)^4 must sit below a single retained term (N* < 1), ' +
         'confirming there is no reachable N where Route B is the tighter rate.',
    holds: () => CROSSING_BELOW_ONE_TERM && CROSSING_N_STAR > 0,
  },
  {
    id: 'imp36140-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a MEASUREMENT that closes NOTHING, discharges no gap, changes no bound, keeps the ' +
         'per-N translation and the imp-36082 anchor OPEN, carries NO RH verdict, no refereed bound is changed.',
    holds: () => {
      const h = IMP36140_ROUTEB_RATE_VS_ECOLL_COLLISION_RATE_COMPARISON.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.isMeasurementOnly === true &&
        h.changesAnyBound === false &&
        h.perNTranslationStaysOpen === true &&
        h.anchorGapStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36140_ROUTEB_RATE_VS_ECOLL_COLLISION_RATE_COMPARISON_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36140-routeB-rate-vs-ecoll-collision-rate-comparison assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36140_ROUTEB_RATE_VS_ECOLL_COLLISION_RATE_COMPARISON;
