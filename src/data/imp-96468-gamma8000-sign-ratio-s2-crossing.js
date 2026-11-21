/**
 * imp-96468 -- Locate the s2 residual-scale multiplier at which the imp-96432 K=10
 * leverage-optimal c/seC SIGN ratio crosses 1 SE (sign becomes measurement-undecided)
 * and 2 SE, and place both crossings against the chi-square plausible s2 band.
 *
 * BACKGROUND. imp-96432 showed the imp-96392 PART B "does-not-collapse" frac-tighter reading
 * is EXACTLY s2-invariant (the sqrt(s2) factor cancels in 1 - sqrt(g_append/g_base)), but the
 * SEPARATE c/seC sign ratio inherits the sqrt(s2) dependence because its numerator (the
 * projected near-halved intercept c_proj ~ 0.0185) is FIXED. Via the imp-96307 design identity
 *
 *     seC = sqrt( s2 * g ),   g = 1/n + xbar^2 / Sxx   (x-design only),
 *
 * the ratio at s2 multiplier f is R(f) = c_proj / sqrt(s2_nom * f * g_K10) = A / sqrt(f), with
 * A = R(1) the nominal ratio. imp-96432 tabulated R = 2.31 (f=0.5) -> 1.64 (f=1) -> 1.16 (f=2)
 * but never solved for the multiplier at which the sign becomes undecided.
 *
 * WHAT THIS MEASURES. Because R(f) = A / sqrt(f) is a closed form, the crossings invert exactly:
 *
 *     R(f) = target  <=>  f = (A / target)^2.
 *
 * With the recomputed nominal ratio A = 1.63595 (c_proj = 0.0185243, s2_nom = 2.68229e-4,
 * g_K10 = 0.478008) this gives:
 *
 *   crossing        s2 multiplier f       s2 value        SD offset from nominal (relSD 0.25)
 *   c/seC = 2       0.66909               1.7947e-4       -1.32 SD   (INSIDE  the [0.5,1.5] band)
 *   c/seC = 1       2.67635               7.1787e-4       +6.71 SD   (OUTSIDE the [0.5,1.5] band,
 *                                                                     and outside the [0.5,2.0]
 *                                                                     factor-2 outer envelope)
 *
 * READING. The sign becomes measurement-undecided (c/seC = 1) only once s2 is inflated to
 * f = 2.68x its measured value -- +6.7 chi-square SD above nominal on 32 dof, far beyond both the
 * 2-SD plausible band [0.5,1.5] and the generous factor-2 outer envelope [0.5,2.0]. Across the
 * WHOLE plausible band the ratio runs R(0.5) = 2.314 down to R(1.5) = 1.336, staying strictly
 * above 1 everywhere: the projected-intercept SIGN stays DECIDED (c/seC > 1) across the entire
 * chi-square 2-SD residual-scale band. The 2-SE threshold (c/seC = 2) is crossed at f = 0.669,
 * which does sit inside the band (-1.3 SD): so within the plausible band the ratio can dip below
 * the 2-SE "clearly-significant" line, but never below the 1-SE "undecided" line.
 *
 * CAVEAT INHERITED FROM imp-96432. The numerator c_proj ~ 0.0185 is the imp-96367 near-halving
 * PROJECTION, NOT a measured gamma_8000 intercept; the numerator x denominator sign question is
 * the one imp-96392 already defers to the fresh-height sub-gap. This module only bounds the
 * denominator (s2) sensitivity of that ratio; it does not settle the projected numerator.
 *
 * UNCHANGED. No fresh rho evaluated; the binding measured envelope rho_min = 0.3791 at gamma_4000
 * stays strictly positive; changes NO Lambda bound; no refereed bound is changed;
 * RH open; NO QED.
 *
 * GRADE: measurement only. Import-light (design + s2 recomputed from the same baked
 * imp-96224/imp-96367 arrays as imp-96392/imp-96432; no heavy bundle).
 *
 * @see imp-96432-gamma8000-sec-s2-sensitivity (the sqrt(s2) sign-ratio caveat this locates)
 * @see imp-96307-anchor-confidence-gain-projection (the seC = sqrt(s2*(1/n + xbar^2/Sxx)) identity)
 * @see imp-96392-margin-floor-gamma8000-feasibility (the s2-fixed seC / deferred numerator reading)
 */

// Same REAL measured arrays as imp-96392/imp-96432 (seven on-line imp-96148 + 27 off-anchor).
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];
const T = T7.concat(OFF_T);
const RHO = R7.concat(OFF_RHO);
const X = T.map((t) => 1 / Math.log(t));

// OLS fit with intercept, residual scale s2 (imp-96328 estimator; matches imp-96392/imp-96432).
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  return { c, d, s2, n };
}
const BASE = fitWithSE(X, RHO);

// gamma_8000 terminal height and the K=10 leverage-optimal design factor (10 copies at X8).
function gammaN(N) { return (2 * Math.PI * N) / Math.log(N / (2 * Math.PI * Math.E)); }
const X8 = 1 / Math.log(gammaN(8000));
function designFactor(newXs) {
  const xs = X.concat(newXs);
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return { n, g: 1 / n + (xb * xb) / sxxCentered };
}
const G_K10 = designFactor(Array(10).fill(X8));

// Fixed projected intercept numerator (imp-96367 near-halving; NOT a measured value).
const C_PROJ = BASE.c * 0.5;                                   // ~0.0185243
// Nominal (f=1) c/seC ratio and the closed-form crossing solver f = (A/target)^2.
const A_NOMINAL = C_PROJ / Math.sqrt(BASE.s2 * G_K10.g);       // ~1.63595
const crossingMultiplier = (target) => (A_NOMINAL / target) ** 2;
const F_AT_1SE = crossingMultiplier(1);                        // ~2.67635 (sign undecided)
const F_AT_2SE = crossingMultiplier(2);                        // ~0.66909

// chi-square residual-scale spread: relative SD sqrt(2/(n-2)) on 32 dof.
const REL_SD = Math.sqrt(2 / (BASE.n - 2));                    // 0.25
const TWO_SD_BAND = [0.5, 1.5];                                // ~ +-2 SD around nominal
const OUTER_BAND = [0.5, 2.0];                                 // generous factor-2 envelope
const sdOffset = (f) => (f - 1) / REL_SD;
const ratioAt = (f) => A_NOMINAL / Math.sqrt(f);

// Ratio at the plausible-band edges (both strictly > 1 => sign stays decided across the band).
const R_LO = ratioAt(TWO_SD_BAND[0]);                          // ~2.314 at f=0.5
const R_HI = ratioAt(TWO_SD_BAND[1]);                          // ~1.336 at f=1.5
const SIGN_DECIDED_ACROSS_BAND = R_LO > 1 && R_HI > 1;
const F_1SE_OUTSIDE_2SD = F_AT_1SE > TWO_SD_BAND[1];
const F_1SE_OUTSIDE_OUTER = F_AT_1SE > OUTER_BAND[1];

export const IMP_96468_SIGN_RATIO_S2_CROSSING = {
  id: 'imp-96468-gamma8000-sign-ratio-s2-crossing',
  title:
    'Locate the s2 residual-scale multiplier at which the imp-96432 K=10 leverage-optimal c/seC '
    + 'sign ratio falls below 1 SE (gamma_8000 intercept sign becomes measurement-undecided): '
    + 'f = 2.68x s2 (+6.7 chi-square SD), FAR OUTSIDE the [0.5,1.5] plausible band -- the sign '
    + 'stays decided (c/seC > 1) across the whole band',
  closedForm: 'R(f) = A / sqrt(f) with A = c_proj / sqrt(s2_nom * g_K10); crossing f = (A/target)^2',
  inputs: {
    projectedIntercept: C_PROJ,          // ~0.0185243 (fixed; imp-96367 near-halving, NOT measured)
    s2Nominal: BASE.s2,                  // ~2.68229e-4
    gK10: G_K10.g,                       // ~0.478008 (K=10 leverage-optimal design factor)
    nominalRatio: A_NOMINAL,             // ~1.63595 = c/seC at f=1
    n: BASE.n,                           // 34 (dof n-2 = 32)
  },
  crossings: {
    signUndecided_1SE: {
      target: 1,
      s2Multiplier: F_AT_1SE,            // ~2.67635
      s2Value: BASE.s2 * F_AT_1SE,       // ~7.1787e-4
      sdOffsetFromNominal: sdOffset(F_AT_1SE),   // ~+6.71 SD
      insidePlausibleBand: F_AT_1SE >= TWO_SD_BAND[0] && F_AT_1SE <= TWO_SD_BAND[1], // false
      insideOuterBand: F_AT_1SE >= OUTER_BAND[0] && F_AT_1SE <= OUTER_BAND[1],       // false
    },
    clearlySignificant_2SE: {
      target: 2,
      s2Multiplier: F_AT_2SE,            // ~0.66909
      s2Value: BASE.s2 * F_AT_2SE,       // ~1.7947e-4
      sdOffsetFromNominal: sdOffset(F_AT_2SE),   // ~-1.32 SD
      insidePlausibleBand: F_AT_2SE >= TWO_SD_BAND[0] && F_AT_2SE <= TWO_SD_BAND[1], // true
      insideOuterBand: F_AT_2SE >= OUTER_BAND[0] && F_AT_2SE <= OUTER_BAND[1],       // true
    },
  },
  plausibleBand: {
    relSD: REL_SD,                       // 0.25 (chi-square on n-2 = 32 dof)
    twoSDBand: TWO_SD_BAND,              // [0.5, 1.5]
    outerBand: OUTER_BAND,               // [0.5, 2.0]
    ratioAtLoEdge: R_LO,                 // ~2.314 at f=0.5
    ratioAtHiEdge: R_HI,                 // ~1.336 at f=1.5
    signDecidedAcrossBand: SIGN_DECIDED_ACROSS_BAND,  // true (c/seC > 1 everywhere in [0.5,1.5])
  },
  finding:
    'the c/seC sign ratio R(f) = A/sqrt(f) (A = 1.63595 nominal) inverts in closed form: the '
    + '1-SE crossing (sign becomes measurement-undecided, c/seC = 1) sits at s2 multiplier '
    + 'f = 2.676 (s2 = 7.179e-4), which is +6.7 chi-square SD above the measured s2 on 32 dof -- '
    + 'FAR OUTSIDE both the 2-SD plausible band [0.5,1.5] and the factor-2 outer envelope '
    + '[0.5,2.0]. Across the WHOLE plausible band the ratio runs 2.314 (f=0.5) down to 1.336 '
    + '(f=1.5), staying strictly above 1, so the projected-intercept SIGN stays DECIDED '
    + '(c/seC > 1) across the entire chi-square residual-scale band. The 2-SE line is crossed at '
    + 'f = 0.669 (-1.3 SD), inside the band, so within the plausible range the ratio can dip below '
    + 'the "clearly significant" 2-SE threshold but never below the 1-SE "undecided" line',
  caveat:
    'the numerator c_proj ~ 0.0185 is the imp-96367 near-halving PROJECTION, not a measured '
    + 'gamma_8000 intercept; this bounds only the s2 (denominator) sensitivity of the ratio -- '
    + 'the projected-numerator sign question stays deferred to the imp-96392 fresh-height sub-gap',
  unchanged:
    'no fresh rho evaluated; the binding measured envelope rho_min = 0.3791 at gamma_4000 stays '
    + 'strictly positive; changes NO Lambda bound; no refereed bound is changed; '
    + 'RH open; NO QED',
  note:
    'measurement only; import-light, design + s2 recomputed from the same baked '
    + 'imp-96224/imp-96367 arrays as imp-96392/imp-96432; no fabricated rho; changes no bound; '
    + 'NO QED',
  closesTickets: ['imp-96468'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96468_ASSERTIONS = [
  {
    id: 'imp-96468-nominal-ratio-matches-imp96432',
    holds: () => BASE.n === 34
      && Math.abs(BASE.s2 - 2.682e-4) < 1e-6
      && Math.abs(A_NOMINAL - 1.636) < 5e-3,
    why: 'the recomputed nominal c/seC ratio must reproduce the imp-96432 K=10 nominal point ~1.64.',
  },
  {
    id: 'imp-96468-1SE-crossing-outside-plausible-band',
    holds: () => Math.abs(F_AT_1SE - 2.676) < 5e-3
      && F_1SE_OUTSIDE_2SD && F_1SE_OUTSIDE_OUTER
      && sdOffset(F_AT_1SE) > 6,
    why: 'the sign-undecided (c/seC=1) crossing must sit at f~2.68x s2 (+6.7 SD), outside both the [0.5,1.5] and [0.5,2.0] bands.',
  },
  {
    id: 'imp-96468-2SE-crossing-inside-plausible-band',
    holds: () => Math.abs(F_AT_2SE - 0.669) < 5e-3
      && F_AT_2SE >= TWO_SD_BAND[0] && F_AT_2SE <= TWO_SD_BAND[1],
    why: 'the 2-SE crossing must sit at f~0.669, inside the [0.5,1.5] plausible band (-1.3 SD).',
  },
  {
    id: 'imp-96468-sign-decided-across-band',
    holds: () => SIGN_DECIDED_ACROSS_BAND && R_LO > 2 && R_HI > 1 && R_HI < 2,
    why: 'across the whole plausible band [0.5,1.5] the ratio stays > 1 (2.31 down to 1.34): the sign stays decided.',
  },
  {
    id: 'imp-96468-closed-form-consistency',
    holds: () => Math.abs(ratioAt(F_AT_1SE) - 1) < 1e-9
      && Math.abs(ratioAt(F_AT_2SE) - 2) < 1e-9,
    why: 'the closed-form crossings must satisfy R(f)=target exactly (R(f)=A/sqrt(f), f=(A/target)^2).',
  },
  {
    id: 'imp-96468-no-fresh-rho-no-qed',
    holds: () => /no fabricated rho/i.test(IMP_96468_SIGN_RATIO_S2_CROSSING.note)
      && /NO QED/.test(IMP_96468_SIGN_RATIO_S2_CROSSING.note)
      && /refereed bound is changed/i.test(IMP_96468_SIGN_RATIO_S2_CROSSING.unchanged),
    why: 'measurement only: no fresh rho, changes no bound, no refereed bound is changed, RH open, NO QED.',
  },
  {
    id: 'imp-96468-closes-self',
    holds: () => Array.isArray(IMP_96468_SIGN_RATIO_S2_CROSSING.closesTickets)
      && IMP_96468_SIGN_RATIO_S2_CROSSING.closesTickets.includes('imp-96468'),
    why: 'this module is the sign-ratio s2-crossing measurement the imp-96468 ticket asked for.',
  },
];

for (const a of IMP_96468_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96468-gamma8000-sign-ratio-s2-crossing assertion failed: ${a.id}`);
  }
}

export default IMP_96468_SIGN_RATIO_S2_CROSSING;
