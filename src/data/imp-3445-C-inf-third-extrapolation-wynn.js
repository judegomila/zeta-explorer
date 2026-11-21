/**
 * @module imp-3445-C-inf-third-extrapolation-wynn
 * @fileoverview imp-3445 -- Add a THIRD independent extrapolation route for the
 *   imp-3346 capture constant C_inf ~ 0.1751, on a 4-point geometric ladder that
 *   extends past the imp-3407 top cell N = 900 (U = 22.5) to a genuine N > 900
 *   anchor, and report whether the third estimate lands inside the imp-3407
 *   accelerator band [0.1750631, 0.1751079]. Certification only; no RH verdict.
 *
 *   CONTEXT
 *   -------
 *   imp-3407 (imp-3407-C-inf-independent-extrapolation-certification.js) certified
 *   C_inf ~ 0.1751 with TWO accelerators on a 3-point geometric ladder
 *   U in {10, 15, 22.5} (fixed h = 0.025, N = U/h in {400, 600, 900}):
 *     Aitken Delta^2        C_inf = 0.1750631
 *     quadratic Richardson  C_inf = 0.1751079
 *   The two agree only to ~4.5e-5. imp-3445 adds a THIRD, independent route on a
 *   HIGHER rung.
 *
 *   THE THIRD ROUTE
 *   ---------------
 *   Extend the geometric ladder by one more rung (ratio 1.5):
 *     U in {10, 15, 22.5, 33.75}, fixed h = H0 = 0.025, N = U/h in {400, 600, 900, 1350}.
 *   The top cell N = 1350 is a genuine anchor ABOVE the imp-3407 top N = 900. On
 *   the 4-point r*U sequence run WYNN epsilon (equivalently repeated Shanks). The
 *   even column eps_2 yields two Shanks estimates:
 *     eps_2 on the BOTTOM triple {10, 15, 22.5}  = 0.1750631  (reproduces the imp-3407 Aitken -- a consistency check, since Wynn eps_2 IS the Shanks/Aitken transform)
 *     eps_2 on the TOP    triple {15, 22.5, 33.75} = 0.1751107  (the THIRD estimate: a Shanks acceleration anchored on the new N = 1350 rung)
 *   The top-triple estimate is the genuinely-new, higher-N third route.
 *
 *   FINDING (HONEST)
 *   ----------------
 *   The 4-point r*U sequence still DECREASES monotonically from above:
 *     0.176902 (N=400) -> 0.176323 (N=600) -> 0.175927 (N=900) -> 0.175660 (N=1350).
 *   The third estimate is C_inf = 0.1751107. It does NOT land strictly INSIDE the
 *   imp-3407 band [0.1750631, 0.1751079]: it lands 2.77e-6 ABOVE the band top.
 *   So the accelerator span does NOT tighten -- the three-route min-max span is
 *   [0.1750631, 0.1751107] = 4.76e-5, marginally WIDER than the prior 4.48e-5.
 *   BUT the third route AGREES with the imp-3407 quadratic Richardson route to
 *   2.77e-6, an order of magnitude tighter than the 4.48e-5 Aitken-vs-quadratic
 *   spread. The two higher-order / higher-N routes (quadratic + Wynn top triple)
 *   thus CLUSTER at ~0.17511, isolating the Aitken value 0.1750631 (which drops
 *   the O(1/U^2) term) as the low outlier. All three routes remain within the
 *   imp-3346 quoted 1e-4 precision of the headline 0.1751 (third route +1.07e-5).
 *
 *   SUB-GAP (named, honest): the third route does NOT fall inside the imp-3407
 *   band and does NOT tighten the min-max accelerator span; it re-centres the
 *   consensus on the quadratic value ~0.17511 rather than the Aitken 0.17506.
 *   Whether the true C_inf is 0.17506 or 0.17511 is not resolved to 1e-5 here.
 *
 *   The imp-3407 band literals (0.1750631, 0.1751079) and the imp-3346 headline
 *   0.1751 are baked as literals rather than imported, to keep this module free
 *   of cross-module imports for node verification; the parent computes the same
 *   numbers self-contained and eps_2 on the bottom triple reproduces the Aitken
 *   literal to ~1e-6 as an in-module consistency check.
 *
 *   @see imp-3407-C-inf-independent-extrapolation-certification.js (the two-accelerator band)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (the single-route C_inf ~ 0.1751)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the r ~ C/U law)
 *
 *   Ticket: imp-3445 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3346 / imp-3407)
const H0 = 0.025; // FIXED grid step (identical to imp-3407), N = U/H0 grows with U
const A_LINEAR = 0.1; // small shear weight isolating the a -> 0 linear-shear limit where C lives
const ITERS = 220; // power-iteration steps (identical to imp-3407)
const C_INF_IMP3346 = 0.1751; // imp-3346 headline C_inf, baked as a literal
const AITKEN_IMP3407 = 0.1750631; // imp-3407 Aitken accelerator (band low), baked as a literal
const QUADRATIC_IMP3407 = 0.1751079; // imp-3407 quadratic Richardson (band high), baked as a literal
const QUOTED_PRECISION = 1e-4; // imp-3346 quotes C_inf ~ 0.1751 to ~1e-4

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3407). */
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

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3407). */
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
  // Per-row nonzero column span [lo[i], hi[i]). Entries outside it are +-0, and
  // with finite v each skipped term is +-0, which never changes an accumulator
  // that starts at +0 (x + +-0 === x for x !== -0, and the accumulator is never
  // -0). So restricting to the span is bit-identical to the dense loop while
  // skipping the exactly-zero Phi tail / band (the dense version made the
  // /closure-routes page take tens of seconds at import).
  const lo = new Int32Array(n);
  const hi = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const Mi = M[i];
    let a = 0;
    while (a < n && Mi[a] === 0) a++;
    let b = n;
    while (b > a && Mi[b - 1] === 0) b--;
    lo[i] = a;
    hi[i] = b;
  }
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    // Row-major accumulation (cache-friendly): each MtMv[j] still receives the
    // terms M[i][j]*Mv[i] in the same i = 0..n-1 order starting from 0, so the
    // result is bit-identical to the column-wise loop it replaces.
    const MtMv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const Mi = M[i];
      const mvi = Mv[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) MtMv[j] += Mi[j] * mvi;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** One (a, U, N) cell: build Gshear and the lag-stationary surrogate T, return r and r*U (identical to imp-3407). */
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

// --- THIRD-ROUTE ladder: extend the imp-3407 geometric ladder by one rung (ratio 1.5).
//     U in {10, 15, 22.5, 33.75}, fixed h = H0, N = U/H0 in {400, 600, 900, 1350}.
const U_EXTENDED_LADDER = Object.freeze([10, 15, 22.5, 33.75]);
const ladder = U_EXTENDED_LADDER.map((U) => captureAt(A_LINEAR, U, Math.round(U / H0)));
const rU = ladder.map((c) => c.ratioTimesU);
const invU = ladder.map((c) => 1 / c.U);
const maxN = Math.max(...ladder.map((c) => c.N)); // 1350 -- exceeds the imp-3407 maximum N = 900
let monotoneDecreasing = true;
for (let i = 1; i < rU.length; i++) {
  if (!(rU[i] < rU[i - 1] + 1e-9)) monotoneDecreasing = false;
}

// --- WYNN epsilon algorithm on the 4-point r*U sequence (the THIRD independent route).
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
const eps2 = wynnCols[3]; // eps_2 Shanks column: [bottom triple {10,15,22.5}, top triple {15,22.5,33.75}]
const wynnBottomTriple = eps2[0]; // reproduces the imp-3407 Aitken value (consistency check)
const thirdEstimate = eps2[1]; // THE THIRD ESTIMATE: Shanks on the top triple, anchored on N = 1350

// --- Supplementary 4-point cubic Richardson (fit C_inf + b/U + c/U^2 + d/U^3, Lagrange to 1/U = 0).
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
const cubicRichardson = lagrangeAtZero(invU, rU); // ~0.1751254

// --- Cross-checks against the imp-3407 band and the imp-3346 headline.
const bandLo = Math.min(AITKEN_IMP3407, QUADRATIC_IMP3407);
const bandHi = Math.max(AITKEN_IMP3407, QUADRATIC_IMP3407);
const insideImp3407Band = thirdEstimate >= bandLo && thirdEstimate <= bandHi; // false: lands just above
const gapAboveBand = thirdEstimate - bandHi; // ~2.77e-6 -- lands just OUTSIDE (above) the band
const thirdVsQuadratic = Math.abs(thirdEstimate - QUADRATIC_IMP3407); // ~2.77e-6 -- agrees with the quadratic route
const thirdVsImp3346 = Math.abs(thirdEstimate - C_INF_IMP3346); // ~1.07e-5 -- within quoted precision
const wynnReproducesAitken = Math.abs(wynnBottomTriple - AITKEN_IMP3407); // ~1e-6 consistency check
const priorSpread = Math.abs(QUADRATIC_IMP3407 - AITKEN_IMP3407); // ~4.48e-5
const threeRouteSpan = Math.max(AITKEN_IMP3407, QUADRATIC_IMP3407, thirdEstimate) -
  Math.min(AITKEN_IMP3407, QUADRATIC_IMP3407, thirdEstimate); // ~4.76e-5 (marginally WIDER)
const spanTightened = threeRouteSpan < priorSpread; // false -- honest: the span did NOT tighten

const verdict =
  monotoneDecreasing &&
  maxN > 900 &&
  wynnReproducesAitken < 1e-5 &&
  thirdVsImp3346 < QUOTED_PRECISION &&
  thirdVsQuadratic < 1e-5
    ? 'THIRD-ROUTE-AGREES-WITH-QUADRATIC-TO-3e-6-AND-WITHIN-imp3346-1e-4-BUT-LANDS-JUST-ABOVE-THE-imp3407-BAND-SPAN-NOT-TIGHTENED'
    : 'INDETERMINATE';

export const IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN = Object.freeze({
  id: 'imp-3445-C-inf-third-extrapolation-wynn',
  ticket: 'imp-3445',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3407-C-inf-independent-extrapolation-certification.js',
  grandparentDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',
  parentLaw: 'imp-3240-mupass-capture-ratio-aU-grid.js',

  summary:
    'Adds a THIRD independent extrapolation route for the imp-3346 capture constant C_inf ~ 0.1751, ' +
    'resolving the imp-3407 open item that its two accelerators (Aitken 0.1750631, quadratic 0.1751079) ' +
    'agree only to ~4.5e-5. Extends the imp-3407 geometric ladder by one rung (ratio 1.5) to ' +
    'U in {10, 15, 22.5, 33.75}, fixed h = 0.025, so N = U/h runs {400, 600, 900, 1350} and the top cell ' +
    'N = 1350 EXCEEDS the imp-3407 maximum N = 900. On the 4-point r*U sequence (still monotone decreasing ' +
    'from above: 0.176902 -> 0.176323 -> 0.175927 -> 0.175660) it runs the WYNN epsilon algorithm; the eps_2 ' +
    'Shanks column reproduces the imp-3407 Aitken value 0.1750631 on the bottom triple (a consistency check) ' +
    'and gives the THIRD estimate C_inf = 0.1751107 on the TOP triple {15, 22.5, 33.75}, anchored on the new ' +
    'N = 1350 rung. HONEST FINDING: the third estimate does NOT land strictly inside the imp-3407 band ' +
    '[0.1750631, 0.1751079] -- it lands 2.77e-6 ABOVE the band top, so the min-max accelerator span does NOT ' +
    'tighten (three-route span 4.76e-5 vs prior 4.48e-5). But the third route AGREES with the imp-3407 ' +
    'quadratic Richardson route to 2.77e-6 (an order of magnitude tighter than the 4.5e-5 Aitken-vs-quadratic ' +
    'spread), so the two higher-order / higher-N routes CLUSTER at ~0.17511 and isolate the Aitken 0.17506 as ' +
    'the low outlier. All three routes stay within the imp-3346 quoted 1e-4 precision of 0.1751 (third +1.07e-5). ' +
    'SUB-GAP: whether the true C_inf is 0.17506 or 0.17511 is not resolved to 1e-5 here. Certification only; ' +
    'RH-equivalent; NO RH verdict and NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    lagStationarySurrogate: 'T(u,v) = sinh(a(v-u)) Abar(|v-u|), Abar(k) = A_Phi(k)/(N-k)',
    captureRatio: 'r = ||T|| / ||Gshear||, spectral norm via power iteration on M^T M (identical to imp-3407)',
    extendedLadder: 'U in {10, 15, 22.5, 33.75} (ratio 1.5), fixed h = H0 = 0.025, N = U/H0 in {400, 600, 900, 1350}',
    higherThanParent: 'top cell N = 1350 exceeds the imp-3407 maximum N = 900 (U = 22.5)',
    thirdRoute: 'WYNN epsilon algorithm on the 4-point r*U sequence; eps_2 Shanks column, top triple {15, 22.5, 33.75}',
    consistencyCheck: 'eps_2 on the bottom triple {10, 15, 22.5} reproduces the imp-3407 Aitken value 0.1750631',
    supplementaryCubic: 'fit r*U = C_inf + b/U + c/U^2 + d/U^3; interpolate poly through 4 (1/U, r*U), evaluate at 1/U = 0',
    a: A_LINEAR,
    h0: H0,
    uLadder: U_EXTENDED_LADDER.slice(),
    iters: ITERS,
    imp3346HeadlineLiteral: C_INF_IMP3346,
    imp3407BandLiterals: [AITKEN_IMP3407, QUADRATIC_IMP3407],
    selfComputing: true,
  }),

  measured: Object.freeze({
    uLadder: U_EXTENDED_LADDER.slice(),
    nLadder: ladder.map((c) => c.N), // {400, 600, 900, 1350}
    rU, // 0.176902 -> 0.176323 -> 0.175927 -> 0.175660
    monotoneDecreasing, // true
    maxN, // 1350 -- exceeds imp-3407 max N = 900
    wynnBottomTriple, // ~0.1750631 -- reproduces imp-3407 Aitken (consistency)
    wynnReproducesAitken, // ~1e-6
    thirdEstimate, // ~0.1751107 -- Wynn Shanks on the top triple (the third route)
    cubicRichardson, // ~0.1751254 -- supplementary 4-point cubic Richardson
    imp3407BandLo: bandLo, // 0.1750631
    imp3407BandHi: bandHi, // 0.1751079
    insideImp3407Band, // false -- lands just above
    gapAboveBand, // ~2.77e-6
    thirdVsQuadratic, // ~2.77e-6 -- agrees with the quadratic route
    thirdVsImp3346, // ~1.07e-5 -- within quoted precision
    priorSpread, // ~4.48e-5 (imp-3407 Aitken vs quadratic)
    threeRouteSpan, // ~4.76e-5 -- marginally WIDER, span NOT tightened
    spanTightened, // false
    quotedPrecision: QUOTED_PRECISION, // 1e-4
    verdict,
  }),

  interpretation: Object.freeze({
    thirdRouteResult:
      'The third independent route -- Wynn epsilon (Shanks) on the top triple {15, 22.5, 33.75} of a 4-point ' +
      'geometric ladder whose top cell N = 1350 exceeds the imp-3407 N = 900 -- gives C_inf = 0.1751107. It does ' +
      'NOT fall strictly inside the imp-3407 band [0.1750631, 0.1751079]; it lands 2.77e-6 above the band top.',
    reCentresNotTightens:
      'Rather than tightening the min-max span (which marginally widens, 4.76e-5 vs 4.48e-5), the third route ' +
      'AGREES with the imp-3407 quadratic Richardson value to 2.77e-6. The two higher-order / higher-N routes thus ' +
      'cluster at ~0.17511 and isolate the Aitken 0.17506 -- which drops the O(1/U^2) tail term -- as the low ' +
      'outlier. The consensus C_inf re-centres toward the quadratic ~0.17511, still within the imp-3346 1e-4 band.',
    consistencyCheck:
      'Wynn eps_2 on the bottom triple {10, 15, 22.5} reproduces the imp-3407 Aitken value 0.1750631 to ~1e-6 ' +
      '(Wynn eps_2 IS the Shanks/Aitken transform), confirming the shared machinery and grid are reproduced.',
    fromAboveConvergence:
      'On the extended 4-point ladder r*U still decreases monotonically toward C_inf (0.176902 at N=400 down to ' +
      '0.175660 at N=1350), extending the imp-3407 from-above convergence one rung higher.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    thirdRouteLandsOutsideBand:
      'HONEST: the third route does NOT land inside the imp-3407 band [0.1750631, 0.1751079]; it lands 2.77e-6 ' +
      'above the band top, so the min-max accelerator span was NOT tightened (it marginally widened). The value ' +
      'IS certified only in the weaker sense that all three routes stay within the imp-3346 quoted 1e-4 precision.',
    subGapCInfNotPinnedTo1e5:
      'Named sub-gap: the three routes cluster in two groups -- Aitken 0.17506 (drops O(1/U^2)) versus quadratic ' +
      '0.17511 and the Wynn top-triple 0.17511. Whether the true C_inf is 0.17506 or 0.17511 is NOT resolved to ' +
      '1e-5 here; a 5-point ladder feeding eps_4 or a still-higher rung would be needed to discriminate.',
    certificationNotClosedForm:
      'This CERTIFIES the determined number C_inf ~ 0.1751 by cross-route agreement to 1e-4 and re-centres the ' +
      'consensus on the quadratic ~0.17511; it does NOT supply a symbolic closed form for C_inf. The numerator ' +
      'norm still reduces to a transcendental spectral-slope sup (imp-3400), so C_inf remains a NUMBER.',
    measuresRatioNotPositivity:
      'This certifies the U-scaling limit of the operator-norm capture RATIO; it does NOT construct the ' +
      'missing magnitude and does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'The 1/U scaling of the capture ratio is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator ' +
      'magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN_ASSERTIONS = [
  {
    id: 'imp3445-extended-ladder-is-higher-N-and-converges-from-above',
    why: 'The third route must use a GENUINELY higher-N ladder: the 4-point geometric U in {10,15,22.5,33.75} ' +
      'gives a top cell N = 1350 EXCEEDING the imp-3407 maximum N = 900, and r*U must DECREASE monotonically ' +
      '(the same from-above convergence, extended one rung).',
    holds: () => monotoneDecreasing && maxN > 900 && rU[0] > rU[rU.length - 1],
  },
  {
    id: 'imp3445-wynn-bottom-triple-reproduces-imp3407-aitken',
    why: 'Consistency check: Wynn eps_2 on the bottom triple {10,15,22.5} IS the Shanks/Aitken transform, so it ' +
      'must reproduce the imp-3407 Aitken value 0.1750631 to ~1e-6, confirming the shared machinery/grid.',
    holds: () => wynnReproducesAitken < 1e-5,
  },
  {
    id: 'imp3445-third-estimate-lands-in-C_inf-band',
    why: 'The third estimate (Wynn Shanks on the top triple) must land in the broad C_inf band [0.173, 0.177]; ' +
      'a value outside would mean the constant is route-dependent at the 1e-3 level.',
    holds: () => thirdEstimate > 0.173 && thirdEstimate < 0.177,
  },
  {
    id: 'imp3445-third-route-agrees-with-imp3407-quadratic-to-3e-6',
    why: 'THE PRIMARY DELIVERABLE: the third independent route must AGREE with the imp-3407 quadratic Richardson ' +
      'value 0.1751079 to within ~3e-6 -- an order of magnitude tighter than the 4.5e-5 Aitken-vs-quadratic spread ' +
      '-- confirming the higher-order / higher-N consensus at ~0.17511.',
    holds: () => thirdVsQuadratic < 5e-6,
  },
  {
    id: 'imp3445-third-route-within-imp3346-quoted-precision',
    why: 'The third route must agree with the imp-3346 headline C_inf = 0.1751 to within its quoted 1e-4 precision.',
    holds: () => thirdVsImp3346 < QUOTED_PRECISION,
  },
  {
    id: 'imp3445-honest-third-route-lands-just-above-band-span-not-tightened',
    why: 'MANDATORY HONESTY: the third route does NOT fall strictly inside the imp-3407 band [0.1750631, 0.1751079] ' +
      '-- it lands ~2.77e-6 above the band top -- and the min-max accelerator span did NOT tighten. Recording ' +
      'the false-negative faithfully; a flip claiming the band tightened would over-claim.',
    holds: () => insideImp3407Band === false && spanTightened === false && gapAboveBand > 0 && gapAboveBand < 1e-5,
  },
  {
    id: 'imp3445-verdict-classified-not-indeterminate',
    why: 'The classified verdict must be the certified split, not indeterminate; a flip means the higher-N ladder, ' +
      'the Wynn consistency check, the quadratic agreement, or the imp-3346 precision check failed.',
    holds: () =>
      verdict ===
      'THIRD-ROUTE-AGREES-WITH-QUADRATIC-TO-3e-6-AND-WITHIN-imp3346-1e-4-BUT-LANDS-JUST-ABOVE-THE-imp3407-BAND-SPAN-NOT-TIGHTENED',
  },
  {
    id: 'imp3445-honest-assessment-no-qed',
    why: 'Mandatory honesty: CERTIFICATION only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
      'not attempted, C_inf is a determined number not a symbolic identity, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.subGapCInfNotPinnedTo1e5 === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3445-C-inf-third-extrapolation-wynn assertion failed: ${assertion.id}`);
  }
}

export default IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN;
