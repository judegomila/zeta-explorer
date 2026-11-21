/**
 * @module imp-124836-invariant-product-discriminator-general-test
 *
 * imp-124836 (proof/formalization, frontier delineation): imp-124811 M2 introduced the invariant product
 * P = |reldiff| * |X| as an ad-hoc discriminator for one identity (the imp-97665 pair-ratio
 * E_CF/E_ET = E_flow/E_trunc): a FLAT P pins |reldiff| to a round-off floor R (pure precision loss),
 * while a constant identity drift D would make P = D*|X| + R DECREASE as the small measured quantity |X|
 * collapses down a ladder. That was stated for a single case and never abstracted. This leaf FORMALIZES the
 * discriminator as a GENERAL test for validating a claimed exact ratio identity A/B = C/D by finite
 * differences when one measured quantity |X| collapses toward the stencil noise floor. It (1) states the
 * unified error model P = (D + tau)*|X| + R separating a genuine relative drift D, a relative truncation
 * floor tau (the O(eps^p) stencil error), and an absolute round-off floor R; (2) states the exact conditions
 * under which flatness of P certifies drift-freeness; (3) exhibits the regime where the test FAILS (the
 * truncation-limited regime, where tau*|X| and D*|X| are algebraically indistinguishable so a decreasing P
 * is ambiguous) -- the very regime the imp-124828 extended-precision re-run entered; and (4) states the
 * sensitivity floor D_min = max(R/|X|_max, tau) the test can certify, plus the eps-scaling disambiguator that
 * separates tau from D. Formalization/derivation only; conditional-share diagnostic context; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; NO QED.
 *
 * THE GENERAL SETUP
 * -----------------
 * A claimed exact identity is written as a ratio equality r_true = C/D that a measured ratio r_meas = X/Y is
 * supposed to equal, where X and Y are estimated by a finite-difference stencil (here X the collapsing axis,
 * Y an O(1) well-resolved reference). Descending a ladder (a control parameter -- the landmark sigma level in
 * the imp-124811 instance) drives |X| -> 0 across many decades while |Y| stays O(1). Define the cross-check
 * relative error
 *   reldiff = | r_meas / r_true - 1 |.
 * With Y well-resolved (its relative FD error negligible against the small-X terms), the ratio error is
 * carried by X:  r_meas/r_true - 1 = D + errX / |X|, where D = (X_true/Y_true)/r_true - 1 is the GENUINE
 * relative identity drift (D = 0 iff the identity holds exactly) and errX is the ABSOLUTE finite-difference
 * error of the small quantity X.
 *
 * THE UNIFIED ERROR MODEL (the deliverable)
 * -----------------------------------------
 * The absolute FD error of X on a p-th-order stencil at step eps splits into two pieces that behave
 * differently as |X| collapses:
 *   errX = R + tau*|X|,
 *     R   = the ADDITIVE round-off floor (a cancellation-catastrophe residual ~ macheps * scale / eps that
 *           is |X|-INDEPENDENT -- it does not shrink as |X| collapses),
 *     tau = the RELATIVE truncation floor (the O(eps^p) stencil bias, which scales WITH the magnitude of the
 *           quantity being differentiated, i.e. proportional to |X|).
 * Substituting gives reldiff = D + R/|X| + tau, and hence the invariant product
 *   P := reldiff * |X| = (D + tau) * |X| + R.
 * This is the general model. imp-124811 wrote the special case P = D*|X| + R by absorbing tau (there
 * tau ~ 3.3e-14, swamped by R ~ 2.3e-12 across the whole ladder).
 *
 * THE DISCRIMINATOR AND ITS VALIDITY CONDITIONS
 * ---------------------------------------------
 * Read the ladder shape of P against the collapsing |X|:
 *   (i)  ROUND-OFF-LIMITED regime -- R dominates the linear term across the ladder, i.e. R >> (D + tau)*|X|_max.
 *        Then P ~ R is FLAT (|X|-independent) and reldiff ~ R/|X| has log-log slope -1. A flat P CERTIFIES
 *        that the linear coefficient is below the resolution the floor allows: |D + tau| <= R/|X|_max, hence
 *        |D| <= R/|X|_max + tau. This is the regime in which the discriminator is VALID.
 *   (ii) LINEAR-DOMINATED regime -- (D + tau)*|X| dominates R across the ladder. Then P ~ (D + tau)*|X|
 *        DECREASES toward the deep tail (log-log slope +1) and reldiff ~ D + tau is FLAT (slope 0). Here the
 *        decreasing P is AMBIGUOUS: it looks identical whether the linear coefficient is a genuine drift D or
 *        a pure truncation floor tau. The test FAILS to certify drift-freeness -- a decreasing P is NOT proof
 *        of drift, because a stencil-truncation floor produces the identical decreasing-P signature with D = 0.
 * The controlling validity condition is therefore: the dominant FD error of the collapsing quantity must be
 * the ADDITIVE round-off floor R (giving reldiff ~ R/|X|, slope -1), NOT a RELATIVE error tau (giving reldiff
 * flat, slope 0). The imp-124769 round-off-vs-truncation crossover pins where R overtakes tau*|X|; the
 * discriminator only certifies drift-freeness on the round-off-limited side. Raising precision LIFTS R (the
 * round-off floor collapses), which pushes the test OUT of the valid regime and into the truncation-limited
 * failure regime -- exactly what imp-124828 observed: at dps in {30,50,80} the flat P shattered (max/min
 * 8.5 -> 2.9e8), the P-vs-|X| slope flipped -1.085 -> +0.121, and reldiff plateaued at the |X|-INDEPENDENT
 * O(eps^4) stencil floor tau = 3.333e-14. That plateau (reldiff flat, not R/|X|) is the truncation-limited
 * signature; the identity carries no drift, but the FLAT-P test no longer applies there.
 *
 * SEPARATING tau FROM D (the disambiguator) AND THE SENSITIVITY FLOOR
 * ------------------------------------------------------------------
 * A constant relative drift D and a constant relative truncation floor tau are ALGEBRAICALLY
 * indistinguishable within a single (eps, precision) setting -- both add a constant to reldiff and a linear
 * term to P. They separate only by their eps/precision dependence: tau ~ eps^p shrinks under step refinement
 * (or is bounded by the stencil order), while D is eps- and precision-INVARIANT. Refining eps by a factor s
 * drops the truncation contribution by s^p but leaves any genuine drift unchanged; this is the operative
 * content of the imp-124808/imp-124828 extended-precision cross-checks (reldiff plateaued at the same
 * 3.333e-14 across dps 30/50/80, i.e. eps/precision-invariant at that step -> truncation, D = 0).
 * The SMALLEST drift the test can certify (its sensitivity floor) is set by whichever floor is larger:
 *   D_min = max( R / |X|_max , tau ).
 * A drift below D_min is buried -- either under the round-off floor (D*|X|_max < R) or under the truncation
 * floor (D < tau) -- and leaves P flat within its scatter, so the test can only report D <= D_min, consistent
 * with D = 0, never D = 0 exactly. For the imp-124811 instance R ~ 2.34e-12, |X|_max = |E_CF|(L2) = 0.2516,
 * tau ~ 3.33e-14, so D_min ~ R/|X|_max ~ 9.3e-12 (round-off-limited); the measured cap D <= 5.8e-12 at the
 * flow-heavy rung sits at that floor scale -- fully consistent with the imp-124808 dps=100 result D = 0.
 *
 * FORMALIZATION / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The pair-ratio identity and
 * its component model are the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the
 * imp-398 C_F prefactor are UNTOUCHED and appear here only as the source of the anchor literals; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the ad-hoc P = D*|X| + R discriminator formalized here)
 * @see imp-124828-extprec-pairratio-Pladder (extended precision: R collapses, reldiff -> tau = 3.333e-14; the failure regime)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the round-off-vs-truncation crossover pinning the valid regime)
 * @see imp-124813-pairratio-L8-doubleprec-depth-limit (the direct-check double-precision depth limit ~3 digits)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (the EXACT pair-ratio identity under test)
 */

// Anchor literals inherited VERBATIM from the imp-124811 ladder and the imp-124828 extended-precision re-run
// (baked, not recomputed: this leaf is a formalization of the discriminator, not a re-measurement).
const IMP124811_ABS_X = [2.5163e-1, 3.9989e-3, 7.3778e-5, 3.2456e-6, 2.3935e-7, 1.1655e-8]; // |E_CF| L2..L7
const IMP124811_R = 2.34e-12; // geomean invariant product P = round-off floor (double precision)
const IMP124811_DRIFT_CAP = 5.8e-12; // |reldiff|(L2), the flow-heavy-rung residual-drift cap
const IMP124828_TAU = 3.333e-14; // the O(eps^4) stencil truncation floor (dps-invariant across 30/50/80)
const X_MAX = Math.max(...IMP124811_ABS_X); // flow-heavy rung |X| (least round-off-contaminated)

// --- General model: reldiff and the invariant product on a synthetic ladder --------------------------------
// reldiff_i = D + R/|X|_i + tau  ;  P_i = reldiff_i * |X|_i = (D + tau)*|X|_i + R.
function ladder(absX, D, tau, R) {
  return absX.map((x) => {
    const reldiff = D + R / x + tau;
    return { x, reldiff, product: reldiff * x };
  });
}

// log-log ordinary-least-squares slope of y against x over the ladder rows.
function loglogSlope(rows, ykey) {
  const xs = rows.map((r) => Math.log(r.x));
  const ys = rows.map((r) => Math.log(Math.abs(r[ykey])));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return sxy / sxx;
}
const spread = (rows) => {
  const ps = rows.map((r) => r.product);
  return Math.max(...ps) / Math.min(...ps);
};
// P at the flow-heavy end over P at the deep tail: ~1 flat (no drift), >>1 decreasing (linear-dominated).
const pRatioHeavyOverTail = (rows) => {
  const heavy = rows.reduce((a, b) => (b.x > a.x ? b : a));
  const tail = rows.reduce((a, b) => (b.x < a.x ? b : a));
  return heavy.product / tail.product;
};

const round = (x, s = 4) => +x.toExponential(s);

// --- The four canonical regimes (same |X| ladder; only D, tau, R change) -----------------------------------
// A: ROUND-OFF-LIMITED, drift-free (the valid regime -- reproduces imp-124811). Flat P, reldiff slope -1.
const REGIME_A = ladder(IMP124811_ABS_X, 0, IMP124828_TAU, IMP124811_R);

// B: a GENUINE drift dominates the linear term across the ladder (same round-off floor R present).
//    Decreasing P (drift detected).
const D_B = 1e-2;
const REGIME_B = ladder(IMP124811_ABS_X, D_B, 0, IMP124811_R);

// C: TRUNCATION-limited, drift-free (D = 0) with a truncation floor tau = D_B and the SAME round-off floor R.
//    Because P sees only the sum (D + tau), REGIME_C is algebraically IDENTICAL to REGIME_B: a decreasing P is
//    AMBIGUOUS -- it cannot tell a genuine drift from a pure truncation floor. This is the FAILURE regime, the
//    one the imp-124828 extended-precision run entered when R was lifted.
const TAU_C = 1e-2; // a truncation floor of the same size as the drift D_B
const REGIME_C = ladder(IMP124811_ABS_X, 0, TAU_C, IMP124811_R);

// D: a drift BELOW the sensitivity floor -- invisible under the round-off floor, P stays flat.
const D_MIN = Math.max(IMP124811_R / X_MAX, IMP124828_TAU); // = R/|X|_max here (round-off-limited)
const D_D = D_MIN / 10;
const REGIME_D = ladder(IMP124811_ABS_X, D_D, IMP124828_TAU, IMP124811_R);

// --- The eps-scaling disambiguator: tau ~ eps^p shrinks; a genuine drift D does not -------------------------
// On a 4th-order stencil, halving eps drops the truncation contribution by 2^4 = 16 while drift is unchanged.
const STENCIL_ORDER = 4;
const EPS_HALVING = (() => {
  const s = 0.5; // eps -> s*eps
  const tau_refined = TAU_C * s ** STENCIL_ORDER; // truncation floor after refinement
  return {
    truncation_ratio: tau_refined / TAU_C, // 1/16 -> identifies a truncation floor
    drift_ratio: D_B / D_B, // 1 -> a genuine drift is eps-invariant
  };
})();

const A_P_SLOPE = loglogSlope(REGIME_A, 'product');
const A_RELDIFF_SLOPE = loglogSlope(REGIME_A, 'reldiff');
const B_P_SLOPE = loglogSlope(REGIME_B, 'product');
const C_P_SLOPE = loglogSlope(REGIME_C, 'product');
const C_RELDIFF_SLOPE = loglogSlope(REGIME_C, 'reldiff');
const D_P_SLOPE = loglogSlope(REGIME_D, 'product');

export const IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST = {
  id: 'imp-124836',
  proofSection: 'S-frontier',
  question:
    'imp-124811 M2 used the invariant product P = |reldiff|*|X| as an ad-hoc discriminator (flat P => round-off ' +
    'floor R, decreasing P => a constant identity drift D via P = D*|X| + R) for one identity. Formalize it as a ' +
    'GENERAL test for validating a claimed exact ratio identity A/B = C/D by finite differences when one measured ' +
    'quantity |X| collapses toward the stencil noise floor: state the model, the conditions under which flatness ' +
    'of P certifies drift-freeness, the regime where it fails (both truncation and round-off scaling together), ' +
    'and the sensitivity floor it can certify. Formalization/derivation only; no bound moves; no QED.',
  method:
    'Split the absolute FD error of the collapsing quantity as errX = R + tau*|X| (R the |X|-independent ' +
    'round-off floor, tau the relative O(eps^p) truncation floor), giving the unified model reldiff = D + R/|X| ' +
    '+ tau and P = (D + tau)*|X| + R. Read the ladder shape of P vs |X|: flat P (round-off-limited, R dominates) ' +
    'certifies |D + tau| <= R/|X|_max; decreasing P (linear-dominated) is ambiguous between a drift D and a ' +
    'truncation floor tau. Demonstrate the four canonical regimes on the imp-124811 |X| ladder and the ' +
    'eps-scaling disambiguator (tau ~ eps^p refines away, D does not), and read off D_min = max(R/|X|_max, tau).',
  model:
    'reldiff = D + R/|X| + tau ; P = |reldiff|*|X| = (D + tau)*|X| + R (D drift, tau relative truncation floor, ' +
    'R absolute round-off floor). imp-124811 special case P = D*|X| + R absorbs the swamped tau.',
  anchor_imp124811: {
    absX_L2_to_L7: IMP124811_ABS_X.map((x) => round(x)),
    R_roundoff_floor: round(IMP124811_R),
    tau_stencil_floor: round(IMP124828_TAU),
    drift_cap_at_L2: round(IMP124811_DRIFT_CAP),
    X_max: round(X_MAX),
  },
  regimes: {
    A_roundoff_limited_driftfree: {
      D: 0, tau: round(IMP124828_TAU), R: round(IMP124811_R),
      P_loglog_slope: round(A_P_SLOPE, 3), reldiff_loglog_slope: round(A_RELDIFF_SLOPE, 3),
      P_spread_max_over_min: +spread(REGIME_A).toFixed(3),
      note: 'flat P (slope ~0), reldiff slope ~ -1: VALID regime, certifies D <= R/|X|_max (reproduces imp-124811).',
    },
    B_drift_dominated: {
      D: round(D_B), tau: 0, R: round(IMP124811_R),
      P_loglog_slope: round(B_P_SLOPE, 3),
      P_ratio_heavy_over_tail: round(pRatioHeavyOverTail(REGIME_B)),
      note: 'decreasing P (slope ~ +1): a GENUINE drift is detected.',
    },
    C_truncation_limited_driftfree_FAILURE: {
      D: 0, tau: round(TAU_C), R: round(IMP124811_R),
      P_loglog_slope: round(C_P_SLOPE, 3), reldiff_loglog_slope: round(C_RELDIFF_SLOPE, 3),
      P_ratio_heavy_over_tail: round(pRatioHeavyOverTail(REGIME_C)),
      note: 'decreasing P (slope ~ +1) with D = 0 and tau = D_B: ALGEBRAICALLY IDENTICAL to regime B (P sees ' +
        'only D + tau) -- the FAILURE regime. A decreasing P is NOT proof of drift; the imp-124828 ' +
        'extended-precision run entered this regime when R was lifted.',
    },
    D_drift_below_floor: {
      D: round(D_D), tau: round(IMP124828_TAU), R: round(IMP124811_R),
      P_loglog_slope: round(D_P_SLOPE, 3),
      P_spread_max_over_min: +spread(REGIME_D).toFixed(3),
      note: 'a drift below D_min leaves P flat: the test can only report D <= D_min, never D = 0 exactly.',
    },
  },
  disambiguator_eps_scaling: {
    stencil_order_p: STENCIL_ORDER,
    truncation_ratio_under_eps_halving: round(EPS_HALVING.truncation_ratio),
    drift_ratio_under_eps_halving: EPS_HALVING.drift_ratio,
    note: 'tau ~ eps^p drops by 2^p = 16 under eps -> eps/2 while a genuine drift D is eps/precision-invariant; ' +
      'this separates the two indistinguishable linear terms (the imp-124808/imp-124828 cross-check content).',
  },
  sensitivity_floor: {
    D_min: round(D_MIN),
    formula: 'D_min = max(R/|X|_max, tau)',
    value_note: 'imp-124811: R/|X|_max ~ ' + round(IMP124811_R / X_MAX) + ' dominates tau ~ ' + round(IMP124828_TAU) +
      ', so D_min ~ ' + round(D_MIN) + '; the measured cap D <= ' + round(IMP124811_DRIFT_CAP) + ' sits at that ' +
      'floor scale, consistent with the imp-124808 dps=100 result D = 0.',
  },
  finding: {
    F1_unified_model:
      'The invariant product obeys P = (D + tau)*|X| + R, unifying a genuine relative drift D, the relative ' +
      'truncation floor tau (O(eps^p) stencil bias, proportional to |X|), and the absolute round-off floor R ' +
      '(|X|-independent). imp-124811 P = D*|X| + R is the special case where tau is swamped by R.',
    F2_validity_condition:
      'Flatness of P certifies drift-freeness ONLY in the round-off-limited regime R >> (D + tau)*|X|_max, where ' +
      'reldiff ~ R/|X| (log-log slope -1) and P is flat; then |D| <= R/|X|_max + tau. The controlling condition ' +
      'is that the dominant FD error be the ADDITIVE floor R, not a relative floor tau.',
    F3_failure_regime:
      'In the linear-dominated / truncation-limited regime ((D + tau)*|X| >> R) P DECREASES (slope +1) whether ' +
      'the coefficient is a genuine drift D or a pure truncation floor tau -- they are algebraically ' +
      'indistinguishable, so a decreasing P is NOT proof of drift. Raising precision lifts R and pushes the test ' +
      'into this regime; imp-124828 observed exactly this (flat P shattered, slope flipped to +0.121, reldiff ' +
      'plateaued at the |X|-independent stencil floor tau = 3.333e-14).',
    F4_disambiguator_and_floor:
      'tau and D separate only by eps/precision dependence: tau ~ eps^p refines away (factor 2^p under eps/2) ' +
      'while D is invariant (the imp-124808/imp-124828 content). The certifiable sensitivity floor is ' +
      'D_min = max(R/|X|_max, tau); below it a drift is buried and the test reports only D <= D_min. For ' +
      'imp-124811 D_min ~ ' + round(D_MIN) + ', consistent with the imp-124808 D = 0.',
  },
  isRigorous: false,
  verdict:
    'FORMALIZATION + DERIVATION (frontier delineation, NOT rigorous). The imp-124811 invariant-product ' +
    'discriminator generalizes to any claimed exact ratio identity A/B = C/D cross-checked by finite differences ' +
    'when one measured quantity |X| collapses toward the stencil noise floor. The unified model is ' +
    'P = |reldiff|*|X| = (D + tau)*|X| + R, separating a genuine relative drift D, the relative O(eps^p) ' +
    'truncation floor tau, and the absolute round-off floor R. FLAT P certifies drift-freeness ONLY in the ' +
    'round-off-limited regime R >> (D + tau)*|X|_max (reldiff ~ R/|X|, slope -1), where |D| <= R/|X|_max + tau; ' +
    'a synthetic regime A on the imp-124811 |X| ladder reproduces this (P slope ' + round(A_P_SLOPE, 3) +
    ', reldiff slope ' + round(A_RELDIFF_SLOPE, 3) + '). The test FAILS in the linear/truncation-limited regime: ' +
    'a decreasing P (slope +1) is algebraically the same for a genuine drift (regime B, P slope ' +
    round(B_P_SLOPE, 3) + ') and a pure truncation floor with D = 0 (regime C, P slope ' + round(C_P_SLOPE, 3) +
    ', reldiff slope ' + round(C_RELDIFF_SLOPE, 3) + '), so a decreasing P is NOT proof of drift -- the very ' +
    'regime imp-124828 entered at extended precision (R collapsed, reldiff plateaued at the |X|-independent ' +
    'stencil floor tau = 3.333e-14). tau and D separate only by eps/precision scaling (tau ~ eps^p refines away ' +
    'by 2^p under eps/2; D is invariant). The certifiable sensitivity floor is D_min = max(R/|X|_max, tau) ~ ' +
    round(D_MIN) + ' for the imp-124811 instance; the measured cap D <= ' + round(IMP124811_DRIFT_CAP) +
    ' sits at that floor scale, consistent with the imp-124808 dps=100 result D = 0. Conditional-share diagnostic ' +
    'on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486, the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (used ' +
    'only as anchor literals); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124811 (the ad-hoc P = D*|X| + R discriminator formalized here); imp-124828 (extended precision: R ' +
    'collapses, reldiff -> tau = 3.333e-14, the failure regime); imp-124808 (mpmath dps=100 proof D = 0); ' +
    'imp-124769 (round-off-vs-truncation crossover); imp-124813 (direct-check double-precision depth limit); ' +
    'imp-97665 (the EXACT pair-ratio identity under test); imp-486 (C_mb GUE-conditional).',
};

export const IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST_ASSERTIONS = [
  {
    // The unified model P = (D + tau)*|X| + R is exact: reconstruct P from the parts at every rung.
    id: 'imp124836-unified-model-reconstructs-P',
    description: 'P_i reconstructs as (D + tau)*|X|_i + R to machine precision for regimes B and C',
    holds: () =>
      REGIME_B.every((r) => Math.abs(r.product - ((D_B + 0) * r.x + IMP124811_R)) < 1e-18) &&
      REGIME_C.every((r) => Math.abs(r.product - ((0 + TAU_C) * r.x + IMP124811_R)) < 1e-18),
  },
  {
    // (Valid regime A): flat P (slope ~0) and reldiff slope ~ -1 -- the round-off-limited certification.
    id: 'imp124836-regimeA-flat-P-reldiff-slope-minus-one',
    description: 'regime A (D=0, round-off-limited): |P slope| < 0.15 and reldiff slope within 0.15 of -1',
    holds: () => Math.abs(A_P_SLOPE) < 0.15 && Math.abs(A_RELDIFF_SLOPE - -1) < 0.15,
  },
  {
    // (Valid regime A): the flat product certifies a drift cap at the round-off floor / |X|_max scale.
    id: 'imp124836-regimeA-P-spread-bounded',
    description: 'regime A invariant product stays within a factor 20 across the ladder (a flat floor)',
    holds: () => spread(REGIME_A) < 20,
  },
  {
    // (Drift regime B): a genuine drift makes P decrease toward the tail (heavy/tail ratio >> 1).
    id: 'imp124836-regimeB-drift-decreasing-P',
    description: 'regime B (genuine drift): P slope > 0.5 and P(heavy)/P(tail) > 100',
    holds: () => B_P_SLOPE > 0.5 && pRatioHeavyOverTail(REGIME_B) > 100,
  },
  {
    // (Failure regime C): a pure truncation floor with D=0 ALSO makes P decrease -- indistinguishable from B.
    id: 'imp124836-regimeC-truncation-mimics-drift',
    description: 'regime C (D=0, truncation-limited) gives the same decreasing-P signature as regime B: both P ' +
      'slopes > 0.5 and within 0.15 of each other -> a decreasing P is NOT proof of drift',
    holds: () => C_P_SLOPE > 0.5 && Math.abs(C_P_SLOPE - B_P_SLOPE) < 0.15,
  },
  {
    // (Failure regime C): reldiff is FLAT (slope ~0) there, the truncation-limited signature (vs -1 in A).
    id: 'imp124836-regimeC-reldiff-flat',
    description: 'regime C reldiff log-log slope is within 0.15 of 0 (truncation floor, |X|-independent reldiff)',
    holds: () => Math.abs(C_RELDIFF_SLOPE) < 0.15,
  },
  {
    // (Sensitivity floor): a drift below D_min = max(R/|X|_max, tau) is invisible -- P stays flat.
    id: 'imp124836-drift-below-floor-invisible',
    description: 'regime D (D = D_min/10) leaves P flat (spread < 20): the test can only certify D <= D_min',
    holds: () => Math.abs(D_P_SLOPE) < 0.15 && spread(REGIME_D) < 20,
  },
  {
    // (Sensitivity floor): D_min matches R/|X|_max at the imp-124811 instance (round-off-limited, ~9e-12).
    id: 'imp124836-Dmin-matches-roundoff-over-Xmax',
    description: 'D_min = max(R/|X|_max, tau) equals R/|X|_max here and lands in [1e-12, 1e-11]',
    holds: () =>
      Math.abs(D_MIN - IMP124811_R / X_MAX) < 1e-18 && D_MIN > 1e-12 && D_MIN < 1e-11,
  },
  {
    // (Disambiguator): a 4th-order stencil drops the truncation floor by 2^4 = 16 under eps/2; drift unchanged.
    id: 'imp124836-eps-scaling-separates-tau-from-drift',
    description: 'truncation ratio under eps/2 is 1/16 (tau ~ eps^4) while the drift ratio is exactly 1',
    holds: () =>
      Math.abs(EPS_HALVING.truncation_ratio - 1 / 16) < 1e-12 && EPS_HALVING.drift_ratio === 1,
  },
  {
    // Honesty gate: formalization/derivation only, no QED, no refereed bound is changed.
    id: 'imp124836-honesty-gate-no-qed',
    description: 'Formalization/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST.isRigorous === false &&
      /NO QED/.test(IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST.verdict),
  },
];

for (const a of IMP124836_INVARIANT_PRODUCT_DISCRIMINATOR_GENERAL_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124836-invariant-product-discriminator-general-test assertion failed: ${a.id}`);
  }
}
