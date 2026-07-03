/**
 * @module imp-3697-a-weight-decay-crosscheck-viz-data
 *
 * imp-3697 (ux): lightweight, import-light viz-data module for a chart of the imp-3665
 * A-weight super-exponential decay cross-check: -ln A(tau) vs the leading-order law
 * pi e^{4 tau} at tau in {0.5, 1, 1.5, 2}, the ratio -ln A(tau)/(pi e^{4 tau}) -> 1 from
 * above (1.02657 -> 1.00004), and why the direct-double integrand underflows to 0 past
 * tau ~ 1.4 while the log-domain evaluation reaches A(2) ~ 1e-4067 exactly.
 *
 * Reference literals: tau in {0.5, 1} are the imp-3665 measured.rungs; tau in {1.5, 2}
 * are RE-BAKED (imp-3853) to the imp-3716/imp-3736 CONVERGED values -- no re-derivation here.
 *
 * RE-BAKE NOTE (imp-3853, supersedes the imp-3739 prose-only correction): the tau=1.5 and
 * tau=2.0 rungs previously carried ratio < 1 (0.99977 and 0.99976) read off the coarse
 * imp-3665 N=12000 Simpson grid, corrected only in prose by imp-3739. imp-3716 refined that
 * grid and found the ratio < 1 reading is a DISCRETIZATION ARTIFACT, not a real sign change.
 * The rungs are now re-pointed to the converged grid (imp-3736: -ln A(1.5)=1267.7886,
 * -ln A(2)=9365.3190; imp-3716 N=160000): R(1.5)=1.00030 (c=+0.37957), R(2.0)=1.00004
 * (c=+0.3632), both > 1. The chart now renders the ratio approaching 1 strictly FROM ABOVE
 * across the whole tau range -- there is no crossing below 1. Order and no-hard-endpoint
 * claim unchanged; accuracy re-point only.
 *
 * @see imp-3665-a-weight-superexp-decay-crosscheck.js (source module: rungs, ratios, verdict)
 * @see imp-3716-a-weight-ratio-crossing-nonexistence.js (REFUTES the ratio<1 rungs baked below; converged values)
 *
 * VERIFIED (imp-3721): tau=0.5/1.0 rungs match the live imp-3665 rungs to ~1e-6/1e-7
 * relative (display rounding only); tau=1.5/2.0 rungs match imp-3736's convergedNegLnA
 * exactly (reldiff 0). No drift beyond the RE-BAKE NOTE above.
 *
 * Ticket: imp-3697 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP3697_RUNGS = [
  { tau: 0.5, negLnA: 23.8303, lawNegLn: 23.2134, ratio: 1.02657, slopeRatio: 0.9925, aExponentLog10: -10.35, directDoubleUnderflowed: false },
  { tau: 1.0, negLnA: 171.9548, lawNegLn: 171.5251, ratio: 1.00251, slopeRatio: 0.9997, aExponentLog10: -74.68, directDoubleUnderflowed: false },
  { tau: 1.5, negLnA: 1267.7886, lawNegLn: 1267.4089, ratio: 1.00030, slopeRatio: 0.9993, aExponentLog10: -550, directDoubleUnderflowed: true },
  { tau: 2.0, negLnA: 9365.3190, lawNegLn: 9364.9557, ratio: 1.00004, slopeRatio: 0.9999, aExponentLog10: -4067, directDoubleUnderflowed: true },
];

export const IMP3697_RATIO_FIRST = 1.02657;
export const IMP3697_RATIO_LAST = 1.00004;

export const IMP3697_UNDERFLOW_THRESHOLD_TAU = 1.4;
