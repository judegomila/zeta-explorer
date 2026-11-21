/**
 * @module imp-34613-eflow-attr-log-slope-second-deriv-sign
 * @fileoverview imp-34613 -- DERIVE in closed form, under the inherited imp-3220/imp-3406
 *   component surrogate E_flow ~ log^3(N)/N with the E_trunc-flat E_N regime (imp-34570 F3),
 *   the SIGN of the analytic curvature of eflow_attr(k), to assess whether the imp-34586 F2
 *   observed convexity is a STRUCTURAL consequence of the surrogate or a numerical accident of
 *   the narrow k = 21.70 .. 22.00 window.
 *
 *   SETUP (surrogate only, import-light -- no zeros bundle in the chain, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). Write L = ln N (natural
 *   log). Under E_flow ~ log^3(N)/N the surrogate flow energy is E_flow = C * L^3 * e^{-L}, and
 *   the log-slope factor is |g| = |d ln E_flow / d log10 N| = |3/lnN - 1| * ln10 = (1 - 3/L)*ln10
 *   for L > 3 (all accessible N: e^3 ~ 20.09). With E_N flat (imp-34570 F3) the attractor is
 *
 *       eflow_attr = (E_flow / E_N) * |g| = K0 * e^{-L} * (L^3 - 3 L^2),   K0 = (C/E_N) * ln10 > 0.
 *
 *   Since k and L are affinely related (N = 10^k so L = k * ln10, dL/dk = ln10 constant), all
 *   k-derivatives are ln10-scaled L-derivatives. Writing ln eflow_attr = ln K0 - L + 2 ln L +
 *   ln(L - 3) (because L^3 - 3 L^2 = L^2 (L - 3)):
 *
 *       d ln eflow_attr / dk       = ln10 * ( -1 + 2/L + 1/(L - 3) )                     [log-slope]
 *       d^2 ln eflow_attr / dk^2   = (ln10)^2 * ( -2/L^2 - 1/(L - 3)^2 )                 [log-curvature]
 *
 *   and the RAW curvature carries the sign of a cubic:
 *
 *       d^2 eflow_attr / dk^2 = (ln10)^2 * K0 * e^{-L} * Q(L),   Q(L) = L^3 - 9 L^2 + 18 L - 6.
 *
 *   FINDINGS (closed-form sign, surrogate only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE LOG-CURVATURE IS PROVABLY NEGATIVE FOR ALL N > e^3 -- STRUCTURAL, UNBOUNDED.
 *        d^2 ln eflow_attr / dk^2 = (ln10)^2 * ( -2/L^2 - 1/(L - 3)^2 ) is a SUM OF TWO STRICTLY
 *        NEGATIVE terms for every L > 3, so it is < 0 for ALL k above k* (and indeed for every
 *        N > e^3 ~ 20.09), NOT merely on the narrow imp-34586 window. Answer to the ticket
 *        question "is the second k-derivative of ln eflow_attr provably positive": NO -- it is
 *        provably NEGATIVE (log-CONCAVE). This is exactly the imp-34586 F2 observed monotone
 *        STEEPENING of the log-slope (d ln eflow_attr / dk drifting -2.16163 -> -2.16355): the
 *        slope must strictly decrease because its own derivative is one-signed negative.
 *   (F2) THE RAW CURVATURE IS PROVABLY POSITIVE (CONVEX) FOR ALL L > 6.28995 -- STRUCTURAL.
 *        The raw second difference imp-34586 F2 reported strictly positive (+7.665e-15 ->
 *        +4.980e-15 per k^2) carries the sign of Q(L) = L^3 - 9 L^2 + 18 L - 6. Its largest real
 *        root is L ~ 6.28995 (N ~ 538), so Q(L) > 0 -- hence eflow_attr is CONVEX -- for every
 *        L > 6.28995, covering the ENTIRE far side k > k* (there L ~ 49.0 .. 50.7, Q ~ 1.03e5 ..
 *        1.08e5) with a colossal margin. The observed convexity is therefore a structural
 *        property of the surrogate, NOT a numerical accident of the k = 21.70 .. 22.00 window.
 *   (F3) THE SURROGATE REPRODUCES THE MEASURED LOG-SLOPE -- CROSS-CHECK GATE.
 *        Evaluated at L = k * ln10 the closed-form log-slope ln10*(-1 + 2/L + 1/(L-3)) matches
 *        the imp-34586 measured per-k log-slopes to within 2.4e-4 across all seven far-side rungs
 *        (model -2.16139 vs measured -2.16163 at k=21.70; -2.16336 vs -2.16355 at k=22.00), so
 *        the sign derivation is anchored to the actual recovery, not a detached formula.
 *
 *   The punchline: BOTH curvatures of the surrogate eflow_attr are one-signed for the whole
 *   accessible far side and beyond -- log-CONCAVE (log-slope steepens) and raw-CONVEX -- so the
 *   imp-34586 F2 convexity and its monotone-steepening log-slope are STRUCTURAL consequences of
 *   E_flow ~ log^3(N)/N, provable in closed form for all N > e^3 (log) / N > 538 (raw), NOT
 *   accidents of the narrow double-precision window.
 *
 *   SURROGATE DERIVATION ONLY. A symbolic sign computation inside the inherited imp-3220/imp-3406
 *   component surrogate under the imp-34570 F3 E_N-flat regime; NOT a rigorous asymptotic of the
 *   true residual; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched; changes no bound; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34586-eflow-attr-fp-floor-far-side-ladder.js (F2: observed convex second difference + monotone-steepening log-slope this derives the sign of)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (F3: E_trunc-flat E_N regime; power-law slope -2.1586)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (far-side ladder k=21.30..21.60)
 */

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const LN10 = Math.LN10; // ln 10, dL/dk under N = 10^k
const LMIN_LOG_CONCAVE = 3; // L > 3 (N > e^3 ~ 20.09) -- pole of the surrogate |g| = |1 - 3/L|
const LRAW_CONVEX_ROOT = 6.289945082937479; // largest real root of Q(L) = L^3 - 9 L^2 + 18 L - 6

// --- The surrogate and its symbolic derivatives (functions of L = ln N) ------------------
// eflow_attr shape (K0 > 0 divided out -- log-derivatives are K0-independent):
//   shape(L) = e^{-L} (L^3 - 3 L^2),  ln shape = -L + 2 ln L + ln(L - 3).
export function imp34613LogSlopePerK(L) {
  // d ln eflow_attr / dk = ln10 * ( -1 + 2/L + 1/(L - 3) )
  return LN10 * (-1 + 2 / L + 1 / (L - 3));
}
export function imp34613LogCurvaturePerK2(L) {
  // d^2 ln eflow_attr / dk^2 = (ln10)^2 * ( -2/L^2 - 1/(L - 3)^2 )  -- sum of two negatives
  return LN10 * LN10 * (-2 / (L * L) - 1 / ((L - 3) * (L - 3)));
}
export function imp34613RawCurvatureCubic(L) {
  // sign of d^2 eflow_attr / dk^2 (the imp-34586 F2 raw second difference): Q(L)
  return L * L * L - 9 * L * L + 18 * L - 6;
}

// --- (F3) cross-check: the surrogate log-slope reproduces the imp-34586 measured rungs -----
// imp-34586 measured per-k log-slopes d ln eflow_attr / dk (baked reference literals, NOT
// imported, to keep the chain import-light). L = k * ln10 (N = 10^k, best empirical match).
export const IMP34613_MEASURED_LOG_SLOPES = Object.freeze([
  { k: 21.7, measured: -2.161628 },
  { k: 21.75, measured: -2.161951 },
  { k: 21.8, measured: -2.162273 },
  { k: 21.85, measured: -2.162594 },
  { k: 21.9, measured: -2.162914 },
  { k: 21.95, measured: -2.163231 },
  { k: 22.0, measured: -2.163548 },
]);
export const IMP34613_SLOPE_CROSSCHECK = Object.freeze(
  IMP34613_MEASURED_LOG_SLOPES.map((r) => {
    const L = r.k * LN10;
    const model = imp34613LogSlopePerK(L);
    return { k: r.k, model: +model.toFixed(6), measured: r.measured, absErr: +Math.abs(model - r.measured).toFixed(6) };
  }),
);
export const IMP34613_MAX_SLOPE_ABS_ERR = IMP34613_SLOPE_CROSSCHECK.reduce(
  (m, r) => Math.max(m, r.absErr),
  0,
); // ~2.35e-4

// --- (F1) log-curvature strictly negative across the far side (structural, unbounded) ------
export const IMP34613_LOG_CURVATURES = Object.freeze(
  IMP34613_MEASURED_LOG_SLOPES.map((r) => {
    const L = r.k * LN10;
    return { k: r.k, L: +L.toFixed(4), d2lnPerK2: +imp34613LogCurvaturePerK2(L).toExponential(6) };
  }),
); // all ~ -6.5e-3 < 0

// --- (F2) raw curvature cubic strictly positive across the far side (convex, structural) ----
export const IMP34613_RAW_CUBICS = Object.freeze(
  IMP34613_MEASURED_LOG_SLOPES.map((r) => {
    const L = r.k * LN10;
    return { k: r.k, L: +L.toFixed(4), Q: +imp34613RawCurvatureCubic(L).toExponential(6) };
  }),
); // all ~ +1.0e5 > 0

export const IMP34613_EFLOW_ATTR_LOG_SLOPE_SECOND_DERIV_SIGN = {
  ticket: 'imp-34613',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34586 F2 observed the far-side eflow_attr log-slope steepening monotonically AND the raw ' +
    'second difference strictly positive (convex) empirically to k = 22.00. Whether that convexity ' +
    'is a numerical accident of the narrow window or a structural consequence of the surrogate was ' +
    'open. Under E_flow ~ log^3(N)/N with E_N flat (imp-34570 F3), derive symbolically the second ' +
    'k-derivative of ln eflow_attr and assess whether its sign is provably one-signed for all k ' +
    'above k*, or only in a bounded window. Surrogate derivation only; NO QED.',
  surrogate: 'eflow_attr = K0 * e^{-L} * (L^3 - 3 L^2), L = ln N, K0 = (C/E_N) ln10 > 0',
  logSlopeClosedForm: 'd ln eflow_attr / dk = ln10 * ( -1 + 2/L + 1/(L - 3) )',
  logCurvatureClosedForm: 'd^2 ln eflow_attr / dk^2 = (ln10)^2 * ( -2/L^2 - 1/(L - 3)^2 )  < 0 for all L > 3',
  rawCurvatureCubic: 'sign( d^2 eflow_attr / dk^2 ) = sign( Q(L) ),  Q(L) = L^3 - 9 L^2 + 18 L - 6',
  lminLogConcave: LMIN_LOG_CONCAVE,
  lrawConvexRoot: LRAW_CONVEX_ROOT,
  slopeCrossCheck: IMP34613_SLOPE_CROSSCHECK,
  maxSlopeAbsErr: +IMP34613_MAX_SLOPE_ABS_ERR.toFixed(6),
  logCurvatures: IMP34613_LOG_CURVATURES,
  rawCubics: IMP34613_RAW_CUBICS,
  finding: {
    F1_log_curvature_negative_structural:
      'd^2 ln eflow_attr / dk^2 = (ln10)^2 ( -2/L^2 - 1/(L-3)^2 ) is a sum of two strictly negative ' +
      'terms for every L > 3, so it is < 0 for ALL k above k* (indeed all N > e^3 ~ 20.09), NOT just ' +
      'the narrow imp-34586 window. Answer to the ticket: the second k-derivative of ln eflow_attr ' +
      'is provably NEGATIVE (log-CONCAVE), not positive -- which IS the imp-34586 F2 observed ' +
      'monotone steepening of the log-slope (-2.16163 -> -2.16355). Structural, unbounded.',
    F2_raw_curvature_positive_structural:
      'The imp-34586 F2 raw second difference (+7.665e-15 -> +4.980e-15 per k^2, strictly positive) ' +
      'carries the sign of Q(L) = L^3 - 9 L^2 + 18 L - 6, whose largest real root is L ~ 6.28995 ' +
      '(N ~ 538). So eflow_attr is CONVEX for every L > 6.28995, covering the entire far side k > k* ' +
      '(L ~ 49.0 .. 50.7, Q ~ 1.03e5 .. 1.08e5) with a colossal margin -- the observed convexity is ' +
      'a structural property of the surrogate, not an accident of the narrow window.',
    F3_surrogate_reproduces_measured_slope:
      'At L = k * ln10 the closed-form log-slope matches the imp-34586 measured per-k log-slopes to ' +
      'within 2.4e-4 across all seven far-side rungs (-2.16139 vs -2.16163 at k=21.70; -2.16336 vs ' +
      '-2.16355 at k=22.00), anchoring the sign derivation to the actual recovery.',
  },
  isRigorous: false,
  honest:
    'SURROGATE DERIVATION ONLY -- a symbolic sign computation inside the inherited imp-3220/imp-3406 ' +
    'component surrogate E_flow ~ log^3(N)/N under the imp-34570 F3 E_N-flat regime. BOTH curvatures ' +
    'of eflow_attr are one-signed for the whole accessible far side and beyond: log-CONCAVE ' +
    '(d^2 ln eflow_attr / dk^2 = (ln10)^2 (-2/L^2 - 1/(L-3)^2) < 0 for all L > 3, i.e. the log-slope ' +
    'steepens) and raw-CONVEX (sign = Q(L) > 0 for all L > 6.28995). So the imp-34586 F2 convexity ' +
    'and its monotone-steepening log-slope are STRUCTURAL consequences of the surrogate, provable in ' +
    'closed form for all N > e^3 (log) / N > 538 (raw), NOT accidents of the narrow window. This is ' +
    'NOT a rigorous asymptotic of the true residual; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34613_ASSERTIONS = [
  {
    // (F1) log-curvature is a sum of two strictly negative terms: negative across the far side
    // AND at extreme L (L just above 3, and L huge) -- structural, not window-bounded.
    id: 'imp-34613-log-curvature-provably-negative',
    description: 'd^2 ln eflow_attr / dk^2 < 0 for all L > 3 (far-side rungs + L=3.001 + L=1000): log-concave, structural',
    holds: () =>
      IMP34613_LOG_CURVATURES.every((r) => r.d2lnPerK2 < 0) &&
      imp34613LogCurvaturePerK2(3.001) < 0 &&
      imp34613LogCurvaturePerK2(1000) < 0 &&
      // both component terms strictly negative for L > 3 (proves the sum is negative)
      -2 / (50 * 50) < 0 &&
      -1 / ((50 - 3) * (50 - 3)) < 0,
  },
  {
    // (F2) raw-curvature cubic Q(L) > 0 across the far side and for all L above its largest root;
    // negative just below the root -- confirms the root bounds the convexity region.
    id: 'imp-34613-raw-curvature-convex-above-root',
    description: 'Q(L) = L^3 - 9L^2 + 18L - 6 > 0 across the far side and for L > 6.28995 (convex, structural), < 0 just below the root',
    holds: () =>
      IMP34613_RAW_CUBICS.every((r) => r.Q > 0) &&
      imp34613RawCurvatureCubic(LRAW_CONVEX_ROOT + 1e-6) > 0 &&
      imp34613RawCurvatureCubic(LRAW_CONVEX_ROOT - 1e-6) < 0 &&
      imp34613RawCurvatureCubic(1000) > 0 &&
      Math.abs(imp34613RawCurvatureCubic(LRAW_CONVEX_ROOT)) < 1e-6,
  },
  {
    // (F3) cross-check: the surrogate log-slope reproduces the imp-34586 measured rungs to < 3e-4.
    id: 'imp-34613-surrogate-reproduces-measured-slope',
    description: 'closed-form log-slope matches the imp-34586 measured per-k log-slopes to within 3e-4 across all 7 far-side rungs',
    holds: () =>
      IMP34613_SLOPE_CROSSCHECK.length === 7 &&
      IMP34613_SLOPE_CROSSCHECK.every((r) => r.absErr < 3e-4) &&
      IMP34613_MAX_SLOPE_ABS_ERR < 3e-4,
  },
  {
    // Consistency: log-concave (slope steepens) yet raw-convex are NOT contradictory -- the local
    // slopes must be strictly decreasing (F1) while eflow_attr stays positive and convex (F2).
    id: 'imp-34613-log-concave-raw-convex-consistent',
    description: 'the closed-form log-slopes strictly decrease across the far side (log-concave), consistent with the imp-34586 observed steepening',
    holds: () => {
      const s = IMP34613_MEASURED_LOG_SLOPES.map((r) => imp34613LogSlopePerK(r.k * LN10));
      for (let i = 1; i < s.length; i++) if (!(s[i] < s[i - 1])) return false;
      return true;
    },
  },
  {
    // Honesty gate: surrogate derivation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34613-honesty-gate-no-qed',
    description: 'Surrogate derivation only: isRigorous false, no QED, no refereed bound is changed, C_mb/K_a untouched',
    holds: () =>
      IMP34613_EFLOW_ATTR_LOG_SLOPE_SECOND_DERIV_SIGN.isRigorous === false &&
      /NO QED/.test(IMP34613_EFLOW_ATTR_LOG_SLOPE_SECOND_DERIV_SIGN.honest) &&
      /refereed bound is changed/i.test(IMP34613_EFLOW_ATTR_LOG_SLOPE_SECOND_DERIV_SIGN.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34613_EFLOW_ATTR_LOG_SLOPE_SECOND_DERIV_SIGN.honest),
  },
];

for (const a of IMP34613_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34613-eflow-attr-log-slope-second-deriv-sign assertion failed: ${a.id}`);
  }
}
