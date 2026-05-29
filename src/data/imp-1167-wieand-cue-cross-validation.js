/**
 * @module imp-1167-wieand-cue-cross-validation
 * @fileoverview Wieand 1999 CUE bulk linear-statistics analog port cross-validating Hughes-Rudnick on the imp-1162 grid.
 */
// imp-1167 — Wieand 1999 CUE bulk linear-statistics analog port for
// cross-validation of the Hughes-Rudnick universality on the imp-1162 grid.
//
// PURPOSE
// -------
// imp-1162 measured Var_E[Im m_N(E + i/N)] for Riemann zeros across a
// 13-point grid {100, ..., 1e6} and found OLS slope -0.881. The
// Hughes-Rudnick universality (Wieand 1999, Hughes-Rudnick 2003) predicts
// that the SAME observable for CUE eigenangles has slope -1.000 exactly.
// The Conrey-Snaith arithmetic factor (imp-1166) explains the 0.12 gap:
// after correction the zeros slope is -0.997, agreeing with CUE.
//
// This file provides:
// (a) A CUE-sample generator based on the Wigner-Dyson GUE surmise for the
//     eigenangle spacing distribution P(s) = (32/pi^2) s^2 exp(-4s^2/pi);
// (b) Per-N CUE spatial variance via numerical quadrature (two-part scheme
//     that resolves the near-zero singularity at scale eta = 1/N);
// (c) OLS slope fit on log(N) vs log(Var_CUE);
// (d) Cross-comparison to the imp-1162 zero slope and the imp-1166
//     arithmetic-corrected zero slope;
// (e) 8 build-time tripwires.
//
// WIEAND CLT BACKGROUND
// ----------------------
// Wieand 1999 (Probab. Theory Related Fields 123, 202-224) proves that for
// a smooth test function phi on the unit circle, the centered CUE linear
// statistic sum_j phi(theta_j) - N integral phi converges to a Gaussian
// with variance sigma^2 = sum_{k>=1} |k| * |hat_phi(k)|^2.
//
// For the bulk Stieltjes-Im observable at scale eta = 1/N, the dominant
// contribution to Im m_N at a bulk midpoint E_j comes from the two nearest
// CUE eigenangles (at distance s_j/2 each, where s_j is the eigenangle
// spacing), giving the nearest-neighbor approximation:
//
//   Im m_N(E_j + i/N) approx  -(2/N) / (s_j^2/4 + 1/N^2)
//
// The spatial variance across M_BULK bulk midpoints is therefore:
//
//   Var_spatial[Im m_N]  approx  (4/N^2) * Var_WD[h_N(s)]
//
// where h_N(s) = 1/(s^2/4 + (1/N)^2) and Var_WD is the variance under the
// Wigner-Dyson distribution P(s).
//
// HONEST SCOPE
// ------------
// (1) NEAREST-NEIGHBOR APPROXIMATION: Only the two nearest eigenvalues
//     contribute to Im m_N at each bulk midpoint. Far-field contributions
//     from all other eigenvalues are approximately constant as the midpoint
//     moves through the bulk, and therefore drop out of the spatial variance.
//     They add a sub-leading log(N) correction to the absolute constant but
//     do NOT change the power-law slope.
//
// (2) WIGNER SURMISE vs EXACT CUE: The Wigner surmise P(s) is an
//     approximation to the exact CUE(N) spacing distribution. Error is
//     < 1% at medium spacings. For an exact CUE simulation at N = 1e6,
//     a full Haar random-unitary QR decomposition would be required, which
//     is O(N^3) and infeasible in pure JavaScript.
//
// (3) OVERESTIMATE AT SMALL N: The Wigner surmise over-predicts the
//     spacing variance for the Riemann zeros at small N (N ~ 100), because
//     the arithmetic regularization from the zeta-function Euler product
//     suppresses eigenangle fluctuations at finite N. This is exactly the
//     Conrey-Snaith arithmetic correction that imp-1166 measures. The
//     SLOPE comparison (not the absolute constant) is the valid cross-
//     validation quantity.
//
// CROSS-VALIDATION PROTOCOL
// -------------------------
// Zero slopes from frozen literals (mirrored from imp-1162 and imp-1166):
//   ZEROS_RAW_SLOPE       = -0.8807808726090421  (imp-1162 combined 13-pt)
//   ZEROS_CORRECTED_SLOPE = -0.9966576312841053  (imp-1166 Wieand-corrected)
// Threshold: universality confirmed if |slope_CUE - slope_zeros| < 0.05.
// Expected result: raw gap ~ 0.12, corrected gap < 0.01.
//
// REFERENCES
// ----------
// - Wieand 1999. Eigenvalue distributions of random unitary matrices.
//   Probab. Theory Related Fields 123 (2002) 202-224.
// - Hughes, Rudnick 2003. Linear statistics of low-lying zeros of L-functions.
//   Q. J. Math. 54, 309-333.
// - Conrey, Snaith 2008. Correlations of eigenvalues and Riemann zeros.
//   Comm. Number Theory and Physics 2, 477-536.
// - Bourgade 2010. Mesoscopic fluctuations of the zeta zeros.
//   Probab. Theory Related Fields 148, 479-500.
//
// @see imp-1167
// @see imp-1162 (source zero variance grid)
// @see imp-1166 (Conrey-Snaith arithmetic correction)
// @see imp-1163 (literature survey confirming Hughes-Rudnick applies here)

// ── 13-point N grid (mirrored from imp-1162 COMBINED_GRID) ────────────────

const N_GRID = Object.freeze([
  100, 200, 500, 1000, 2000, 5000, 10000, 20000,
  50000, 100000, 200000, 500000, 1000000,
]);

// ── Wigner-Dyson GUE spacing surmise ──────────────────────────────────────
//
// P(s) = (32/pi^2) s^2 exp(-4s^2/pi)   unit-mean GUE level-spacing surmise.
// Integrates to 1 on [0, inf). Mean spacing integral_0^inf s P(s) ds = 1.

function wignerSurmGUE(s) {
  return (32.0 / (Math.PI * Math.PI)) * s * s * Math.exp(-4.0 * s * s / Math.PI);
}

// ── Two-part quadrature for E[h_N] and E[h_N^2] ───────────────────────────
//
// h_N(s) = 1 / (s^2/4 + eta^2)  where eta = 1/N.
//
// For large N, eta is tiny and h_N has a sharp spike near s = 0. Midpoint
// quadrature with a fixed step ds = S_MAX/N_QUAD fails to resolve the spike
// when eta << ds. We split at s_split = max(20*eta, S_SPLIT_MIN):
//
//   Near-zero (0 to s_split):  P(s) ~ (32/pi^2) s^2  (exact for s << 1).
//     Integral (32/pi^2) s^2 / (s^2/4 + eta^2)^m ds has analytic primitives
//     via the substitution t = s/(2*eta) mapping to t^2/(t^2+1)^m.
//
//   Far-field (s_split to S_MAX):  standard midpoint quadrature, N_QUAD pts.
//
// Analytic primitives (for c = s_split/(2*eta)):
//   int_0^c t^2/(t^2+1) dt   = c - arctan(c)                  (for E[h] nz)
//   int_0^c t^2/(t^2+1)^2 dt = arctan(c)/2 - c/(2*(c^2+1))   (for E[h^2] nz)

const N_QUAD     = 8000;
const S_MAX      = 6.0;    // P(s) < 1e-17 beyond s = 6
const S_SPLIT_MIN = 0.001; // lower bound on split point (relevant for small N)

function cueVarianceAtN(N) {
  const eta    = 1.0 / N;
  const sSplit = Math.max(20.0 * eta, S_SPLIT_MIN);
  const c      = sSplit / (2.0 * eta); // substitution endpoint for near-zero integral

  // ── Near-zero analytic integrals ──────────────────────────────────────
  // Notation: A = (32/pi^2), rescaled integrals I1 and I2 via t = s/(2*eta).
  const A = 32.0 / (Math.PI * Math.PI);

  // E[h_N]_nz = A * 8 * eta * int_0^c t^2/(t^2+1) dt
  const I1_nz = c - Math.atan(c);
  const E_h_nz = A * 8.0 * eta * I1_nz;

  // E[h_N^2]_nz = A * (8/eta) * int_0^c t^2/(t^2+1)^2 dt
  const I2_nz  = 0.5 * Math.atan(c) - c / (2.0 * (c * c + 1.0));
  const E_h2_nz = A * (8.0 / eta) * I2_nz;

  // ── Far-field midpoint quadrature ─────────────────────────────────────
  const ds = (S_MAX - sSplit) / N_QUAD;
  let E_h_ff  = 0.0;
  let E_h2_ff = 0.0;
  for (let i = 0; i < N_QUAD; i++) {
    const s  = sSplit + (i + 0.5) * ds;
    const p  = wignerSurmGUE(s);
    const h  = 1.0 / (s * s * 0.25 + eta * eta);
    E_h_ff  += p * h        * ds;
    E_h2_ff += p * h * h    * ds;
  }

  const E_h  = E_h_nz  + E_h_ff;
  const E_h2 = E_h2_nz + E_h2_ff;
  const varH = E_h2 - E_h * E_h;

  // Spatial variance of Im m_N = (2*eta)^2 * Var[h_N(s)] = (4/N^2) * varH
  return (4.0 / (N * N)) * varH;
}

// ── CUE variance grid ─────────────────────────────────────────────────────
//
// Computed at import time via the two-part quadrature for all 13 N values.
// Each row stores { N, varianceCUE } in the same format as the imp-1162
// COMBINED_GRID rows for direct OLS comparability.

const CUE_VARIANCE_GRID = Object.freeze(
  N_GRID.map((N) => Object.freeze({ N, varianceCUE: cueVarianceAtN(N) })),
);

// ── OLS fit on log(N) vs log(varianceCUE) ─────────────────────────────────
//
// Matching the fitLogLog pipeline from imp-1162 and imp-1166.

function fitLogLog(rows, valueKey) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r[valueKey]));
  const n  = xs.length;
  let xm = 0.0;
  let ym = 0.0;
  for (let i = 0; i < n; i++) { xm += xs[i]; ym += ys[i]; }
  xm /= n; ym /= n;
  let num = 0.0;
  let den = 0.0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xm) * (ys[i] - ym);
    den += (xs[i] - xm) * (xs[i] - xm);
  }
  const slope     = num / den;
  const intercept = ym - slope * xm;
  let ssRes = 0.0;
  let ssTot = 0.0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - ym)   * (ys[i] - ym);
  }
  return { slope, intercept, R2: 1.0 - ssRes / ssTot, n_points: n };
}

const CUE_OLS = Object.freeze(fitLogLog(CUE_VARIANCE_GRID, 'varianceCUE'));

// ── Cross-validation verdict ───────────────────────────────────────────────
//
// Frozen reference slopes (mirrored from imp-1162 and imp-1166 build output).
// ZEROS_CORRECTED_SLOPE is the imp-1166 corrected OLS slope after dividing
// empirical variances by the simplified log-N Conrey-Snaith arithmetic factor.

const ZEROS_RAW_SLOPE       = -0.8807808726090421;
const ZEROS_CORRECTED_SLOPE = -0.9966576312841053;
const CUE_THEORETICAL_SLOPE = -1.0;              // Wieand CLT asymptotic

const rawGap       = Math.abs(CUE_OLS.slope - ZEROS_RAW_SLOPE);
const correctedGap = Math.abs(CUE_OLS.slope - ZEROS_CORRECTED_SLOPE);

const UNIVERSALITY_THRESHOLD = 0.05;

function determineVerdict() {
  if (rawGap < UNIVERSALITY_THRESHOLD)       return 'universality-confirmed-raw';
  if (correctedGap < UNIVERSALITY_THRESHOLD) return 'universality-confirmed-after-correction';
  return 'universality-gap-remains';
}

const VERDICT = Object.freeze({
  cueSlope:              CUE_OLS.slope,
  cueR2:                 CUE_OLS.R2,
  cueIntercept:          CUE_OLS.intercept,
  zerosRawSlope:         ZEROS_RAW_SLOPE,
  zerosCorrectedSlope:   ZEROS_CORRECTED_SLOPE,
  cueTheoreticalSlope:   CUE_THEORETICAL_SLOPE,
  rawGap,
  correctedGap,
  universalityThreshold: UNIVERSALITY_THRESHOLD,
  verdict:               determineVerdict(),
  honestScope:           'nearest-neighbor-wigner-surmise',
});

// ── Frozen exported record ────────────────────────────────────────────────

export const IMP1167_WIEAND_CUE_CROSS_VALIDATION = Object.freeze({
  id: 'imp-1167',
  ticket: 'imp-1167',
  attemptDate: '2026-05-21',
  goal:
    'Port the Wieand 1999 CLT to the imp-1162 test-function family (bulk ' +
    'Stieltjes-Im at scale eta = 1/N), generate matched CUE spatial variance ' +
    'at each of the 13 N values in the imp-1162 grid via Wigner-Dyson ' +
    'quadrature, fit the OLS slope, and cross-compare to the Riemann zero ' +
    'slope to test Hughes-Rudnick universality.',
  method:
    'Nearest-neighbor Wigner-Dyson approximation: Var_CUE(N) ~ (4/N^2) ' +
    'Var_WD[1/(s^2/4 + (1/N)^2)] where P(s) = (32/pi^2) s^2 exp(-4s^2/pi). ' +
    'Integral computed via two-part scheme (analytic near-zero + midpoint far-field) ' +
    'resolving the 1/N^2 spike for all N up to 1e6.',
  cueVarianceGrid: CUE_VARIANCE_GRID,
  cueOLS:          CUE_OLS,
  verdict:         VERDICT,
  referenceTickets: Object.freeze(['imp-1162', 'imp-1163', 'imp-1166']),
  honestScope: Object.freeze([
    'NEAREST-NEIGHBOR APPROXIMATION: The formula Var_CUE(N) ~ (4/N^2) ' +
    'Var_WD[h_N(s)] captures the dominant contribution to the spatial variance ' +
    'from the two nearest CUE eigenangles. Far-field contributions from all ' +
    'other eigenangles are approximately constant as the bulk midpoint varies, ' +
    'dropping out of the spatial variance. They affect only the absolute ' +
    'constant, not the slope. The slope comparison is therefore valid.',
    'WIGNER SURMISE vs EXACT CUE: P(s) = (32/pi^2) s^2 exp(-4s^2/pi) ' +
    'approximates the exact CUE spacing distribution with < 1% error at ' +
    'medium spacings. For exact CUE simulation at N = 1e6 a full QR ' +
    'decomposition on a random N x N unitary would be required (O(N^3), ' +
    'infeasible in pure JavaScript).',
    'OVERESTIMATE AT SMALL N: The Wigner surmise over-predicts the variance ' +
    'for the Riemann zeros at small N because the Euler product arithmetic ' +
    'regularization (Conrey-Snaith 2008) suppresses eigenangle fluctuations ' +
    'at finite N. The CUE absolute constant is therefore larger than the ' +
    'zero constant at small N. This is consistent with imp-1166: the arithmetic ' +
    'correction reduces the zeros variance and drives the zeros slope toward -1.',
    'The SLOPE comparison (not the absolute constant) is the valid test of ' +
    'Hughes-Rudnick universality. Expected result: CUE slope ~ -1.00 (Wieand ' +
    'CLT), zeros raw slope ~ -0.881 (imp-1162), zeros corrected slope ~ -0.997 ' +
    '(imp-1166). The corrected gap < 0.05 confirms universality-after-correction.',
  ]),
});

export default IMP1167_WIEAND_CUE_CROSS_VALIDATION;

// ── Build-time tripwires ──────────────────────────────────────────────────

export const IMP1167_WIEAND_CUE_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp1167-cue-grid-has-13-rows',
    holds: () => CUE_VARIANCE_GRID.length === 13,
    why:
      'The CUE variance grid must have exactly 13 rows matching the ' +
      'imp-1162 13-point N grid. Fewer rows produce an incomparable OLS fit.',
  },
  {
    id: 'imp1167-cue-variance-all-finite-positive',
    holds: () => {
      for (const r of CUE_VARIANCE_GRID) {
        if (!Number.isFinite(r.varianceCUE) || r.varianceCUE <= 0) return false;
      }
      return true;
    },
    why:
      'Every CUE variance entry must be finite and strictly positive. ' +
      'A zero or negative value indicates catastrophic cancellation in Var_WD ' +
      '(E[h^2] < E[h]^2), which is a numerical precision failure.',
  },
  {
    id: 'imp1167-cue-variance-monotone-decreasing-in-N',
    holds: () => {
      const rows = CUE_VARIANCE_GRID;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].varianceCUE >= rows[i - 1].varianceCUE) return false;
      }
      return true;
    },
    why:
      'The CUE spatial variance must be strictly decreasing in N (slope < 0). ' +
      'A non-monotone row indicates the quadrature is inaccurate at that N.',
  },
  {
    id: 'imp1167-cue-slope-in-wieand-band',
    holds: () => {
      const s = IMP1167_WIEAND_CUE_CROSS_VALIDATION.cueOLS.slope;
      return Number.isFinite(s) && s > -1.15 && s < -0.90;
    },
    why:
      'The CUE OLS slope must lie in (-1.15, -0.90). The Wieand CLT predicts ' +
      'slope = -1.0 asymptotically; the 13-point Wigner surmise estimate on ' +
      'this N range should reproduce it within 0.15. A slope outside this band ' +
      'indicates a formula or numerical error.',
  },
  {
    id: 'imp1167-cue-r2-tight',
    holds: () => {
      const r2 = IMP1167_WIEAND_CUE_CROSS_VALIDATION.cueOLS.R2;
      return Number.isFinite(r2) && r2 >= 0.98;
    },
    why:
      'The CUE log-log OLS R^2 must be at least 0.98. The Wigner-Dyson ' +
      'quadrature produces a near-perfect power law (no arithmetic noise); a ' +
      'lower R^2 would indicate a numerical precision issue or a formula error.',
  },
  {
    id: 'imp1167-cue-slope-closer-to-minus1-than-zeros-raw-slope',
    holds: () => {
      const cueDist   = Math.abs(IMP1167_WIEAND_CUE_CROSS_VALIDATION.cueOLS.slope - (-1.0));
      const zerosDist = Math.abs(ZEROS_RAW_SLOPE - (-1.0));
      return cueDist < zerosDist;
    },
    why:
      'The CUE slope (Wigner-Dyson, approximating Wieand CLT) must be CLOSER ' +
      'to -1.0 than the raw zeros slope (-0.881). If the CUE slope is farther ' +
      'from -1.0, the universality ordering is inverted, indicating a formula ' +
      'error or wrong reference slope literal.',
  },
  {
    id: 'imp1167-corrected-gap-smaller-than-raw-gap',
    holds: () => {
      const v = IMP1167_WIEAND_CUE_CROSS_VALIDATION.verdict;
      return v.correctedGap < v.rawGap;
    },
    why:
      'The arithmetic correction from imp-1166 must reduce the gap between the ' +
      'CUE slope and the zeros slope. If the corrected gap is larger, either ' +
      'the correction goes in the wrong direction or the ZEROS_CORRECTED_SLOPE ' +
      'literal is wrong.',
  },
  {
    id: 'imp1167-verdict-string-derivable-from-gaps',
    holds: () => {
      const v = IMP1167_WIEAND_CUE_CROSS_VALIDATION.verdict;
      const thresh = v.universalityThreshold;
      if (v.rawGap < thresh)       return v.verdict === 'universality-confirmed-raw';
      if (v.correctedGap < thresh) return v.verdict === 'universality-confirmed-after-correction';
      return v.verdict === 'universality-gap-remains';
    },
    why:
      'The verdict string must be derivable from rawGap, correctedGap, and ' +
      'universalityThreshold. A mismatch between the string and the numeric ' +
      'gaps would silently misrepresent the cross-validation result.',
  },
];
