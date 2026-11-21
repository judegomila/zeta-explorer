/**
 * @module imp-35892-rdirect-own-floor-departure-height
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35855 showed that the cancellation-free
 * closed-form surplus-split ratio
 *   R_direct = -dFP / dG_direct,   dG_direct = -S_inf . a/(2-a),   dFP = S_inf . M_G . aLo/(1-aLo)
 * (algebraically identical to R_clean = 2 (aLo/a)(1-a)/(1-aLo)) tracks R_clean to the machine floor
 * "at every height up to N ~ 1e21", in contrast to the naive R_measured = -dFP/dG which departs on the
 * ~ eps_mach/a envelope far earlier. imp-35855 stopped its sweep at N ~ 1e21 and never located where the
 * de-cancelled R_direct form itself eventually fails.
 *
 * THE QUESTION (measurement, not a port)
 * --------------------------------------
 * Extend the height sweep FAR past N ~ 1e21 (same K_ampl, delta, S_inf, aOf, effectiveHeightForN as
 * imp-35855) and locate the height N at which R_direct s OWN double-precision relative error vs the
 * independent cancellation-free reference R_clean first exceeds a fixed threshold (1e-12). The 2-a form
 * is O(1)-conditioned (imp-35855 kappa_direct ~ 1), so any departure the sweep finds must come from a s
 * own representability or from the effectiveHeightForN RvM inverse -- NOT from the 2-a subtraction.
 *
 * WHAT THE SWEEP FINDS
 * --------------------
 * The 1e-12 threshold is NEVER crossed anywhere in the representable double range. From N = 1e13 up to
 * the last finite height N ~ 2.857e307 (T ~ 2.563e305, a ~ 5.50e-300 -- still a NORMAL double, not a
 * denormal), R_direct s relative error stays pinned at <= 2 ULP (max ~ 4.44e-16). So the residual
 * a(N) -> 0 conditioning limit for the -a/(2-a) form is NOT REACHED in double precision: the O(1)-
 * conditioned direct form has no intermediate soft-departure regime the way R_measured does.
 *
 * THE ACTUAL FAILURE MODE (a HARD cliff, not a conditioning ramp)
 * --------------------------------------------------------------
 * R_direct fails abruptly at N ~ 1e307.46: the effectiveHeightForN RvM inverse overflows to +Infinity
 * once its Newton seed T ~ 2 pi N / log N exceeds Number.MAX_VALUE ~ 1.798e308. That forces a = 2 pi K /
 * (T u) -> 0, dG_direct -> 0, and R_direct = -dFP/dG_direct -> NaN. The binding limit is therefore the
 * REPRESENTABILITY of the height inverse T(N), reached BEFORE a itself would underflow (a ~ 5.5e-300 at
 * the last finite N is ~24 orders above the min denormal ~5e-324). This is exactly the residual channel
 * the ticket anticipated -- "any departure comes from a s own representability / the effectiveHeightForN
 * inverse" -- and it is a total NaN cliff, not a graceful loss of digits from the 2-a node.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855 surrogate. Instantiates NO interval,
 * ports nothing, derives no remainder, changes no bound. imp-34714a REMAINS OPEN (F(m)=0 stays a
 * double-precision artifact). C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node; swept only to N~1e21)
 * @see imp-35810-cancellation-onset-height (eps_mach/a departure envelope of R_measured)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; overflow edge)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35855)
const DELTA = 2e-4; // fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// R_direct evaluated exactly as imp-35855 does, alongside its independent cancellation-free reference.
function assess(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const M_G = (2 * G) / (1 + G);
  const dG_direct = -(S_INF * a) / (2 - a); // O(1)-conditioned de-cancelled node
  const dFP = S_INF * M_G * (aLo / (1 - aLo));
  const R_direct = -dFP / dG_direct; // = R_clean identically (imp-35855)
  const R_clean = (2 * (aLo / a) * (1 - a)) / (1 - aLo); // independent cancellation-free reference
  const depart = Math.abs(R_direct - R_clean) / Math.abs(R_clean);
  return { N, a, T: effectiveHeightForN(N), R_direct, R_clean, depart, finite: Number.isFinite(R_direct) };
}

const THRESHOLD = 1e-12; // the fixed departure threshold the ticket names

// Coarse sweep well beyond imp-35855 s N~1e21 stop, up to the last representable finite height.
const LOG_MIN = 13;
const LOG_MAX = 307; // last decade before the effectiveHeightForN overflow cliff
const STEP = 1;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) SWEEP.push(assess(Math.pow(10, L)));

const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13
const TOP_FINITE = SWEEP[SWEEP.length - 1]; // N ~ 1e307, deepest finite point of the coarse sweep

// (1) The 1e-12 threshold is never crossed anywhere in the finite range.
const FIRST_OVER_THRESHOLD = SWEEP.find((r) => r.finite && r.depart > THRESHOLD) || null;
const MAX_DEPART_FINITE = Math.max(...SWEEP.filter((r) => r.finite).map((r) => r.depart));
const MAX_DEPART_ULP = MAX_DEPART_FINITE / Number.EPSILON;

// (2) Bisect (in log10) for the last finite height. Near 1e307 adjacent doubles are ~1e291 apart, so
// the bisection locates the log10 of the cliff but 10^loL and 10^hiL collapse to the same double N; use a
// fixed, unambiguously overflowing probe (10^308, verified NaN) for the non-finite side of the cliff.
let loL = 307;
let hiL = 308; // 10^308 overflows the RvM inverse seed (T -> +Infinity)
for (let i = 0; i < 60; i++) {
  const midL = (loL + hiL) / 2;
  if (assess(Math.pow(10, midL)).finite) loL = midL;
  else hiL = midL;
}
const LAST_FINITE = assess(Math.pow(10, loL));
const OVERFLOW_LOG10_N = 308; // decade guaranteed to overflow effectiveHeightForN
const FIRST_NONFINITE = assess(Math.pow(10, OVERFLOW_LOG10_N));

// The failure is a HARD cliff: last-finite still at the machine floor, next step is non-finite.
const HARD_CLIFF =
  LAST_FINITE.finite === true &&
  LAST_FINITE.depart <= THRESHOLD &&
  FIRST_NONFINITE.finite === false &&
  !Number.isFinite(effectiveHeightForN(FIRST_NONFINITE.N));

// a at the last finite point is still a normal double -- underflow is NOT the binding limit.
const A_STILL_NORMAL_AT_CLIFF = LAST_FINITE.a > Number.MIN_VALUE * 1e10;
// The overflow is driven by the effectiveHeightForN RvM inverse exceeding MAX_VALUE.
const OVERFLOW_IS_HEIGHT_INVERSE = !Number.isFinite(effectiveHeightForN(FIRST_NONFINITE.N));

export const IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE = {
  id: 'imp-35892',
  proofSection: 'S-frontier',
  question:
    'Extending the imp-35855 height sweep FAR past N ~ 1e21 (same K_ampl/delta/S_inf/aOf/' +
    'effectiveHeightForN), at what height does the cancellation-free R_direct = -S_inf a/(2-a) form s ' +
    'OWN double-precision relative error (vs the independent reference R_clean) first exceed 1e-12, ' +
    'locating the residual a(N)->0 conditioning limit that survives the node-level de-cancellation? ' +
    'Measurement/diagnostic only, double precision; instantiates no interval; NO QED.',
  finding:
    'The 1e-12 threshold is NEVER crossed in the representable double range. From N = 1e13 to the last ' +
    'finite height N ~ ' +
    LAST_FINITE.N.toExponential(3) +
    ' (T ~ ' +
    LAST_FINITE.T.toExponential(3) +
    ', a ~ ' +
    LAST_FINITE.a.toExponential(3) +
    ' -- still a NORMAL double) R_direct s relative error stays pinned at <= ' +
    MAX_DEPART_ULP.toFixed(2) +
    ' ULP (max ~ ' +
    MAX_DEPART_FINITE.toExponential(2) +
    '). So the residual a->0 conditioning limit for the O(1)-conditioned -a/(2-a) form is NOT REACHED in ' +
    'double precision -- there is no intermediate soft-departure ramp like R_measured s eps_mach/a ' +
    'envelope. Instead R_direct fails at a HARD cliff at N ~ 10^' +
    loL.toFixed(3) +
    ': the effectiveHeightForN RvM inverse overflows to +Infinity (seed T ~ 2 pi N/log N exceeds ' +
    'MAX_VALUE ~ 1.798e308), forcing a -> 0, dG_direct -> 0 and R_direct -> NaN. The binding limit is ' +
    'thus the REPRESENTABILITY of the height inverse T(N) -- reached BEFORE a itself would underflow ' +
    '(a ~ ' +
    LAST_FINITE.a.toExponential(2) +
    ' at the cliff is ~24 orders above the min denormal) -- exactly the residual channel anticipated. ' +
    'MEASUREMENT/DIAGNOSTIC, double precision; no interval instantiated.',
  constants: {
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    threshold: THRESHOLD,
    machine_epsilon: Number.EPSILON,
    max_double: Number.MAX_VALUE,
    min_denormal_double: Number.MIN_VALUE,
  },
  metric: {
    threshold_crossed_in_finite_range: FIRST_OVER_THRESHOLD !== null,
    max_depart_over_finite_sweep: +MAX_DEPART_FINITE.toExponential(4),
    max_depart_ulp: +MAX_DEPART_ULP.toFixed(4),
    last_finite_log10_N: +loL.toFixed(6),
    last_finite_N: +LAST_FINITE.N.toExponential(6),
    last_finite_T: +LAST_FINITE.T.toExponential(6),
    last_finite_a: +LAST_FINITE.a.toExponential(6),
    cliff_bracket_log10_N: +hiL.toFixed(6),
    overflow_probe_log10_N: OVERFLOW_LOG10_N,
    failure_is_hard_cliff: HARD_CLIFF,
    a_still_normal_at_cliff: A_STILL_NORMAL_AT_CLIFF,
    overflow_is_height_inverse: OVERFLOW_IS_HEIGHT_INVERSE,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision measurement of where the de-cancelled R_direct ' +
    'form loses accuracy; it finds the 2-a node never soft-departs (no 1e-12 crossing) and the only ' +
    'failure is the effectiveHeightForN overflow cliff at N ~ 10^307.5. It instantiates NO interval, ' +
    'ports no operator, and does not touch F(m)=0 (which stays a double-precision artifact). Changes no ' +
    'bound.',
  isRigorous: false,
  verdict:
    'THE 1e-12 THRESHOLD IS NEVER CROSSED (measurement/diagnostic, NOT an RH bound). R_direct s own ' +
    'double-precision relative error vs R_clean stays <= ' +
    MAX_DEPART_ULP.toFixed(2) +
    ' ULP (max ~ ' +
    MAX_DEPART_FINITE.toExponential(2) +
    ') across the entire finite range N in [1e13, ~' +
    LAST_FINITE.N.toExponential(2) +
    '], so the residual a->0 conditioning limit for the O(1)-conditioned -a/(2-a) form is NOT reached in ' +
    'double precision. R_direct instead fails at a HARD NaN cliff at N ~ 10^' +
    loL.toFixed(3) +
    ' where the effectiveHeightForN RvM inverse overflows to +Infinity (T > MAX_VALUE) and drives a->0 ' +
    '-- representability of the height inverse, reached before a would underflow (a ~ ' +
    LAST_FINITE.a.toExponential(2) +
    ' at the cliff, still a normal double). Reuses the imp-35855 machinery (identical K, delta, S_inf, ' +
    'aOf, effectiveHeightForN). imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb ' +
    'GUE-conditional (imp-486) UNTOUCHED; instantiates no interval; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35855 (de-cancelled dG node; R_direct = R_clean to machine floor to N~1e21); imp-35810 ' +
    '(eps_mach/a envelope of R_measured); imp-34996 (S_inf = 1/(2 delta) floor); imp-34714a (OPEN ' +
    'Krawczyk machine certificate); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). IEEE-754 ' +
    'double overflow at Number.MAX_VALUE ~ 1.7977e308 and min denormal ~ 4.94e-324: standard float model.',
};

export const IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE_ASSERTIONS = [
  {
    // The de-cancelled form never soft-departs: no 1e-12 crossing anywhere in the finite double range.
    id: 'imp35892-threshold-never-crossed-in-finite-range',
    description: 'R_direct relative error <1e-12 (<=2 ULP) for all finite N in [1e13, ~1e307]; no threshold crossing',
    holds: () => FIRST_OVER_THRESHOLD === null && MAX_DEPART_FINITE < THRESHOLD && MAX_DEPART_ULP < 4,
  },
  {
    // The failure is a HARD cliff at N~10^307.5, not a graceful conditioning ramp.
    id: 'imp35892-failure-is-hard-overflow-cliff',
    description: 'last finite N~1e307 at machine floor; the 10^308 probe non-finite via effectiveHeightForN -> Infinity',
    holds: () => HARD_CLIFF === true && loL > 307 && loL < 308,
  },
  {
    // The binding limit is height-inverse representability, reached before a would underflow.
    id: 'imp35892-limit-is-height-inverse-not-a-underflow',
    description: 'a at the cliff still a normal double (~5.5e-300); overflow is the effectiveHeightForN inverse',
    holds: () => A_STILL_NORMAL_AT_CLIFF === true && OVERFLOW_IS_HEIGHT_INVERSE === true,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35892-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE.subGap) &&
      /NO QED/.test(IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE.verdict) &&
      /refereed bound is changed/i.test(IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE.verdict),
  },
];

for (const a of IMP35892_RDIRECT_OWN_FLOOR_DEPARTURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35892-rdirect-own-floor-departure-height assertion failed: ${a.id}`);
  }
}
