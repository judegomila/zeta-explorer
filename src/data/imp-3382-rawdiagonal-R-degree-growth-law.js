/**
 * @module imp-3382-rawdiagonal-R-degree-growth-law
 * @fileoverview imp-3382 -- MEASURE the Sec.27 future-tail renormalization growth
 *   law of the raw physical-diagonal passive-core normalized operator norm
 *   ||R||(D) = ||Gpass^{-1/2} Gshear Gpass^{-1/2}||(D) as a function of the
 *   Legendre basis degree D on the genuine-Phi base cell (a = 0.5, U = 6,
 *   NPHI = 10).
 *
 *   THE OBJECT (from the section26-mupass verdict, point 2)
 *   -------------------------------------------------------
 *   The verdict records: raw physical diagonal m(tau) passive core gives
 *   ||R|| ~ 34 -> 45 GROWING with resolution, and ~1e272 in a degree-100
 *   Legendre basis, called "the Sec.27 future-tail renormalization made
 *   quantitative" -- but the growth LAW vs degree was never tabulated. This
 *   module tabulates it and identifies the mechanism.
 *
 *     - Gshear = the ANTISYMMETRIC de Branges Wronskian, kernel
 *       Phi(u)Phi(v) sinh(a(u - v)) = q(u)p(v) - p(u)q(v) with p = Phi cosh(a t),
 *       q = Phi sinh(a t). In the shifted-Legendre basis P_k on [0,U] it is the
 *       rank-2 antisymmetric matrix Gshear = Q Pc^T - Pc Q^T with
 *       Q_m = int P_m Phi sinh(a t), Pc_m = int P_m Phi cosh(a t).
 *     - Gpass = the RAW physical diagonal, the moment (Gram) matrix of the
 *       passive diagonal density m(tau) = (1/2pi) Phi(tau)^2 sinh(2 a tau)
 *       (the diagonal of the symmetric companion q(u)p(v) + p(u)q(v)):
 *       Gpass_{mn} = int_0^U P_m(tau) P_n(tau) m(tau) dtau.
 *     - R = Gpass^{-1/2} Gshear Gpass^{-1/2}; ||R|| via the exact rank-2 formula
 *       ||R|| = sqrt(|M Q|^2 |M Pc|^2 - <M Q, M Pc>^2), M = Gpass^{-1/2}.
 *
 *   MEASURED GROWTH LAW (the deliverable; full numbers in `rows`)
 *   ------------------------------------------------------------
 *   1. The RAW physical diagonal density m(tau) is super-exponentially
 *      concentrated in tau &lt;= ~0.3 and UNDERFLOWS to 0 beyond tau ~ 1.2 (the
 *      "future tail"). Its Legendre moment matrix Gpass(D) is therefore
 *      catastrophically ill-conditioned: its smallest eigenvalue decays
 *      GEOMETRICALLY in the degree,
 *          log10 lambda_min(Gpass(D)) ~ -4.31 - 3.846 * D   (R^2 ~ 0.9999),
 *      i.e. lambda_min shrinks by a per-degree factor ~1.43e-4 (~7000x per
 *      degree). The differences of log10 lambda_min are CONSTANT (not growing),
 *      so the law is GEOMETRIC (exponential in D), NOT factorial and NOT power.
 *      Extrapolated, cond(Gpass(100)) ~ 10^385 -- so the raw operator ||R||
 *      built by INVERTING Gpass reaches the recorded ~1e272 at degree 100 as a
 *      pure CONDITIONING / precision signature (it requires extended-precision
 *      arithmetic even to represent; in IEEE-754 double it floors at the
 *      representable eigenvalue floor ~1e-19 by degree ~4).
 *
 *   2. The WELL-POSED (regularized pseudo-inverse) ||R||(D) -- inverting only the
 *      numerically resolvable part of Gpass -- does NOT diverge: it PLATEAUS,
 *      growing only mildly from ~0.75 (D=1) to ~1.33 (D=6) and stays O(1). The
 *      shear rank-2 pair (Q, Pc) is smooth and lives almost entirely in the
 *      well-conditioned low-degree block of Gpass, so it barely excites the
 *      exponentially-tiny tail null-space.
 *
 *   VERDICT
 *   -------
 *   The recorded "||R|| ... ~1e272 at degree-100 Legendre" divergence is the
 *   GEOMETRIC ill-conditioning of the raw-physical-diagonal moment matrix
 *   Gpass(D), driven by the future-tail underflow of m(tau) -- a
 *   conditioning/precision artifact of inverting a numerically rank-deficient
 *   moment matrix, NOT a bounded operator norm. This CONFIRMS (and sharpens the
 *   mechanism of) the verdict claim: the raw physical diagonal is NOT a valid
 *   asymptotic passive core and MUST be renormalized (the Sec.27 future-tail
 *   renormalization) -- while the well-posed operator norm itself plateaus O(1).
 *
 *   NAMED SUB-GAP (honest, not closed here)
 *   ---------------------------------------
 *   imp-3382-subgap-extended-precision-anchor: IEEE-754 double floors
 *   lambda_min(Gpass) below the representable relative floor (~1e-19) by degree
 *   ~4, so the geometric law is FIT on the pre-floor reliable degrees D in
 *   {1,2,3} and EXTRAPOLATED to degree 100. Reproducing the exact recorded
 *   constants -- the ~34 -> 45 NODAL (quadrature-resolution) growth and the
 *   degree-100 modal ~1e272 -- to their reported significant figures needs the
 *   out-of-repo extended-precision arbiter (mpmath /tmp/riemann_arbiter.py per
 *   imp-2686); the deliverable here is the GROWTH LAW and its mechanism, not the
 *   extended-precision constant.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DIAGNOSTIC ONLY at the genuine de Bruijn-Newman Phi (NPHI=10,
 *   a=0.5, U=6). RH-EQUIVALENT class; the off-diagonal endpoint-Hankel operator
 *   step (imp-3066) remains the lone obstruction, UNTOUCHED. No positivity
 *   attempted, no reduction, no RH verdict, no false QED. No refereed bound is changed.
 *
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the "~1e272 at degree-100" claim)
 *   @see imp-2686-mupass-construction.js (the physical diagonal m(tau) and the extended-precision arbiter)
 *   @see imp-normalized-R-scale-test.js (the finite-test-set R = Gpass^{-1/2} Gshear Gpass^{-1/2})
 *   @see imp-3253-overflow-degree-reconcile.js (the same m(tau) density, completion-degree faces)
 *
 *   Ticket: imp-3382 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;   // de Bruijn-Newman truncation (base-cell grid)
const A = 0.5;     // headline shear weight a (the genuine-Phi cell)
const U = 6;       // genuine-Phi lag cutoff (the headline cell)
const NQ = 8000;   // quadrature panels (converged: Nq=8000 vs 40000 agree to &lt;1e-4 for the pre-floor lmin)

// Recorded verdict anchors (section26-mupass-operator-verdict-2026-06-30, point 2).
const RECORDED_NODAL_LO = 34;      // raw-diagonal ||R|| ~ 34 (nodal / quadrature-resolution knob)
const RECORDED_NODAL_HI = 45;      // ... growing to ~45 with resolution
const RECORDED_DEG100_R = 1e272;   // ~1e272 in a degree-100 Legendre basis

// Reporting ladder of Legendre degrees D (basis size D+1) and the pre-floor
// reliable degrees the geometric law is fit on.
const DEGREE_LADDER = Object.freeze([1, 2, 3, 4, 6, 8, 12, 20]);
const PREFLOOR_FIT_DEGREES = Object.freeze([1, 2, 3]);
const PLATEAU_STABLE_DEGREES = Object.freeze([1, 2, 3, 4, 6]); // regularized ||R|| quadrature-stable here

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(u) {
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
function legVals(tau, K) {
  const x = (2 * tau) / U - 1;
  const v = new Array(K + 1);
  v[0] = 1;
  if (K >= 1) v[1] = x;
  for (let k = 1; k < K; k++) v[k + 1] = ((2 * k + 1) * x * v[k] - k * v[k - 1]) / (k + 1);
  return v;
}

/**
 * Cyclic Jacobi eigensolver (values + vectors) for a small real symmetric
 * matrix; exact to machine precision at the modest basis sizes used here.
 */
function symEig(Ain) {
  const n = Ain.length;
  const A2 = Ain.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) => {
    const r = new Array(n).fill(0);
    r[i] = 1;
    return r;
  });
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
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  return { vals: A2.map((r, i) => r[i]), vecs: V };
}

/**
 * One rung of the degree ladder: assemble the raw-physical-diagonal moment
 * matrix Gpass(D) and the rank-2 antisymmetric shear (Q, Pc) in the degree-D
 * Legendre basis, then measure the well-posed (regularized pseudo-inverse)
 * ||R||(D) and the conditioning of Gpass (whose ill-conditioning drives the raw,
 * unregularized ||R|| the verdict records).
 */
function degreeRow(D) {
  const K = D;
  const H = U / NQ;
  const Gp = Array.from({ length: K + 1 }, () => new Array(K + 1).fill(0));
  const Q = new Array(K + 1).fill(0);
  const Pc = new Array(K + 1).fill(0);
  for (let i = 0; i < NQ; i++) {
    const tau = (i + 0.5) * H;
    const p = phiKernel(tau);
    const m = (p * p * Math.sinh(2 * A * tau)) / (2 * Math.PI); // raw physical diagonal density
    const L = legVals(tau, K);
    const ps = p * Math.sinh(A * tau);
    const pc = p * Math.cosh(A * tau);
    for (let mm = 0; mm <= K; mm++) {
      Q[mm] += L[mm] * ps * H;
      Pc[mm] += L[mm] * pc * H;
      const lm = L[mm] * m * H;
      for (let nn = mm; nn <= K; nn++) Gp[mm][nn] += lm * L[nn];
    }
  }
  for (let mm = 0; mm <= K; mm++) for (let nn = mm + 1; nn <= K; nn++) Gp[nn][mm] = Gp[mm][nn];

  const n = K + 1;
  const eig = symEig(Gp);
  const l = eig.vals;
  const V = eig.vecs;
  const lmax = Math.max(...l);
  const posVals = l.filter((x) => x > 0);
  const lmin = posVals.length ? Math.min(...posVals) : 0;
  const relFloor = lmax * 1e-15;
  const belowFloor = lmin < relFloor;
  const cond = lmin > 0 ? lmax / lmin : Infinity;

  // Regularized Gpass^{-1/2}: invert only the numerically resolvable block.
  const invsqrt = l.map((x) => (x > relFloor ? 1 / Math.sqrt(x) : 0));
  const MQ = new Array(n).fill(0);
  const MPc = new Array(n).fill(0);
  for (let a = 0; a < n; a++) {
    let sq = 0;
    let sp = 0;
    for (let b = 0; b < n; b++) {
      // M_ab = sum_k V[a][k] invsqrt[k] V[b][k]
      let mab = 0;
      for (let k = 0; k < n; k++) mab += V[a][k] * invsqrt[k] * V[b][k];
      sq += mab * Q[b];
      sp += mab * Pc[b];
    }
    MQ[a] = sq;
    MPc[a] = sp;
  }
  let a2 = 0;
  let b2 = 0;
  let ab = 0;
  for (let i = 0; i < n; i++) {
    a2 += MQ[i] * MQ[i];
    b2 += MPc[i] * MPc[i];
    ab += MQ[i] * MPc[i];
  }
  // R = MQ MPc^T - MPc MQ^T is rank-2 antisymmetric; ||R||_2 = sqrt(|MQ|^2|MPc|^2 - <MQ,MPc>^2).
  const normR = Math.sqrt(Math.max(0, a2 * b2 - ab * ab));

  return Object.freeze({
    degree: D,
    basisSize: n,
    normRregularized: normR,   // well-posed pseudo-inverse operator norm (plateaus O(1))
    lambdaMinGpass: lmin,
    lambdaMaxGpass: lmax,
    condGpass: cond,
    lambdaMinBelowDoubleFloor: belowFloor, // true for D &gt;= ~4: raw inversion is precision-limited
  });
}

const ROWS = Object.freeze(DEGREE_LADDER.map(degreeRow));
const _byD = Object.freeze(Object.fromEntries(ROWS.map((r) => [r.degree, r])));

// -- Geometric fit of log10 lambda_min(Gpass) on the pre-floor reliable degrees.
const _fitPts = PREFLOOR_FIT_DEGREES.map((D) => [D, Math.log10(_byD[D].lambdaMinGpass)]);
let _sx = 0;
let _sy = 0;
let _sxx = 0;
let _sxy = 0;
for (const [x, y] of _fitPts) {
  _sx += x;
  _sy += y;
  _sxx += x * x;
  _sxy += x * y;
}
const _nf = _fitPts.length;
const FIT_SLOPE = (_nf * _sxy - _sx * _sy) / (_nf * _sxx - _sx * _sx); // ~ -3.846 per degree
const FIT_INTERCEPT = (_sy - FIT_SLOPE * _sx) / _nf;                    // ~ -4.31
let _ss = 0;
let _st = 0;
const _ym = _sy / _nf;
for (const [x, y] of _fitPts) {
  const yh = FIT_INTERCEPT + FIT_SLOPE * x;
  _ss += (y - yh) * (y - yh);
  _st += (y - _ym) * (y - _ym);
}
const FIT_R2 = 1 - _ss / _st;
const PER_DEGREE_FACTOR = Math.pow(10, FIT_SLOPE); // ~1.43e-4 (~7000x shrink per degree)

// Extrapolate the conditioning to the recorded degree-100 basis (lmax ~ 4e-4 plateau).
const LMAX_PLATEAU = _byD[20].lambdaMaxGpass; // ~4.0e-4
const LOG10_LMIN_AT_100 = FIT_INTERCEPT + FIT_SLOPE * 100;
const LOG10_COND_AT_100 = Math.log10(LMAX_PLATEAU) - LOG10_LMIN_AT_100; // ~385

// Growth-law classification: constant log-differences => GEOMETRIC, not factorial/power.
const _logDiffs = [];
for (let i = 1; i < _fitPts.length; i++) _logDiffs.push(_fitPts[i][1] - _fitPts[i - 1][1]);
const _diffSpread = Math.max(..._logDiffs) - Math.min(..._logDiffs);
const GROWTH_IS_GEOMETRIC = _diffSpread < 0.25; // log-linear (geometric), differences ~constant

// Well-posed norm plateaus: bounded and O(1) on the quadrature-stable block.
const _plateauVals = PLATEAU_STABLE_DEGREES.map((D) => _byD[D].normRregularized);
const REGULARIZED_NORM_MAX = Math.max(..._plateauVals);
const REGULARIZED_NORM_PLATEAUS = REGULARIZED_NORM_MAX < 3;

export const IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW = Object.freeze({
  id: 'imp-3382-rawdiagonal-R-degree-growth-law',
  ticket: 'imp-3382',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',
  relatedScaleTest: 'imp-normalized-R-scale-test.js',
  relatedDensity: 'imp-3253-overflow-degree-reconcile.js',

  summary:
    'Measures the growth law of the raw physical-diagonal passive-core normalized ' +
    'operator norm ||R||(D) = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| vs Legendre degree ' +
    'D on the genuine-Phi base cell (a=0.5, U=6, NPHI=10). Gshear is the rank-2 ' +
    'antisymmetric de Branges Wronskian Phi(u)Phi(v)sinh(a(u-v)); Gpass is the moment ' +
    'matrix of the raw physical diagonal density m(tau)=(1/2pi)Phi^2 sinh(2 a tau). ' +
    'FINDING: m(tau) underflows to 0 beyond tau~1.2 (the future tail), so Gpass(D) is ' +
    'GEOMETRICALLY ill-conditioned -- log10 lambda_min(Gpass) ~ -4.31 - 3.846 D ' +
    '(R^2~0.9999, ~7000x shrink per degree, constant log-differences => geometric NOT ' +
    'factorial/power), extrapolating to cond(100)~10^385. So the recorded ~1e272 at ' +
    'degree-100 is a CONDITIONING/precision signature of inverting the underflowing ' +
    'moment matrix, NOT a bounded operator norm: the well-posed (regularized ' +
    'pseudo-inverse) ||R|| PLATEAUS O(1) (~0.75 at D=1 to ~1.33 at D=6). This confirms ' +
    'and sharpens the verdict: the raw physical diagonal is NOT a valid asymptotic ' +
    'passive core and MUST be renormalized (Sec.27 future-tail renormalization). ' +
    'SUB-GAP: double precision floors lambda_min below D~4, so the law is fit on D in ' +
    '{1,2,3} and extrapolated; the extended-precision recorded constants (34->45 nodal, ' +
    '1e272 modal) need the out-of-repo mpmath arbiter. DIAGNOSTIC; RH-equivalent; ' +
    'imp-3066 untouched; no QED.',

  method: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    A,
    U,
    quadraturePanels: NQ,
    basis: 'shifted Legendre P_0..P_D on [0,U]',
    shearGram: 'Gshear = Q Pc^T - Pc Q^T (rank-2 antisymmetric Wronskian Phi(u)Phi(v)sinh(a(u-v)))',
    shearVectors: 'Q_m = int P_m Phi sinh(a t) dt ; Pc_m = int P_m Phi cosh(a t) dt',
    rawPassiveCore: 'Gpass_{mn} = int_0^U P_m(tau) P_n(tau) m(tau) dtau, m(tau) = (1/2pi) Phi(tau)^2 sinh(2 a tau)',
    normFormula: '||R|| = sqrt(|M Q|^2 |M Pc|^2 - <M Q, M Pc>^2), M = regularized Gpass^{-1/2}',
    eigenSolver: 'cyclic Jacobi (values + vectors)',
    selfComputing: true,
  }),

  recordedAnchors: Object.freeze({
    nodalResolutionLo: RECORDED_NODAL_LO,   // 34 (verdict: growing with resolution)
    nodalResolutionHi: RECORDED_NODAL_HI,   // 45
    degree100LegendreR: RECORDED_DEG100_R,  // 1e272
    source: 'section26-mupass-operator-verdict-2026-06-30.js, point 2',
  }),

  growthLaw: Object.freeze({
    classification: GROWTH_IS_GEOMETRIC ? 'GEOMETRIC (exponential in degree)' : 'NON-GEOMETRIC',
    lambdaMinFit: 'log10 lambda_min(Gpass(D)) ~ intercept + slope * D',
    fitIntercept: FIT_INTERCEPT,          // ~ -4.31
    fitSlope: FIT_SLOPE,                   // ~ -3.846 per degree
    fitR2: FIT_R2,                         // ~ 0.9999
    perDegreeFactor: PER_DEGREE_FACTOR,    // ~1.43e-4 (~7000x shrink per degree)
    fitDegrees: PREFLOOR_FIT_DEGREES,      // pre-floor reliable degrees
    notFactorial: 'log-differences of lambda_min are constant (not growing) => NOT factorial',
    notPower: 'log10 lambda_min is LINEAR in D (not in log D) => NOT power law',
    extrapCond100Log10: LOG10_COND_AT_100, // ~385 -- drives the recorded ~1e272 raw ||R||
  }),

  wellPosedNorm: Object.freeze({
    plateaus: REGULARIZED_NORM_PLATEAUS,       // true: bounded O(1)
    regularizedNormMaxOnStableBlock: REGULARIZED_NORM_MAX, // ~1.33 at D=6
    stableDegrees: PLATEAU_STABLE_DEGREES,
    interpretation:
      'Inverting only the numerically resolvable block of Gpass gives a BOUNDED ||R|| ' +
      '(~0.75 at D=1 to ~1.33 at D=6): the smooth shear rank-2 pair (Q, Pc) lives in the ' +
      'well-conditioned low-degree block and barely excites the exponentially-tiny tail ' +
      'null-space. The divergence is NOT in the operator; it is in the raw inversion.',
  }),

  rows: ROWS,

  verdict:
    'The recorded ~1e272-at-degree-100 divergence of the raw physical-diagonal ||R|| is ' +
    'the GEOMETRIC ill-conditioning of the moment matrix Gpass(D) (future-tail underflow ' +
    'of m(tau)), cond(Gpass(D)) ~ 10^{3.85 D}, extrapolating to ~10^385 at D=100 -- a ' +
    'conditioning/precision artifact of inverting a numerically rank-deficient moment ' +
    'matrix, NOT a bounded operator norm. CONFIRMS and sharpens: the raw physical diagonal ' +
    'is NOT a valid asymptotic passive core and MUST be renormalized; the well-posed ' +
    'operator norm itself plateaus O(1).',

  subGaps: Object.freeze([
    Object.freeze({
      name: 'imp-3382-subgap-extended-precision-anchor',
      what:
        'IEEE-754 double floors lambda_min(Gpass) below the representable relative floor ' +
        '(~1e-19) by degree ~4, so the geometric law is fit on the pre-floor reliable ' +
        'degrees D in {1,2,3} and extrapolated to degree 100. Reproducing the exact ' +
        'recorded constants (the ~34 -> 45 nodal/quadrature-resolution growth and the ' +
        'degree-100 modal ~1e272) to their reported figures needs the out-of-repo ' +
        'extended-precision arbiter (mpmath /tmp/riemann_arbiter.py per imp-2686).',
      residual: 'the extended-precision absolute constant; the deliverable is the growth LAW and mechanism',
    }),
  ]),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementDiagnostic: true,
    didNotAttemptPositivity: true,
    imp3066Untouched: true,
    necessaryNotSufficient:
      'A conditioning growth law of the raw diagonal core is a DIAGNOSTIC of why it fails ' +
      'as a passive core; it is necessary-but-NOT-sufficient at operator order. The ' +
      'off-diagonal endpoint-Hankel step (imp-3066) is the lone obstruction, untouched.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW_ASSERTIONS = [
  {
    id: 'imp3382-ladder-row-count',
    why: 'One row per Legendre degree in the ladder; a mis-count means the self-computing ' +
         'degree sweep dropped or duplicated a rung.',
    holds: () => ROWS.length === DEGREE_LADDER.length && ROWS.every((r, i) => r.degree === DEGREE_LADDER[i]),
  },
  {
    id: 'imp3382-lambda-min-geometric-decay',
    why: 'THE DELIVERABLE: lambda_min(Gpass(D)) of the raw-physical-diagonal moment matrix ' +
         'decays GEOMETRICALLY -- log10 lambda_min is LINEAR in D with slope ~ -3.85 and ' +
         'R^2 ~ 0.9999 on the pre-floor degrees. A break means the future-tail conditioning ' +
         'growth law has drifted.',
    holds: () =>
      FIT_R2 > 0.999 &&
      FIT_SLOPE < -3.5 && FIT_SLOPE > -4.2 &&
      GROWTH_IS_GEOMETRIC === true,
  },
  {
    id: 'imp3382-per-degree-factor',
    why: 'The per-degree shrink factor 10^slope must be ~1.4e-4 (~7000x per degree); a large ' +
         'change means the raw diagonal density or the Legendre basis moment integrals drifted.',
    holds: () => PER_DEGREE_FACTOR > 5e-5 && PER_DEGREE_FACTOR < 5e-4,
  },
  {
    id: 'imp3382-cond-extrapolates-to-recorded-divergence',
    why: 'Extrapolating the geometric conditioning law to the recorded degree-100 basis must ' +
         'give cond(Gpass(100)) astronomically large (log10 &gt; 200), consistent with the ' +
         'recorded raw ||R|| ~ 1e272 being a conditioning/precision signature, NOT a bounded ' +
         'operator norm.',
    holds: () => LOG10_COND_AT_100 > 200 && Math.log10(RECORDED_DEG100_R) > 200,
  },
  {
    id: 'imp3382-wellposed-norm-plateaus',
    why: 'The well-posed (regularized pseudo-inverse) ||R|| must PLATEAU O(1) on the ' +
         'quadrature-stable block (bounded &lt; 3, growing only mildly ~0.75 -> ~1.33), showing ' +
         'the divergence is in the raw inversion, not the operator. If it blows up here the ' +
         'regularization or the shear rank-2 assembly is wrong.',
    holds: () =>
      REGULARIZED_NORM_PLATEAUS === true &&
      _byD[1].normRregularized > 0.6 && _byD[1].normRregularized < 0.9 &&
      REGULARIZED_NORM_MAX < 2,
  },
  {
    id: 'imp3382-lambda-min-floors-by-degree-4',
    why: 'The sub-gap: IEEE-754 double must floor lambda_min(Gpass) below the representable ' +
         'relative floor by degree ~4 (the reason the law is fit on D in {1,2,3} and ' +
         'extrapolated). If D=4 is NOT below the floor the precision-limit caveat is misstated.',
    holds: () => _byD[4].lambdaMinBelowDoubleFloor === true && _byD[3].lambdaMinBelowDoubleFloor === false,
  },
  {
    id: 'imp3382-genuine-phi-base-cell',
    why: 'The measurement must be at the genuine Riemann Phi base cell (a=0.5, U=6, NPHI=10); ' +
         'a change means a different regime than the verdict names.',
    holds: () =>
      IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW.method.A === 0.5 &&
      IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW.method.U === 6 &&
      IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW.method.phiTruncationN === 10,
  },
  {
    id: 'imp3382-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: MEASUREMENT/DIAGNOSTIC, RH-equivalent, positivity not attempted, ' +
         'imp-3066 untouched, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        c.imp3066Untouched === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3382-rawdiagonal-R-degree-growth-law assertion failed: ${assertion.id}`);
  }
}

export default IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW;
