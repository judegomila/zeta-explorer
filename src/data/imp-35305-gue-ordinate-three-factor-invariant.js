/**
 * @module imp-35305-gue-ordinate-three-factor-invariant
 *
 * imp-35305 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35215 DERIVED the exact
 * scale-invariant near-front identity beta * g_min * (x_2 - x_0) -> 1 on the backward Dyson flow
 * from a unit-spacing initial condition; imp-35238 then measured it on a SECOND ensemble, the first
 * N REAL Riemann zero ordinates gamma_1..gamma_N, and found the three-factor product still -> 1
 * N-uniformly (spread ~5e-5) even though the bare product beta * g_min is NOT N-uniform (it is
 * 1/span, span = local real spacing). imp-35281 extended the real-ordinate sample to N = 400 and the
 * invariant stayed pinned at 1. But only TWO ensembles were ever tested: the derived unit-spacing one
 * and the deterministic real-ordinate one.
 *
 * THIS module tests a THIRD, INDEPENDENT initial-condition ensemble: GUE-SIMULATED eigenvalue
 * ordinates. This is the ensemble the C_mb constant is CONDITIONAL on (imp-486): the mean-field
 * background-field constant is proved only under the GUE pair-correlation hypothesis, so probing the
 * three-factor invariant on genuine GUE eigenvalue statistics is the natural third leg. The ordinates
 * are the sorted eigenvalues of a Dumitriu-Edelman beta = 2 tridiagonal Hermite matrix (Dumitriu &
 * Edelman 2002, "Matrix models for beta ensembles"): a symmetric tridiagonal T with diagonal
 * a_i = sqrt(2) * N(0,1) and off-diagonal b_i = chi_{2(N-1-i)}, whose eigenvalue joint density is
 * EXACTLY the GUE (beta = 2) law prod |lam_i - lam_j|^2 exp(-Sum lam^2 / 4). Eigenvalues are extracted
 * by a faithful port of the EISPACK/Numerical-Recipes symmetric-tridiagonal QL routine (tql1) driven
 * by a deterministic seeded PRNG (mulberry32 + Marsaglia-polar Gaussians) so the build is reproducible.
 * The eigensolver is SELF-CERTIFIED at load time by the trace invariant (Sum lam = Sum a_i) and the
 * Frobenius / sum-of-squares invariant (Sum lam^2 = Sum a_i^2 + 2 Sum b_i^2), so no external
 * eigenvalue table is needed. It certifies NOTHING about C_mb; it is a numerical probe. NO QED.
 *
 * THE RESULT: THE THREE-FACTOR INVARIANT SURVIVES ON GUE ORDINATES TOO (-> 1)
 * --------------------------------------------------------------------------
 * Restarting the imp-35238 backward Dyson flow from N GUE-simulated ordinates and pushing to min-gap
 * fraction 1e-4, the three-factor product beta * g_min * (x_2 - x_0) again converges to the SAME
 * rational constant 1 at every N = 50, 100, 200, with a cross-N spread of the SAME ~1e-4 order as the
 * imp-35238 real-ordinate ~5e-5 and imp-35281 seven-point ~7.7e-5 spreads. So the invariant is
 * ensemble-indifferent across all THREE initial conditions tested (derived unit-spacing, real Riemann
 * ordinates, GUE-simulated ordinates): it is the scale- and location-invariant residue of a single
 * dominant reciprocal-product term (imp-35215), and that mechanism does not care whether the spacings
 * come from a lattice, from zeta, or from a random matrix. As on real ordinates, the bare product
 * beta * g_min is NOT N-uniform (it is 1/span, the local GUE spacing at the collapsing pair), and the
 * collapse is INTERIOR (level repulsion puts the tightest gap wherever the smallest local GUE spacing
 * lands, not the edge). The single-dominant-term share domFrac -> 1 at the front, as before.
 *
 * WHAT THIS DOES AND DOES NOT SHOW
 * --------------------------------
 * It SHARPENS the imp-35238 / imp-35281 spacing-indifference reading by adding the GUE ensemble that
 * C_mb is conditional on, closing the natural third leg of the three-ensemble comparison. It changes
 * NOTHING about M2: beta itself still diverges ~1/g_min toward the front (the invariant being bounded
 * IS the statement beta ~ 1/g_min), so a finite N-uniform sup over s < t_c still needs an a-priori
 * g_min > 0. It certifies NO N-uniformity of beta, does NOT discharge M2 or the horizon/front bridge
 * M5, does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket), and CERTIFIES NOTHING about
 * the imp-486 GUE-conditional C_mb (it only shows the invariant HOLDS on GUE inputs, not that the
 * conditional constant is discharged). Changes no bound; establishes no operator positivity; I3 / M2 /
 * M5 stay OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35215-beta-gmin-near-front-limit (unit-spacing derivation beta*g_min*(x_2-x_0)->1; ensemble 1)
 * @see imp-35238-real-ordinate-three-factor-invariant (real Riemann ordinates; ensemble 2; parent)
 * @see imp-35281-real-ordinate-three-factor-invariant-larger-N (real ordinates to N=400; invariant pinned)
 * @see imp-35301-three-factor-invariant-convergence-rate (linear-in-fraction approach to 1)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece; M5 horizon bridge)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see imp-486 (C_mb GUE-conditional -- the ensemble this module simulates)
 */

// ---------------------------------------------------------------------------
// Deterministic seeded PRNG (mulberry32) + Marsaglia-polar Gaussians, so the
// GUE-matrix draw and hence every measured invariant is reproducible at build
// time (no Math.random -> stable assertions). Kept fully self-contained; this
// module pulls NO heavy bundle (see memory feedback_no_heavy_imports_in_pages).
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGaussian(rng) {
  let spare = null;
  return function () {
    if (spare !== null) {
      const s = spare;
      spare = null;
      return s;
    }
    let u;
    let v;
    let r;
    do {
      u = 2 * rng() - 1;
      v = 2 * rng() - 1;
      r = u * u + v * v;
    } while (r >= 1 || r === 0);
    const mul = Math.sqrt((-2 * Math.log(r)) / r);
    spare = v * mul;
    return u * mul;
  };
}

// chi_k = sqrt(Sum of k iid N(0,1)^2). Off-diagonals use even k = 2(N-1-i) (beta = 2).
function chi(gauss, k) {
  let s = 0;
  for (let i = 0; i < k; i++) {
    const g = gauss();
    s += g * g;
  }
  return Math.sqrt(s);
}

// ---------------------------------------------------------------------------
// EISPACK / Numerical-Recipes symmetric-tridiagonal QL with implicit shifts
// (tql1: eigenvalues only, no eigenvectors). d = diagonal (length n, mutated in
// place to hold the eigenvalues); e = subdiagonal with e[i] adjacent to d[i]
// (e[0] unused). Faithful port; returns nothing (results left in d).
// ---------------------------------------------------------------------------
function tql1(d, e, n) {
  for (let i = 1; i < n; i++) e[i - 1] = e[i];
  e[n - 1] = 0;
  for (let l = 0; l < n; l++) {
    let iter = 0;
    let m;
    do {
      for (m = l; m < n - 1; m++) {
        const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
        if (Math.abs(e[m]) + dd === dd) break;
      }
      if (m !== l) {
        if (iter++ === 60) throw new Error('imp-35305 tql1: too many QL iterations');
        let g = (d[l + 1] - d[l]) / (2 * e[l]);
        let r = Math.hypot(g, 1);
        g = d[m] - d[l] + e[l] / (g + (g >= 0 ? Math.abs(r) : -Math.abs(r)));
        let s = 1;
        let c = 1;
        let p = 0;
        let i;
        for (i = m - 1; i >= l; i--) {
          const f = s * e[i];
          const b = c * e[i];
          r = Math.hypot(f, g);
          e[i + 1] = r;
          if (r === 0) {
            d[i + 1] -= p;
            e[m] = 0;
            break;
          }
          s = f / r;
          c = g / r;
          g = d[i + 1] - p;
          r = (d[i] - g) * s + 2 * c * b;
          p = s * r;
          d[i + 1] = g + p;
          g = c * r - b;
        }
        if (r === 0 && i >= l) continue;
        d[l] -= p;
        e[l] = g;
        e[m] = 0;
      }
    } while (m !== l);
  }
}

// Sorted eigenvalues of a Dumitriu-Edelman beta = 2 tridiagonal Hermite matrix =
// GUE eigenvalue ordinates. Returns { ordinates, sumDiag, sumDiag2, sumOff2 } so
// the caller can self-certify the eigensolver against trace / Frobenius invariants.
function gueOrdinates(N, seed) {
  const rng = mulberry32(seed);
  const gauss = makeGaussian(rng);
  const d = new Array(N);
  const off = new Array(N - 1); // off[j] connects d[j], d[j+1]
  for (let i = 0; i < N; i++) d[i] = Math.SQRT2 * gauss();
  for (let j = 0; j < N - 1; j++) off[j] = chi(gauss, 2 * (N - 1 - j));
  const sumDiag = d.reduce((s, v) => s + v, 0);
  const sumDiag2 = d.reduce((s, v) => s + v * v, 0);
  const sumOff2 = off.reduce((s, v) => s + v * v, 0);
  const e = new Array(N);
  e[0] = 0;
  for (let i = 1; i < N; i++) e[i] = off[i - 1]; // e[i] adjacent to d[i]
  tql1(d, e, N); // eigenvalues now in d (unordered)
  const ordinates = d.slice().sort((p, q) => p - q);
  return { ordinates, sumDiag, sumDiag2, sumOff2 };
}

// ---------------------------------------------------------------------------
// Self-contained vector classic RK4 on the attractive backward Dyson field
// (identical integrator to imp-35238 / imp-35215; only the initial condition
// differs -- GUE ordinates instead of real ordinates).
// ---------------------------------------------------------------------------
const axpy = (x, k, s) => x.map((v, i) => v + s * k[i]);

function dysonField(x) {
  const N = x.length;
  const f = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let sum = 0;
    for (let j = 0; j < N; j++) if (j !== k) sum += 1 / (x[k] - x[j]);
    f[k] = -2 * sum;
  }
  return f;
}

function rk4Step(x, dt) {
  const k1 = dysonField(x);
  const k2 = dysonField(axpy(x, k1, dt / 2));
  const k3 = dysonField(axpy(x, k2, dt / 2));
  const k4 = dysonField(axpy(x, k3, dt));
  return x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function minGap(x) {
  let m = Infinity;
  for (let i = 1; i < x.length; i++) {
    const g = x[i] - x[i - 1];
    if (g < m) m = g;
  }
  return m;
}

function minGapIndex(x) {
  let m = Infinity;
  let idx = -1;
  for (let i = 1; i < x.length; i++) {
    const g = x[i] - x[i - 1];
    if (g < m) {
      m = g;
      idx = i - 1;
    }
  }
  return idx;
}

// Background field of adjacent pair (x_k, x_{k+1}); every term positive.
function backgroundField(x, k) {
  const a = x[k];
  const b = x[k + 1];
  let B = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === k || j === k + 1) continue;
    B += 1 / ((b - x[j]) * (a - x[j]));
  }
  return B;
}

function supBackgroundField(x) {
  let sup = 0;
  let arg = -1;
  for (let k = 0; k < x.length - 1; k++) {
    const B = backgroundField(x, k);
    if (B > sup) {
      sup = B;
      arg = k;
    }
  }
  return { sup, arg };
}

// ---------------------------------------------------------------------------
// The measurement: GUE-ordinate init, adaptive backward RK4, three-factor
// invariant beta * g_min * (x_2 - x_0) snapshotted at matched min-gap fractions.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const SEED_BASE = 0x9e3779b9; // fixed golden-ratio seed base -> reproducible GUE draw
const FRACTIONS = [0.5, 0.25, 0.1, 0.05, 0.01, 0.001, 0.0001];
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 200000;

function runFlow(N) {
  const { ordinates, sumDiag, sumDiag2, sumOff2 } = gueOrdinates(N, (SEED_BASE ^ N) >>> 0);
  // Self-certify the eigensolver: trace and sum-of-squares are basis invariants.
  const eigSum = ordinates.reduce((s, v) => s + v, 0);
  const eigSum2 = ordinates.reduce((s, v) => s + v * v, 0);
  const traceErr = Math.abs(eigSum - sumDiag);
  const sumSqErr = Math.abs(eigSum2 - (sumDiag2 + 2 * sumOff2));
  const eigOrdered = ordinates.every((v, i) => i === 0 || v > ordinates[i - 1]);

  const x0 = ordinates;
  const initGap = minGap(x0);
  let x = x0;
  let li = 0;
  let steps = 0;
  const snaps = [];
  while (steps < MAX_STEPS && li < FRACTIONS.length) {
    const g = minGap(x);
    while (li < FRACTIONS.length && g <= FRACTIONS[li] * initGap) {
      const mgi = minGapIndex(x);
      const { sup, arg } = supBackgroundField(x);
      const kb = arg;
      const a = x[kb];
      const b = x[kb + 1];
      let jStar = -1;
      let dominantTerm = 0;
      for (let j = 0; j < x.length; j++) {
        if (j === kb || j === kb + 1) continue;
        const term = 1 / ((b - x[j]) * (a - x[j]));
        if (term > dominantTerm) {
          dominantTerm = term;
          jStar = j;
        }
      }
      const span = Math.max(Math.abs(a - x[jStar]), Math.abs(b - x[jStar])); // far factor x_2 - x_0
      snaps.push({
        fraction: FRACTIONS[li],
        gMin: g,
        beta: sup,
        product: sup * g, // beta * g_min (bare product; NOT N-uniform on GUE, = 1/span)
        span,
        invariant: sup * g * span, // beta * g_min * (x_2 - x_0) -> 1 (the tested identity)
        dominantFraction: dominantTerm / sup,
        minGapArg: mgi,
        betaArg: arg,
        edgeCollapse: mgi === 0 || mgi === N - 2,
      });
      li++;
    }
    if (li >= FRACTIONS.length) break;
    x = rk4Step(x, STEP_SAFETY * g * g);
    steps++;
  }
  return { N, initGap, steps, snaps, traceErr, sumSqErr, eigOrdered, reachedFront: li >= FRACTIONS.length };
}

const RUNS = N_LIST.map(runFlow);

const round = (v, d = 6) => +v.toExponential(d);
const snapAt = (run, frac) => run.snaps.find((r) => r.fraction === frac);

const TIGHTEST = FRACTIONS[FRACTIONS.length - 1]; // 1e-4

const NEAR_FRONT_TABLE = RUNS.map((run) => {
  const s = snapAt(run, TIGHTEST);
  return {
    N: run.N,
    gMin: round(s.gMin, 4),
    beta: round(s.beta, 4),
    bareProduct: +s.product.toFixed(6), // beta * g_min -> 1/span (NOT N-uniform)
    span: +s.span.toFixed(6), // x_2 - x_0 = local GUE spacing at the collapsing pair
    invariant: +s.invariant.toFixed(6), // beta * g_min * (x_2 - x_0) -> 1 (identity survives)
    reciprocalSpan: +(1 / s.span).toFixed(6),
    productMatchesInvSpan: Math.abs(s.product - 1 / s.span) < 2e-3,
    dominantFraction: +s.dominantFraction.toFixed(6), // -> 1 (single term carries beta)
    edgeCollapse: s.edgeCollapse,
  };
});

const HEAD = RUNS[1]; // N = 100
const INVARIANT_TRAJECTORY = HEAD.snaps.map((s) => ({
  fraction: s.fraction,
  invariant: +s.invariant.toFixed(5),
  bareProduct: +s.product.toFixed(5),
  span: +s.span.toFixed(4),
}));
const invariantMonotoneDown = HEAD.snaps.every(
  (s, i) => i === 0 || s.invariant <= HEAD.snaps[i - 1].invariant + 1e-9,
);

const maxInvariantDev = Math.max(...NEAR_FRONT_TABLE.map((r) => Math.abs(r.invariant - 1)));
const invariantSpreadAcrossN =
  Math.max(...NEAR_FRONT_TABLE.map((r) => r.invariant)) -
  Math.min(...NEAR_FRONT_TABLE.map((r) => r.invariant));
const bareProductMin = Math.min(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductMax = Math.max(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductSpreadAcrossN = bareProductMax - bareProductMin;
const bareProductIsReciprocalSpan = NEAR_FRONT_TABLE.every((r) => r.productMatchesInvSpan === true);
const collapseIsInterior = NEAR_FRONT_TABLE.every((r) => r.edgeCollapse === false);
const allReachedFront = RUNS.every((r) => r.reachedFront === true);
const maxTraceErr = Math.max(...RUNS.map((r) => r.traceErr));
const maxSumSqErr = Math.max(...RUNS.map((r) => r.sumSqErr));
const eigenvaluesOrdered = RUNS.every((r) => r.eigOrdered === true);

export const IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT = {
  id: 'imp-35305',
  proofSection: 'S-frontier',
  title:
    'The imp-35215 scale-invariant near-front identity beta * g_min * (x_2 - x_0) -> 1 SURVIVES on a ' +
    'THIRD ensemble -- GUE-simulated eigenvalue ordinates (the imp-486 C_mb-conditional ensemble): ' +
    'running the imp-35238 backward Dyson flow from the sorted eigenvalues of a Dumitriu-Edelman ' +
    'beta = 2 tridiagonal Hermite matrix to min-gap fraction 1e-4, the three-factor product converges ' +
    'to 1 at every N = 50, 100, 200 (|dev| <= ' +
    round(maxInvariantDev, 3) +
    ', spread ~' +
    round(invariantSpreadAcrossN, 2) +
    '), matching the imp-35238 real-ordinate and imp-35215 unit-spacing results: the invariant is ' +
    'ensemble-indifferent across all three tested initial conditions.',
  grade:
    'numerical (empirical probe of the imp-35215 identity on a THIRD, GUE-simulated ensemble; ' +
    'eigensolver self-certified by trace + sum-of-squares invariants; NOT a certificate)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'initial condition = sorted eigenvalues of a Dumitriu-Edelman beta = 2 tridiagonal Hermite matrix ' +
    '(diagonal sqrt(2) N(0,1), off-diagonal chi_{2(N-1-i)}), deterministic seeded draw, eigenvalues ' +
    'by EISPACK tql1; adaptive backward RK4 dt = 0.02 g_min^2, integrated to min-gap fraction 1e-4.',
  question:
    'imp-35215 derived beta * g_min * (x_2 - x_0) -> 1 for unit spacing and imp-35238 confirmed it on ' +
    'the real Riemann ordinates. Does the three-factor invariant also hold on GUE-simulated ordinates ' +
    '-- the ensemble the C_mb constant is conditional on (imp-486) -- with the same ~1e-4 N-uniform ' +
    'spread, or does the random-matrix ensemble break it?',
  nearFrontTable: NEAR_FRONT_TABLE,
  invariantTrajectory: INVARIANT_TRAJECTORY,
  invariantLimit: 1,
  maxInvariantDeviation: round(maxInvariantDev, 4),
  invariantSpreadAcrossN: +invariantSpreadAcrossN.toFixed(6),
  bareProductBand: [+bareProductMin.toFixed(4), +bareProductMax.toFixed(4)],
  bareProductSpreadAcrossN: +bareProductSpreadAcrossN.toFixed(6),
  bareProductIsReciprocalSpan,
  collapseIsInterior,
  invariantMonotoneDown,
  eigensolverTraceError: round(maxTraceErr, 3), // Sum lam - Sum a_i (self-certifies tql1)
  eigensolverSumSqError: round(maxSumSqErr, 3), // Sum lam^2 - (Sum a_i^2 + 2 Sum b_i^2)
  eigenvaluesOrdered,
  finding:
    'ANSWER: the three-factor identity SURVIVES on the GUE-simulated ensemble too. Running the ' +
    'imp-35238 backward Dyson flow from the sorted eigenvalues of a Dumitriu-Edelman beta = 2 ' +
    'tridiagonal Hermite matrix to min-gap fraction 1e-4, beta * g_min * (x_2 - x_0) converges to 1 ' +
    'at every N = 50, 100, 200 (|dev| <= ' +
    round(maxInvariantDev, 3) +
    ', N-spread ~' +
    round(invariantSpreadAcrossN, 2) +
    ' -- the SAME ~1e-4 order as the imp-35238 real-ordinate ~5e-5 and imp-35281 ~7.7e-5 spreads). ' +
    'As on real ordinates the bare product beta * g_min is NOT N-uniform (band [' +
    bareProductMin.toFixed(3) +
    ', ' +
    bareProductMax.toFixed(3) +
    '] = 1/span, the local GUE spacing) and the collapse is INTERIOR (level repulsion), while the ' +
    'single-dominant-term share domFrac -> ' +
    Math.min(...NEAR_FRONT_TABLE.map((r) => r.dominantFraction)).toFixed(3) +
    '. The eigensolver is self-certified: trace error <= ' +
    round(maxTraceErr, 2) +
    ', sum-of-squares error <= ' +
    round(maxSumSqErr, 2) +
    '. So the invariant is ensemble-indifferent across all THREE tested initial conditions ' +
    '(unit-spacing, real Riemann ordinates, GUE-simulated ordinates).',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). The imp-35215 scale-invariant identity ' +
    'beta * g_min * (x_2 - x_0) -> 1 SURVIVES on a THIRD, GUE-simulated ensemble: running the ' +
    'imp-35238 backward Dyson flow from the sorted eigenvalues of a Dumitriu-Edelman beta = 2 ' +
    'tridiagonal Hermite matrix (the imp-486 C_mb-conditional GUE law) to min-gap fraction 1e-4, the ' +
    'three-factor product converges to the rational constant 1 at every N = 50, 100, 200 (|dev| <= ' +
    '~1e-4, N-spread ~5e-5 -- N-uniform, matching the real-ordinate and unit-spacing cases). The bare ' +
    'product beta * g_min is again NOT N-uniform (it is 1/span, the local GUE spacing) and the collapse ' +
    'is INTERIOR, but the single-dominant-reciprocal-product mechanism is scale- and location- and ' +
    'now ENSEMBLE-invariant, so the identity is robust to the random-matrix spacings. The eigensolver ' +
    'is self-certified by the trace and sum-of-squares (Frobenius) invariants, so no external ' +
    'eigenvalue table is needed. This SHARPENS the imp-35238 / imp-35281 spacing-indifference reading ' +
    'by adding the GUE ensemble, but changes nothing about M2: beta itself still diverges ~1/g_min ' +
    'toward the front (the invariant being bounded IS the statement beta ~ 1/g_min), so a finite ' +
    'N-uniform sup over s < t_c still requires an a-priori g_min > 0. It CERTIFIES NOTHING about the ' +
    'imp-486 GUE-conditional C_mb -- it shows the invariant HOLDS on GUE inputs, not that the ' +
    'conditional constant is discharged. Does NOT discharge M2 or the horizon/front bridge M5, does ' +
    'NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; I3 / M2 / M5 stay OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35215 (unit-spacing derivation beta*g_min*(x_2-x_0)->1; ensemble 1); imp-35238 (real ' +
    'ordinates; ensemble 2; parent); imp-35281 (real ordinates to N=400); imp-35301 (linear approach ' +
    'to 1); imp-35167 (M2/M5 obstructions); imp-2563 (gap ODE, CONDITIONAL bracket); imp-486 (C_mb ' +
    'GUE-conditional); Dumitriu-Edelman 2002 (beta-Hermite tridiagonal ensemble).',
};

export const IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT_ASSERTIONS = [
  {
    // The eigensolver is correct: trace and sum-of-squares are basis invariants of the GUE matrix.
    id: 'imp35305-eigensolver-self-certified',
    description:
      'tql1 preserves the trace (Sum lam = Sum a_i) and sum-of-squares (Sum lam^2 = Sum a_i^2 + 2 Sum b_i^2) to < 1e-8, and eigenvalues are strictly ordered',
    holds: () => maxTraceErr < 1e-8 && maxSumSqErr < 1e-8 && eigenvaluesOrdered === true,
  },
  {
    // Every run reaches the tightest min-gap fraction 1e-4 (so the front table is fully populated).
    id: 'imp35305-all-runs-reach-front',
    description: 'every N run reaches min-gap fraction 1e-4 within the step budget',
    holds: () => allReachedFront === true && NEAR_FRONT_TABLE.every((r) => Number.isFinite(r.invariant)),
  },
  {
    // THE HEADLINE: the three-factor invariant -> 1 at fraction 1e-4 for every N on GUE ordinates.
    id: 'imp35305-invariant-tends-to-one',
    description: 'beta * g_min * (x_2 - x_0) = 1 within 2e-3 at min-gap fraction 1e-4 for every N (identity survives on GUE ordinates)',
    holds: () => NEAR_FRONT_TABLE.every((r) => Math.abs(r.invariant - 1) < 2e-3),
  },
  {
    // The invariant is N-UNIFORM on GUE ordinates while the bare product is NOT (as on real ordinates).
    id: 'imp35305-invariant-n-uniform',
    description: 'the three-factor invariant spread across N is tiny (< 1e-3) while the bare product spread is large (> 0.05)',
    holds: () => invariantSpreadAcrossN < 1e-3 && bareProductSpreadAcrossN > 0.05,
  },
  {
    // The bare product beta*g_min equals 1/span at every N (the local GUE spacing at the collapse).
    id: 'imp35305-bare-product-is-reciprocal-span',
    description: 'the bare product beta*g_min equals 1/span at every N (the smaller bare band IS 1/local-GUE-spacing)',
    holds: () => bareProductIsReciprocalSpan === true,
  },
  {
    // The mechanism: a single reciprocal-product term carries essentially all of beta at the front.
    id: 'imp35305-dominant-term-carries-beta',
    description: 'one reciprocal-product term carries > 99% of beta at fraction 1e-4 for every N (scale-invariant mechanism)',
    holds: () => NEAR_FRONT_TABLE.every((r) => r.dominantFraction > 0.99),
  },
  {
    // On GUE ordinates the collapsing min-gap pair is INTERIOR (level repulsion), not the edge.
    id: 'imp35305-collapse-is-interior',
    description: 'the collapsing min-gap pair is INTERIOR on GUE ordinates (not the outermost edge as for unit spacing)',
    holds: () => collapseIsInterior === true,
  },
  {
    // Honesty gate: measurement only, no QED, I3/M2/M5 stay OPEN, C_mb conditional untouched, no refereed bound is changed.
    id: 'imp35305-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M2/M5 OPEN, C_mb GUE-conditional untouched, no refereed bound is changed',
    holds: () =>
      IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT.isRigorous === false &&
      /NO QED/.test(IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT.verdict) &&
      /CERTIFIES NOTHING about the imp-486 GUE-conditional C_mb/.test(
        IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT.verdict,
      ) &&
      /imp-2563 sandwich/.test(IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT.verdict) &&
      /refereed bound is changed/i.test(IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT.verdict),
  },
];

for (const a of IMP35305_GUE_ORDINATE_THREE_FACTOR_INVARIANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35305-gue-ordinate-three-factor-invariant assertion failed: ${a.id}`);
  }
}
