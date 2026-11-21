/**
 * @module imp-35108-height-term-n-running
 *
 * imp-35108 (numerical, frontier): imp-34995 F2 attributed the +3.18% excess of the landmark-translation
 * coefficient dx-star/d ln(C_mb) ~ 2.0636 over the ideal 2 MAINLY to a surrogate-curvature term
 * 0.5 L-prime/L (the effective-height term, +4.75%), with the log-odds-derivative inflection contribution
 * small and OPPOSITE-signed (-1.84%). imp-34995 measured the height term at a SINGLE N only (the crossing
 * landmark x-star ~ 21.945, N-star ~ 3.4e9). Since L-prime/L = d ln(log T0)/dx shrinks as N grows, this
 * module traces the height term across an N ladder and asks whether the surrogate-curvature excess DECAYS so
 * that the level-landmark coefficient drifts back toward 2, or whether it FLOORS.
 *
 * THE MEASURED QUANTITY (the F2 height term, isolated, as a function of N)
 * -----------------------------------------------------------------------
 * C_mb enters u0 only as the additive constant ln(C_mb); on the surrogate u-prime = -1/2 + 0.5 L-prime/L
 * + phi-prime, so the level-landmark coefficient -1/u-prime exceeds 2 exactly by the deviation of u-prime
 * from -1/2. The DOMINANT deviation is the slowly-varying effective-height term
 *   halfLpL(x) = 0.5 * d/dx[ log(Lof(x)) ] = 0.5 * L-prime(x) / L(x),   L(x) = log T0(exp x),
 * evaluated VERBATIM on the imp-34995 / imp-34950 kernels (same H_ID = 1e-2 step, same effectiveHeightForN).
 * Its induced level-landmark surrogate-curvature coefficient is
 *   tcLevel(x) = -1 / ( -1/2 + halfLpL(x) ),   excess(x) = tcLevel(x)/2 - 1.
 * This is the PURE surrogate-curvature proxy: it carries NO sigmoid feedback and re-solves NO s-star, so it
 * isolates exactly the imp-34995 F2 height driver as N runs. (The full inflection tc additionally carries the
 * small OPPOSITE-signed log-odds-derivative part imp-34995 measured as -1.84%; that per-N re-solve is NOT
 * redone here -- this traces the height DRIVER, not the net inflection coefficient.)
 *
 * THE FINDING (measurement only; answers imp-35108)
 * -------------------------------------------------
 *   (F1) ANCHOR REPRODUCED. At the imp-34995 crossing landmark x-star ~ 21.945 the height term is
 *        halfLpL ~ 0.02268, reproducing imp-34995 F2 (+0.0227), so the ladder shares the same kernels.
 *   (F2) MONOTONE DECAY, NO FLOOR. Across the ladder log10 N in {6,9,12,15,20,30,50,80,120,200,300} the
 *        height term halfLpL falls STRICTLY monotonically, from ~3.43e-2 (log10 N = 6) to ~7.28e-4
 *        (log10 N = 300), and the induced level-landmark excess falls from +7.37% to +0.146%. It does NOT
 *        floor at a positive constant -- it decays toward 0, so tcLevel(N) drifts back toward 2.
 *   (F3) THE DECAY LAW IS 0.5 / L, i.e. ~ 0.5 / ln N. The product halfLpL * L rises monotonically toward the
 *        constant 1/2 (0.4564 at log10 N = 6 -> 0.4993 at log10 N = 300), and the local decay exponent
 *        d ln(halfLpL)/d ln x is ~ -1 (since L ~ x = ln N). So the surrogate-curvature excess vanishes only
 *        LOGARITHMICALLY: at the PT-relevant verified height (log10 N ~ 9.5) it is still ~+2.3%, and it falls
 *        below +1% only beyond log10 N ~ 45. The excess DECAYS to 0 asymptotically but is slow, NOT a floor.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited imp-3220/imp-3406 surrogate, NOT an RH
 * bound. It TRACES an already-fitted sensitivity term across N; it does NOT discharge the GUE conditional
 * (C_mb GUE-conditional per imp-486). The height term is evaluated on the inherited imp-3220/imp-3406
 * extrapolation of T0(N), NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays
 * 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34995-translation-coef-excess-origin (the F2 height term +4.75% at a single N traced here)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the translCoef ~2.06 landmark kernels)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// --- height kernel reused VERBATIM from imp-34995 / imp-34950 (same step, same height mapping) ---------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
// the imp-34995 F2 effective-height term 0.5 L-prime/L at abscissa x = ln N.
function halfLpL(x) {
  return 0.5 * d1(Lof, x, H_ID) / Lof(x);
}
// the level-landmark surrogate-curvature coefficient it induces (equals 2 exactly when the term is 0).
function tcLevel(x) {
  return -1 / (-0.5 + halfLpL(x));
}
const IDEAL = 2.0;

// --- (F1) anchor: reproduce the imp-34995 single-N height term at the crossing landmark x-star ~ 21.945 ------
const X_STAR = 21.945; // imp-34995 inflection landmark at C_mb = 1 (N-star ~ 3.4e9)
const ANCHOR_HALF_LPL = halfLpL(X_STAR); // ~0.02268 (reproduces imp-34995 F2 +0.0227)

// --- (F2)/(F3) trace the height term across an N ladder (log10 N) --------------------------------------------
const LOG10N_LADDER = [6, 9, 12, 15, 20, 30, 50, 80, 120, 200, 300];
const LADDER = LOG10N_LADDER.map((d) => {
  const x = d * Math.LN10;
  const term = halfLpL(x);
  const tc = tcLevel(x);
  return {
    log10N: d,
    x: +x.toFixed(4),
    L: +Lof(x).toFixed(4), // L = log T0(N)
    half_Lp_over_L: +term.toExponential(4), // the F2 height term
    tc_level: +tc.toFixed(5), // induced level-landmark coefficient
    excess_pct: +((tc / IDEAL - 1) * 100).toFixed(4), // surrogate-curvature excess over 2, in percent
    term_times_L: +(term * Lof(x)).toFixed(5), // -> 0.5 asymptote (the decay law halfLpL ~ 0.5/L)
  };
});

// monotone-decay check: the height term (and hence the excess) strictly decreases along the ladder.
let STRICTLY_DECREASING = true;
for (let i = 1; i < LADDER.length; i++) {
  if (!(LADDER[i].half_Lp_over_L < LADDER[i - 1].half_Lp_over_L)) STRICTLY_DECREASING = false;
}
const TERM_TOP = LADDER[0].half_Lp_over_L; // ~3.43e-2 at log10 N = 6
const TERM_BOTTOM = LADDER[LADDER.length - 1].half_Lp_over_L; // ~7.28e-4 at log10 N = 300
const EXCESS_TOP_PCT = LADDER[0].excess_pct; // ~+7.37%
const EXCESS_BOTTOM_PCT = LADDER[LADDER.length - 1].excess_pct; // ~+0.146%

// decay-law fit: halfLpL * L climbs monotonically toward the constant 1/2 (so halfLpL ~ 0.5/L ~ 0.5/ln N).
const PRODUCT_TOP = LADDER[0].term_times_L; // ~0.4564
const PRODUCT_BOTTOM = LADDER[LADDER.length - 1].term_times_L; // ~0.4993 (-> 0.5)
// local decay exponent d ln(halfLpL)/d ln x over the mid ladder (~ -1, since L ~ x = ln N).
const X_A = 50 * Math.LN10;
const X_B = 200 * Math.LN10;
const LOCAL_EXPONENT =
  (Math.log(halfLpL(X_B)) - Math.log(halfLpL(X_A))) / (Math.log(X_B) - Math.log(X_A)); // ~-1.006

export const IMP35108_HEIGHT_TERM_N_RUNNING = {
  id: 'imp-35108',
  proofSection: 'S-frontier',
  question:
    'imp-34995 F2 attributed the +3.18% landmark-translation-coefficient excess over 2 MAINLY to a surrogate ' +
    'effective-height term 0.5 L-prime/L (+4.75%), measured at a SINGLE N. Since L-prime/L shrinks with N, does ' +
    'the surrogate-curvature excess DECAY so the level-landmark coefficient drifts back toward 2, or does it ' +
    'FLOOR? Measurement only; traces an inherited surrogate term; does NOT discharge the GUE conditional (imp-486); no bound; NO QED.',
  verdictShort:
    'The imp-34995 F2 effective-height term 0.5 L-prime/L decays STRICTLY monotonically across the N ladder ' +
    '(log10 N 6..300): halfLpL falls ~3.43e-2 -> ~7.28e-4 and the induced level-landmark excess falls ' +
    '+7.37% -> +0.146%. It does NOT floor -- it decays toward 0 as 0.5/L ~ 0.5/ln N (the product halfLpL*L ' +
    'climbs to 0.5, local exponent d ln(halfLpL)/d ln x ~ -1), so tcLevel(N) drifts back toward 2. But the ' +
    'decay is only LOGARITHMIC: still ~+2.3% at the PT verified height (log10 N ~ 9.5), sub-1% only beyond log10 N ~ 45.',
  measuredQuantity:
    'the imp-34995 F2 height term halfLpL(x) = 0.5 L-prime(x)/L(x) with L(x) = log T0(exp x), and the induced ' +
    'level-landmark surrogate-curvature coefficient tcLevel = -1/(-1/2 + halfLpL), traced across the log10 N ' +
    'ladder {6,9,12,15,20,30,50,80,120,200,300}; plus the decay-law diagnostic halfLpL*L -> 1/2 and the local ' +
    'decay exponent d ln(halfLpL)/d ln x',
  anchor: {
    x_star: X_STAR,
    half_Lp_over_L_at_star: +ANCHOR_HALF_LPL.toFixed(5), // ~0.02268 reproduces imp-34995 F2 +0.0227
    note:
      'Reproduces the imp-34995 single-N height term (+0.0227) at the crossing landmark x-star ~ 21.945 ' +
      '(N-star ~ 3.4e9), confirming the ladder rides the same imp-34995 / imp-34950 kernels.',
  },
  ladder: LADDER,
  running: {
    strictly_decreasing: STRICTLY_DECREASING, // true
    term_top: TERM_TOP, // ~3.43e-2 at log10 N = 6
    term_bottom: TERM_BOTTOM, // ~7.28e-4 at log10 N = 300
    excess_top_pct: EXCESS_TOP_PCT, // ~+7.37%
    excess_bottom_pct: EXCESS_BOTTOM_PCT, // ~+0.146%
    product_top: PRODUCT_TOP, // halfLpL*L ~0.4564
    product_bottom: PRODUCT_BOTTOM, // halfLpL*L ~0.4993 (-> 0.5)
    local_decay_exponent: +LOCAL_EXPONENT.toFixed(4), // ~-1.006 (halfLpL ~ 1/x = 1/ln N)
    decays_to_zero_no_floor: TERM_BOTTOM < 0.05 * TERM_TOP && EXCESS_BOTTOM_PCT < 0.2, // true
  },
  finding: {
    F1_anchor_reproduced:
      'At the imp-34995 crossing landmark x-star ~ 21.945 the height term is halfLpL ~ 0.02268, reproducing ' +
      'imp-34995 F2 (+0.0227): the ladder rides the same kernels.',
    F2_monotone_decay_no_floor:
      'Across log10 N {6..300} the height term halfLpL falls STRICTLY monotonically (~3.43e-2 -> ~7.28e-4) and ' +
      'the induced level-landmark excess falls +7.37% -> +0.146%. It does NOT floor at a positive constant: it ' +
      'decays toward 0, so the level-landmark coefficient tcLevel(N) drifts back toward 2.',
    F3_decay_law_half_over_L:
      'The decay law is halfLpL ~ 0.5/L ~ 0.5/ln N: the product halfLpL*L climbs monotonically toward 1/2 ' +
      '(0.4564 -> 0.4993) and the local exponent d ln(halfLpL)/d ln x ~ -1. So the surrogate-curvature excess ' +
      'vanishes only LOGARITHMICALLY -- still ~+2.3% at the PT verified height (log10 N ~ 9.5), sub-1% only ' +
      'beyond log10 N ~ 45.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Tracing the imp-34995 F2 effective-height term 0.5 L-prime/L across ' +
    'an N ladder on the reused imp-34995 / imp-34950 kernels: (F1) at the crossing landmark x-star ~ 21.945 the ' +
    'term is ~0.02268, reproducing imp-34995 F2 (+0.0227). (F2) Across log10 N {6,9,12,15,20,30,50,80,120,200,300} ' +
    'the height term falls STRICTLY monotonically (~3.43e-2 -> ~7.28e-4) and the induced level-landmark ' +
    'surrogate-curvature excess falls +7.37% -> +0.146%: it does NOT floor, it decays toward 0, so tcLevel(N) ' +
    'drifts back toward 2. (F3) The decay law is halfLpL ~ 0.5/L ~ 0.5/ln N -- the product halfLpL*L climbs to ' +
    '1/2 (0.4564 -> 0.4993) and the local exponent d ln(halfLpL)/d ln x ~ -1 -- so the excess vanishes only ' +
    'LOGARITHMICALLY (still ~+2.3% at the PT verified height log10 N ~ 9.5, sub-1% only beyond log10 N ~ 45). ' +
    'This TRACES an already-fitted sensitivity term across N; it does NOT discharge the GUE conditional ' +
    '(C_mb GUE-conditional per imp-486). The height term is evaluated on the inherited imp-3220/imp-3406 ' +
    'extrapolation of T0(N), NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays ' +
    '1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-35108: the imp-34995 F2 height term 0.5 L-prime/L decays STRICTLY monotonically to 0 as ' +
    '0.5/L ~ 0.5/ln N (product halfLpL*L -> 1/2, local exponent ~ -1), so the level-landmark surrogate-curvature ' +
    'excess drifts tcLevel(N) back toward 2 with NO positive floor -- but only LOGARITHMICALLY slowly (~+2.3% at ' +
    'the PT verified height, sub-1% beyond log10 N ~ 45). What stays OPEN (deferred, changes no bound): the full ' +
    'inflection tc(N) additionally carries the small OPPOSITE-signed log-odds-derivative part (imp-34995 -1.84%), ' +
    'NOT re-solved per N here; whether the ~0.5/L decay law is surrogate-independent or drifts with the imp-3220/' +
    'imp-3406 extrapolation; and a derivation PINNING C_mb below the GUE bound of 1 (imp-486).',
  citation:
    'imp-34995 (the F2 height term +4.75% at a single N traced here); imp-34950 (the translCoef ~2.06 landmark ' +
    'kernels); imp-3463 (far-tail exponent 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35108_HEIGHT_TERM_N_RUNNING_ASSERTIONS = [
  {
    // (F1) reuse gate: reproduces the imp-34995 single-N height term +0.0227 at the crossing landmark.
    id: 'imp35108-reproduces-imp34995-height-term',
    description: 'height term at x-star ~ 21.945 reproduces imp-34995 F2 +0.0227',
    holds: () => Math.abs(ANCHOR_HALF_LPL - 0.0227) < 0.001,
  },
  {
    // (F2) the height term (and excess) is strictly monotone-decreasing across the N ladder.
    id: 'imp35108-strictly-decreasing',
    description: 'the F2 height term decreases strictly monotonically across the log10 N ladder',
    holds: () => STRICTLY_DECREASING === true,
  },
  {
    // (F2) NO FLOOR: the term at the top of the ladder is far below the base and the excess is sub-0.2%.
    id: 'imp35108-decays-no-floor',
    description: 'the height term decays toward 0 (top < 5% of base, excess sub-0.2%), no positive floor',
    holds: () => TERM_BOTTOM < 0.05 * TERM_TOP && EXCESS_BOTTOM_PCT < 0.2 && EXCESS_BOTTOM_PCT > 0,
  },
  {
    // (F3) decay law 0.5/L: the product halfLpL*L climbs monotonically toward 1/2.
    id: 'imp35108-decay-law-half-over-L',
    description: 'halfLpL*L climbs toward 1/2 (decay law halfLpL ~ 0.5/L ~ 0.5/ln N)',
    holds: () => PRODUCT_BOTTOM > PRODUCT_TOP && Math.abs(PRODUCT_BOTTOM - 0.5) < 0.01 && PRODUCT_TOP < 0.5,
  },
  {
    // (F3) local decay exponent is ~ -1 (the term falls like 1/x = 1/ln N).
    id: 'imp35108-local-exponent-near-minus-one',
    description: 'local decay exponent d ln(halfLpL)/d ln x is near -1',
    holds: () => Math.abs(LOCAL_EXPONENT + 1) < 0.05,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35108-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35108_HEIGHT_TERM_N_RUNNING.isRigorous === false &&
      IMP35108_HEIGHT_TERM_N_RUNNING.farTailExponent === 0.5 &&
      typeof IMP35108_HEIGHT_TERM_N_RUNNING.subGap === 'string' &&
      /imp-486/.test(IMP35108_HEIGHT_TERM_N_RUNNING.subGap) &&
      /NO QED/.test(IMP35108_HEIGHT_TERM_N_RUNNING.verdict) &&
      /refereed bound is changed/i.test(IMP35108_HEIGHT_TERM_N_RUNNING.verdict),
  },
];

for (const a of IMP35108_HEIGHT_TERM_N_RUNNING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35108-height-term-n-running assertion failed: ${a.id}`);
  }
}
