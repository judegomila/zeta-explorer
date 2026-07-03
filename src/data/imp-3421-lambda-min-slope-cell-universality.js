/**
 * @module imp-3421-lambda-min-slope-cell-universality
 * @fileoverview imp-3421 -- RE-FIT the imp-3382 geometric decay SLOPE of
 *   log10 lambda_min(Gpass(D)) across a small grid of (a, U, NPHI) cells to
 *   settle whether the per-degree conditioning factor (~ -3.846 per degree on
 *   the single genuine base cell a=0.5, U=6, NPHI=10) is a UNIVERSAL feature of
 *   the raw-diagonal moment matrix or a cell-specific number.
 *
 *   THE PARENT CLAIM (imp-3382)
 *   ---------------------------
 *   imp-3382 fit, on the single genuine base cell (a=0.5, U=6, NPHI=10),
 *       log10 lambda_min(Gpass(D)) ~ -4.31 - 3.846 D   (R^2 ~ 0.9999)
 *   and attributed the geometric decay to the super-exponential future-tail
 *   underflow of the raw physical diagonal density m(tau) = (1/2pi) Phi^2
 *   sinh(2 a tau). It described the slope loosely as a property of the
 *   "Phi^2 sinh(2a tau) density shape" -- but never varied the cell, so it
 *   could not say whether the -3.846 per-degree factor is set by the density
 *   WEIGHT (a), the Phi TRUNCATION (NPHI), or the LAG CUTOFF / basis interval
 *   (U). This module re-fits the slope one-axis-at-a-time.
 *
 *   THE OBJECT (unchanged from imp-3382)
 *   ------------------------------------
 *   Gpass_{mn}(D) = int_0^U P_m(tau) P_n(tau) m(tau) dtau in the shifted-Legendre
 *   basis P_0..P_D on [0,U], m(tau) = (1/2pi) Phi(tau)^2 sinh(2 a tau). For each
 *   cell we fit log10 lambda_min(Gpass(D)) vs D on the SAME imp-3382 pre-floor
 *   reliable window D in {1,2,3} (double precision floors lambda_min below the
 *   representable relative floor by degree ~4, so higher D turns the fit into a
 *   precision artifact -- see the imp-3382 sub-gap).
 *
 *   MEASURED RESULT (the deliverable; full numbers in `cells`)
 *   ----------------------------------------------------------
 *   The per-degree slope is NOT a universal constant of the density shape. It
 *   splits cleanly by axis:
 *
 *     1. a (shear weight) -- INVARIANT. a in {0.3, 0.5, 0.7, 0.9} all give
 *        slope ~ -3.845 (spread &lt; 2e-3). a only shifts the INTERCEPT
 *        (log10 lambda_min at D=0): -4.53 (a=0.3) -> -4.31 (a=0.5) -> -4.16
 *        (a=0.7) -> -4.05 (a=0.9). The sinh(2a tau) weight rescales the density
 *        magnitude but not the tail geometry that sets the decay RATE.
 *
 *     2. NPHI (Phi truncation) -- INVARIANT to the digits reported. NPHI in
 *        {6, 10, 14, 20} give an IDENTICAL slope ~ -3.845 and intercept -4.311
 *        (the higher harmonics n &gt; 6 are already underflowed to 0 over the
 *        support of m(tau), so truncation past 6 changes nothing).
 *
 *     3. U (lag cutoff / basis interval) -- DRIFTS monotonically. Over U in
 *        {3, 4, 5, 6, 8, 10} the slope steepens
 *        -3.224, -3.483, -3.683, -3.845, -4.099, -4.296,
 *        and this drift is well fit by a LOGARITHM of the cutoff,
 *            slope(U) ~ c0 + c1 ln U,   c0 ~ -2.25, c1 ~ -0.89   (R^2 &gt; 0.999).
 *        Larger U appends more dead future-tail interval [~1.2, U] over which
 *        m(tau) has underflowed, so the degree-D Legendre block must span a
 *        larger empty region and its smallest eigenvalue decays faster.
 *
 *   VERDICT
 *   -------
 *   The imp-3382 -3.846 per-degree conditioning slope is a LAG-CUTOFF property,
 *   not a universal density-shape constant: it is a smooth (logarithmic)
 *   function of U and is INVARIANT to the shear weight a (which shifts only the
 *   intercept) and to the Phi truncation NPHI. This SHARPENS the imp-3382
 *   mechanism -- the geometric ill-conditioning is driven by the RATIO of the
 *   basis interval [0,U] to the effective support of m(tau) (~[0,1.2]), so
 *   quoting a single "-3.846 per degree" is cell-specific to U=6; the universal
 *   statement is only that the decay is geometric with a U-controlled rate.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DIAGNOSTIC ONLY. The slope is fit on the imp-3382 pre-floor
 *   window D in {1,2,3} at every cell (double precision floors lambda_min by
 *   degree ~4; the imp-3382 extended-precision sub-gap is inherited unchanged).
 *   RH-EQUIVALENT class; no positivity attempted, no reduction, no RH verdict,
 *   no false QED. The off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction, UNTOUCHED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3382-rawdiagonal-R-degree-growth-law.js (the single-cell -3.846 slope this re-fits)
 *   @see imp-2686-mupass-construction.js (the physical diagonal m(tau))
 *
 *   Ticket: imp-3421 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NQ = 8000;   // quadrature panels (matches imp-3382 converged setting)

// imp-3382 single-cell anchor: base cell (a=0.5, U=6, NPHI=10), slope ~ -3.846.
const IMP3382_BASE_A = 0.5;
const IMP3382_BASE_U = 6;
const IMP3382_BASE_NPHI = 10;
const IMP3382_BASE_SLOPE = -3.846;   // recorded parent slope
const IMP3382_BASE_INTERCEPT = -4.31; // recorded parent intercept

// imp-3382 pre-floor reliable window: fit the geometric slope on D in {1,2,3}
// (double precision floors lambda_min below the representable floor by D~4).
const FIT_DEGREES = Object.freeze([1, 2, 3]);

// One-axis-at-a-time sweeps around the base cell.
const A_SWEEP = Object.freeze([0.3, 0.5, 0.7, 0.9]);      // fixed U=6, NPHI=10
const NPHI_SWEEP = Object.freeze([6, 10, 14, 20]);         // fixed a=0.5, U=6
const U_SWEEP = Object.freeze([3, 4, 5, 6, 8, 10]);        // fixed a=0.5, NPHI=10

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(u, NPHI) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Shifted-Legendre values P_0..P_K at tau in [0,U] (mapped x = 2 tau/U - 1). */
function legVals(tau, K, U) {
  const x = (2 * tau) / U - 1;
  const v = new Array(K + 1);
  v[0] = 1;
  if (K >= 1) v[1] = x;
  for (let k = 1; k < K; k++) v[k + 1] = ((2 * k + 1) * x * v[k] - k * v[k - 1]) / (k + 1);
  return v;
}

/** Symmetric-matrix eigenvalues via cyclic Jacobi (exact at these small sizes). */
function symEigVals(Ain) {
  const n = Ain.length;
  const A2 = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A2[p][q] * A2[p][q];
    if (off < 1e-44) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A2[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const theta = (A2[q][q] - A2[p][p]) / (2 * apq);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A2[k][p];
          const akq = A2[k][q];
          A2[k][p] = c * akp - s * akq;
          A2[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A2[p][k];
          const aqk = A2[q][k];
          A2[p][k] = c * apk - s * aqk;
          A2[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  return A2.map((r, i) => r[i]);
}

/** Smallest positive eigenvalue of the raw-diagonal moment matrix Gpass(D). */
function lambdaMinGpass(D, a, U, NPHI) {
  const K = D;
  const H = U / NQ;
  const Gp = Array.from({ length: K + 1 }, () => new Array(K + 1).fill(0));
  for (let i = 0; i < NQ; i++) {
    const tau = (i + 0.5) * H;
    const p = phiKernel(tau, NPHI);
    const m = (p * p * Math.sinh(2 * a * tau)) / (2 * Math.PI); // raw physical diagonal density
    const L = legVals(tau, K, U);
    for (let mm = 0; mm <= K; mm++) {
      const lm = L[mm] * m * H;
      for (let nn = mm; nn <= K; nn++) Gp[mm][nn] += lm * L[nn];
    }
  }
  for (let mm = 0; mm <= K; mm++) for (let nn = mm + 1; nn <= K; nn++) Gp[nn][mm] = Gp[mm][nn];
  const l = symEigVals(Gp);
  const pos = l.filter((x) => x > 0);
  return pos.length ? Math.min(...pos) : 0;
}

/**
 * Fit the geometric slope log10 lambda_min(Gpass(D)) ~ intercept + slope * D
 * on the pre-floor window for one (a, U, NPHI) cell.
 */
function fitCell(a, U, NPHI) {
  const pts = FIT_DEGREES.map((D) => [D, Math.log10(lambdaMinGpass(D, a, U, NPHI))]);
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  const nf = pts.length;
  for (const [x, y] of pts) {
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const slope = (nf * sxy - sx * sy) / (nf * sxx - sx * sx);
  const intercept = (sy - slope * sx) / nf;
  let ss = 0;
  let st = 0;
  const ym = sy / nf;
  for (const [x, y] of pts) {
    const yh = intercept + slope * x;
    ss += (y - yh) * (y - yh);
    st += (y - ym) * (y - ym);
  }
  const r2 = st > 0 ? 1 - ss / st : 1;
  return Object.freeze({
    a,
    U,
    NPHI,
    slope,
    intercept,
    r2,
    perDegreeFactor: Math.pow(10, slope),
  });
}

// -- Run the three one-axis sweeps.
const A_CELLS = Object.freeze(A_SWEEP.map((a) => fitCell(a, IMP3382_BASE_U, IMP3382_BASE_NPHI)));
const NPHI_CELLS = Object.freeze(NPHI_SWEEP.map((n) => fitCell(IMP3382_BASE_A, IMP3382_BASE_U, n)));
const U_CELLS = Object.freeze(U_SWEEP.map((u) => fitCell(IMP3382_BASE_A, u, IMP3382_BASE_NPHI)));

// Base-cell cross-check against the recorded imp-3382 slope/intercept.
const BASE_CELL = fitCell(IMP3382_BASE_A, IMP3382_BASE_U, IMP3382_BASE_NPHI);

// -- Axis diagnostics.
function slopeSpread(cells) {
  const sl = cells.map((c) => c.slope);
  return Math.max(...sl) - Math.min(...sl);
}
const A_SLOPE_SPREAD = slopeSpread(A_CELLS);
const NPHI_SLOPE_SPREAD = slopeSpread(NPHI_CELLS);
const U_SLOPE_SPREAD = slopeSpread(U_CELLS);

// Intercept RANGE across the a-sweep (the axis that moves the intercept).
const A_INTERCEPTS = A_CELLS.map((c) => c.intercept);
const A_INTERCEPT_RANGE = Math.max(...A_INTERCEPTS) - Math.min(...A_INTERCEPTS);

// U-sweep slope is monotone decreasing (steepens) with U.
const U_SLOPE_MONOTONE = U_CELLS.every((c, i) => i === 0 || c.slope < U_CELLS[i - 1].slope);

// Logarithmic fit slope(U) ~ c0 + c1 ln U over the U-sweep.
const _uPts = U_CELLS.map((c) => [Math.log(c.U), c.slope]);
let _lx = 0;
let _ly = 0;
let _lxx = 0;
let _lxy = 0;
for (const [x, y] of _uPts) {
  _lx += x;
  _ly += y;
  _lxx += x * x;
  _lxy += x * y;
}
const _ln = _uPts.length;
const U_LOG_SLOPE_C1 = (_ln * _lxy - _lx * _ly) / (_ln * _lxx - _lx * _lx); // ~ -0.89
const U_LOG_SLOPE_C0 = (_ly - U_LOG_SLOPE_C1 * _lx) / _ln;                   // ~ -2.25
let _lss = 0;
let _lst = 0;
const _lym = _ly / _ln;
for (const [x, y] of _uPts) {
  const yh = U_LOG_SLOPE_C0 + U_LOG_SLOPE_C1 * x;
  _lss += (y - yh) * (y - yh);
  _lst += (y - _lym) * (y - _lym);
}
const U_LOG_FIT_R2 = 1 - _lss / _lst;

// Classification thresholds.
const SLOPE_INVARIANT_TOL = 5e-3;    // "invariant" if the sweep spread stays below this
const A_SLOPE_INVARIANT = A_SLOPE_SPREAD < SLOPE_INVARIANT_TOL;
const NPHI_SLOPE_INVARIANT = NPHI_SLOPE_SPREAD < SLOPE_INVARIANT_TOL;
const U_SLOPE_DRIFTS = U_SLOPE_SPREAD > 0.3;
const SLOPE_IS_UNIVERSAL = A_SLOPE_INVARIANT && NPHI_SLOPE_INVARIANT && !U_SLOPE_DRIFTS;

export const IMP3421_LAMBDA_MIN_SLOPE_CELL_UNIVERSALITY = Object.freeze({
  id: 'imp-3421-lambda-min-slope-cell-universality',
  ticket: 'imp-3421',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedParent: 'imp-3382-rawdiagonal-R-degree-growth-law.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Re-fits the imp-3382 geometric decay slope of log10 lambda_min(Gpass(D)) ' +
    '(~ -3.846 per degree on the single genuine base cell a=0.5,U=6,NPHI=10) across ' +
    'one-axis-at-a-time (a, U, NPHI) sweeps, on the SAME imp-3382 pre-floor window ' +
    'D in {1,2,3}. FINDING: the per-degree factor is NOT a universal density-shape ' +
    'constant. It is INVARIANT to the shear weight a (a in {0.3,0.5,0.7,0.9} all give ' +
    'slope ~ -3.845, spread < 2e-3; a shifts only the INTERCEPT -4.53 -> -4.05) and ' +
    'INVARIANT to the Phi truncation NPHI (NPHI in {6,10,14,20} identical, since ' +
    'harmonics n>6 are underflowed over the support of m(tau)); but it DRIFTS ' +
    'monotonically with the lag cutoff U (U in {3,4,5,6,8,10} -> slope -3.224 .. -4.296), ' +
    'well fit by slope(U) ~ -2.25 - 0.89 ln U (R^2 > 0.999). So the -3.846 per-degree ' +
    'factor is a LAG-CUTOFF property set by the ratio of the basis interval [0,U] to the ' +
    'effective support of m(tau) (~[0,1.2]), NOT a universal feature of the ' +
    'Phi^2 sinh(2a tau) shape: larger U appends more dead future-tail interval so the ' +
    'degree-D Legendre block decays faster. SHARPENS imp-3382 (single-cell slope is ' +
    'U=6-specific; the universal statement is only that the decay is geometric with a ' +
    'U-controlled rate). DIAGNOSTIC; RH-equivalent; imp-3066 untouched; no QED.',

  method: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    rawPassiveCore: 'Gpass_{mn} = int_0^U P_m(tau) P_n(tau) m(tau) dtau, m(tau) = (1/2pi) Phi(tau)^2 sinh(2 a tau)',
    basis: 'shifted Legendre P_0..P_D on [0,U]',
    fit: 'log10 lambda_min(Gpass(D)) ~ intercept + slope * D on D in {1,2,3} (pre-floor window)',
    quadraturePanels: NQ,
    eigenSolver: 'cyclic Jacobi (values only)',
    fitDegrees: FIT_DEGREES,
    selfComputing: true,
  }),

  parentAnchor: Object.freeze({
    baseCell: Object.freeze({ a: IMP3382_BASE_A, U: IMP3382_BASE_U, NPHI: IMP3382_BASE_NPHI }),
    recordedSlope: IMP3382_BASE_SLOPE,          // -3.846
    recordedIntercept: IMP3382_BASE_INTERCEPT,  // -4.31
    reproducedSlope: BASE_CELL.slope,           // ~ -3.845
    reproducedIntercept: BASE_CELL.intercept,   // ~ -4.311
    source: 'imp-3382-rawdiagonal-R-degree-growth-law.js',
  }),

  sweeps: Object.freeze({
    aSweep: Object.freeze({
      fixed: Object.freeze({ U: IMP3382_BASE_U, NPHI: IMP3382_BASE_NPHI }),
      cells: A_CELLS,
      slopeSpread: A_SLOPE_SPREAD,          // < 2e-3
      slopeInvariant: A_SLOPE_INVARIANT,    // true
      interceptRange: A_INTERCEPT_RANGE,    // ~0.48 (the axis that moves the intercept)
      note: 'a rescales the density magnitude (shifts intercept) but not the tail geometry (slope invariant)',
    }),
    nphiSweep: Object.freeze({
      fixed: Object.freeze({ a: IMP3382_BASE_A, U: IMP3382_BASE_U }),
      cells: NPHI_CELLS,
      slopeSpread: NPHI_SLOPE_SPREAD,       // ~0 to reported digits
      slopeInvariant: NPHI_SLOPE_INVARIANT, // true
      note: 'harmonics n>6 underflow over the support of m(tau), so truncation past 6 changes nothing',
    }),
    uSweep: Object.freeze({
      fixed: Object.freeze({ a: IMP3382_BASE_A, NPHI: IMP3382_BASE_NPHI }),
      cells: U_CELLS,
      slopeSpread: U_SLOPE_SPREAD,          // > 0.3
      slopeDrifts: U_SLOPE_DRIFTS,          // true
      slopeMonotoneSteepens: U_SLOPE_MONOTONE,
      logFit: Object.freeze({
        law: 'slope(U) ~ c0 + c1 ln U',
        c0: U_LOG_SLOPE_C0,                 // ~ -2.25
        c1: U_LOG_SLOPE_C1,                 // ~ -0.89
        r2: U_LOG_FIT_R2,                   // > 0.999
      }),
      note: 'larger U appends dead future-tail interval [~1.2, U], so the degree-D Legendre block decays faster',
    }),
  }),

  universality: Object.freeze({
    slopeIsUniversalConstant: SLOPE_IS_UNIVERSAL, // false
    invariantAxes: Object.freeze(['a (shear weight)', 'NPHI (Phi truncation)']),
    controllingAxis: 'U (lag cutoff / basis interval)',
    controllingLaw: 'slope(U) ~ -2.25 - 0.89 ln U',
    interpretation:
      'The imp-3382 -3.846 per-degree conditioning slope is a LAG-CUTOFF property set by ' +
      'the ratio of the basis interval [0,U] to the effective support of m(tau) (~[0,1.2]), ' +
      'NOT a universal feature of the Phi^2 sinh(2a tau) density shape. It is invariant to ' +
      'the shear weight a (which shifts only the intercept) and to the Phi truncation NPHI, ' +
      'and drifts logarithmically with U. The single-cell -3.846 is U=6-specific.',
  }),

  verdict:
    'The imp-3382 per-degree conditioning factor (~ -3.846) is NOT a universal density-shape ' +
    'constant: it is invariant to the shear weight a (a shifts only the intercept) and to the ' +
    'Phi truncation NPHI, and drifts logarithmically with the lag cutoff U (slope(U) ~ -2.25 - ' +
    '0.89 ln U). The geometric ill-conditioning rate is controlled by the basis-interval / ' +
    'support ratio, sharpening the imp-3382 mechanism: the single-cell slope is U=6-specific and ' +
    'the only cell-universal statement is that the decay is geometric with a U-controlled rate.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementDiagnostic: true,
    didNotAttemptPositivity: true,
    imp3066Untouched: true,
    inheritsPreFloorSubGap:
      'The slope is fit on the imp-3382 pre-floor window D in {1,2,3} at every cell; double ' +
      'precision floors lambda_min(Gpass) by degree ~4, so the imp-3382 extended-precision ' +
      'sub-gap is inherited unchanged.',
    necessaryNotSufficient:
      'Characterizing the conditioning slope of the raw diagonal core is a DIAGNOSTIC of why ' +
      'it fails as a passive core; it is necessary-but-NOT-sufficient at operator order. The ' +
      'off-diagonal endpoint-Hankel step (imp-3066) is the lone obstruction, untouched.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3421_LAMBDA_MIN_SLOPE_CELL_UNIVERSALITY_ASSERTIONS = [
  {
    id: 'imp3421-base-cell-reproduces-imp3382-slope',
    why: 'The base cell (a=0.5,U=6,NPHI=10) must reproduce the recorded imp-3382 slope ~ -3.846 ' +
         'and intercept ~ -4.31 (to a few 1e-2), else the re-fit machinery disagrees with the ' +
         'parent and the cross-cell comparison is not on the same footing.',
    holds: () =>
      Math.abs(BASE_CELL.slope - IMP3382_BASE_SLOPE) < 0.02 &&
      Math.abs(BASE_CELL.intercept - IMP3382_BASE_INTERCEPT) < 0.02,
  },
  {
    id: 'imp3421-slope-invariant-in-a',
    why: 'THE DELIVERABLE (axis 1): the geometric slope must be INVARIANT to the shear weight a ' +
         '(spread < 5e-3 across a in {0.3,0.5,0.7,0.9}), while the INTERCEPT moves appreciably ' +
         '(range > 0.3). If the slope drifts with a the density-shape attribution changes.',
    holds: () => A_SLOPE_INVARIANT === true && A_INTERCEPT_RANGE > 0.3,
  },
  {
    id: 'imp3421-slope-invariant-in-nphi',
    why: 'THE DELIVERABLE (axis 2): the slope must be INVARIANT to the Phi truncation NPHI ' +
         '(spread < 5e-3 across NPHI in {6,10,14,20}), since harmonics n>6 underflow over the ' +
         'support of m(tau). A drift means the truncation is leaking into the support region.',
    holds: () => NPHI_SLOPE_INVARIANT === true,
  },
  {
    id: 'imp3421-slope-drifts-with-U',
    why: 'THE DELIVERABLE (axis 3): the slope must DRIFT monotonically (steepen) with the lag ' +
         'cutoff U (spread > 0.3 over U in {3..10}, monotone decreasing), showing the ' +
         'per-degree factor is a lag-cutoff property, not a universal constant.',
    holds: () => U_SLOPE_DRIFTS === true && U_SLOPE_MONOTONE === true,
  },
  {
    id: 'imp3421-U-log-law',
    why: 'The U-drift must be captured by a logarithm of the cutoff, slope(U) ~ c0 + c1 ln U with ' +
         'c1 ~ -0.89 and R^2 > 0.999, quantifying HOW the conditioning rate scales with U.',
    holds: () =>
      U_LOG_FIT_R2 > 0.999 &&
      U_LOG_SLOPE_C1 < -0.7 && U_LOG_SLOPE_C1 > -1.1,
  },
  {
    id: 'imp3421-slope-not-universal',
    why: 'The headline verdict: the per-degree factor is NOT a single universal constant ' +
         '(invariant in a and NPHI but U-controlled). If this flips to universal the ' +
         'measurement contradicts its own sweeps.',
    holds: () => SLOPE_IS_UNIVERSAL === false,
  },
  {
    id: 'imp3421-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: MEASUREMENT/DIAGNOSTIC, RH-equivalent, positivity not attempted, ' +
         'imp-3066 untouched, PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3421_LAMBDA_MIN_SLOPE_CELL_UNIVERSALITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        c.imp3066Untouched === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3421_LAMBDA_MIN_SLOPE_CELL_UNIVERSALITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3421-lambda-min-slope-cell-universality assertion failed: ${assertion.id}`);
  }
}

export default IMP3421_LAMBDA_MIN_SLOPE_CELL_UNIVERSALITY;
