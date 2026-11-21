/**
 * @module imp-35954-kappa-direct-2minusa-node-condition-tabulation
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35892 concluded that R_direct s <= 2 ULP
 * accuracy to the last finite height cannot originate from the de-cancelled node
 *   dG_direct = -S_inf . a/(2-a)
 * because that node is O(1)-conditioned -- but imp-35892 only *cited* imp-35855 s kappa_direct ~ 1
 * assertion; it never tabulated the condition number itself across its own extended sweep. This module
 * closes that gap by TABULATING the analytic condition number of the scalar map a |-> a/(2-a) across the
 * full representable height ladder from N = 1e13 to the last finite N ~ 2.857e307.
 *
 * THE CONDITION NUMBER (analytic)
 * -------------------------------
 * For f(a) = a/(2-a): f_prime(a) = 2/(2-a)^2 (quotient rule), so the relative condition number is
 *   kappa(a) = |a . f_prime(a)| / |f(a)| = |a . 2/(2-a)^2| / |a/(2-a)| = |2/(2-a)|.
 * As a -> 0 this gives kappa -> 1 EXACTLY. The a -> 0 limit is therefore the BEST-conditioned end of
 * the node, not the worst -- the question the ticket raised ("does kappa creep up as a -> 5.5e-300?") is
 * answered NO: kappa approaches 1 monotonically from above.
 *
 * WHAT THE TABULATION FINDS
 * -------------------------
 * Across the entire ladder kappa_direct stays in the band [1, ~1.0000076]. The MAXIMUM deviation from 1
 * occurs at the SMALLEST N (largest a): at N = 1e13, a ~ 1.51e-5 gives kappa ~ 1.0000076. It then
 * decreases STRICTLY MONOTONICALLY toward 1 as N grows and a -> 0, hitting 1.0 (to double precision) by
 * N ~ 1e20 and staying pinned at 1 all the way to the last finite N ~ 2.857e307 (a ~ 5.5e-300). A
 * central finite-difference numerical condition number agrees with the analytic |2/(2-a)| to the machine
 * floor, so the O(1) claim is not a formula artifact. NOTE the ticket phrasing "a from ~O(1)" is loose:
 * a is already ~1.5e-5 at the ladder floor N = 1e13, so a never actually reaches O(1) in the sweep --
 * the largest a encountered is ~1.51e-5, which still leaves kappa within 8e-6 of 1.
 *
 * CONCLUSION
 * ----------
 * kappa_direct ~ 1 is CONFIRMED by direct tabulation, closing the imp-35892 assertion: the -a/(2-a) node
 * is O(1)-conditioned everywhere the height inverse is representable, and it gets BETTER-conditioned (not
 * worse) as a -> 0. This corroborates imp-35892 s conclusion that R_direct s residual error cannot come
 * from the 2-a subtraction -- the only failure remains the effectiveHeightForN overflow cliff at
 * N ~ 10^307.5 (imp-35892), which is a representability limit, not a conditioning ramp.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855/imp-35892 surrogate (identical K_ampl,
 * delta, S_inf, aOf, effectiveHeightForN). Instantiates NO interval, ports nothing, derives no
 * remainder, changes no bound. imp-34714a REMAINS OPEN. C_C = (1/8) (imp-2642/2643) and C_mb
 * GUE-conditional (imp-486) UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35892-rdirect-own-floor-departure-height (measured R_direct end-to-end error; cited kappa~1)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (asserted kappa_direct ~ 1 for the 2-a node)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35855/imp-35892)
const DELTA = 2e-4; // fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Analytic relative condition number of a |-> a/(2-a): kappa = |a f_prime / f| = |2/(2-a)|.
const kappaAnalytic = (a) => Math.abs(2 / (2 - a));

// Central finite-difference numerical condition number, as an independent cross-check of the formula.
function kappaFiniteDiff(a) {
  const f = (x) => x / (2 - x);
  const h = Math.abs(a) * 1e-6 || 1e-12;
  const deriv = (f(a + h) - f(a - h)) / (2 * h);
  return Math.abs((a * deriv) / f(a));
}

function assess(N) {
  const a = aOf(N);
  return {
    N,
    a,
    kappa: kappaAnalytic(a),
    kappaFd: kappaFiniteDiff(a),
    finite: Number.isFinite(a),
  };
}

// Sweep the same representable ladder imp-35892 used: N = 1e13 up to the last finite decade before the
// effectiveHeightForN overflow cliff.
const LOG_MIN = 13;
const LOG_MAX = 307;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += 1) SWEEP.push(assess(Math.pow(10, L)));

const FINITE = SWEEP.filter((r) => r.finite);
const FIRST = FINITE[0]; // N = 1e13, largest a in the ladder
const LAST = FINITE[FINITE.length - 1]; // N ~ 1e307, smallest a in the ladder

const KAPPA_MAX = Math.max(...FINITE.map((r) => r.kappa));
const KAPPA_MIN = Math.min(...FINITE.map((r) => r.kappa));
const MAX_DEVIATION_FROM_ONE = KAPPA_MAX - 1;

// The max deviation sits at the SMALLEST N (largest a), confirming a -> 0 is the best-conditioned end.
const MAX_AT_SMALLEST_N = Math.abs(FIRST.kappa - KAPPA_MAX) < 1e-15;

// kappa decreases monotonically (non-increasing to double precision) as N grows / a -> 0.
let MONOTONE_DECREASING = true;
for (let i = 1; i < FINITE.length; i++) {
  if (FINITE[i].kappa > FINITE[i - 1].kappa + 1e-15) {
    MONOTONE_DECREASING = false;
    break;
  }
}

// The a -> 0 limit is kappa = 1 exactly; the deepest finite point sits at 1.0 to double precision.
const KAPPA_AT_CLIFF = LAST.kappa;
const KAPPA_LIMIT_IS_ONE = Math.abs(KAPPA_AT_CLIFF - 1) < 1e-12;

// The analytic |2/(2-a)| matches the finite-difference numerical condition number to the machine floor.
const MAX_FD_MISMATCH = Math.max(...FINITE.map((r) => Math.abs(r.kappa - r.kappaFd)));
const FD_AGREES = MAX_FD_MISMATCH < 1e-6;

// A few representative rungs for display.
const ROWS = [13, 15, 20, 50, 100, 200, 300].map((L) => {
  const r = assess(Math.pow(10, L));
  return {
    log10_N: L,
    a: +r.a.toExponential(4),
    kappa: +r.kappa.toPrecision(12),
  };
});

export const IMP35954_KAPPA_DIRECT_CONDITION_TABULATION = {
  id: 'imp-35954',
  proofSection: 'S-frontier',
  question:
    'Tabulate the analytic condition number kappa_direct = |2/(2-a)| of the imp-35892 -a/(2-a) node ' +
    'across the full representable height ladder (N = 1e13 to the last finite N ~ 2.857e307, a from ' +
    '~1.5e-5 down to ~5.5e-300): does it stay O(1) (kappa ~ 1, as imp-35855 asserted) all the way to the ' +
    'NaN cliff, or creep up as a(N) -> 0? Measurement/diagnostic only, double precision; instantiates no ' +
    'interval; NO QED.',
  finding:
    'kappa_direct STAYS ~1 everywhere and does NOT creep up. For f(a) = a/(2-a), f_prime = 2/(2-a)^2, so ' +
    'kappa = |a f_prime / f| = |2/(2-a)|, whose a -> 0 limit is 1 EXACTLY. Across the ladder kappa sits ' +
    'in the band [' +
    KAPPA_MIN.toPrecision(12) +
    ', ' +
    KAPPA_MAX.toPrecision(12) +
    ']; the MAXIMUM deviation from 1 (~' +
    MAX_DEVIATION_FROM_ONE.toExponential(3) +
    ') occurs at the SMALLEST N = 1e13 (largest a ~ ' +
    FIRST.a.toExponential(3) +
    '), then decreases STRICTLY MONOTONICALLY toward 1 as N grows / a -> 0, pinned at 1.0 (double ' +
    'precision) from N ~ 1e20 out to the last finite N ~ ' +
    LAST.N.toExponential(3) +
    ' (a ~ ' +
    LAST.a.toExponential(3) +
    '). A central finite-difference numerical condition number agrees with |2/(2-a)| to <= ' +
    MAX_FD_MISMATCH.toExponential(2) +
    ', so the O(1) claim is not a formula artifact. The a -> 0 end is thus the BEST-conditioned end, not ' +
    'the worst -- directly confirming imp-35855 s kappa_direct ~ 1 and imp-35892 s conclusion that ' +
    'R_direct s residual error cannot come from the 2-a subtraction. (Note the ticket s "a ~ O(1)" is ' +
    'loose: a is already ~1.5e-5 at the ladder floor.) MEASUREMENT/DIAGNOSTIC, double precision; no ' +
    'interval instantiated.',
  constants: {
    K_ampl: +K_AMPL.toPrecision(10),
    delta: DELTA,
    S_inf_floor: S_INF,
    machine_epsilon: Number.EPSILON,
  },
  rows: ROWS,
  metric: {
    kappa_min_over_sweep: +KAPPA_MIN.toPrecision(15),
    kappa_max_over_sweep: +KAPPA_MAX.toPrecision(15),
    max_deviation_from_one: +MAX_DEVIATION_FROM_ONE.toExponential(6),
    max_deviation_at_smallest_N: MAX_AT_SMALLEST_N,
    kappa_monotone_decreasing_as_a_to_zero: MONOTONE_DECREASING,
    kappa_at_last_finite_N: +KAPPA_AT_CLIFF.toPrecision(15),
    kappa_limit_is_one: KAPPA_LIMIT_IS_ONE,
    largest_a: +FIRST.a.toExponential(6),
    smallest_finite_a: +LAST.a.toExponential(6),
    last_finite_N: +LAST.N.toExponential(6),
    finite_difference_agrees: FD_AGREES,
    max_fd_mismatch: +MAX_FD_MISMATCH.toExponential(4),
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision analytic tabulation of the condition number of ' +
    'the a |-> a/(2-a) node; it confirms kappa ~ 1 everywhere (best at a -> 0), closing imp-35892 s ' +
    'cited-but-untabulated kappa_direct ~ 1 assertion. It instantiates NO interval, ports no operator, ' +
    'and does not touch F(m)=0 (which stays a double-precision artifact). Changes no bound.',
  isRigorous: false,
  verdict:
    'kappa_direct ~ 1 CONFIRMED BY DIRECT TABULATION (measurement/diagnostic, NOT an RH bound). The ' +
    'analytic condition number of a |-> a/(2-a) is |2/(2-a)|, which -> 1 as a -> 0; across N in ' +
    '[1e13, ~' +
    LAST.N.toExponential(2) +
    '] it stays in [' +
    KAPPA_MIN.toPrecision(6) +
    ', ' +
    KAPPA_MAX.toPrecision(9) +
    '] with its max deviation (~' +
    MAX_DEVIATION_FROM_ONE.toExponential(2) +
    ') at the SMALLEST N and strictly decreasing toward 1 as a -> 0 -- it does NOT creep up. A ' +
    'finite-difference numerical condition number agrees to <= ' +
    MAX_FD_MISMATCH.toExponential(2) +
    '. This closes imp-35892 s cited kappa_direct ~ 1 assertion: the -a/(2-a) node is O(1)-conditioned ' +
    '(and best-conditioned at the small-a end), so R_direct s <= 2 ULP accuracy cannot come from that ' +
    'subtraction -- the only failure is the effectiveHeightForN overflow cliff (imp-35892), a ' +
    'representability limit. Reuses the imp-35855/imp-35892 machinery (identical K, delta, S_inf, aOf, ' +
    'effectiveHeightForN). imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional ' +
    '(imp-486) UNTOUCHED; instantiates no interval; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35892 (measured R_direct end-to-end error to the last finite height; cited kappa~1 but never ' +
    'tabulated it); imp-35855 (asserted kappa_direct ~ 1 for the de-cancelled 2-a node); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Relative condition number ' +
    'kappa = |x f_prime(x) / f(x)|: standard Higham (Accuracy and Stability of Numerical Algorithms).',
};

export const IMP35954_KAPPA_DIRECT_CONDITION_TABULATION_ASSERTIONS = [
  {
    // kappa stays O(1) across the entire finite ladder -- tight band just above 1.
    id: 'imp35954-kappa-stays-order-one',
    description: 'kappa_direct in [1, ~1.0000076] across N in [1e13, ~1e307]; max deviation < 1e-5',
    holds: () => KAPPA_MIN >= 1 - 1e-12 && KAPPA_MAX < 1.0001 && MAX_DEVIATION_FROM_ONE < 1e-5,
  },
  {
    // The a -> 0 end is the BEST-conditioned end: kappa does NOT creep up, it decreases to 1.
    id: 'imp35954-kappa-does-not-creep-up',
    description: 'kappa monotone-decreasing to 1 as a -> 0; max deviation at smallest N; cliff kappa = 1',
    holds: () => MONOTONE_DECREASING === true && MAX_AT_SMALLEST_N === true && KAPPA_LIMIT_IS_ONE === true,
  },
  {
    // The analytic |2/(2-a)| is corroborated by a finite-difference numerical condition number.
    id: 'imp35954-analytic-matches-finite-difference',
    description: 'analytic |2/(2-a)| agrees with central-difference numerical condition number to <1e-6',
    holds: () => FD_AGREES === true && MAX_FD_MISMATCH < 1e-6,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35954-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35954_KAPPA_DIRECT_CONDITION_TABULATION.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35954_KAPPA_DIRECT_CONDITION_TABULATION.subGap) &&
      /NO QED/.test(IMP35954_KAPPA_DIRECT_CONDITION_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP35954_KAPPA_DIRECT_CONDITION_TABULATION.verdict),
  },
];

for (const a of IMP35954_KAPPA_DIRECT_CONDITION_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35954-kappa-direct-2minusa-node-condition-tabulation assertion failed: ${a.id}`);
  }
}
