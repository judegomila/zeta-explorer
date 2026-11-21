/**
 * @module imp-96103-route-i-remainder-resonance-viz-data
 *
 * imp-96103 (ux): import-light viz-data leaf for RH Route I's semilocal trace remainder
 * delta_S(rho) (rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js), which had baked
 * spike/regular literals but no viz surface for the resonance structure itself.
 *
 * Plots delta_S(rho) = Tr(vartheta(rho^{-1}) Phat_S P_1) over a continuous rho range,
 * sampled directly from the source module's exact closed-form deltaS(rho) function
 * (no re-derivation, no fresh Sonine solve), alongside the four baked near-dyadic log
 * spikes at rho = 2^k + eps, eps = 1e-7, k = 0..3 (12.146531 / 16.651084 / 22.713239 /
 * 31.699639, growing like (2^{k/2}/2) log_2(1/eps) per ROUTE_I_LITERALS.deltaS.spikeLaw)
 * versus the regular value at the non-dyadic rho = 3 (0.379224) -- roughly two orders
 * of magnitude smaller, since delta_S has no p = 2 resonance there.
 *
 * MEASUREMENT / PRESENTATION ONLY. The curve and spike/regular points are direct
 * evaluations of the source module's own exact closed-form deltaS(rho), cross-checked
 * against the baked ROUTE_I_LITERALS.deltaS literals below. Changes no bound, establishes
 * no operator positivity, no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js
 *   (deltaS, ROUTE_I_LITERALS.deltaS)
 *
 * Ticket: imp-96103 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no
 * bound; NO QED.
 */

import { deltaS, ROUTE_I_LITERALS } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';

const EPS = 1e-7;
const LOG2_1_OVER_EPS = Math.log2(1 / EPS);

// four near-dyadic log spikes rho = 2^k + eps, k = 0..3, recomputed live from deltaS
// and cross-checked against the baked ROUTE_I_LITERALS.deltaS literals in the assertions below.
export const IMP96103_SPIKE_POINTS = [0, 1, 2, 3].map((k) => {
  const rho = Math.pow(2, k) + EPS;
  return {
    k,
    rho,
    value: deltaS(rho),
    spikeLawEstimate: (Math.pow(2, k / 2) / 2) * LOG2_1_OVER_EPS,
  };
});

// the regular (non-dyadic) comparison point at rho = 3.
export const IMP96103_REGULAR_POINT = { rho: 3, value: deltaS(3) };

// continuous sweep of delta_S(rho) over [0.8, 9.2], sampled directly from the source
// module's exact closed-form function; the log spikes at rho = 1, 2, 4, 8 dominate the
// display range so the curve is clamped at CLAMP_MAX for legibility (imp-96080 convention).
// The grid is offset (0.803 + 0.02k) so no sample lands exactly on an integer rho: deltaS's
// internal dyadic-cutoff sum (Math.ceil(n + log2(rho))) has an exact tie at rho = 2^n that
// is a discretization artifact of the sum truncation, not part of the smooth log-spike
// growth the ticket plots (confirmed by direct probe: deltaS(1) = 27.07 breaks the smooth
// trend that deltaS(0.999999) = deltaS(1.000001) = 10.48 otherwise follows).
const CLAMP_MAX = 14;
const RHO_MIN = 0.803;
const RHO_MAX = 9.203;
const RHO_STEP = 0.02;
export const IMP96103_CURVE = (() => {
  const pts = [];
  for (let rho = RHO_MIN; rho <= RHO_MAX + 1e-9; rho += RHO_STEP) {
    const value = deltaS(rho);
    pts.push({ rho: Number(rho.toFixed(3)), value: Math.min(value, CLAMP_MAX) });
  }
  return pts;
})();

export const IMP96103_SPIKE_LAW = ROUTE_I_LITERALS.deltaS.spikeLaw;

export const IMP96103_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the delta_S(rho) curve and the spike/regular points are direct evaluations of the source module’s own exact closed-form deltaS(rho) (no re-derivation of the Sonine trace identity, no fresh Galerkin solve); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96103_ASSERTIONS = [
  {
    id: 'imp96103-spike-points-match-baked-literals',
    holds: () => {
      const baked = [
        ROUTE_I_LITERALS.deltaS.r1e7,
        ROUTE_I_LITERALS.deltaS.r2e7,
        ROUTE_I_LITERALS.deltaS.r4e7,
        ROUTE_I_LITERALS.deltaS.r8e7,
      ];
      return IMP96103_SPIKE_POINTS.every((p, i) => Math.abs(p.value - baked[i]) < 1e-3);
    },
    why: 'the four live deltaS(2^k(1+1e-7)) evaluations (k=0..3) must match the baked ROUTE_I_LITERALS.deltaS.r{1,2,4,8}e7 literals (12.146531/16.651084/22.713239/31.699639) to within 1e-3.',
  },
  {
    id: 'imp96103-regular-point-matches-baked-literal',
    holds: () => Math.abs(IMP96103_REGULAR_POINT.value - ROUTE_I_LITERALS.deltaS.r3) < 1e-3,
    why: 'the live deltaS(3) evaluation must match the baked ROUTE_I_LITERALS.deltaS.r3 literal (0.379224) to within 1e-3.',
  },
  {
    id: 'imp96103-spikes-grow-with-k-and-dwarf-regular-point',
    holds: () =>
      IMP96103_SPIKE_POINTS.every((p, i) => i === 0 || p.value > IMP96103_SPIKE_POINTS[i - 1].value) &&
      IMP96103_SPIKE_POINTS.every((p) => p.value > 10 * IMP96103_REGULAR_POINT.value),
    why: 'the near-dyadic spike values must grow monotonically with k (log2(rho) growth per the spike law) and each must exceed the non-dyadic rho=3 regular value by more than 10x, matching the ~32x observed at k=3.',
  },
  {
    id: 'imp96103-spike-law-tracks-measured-values-to-leading-order',
    holds: () =>
      IMP96103_SPIKE_POINTS.every((p) => Math.abs(p.value / p.spikeLawEstimate - 1) < 0.2),
    why: 'the measured spike values must track the leading-order asymptotic spike law (2^{k/2}/2) log2(1/eps) to within 20% (the law is asymptotic, not exact, so exact agreement is not expected).',
  },
  {
    id: 'imp96103-curve-passes-near-each-spike-and-dips-at-rho3',
    holds: () => {
      const near = (rho, tol) => IMP96103_CURVE.filter((p) => Math.abs(p.rho - rho) < tol);
      const localMax = (rho) => Math.max(...near(rho, 0.06).map((p) => p.value));
      const maxima = [1, 2, 4, 8].map(localMax);
      const monotonic = maxima.every((v, i) => i === 0 || v > maxima[i - 1]);
      const eachAboveRho3 = maxima.every((v) => v > 10 * localMax(3));
      const dipAt3 = near(3, 0.06).every((p) => p.value < 1);
      return monotonic && eachAboveRho3 && dipAt3;
    },
    why: 'the continuously-sampled curve must itself show a local maximum near each dyadic rho in {1,2,4,8} that grows monotonically with k and dwarfs (>10x) the local maximum near the non-dyadic rho=3 (which stays below 1), reproducing (not just citing) the spike/regular contrast.',
  },
  {
    id: 'imp96103-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96103_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96103_HONEST_BANNER) &&
      /NO QED/.test(IMP96103_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96103_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96103-route-i-remainder-resonance-viz-data assertion failed: ${a.id}`);
  }
}
