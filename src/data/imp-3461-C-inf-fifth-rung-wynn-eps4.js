/**
 * @module imp-3461-C-inf-fifth-rung-wynn-eps4
 * @fileoverview imp-3461 -- Resolve the imp-3445 named sub-gap on the imp-3346
 *   capture constant C_inf ~ 0.1751: whether the r*U sequence converges to the
 *   Aitken value 0.17506 or to the quadratic / Wynn-top-triple cluster ~0.17511
 *   (the two were NOT resolved to 1e-5). imp-3461 extends the fixed-h = 0.025
 *   geometric U-ladder by ONE more rung to U = 50.625 (N = 2025), building the
 *   5-point r*U sequence, and runs a HIGHER-ORDER accelerator -- the full WYNN
 *   epsilon table through the eps_4 column and a cubic Richardson through the top
 *   four points -- to DISCRIMINATE which value the sequence favours.
 *   Certification / measurement only; no RH claim, NO QED.
 *
 *   CONTEXT
 *   -------
 *   imp-3407 certified C_inf ~ 0.1751 with two accelerators on a 3-point ladder:
 *     Aitken Delta^2       C_inf = 0.1750631  (band low)
 *     quadratic Richardson C_inf = 0.1751079  (band high)
 *   imp-3445 (imp-3445-C-inf-third-extrapolation-wynn.js) added a THIRD route on
 *   a 4-point ladder U in {10, 15, 22.5, 33.75} (N = {400, 600, 900, 1350}) via
 *   Wynn epsilon; its top-triple Shanks estimate C_inf = 0.1751107 clustered with
 *   the quadratic 0.1751079 and isolated the Aitken 0.1750631 as the low outlier,
 *   but left a NAMED sub-gap: whether the true C_inf is 0.17506 or 0.17511 was
 *   NOT resolved to 1e-5, and it stated a 5-point ladder feeding eps_4 or a still
 *   higher rung would be needed to discriminate. imp-3461 supplies exactly that.
 *
 *   THE FIFTH RUNG
 *   --------------
 *   Extend the geometric ladder one more rung (ratio 1.5):
 *     U in {10, 15, 22.5, 33.75, 50.625}, fixed h = H0 = 0.025,
 *     N = U/h in {400, 600, 900, 1350, 2025}.
 *   The top cell N = 2025 (U = 50.625) is a genuine anchor above the imp-3445
 *   top N = 1350. On the 5-point r*U sequence run the FULL Wynn epsilon table.
 *   The 5 points now feed the eps_4 column -- a single, genuinely higher-order
 *   accelerator (repeated Shanks) that the 4-point ladder could not reach.
 *
 *   FINDING (HONEST) -- THE TIE IS BROKEN TOWARD THE UPPER CLUSTER
 *   -------------------------------------------------------------
 *   The 5-point r*U sequence still DECREASES monotonically from above:
 *     0.1769018 (N=400) -> 0.1763233 (N=600) -> 0.1759268 (N=900)
 *     -> 0.1756600 (N=1350) -> 0.1754814 (N=2025).
 *   The Wynn eps_2 (Shanks) column now has THREE entries and is itself monotone
 *   INCREASING toward the limit as the anchor rung climbs:
 *     0.1750631 {10,15,22.5}   (reproduces the imp-3407 Aitken -- consistency)
 *     0.1751107 {15,22.5,33.75} (reproduces the imp-3445 third estimate -- consistency)
 *     0.1751203 {22.5,33.75,50.625} (NEW, anchored on N = 2025).
 *   The higher-order eps_4 column (single entry) gives C_inf = 0.1751230, and an
 *   independent cubic Richardson through the top four points {15,22.5,33.75,50.625}
 *   gives 0.1751238 -- the two higher-order routes AGREE to ~8.3e-7.
 *
 *   DISCRIMINATION: eps_4 = 0.1751230 lands ~6.0e-5 ABOVE the Aitken 0.1750631 but
 *   only ~1.5e-5 above the quadratic 0.1751079 and ~1.2e-5 above the imp-3445 third
 *   0.1751107. So the distance to the Aitken value is ~4x the distance to the upper
 *   cluster: the sequence FAVOURS the UPPER cluster ~0.17511-0.17512, and the Aitken
 *   0.17506 (which drops the O(1/U^2) tail) is confirmed the LOW OUTLIER. The
 *   0.17506-vs-0.17511 tie IS broken -- toward the upper side.
 *
 *   SUB-GAP (named, honest, one level deeper): the higher-order accelerators do not
 *   land AT the quadratic 0.1751079; the eps_4 / cubic-top-four consensus is a touch
 *   HIGHER, ~0.175123, i.e. ~1.5e-5 above the quadratic and ~2.3e-5 above the imp-3346
 *   headline 0.1751 (still inside the imp-3346 quoted 1e-4 precision). And the eps_2
 *   column is still slowly climbing (0.1750631 -> 0.1751107 -> 0.1751203), so C_inf is
 *   pinned to the upper cluster ~0.17512 but its last digit (0.17511 vs 0.17512) is
 *   NOT frozen to 1e-6 here; a sixth rung feeding eps_6 would be needed to settle it.
 *
 *   The imp-3407 band literals (0.1750631, 0.1751079), the imp-3445 third estimate
 *   (0.1751107) and the imp-3346 headline 0.1751 are baked as literals rather than
 *   imported, to keep this module free of cross-module imports for node verification;
 *   eps_2 on the bottom two triples reproduces the imp-3407 Aitken and imp-3445 third
 *   estimate to ~1e-6 as in-module consistency checks.
 *
 *   @see imp-3445-C-inf-third-extrapolation-wynn.js (the 4-point third route + the sub-gap this closes)
 *   @see imp-3407-C-inf-independent-extrapolation-certification.js (the two-accelerator band)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (the single-route C_inf ~ 0.1751)
 *
 *   Ticket: imp-3461 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3407 / imp-3445)
const H0 = 0.025; // FIXED grid step (identical to imp-3445), N = U/H0 grows with U
const A_LINEAR = 0.1; // small shear weight isolating the a -> 0 linear-shear limit where C lives
const ITERS = 220; // power-iteration steps (identical to imp-3445)
const C_INF_IMP3346 = 0.1751; // imp-3346 headline C_inf, baked as a literal
const AITKEN_IMP3407 = 0.1750631; // imp-3407 Aitken accelerator (band low), baked as a literal
const QUADRATIC_IMP3407 = 0.1751079; // imp-3407 quadratic Richardson (band high), baked as a literal
const THIRD_IMP3445 = 0.1751107; // imp-3445 Wynn top-triple third estimate, baked as a literal
const QUOTED_PRECISION = 1e-4; // imp-3346 quotes C_inf ~ 0.1751 to ~1e-4

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3445). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3445). */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  const s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** One (a, U, N) cell: build Gshear and the lag-stationary surrogate T, return r and r*U (identical to imp-3445). */
function captureAt(a, U, N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const abar = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    let c = 0;
    for (let i = 0; i + k < N; i++) {
      s += phi[i] * phi[i + k];
      c += 1;
    }
    abar[k] = c ? s / c : 0;
  }
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const sh = Math.sinh(a * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rT[j] = sh * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  const normGshear = spectralNorm(G, N, ITERS);
  const normLagStationary = spectralNorm(T, N, ITERS);
  const ratio = normGshear > 0 ? normLagStationary / normGshear : 0;
  return { a, U, N, H, normGshear, normLagStationary, ratio, ratioTimesU: ratio * U };
}

// --- FIFTH-RUNG ladder: extend the imp-3445 geometric ladder by one rung (ratio 1.5).
//     U in {10, 15, 22.5, 33.75, 50.625}, fixed h = H0, N = U/H0 in {400, 600, 900, 1350, 2025}.
const U_FIVE_LADDER = Object.freeze([10, 15, 22.5, 33.75, 50.625]);
const ladder = U_FIVE_LADDER.map((U) => captureAt(A_LINEAR, U, Math.round(U / H0)));
const rU = ladder.map((c) => c.ratioTimesU);
const invU = ladder.map((c) => 1 / c.U);
const maxN = Math.max(...ladder.map((c) => c.N)); // 2025 -- exceeds the imp-3445 maximum N = 1350
let monotoneDecreasing = true;
for (let i = 1; i < rU.length; i++) {
  if (!(rU[i] < rU[i - 1] + 1e-9)) monotoneDecreasing = false;
}

// --- WYNN epsilon algorithm on the 5-point r*U sequence, run to the eps_4 column.
//     Columns: cols[0] = eps_{-1} (all zero), cols[1] = eps_0 = data, cols[2] = eps_1, cols[3] = eps_2, ...
function wynnEpsilon(seq) {
  const cols = [];
  cols[0] = new Array(seq.length).fill(0); // eps_{-1}
  cols[1] = seq.slice(); // eps_0
  let m = 1;
  while (cols[m].length > 1) {
    const prev = cols[m - 1];
    const cur = cols[m];
    const next = [];
    for (let i = 0; i < cur.length - 1; i++) {
      const d = cur[i + 1] - cur[i];
      next.push(prev[i + 1] + 1 / d);
    }
    cols[m + 1] = next;
    m += 1;
  }
  return cols;
}
const wynnCols = wynnEpsilon(rU);
const eps2 = wynnCols[3]; // eps_2 Shanks column: 3 entries, one per consecutive triple
const eps4 = wynnCols[5][0]; // eps_4 column: THE single higher-order accelerator the 5-point ladder unlocks
const wynnBottomTriple = eps2[0]; // reproduces imp-3407 Aitken (consistency)
const wynnMidTriple = eps2[1]; // reproduces imp-3445 third estimate (consistency)
const wynnTopTriple = eps2[2]; // NEW top triple {22.5, 33.75, 50.625}, anchored on N = 2025

// --- Supplementary cubic Richardson through the TOP FOUR points (fit C_inf + b/U + c/U^2 + d/U^3).
function lagrangeAtZero(ts, xs) {
  let acc = 0;
  for (let i = 0; i < ts.length; i++) {
    let L = 1;
    for (let j = 0; j < ts.length; j++) {
      if (j !== i) L *= (0 - ts[j]) / (ts[i] - ts[j]);
    }
    acc += xs[i] * L;
  }
  return acc;
}
const cubicTopFour = lagrangeAtZero(invU.slice(1), rU.slice(1)); // top 4 {15,22.5,33.75,50.625} ~0.1751238
const quartic5pt = lagrangeAtZero(invU, rU); // 5-point quartic Richardson ~0.1751234

// --- Consistency checks: eps_2 reproduces the two prior estimates.
const wynnReproducesAitken = Math.abs(wynnBottomTriple - AITKEN_IMP3407); // ~1e-6
const wynnReproducesThird = Math.abs(wynnMidTriple - THIRD_IMP3445); // ~1e-6

// --- DISCRIMINATION: distance of the higher-order eps_4 to the two candidate limits.
const eps4VsAitken = Math.abs(eps4 - AITKEN_IMP3407); // ~6.0e-5 -- FAR
const eps4VsQuadratic = Math.abs(eps4 - QUADRATIC_IMP3407); // ~1.5e-5 -- near
const eps4VsThird = Math.abs(eps4 - THIRD_IMP3445); // ~1.2e-5 -- near
const eps4VsCubicTopFour = Math.abs(eps4 - cubicTopFour); // ~8.3e-7 -- two higher-order routes agree
const eps4VsImp3346 = Math.abs(eps4 - C_INF_IMP3346); // ~2.3e-5 -- within quoted precision
// eps_2 column climbs monotonically toward the upper cluster as the anchor rung rises.
const eps2ClimbsToUpper = eps2[0] < eps2[1] && eps2[1] < eps2[2];
// The tie is broken toward the UPPER cluster: eps_4 is far closer to the quadratic than to the Aitken.
const favoursUpperCluster = eps4VsAitken > 3 * eps4VsQuadratic && eps4VsQuadratic < eps4VsAitken;
const aitkenIsLowOutlier = eps4 - AITKEN_IMP3407 > 4e-5; // Aitken sits well below the higher-order limit

const verdict =
  monotoneDecreasing &&
  maxN > 1350 &&
  wynnReproducesAitken < 1e-5 &&
  wynnReproducesThird < 1e-5 &&
  favoursUpperCluster &&
  aitkenIsLowOutlier &&
  eps4VsCubicTopFour < 5e-6 &&
  eps4VsImp3346 < QUOTED_PRECISION
    ? 'TIE-BROKEN-TOWARD-UPPER-CLUSTER-eps4-AND-CUBIC-TOP-FOUR-AGREE-AT-0.175123-AITKEN-0.17506-IS-THE-LOW-OUTLIER-C_inf-RE-CENTRES-TO-0.17512-STILL-WITHIN-imp3346-1e-4'
    : 'INDETERMINATE';

export const IMP3461_C_INF_FIFTH_RUNG_WYNN_EPS4 = Object.freeze({
  id: 'imp-3461-C-inf-fifth-rung-wynn-eps4',
  ticket: 'imp-3461',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentSubGap: 'imp-3445-C-inf-third-extrapolation-wynn.js (honestCaveat.subGapCInfNotPinnedTo1e5)',
  grandparentCertification: 'imp-3407-C-inf-independent-extrapolation-certification.js',
  rootDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',

  summary:
    'Resolves the imp-3445 named sub-gap on the imp-3346 capture constant C_inf ~ 0.1751 (Aitken 0.17506 vs ' +
    'quadratic / Wynn-top-triple ~0.17511, unresolved to 1e-5). Extends the fixed-h = 0.025 geometric U-ladder by ' +
    'ONE more rung (ratio 1.5) to U in {10, 15, 22.5, 33.75, 50.625}, so N = U/h runs {400, 600, 900, 1350, 2025} ' +
    'and the top cell N = 2025 EXCEEDS the imp-3445 maximum N = 1350. On the 5-point r*U sequence (still monotone ' +
    'decreasing from above: 0.1769018 -> 0.1763233 -> 0.1759268 -> 0.1756600 -> 0.1754814) it runs the FULL Wynn ' +
    'epsilon table to the eps_4 column -- the higher-order accelerator the 4-point ladder could not reach. The ' +
    'eps_2 Shanks column reproduces the imp-3407 Aitken 0.1750631 (bottom triple) and imp-3445 third 0.1751107 ' +
    '(mid triple) as consistency checks, and its new top triple {22.5,33.75,50.625} gives 0.1751203. The eps_4 ' +
    'column gives C_inf = 0.1751230, and an independent cubic Richardson through the top four points gives ' +
    '0.1751238 -- the two higher-order routes AGREE to ~8.3e-7. DISCRIMINATION: eps_4 lands ~6.0e-5 ABOVE the ' +
    'Aitken 0.17506 but only ~1.5e-5 above the quadratic 0.17511, so the distance to the Aitken value is ~4x the ' +
    'distance to the upper cluster -- the sequence FAVOURS the upper cluster and the Aitken 0.17506 (which drops ' +
    'the O(1/U^2) tail) is confirmed the LOW OUTLIER. The imp-3445 tie IS broken, toward the upper side. HONEST ' +
    'residual sub-gap: the higher-order consensus ~0.175123 sits ~1.5e-5 above the quadratic 0.1751079 and ' +
    '~2.3e-5 above the headline 0.1751 (still inside the imp-3346 1e-4), and the eps_2 column is still slowly ' +
    'climbing, so C_inf is pinned to the upper cluster ~0.17512 but its last digit (0.17511 vs 0.17512) is not ' +
    'frozen to 1e-6 here. Certification / measurement only; RH-equivalent; NO RH verdict and NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    lagStationarySurrogate: 'T(u,v) = sinh(a(v-u)) Abar(|v-u|), Abar(k) = A_Phi(k)/(N-k)',
    captureRatio: 'r = ||T|| / ||Gshear||, spectral norm via power iteration on M^T M (identical to imp-3445)',
    fiveLadder: 'U in {10, 15, 22.5, 33.75, 50.625} (ratio 1.5), fixed h = H0 = 0.025, N = U/H0 in {400, 600, 900, 1350, 2025}',
    higherThanParent: 'top cell N = 2025 exceeds the imp-3445 maximum N = 1350 (U = 33.75)',
    higherOrderRoute: 'FULL Wynn epsilon table on the 5-point r*U sequence, read at the eps_4 column (single entry)',
    consistencyChecks: 'eps_2 bottom triple {10,15,22.5} reproduces imp-3407 Aitken 0.1750631; mid triple {15,22.5,33.75} reproduces imp-3445 third 0.1751107',
    supplementaryCubic: 'cubic Richardson through the top four points {15,22.5,33.75,50.625}; also a 5-point quartic Richardson',
    a: A_LINEAR,
    h0: H0,
    uLadder: U_FIVE_LADDER.slice(),
    iters: ITERS,
    imp3346HeadlineLiteral: C_INF_IMP3346,
    imp3407BandLiterals: [AITKEN_IMP3407, QUADRATIC_IMP3407],
    imp3445ThirdLiteral: THIRD_IMP3445,
    selfComputing: true,
  }),

  measured: Object.freeze({
    uLadder: U_FIVE_LADDER.slice(),
    nLadder: ladder.map((c) => c.N), // {400, 600, 900, 1350, 2025}
    rU, // 0.1769018 -> 0.1763233 -> 0.1759268 -> 0.1756600 -> 0.1754814
    monotoneDecreasing, // true
    maxN, // 2025 -- exceeds imp-3445 max N = 1350
    eps2, // [0.1750631, 0.1751107, 0.1751203]
    wynnBottomTriple, // ~0.1750631 -- reproduces imp-3407 Aitken (consistency)
    wynnMidTriple, // ~0.1751107 -- reproduces imp-3445 third estimate (consistency)
    wynnTopTriple, // ~0.1751203 -- NEW top triple anchored on N = 2025
    wynnReproducesAitken, // ~1e-6
    wynnReproducesThird, // ~1e-6
    eps2ClimbsToUpper, // true -- Shanks estimates climb toward the upper cluster
    eps4, // ~0.1751230 -- THE higher-order accelerator the 5-point ladder unlocks
    cubicTopFour, // ~0.1751238 -- independent higher-order route
    quartic5pt, // ~0.1751234 -- 5-point quartic Richardson
    eps4VsAitken, // ~6.0e-5 -- FAR from the Aitken value
    eps4VsQuadratic, // ~1.5e-5 -- near the quadratic
    eps4VsThird, // ~1.2e-5 -- near the imp-3445 third
    eps4VsCubicTopFour, // ~8.3e-7 -- two higher-order routes agree
    eps4VsImp3346, // ~2.3e-5 -- within quoted precision
    favoursUpperCluster, // true -- tie broken toward the upper side
    aitkenIsLowOutlier, // true
    quotedPrecision: QUOTED_PRECISION, // 1e-4
    verdict,
  }),

  interpretation: Object.freeze({
    tieBroken:
      'The higher-order eps_4 accelerator (0.1751230) and the independent cubic Richardson through the top four ' +
      'points (0.1751238) agree to ~8.3e-7 and both land ~6.0e-5 ABOVE the Aitken 0.17506 but only ~1.5e-5 above ' +
      'the quadratic 0.17511. The distance to the Aitken value is ~4x the distance to the upper cluster, so the ' +
      'imp-3445 0.17506-vs-0.17511 tie IS broken: the r*U sequence converges to the UPPER cluster ~0.17512, and ' +
      'the Aitken 0.17506 -- which drops the O(1/U^2) tail term -- is confirmed the low outlier.',
    shanksClimb:
      'The eps_2 Shanks column climbs monotonically as the anchor rung rises: 0.1750631 {10,15,22.5} -> 0.1751107 ' +
      '{15,22.5,33.75} -> 0.1751203 {22.5,33.75,50.625}. Each higher-N triple pushes the Shanks estimate toward ' +
      'the upper cluster, corroborating the eps_4 verdict and reproducing the imp-3407 Aitken and imp-3445 third ' +
      'estimates on the two lower triples as consistency checks.',
    reCentresUpward:
      'The consensus C_inf re-centres from the imp-3445 ~0.17511 to the higher-order ~0.175123, ~2.3e-5 above the ' +
      'imp-3346 headline 0.1751 but still comfortably within its quoted 1e-4 precision. The headline value stays ' +
      'fit for purpose; the finer estimate favours ~0.17512.',
    fromAboveConvergence:
      'On the extended 5-point ladder r*U still decreases monotonically toward C_inf (0.1769018 at N=400 down to ' +
      '0.1754814 at N=2025), extending the from-above convergence one rung higher than imp-3445.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    tieBrokenTowardUpper:
      'The imp-3445 sub-gap (0.17506 vs 0.17511 unresolved to 1e-5) is RESOLVED here in favour of the UPPER ' +
      'cluster: the higher-order eps_4 and cubic-top-four accelerators cluster at ~0.175123, ~6.0e-5 above the ' +
      'Aitken 0.17506, which is confirmed the low outlier. This is a DISCRIMINATION by extrapolation order and ' +
      'rung, not a closed-form proof of the limit.',
    residualSubGapLastDigitNotFrozen:
      'Named residual sub-gap: the higher-order consensus ~0.175123 sits ~1.5e-5 ABOVE even the quadratic 0.1751079 ' +
      'and ~2.3e-5 above the headline 0.1751 (still within the imp-3346 1e-4), and the eps_2 column is still slowly ' +
      'climbing (0.1750631 -> 0.1751107 -> 0.1751203). So C_inf is pinned to the upper cluster ~0.17512 but its ' +
      'last digit (0.17511 vs 0.17512) is NOT frozen to 1e-6 here; a sixth rung (U = 75.9375, N = 3038) feeding ' +
      'eps_6 would be needed to settle it.',
    certificationNotClosedForm:
      'This DISCRIMINATES the extrapolation limit by cross-order/higher-N agreement; it does NOT supply a symbolic ' +
      'closed form for C_inf. The numerator norm still reduces to a transcendental spectral-slope sup (imp-3400), ' +
      'so C_inf remains a NUMBER.',
    measuresRatioNotPositivity:
      'This certifies the U-scaling limit of the operator-norm capture RATIO; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'The 1/U scaling of the capture ratio is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator ' +
      'magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3461_C_INF_FIFTH_RUNG_WYNN_EPS4_ASSERTIONS = [
  {
    id: 'imp3461-five-point-ladder-is-higher-N-and-converges-from-above',
    why: 'The discrimination must use a GENUINELY higher-N 5-point ladder: U in {10,15,22.5,33.75,50.625} gives a ' +
      'top cell N = 2025 EXCEEDING the imp-3445 maximum N = 1350, and r*U must DECREASE monotonically (the same ' +
      'from-above convergence, extended one rung).',
    holds: () => monotoneDecreasing && maxN > 1350 && rU[0] > rU[rU.length - 1],
  },
  {
    id: 'imp3461-wynn-bottom-triple-reproduces-imp3407-aitken',
    why: 'Consistency check: Wynn eps_2 on the bottom triple {10,15,22.5} IS the Shanks/Aitken transform, so it ' +
      'must reproduce the imp-3407 Aitken value 0.1750631 to ~1e-6, confirming the shared machinery/grid.',
    holds: () => wynnReproducesAitken < 1e-5,
  },
  {
    id: 'imp3461-wynn-mid-triple-reproduces-imp3445-third',
    why: 'Consistency check: Wynn eps_2 on the mid triple {15,22.5,33.75} must reproduce the imp-3445 third estimate ' +
      '0.1751107 to ~1e-6, confirming the fifth-rung ladder reproduces the imp-3445 4-point results exactly.',
    holds: () => wynnReproducesThird < 1e-5,
  },
  {
    id: 'imp3461-eps4-and-cubic-top-four-agree-higher-order-consensus',
    why: 'THE PRIMARY DELIVERABLE (part 1): the two independent higher-order routes the 5-point ladder unlocks -- ' +
      'the Wynn eps_4 column and the cubic Richardson through the top four points -- must AGREE to within ~5e-6, ' +
      'establishing a genuine higher-order consensus at ~0.175123.',
    holds: () => eps4VsCubicTopFour < 5e-6,
  },
  {
    id: 'imp3461-tie-broken-toward-upper-cluster',
    why: 'THE PRIMARY DELIVERABLE (part 2): the imp-3445 tie must be broken TOWARD THE UPPER cluster -- eps_4 must ' +
      'lie far closer to the quadratic 0.17511 than to the Aitken 0.17506 (distance to Aitken > 3x distance to ' +
      'quadratic), confirming the Aitken 0.17506 as the low outlier.',
    holds: () => favoursUpperCluster && aitkenIsLowOutlier,
  },
  {
    id: 'imp3461-eps2-shanks-column-climbs-toward-upper',
    why: 'Corroboration: the eps_2 Shanks column must climb monotonically as the anchor rung rises (0.1750631 -> ' +
      '0.1751107 -> 0.1751203), each higher-N triple pushing the estimate toward the upper cluster.',
    holds: () => eps2ClimbsToUpper,
  },
  {
    id: 'imp3461-higher-order-consensus-within-imp3346-quoted-precision',
    why: 'The higher-order consensus (eps_4) must still agree with the imp-3346 headline C_inf = 0.1751 to within ' +
      'its quoted 1e-4 precision -- the re-centring is a refinement, not a contradiction of the headline.',
    holds: () => eps4VsImp3346 < QUOTED_PRECISION,
  },
  {
    id: 'imp3461-eps4-lands-in-C_inf-band',
    why: 'The eps_4 accelerator must land in the broad C_inf band [0.173, 0.177]; a value outside would mean the ' +
      'constant is route-dependent at the 1e-3 level.',
    holds: () => eps4 > 0.173 && eps4 < 0.177,
  },
  {
    id: 'imp3461-verdict-classified-not-indeterminate',
    why: 'The classified verdict must be the tie-broken result, not indeterminate; a flip means the higher-N ladder, ' +
      'a Wynn consistency check, the higher-order agreement, the discrimination, or the imp-3346 precision check failed.',
    holds: () =>
      verdict ===
      'TIE-BROKEN-TOWARD-UPPER-CLUSTER-eps4-AND-CUBIC-TOP-FOUR-AGREE-AT-0.175123-AITKEN-0.17506-IS-THE-LOW-OUTLIER-C_inf-RE-CENTRES-TO-0.17512-STILL-WITHIN-imp3346-1e-4',
  },
  {
    id: 'imp3461-honest-residual-subgap-and-no-qed',
    why: 'Mandatory honesty: DISCRIMINATION only -- the tie is broken toward the upper cluster but the last digit ' +
      '(0.17511 vs 0.17512) is not frozen to 1e-6, C_inf is a determined number not a symbolic identity, positivity ' +
      'not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3461_C_INF_FIFTH_RUNG_WYNN_EPS4.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.residualSubGapLastDigitNotFrozen === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3461_C_INF_FIFTH_RUNG_WYNN_EPS4_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3461-C-inf-fifth-rung-wynn-eps4 assertion failed: ${assertion.id}`);
  }
}

export default IMP3461_C_INF_FIFTH_RUNG_WYNN_EPS4;
