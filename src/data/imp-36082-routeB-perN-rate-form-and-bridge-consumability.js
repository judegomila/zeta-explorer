/**
 * @module imp-36082-routeB-perN-rate-form-and-bridge-consumability
 * @fileoverview imp-36082 -- Derive the EXPLICIT per-N rate r(N) form that the
 *   Route-B (imp-341 / imp-344) UNCONDITIONAL Koksma-Hlawka lim-sup supplies, and
 *   ASSESS whether the Step-4 E(N) bridge constants (G6_polymath15_bridge, imp-345)
 *   can consume it. Assessment / scoping ONLY: closes NOTHING, discharges no gap,
 *   the per-N translation stays OPEN, respects the imp-2519 no-overclaim guard,
 *   NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   route-B-burgers (imp-36045) records the lim-sup CLOSED UNCONDITIONALLY but
 *   flags "Per-N translation OPEN -- see G6_polymath15_bridge (imp-345)"; the
 *   lim-sup alone yields no per-N rate. imp-36045 RANKED the three candidate
 *   routes (C > B > A) but did NOT write down the explicit r(N) FORM that Route-B
 *   itself supplies, nor pin down precisely WHY the E(N) bridge cannot consume it
 *   per-N. This module fills that gap: it derives the r(N) shape from the
 *   deterministic discrepancy bound and diagnoses the exact consumability blocker.
 *
 *   THE DETERMINISTIC DISCREPANCY BOUND (Route-B / imp-341)
 *   -------------------------------------------------------
 *   The Koksma-Hlawka bound on the empirical Stieltjes-transform discrepancy over
 *   the uniformity strip {Im z >= y}, using only the Selberg |S(T)| input (NO GUE):
 *
 *       psi_N(y)  <=  pi C_Selberg  ·  log gamma_N / (N y).
 *
 *   Evaluated at the uniformity strip y_N^sharp = sqrt(2 pi / N):
 *
 *       D(N) := psi_N(y_N^sharp)  <=  pi C_Selberg · log gamma_N / (N sqrt(2 pi / N))
 *                                  =  (pi C_Selberg / sqrt(2 pi)) · log gamma_N / sqrt(N).
 *
 *   D(N) is already a per-N NUMBER: explicit, unconditional, and -> 0 (which is
 *   exactly what drives lim sup_{N->inf} |t_c(N)| <= 0). Its shape is
 *   D(N) = Theta(log gamma_N · N^{-1/2}) ~ Theta(log N · N^{-1/2}).
 *
 *   THE WHITHAM Holder-1/2 COMPOSITION (imp-354) -> shock-time DEVIATION rate
 *   ------------------------------------------------------------------------
 *   The imp-354 Whitham fold-catastrophe lemma turns the transform discrepancy
 *   into a shock-time modulus with Holder exponent 1/2:
 *
 *       |t_c(m_N) - t_c(m_infinity)|  <=  C_W · sqrt(D(N))
 *                                      =  C_prime · sqrt(log gamma_N) · N^{-1/4},
 *
 *   with C_prime = C_W · sqrt(pi C_Selberg / sqrt(2 pi)) and C_W the fold-curvature
 *   constant. THIS is the explicit per-N rate r(N) that Route-B supplies:
 *
 *       r(N) := C_prime · sqrt(log gamma_N) · N^{-1/4},   r(N) = Theta(sqrt(log N) · N^{-1/4}).
 *
 *   THE CONSUMABILITY VERDICT (assessment, NO QED)
 *   ----------------------------------------------
 *   r(N) is a genuine per-N bound -- but on the DEVIATION |t_c(m_N) - t_c(m_inf)|
 *   from the LIMITING shock time, NOT on |t_c(N)| itself. The Step-4 E(N) bridge
 *   (imp-345, per imp-2564) needs an ABSOLUTE per-N bound |t_c(N)| <= r(N). To
 *   convert the deviation bound into an absolute one you must pin the limiting
 *   anchor t_c(m_inf) with a per-N-usable certificate (value AND finite-N side).
 *   The lim-sup only asserts t_c(m_inf) <= 0 ASYMPTOTICALLY -- it certifies neither
 *   the finite-N value nor its sign. Supplying that finite-N anchor is precisely
 *   the local-law RIGIDITY that re-imports the GUE / Erdos-Schlein-Yau dependence
 *   the lim-sup was engineered to avoid. Hence: the per-N rate r(N) EXISTS in
 *   explicit unconditional vanishing form, but the E(N) bridge CANNOT consume it
 *   as a per-N bound on |t_c(N)| without an extra unconditional anchor. Status:
 *   CONSUMABLE-MODULO-ANCHOR; the anchor is the OPEN per-N translation. This
 *   matches the imp-36045 Route-B verdict (unconditional source, asymptotic-only
 *   delivery) and adds the explicit r(N) FORM plus the precise blocker (missing
 *   per-N anchor, not a missing rate). Closes NOTHING; per-N stays OPEN.
 *
 *   @see src/data/imp-36045-perN-translation-route-readiness-assessment.js (route ranking C > B > A)
 *   @see src/data/lambda-burgers-shock-lipschitz.js (imp-354 Whitham Holder-1/2 composition, C_prime)
 *   @see src/data/lambda-polymath15-bridge.js (imp-345 G6_polymath15_bridge, E(N) bridge constants)
 *
 *   Ticket: imp-36082 (proof, medium).
 */

// ── Constants (identical convention to imp-354 lambda-burgers-shock-lipschitz) ──
// imp-341 Koksma-Hlawka: C1 = pi * C_Selberg ~ 3 pi ~ 9.4248.
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;
// Whitham fold-curvature constant C_W = sqrt(2 / |u_0''(z_0*)|); illustrative
// placeholder 1.0 (as in imp-354). Rigor lives in the lemma, not the placeholder.
const C_WHITHAM_PLACEHOLDER = 1.0;
// r(N) = C_prime * sqrt(log gamma_N) * N^{-1/4}, C_prime = C_W * sqrt(C1 / sqrt(2 pi)).
const C_PRIME = C_WHITHAM_PLACEHOLDER * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));

// ── Riemann-von Mangoldt inversion (same as imp-338 / imp-341 / imp-354) ──────
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

// ── The explicit per-N rate forms ─────────────────────────────────────────────
// D(N): deterministic discrepancy bound at the uniformity strip (per-N number,
//       unconditional, -> 0). D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N).
function discrepancyDN(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  return (C1_IMP341 * L) / Math.sqrt(2 * Math.PI * N);
}
// r(N): Whitham-composed shock-time DEVIATION rate = C_W sqrt(D(N)).
function rateRN_fromDiscrepancy(N) {
  const D = discrepancyDN(N);
  if (D === null || !(D > 0)) return null;
  return C_WHITHAM_PLACEHOLDER * Math.sqrt(D);
}
// r(N) closed form = C_prime sqrt(log gamma_N) N^{-1/4}. Must equal the composition.
function rateRN_closedForm(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  return (C_PRIME * Math.sqrt(L)) / Math.pow(N, 0.25);
}

// ── Ladder: exhibit r(N) is explicit, per-N, vanishing, and matches closed form ─
const LADDER_N = Object.freeze([1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12]);
const RATE_LADDER = LADDER_N.map((N) => {
  const gammaN = gammaNFromRvM(N);
  const D = discrepancyDN(N);
  const rComp = rateRN_fromDiscrepancy(N);
  const rClosed = rateRN_closedForm(N);
  return Object.freeze({
    N,
    gammaN_RvM: gammaN,
    D_discrepancy: D,
    r_deviation_composed: rComp,
    r_deviation_closed_form: rClosed,
    closed_form_agrees:
      rComp !== null && rClosed !== null && rClosed > 0
        ? Math.abs(rComp - rClosed) / rClosed < 1e-9
        : false,
  });
});

const D_STRICTLY_DECREASING = (() => {
  for (let i = 1; i < RATE_LADDER.length; i++) {
    if (!(RATE_LADDER[i].D_discrepancy < RATE_LADDER[i - 1].D_discrepancy)) return false;
  }
  return true;
})();
const R_STRICTLY_DECREASING = (() => {
  for (let i = 1; i < RATE_LADDER.length; i++) {
    if (!(RATE_LADDER[i].r_deviation_composed < RATE_LADDER[i - 1].r_deviation_composed)) return false;
  }
  return true;
})();
// Local log-log slope of r(N) between the widest ladder rungs, to witness the
// N^{-1/4} leading exponent (up to the slowly-varying sqrt(log gamma_N) factor).
const R_LOGLOG_SLOPE_WIDE = (() => {
  const a = RATE_LADDER[0];
  const b = RATE_LADDER[RATE_LADDER.length - 1];
  return (
    (Math.log(b.r_deviation_composed) - Math.log(a.r_deviation_composed)) /
    (Math.log(b.N) - Math.log(a.N))
  );
})();

// Pinned Holder exponent of the Whitham fold catastrophe (r ~ sqrt(D)); a drift
// away from 1/2 would silently change the catastrophe identity -- a hard wall.
const HOLDER_EXPONENT = 0.5;

// ── The record ─────────────────────────────────────────────────────────────
export const IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY = Object.freeze({
  id: 'imp-36082-routeB-perN-rate-form-and-bridge-consumability',
  ticket: 'imp-36082',
  routeId: 'route-B-burgers',
  obligationKey: 'G5-perN-translation',
  feedsInto: 'Step-4 E(N) bridge constants (G6_polymath15_bridge, imp-345), NOT the headline inequality (imp-2564)',
  sources: Object.freeze({
    discrepancy: 'imp-341 / imp-344 Koksma-Hlawka: psi_N(y) <= pi C_Selberg log gamma_N / (N y)',
    strip: 'uniformity strip y_N^sharp = sqrt(2 pi / N)',
    composition: 'imp-354 Whitham Holder-1/2 fold-catastrophe: |t_c(m_N) - t_c(m_inf)| <= C_W sqrt(psi_N)',
    bridge: 'imp-345 G6_polymath15_bridge E(N) constants',
  }),

  summary:
    'Derives the explicit per-N rate r(N) that the Route-B (imp-341/344) UNCONDITIONAL Koksma-Hlawka lim-sup ' +
    'supplies, and assesses E(N)-bridge consumability. The deterministic discrepancy bound at the uniformity ' +
    'strip y_N^sharp = sqrt(2 pi / N) is D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N) -- a per-N ' +
    'number, unconditional, vanishing (Theta(log N N^{-1/2})). Composed through the imp-354 Whitham Holder-1/2 ' +
    'fold catastrophe it yields r(N) = C_prime sqrt(log gamma_N) N^{-1/4} (Theta(sqrt(log N) N^{-1/4})), the ' +
    'explicit per-N rate Route-B supplies. VERDICT (assessment, NO QED): r(N) bounds the shock-time DEVIATION ' +
    '|t_c(m_N) - t_c(m_inf)|, NOT |t_c(N)| itself; the Step-4 E(N) bridge needs an ABSOLUTE per-N bound ' +
    '|t_c(N)| <= r(N). Converting deviation -> absolute requires a per-N-usable anchor on t_c(m_inf) (value AND ' +
    'finite-N side); the lim-sup certifies only the asymptotic t_c(m_inf) <= 0, not the finite-N value or sign, ' +
    'so the anchor is exactly the local-law RIGIDITY that re-imports GUE/ESY. Status CONSUMABLE-MODULO-ANCHOR: ' +
    'the rate EXISTS explicitly and unconditionally, but the bridge cannot consume it per-N without the missing ' +
    'anchor. Matches the imp-36045 Route-B verdict, adding the explicit r(N) FORM and the precise blocker ' +
    '(missing per-N anchor, not a missing rate). Closes NOTHING; discharges no gap; per-N stays OPEN; respects ' +
    'the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed.',

  rateForms: Object.freeze({
    discrepancy_DN: 'D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N)  [Theta(log N N^{-1/2})]',
    deviation_rate_rN: 'r(N) = C_prime sqrt(log gamma_N) N^{-1/4}  [Theta(sqrt(log N) N^{-1/4})], C_prime = C_W sqrt(pi C_Selberg / sqrt(2 pi))',
    holderExponent: HOLDER_EXPONENT,
    C_prime: C_PRIME,
    C_W_placeholder: C_WHITHAM_PLACEHOLDER,
    C_Selberg: C_SELBERG,
    bounds: 'the shock-time DEVIATION |t_c(m_N) - t_c(m_infinity)|, NOT |t_c(N)| absolutely',
  }),

  ladder: RATE_LADDER,
  ladderDiagnostics: Object.freeze({
    D_strictly_decreasing: D_STRICTLY_DECREASING,
    r_strictly_decreasing: R_STRICTLY_DECREASING,
    r_loglog_slope_wide: R_LOGLOG_SLOPE_WIDE,
    r_loglog_slope_note:
      'the wide-window log-log slope sits just above -1/4 (~-0.216): the N^{-1/4} leading exponent dressed by ' +
      'the slowly-varying, GROWING sqrt(log gamma_N) factor, which drags the empirical slope toward 0.',
  }),

  consumability: Object.freeze({
    rateExists: true,
    rateIsPerN: true,
    rateIsUnconditional: true,
    rateVanishes: true,
    rateBoundsAbsoluteTc: false,
    rateBoundsDeviationOnly: true,
    bridgeCanConsumePerN: false,
    status: 'CONSUMABLE-MODULO-ANCHOR',
    missingIngredient:
      'a per-N-usable anchor on the limiting shock time t_c(m_infinity) (value AND finite-N side); the lim-sup ' +
      'gives only the asymptotic t_c(m_inf) <= 0, so pinning the finite-N side re-imports local-law rigidity (GUE/ESY).',
    matchesImp36045RouteB: true,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    derivesExplicitRateForm: true,
    rateConsumableAsAbsoluteTcBound: false,
    perNTranslationStaysOpen: true,
    reImportsGueIfAnchorForced: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Derivation of the explicit Route-B per-N rate form r(N) = C_prime sqrt(log gamma_N) N^{-1/4} and an ' +
      'assessment that it bounds only the shock-time DEVIATION, so the Step-4 E(N) bridge cannot consume it as a ' +
      'per-N bound on |t_c(N)| without an unconditional anchor (CONSUMABLE-MODULO-ANCHOR). Closes nothing; per-N ' +
      'translation stays OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY_ASSERTIONS = [
  {
    id: 'imp36082-discrepancy-per-N-and-vanishing',
    why: 'The Route-B discrepancy bound D(N) = (pi C_Selberg / sqrt(2 pi)) log gamma_N / sqrt(N) must be a ' +
         'finite positive per-N number that strictly decreases along the ladder (-> 0, driving the lim-sup).',
    holds: () =>
      RATE_LADDER.every((r) => r.D_discrepancy !== null && r.D_discrepancy > 0) && D_STRICTLY_DECREASING,
  },
  {
    id: 'imp36082-rate-form-matches-closed-form',
    why: 'The composed rate C_W sqrt(D(N)) must equal the closed form C_prime sqrt(log gamma_N) N^{-1/4} at ' +
         'every ladder rung; a mismatch means the Whitham composition constant C_prime drifted.',
    holds: () => RATE_LADDER.every((r) => r.closed_form_agrees === true),
  },
  {
    id: 'imp36082-rate-vanishing-and-quarter-power',
    why: 'r(N) must strictly decrease along the ladder and its wide-window log-log slope must sit just above ' +
         '-1/4 (the N^{-1/4} leading exponent dragged toward 0 by the slowly-varying GROWING sqrt(log gamma_N) factor).',
    holds: () =>
      R_STRICTLY_DECREASING && R_LOGLOG_SLOPE_WIDE > -0.25 && R_LOGLOG_SLOPE_WIDE < -0.20,
  },
  {
    id: 'imp36082-holder-exponent-pinned',
    why: 'The Whitham fold catastrophe forces r ~ sqrt(D), Holder exponent 1/2; a drift breaks the catastrophe identity.',
    holds: () => HOLDER_EXPONENT === 0.5,
  },
  {
    id: 'imp36082-rate-bounds-deviation-not-absolute-tc',
    why: 'The core assessment: r(N) bounds the shock-time DEVIATION |t_c(m_N) - t_c(m_inf)|, NOT |t_c(N)| ' +
         'absolutely; the E(N) bridge needs the absolute bound, so it cannot consume r(N) per-N as-is.',
    holds: () => {
      const c = IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.consumability;
      return (
        c.rateExists === true &&
        c.rateIsPerN === true &&
        c.rateIsUnconditional === true &&
        c.rateBoundsAbsoluteTc === false &&
        c.rateBoundsDeviationOnly === true &&
        c.bridgeCanConsumePerN === false &&
        c.status === 'CONSUMABLE-MODULO-ANCHOR'
      );
    },
  },
  {
    id: 'imp36082-missing-anchor-is-the-gue-reimport',
    why: 'The precise blocker: the missing ingredient is a per-N anchor on t_c(m_inf); forcing it re-imports the ' +
         'local-law rigidity (GUE/ESY) the lim-sup avoided -- consistent with the imp-36045 Route-B verdict.',
    holds: () => {
      const c = IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.consumability;
      const h = IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.honestCaveat;
      return (
        c.matchesImp36045RouteB === true &&
        /anchor/.test(c.missingIngredient) &&
        /GUE|ESY|local-law/.test(c.missingIngredient) &&
        h.reImportsGueIfAnchorForced === true
      );
    },
  },
  {
    id: 'imp36082-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a DERIVATION+ASSESSMENT that closes NOTHING, discharges no gap, keeps the per-N ' +
         'translation OPEN, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.derivesExplicitRateForm === true &&
        h.rateConsumableAsAbsoluteTcBound === false &&
        h.perNTranslationStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36082-routeB-perN-rate-form-and-bridge-consumability assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY;
