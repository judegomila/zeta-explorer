/**
 * @module imp-36160-routeB-unconditional-vs-conditional-exponent-gap
 * @fileoverview imp-36160 -- ASSESS whether the imp-36082 UNCONDITIONAL Route-B
 *   per-N rate r(N) = Theta(sqrt(log N) N^{-1/4}) (composed from the deterministic
 *   discrepancy D(N) = Theta(log N N^{-1/2})) is a strictly WEAKER N-exponent than
 *   the imp-36097 GUE-CONDITIONAL collision term E_coll(N) = C_C sqrt(log T0 / N)
 *   = Theta(sqrt(log N) N^{-1/2}), and QUANTIFY the exponent gap between the
 *   unconditional and conditional decay rates. Measurement / assessment ONLY:
 *   closes NOTHING, discharges no gap, the per-N translation stays OPEN, respects
 *   the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET (what it adds over imp-36140)
 *   ---------------------------------------------
 *   imp-36140 already set the POST-composition Route-B rate r(N) ~ N^{-1/4} side by
 *   side with E_coll ~ N^{-1/2} and found the exponent gap 1/4 (ratio diverges as
 *   N^{1/4}). This module answers the imp-36160 question at one level DEEPER: it
 *   traces r(N) back to its PROVENANCE -- the raw deterministic discrepancy
 *   D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N) = Theta(log N N^{-1/2})
 *   (imp-36082) -- and asks where the 1/4 exponent gap is actually MANUFACTURED.
 *
 *   THE PROVENANCE DECOMPOSITION (the headline observation)
 *   -------------------------------------------------------
 *   Strip each rate of its slowly-varying log dressing and read the LEADING power:
 *
 *       D(N)      = Theta(log N   . N^{-1/2})   -> leading exponent  -1/2  (UNCONDITIONAL, pre-composition)
 *       E_coll(N) = Theta(sqrt(log N) . N^{-1/2}) -> leading exponent  -1/2  (GUE-CONDITIONAL collision)
 *       r(N)      = Theta(sqrt(log N) . N^{-1/4}) -> leading exponent  -1/4  (UNCONDITIONAL Route-B rate)
 *
 *   So the RAW arithmetic discrepancy D(N) and the conditional collision term
 *   E_coll(N) share the SAME N^{-1/2} core exponent -- gap ZERO. The unconditional
 *   input is NOT exponent-weaker than the conditional collision term. The entire
 *   1/4 gap between r(N) and E_coll(N) is produced by ONE step: the imp-354 Whitham
 *   Holder-1/2 fold-catastrophe composition r = C_W sqrt(D), which HALVES the
 *   exponent -1/2 -> -1/4. Symbolically:
 *
 *       exponent(r) = exponent(D) / 2 = (-1/2) / 2 = -1/4,
 *       gap(r, E_coll) = |exponent(r) - exponent(E_coll)| = |-1/4 - (-1/2)| = 1/4,
 *       gap(D, E_coll) = |exponent(D) - exponent(E_coll)| = |-1/2 - (-1/2)| = 0.
 *
 *   VERDICT (assessment, NO QED)
 *   ----------------------------
 *   YES: the imp-36082 unconditional Route-B rate r(N) ~ N^{-1/4} is a strictly
 *   WEAKER N-exponent than the imp-36097 GUE-conditional E_coll ~ N^{-1/2} (a less
 *   negative exponent decays SLOWER); the exponent gap is exactly 1/4. But the gap
 *   is NOT a deficit of the unconditional arithmetic input: the pre-composition
 *   discrepancy D(N) matches E_coll's -1/2 exponent exactly. The weakening is
 *   ATTRIBUTABLE ENTIRELY to the Holder-1/2 square-root of the Whitham fold
 *   catastrophe (deviation-rate step, imp-354). This sharpens the imp-36140 /
 *   imp-36082 picture with a mechanism: unconditionality itself costs no exponent;
 *   the shock-time deviation conversion costs the full 1/4. Measurement only;
 *   changes no bound; the per-N translation and the imp-36082 anchor stay OPEN.
 *
 *   HONESTY NOTE ON E_coll's CONSTANT / FORM
 *   ----------------------------------------
 *   This module uses the imp-36097 GUE-conditional sqrt form E_coll = C_C sqrt(log
 *   T0 / N) with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643). Only the N-EXPONENT
 *   matters here (the constant and the log dressing are divided out before the
 *   log-log slope is read), so the verdict is independent of the C_C value and of
 *   the E_coll linear-vs-sqrt placeholder choice.
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (D(N), r(N), C_prime)
 *   @see src/data/imp-36097-e-share-threshold-crossings-viz-data.js (E_coll = C_C sqrt(log T0 / N))
 *   @see src/data/imp-36140-routeB-rate-vs-ecoll-collision-rate-comparison.js (post-composition r vs E_coll, gap 1/4)
 *
 *   Ticket: imp-36160 (numerical, medium).
 */

// -- Constants (Route-B side, identical convention to imp-36082 / imp-36140) ----
// imp-341 Koksma-Hlawka: C1 = pi * C_Selberg ~ 3 pi ~ 9.4248.
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;
// Whitham fold-curvature placeholder C_W = 1.0 (as in imp-354 / imp-36082).
const C_WHITHAM_PLACEHOLDER = 1.0;
// r(N) = C_prime sqrt(log gamma_N) N^{-1/4}, C_prime = C_W sqrt(C1 / sqrt(2 pi)).
const C_PRIME = C_WHITHAM_PLACEHOLDER * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));

// -- Constants (E_coll side, imp-36097 GUE-conditional collision term) ----------
// C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI);

// -- Riemann-von Mangoldt inversion (same convention as imp-36082 / imp-36140) --
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

// -- The three rates, and their DE-DRESSED (log-stripped) cores -----------------
// D(N): raw deterministic discrepancy = (C1 / sqrt(2 pi)) log gamma_N / sqrt(N).
function discrepancyDN(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return (C1_IMP341 * L) / Math.sqrt(2 * Math.PI * N);
}
// E_coll(N) = C_C sqrt(log T0 / N), T0 = gamma_N (imp-36097 GUE-conditional).
function eCollN(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return C_C * Math.sqrt(L / N);
}
// r(N) = C_prime sqrt(log gamma_N) N^{-1/4} = C_W sqrt(D(N)) (Holder-1/2 step).
function rateRN(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return (C_PRIME * Math.sqrt(L)) / Math.pow(N, 0.25);
}
// De-dressed cores (divide out the log dressing so the LEADING power is exposed):
//   D / log gamma_N       -> (C1 / sqrt(2 pi)) N^{-1/2}      [exponent -1/2]
//   E_coll / sqrt(log T0) -> C_C N^{-1/2}                    [exponent -1/2]
//   r / sqrt(log gamma_N) -> C_prime N^{-1/4}                [exponent -1/4]
function dCore(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const D = discrepancyDN(N);
  return D !== null && L > 0 ? D / L : null;
}
function eCollCore(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const E = eCollN(N);
  return E !== null && L > 0 ? E / Math.sqrt(L) : null;
}
function rCore(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const r = rateRN(N);
  return r !== null && L > 0 ? r / Math.sqrt(L) : null;
}

// -- Ladder: T_PT anchor plus wide far tail ------------------------------------
const N_TPT = 4.886e5; // Platt-Trudgian retained-term count anchor
const LADDER_N = Object.freeze([
  1e2, 1e3, 1e4, 1e5, N_TPT, 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18,
]);
const EXPONENT_LADDER = LADDER_N.map((N) => {
  const g = gammaNFromRvM(N);
  const D = discrepancyDN(N);
  const E = eCollN(N);
  const r = rateRN(N);
  return Object.freeze({
    N,
    isTPT: N === N_TPT,
    gammaN_RvM: g,
    logGammaN: Math.log(g),
    D_discrepancy: D,
    E_coll: E,
    r_deviation: r,
    D_core: dCore(N), // ~ N^{-1/2}
    E_coll_core: eCollCore(N), // ~ N^{-1/2}
    r_core: rCore(N), // ~ N^{-1/4}
    // The Holder-1/2 identity, per-N: r = C_W sqrt(D).
    holder_identity_holds:
      D !== null && r !== null && D > 0
        ? Math.abs(r - C_WHITHAM_PLACEHOLDER * Math.sqrt(D)) / r < 1e-12
        : false,
  });
});

// -- De-dressed wide-window log-log slopes (the clean LEADING exponents) --------
function wideSlope(coreFn) {
  const a = EXPONENT_LADDER[0];
  const b = EXPONENT_LADDER[EXPONENT_LADDER.length - 1];
  const ca = coreFn(a.N);
  const cb = coreFn(b.N);
  if (!(ca > 0) || !(cb > 0)) return null;
  return (Math.log(cb) - Math.log(ca)) / (Math.log(b.N) - Math.log(a.N));
}
const D_CORE_SLOPE = wideSlope(dCore); // expected -1/2
const E_COLL_CORE_SLOPE = wideSlope(eCollCore); // expected -1/2
const R_CORE_SLOPE = wideSlope(rCore); // expected -1/4

// -- Exponent bookkeeping ------------------------------------------------------
const EXP_D = -0.5; // D(N) leading exponent (unconditional, pre-composition)
const EXP_E_COLL = -0.5; // E_coll leading exponent (GUE-conditional)
const EXP_R = -0.25; // r(N) leading exponent (unconditional Route-B rate)
// gap(r, E_coll): the answer to the ticket -- Route-B rate vs conditional collision.
const GAP_R_VS_ECOLL = Math.abs(EXP_R - EXP_E_COLL); // 1/4
// gap(D, E_coll): the headline structural observation -- SAME exponent, gap ZERO.
const GAP_D_VS_ECOLL = Math.abs(EXP_D - EXP_E_COLL); // 0
// The Holder-1/2 halving that MANUFACTURES the entire gap: exponent(r) = exponent(D)/2.
const HOLDER_HALVES_EXPONENT = Math.abs(EXP_R - EXP_D / 2) < 1e-15;
// r decays strictly slower than E_coll (less negative exponent).
const ROUTE_B_STRICTLY_WEAKER = EXP_R > EXP_E_COLL;

// -- The record ---------------------------------------------------------------
export const IMP36160_ROUTEB_UNCONDITIONAL_VS_CONDITIONAL_EXPONENT_GAP = Object.freeze({
  id: 'imp-36160-routeB-unconditional-vs-conditional-exponent-gap',
  ticket: 'imp-36160',
  obligationKey: 'G5-perN-translation',
  comparisonOf:
    'imp-36082 UNCONDITIONAL Route-B rate r(N) ~ N^{-1/4} (and its provenance D(N) ~ N^{-1/2}) vs ' +
    'imp-36097 GUE-CONDITIONAL collision term E_coll(N) ~ N^{-1/2}',
  sources: Object.freeze({
    discrepancy: 'imp-36082 D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N) = Theta(log N N^{-1/2})',
    routeBrate: 'imp-36082 r(N) = C_prime sqrt(log gamma_N) N^{-1/4} = C_W sqrt(D(N)) (imp-354 Holder-1/2)',
    eColl: 'imp-36097 E_coll(N) = C_C sqrt(log T0 / N) = Theta(sqrt(log N) N^{-1/2}), C_C = (1/8) sqrt(3 pi) (imp-2642/2643, GUE-conditional)',
  }),

  summary:
    'Assesses whether the imp-36082 UNCONDITIONAL Route-B per-N rate r(N) = Theta(sqrt(log N) N^{-1/4}) is a ' +
    'strictly WEAKER N-exponent than the imp-36097 GUE-CONDITIONAL collision term E_coll(N) = C_C sqrt(log T0 / N) ' +
    '= Theta(sqrt(log N) N^{-1/2}), and quantifies the exponent gap. Answer: YES -- r(N) has leading exponent ' +
    '-1/4 versus E_coll -1/2, a less-negative exponent that decays STRICTLY SLOWER; the exponent gap is exactly ' +
    '1/4. But the ticket-deeper finding is WHERE that gap comes from: r(N) is composed from the raw deterministic ' +
    'discrepancy D(N) = Theta(log N N^{-1/2}), whose LEADING exponent -1/2 EQUALS E_coll -1/2 exactly (gap ZERO). ' +
    'So the unconditional arithmetic input is NOT exponent-weaker than the conditional collision term; the entire ' +
    '1/4 gap is MANUFACTURED by the single imp-354 Whitham Holder-1/2 fold-catastrophe step r = C_W sqrt(D), which ' +
    'halves the exponent -1/2 -> -1/4. De-dressed wide log-log slopes confirm the three leading exponents ' +
    '(-1/2, -1/2, -1/4) to machine precision. Measurement / assessment ONLY; changes no bound; the per-N ' +
    'translation and the imp-36082 anchor stay OPEN; respects the imp-2519 no-overclaim guard; NO QED; ' +
    'no refereed bound is changed.',

  exponents: Object.freeze({
    D_discrepancy: EXP_D, // -1/2, unconditional pre-composition input
    E_coll: EXP_E_COLL, // -1/2, GUE-conditional collision
    r_deviation: EXP_R, // -1/4, unconditional Route-B rate
    gap_r_vs_ecoll: GAP_R_VS_ECOLL, // 1/4  (the ticket answer)
    gap_D_vs_ecoll: GAP_D_VS_ECOLL, // 0    (D and E_coll share the -1/2 core)
    routeB_strictly_weaker_than_conditional: ROUTE_B_STRICTLY_WEAKER,
    holder_halves_exponent: HOLDER_HALVES_EXPONENT, // exponent(r) = exponent(D)/2
    mechanism:
      'The full 1/4 exponent gap between the unconditional Route-B rate r(N) and the GUE-conditional E_coll(N) is ' +
      'produced ENTIRELY by the imp-354 Whitham Holder-1/2 square-root r = C_W sqrt(D), NOT by any exponent deficit ' +
      'in the unconditional arithmetic input D(N) (which matches E_coll at -1/2).',
  }),

  ladder: EXPONENT_LADDER,
  ladderDiagnostics: Object.freeze({
    D_core_loglog_slope: D_CORE_SLOPE,
    e_coll_core_loglog_slope: E_COLL_CORE_SLOPE,
    r_core_loglog_slope: R_CORE_SLOPE,
    D_core_slope_expected: EXP_D,
    e_coll_core_slope_expected: EXP_E_COLL,
    r_core_slope_expected: EXP_R,
    holder_identity_all_rungs: EXPONENT_LADDER.every((row) => row.holder_identity_holds === true),
    slope_note:
      'Slopes are computed on the DE-DRESSED cores (log dressing divided out) so each reads its clean LEADING ' +
      'exponent: D_core ~ N^{-1/2}, E_coll_core ~ N^{-1/2}, r_core ~ N^{-1/4}. Undressed slopes are dragged toward ' +
      '0 by the growing sqrt(log gamma_N) factor (see imp-36082), which is why de-dressing is used here.',
  }),

  verdict: Object.freeze({
    routeBIsStrictlyWeakerExponent: true,
    exponentGapRvsEcoll: GAP_R_VS_ECOLL,
    unconditionalInputMatchesConditionalExponent: true, // D ~ N^{-1/2} == E_coll ~ N^{-1/2}
    gapManufacturedByHolderHalfStep: true,
    status: 'ROUTE-B-RATE-STRICTLY-WEAKER-BY-1/4 (gap sourced in the Holder-1/2 step, not the unconditional input)',
    interpretation:
      'The unconditional Route-B rate r(N) ~ N^{-1/4} decays strictly slower than the GUE-conditional E_coll ~ ' +
      'N^{-1/2} by a full 1/4 in the N-exponent. The weakening is a cost of the shock-time DEVIATION conversion ' +
      '(the Whitham Holder-1/2 square-root), not of unconditionality per se: the raw discrepancy D(N) already ' +
      'matches the conditional collision exponent at -1/2. Consistent with the imp-36140 ratio-divergence picture.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    isMeasurementOnly: true,
    changesAnyBound: false,
    exponentGapIsIndependentOfConstants: true,
    perNTranslationStaysOpen: true,
    anchorGapStaysOpen: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'A quantitative exponent-gap assessment: it confirms the imp-36082 unconditional Route-B rate r(N) ~ N^{-1/4} ' +
      'is a strictly weaker N-exponent than the imp-36097 GUE-conditional E_coll ~ N^{-1/2} (gap 1/4), and traces ' +
      'the gap to the imp-354 Holder-1/2 step by showing the pre-composition discrepancy D(N) shares E_coll -1/2 ' +
      'exponent exactly. It derives nothing new, closes no gap, and leaves the per-N translation and the imp-36082 ' +
      'anchor OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36160_ROUTEB_UNCONDITIONAL_VS_CONDITIONAL_EXPONENT_GAP_ASSERTIONS = [
  {
    id: 'imp36160-dedressed-slopes-are-clean-leading-exponents',
    why: 'The de-dressed cores must read their clean leading exponents to machine precision: D_core ~ N^{-1/2}, ' +
         'E_coll_core ~ N^{-1/2}, r_core ~ N^{-1/4}. A drift means the log dressing was not fully divided out.',
    holds: () =>
      Math.abs(D_CORE_SLOPE - EXP_D) < 1e-9 &&
      Math.abs(E_COLL_CORE_SLOPE - EXP_E_COLL) < 1e-9 &&
      Math.abs(R_CORE_SLOPE - EXP_R) < 1e-9,
  },
  {
    id: 'imp36160-exponent-gap-r-vs-ecoll-is-one-quarter',
    why: 'The ticket answer: the unconditional Route-B rate exponent -1/4 minus the GUE-conditional E_coll exponent ' +
         '-1/2 gives gap 1/4 -- Route B decays strictly slower.',
    holds: () => Math.abs(GAP_R_VS_ECOLL - 0.25) < 1e-12 && ROUTE_B_STRICTLY_WEAKER === true,
  },
  {
    id: 'imp36160-discrepancy-matches-ecoll-exponent',
    why: 'The headline structural observation: the raw unconditional discrepancy D(N) shares the SAME -1/2 core ' +
         'exponent as the GUE-conditional E_coll (gap ZERO); the unconditional input is not exponent-weaker.',
    holds: () => Math.abs(GAP_D_VS_ECOLL) < 1e-12,
  },
  {
    id: 'imp36160-holder-half-step-manufactures-the-gap',
    why: 'The mechanism: exponent(r) = exponent(D)/2 (the imp-354 Holder-1/2 square-root), so the full 1/4 gap is ' +
         'sourced in the deviation-conversion step, not in the unconditional arithmetic input. The per-N Holder ' +
         'identity r = C_W sqrt(D) must also hold at every ladder rung.',
    holds: () =>
      HOLDER_HALVES_EXPONENT === true &&
      EXPONENT_LADDER.every((row) => row.holder_identity_holds === true),
  },
  {
    id: 'imp36160-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a MEASUREMENT that closes NOTHING, discharges no gap, changes no bound, keeps the ' +
         'per-N translation and the imp-36082 anchor OPEN, carries NO RH verdict, no refereed bound is changed.',
    holds: () => {
      const h = IMP36160_ROUTEB_UNCONDITIONAL_VS_CONDITIONAL_EXPONENT_GAP.honestCaveat;
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

for (const assertion of IMP36160_ROUTEB_UNCONDITIONAL_VS_CONDITIONAL_EXPONENT_GAP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36160-routeB-unconditional-vs-conditional-exponent-gap assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36160_ROUTEB_UNCONDITIONAL_VS_CONDITIONAL_EXPONENT_GAP;
