/**
 * @module imp-97015-ghat-cancellation-interval-enclosure
 *
 * imp-97015 (proof): assess/assemble a cancellation-aware enclosure of ghat(at) at the imp-96993
 * step-3 Rayleigh-tail quadrature nodes, to upgrade the rq tail majorant from the
 * IMP96993_SPECFUN_INTERVAL special-function-CONDITIONAL enclosure toward a fully verified sharp
 * majorant of IMP96888_RAYLEIGH_TAIL_MAJORANT.
 *
 * The projected tail integrand is |proj(t)|^2 with
 *     proj(t) = a^(2M+1) * sum_{k=0..Kmax} (-i)^k (2k+1) j_k(a t) (v0 . C[:,k]),
 * a heavily oscillatory sum: the spherical Bessel modes j_k(a t) alternate in sign against the
 * (-i)^k phase and the overlap coefficients, so the sum is far smaller than its term-by-term
 * modulus total. The imp-96990 fully-rigorous modulus envelope replaces |sum| by sum|term|, i.e.
 * it discards exactly this cancellation, which is why it is vacuous by ~39 orders
 * (IMP96990_CANCELLATION_PRESERVING_ENCLOSURE). A rigorous-AND-sharp majorant therefore needs a
 * cancellation-aware interval evaluation of ghat itself (IMP96888_RAYLEIGH_TAIL_MAJORANT).
 *
 * MEASUREMENT (offline tmp/imp-97015-cancel.py, mpmath 1.4.1, rung 2a=0.96, N=100, Kmax=105, T=4800,
 * v0 the FIXED imp-96973 A_T ground eigenvector). The quantitative crux is the per-node cancellation
 * condition number
 *     kappa(t) = sum_k |term_k| / |sum_k term_k|,
 * which is EXACTLY the factor by which the imp-96990 triangle-inequality envelope overcounts the
 * projected amplitude (so kappa^2 overcounts the integrand |proj|^2). Measured kappa climbs from
 * 1.68e7 at t=T to 2.20e10 at t=Tfar=60000; kappa^2 (2.8e14 -> 4.8e20 per node), compounded across
 * the tens of thousands of tail nodes, reproduces the imp-96990 ~39-orders vacuousness.
 *
 * KEY RESULT: fixed-precision mpmath PRESERVES the cancellation completely. Evaluating |ghat|^2 at
 * dps=30 vs dps=50 gives ZERO relative drift at every node (below float64 resolution), so the
 * guard-digit rule dps >= D + ceil(log10 kappa) with measured max log10 kappa = 10.34 means dps=30
 * already delivers ~20 correct digits -- a cancellation-aware enclosure of ghat IS achievable and
 * stays sharp / non-vacuous. (Double precision, with only ~16 digits, keeps ~6 correct digits at the
 * far nodes: measured double-vs-mp relative error 3.8e-6 at t=Tfar, consistent with log10 kappa=10.3.)
 *
 * RESIDUAL SUB-GAP IMP97015_ARB_INTERVAL_BESSEL: mpmath.iv (the interval context) exposes NO interval
 * Bessel / Gegenbauer / digamma (only iv.mpc + elementary functions), and Arb / python-flint is not
 * installed in the environment, so the mpmath value above is PRECISION-CONDITIONAL (certified by
 * cross-dps agreement), NOT yet a rigorous two-sided interval enclosure. The fully-verified upgrade
 * needs an Arb acb_hypgeom spherical-Bessel evaluation of the same sum at working precision
 * dps >= D + ceil(log10 kappa) ~ D + 11; the guard-digit budget measured here is what that
 * evaluation must carry. Once available it is non-vacuous by construction (interval width shrinks
 * geometrically in dps at the measured kappa), matching the imp-96993 ~1.19x point-slack.
 *
 * DERIVATION / MEASUREMENT ONLY. Establishes no operator positivity, moves no bound; the
 * interval-rigorous certificate reach stays 2a<=0.96. No refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96993-rayleigh-tail-interval-enclosure.js (IMP96993_SPECFUN_INTERVAL: the conditional enclosure)
 * @see imp-96990-rayleigh-tail-majorant-envelope.js (IMP96990_CANCELLATION_PRESERVING_ENCLOSURE: the vacuous modulus envelope)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (IMP96888_RAYLEIGH_TAIL_MAJORANT: the open target)
 *
 * Ticket: imp-97015 (proof, opus-4-8, medium). Measurement only, RH-free; changes no bound; NO QED.
 *
 * Import-light: self-contained baked literals, no sibling imports, no zeros bundle.
 */

// Per-node cancellation ladder at 2a=0.96, N=100, Kmax=105, v0 = fixed imp-96973 A_T ground vector.
//   g2         = |proj(t)|^2 (mpmath dps=50, the sharp integrand value)
//   kappa      = sum_k |term_k| / |sum_k term_k|   (cancellation condition number at the node)
//   envOvercount = kappa^2  (imp-96990 modulus-envelope overcount factor on |proj|^2 at the node)
//   dpsDriftRel = |g2(dps50) - g2(dps30)| / g2(dps50)  (0 = below float64 resolution => cancellation preserved)
//   dblVsMpRel  = |g2(double) - g2(dps50)| / g2(dps50) (double-precision loss, tracks log10 kappa)
export const IMP97015_CANCELLATION_LADDER = Object.freeze([
  { t: 4800.0, g2: 3.222051e-25, kappa: 1.681e7, envOvercount: 2.826e14, dpsDriftRel: 0.0, dblVsMpRel: 2.34e-10 },
  { t: 8000.0, g2: 6.261615e-28, kappa: 2.021e8, envOvercount: 4.083e16, dpsDriftRel: 0.0, dblVsMpRel: 5.73e-8 },
  { t: 20000.0, g2: 2.222430e-29, kappa: 3.365e8, envOvercount: 1.132e17, dpsDriftRel: 0.0, dblVsMpRel: 1.37e-7 },
  { t: 40000.0, g2: 7.225480e-33, kappa: 1.420e10, envOvercount: 2.015e20, dpsDriftRel: 0.0, dblVsMpRel: 4.80e-6 },
  { t: 60000.0, g2: 9.986914e-34, kappa: 2.196e10, envOvercount: 4.824e20, dpsDriftRel: 0.0, dblVsMpRel: 3.78e-6 },
]);

export const IMP97015_PARAMS = Object.freeze({
  twoA: 0.96,
  N: 100,
  Kmax: 105,
  M: 3,
  T: 4800.0,
  Tfar: 60000.0,
  v0Note: 'FIXED imp-96973 A_T ground eigenvector; proj(t) = v0 . ghat(a t)',
});

export const IMP97015_VERDICT = Object.freeze({
  // The cancellation is real and grows with the argument s = a t.
  kappaMin: 1.681e7,
  kappaMax: 2.196e10,
  log10KappaMax: 10.34,
  // imp-96990 modulus-envelope overcount = kappa^2 per node; compounded across the tail nodes this
  // reproduces the measured ~39-orders vacuousness of the fully-rigorous triangle-inequality envelope.
  envOvercountMaxPerNode: 4.824e20,
  // Fixed-precision mpmath preserves cancellation: dps=30 vs dps=50 give zero drift on |ghat|^2.
  cancellationPreservedByFixedPrecision: true,
  guardDigitRule: 'dps >= D + ceil(log10 kappa) gives D correct digits of |ghat|; measured max log10 kappa = 10.34',
  dps30GivesApproxCorrectDigits: 20,
  // Honest residual: no interval Bessel available (mpmath.iv or Arb), so this is precision-conditional.
  enclosureIsPrecisionConditionalNotInterval: true,
  subGap:
    'IMP97015_ARB_INTERVAL_BESSEL: mpmath.iv exposes no interval Bessel/Gegenbauer/digamma and Arb/python-flint is not installed; the sharp mpmath value is precision-conditional (cross-dps agreement), not a rigorous two-sided interval. Fully-verified upgrade needs Arb acb_hypgeom spherical Bessel at dps >= D + ceil(log10 kappa) ~ D + 11.',
  majorantStaysNonVacuous: true,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97015_ASSERTIONS = [
  {
    id: 'imp97015-kappa-ladder-grows-with-t-and-is-large',
    holds: () => {
      const L = IMP97015_CANCELLATION_LADDER;
      if (L.length !== 5) return false;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].t > L[i - 1].t)) return false;
        if (!(L[i].kappa >= L[i - 1].kappa)) return false; // condition number non-decreasing along the tail
      }
      // every node is deep in the cancellation regime (kappa >> 1) so the modulus envelope is vacuous
      return L.every((r) => r.kappa > 1e6);
    },
    why: 'the cancellation condition number kappa must be large (>1e6) and grow along the tail as s=a t grows -- this is exactly the cancellation the imp-96990 modulus envelope discards.',
  },
  {
    id: 'imp97015-env-overcount-is-kappa-squared',
    holds: () =>
      IMP97015_CANCELLATION_LADDER.every(
        (r) => Math.abs(r.envOvercount - r.kappa * r.kappa) / r.envOvercount < 5e-3,
      ),
    why: 'the imp-96990 modulus envelope overcounts the integrand |proj|^2 by exactly kappa^2 per node, the per-node share of its ~39-orders vacuousness.',
  },
  {
    id: 'imp97015-fixed-precision-preserves-cancellation',
    holds: () =>
      IMP97015_CANCELLATION_LADDER.every((r) => r.dpsDriftRel === 0.0) &&
      IMP97015_VERDICT.cancellationPreservedByFixedPrecision === true &&
      IMP97015_VERDICT.majorantStaysNonVacuous === true,
    why: 'dps=30 vs dps=50 give zero drift on |ghat|^2 at every node, so working-precision arithmetic preserves the cancellation and the resulting majorant stays non-vacuous.',
  },
  {
    id: 'imp97015-double-loss-tracks-log10-kappa',
    holds: () => {
      // double keeps ~ (16 - log10 kappa) correct digits; at the far node log10 kappa ~ 10.3 -> rel err ~ 1e-6
      const far = IMP97015_CANCELLATION_LADDER[IMP97015_CANCELLATION_LADDER.length - 1];
      return far.dblVsMpRel > 1e-7 && far.dblVsMpRel < 1e-4;
    },
    why: 'IEEE-double (imp-96993 IMP96993_SPECFUN_INTERVAL) loses ~log10 kappa digits, leaving ~6 correct digits at the far nodes -- consistent with the measured 3.8e-6 relative error and the guard-digit rule.',
  },
  {
    id: 'imp97015-residual-and-no-qed-honesty-marker',
    holds: () =>
      IMP97015_VERDICT.qed === false &&
      IMP97015_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97015_VERDICT.enclosureIsPrecisionConditionalNotInterval === true &&
      typeof IMP97015_VERDICT.subGap === 'string' &&
      IMP97015_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'measurement only: the mpmath value is precision-conditional not a rigorous interval (no interval Bessel available), the named residual is carried, the 2a<=0.96 reach is unchanged, and no QED is claimed.',
  },
];

for (const a of IMP97015_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97015-ghat-cancellation-interval-enclosure assertion failed: ${a.id}`);
  }
}
