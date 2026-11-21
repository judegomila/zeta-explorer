/**
 * @module imp-34354-crossover-surplus-small-thr-factorisation-viz-data
 * @fileoverview imp-34354 -- VIZ DATA ONLY for the imp-34248 small-thr factorisation of the
 *   imp-34174 crossover surplus(thr) = P(thr) . r(thr).
 *
 *   P(thr) = thr(1-thr)/(1+(1-thr)r) is asymptotically LINEAR (surplus/(thr.r) -> 1), while
 *   r(thr) = E_flow(N_cross)/E_trunc vanishes as a log-softened ~thr^1.92 (below the naive
 *   thr^2, because N_cross ~ thr^-2 log T0 lifts log T0 as thr shrinks). The composite
 *   surplus ~ thr^1 . thr^~1.92 = thr^~2.9 is SUPER-LINEAR: strictly faster than thr, strictly
 *   slower than the naive thr^3.
 *
 *   Values below are baked reference literals, reproduced exactly by re-evaluating the
 *   imp-34248 module's factorisedLadder/localExponents/olsFits fields (direct import + JSON
 *   dump, not re-derived here). This module does NOT import lambda-rh-height-mapping.js or
 *   polymath15-constant-C-C.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34248-crossover-surplus-small-thr-asymptotic.js (source measurement: factorisation + fits)
 *   @see imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr) and the tabulated ladder)
 *   @see imp-34260-crossover-surplus-family-viz-data.js (sibling viz data for the raw surplus(thr) ladder)
 *   @see imp-34353 (sibling viz page consuming imp-34260's raw surplus(thr) ladder)
 *
 *   Ticket: imp-34354 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- factorised ladder: surplus(thr) = P(thr) . r(thr), P -> thr as thr -> 0 (baked from imp-34248) --
export const IMP34354_FACTORISED_LADDER = Object.freeze([
  Object.freeze({ thr: 0.5, N_cross: 3.2803e9, r: 1.8992e-3, prefactor_P: 0.24976, surplus: 4.7436e-4, surplus_over_thr_r: 0.49953 }),
  Object.freeze({ thr: 0.3, N_cross: 1.93e10, r: 4.1348e-4, prefactor_P: 0.20994, surplus: 8.6806e-5, surplus_over_thr_r: 0.6998 }),
  Object.freeze({ thr: 0.1, N_cross: 3.2134e11, r: 3.5486e-5, prefactor_P: 0.089997, surplus: 3.1936e-6, surplus_over_thr_r: 0.89997 }),
  Object.freeze({ thr: 0.05, N_cross: 1.5166e12, r: 9.009e-6, prefactor_P: 0.0475, surplus: 4.2793e-7, surplus_over_thr_r: 0.94999 }),
  Object.freeze({ thr: 0.01, N_cross: 4.6244e13, r: 4.2552e-7, prefactor_P: 0.0099, surplus: 4.2126e-9, surplus_over_thr_r: 0.99 }),
]);

// -- local log-log exponents between adjacent rungs (composite = 1 (prefactor) + r-exponent) --
export const IMP34354_LOCAL_EXPONENTS = Object.freeze([
  Object.freeze({ window: '0.5->0.3', composite: 3.3246, r_exponent: 2.9846, prefactor_share: 0.34 }),
  Object.freeze({ window: '0.3->0.1', composite: 3.0061, r_exponent: 2.2351, prefactor_share: 0.771 }),
  Object.freeze({ window: '0.1->0.05', composite: 2.8998, r_exponent: 1.9778, prefactor_share: 0.922 }),
  Object.freeze({ window: '0.05->0.01', composite: 2.8711, r_exponent: 1.8967, prefactor_share: 0.9744 }),
]);

// -- OLS log-log fits (baked from imp-34248 olsFits) --
export const IMP34354_OLS_FITS = Object.freeze({
  all_rungs_composite_slope: 2.9612,
  all_rungs_r_slope: 2.1203,
  deep_tail_composite_slope: 2.8782,
  deep_tail_r_slope: 1.9168,
});

export default Object.freeze({
  id: 'imp-34354-crossover-surplus-small-thr-factorisation-viz-data',
  ticket: 'imp-34354',
  source: 'imp-34248-crossover-surplus-small-thr-asymptotic.js',
  factorisedLadder: IMP34354_FACTORISED_LADDER,
  localExponents: IMP34354_LOCAL_EXPONENTS,
  olsFits: IMP34354_OLS_FITS,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34354_ASSERTIONS = [
  {
    id: 'imp34354-ladder-has-five-thresholds-in-descending-order',
    holds: () => {
      const thrs = IMP34354_FACTORISED_LADDER.map((r) => r.thr);
      return (
        thrs.length === 5 &&
        thrs.every((t, i) => i === 0 || t < thrs[i - 1]) &&
        thrs[0] === 0.5 &&
        thrs[thrs.length - 1] === 0.01
      );
    },
    why: 'The threshold family must be exactly {0.5,0.3,0.1,0.05,0.01} in strictly descending order (imp-34174/imp-34248).',
  },
  {
    id: 'imp34354-prefactor-ratio-climbs-monotonically-toward-1',
    holds: () => {
      const rs = IMP34354_FACTORISED_LADDER.map((row) => row.surplus_over_thr_r);
      return rs.every((v, i) => i === 0 || v > rs[i - 1]) && rs[0] < 0.6 && rs[rs.length - 1] > 0.98;
    },
    why: 'F1: surplus/(thr.r) must climb monotonically from ~0.5 toward 1, showing the prefactor P(thr) contributes exactly one power of thr.',
  },
  {
    id: 'imp34354-composite-exponent-strictly-between-r-exponent-and-r-exponent-plus-1p5',
    holds: () =>
      IMP34354_LOCAL_EXPONENTS.every((row) => row.composite > row.r_exponent && row.composite - row.r_exponent < 1.5),
    why: 'Each window composite exponent must exceed the r-exponent alone (the prefactor contributes a positive share) but the excess (prefactor_share) must stay bounded, converging toward 1.',
  },
  {
    id: 'imp34354-prefactor-share-climbs-toward-1',
    holds: () => {
      const shares = IMP34354_LOCAL_EXPONENTS.map((row) => row.prefactor_share);
      return shares.every((v, i) => i === 0 || v > shares[i - 1]) && shares[shares.length - 1] > 0.95;
    },
    why: 'F3/separation identity: composite - r_exponent (the prefactor share) must climb monotonically toward 1 at the deepest rung.',
  },
  {
    id: 'imp34354-deep-tail-ols-slopes-match-imp34248',
    holds: () =>
      Math.abs(IMP34354_OLS_FITS.deep_tail_composite_slope - 2.878) < 0.005 &&
      Math.abs(IMP34354_OLS_FITS.deep_tail_r_slope - 1.917) < 0.005 &&
      IMP34354_OLS_FITS.deep_tail_composite_slope > 2.5 &&
      IMP34354_OLS_FITS.deep_tail_composite_slope < 3 &&
      IMP34354_OLS_FITS.deep_tail_r_slope < 2,
    why: 'The baked deep-tail OLS slopes must reproduce imp-34248 exactly: composite ~2.878 (super-linear, below cubic), r-exponent ~1.917 (below 2, log-softened).',
  },
];

for (const assertion of IMP34354_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34354-crossover-surplus-small-thr-factorisation-viz-data assertion failed: ${assertion.id}`);
  }
}
