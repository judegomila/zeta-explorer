/**
 * @module imp-3697-a-weight-decay-crosscheck-viz-data
 *
 * imp-3697 (ux): lightweight, import-light viz-data module for a chart of the imp-3665
 * A-weight super-exponential decay cross-check: -ln A(tau) vs the leading-order law
 * pi e^{4 tau} at tau in {0.5, 1, 1.5, 2}, the ratio -ln A(tau)/(pi e^{4 tau}) -> 1 from
 * above (1.02657 -> 0.99976), and why the direct-double integrand underflows to 0 past
 * tau ~ 1.4 while the log-domain evaluation reaches A(2) ~ 1e-4067 exactly.
 *
 * Reference literals are baked from the imp-3665 measured.rungs table (self-computing
 * at import) -- no re-derivation here.
 *
 * @see imp-3665-a-weight-superexp-decay-crosscheck.js (source module: rungs, ratios, verdict)
 */

export const IMP3697_RUNGS = [
  { tau: 0.5, negLnA: 23.8303, lawNegLn: 23.2134, ratio: 1.02657, slopeRatio: 0.9925, aExponentLog10: -10.35, directDoubleUnderflowed: false },
  { tau: 1.0, negLnA: 171.9548, lawNegLn: 171.5251, ratio: 1.00251, slopeRatio: 0.9997, aExponentLog10: -74.68, directDoubleUnderflowed: false },
  { tau: 1.5, negLnA: 1267.12, lawNegLn: 1267.4089, ratio: 0.99977, slopeRatio: 0.9993, aExponentLog10: -550, directDoubleUnderflowed: true },
  { tau: 2.0, negLnA: 9362.72, lawNegLn: 9364.9557, ratio: 0.99976, slopeRatio: 0.9999, aExponentLog10: -4067, directDoubleUnderflowed: true },
];

export const IMP3697_RATIO_FIRST = 1.02657;
export const IMP3697_RATIO_LAST = 0.99976;

export const IMP3697_UNDERFLOW_THRESHOLD_TAU = 1.4;
