/**
 * @module imp-36251-krawczyk-residual-operator-fixedpoint-viz-data
 *
 * imp-36251 (ux, medium): lightweight, import-light viz-data module for a chart
 * of the imp-36154 residual operator F(m) = m - K log T0(m) near its fixed point
 * N_cross ~ 3.28e9, alongside the exact derivative F-prime(m) that witnesses the
 * (H1) nonvanishing margin (~0.9546 at the centre, comfortably away from 0).
 *
 * Reference literals are baked from a 21-point grid spanning +/-40% around
 * N_cross (evaluated offline via effectiveHeightForN, the same RvM height
 * inverse imp-36154 uses) -- no re-derivation here. Presentation only: carries
 * no RH verdict, closes no sub-gap, imp-34714a stays OPEN, imp-34687a stays
 * UNIMPLEMENTED, the imp-36154 requirements R1-R6 are untouched.
 *
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements.js (source module: F(m), F-prime(m), N_cross, K)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 *
 * Ticket: imp-36251 (ux, medium). Presentation only, RH-free; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

export const IMP36251_N_CROSS = 3.28029435165241e9;
export const IMP36251_K_AMPL = 1.5727e8; // (C_C_pinned / E_trunc)^2, imp-36154
export const IMP36251_FP_AT_CENTER = 0.954576623040045; // F-prime(N_cross), (H1) margin

// 21-point grid, m spanning N_cross * (1 +/- 0.4). Each row: [m, F(m), F_prime(m)].
export const IMP36251_RESIDUAL_OPERATOR_GRID = [
  [1968176610.99, -1236058320.036936, 0.9244039857],
  [2099388385.06, -1114449894.132936, 0.9291154668],
  [2230600159.12, -992260711.717299, 0.9332734858],
  [2361811933.19, -869557103.244023, 0.9369701924],
  [2493023707.26, -746394642.391112, 0.9402783512],
  [2624235481.32, -622820353.591726, 0.9432561853],
  [2755447255.39, -498874380.73875, 0.945950836],
  [2886659029.45, -374591267.579102, 0.9484008801],
  [3017870803.52, -250000953.433171, 0.9506381906],
  [3149082577.59, -125129556.97382, 0.9526893323],
  [3280294351.65, 0, 0.954576623],
  [3411506125.72, 125367491.127517, 0.9563189496],
  [3542717899.78, 250954978.677234, 0.957932403],
  [3673929673.85, 376746480.711732, 0.9594307773],
  [3805141447.92, 502727696.648144, 0.9608259652],
  [3936353221.98, 628885779.334459, 0.9621282751],
  [4067564996.05, 755209144.489324, 0.9633466863],
  [4198776770.12, 881687310.38749, 0.9644890564],
  [4329988544.18, 1008310762.206564, 0.9655622914],
  [4461200318.25, 1135070836.617867, 0.9665724855],
  [4592412092.31, 1261959623.10058, 0.9675250367],
];

export const IMP36251_FINDING = {
  fCrossesZeroAtCenter:
    'F(m) is monotone increasing across the grid and crosses zero exactly at m = N_cross, ' +
    'reproducing the imp-36154 fixed-point identity K log T0(N_cross) = N_cross',
  fPrimeStaysFarFromZero:
    'F-prime(m) stays in [0.924, 0.968] across the full +/-40% grid, never approaching 0 -- the ' +
    '(H1) nonvanishing hypothesis holds with a large margin over the whole illustrated window, not ' +
    'just at the centre',
  illustrativeOnly:
    'this grid is a double-precision illustration of the exact analytic structure imp-36154 already ' +
    'derived; it certifies no interval, constructs no [F-prime] enclosure, and does not discharge the ' +
    'imp-36154 R1-R6 requirements',
};

// imp-36269: regression guard against source drift. Independently re-derives K, F(m), F-prime(m)
// from effectiveHeightForN and the imp-36154 definitions (F(m) = m - K log T0(m), F-prime(m) =
// 1 - K * 2pi / (T0 log(T0/2pi))) and checks the baked grid rows + IMP36251_FP_AT_CENTER against
// the live recomputation. Tolerance is relative (~1e-6) rather than an absolute epsilon: the F(m)
// column baked here is full-precision but effectiveHeightForN's Newton solve introduces ~1e-3
// absolute noise at this scale, while a genuine drift in K or E_trunc would move F(m) by orders of
// magnitude more than that noise floor.
const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI);
const E_TRUNC_PT = 3.06e-5;
const K_AMPL_LIVE = (C_C_PINNED / E_TRUNC_PT) ** 2;

function liveResidualF(m) {
  return m - K_AMPL_LIVE * Math.log(effectiveHeightForN(m));
}
function liveResidualFPrime(m) {
  const t0 = effectiveHeightForN(m);
  return 1 - K_AMPL_LIVE * (TWO_PI / (t0 * Math.log(t0 / TWO_PI)));
}

const REL_TOL = 1e-6;

export const IMP36251_RESIDUAL_OPERATOR_GRID_ASSERTIONS = [
  {
    id: 'imp36251-grid-matches-live-F-and-Fprime',
    description:
      'each baked [m, F(m), F-prime(m)] grid row re-derives from effectiveHeightForN and the ' +
      'imp-36154 F(m)=m-K log T0(m) / F-prime(m)=1-K*2pi/(T0 log(T0/2pi)) definitions within ~1e-6 ' +
      'relative tolerance',
    holds: () =>
      IMP36251_RESIDUAL_OPERATOR_GRID.every(([m, fBaked, fpBaked]) => {
        const fLive = liveResidualF(m);
        const fpLive = liveResidualFPrime(m);
        const fScale = Math.max(Math.abs(m), Math.abs(fBaked), 1);
        const fpScale = Math.max(Math.abs(fpBaked), 1);
        return (
          Math.abs(fLive - fBaked) < REL_TOL * fScale &&
          Math.abs(fpLive - fpBaked) < REL_TOL * fpScale
        );
      }),
  },
  {
    id: 'imp36251-fp-at-center-matches-live',
    description:
      'IMP36251_FP_AT_CENTER matches live F-prime(IMP36251_N_CROSS) within ~1e-6 relative tolerance',
    holds: () =>
      Math.abs(liveResidualFPrime(IMP36251_N_CROSS) - IMP36251_FP_AT_CENTER) <
      REL_TOL * Math.max(Math.abs(IMP36251_FP_AT_CENTER), 1),
  },
];
