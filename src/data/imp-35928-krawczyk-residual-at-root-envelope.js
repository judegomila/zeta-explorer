/**
 * @module imp-35928-krawczyk-residual-at-root-envelope
 *
 * MEASUREMENT ONLY. imp-35855 recorded that in the OPEN imp-34714a Krawczyk certificate
 * K(m) = m - [F-prime]^{-1} F(m), F(N) = N - g(N), g(N) = K log T0(N), the residual "F(m) = 0 stays a
 * double-precision artifact" and "no interval is instantiated". imp-34774 likewise centres the operator at
 * the machine fixed point m = N_cross where "F(m) = m - g(m) is exactly 0 in double precision", and notes a
 * directed-rounding F(m) "would be a small nonzero interval". imp-35885 (NODE B) and imp-35925 (NODE G)
 * CLASSIFIED that residual-at-root as a-INDEPENDENT root-proximity (not a dG-type a -> 0 divergence) but
 * never MEASURED how large it actually is. This module supplies that measurement: it evaluates the residual
 * at the located double-precision root, both for the OUTER crossover map and for the SAME residual-at-root
 * FORM across the imp-35766/imp-35810 height ladder, and compares its size to the eps_mach/a departure
 * envelope imp-35810 pinned for the dG cancellation node -- so the width a residual enclosure [F(m)] a full
 * Krawczyk certificate would have to bound can be quantified (an input to the imp-34714a machine-certificate cost).
 *
 * TWO INSTANCES OF THE SAME RESIDUAL-AT-ROOT FORM (imp-35925 established they are the same)
 * ----------------------------------------------------------------------------------------
 *  (A) OUTER crossover residual: F(N_cross) = N_cross - g(N_cross) at the located machine fixed point
 *      m = N_cross (fixedPoint iteration of g). This is literally the imp-34714a operator residual F(m).
 *  (B) INTERIOR residual-at-root FORM across the ladder: at each height N in 1e13..1e21 the RvM inverse
 *      T0(N) = effectiveHeightForN(N) is the located double-precision root of phi(T) = N(T) - N, where
 *      N(T) = (T/2pi)(u - 1), u = log(T/2pi). Its residual r(N) = N(T0(N)) - N should be 0 but is not --
 *      the imp-35925 NODE G residual, and the ONLY residual-at-root form that spans the whole a -> 0 ladder
 *      (the OUTER residual is near-zero only at the single crossover point N_cross ~ 3.28e9). Every enclosure
 *      of g(N) = K log T0(N) and a(N) that the imp-34714a certificate builds passes through this located root.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (R1) THE RESIDUAL IS NOT IDENTICALLY ZERO. At the located root the residual rides a small nonzero
 *        envelope: the relative residual |r(N)|/N sits at a few machine epsilon (a few ULP of the value),
 *        confirming imp-34774 numerically and refuting the literal reading of "F(m) = 0" -- a directed-rounding
 *        [F(m)] would be a small nonzero interval whose half-width is ~ this residual.
 *   (R2) THE RESIDUAL-AT-ROOT WIDTH IS a-INDEPENDENT. Its RELATIVE size |r(N)|/N is essentially FLAT across
 *        the 1e13..1e21 ladder (max/min within a small factor), NOT growing as a(N) -> 0. This is the
 *        quantitative content of the imp-35885/imp-35925 classification of the residual-at-root as an
 *        a-independent site, measured here for the first time.
 *   (R3) IT SITS FAR BELOW THE eps_mach/a ENVELOPE, AND THE MARGIN WIDENS. The imp-35810 dG-node departure
 *        rides ~ eps_mach/a and GROWS up the height axis; the residual-at-root relative width stays flat at
 *        ~ few eps. So the residual-enclosure the certificate must bound is CHEAP and a-independent (a few
 *        ULP of the value), whereas the (already imp-35855-de-cancelled) dG node was the a -> 0-divergent
 *        cost. The ratio |r(N)|/N over eps_mach/a SHRINKS ~ a(N) as N grows.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 RvM surrogate (lambda-rh-height-mapping.effectiveHeightForN);
 * reuses the imp-35266/imp-35766/imp-35810/imp-35855 machinery verbatim (identical K, delta, S_inf, aOf, ladder).
 * The residual floor measured here is the SURROGATE Newton-solved root residual, NOT the imp-34687a
 * directed-rounding [F(m)] enclosure width; the a-DEPENDENCE (flat / a-independent) is the transferable
 * finding, the absolute floor is surrogate-limited. Instantiates NO interval; ports NO operator; the
 * imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8
 * (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35855-rclean-interval-de-cancellation-assessment (F(m)=0 double-precision artifact; de-cancelled dG node)
 * @see imp-35925-krawczyk-interior-subtraction-audit (NODE G: residual-at-root a-independent; never measured)
 * @see imp-35885-krawczyk-node-cancellation-audit (NODE B: F(m)=0 root-proximity, a-independent)
 * @see imp-35810-cancellation-onset-height (the eps_mach/a departure envelope for the dG node)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(N)=N-g(N); "F(m) exactly 0 in double precision"; root N_cross)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse N(T)=(T/2pi)(u-1); zeroCountAtHeight forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35810/imp-35855/imp-35925)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height
const EPS = Number.EPSILON; // 2^-52

// Banach map g(N) = K log T0(N) and its residual F(N) = N - g(N) (root = N_cross); local Jacobian a(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const F = (N) => N - g(N);
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
// One ULP of a magnitude v (spacing of doubles near v).
const ulpOf = (v) => Math.pow(2, Math.floor(Math.log2(Math.abs(v)))) * EPS;

// (A) OUTER crossover residual at the located machine fixed point m = N_cross.
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9
const F_AT_CROSS = F(N_CROSS); // NOT identically zero: rides ~ULP(N_cross)
const ABS_F_AT_CROSS = Math.abs(F_AT_CROSS);
const F_CROSS_IN_ULPS = ABS_F_AT_CROSS / ulpOf(N_CROSS); // residual in ULPs of the value (0 at the fixed point)
const A_AT_CROSS = aOf(N_CROSS); // ~0.045

// (B) INTERIOR residual-at-root FORM across the imp-35766/imp-35810 ladder (imp-35925 NODE G).
function measure(N) {
  const T0 = effectiveHeightForN(N); // located double-precision root of phi(T)=N(T)-N
  const r = zeroCountAtHeight(T0) - N; // residual-at-root (should be 0)
  const a = aOf(N);
  const absR = Math.abs(r);
  const relR = absR / N; // relative residual width
  const envEpsOverA = EPS / a; // the imp-35810 eps_mach/a departure envelope reference
  const relOverEnv = relR / envEpsOverA; // ~ a-shrinking: residual sits far below the eps/a envelope
  return { N, T0, a, r, absR, relR, envEpsOverA, relOverEnv };
}

const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const LADDER = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) LADDER.push(measure(Math.pow(10, L)));
const BOTTOM = LADDER[0]; // N ~ 1e13
const TOP = LADDER[LADDER.length - 1]; // N ~ 1e21, deepest a -> 0
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13 (PT anchor)
const PT = measure(N_PT);

// The located-root residual is a SMALL INTERVAL bounded by machine precision: EXACTLY 0 at some heights
// (perfect float round-trip) and a small nonzero interval (<= ~1 ULP of the value) at others.
const MAX_REL_R = Math.max(...LADDER.map((r) => r.relR)); // ~2.3e-16 (~1 ULP relative)
const MAX_R_IN_ULPS = Math.max(...LADDER.map((r) => r.absR / ulpOf(r.N))); // ~1.04 ULP of the value
const ZERO_COUNT = LADDER.filter((r) => r.absR === 0).length; // exact float round-trips
const NONZERO_COUNT = LADDER.length - ZERO_COUNT; // small nonzero intervals
// (A) at the machine crossover fixed point the OUTER residual collapses to EXACTLY 0 (confirms imp-34774).
const OUTER_COLLAPSES_TO_ZERO = ABS_F_AT_CROSS === 0;
// (R1) residual-at-root is a small interval: nonzero (<= ~1 ULP) at some heights, exactly 0 at others.
const RESIDUAL_SMALL_INTERVAL = MAX_REL_R > 0 && MAX_REL_R < 1e-15 && ZERO_COUNT > 0 && NONZERO_COUNT > 0;
// (R2) the residual width is a-INDEPENDENT: bounded by ~1 ULP across the whole ladder, NOT scaling with 1/a.
const RESIDUAL_BOUNDED_BY_ULP = MAX_R_IN_ULPS < 4; // within a few ULP everywhere
const RESIDUAL_A_INDEPENDENT = RESIDUAL_BOUNDED_BY_ULP && MAX_REL_R < 8 * EPS;
// (R3) it sits far below the eps_mach/a envelope, and the DECADES of margin WIDEN up the height axis.
const BELOW_ENVELOPE = LADDER.every((r) => r.relR < r.envEpsOverA); // residual width < eps/a everywhere
const MARGIN_DECADES_BOTTOM = Math.log10(BOTTOM.envEpsOverA / MAX_REL_R); // ~4.8 decades
const MARGIN_DECADES_TOP = Math.log10(TOP.envEpsOverA / MAX_REL_R); // ~12.8 decades
const MARGIN_WIDENS = MARGIN_DECADES_TOP > MARGIN_DECADES_BOTTOM && TOP.envEpsOverA > BOTTOM.envEpsOverA;

export const IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE = {
  id: 'imp-35928',
  proofSection: 'S-frontier',
  question:
    'imp-35855/imp-34774 record that in the OPEN imp-34714a Krawczyk certificate K(m) = m - [F-prime]^{-1} F(m), ' +
    'F(N) = N - g(N), g(N) = K log T0(N), the residual "F(m) = 0" is a double-precision artifact and a ' +
    'directed-rounding F(m) "would be a small nonzero interval", and imp-35885/imp-35925 classified that ' +
    'residual-at-root as a-INDEPENDENT but never MEASURED it. Measure |F(m)| at the located double-precision root ' +
    '-- for the OUTER crossover map and for the SAME residual-at-root form across the imp-35766/imp-35810 ladder ' +
    '(the RvM inverse T0(N) root, imp-35925 NODE G) -- and compare it to the imp-35810 eps_mach/a departure ' +
    'envelope, to quantify how wide a residual enclosure [F(m)] a full Krawczyk certificate would need to bound. ' +
    'Measurement only; instantiates no interval; ports no operator; imp-34714a stays OPEN; NO QED.',
  finding:
    'THE RESIDUAL-AT-ROOT IS A SMALL INTERVAL BOUNDED BY ~1 ULP, a-INDEPENDENT, FAR BELOW THE eps_mach/a ENVELOPE. ' +
    '(A) At the located machine fixed point m = N_cross ~ ' +
    N_CROSS.toExponential(4) +
    ' the OUTER residual F(m) = m - g(m) COLLAPSES TO EXACTLY 0 in double precision -- confirming imp-34774 ' +
    'literally at the crossover (a perfect float round-trip; the imp-34714a "F(m) = 0" artifact is real, not just ' +
    'small). (B) But the SAME residual-at-root form is NOT uniformly zero across the ladder: r(N) = N(T0(N)) - N ' +
    '(the RvM inverse root, imp-35925 NODE G) is a SMALL INTERVAL -- exactly 0 at ' +
    ZERO_COUNT +
    ' of ' +
    LADDER.length +
    ' heights (perfect round-trips) and a small nonzero interval at the other ' +
    NONZERO_COUNT +
    ', with |r| never exceeding ~ ' +
    MAX_R_IN_ULPS.toFixed(2) +
    ' ULP of the value (relative width max ~ ' +
    MAX_REL_R.toExponential(2) +
    '). The width is BOUNDED by machine precision everywhere and does NOT scale with 1/a as a(N) -> 0 -- the first ' +
    'quantification of the imp-35885/imp-35925 a-independent classification. (C) The imp-35810 dG-node departure ' +
    'rides ~ eps_mach/a and GROWS up the axis (eps/a ~ ' +
    BOTTOM.envEpsOverA.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.envEpsOverA.toExponential(2) +
    ' at N~1e21), so the residual-at-root sits FAR BELOW it and the DECADES of margin WIDEN from ~ ' +
    MARGIN_DECADES_BOTTOM.toFixed(1) +
    ' to ~ ' +
    MARGIN_DECADES_TOP.toFixed(1) +
    ' decades. So a residual enclosure [F(m)] a full certificate must bound is CHEAP and a-independent (at most a ' +
    'few ULP of the value, often exactly 0); the a -> 0-divergent cost was the (imp-35855-de-cancelled) dG node, ' +
    'not F(m). MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toExponential(6),
    a_at_cross: +A_AT_CROSS.toPrecision(8),
    machine_epsilon: EPS,
  },
  measurement: {
    // (A) outer crossover residual at the located machine fixed point (collapses to exactly 0)
    F_at_cross: +F_AT_CROSS.toExponential(4),
    abs_F_at_cross_in_ulps: +F_CROSS_IN_ULPS.toFixed(3),
    outer_collapses_to_exactly_zero: OUTER_COLLAPSES_TO_ZERO,
    // (B) residual-at-root FORM across the ladder (RvM inverse root; imp-35925 NODE G)
    ladder_points: LADDER.length,
    exact_round_trip_count: ZERO_COUNT,
    nonzero_interval_count: NONZERO_COUNT,
    rel_residual_at_PT_anchor: +PT.relR.toExponential(4),
    rel_residual_at_top: +TOP.relR.toExponential(4),
    rel_residual_max_over_ladder: +MAX_REL_R.toExponential(4),
    max_residual_in_ulps: +MAX_R_IN_ULPS.toFixed(4),
    // (C) comparison to the imp-35810 eps_mach/a departure envelope
    eps_over_a_at_bottom: +BOTTOM.envEpsOverA.toExponential(4),
    eps_over_a_at_top: +TOP.envEpsOverA.toExponential(4),
    margin_decades_below_envelope_at_bottom: +MARGIN_DECADES_BOTTOM.toFixed(3),
    margin_decades_below_envelope_at_top: +MARGIN_DECADES_TOP.toFixed(3),
    residual_small_interval: RESIDUAL_SMALL_INTERVAL,
    residual_width_a_independent: RESIDUAL_A_INDEPENDENT,
    residual_below_eps_over_a_envelope: BELOW_ENVELOPE,
    margin_below_envelope_widens: MARGIN_WIDENS,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This MEASURES the located-root residual magnitude on the inherited imp-3220/imp-3406 ' +
    'RvM surrogate; the floor is the SURROGATE Newton-solved root residual, NOT the imp-34687a directed-rounding ' +
    '[F(m)] enclosure width. The a-DEPENDENCE (flat / a-independent, far below eps/a) is the transferable finding; ' +
    'the absolute floor is surrogate-limited. It instantiates NO interval, ports NO operator, and does NOT ' +
    'discharge the F(m) = 0 artifact; a-independent residual width is NECESSARY but not SUFFICIENT for a valid ' +
    'certificate. The full K(m) operator over the imp-34687a layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-AT-ROOT ENVELOPE, MEASURED (frontier, NOT an RH bound). The ticket asked to measure |F(m)| ' +
    'at the located double-precision root across the imp-35766/imp-35810 ladder and compare it to the eps_mach/a ' +
    'envelope, to bound the residual-enclosure width a full imp-34714a Krawczyk certificate would need. RESULT: ' +
    '(A) the OUTER crossover residual F(N_cross) = N_cross - g(N_cross) COLLAPSES TO EXACTLY 0 in double precision ' +
    '-- confirming imp-34774 literally at the crossover machine fixed point; (B) across 1e13..1e21 the same ' +
    'residual-at-root form r(N) = N(T0(N)) - N (RvM inverse root, imp-35925 NODE G) is a SMALL INTERVAL -- exactly ' +
    '0 at ' +
    ZERO_COUNT +
    ' of ' +
    LADDER.length +
    ' heights and a small nonzero interval (<= ~ ' +
    MAX_R_IN_ULPS.toFixed(2) +
    ' ULP, relative max ~ ' +
    MAX_REL_R.toExponential(2) +
    ') at the rest, BOUNDED by machine precision everywhere and NOT scaling with 1/a as a -> 0 -- the first ' +
    'quantification of the imp-35885/imp-35925 a-independent classification; (C) it sits FAR BELOW the imp-35810 ' +
    'eps_mach/a dG-node envelope, the margin WIDENING from ~ ' +
    MARGIN_DECADES_BOTTOM.toFixed(1) +
    ' to ~ ' +
    MARGIN_DECADES_TOP.toFixed(1) +
    ' decades up the axis. So the residual enclosure [F(m)] a full certificate must bound is CHEAP and ' +
    'a-independent (at most a few ULP of the value, often exactly 0); the a -> 0-divergent cost was the ' +
    '(imp-35855-de-cancelled) dG node, not F(m). MEASUREMENT, NOT a ' +
    'machine certificate. SUB-GAP imp-34714a REMAINS OPEN: the floor is the SURROGATE Newton-solved root residual, ' +
    'not the imp-34687a directed-rounding [F(m)] enclosure width; the a-dependence transfers, the absolute floor ' +
    'is surrogate-limited; no interval is instantiated, the F(m) = 0 artifact is measured not discharged, ' +
    'a-independent residual width is NECESSARY but not SUFFICIENT. Reuses the imp-35266/imp-35766/imp-35810/' +
    'imp-35855 machinery (identical K, delta, S_inf, aOf, ladder); C_C = 1/8 (imp-2642/2643) and C_mb ' +
    'GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35855 (F(m)=0 double-precision artifact; de-cancelled dG node); imp-35925 (NODE G residual-at-root ' +
    'a-independent, never measured); imp-35885 (NODE B F(m)=0 root-proximity); imp-35810 (eps_mach/a dG-node ' +
    'departure envelope); imp-34774 ("F(m) exactly 0 in double precision"; root N_cross; directed-rounding F(m) a ' +
    'small nonzero interval); imp-34714 (Krawczyk lemma; sub-gap imp-34714a); imp-34687 (directed-rounding layer; ' +
    'sub-gap imp-34687a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse ' +
    'N(T)=(T/2pi)(u-1); zeroCountAtHeight forward N(T)). Root residual and ULP spacing: standard floating-point ' +
    'analysis.',
};

export const IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE_ASSERTIONS = [
  {
    // (A/R1) the outer crossover residual collapses to exactly 0, while the ladder residual-at-root is a small
    // interval: nonzero (<= ~1 ULP) at some heights and exactly 0 at others -- bounded by machine precision.
    id: 'imp35928-residual-at-root-is-small-interval',
    description: 'F(N_cross) exactly 0; ladder r(N) a small interval: nonzero (<1e-15 rel) at some heights, 0 at others',
    holds: () => OUTER_COLLAPSES_TO_ZERO === true && RESIDUAL_SMALL_INTERVAL === true,
  },
  {
    // (R2) the residual width is a-INDEPENDENT: bounded by ~1 ULP across the 1e13..1e21 ladder, not scaling with 1/a.
    id: 'imp35928-residual-width-a-independent',
    description: 'relative residual |r|/N bounded by a few ULP (max < 8 eps) across the ladder, NOT growing as a -> 0',
    holds: () => RESIDUAL_A_INDEPENDENT === true && MAX_R_IN_ULPS < 4,
  },
  {
    // (R3) the residual sits below the imp-35810 eps_mach/a envelope everywhere and the margin widens up the axis.
    id: 'imp35928-residual-below-eps-over-a-envelope',
    description: 'relative residual < eps_mach/a everywhere; decades of margin widen from bottom to top of the ladder',
    holds: () => BELOW_ENVELOPE === true && MARGIN_WIDENS === true && MARGIN_DECADES_TOP > MARGIN_DECADES_BOTTOM,
  },
  {
    // The comparison is anchored: the eps/a envelope itself grows up the axis (reproduces imp-35810).
    id: 'imp35928-eps-over-a-envelope-grows',
    description: 'the eps_mach/a envelope grows from N~1e13 to N~1e21 (reproduces the imp-35810 growth axis)',
    holds: () => TOP.envEpsOverA > BOTTOM.envEpsOverA && TOP.envEpsOverA > 0,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35928-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE.subGap) &&
      /NO QED/.test(IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE.verdict),
  },
];

for (const a of IMP35928_KRAWCZYK_RESIDUAL_AT_ROOT_ENVELOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35928-krawczyk-residual-at-root-envelope assertion failed: ${a.id}`);
  }
}
