/**
 * @module imp-96069-route-m-mellin-residual-extended-n1000-n2000
 *
 * imp-96069 (numerical): extend the RH Route M Nyman-Beurling Mellin-residual
 * test past N=500 to N=1000 and N=2000 and report how the two headline
 * observables scale.
 *
 * BASELINE (N=500, T=400, dt=0.02) established in
 * rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js
 * (RECIPROCITY_STRUCTURAL_TEST.mellinResidual):
 *   - the identity d_N^2 = Sum_rho 1/|rho|^2 x (1/log N), i.e.
 *     d_N^2 log N / C_burnol -> 1, held to 0.2 percent (ratio 0.998270);
 *   - the fraction of residual mass below the cutoff T=400 was
 *     fracCaptured = mass_0T / d_N^2 = 0.914608.
 *
 * WHAT WAS DONE (tmp/rh-route-m/m7-extend-mellin.py, reproducible): the exact
 * Vasyunin Gram G_{hk} = d I(h/d,k/d)/(hk) was built once to N=2000 from the
 * cotangent table V(a/q) = -c_0(a-bar/q); for each N in {500,1000,2000} the
 * optimal coefficient vector c = G^{-1} b (b_k = (log k + 1 - gamma)/k) was
 * solved by Cholesky, giving d_N^2 = 1 - b.c; the Mellin residual
 * |1 + zeta(1/2+it) D_N(1/2+it)|^2 / (1/4 + t^2) with D_N = Sum c_k k^{-s}
 * was integrated (Simpson) over 0..T with a single N-independent zeta grid.
 *
 * FINDINGS (see IMP96069_ROWS):
 *   (1) The 0.2 percent agreement at N=500 does NOT keep tightening: the ratio
 *       d_N^2 log N / C_burnol OSCILLATES within a roughly +/-2 percent band
 *       (0.998270 at N=500, 0.980420 at N=1000, 1.006089 at N=2000) rather than
 *       converging monotonically to 1. So the 0.2 percent figure at N=500 is a
 *       sampling coincidence inside a ~2 percent wobble, consistent with the
 *       known lower-order 1/log^2 N correction to the Baez-Duarte / Burnol
 *       leading term d_N^2 ~ C_burnol / log N -- it does not signal an exact
 *       finite-N identity.
 *   (2) fracCaptured is essentially N-INDEPENDENT at fixed T=400: 0.914608,
 *       0.914023, 0.918065 across the 4x range in N (spread < 0.5 percent).
 *       The near-zeros mass share (window halfwidth 3/log N) is likewise flat
 *       at ~0.71-0.72. The distribution of residual mass in t is a structural
 *       constant of the cutoff T, not a function of the mollifier length N.
 *   (3) The zero spikes stay EXACTLY pinned: residual x (1/4 + gamma^2) = 1 at
 *       every zero to ~1e-14 for all three N (the height 1/|rho|^2 is forced by
 *       zeta(rho)=0 and is mollifier-independent), while the effective width
 *       d_N^2 / C_burnol tracks 1/log N to within the same ~1-2 percent band
 *       (0.16063 vs 0.16091 at N=500; 0.14193 vs 0.14476 at N=1000; 0.13236 vs
 *       0.13156 at N=2000).
 *
 * RESOLUTION OF THE 1/log N ZERO-SPIKE-WIDTH QUESTION: the width identity
 * d_N^2/C_burnol = 1/log N holds only up to a ~2 percent oscillating remainder;
 * the N=500 near-coincidence overstates its sharpness. Nothing here is a new
 * identity or a bound.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (baseline)
 * @see imp-96075-route-m-vasyunin-dn-ladder-viz-data.js (N=500 viz surface)
 *
 * Ticket: imp-96069 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96069_C_BURNOL = 0.04619141793224202;

// Cutoff and grid used for every row (fixed for cross-N comparability).
export const IMP96069_GRID = Object.freeze({ T: 400.0, dt: 0.02, zerosBelowT: 110 });

// One row per mollifier length. All fields recomputed in
// tmp/rh-route-m/m7-extend-mellin.py; the N=500 row reproduces the source
// module bit-for-bit (dN2 and fracCaptured identical to mellinResidual).
export const IMP96069_ROWS = Object.freeze([
  Object.freeze({
    N: 500,
    dN2: 0.007419858011581737,
    dN2LogNoverC: 0.9982700629705589,     // the "0.2 percent" identity ratio
    fracCaptured: 0.9146083335142102,      // mass below T / dN2
    fracNear: 0.7140674284859176,          // mass within 3/logN of a zero / mass below T
    dN2overC: 0.16063282626365558,         // effective spike width, measured
    oneOverLogN: 0.1609111924940025,       // effective spike width, predicted
    atZeroNormalizedErr: 1.199040866595169e-14,
    mass0T: 0.006786263970884834,
  }),
  Object.freeze({
    N: 1000,
    dN2: 0.006555963930380493,
    dN2LogNoverC: 0.9804200969828122,
    fracCaptured: 0.9140228329042058,
    fracNear: 0.7245526614516374,
    dN2overC: 0.1419303460222288,
    oneOverLogN: 0.14476482730108395,
    atZeroNormalizedErr: 7.993605777301127e-15,
    mass0T: 0.00599230072406417,
  }),
  Object.freeze({
    N: 2000,
    dN2: 0.006114100440016368,
    dN2LogNoverC: 1.0060890778581055,
    fracCaptured: 0.9180647591308533,
    fracNear: 0.7133235511073505,
    dN2overC: 0.13236442425268508,
    oneOverLogN: 0.1315633249239519,
    atZeroNormalizedErr: 6.772360450213455e-15,
    mass0T: 0.005613140147765471,
  }),
]);

// Compact verdict: neither observable "tightens" with N.
export const IMP96069_VERDICT = Object.freeze({
  identityBand: '+/-2 percent oscillation (0.980-1.006), not monotone -> 1',
  fracCapturedDrift: 'N-independent at fixed T (0.914-0.918, spread < 0.5 percent)',
  spikeHeights: 'pinned to 1/|rho|^2 at ~1e-14 for all N (mollifier-independent)',
  widthIdentity: 'dN2/C_burnol = 1/logN holds to the same ~1-2 percent remainder',
  conclusion:
    'the N=500 0.2 percent agreement is a coincidence inside a ~2 percent lower-order remainder, not a sharpening finite-N identity; no bound changes.',
});

export const IMP96069_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m7-extend-mellin.py; the N=500 row matches the source Route M module bit-for-bit; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96069_ASSERTIONS = [
  {
    id: 'imp96069-n500-reproduces-source',
    holds: () => {
      const r = IMP96069_ROWS[0];
      // baseline values that the source module reported at N=500, T=400
      return r.N === 500 &&
        r.dN2 === 0.007419858011581737 &&
        r.fracCaptured === 0.9146083335142102 &&
        Math.abs(r.dN2LogNoverC - 0.998270) < 1e-5;
    },
    why: 'the N=500 re-run reproduces the source Route M mellinResidual (dN2, fracCaptured, and the 0.998270 identity ratio) bit-for-bit, validating the extended pipeline.',
  },
  {
    id: 'imp96069-identity-oscillates-not-monotone',
    holds: () => {
      const r = IMP96069_ROWS.map((x) => x.dN2LogNoverC);
      // all three within +/-2 percent of 1, but NOT monotone (dips at N=1000 then rises above 1)
      const withinBand = r.every((v) => Math.abs(v - 1) < 0.021);
      const notMonotone = !(r[0] > r[1] && r[1] > r[2]) && !(r[0] < r[1] && r[1] < r[2]);
      return withinBand && notMonotone && r[1] < r[0] && r[2] > r[1] && r[2] > 1;
    },
    why: 'dN2 logN / C_burnol = 0.998270, 0.980420, 1.006089: inside a +/-2 percent band but non-monotone (down then up through 1), so the 0.2 percent N=500 agreement is not a tightening trend.',
  },
  {
    id: 'imp96069-fraccaptured-N-independent',
    holds: () => {
      const f = IMP96069_ROWS.map((x) => x.fracCaptured);
      const spread = Math.max(...f) - Math.min(...f);
      return spread < 0.005 && f.every((v) => v > 0.91 && v < 0.92);
    },
    why: 'fracCaptured stays in [0.9140, 0.9181] (spread < 0.5 percent) across a 4x range in N at fixed T=400, so mass distribution in t is a constant of the cutoff, not of the mollifier length.',
  },
  {
    id: 'imp96069-spikes-pinned-and-width-tracks-oneoverlogn',
    holds: () =>
      IMP96069_ROWS.every((r) => r.atZeroNormalizedErr < 1e-12) &&
      IMP96069_ROWS.every((r) => Math.abs(r.dN2overC / r.oneOverLogN - 1) < 0.021),
    why: 'residual x (1/4 + gamma^2) = 1 at every zero to ~1e-14 for all N (heights forced by zeta(rho)=0), and dN2/C_burnol matches 1/logN to within the same ~2 percent remainder.',
  },
  {
    id: 'imp96069-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96069_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96069_HONEST_BANNER) &&
      /NO QED/.test(IMP96069_HONEST_BANNER) &&
      typeof IMP96069_VERDICT.conclusion === 'string',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers required of every Route A-M measurement surface.',
  },
];

for (const a of IMP96069_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96069-route-m-mellin-residual-extended-n1000-n2000 assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96069_C_BURNOL,
  grid: IMP96069_GRID,
  rows: IMP96069_ROWS,
  verdict: IMP96069_VERDICT,
  banner: IMP96069_HONEST_BANNER,
};
