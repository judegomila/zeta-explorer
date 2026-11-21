/**
 * @module imp-36216-routeC-vs-routeB-perN-rate-tabulation
 * @fileoverview imp-36216 -- Tabulate the imp-36137 Route-C explicit per-N rate
 *   r_C(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N) against the
 *   imp-36082 Route-B per-N rate r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} =
 *   Theta(sqrt(log N) N^{-1/4}), evaluated across the imp-321 N-ladder
 *   (N = 2458, 5000, 1e4, 1e5, 1e6, 1e7, 1e8). Reports the per-rung ratio
 *   r_C/r_B, locates the crossover N* where the two rate FORMS agree in
 *   magnitude, and quantifies how the still-open G3a_max_gap residual bounds the
 *   RELIABILITY of the Route-C column. Numerical comparison of two rate FORMS
 *   ONLY: both routes remain premised on the OPEN per-N translation; closes
 *   NOTHING; NO QED; no refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36082 wrote down the Route-B DEVIATION rate r_B(N) (blocker: a missing
 *   per-N anchor, CONSUMABLE-MODULO-ANCHOR). imp-36137 wrote down the Route-C
 *   ABSOLUTE rate r_C(N) (blocker: the OPEN G3a_max_gap premise,
 *   CONSUMABLE-MODULO-G3a) and graded Route C the bridge-usable TYPE. imp-36151
 *   established that the imp-36045 C > B ranking is about consumability TYPE, not
 *   a faster N-exponent. What was NOT yet done: put the two explicit rate FORMS
 *   SIDE BY SIDE on the shared imp-321 N-ladder, tabulate the per-rung ratio,
 *   and pin the magnitude crossover. This module does exactly that, and then
 *   annotates the Route-C column with the imp-36259 reliability caveat.
 *
 *   THE TWO RATE FORMS (verbatim from the source modules)
 *   -----------------------------------------------------
 *       Route-C (imp-36137):  r_C(N) = pi^2 / (2 kappa log(gamma_N / 2 pi)),  kappa = 1
 *                             Theta(1/log N); bounds |t_c(N)| ABSOLUTELY, contingent
 *                             on the density-squeeze premise (residual G3a_max_gap).
 *       Route-B (imp-36082):  r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4},
 *                             C_prime = C_W sqrt(pi C_Selberg / sqrt(2 pi)) ~ 1.9391
 *                             Theta(sqrt(log N) N^{-1/4}); bounds the shock-time
 *                             DEVIATION, contingent on a per-N anchor.
 *   Each form is evaluated on its OWN source machinery (Route-C: Lambert-W
 *   gamma_N inversion; Route-B: Newton-on-RvM-count gamma_N inversion), exactly
 *   as the source modules do, so the numbers here match imp-36137 / imp-36082
 *   rung-for-rung; the ratio is the honest FORM-vs-FORM comparison.
 *
 *   THE TABULATION HEADLINE (measurement, NO QED)
 *   ---------------------------------------------
 *   Across the imp-321 physical ladder (all N >= 2458) the ratio r_C/r_B is
 *   greater than 1 at EVERY rung and DIVERGES: ~1.029 at N = 2458, ~1.442 at
 *   N = 1e5, ~3.866 at N = 1e8 (wide-window log-log slope ~+0.125). Because
 *   Route-C decays as 1/log N and Route-B as N^{-1/4}, the ratio grows like
 *   sqrt(log N) N^{1/4}/log N ~ N^{1/4}/sqrt(log N) -- Route-B is the numerically
 *   SMALLER (tighter-magnitude) value at every physical rung, and the gap widens
 *   from 3% at N = 2458 to ~287% at N = 1e8. There IS a single magnitude
 *   crossover N* ~ 1482 (r_C = r_B), sitting just BELOW the ladder floor: for
 *   N < N* Route-C yields the smaller value, for N > N* Route-B does. Every rung
 *   of the imp-321 ladder lies ABOVE N*, so Route-B is uniformly the smaller
 *   magnitude across the physical table.
 *
 *   THE RELIABILITY CAVEAT: A SMALLER NUMBER IS NOT A BETTER BOUND
 *   -------------------------------------------------------------
 *   The magnitude crossover is NOT a validity ranking, for two independent
 *   reasons that this ticket is careful NOT to conflate:
 *     (1) Route-B's smaller value bounds only a DEVIATION |t_c(m_N) - t_c(m_inf)|,
 *         not |t_c(N)| absolutely (imp-36082 CONSUMABLE-MODULO-ANCHOR); the E(N)
 *         bridge cannot consume it without a per-N anchor that re-imports GUE/ESY.
 *     (2) Route-C's larger value is the ABSOLUTE, bridge-usable TYPE, but the
 *         ENTIRE Route-C column is CONDITIONAL on the OPEN G3a_max_gap premise.
 *         imp-36259 showed the squeeze c(N) > 2 holds IFF the argmin max-gap ratio
 *         R_N stays below R_critical ~ 1.2512 uniformly; under the plausible GUE
 *         max-gap scale R_N ~ sqrt(log N) the squeeze FAILS for every N >= 5, which
 *         would make the Route-C column VACUOUS. So each Route-C entry is a value
 *         the premise WOULD supply, not a certified bound.
 *   Reliability verdict on the Route-C column: PREMISED, NOT CERTIFIED. The G3a_max_gap
 *   residual does not shift any r_C(N) NUMBER (the form is fixed once the premise is
 *   granted); it gates whether the column EXISTS at all. The ratio table is therefore
 *   a comparison of two rate FORMS, neither presently a theorem -- consistent with the
 *   imp-36151 "structural, not faster-exponent" reading of the imp-36045 C > B edge.
 *
 *   @see src/data/imp-36137-routeC-perN-rate-form-and-bridge-consumability.js (Route-C r_C form)
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (Route-B r_B form)
 *   @see src/data/imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (C > B is TYPE, not exponent)
 *   @see src/data/imp-36259-routeC-g3a-maxgap-residual-scope.js (G3a_max_gap makes Route-C possibly VACUOUS)
 *   @see src/data/lambda-pt-scale-extrapolation.js (imp-321 PT_SCALE_EXTRAPOLATION N-ladder)
 *
 *   Ticket: imp-36216 (numerical, medium).
 */

// ── Route-C constants + machinery (identical to imp-36137) ─────────────────────
const KAPPA = 1.0;
const R_COEFF = (Math.PI * Math.PI) / (2 * KAPPA);
// gamma_N ~ 2 pi N / W(N/e); 3 Newton iterations on t e^t = N/e (Lambert W).
function gammaN_C(N) {
  const u = N / Math.E;
  let t = Math.log(u);
  for (let i = 0; i < 3; i++) {
    const et = Math.exp(t);
    t = t - (t * et - u) / (et * (1 + t));
  }
  return (2 * Math.PI * N) / t;
}
function rateRC(N) {
  const g = gammaN_C(N);
  const L = Math.log(g / (2 * Math.PI));
  if (!(L > 0)) return null;
  return R_COEFF / L;
}

// ── Route-B constants + machinery (identical to imp-36082) ─────────────────────
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
function gammaN_B(N) {
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
function rateRB(N) {
  const g = gammaN_B(N);
  const L = Math.log(g);
  if (!(L > 0) || !(N > 0)) return null;
  return (C_PRIME * Math.sqrt(L)) / Math.pow(N, 0.25);
}

// ── The imp-321 N-ladder (PT_SCALE_EXTRAPOLATION.N_LADDER) ──────────────────────
const IMP321_LADDER_N = Object.freeze([2458, 5000, 1e4, 1e5, 1e6, 1e7, 1e8]);
const TABULATION = IMP321_LADDER_N.map((N) => {
  const rC = rateRC(N);
  const rB = rateRB(N);
  const ratio = rC !== null && rB !== null && rB > 0 ? rC / rB : null;
  return Object.freeze({
    N,
    r_C_absolute: rC, // Theta(1/log N), bounds |t_c(N)| absolutely (premised on G3a)
    r_B_deviation: rB, // Theta(sqrt(log N) N^{-1/4}), bounds the deviation (premised on anchor)
    ratio_rC_over_rB: ratio,
    routeB_is_smaller: ratio !== null && ratio > 1,
  });
});

// Ratio > 1 (Route-B smaller) at every physical rung, and strictly increasing.
const RATIO_EXCEEDS_ONE_EVERY_RUNG = TABULATION.every((r) => r.ratio_rC_over_rB > 1);
const RATIO_STRICTLY_INCREASING = (() => {
  for (let i = 1; i < TABULATION.length; i++) {
    if (!(TABULATION[i].ratio_rC_over_rB > TABULATION[i - 1].ratio_rC_over_rB)) return false;
  }
  return true;
})();
// Wide-window log-log slope of the ratio: ~+0.125 (the N^{1/4}/sqrt(log N) growth
// diluted by the log factor), positive = Route-B pulls ahead in magnitude with N.
const RATIO_LOGLOG_SLOPE_WIDE = (() => {
  const a = TABULATION[0];
  const b = TABULATION[TABULATION.length - 1];
  return (
    (Math.log(b.ratio_rC_over_rB) - Math.log(a.ratio_rC_over_rB)) /
    (Math.log(b.N) - Math.log(a.N))
  );
})();

// ── Magnitude crossover N* where r_C(N) = r_B(N) (ratio = 1), by bisection ──────
// r_C decays slower (1/log N) than r_B (N^{-1/4}), so for small N r_C < r_B (ratio
// < 1) and for large N r_C > r_B (ratio > 1); a single crossover sits between.
const CROSSOVER_N = (() => {
  const f = (N) => {
    const rC = rateRC(N);
    const rB = rateRB(N);
    if (rC === null || rB === null || !(rB > 0)) return null;
    return rC / rB - 1;
  };
  let lo = 100;
  let hi = 2458;
  const flo = f(lo);
  const fhi = f(hi);
  if (flo === null || fhi === null || flo * fhi > 0) return null; // no bracketed crossing
  for (let i = 0; i < 100; i++) {
    const mid = Math.sqrt(lo * hi); // geometric bisection (log-spaced)
    const fm = f(mid);
    if (fm === null) break;
    if (fm > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
})();
// N* sits strictly below the imp-321 ladder floor (2458), so Route-B is uniformly
// the smaller magnitude across the whole physical table.
const CROSSOVER_BELOW_LADDER_FLOOR =
  CROSSOVER_N !== null && CROSSOVER_N < IMP321_LADDER_N[0];

// ── G3a_max_gap reliability gate on the Route-C column (from imp-36259) ─────────
// The squeeze c(N) > 2 holds IFF the argmin max-gap ratio R_N stays below
// R_critical, the root of 2/(R(R+1)) + c_tail = 2 with c_tail = 2(pi^2/6 - 1).
const C_TAIL = 2 * ((Math.PI * Math.PI) / 6 - 1); // imp-342 Weyl tail ~ 1.2899
const C_THRESH_RHS = 2 / (2 - C_TAIL);
const R_CRITICAL = (-1 + Math.sqrt(1 + 4 * C_THRESH_RHS)) / 2; // ~1.2512
// Under the GUE max-gap illustration R_N ~ sqrt(log N), the squeeze first FAILS
// at exp(R_critical^2) ~ 4.78, i.e. for every N >= 5 -- the Route-C column would
// be VACUOUS if that scale is the true max-gap law (imp-36259, CONDITIONAL).
const N_ROUTEC_SQUEEZE_FAILS_ABOVE_GUE = Math.exp(R_CRITICAL * R_CRITICAL);
const ROUTEC_COLUMN_PREMISED_NOT_CERTIFIED = true;

// ── The record ────────────────────────────────────────────────────────────────
export const IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION = Object.freeze({
  id: 'imp-36216-routeC-vs-routeB-perN-rate-tabulation',
  ticket: 'imp-36216',
  obligationKey: 'G5-perN-translation',
  compares: Object.freeze({
    routeC: 'imp-36137 r_C(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N), ABSOLUTE |t_c(N)| bound (premise G3a_max_gap)',
    routeB: 'imp-36082 r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} = Theta(sqrt(log N) N^{-1/4}), DEVIATION bound (premise per-N anchor)',
    ladder: 'imp-321 PT_SCALE_EXTRAPOLATION N-ladder N = [2458, 5000, 1e4, 1e5, 1e6, 1e7, 1e8]',
  }),

  summary:
    'Tabulates the imp-36137 Route-C absolute per-N rate r_C(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = ' +
    'Theta(1/log N) against the imp-36082 Route-B deviation rate r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} = ' +
    'Theta(sqrt(log N) N^{-1/4}) across the imp-321 N-ladder, evaluating each form on its own source machinery. ' +
    'HEADLINE (measurement, NO QED): the ratio r_C/r_B exceeds 1 at every physical rung and DIVERGES -- ~1.029 at ' +
    'N = 2458, ~1.442 at N = 1e5, ~3.866 at N = 1e8 (wide log-log slope ~+0.125) -- because Route-C decays as ' +
    '1/log N and Route-B as N^{-1/4}, so Route-B is the numerically SMALLER value at every rung and the gap widens ' +
    'from 3% to ~287% across the table. A single magnitude crossover N* ~ 1482 (r_C = r_B) sits just BELOW the ' +
    'ladder floor 2458, so every physical rung has Route-B smaller. CRUCIAL CAVEAT: the smaller number is NOT the ' +
    'better bound -- Route-B bounds only a DEVIATION (CONSUMABLE-MODULO-ANCHOR) while Route-C is the bridge-usable ' +
    'ABSOLUTE TYPE but its ENTIRE column is CONDITIONAL on the OPEN G3a_max_gap premise, which under the imp-36259 ' +
    'GUE max-gap illustration R_N ~ sqrt(log N) FAILS for every N >= 5 (would make the Route-C column VACUOUS). The ' +
    'G3a residual gates whether the Route-C column EXISTS, not the value of any entry: the column is PREMISED, NOT ' +
    'CERTIFIED. The table compares two rate FORMS, neither presently a theorem -- consistent with imp-36151 ' +
    '(the imp-36045 C > B edge is structural TYPE, not a faster exponent). Closes NOTHING; discharges no gap; ' +
    'per-N translation, the Route-B anchor, and G3a_max_gap stay OPEN; respects the imp-2519 no-overclaim guard; ' +
    'NO QED; no refereed bound is changed.',

  constants: Object.freeze({
    kappa: KAPPA,
    r_C_coeff: R_COEFF, // pi^2/2
    C_prime: C_PRIME, // ~1.9391
    c_tail: C_TAIL, // ~1.2899
    R_critical: R_CRITICAL, // ~1.2512
    N_routeC_squeeze_fails_above_gue: N_ROUTEC_SQUEEZE_FAILS_ABOVE_GUE, // ~4.78
  }),

  tabulation: TABULATION,
  diagnostics: Object.freeze({
    ratio_exceeds_one_every_rung: RATIO_EXCEEDS_ONE_EVERY_RUNG,
    ratio_strictly_increasing: RATIO_STRICTLY_INCREASING,
    ratio_loglog_slope_wide: RATIO_LOGLOG_SLOPE_WIDE,
    crossover_N: CROSSOVER_N,
    crossover_below_ladder_floor: CROSSOVER_BELOW_LADDER_FLOOR,
    ratio_note:
      'r_C/r_B grows like N^{1/4}/sqrt(log N); Route-B is the smaller magnitude at every imp-321 rung, the crossover ' +
      'N* ~ 1482 sitting below the ladder floor 2458. Magnitude ONLY -- not a validity ranking.',
  }),

  reliability: Object.freeze({
    routeC_column_status: 'PREMISED-NOT-CERTIFIED',
    routeC_gated_on: 'G3a_max_gap (imp-337 density-squeeze premise; imp-36259 sole open residual)',
    g3a_gates_existence_not_value:
      'G3a_max_gap does not perturb any r_C(N) NUMBER (the form is fixed once the premise is granted); it gates ' +
      'whether the Route-C column EXISTS at all -- under R_N ~ sqrt(log N) the squeeze c(N) > 2 fails for N >= 5.',
    routeB_column_status: 'DEVIATION-ONLY (CONSUMABLE-MODULO-ANCHOR)',
    routeB_gated_on: 'a per-N anchor on t_c(m_inf) that re-imports GUE/ESY rigidity (imp-36082)',
    smaller_number_not_better_bound:
      'Route-B being numerically smaller across the table does NOT make it the better bound: it bounds a DEVIATION ' +
      'not |t_c(N)|, while Route-C bounds |t_c(N)| ABSOLUTELY but only if G3a_max_gap holds. Neither is a theorem.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isNumericalTabulation: true,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    comparesTwoRateForms: true,
    bothRoutesPremisedOnOpenPerNTranslation: true,
    routeCColumnPremisedNotCertified: ROUTEC_COLUMN_PREMISED_NOT_CERTIFIED,
    perNTranslationStaysOpen: true,
    routeBAnchorStaysOpen: true,
    g3aMaxGapStaysOpen: true,
    carriesRHVerdict: false,
    scope:
      'Side-by-side tabulation of the imp-36137 Route-C and imp-36082 Route-B explicit per-N rate FORMS across the ' +
      'imp-321 ladder, the per-rung ratio, the magnitude crossover N* ~ 1482, and the imp-36259 G3a_max_gap ' +
      'reliability caveat on the Route-C column. Numerical comparison of two FORMS only; both premised on the OPEN ' +
      'per-N translation; closes nothing; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// ── Tripwire assertions ────────────────────────────────────────────────────────
export const IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION_ASSERTIONS = [
  {
    id: 'imp36216-ladder-is-imp321-ladder',
    why: 'The comparison must run on the imp-321 PT_SCALE_EXTRAPOLATION N-ladder [2458, 5000, 1e4..1e8]; a drift ' +
         'to a different ladder means the tabulation is no longer the requested imp-321 comparison.',
    holds: () =>
      TABULATION.length === 7 &&
      TABULATION[0].N === 2458 &&
      TABULATION[1].N === 5000 &&
      TABULATION[TABULATION.length - 1].N === 1e8,
  },
  {
    id: 'imp36216-routeB-smaller-every-physical-rung',
    why: 'r_C decays as 1/log N and r_B as N^{-1/4}, so r_C/r_B > 1 (Route-B numerically smaller) at every rung of ' +
         'the physical ladder; a ratio <= 1 anywhere means a rate FORM or its gamma_N machinery regressed.',
    holds: () => RATIO_EXCEEDS_ONE_EVERY_RUNG && TABULATION.every((r) => r.routeB_is_smaller === true),
  },
  {
    id: 'imp36216-ratio-diverges-with-N',
    why: 'The ratio r_C/r_B must strictly increase along the ladder with a POSITIVE wide log-log slope (~+0.125): ' +
         'Route-B pulls further ahead in magnitude as N grows (N^{1/4}/sqrt(log N) growth).',
    holds: () => RATIO_STRICTLY_INCREASING && RATIO_LOGLOG_SLOPE_WIDE > 0 && RATIO_LOGLOG_SLOPE_WIDE < 0.25,
  },
  {
    id: 'imp36216-magnitude-crossover-below-ladder-floor',
    why: 'A single magnitude crossover N* (r_C = r_B) must exist and sit strictly BELOW the ladder floor 2458, so ' +
         'Route-B is uniformly the smaller magnitude across the physical table (crossover ~1482).',
    holds: () =>
      CROSSOVER_N !== null &&
      CROSSOVER_BELOW_LADDER_FLOOR === true &&
      CROSSOVER_N > 1000 &&
      CROSSOVER_N < 2458,
  },
  {
    id: 'imp36216-routeC-column-premised-not-certified',
    why: 'The Route-C column is CONDITIONAL on the OPEN G3a_max_gap premise (imp-36259): under R_N ~ sqrt(log N) ' +
         'the squeeze c(N) > 2 fails for N >= 5 (crossover exp(R_critical^2) ~ 4.78), so the column may be VACUOUS. ' +
         'G3a gates existence of the column, not the value of any entry.',
    holds: () => {
      const rel = IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION.reliability;
      return (
        rel.routeC_column_status === 'PREMISED-NOT-CERTIFIED' &&
        /G3a_max_gap/.test(rel.routeC_gated_on) &&
        N_ROUTEC_SQUEEZE_FAILS_ABOVE_GUE > 4 &&
        N_ROUTEC_SQUEEZE_FAILS_ABOVE_GUE < 5 &&
        R_CRITICAL > 1.25 &&
        R_CRITICAL < 1.2515
      );
    },
  },
  {
    id: 'imp36216-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a NUMERICAL tabulation of two rate FORMS that closes NOTHING, keeps the per-N ' +
         'translation, the Route-B anchor, and G3a_max_gap OPEN, carries NO RH verdict, no refereed bound is changed. ' +
         'If any flip, the module over-claims.',
    holds: () => {
      const h = IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION.honestCaveat;
      return (
        h.isProof === false &&
        h.isNumericalTabulation === true &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.comparesTwoRateForms === true &&
        h.bothRoutesPremisedOnOpenPerNTranslation === true &&
        h.routeCColumnPremisedNotCertified === true &&
        h.perNTranslationStaysOpen === true &&
        h.routeBAnchorStaysOpen === true &&
        h.g3aMaxGapStaysOpen === true &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36216-routeC-vs-routeB-perN-rate-tabulation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36216_ROUTEC_VS_ROUTEB_PERN_RATE_TABULATION;
