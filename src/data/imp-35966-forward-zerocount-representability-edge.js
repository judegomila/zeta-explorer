/**
 * @module imp-35966-forward-zerocount-representability-edge
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35892 located a HARD NaN cliff at
 * N ~ 10^307.46 where the INVERSE height map effectiveHeightForN(N) overflows to +Infinity once its
 * Newton seed T ~ 2 pi N / log N exceeds Number.MAX_VALUE ~ 1.798e308. imp-35892 imports the FORWARD
 * counter zeroCountAtHeight alongside it (N_PT = zeroCountAtHeight(T_PT)) but never checked whether the
 * forward map has its OWN representability edge.
 *
 * THE QUESTION (measurement, not a port)
 * --------------------------------------
 * Sweep the height T from 1e12 up toward Number.MAX_VALUE and locate the T at which the forward count
 *   zeroCountAtHeight(T) = (T/2pi) (log(T/2pi) - 1)
 * first returns +Infinity / NaN, then compare that edge to the effectiveHeightForN inverse cliff to
 * decide which member of the forward/inverse pair binds FIRST in double precision.
 *
 * WHAT THE SWEEP FINDS
 * --------------------
 * The forward map DOES have its own overflow edge: zeroCountAtHeight(T) stays finite up to input
 * T ~ 1.608e306 (log10 T ~ 306.206), where its OUTPUT count reaches Number.MAX_VALUE ~ 1.798e308; the
 * next representable step returns +Infinity. So the forward map overflows on its OUTPUT (the count),
 * driven by the (T/2pi) log(T/2pi) product exceeding MAX_VALUE, NOT by any log/underflow of the input.
 *
 * WHICH EDGE BINDS FIRST
 * ----------------------
 * The two edges do NOT coincide. The inverse effectiveHeightForN can only PRODUCE heights up to
 * T ~ 2.567e305 (its last-finite output, at input N ~ 10^307.46), whereas the forward map accepts input
 * heights up to T ~ 1.608e306 before overflowing -- about 0.80 decade HIGHER. On the count axis the
 * inverse cliff is reached at N ~ 10^307.46, a factor ~2 pi (~6.28x) BELOW the forward cliff output
 * (Number.MAX_VALUE). Either way the INVERSE map binds first: it cannot even produce a height large
 * enough to make the forward counter overflow, so the forward map carries ~0.8 decade of UNREACHABLE
 * headroom above the inverse ceiling. In the composed pipeline used by imp-35892
 * (N -> effectiveHeightForN -> zeroCountAtHeight) the representability limit is the inverse, exactly as
 * imp-35892 reported; the forward counter is never the binding factor.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the shared lambda-rh-height-mapping maps.
 * Instantiates NO interval, ports nothing, derives no remainder, changes no bound. imp-34714a REMAINS
 * OPEN. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35892-rdirect-own-floor-departure-height (the INVERSE effectiveHeightForN overflow cliff)
 * @see lambda-rh-height-mapping (effectiveHeightForN inverse; zeroCountAtHeight forward counter)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const fwdFinite = (T) => {
  const N = zeroCountAtHeight(T);
  return Number.isFinite(N) && N > 0;
};
const invFinite = (N) => {
  const T = effectiveHeightForN(N);
  return Number.isFinite(T) && T > 0;
};

// (1) FORWARD edge: integer-decade sweep for the last finite input height, then bisect in log10 T.
const FWD_LOG_MIN = 12;
const FWD_LOG_MAX = 308;
let fwdLastDecade = null;
for (let L = FWD_LOG_MIN; L <= FWD_LOG_MAX; L++) {
  if (fwdFinite(Math.pow(10, L))) fwdLastDecade = L;
}
let fwdLo = fwdLastDecade;
let fwdHi = fwdLastDecade + 1;
for (let i = 0; i < 100; i++) {
  const mid = (fwdLo + fwdHi) / 2;
  if (fwdFinite(Math.pow(10, mid))) fwdLo = mid;
  else fwdHi = mid;
}
const FWD_CLIFF_LOG10_T = fwdLo;
const FWD_CLIFF_T = Math.pow(10, fwdLo);
const FWD_CLIFF_N_OUT = zeroCountAtHeight(FWD_CLIFF_T); // the count at the last finite input height
const FWD_FIRST_NONFINITE = zeroCountAtHeight(Math.pow(10, fwdHi)); // +Infinity just past the edge

// (2) INVERSE edge: integer-decade sweep for the last finite output height, then bisect in log10 N.
const INV_LOG_MIN = 12;
const INV_LOG_MAX = 309;
let invLastDecade = null;
for (let L = INV_LOG_MIN; L <= INV_LOG_MAX; L++) {
  if (invFinite(Math.pow(10, L))) invLastDecade = L;
}
let invLo = invLastDecade;
let invHi = invLastDecade + 1;
for (let i = 0; i < 100; i++) {
  const mid = (invLo + invHi) / 2;
  if (invFinite(Math.pow(10, mid))) invLo = mid;
  else invHi = mid;
}
const INV_CLIFF_LOG10_N = invLo;
const INV_MAX_T_PRODUCED = effectiveHeightForN(Math.pow(10, invLo)); // deepest height the inverse yields

// (3) Comparison: which edge binds first, on both the height (T) and count (N) axes.
const T_AXIS_HEADROOM_DECADES = Math.log10(FWD_CLIFF_T) - Math.log10(INV_MAX_T_PRODUCED);
const N_AXIS_FWD_OVER_INV = FWD_CLIFF_N_OUT / Math.pow(10, INV_CLIFF_LOG10_N);
// Inverse binds first iff the highest height it can PRODUCE is below the forward input-overflow edge.
const INVERSE_BINDS_FIRST = INV_MAX_T_PRODUCED < FWD_CLIFF_T && T_AXIS_HEADROOM_DECADES > 0;
// The forward overflow is on its OUTPUT count reaching MAX_VALUE (not an input log/underflow).
const FWD_OVERFLOW_ON_OUTPUT =
  Number.isFinite(FWD_CLIFF_N_OUT) &&
  FWD_CLIFF_N_OUT > Number.MAX_VALUE * 0.99 &&
  !Number.isFinite(FWD_FIRST_NONFINITE);

// Sanity: the PT-anchor forward count stays deep in the finite regime (~1.236e13).
const N_PT = zeroCountAtHeight(T_PT);
const PT_ANCHOR_FAR_BELOW_EDGE = Number.isFinite(N_PT) && Math.log10(T_PT) < FWD_CLIFF_LOG10_T - 200;

export const IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE = {
  id: 'imp-35966',
  proofSection: 'S-frontier',
  question:
    'imp-35892 located the INVERSE effectiveHeightForN overflow cliff (N ~ 10^307.46) but never ' +
    'checked whether the FORWARD counter zeroCountAtHeight(T) it imports has its own representability ' +
    'edge. Sweep T from 1e12 up toward Number.MAX_VALUE, locate the T at which zeroCountAtHeight(T) ' +
    'first returns non-finite, and compare that edge to the effectiveHeightForN cliff to decide which ' +
    'of the forward/inverse pair binds first. Measurement/diagnostic only, double precision; ' +
    'instantiates no interval; NO QED.',
  finding:
    'The forward map DOES have its own overflow edge: zeroCountAtHeight(T) stays finite up to input ' +
    'T ~ ' +
    FWD_CLIFF_T.toExponential(3) +
    ' (log10 T ~ ' +
    FWD_CLIFF_LOG10_T.toFixed(3) +
    '), where its OUTPUT count reaches Number.MAX_VALUE ~ ' +
    FWD_CLIFF_N_OUT.toExponential(3) +
    ' and the next representable step returns +Infinity -- an OUTPUT overflow of the (T/2pi) ' +
    'log(T/2pi) product, not an input log/underflow. But this edge does NOT bind first: the inverse ' +
    'effectiveHeightForN can only PRODUCE heights up to T ~ ' +
    INV_MAX_T_PRODUCED.toExponential(3) +
    ' (last-finite output at N ~ 10^' +
    INV_CLIFF_LOG10_N.toFixed(3) +
    '), about ' +
    T_AXIS_HEADROOM_DECADES.toFixed(2) +
    ' decade BELOW the forward input-overflow edge; on the count axis the inverse cliff sits a factor ' +
    '~' +
    N_AXIS_FWD_OVER_INV.toFixed(2) +
    'x (~2 pi) below the forward output cliff. So the INVERSE binds first: it cannot even produce a ' +
    'height large enough to overflow the forward counter, which carries ~' +
    T_AXIS_HEADROOM_DECADES.toFixed(2) +
    ' decade of UNREACHABLE headroom above the inverse ceiling. In the composed pipeline ' +
    '(N -> effectiveHeightForN -> zeroCountAtHeight) the representability limit is the inverse, exactly ' +
    'as imp-35892 reported. MEASUREMENT/DIAGNOSTIC, double precision; no interval instantiated.',
  constants: {
    T_PT,
    N_at_PT_anchor: +N_PT.toPrecision(15),
    max_double: Number.MAX_VALUE,
    min_denormal_double: Number.MIN_VALUE,
  },
  metric: {
    forward_cliff_log10_T: +FWD_CLIFF_LOG10_T.toFixed(6),
    forward_cliff_T: +FWD_CLIFF_T.toExponential(6),
    forward_cliff_N_output: +FWD_CLIFF_N_OUT.toExponential(6),
    forward_first_nonfinite_is_infinite: FWD_FIRST_NONFINITE === Infinity,
    inverse_cliff_log10_N: +INV_CLIFF_LOG10_N.toFixed(6),
    inverse_max_T_produced: +INV_MAX_T_PRODUCED.toExponential(6),
    T_axis_headroom_decades: +T_AXIS_HEADROOM_DECADES.toFixed(6),
    N_axis_forward_over_inverse: +N_AXIS_FWD_OVER_INV.toFixed(6),
    inverse_binds_first: INVERSE_BINDS_FIRST,
    forward_overflow_on_output: FWD_OVERFLOW_ON_OUTPUT,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision measurement of the forward zeroCountAtHeight ' +
    'representability edge (input T ~ 1.6e306, output count = MAX_VALUE) and its comparison to the ' +
    'imp-35892 inverse cliff. It shows the inverse binds ~0.8 decade earlier, so the forward counter is ' +
    'never the pipeline limit. It instantiates NO interval, ports no operator, and changes no bound.',
  isRigorous: false,
  verdict:
    'THE FORWARD zeroCountAtHeight MAP HAS ITS OWN OVERFLOW EDGE (measurement/diagnostic, NOT an RH ' +
    'bound) at input T ~ ' +
    FWD_CLIFF_T.toExponential(2) +
    ' where its output count reaches Number.MAX_VALUE, but the INVERSE effectiveHeightForN cliff binds ' +
    'first: the inverse produces heights only up to T ~ ' +
    INV_MAX_T_PRODUCED.toExponential(2) +
    ' (~' +
    T_AXIS_HEADROOM_DECADES.toFixed(2) +
    ' decade below the forward edge; ~2 pi below on the count axis), so the forward counter carries ' +
    'unreachable headroom and is never the pipeline limit. imp-34714a REMAINS OPEN; C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; instantiates no interval; changes ' +
    'no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-35892 (inverse effectiveHeightForN overflow cliff at N ~ 10^307.46); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse and zeroCountAtHeight forward counter). IEEE-754 double overflow at ' +
    'Number.MAX_VALUE ~ 1.7977e308: standard float model.',
};

export const IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE_ASSERTIONS = [
  {
    // The forward map overflows on its OUTPUT count at input T ~ 1.6e306 (log10 T in (306, 307)).
    id: 'imp35966-forward-map-has-output-overflow-edge',
    description: 'zeroCountAtHeight overflows at input T ~ 1.6e306 (output count = MAX_VALUE), next step +Infinity',
    holds: () =>
      FWD_OVERFLOW_ON_OUTPUT === true && FWD_CLIFF_LOG10_T > 306 && FWD_CLIFF_LOG10_T < 307,
  },
  {
    // The inverse edge binds first: highest producible height is ~0.8 decade below the forward edge.
    id: 'imp35966-inverse-binds-first',
    description: 'inverse max produced T (~2.6e305) is below the forward input edge (~1.6e306) by ~0.8 decade',
    holds: () =>
      INVERSE_BINDS_FIRST === true &&
      T_AXIS_HEADROOM_DECADES > 0.5 &&
      T_AXIS_HEADROOM_DECADES < 1.0 &&
      INV_CLIFF_LOG10_N > 307 &&
      INV_CLIFF_LOG10_N < 308,
  },
  {
    // The count-axis gap between the two cliffs is a factor ~2 pi (~6.28x).
    id: 'imp35966-count-axis-gap-is-two-pi',
    description: 'forward output cliff (MAX_VALUE) sits ~2 pi above the inverse cliff count (N ~ 10^307.46)',
    holds: () => N_AXIS_FWD_OVER_INV > 6 && N_AXIS_FWD_OVER_INV < 6.6 && PT_ANCHOR_FAR_BELOW_EDGE === true,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35966-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE.subGap) &&
      /NO QED/.test(IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE.verdict) &&
      /refereed bound is changed/i.test(IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE.verdict),
  },
];

for (const a of IMP35966_FORWARD_ZEROCOUNT_REPRESENTABILITY_EDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35966-forward-zerocount-representability-edge assertion failed: ${a.id}`);
  }
}
