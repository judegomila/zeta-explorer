/**
 * @module imp-3240-mupass-capture-ratio-aU-grid
 * @fileoverview imp-3240 -- (a, U)-cell dependence of the imp-3197 lag-stationary
 *   Toeplitz-surrogate operator-norm CAPTURE RATIO r = ||T|| / ||Gshear|| of the
 *   genuine de Bruijn-Newman shear Gram. Does the ~3% capture deficit (equivalently
 *   the ~97% position-concentration share) have a closed form in a, U?
 *
 *   CONTEXT
 *   -------
 *   imp-3197-mupass-bridge-sign-phi-only measured, at the single headline cell
 *   (NPHI = 10, a = 0.5, U = 6), that the lag-stationary (Toeplitz) surrogate
 *     T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k),
 *   -- the stationary operator carrying EXACTLY the Phi autocorrelation as its
 *   symbol and the SAME 1D lag-marginal mass as the genuine shear Gram
 *     Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)) --
 *   captures only ~3% (ratio ~0.0298) of the true ||Gshear||, so ~97% of the norm
 *   comes from POSITION CONCENTRATION. imp-3215 then swept only the N-scaling at
 *   that base cell and found the ratio a fixed structural fraction ~0.0294 (not a
 *   grid artifact). NEITHER measured the (a, U) dependence.
 *
 *   WHAT THIS MODULE MEASURES (the imp-3240 deliverable -- MEASURE ONLY)
 *   ------------------------------------------------------------------
 *   The SAME capture ratio, rebuilt with the identical construction and
 *   power-iteration spectral norm, across the full Cartesian imp-3085 grid
 *   A_GRID x U_GRID = {0.5, 0.3, 0.2, 0.1} x {4, 6, 8, 10} at a representative
 *   resolution N = 240, and ASSESSES whether the deficit is a function of the
 *   product s = a*U (as the imp-3085 off-diagonal gap is) or of a, U separately.
 *
 *   THE FINDING (assessment, RH-equivalent, NO QED)
 *   -----------------------------------------------
 *   The capture ratio depends -- to better than 1 part in 1e3 -- on U ALONE. It is
 *   essentially INDEPENDENT of the shear weight a, and it does NOT track the product
 *   s = a*U. This is the OPPOSITE of the imp-3085 de-homogenized off-diagonal gap,
 *   which is an EXACT function of s = a*U: here equal-product cells do NOT coincide
 *   ((a,U) = (0.5,6) and (0.3,10), both s = 3, give r = 0.02967 vs 0.01801, a
 *   ~1.2e-2 mismatch). The reason is structural: Gshear = D_Phi S D_Phi with the
 *   sinh shear S(u,v) = sinh(a(v-u)) and D_Phi = diag(Phi). In the ratio ||T||/||G||
 *   the LEADING a factor of sinh(a Delta) = a Delta + O(a^3 Delta^3) cancels between
 *   numerator and denominator (both carry the same sinh), so only a vanishing
 *   O(a^2) sinh-NONLINEARITY correction survives: at U = 6 the ratio drifts only
 *   from 0.0296685 (a = 0.5) monotonically down to 0.0296646 (a = 0.05), a ~4e-6
 *   change converging to the a -> 0 linear-shear limit. The Phi kernel, by contrast,
 *   is NOT scale-covariant in U (it sits at a FIXED lag concentration ~O(0.2)
 *   regardless of the window), so the length scale is set entirely by U.
 *
 *   THE CLOSED FORM (the answer to the ticket question)
 *   ---------------------------------------------------
 *   The deficit has a clean leading closed form: r ~ C / U with C ~ 0.178. Across
 *   the whole grid r*U sits in [0.178, 0.181] (0.1783 at U = 4, 0.1780 at U = 6,
 *   0.1787 at U = 8, 0.1801 at U = 10), a slowly rising near-constant. So the
 *   capture ratio scales like the INVERSE lag window, and equivalently the
 *   position-concentration share 1 - r ~ 1 - C/U rises toward 1 as U grows: the
 *   fixed-width Phi mass becomes an ever-smaller fraction of the widening window, so
 *   the lag-stationary surrogate under-reports the concentrated norm by a factor
 *   ~U/C. The headline cell a = 0.5, U = 6 gives r = 0.02967 ~ 0.178/6, reproducing
 *   the imp-3197 ~3% capture. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the parent single-cell MAGNITUDE probe)
 *   @see imp-3215-mupass-capture-ratio-n-scaling.js (the N-scaling at the base cell only)
 *   @see imp-3085-hankel-gap-aU-grid.js (the off-diagonal gap that DOES track s = a*U -- the contrast)
 *
 *   Ticket: imp-3240 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid), identical to imp-3197 / imp-3215
const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]); // shear weights (imp-3085 grid; imp-3197 headline a = 0.5)
const U_GRID = Object.freeze([4, 6, 8, 10]); // lag cutoffs (imp-3085 grid; imp-3197 headline U = 6)
const N = 240; // representative resolution (imp-3197 used N in {160,240,320}; imp-3215 pins N-stability)
const ITERS = 350; // power-iteration steps (converges the ratio to better than 1e-6 at this N)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3197 / imp-3215). */
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

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3197 / imp-3215). */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
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

/** One (a, U) cell: build Gshear and the lag-stationary surrogate T at grid N, return both norms + capture ratio. */
function captureAt(a, U) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  // Per-lag autocorrelation profile Abar(k) = (1 / (N - k)) sum_i Phi_i Phi_{i+k} -- identical to imp-3197.
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
  return {
    a,
    U,
    s: a * U,
    normGshear,
    normLagStationary,
    ratio,
    ratioTimesU: ratio * U, // the 1/U-law diagnostic: near-constant ~0.178 across the grid
    positionConcentrationFraction: 1 - ratio,
  };
}

// Full Cartesian a x U grid of capture ratios.
const GRID = Object.freeze(A_GRID.flatMap((a) => U_GRID.map((U) => captureAt(a, U))));

// --- (1) a-INDEPENDENCE at fixed U: max relative spread of the ratio across the four a values, per U column.
let maxRelativeSpreadAcrossA = 0;
for (const U of U_GRID) {
  const col = GRID.filter((c) => c.U === U).map((c) => c.ratio);
  const lo = Math.min(...col);
  const hi = Math.max(...col);
  const rel = (hi - lo) / hi;
  if (rel > maxRelativeSpreadAcrossA) maxRelativeSpreadAcrossA = rel;
}

// --- (2) s = a*U NON-invariance: equal-product cells do NOT coincide (the imp-3085 contrast).
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 3.0, cellA: captureAt(0.5, 6), cellB: captureAt(0.3, 10) }),
  Object.freeze({ s: 2.0, cellA: captureAt(0.5, 4), cellB: captureAt(0.2, 10) }),
  Object.freeze({ s: 1.2, cellA: captureAt(0.3, 4), cellB: captureAt(0.2, 6) }),
]);
let maxEqualProductMismatch = 0;
for (const p of EQUAL_PRODUCT_PAIRS) {
  maxEqualProductMismatch = Math.max(maxEqualProductMismatch, Math.abs(p.cellA.ratio - p.cellB.ratio));
}

// --- (3) THE 1/U CLOSED FORM: r*U is a near-constant ~0.178 across the whole grid.
const ratioTimesUValues = GRID.map((c) => c.ratioTimesU);
const ratioTimesUMin = Math.min(...ratioTimesUValues);
const ratioTimesUMax = Math.max(...ratioTimesUValues);
const inverseUConstantC = ratioTimesUValues.reduce((s, x) => s + x, 0) / ratioTimesUValues.length; // ~0.178

// --- (4) a -> 0 CONVERGENCE at fixed U = 6: the residual a-dependence is a vanishing sinh-nonlinearity.
const A_LADDER_AT_U6 = Object.freeze([0.5, 0.4, 0.3, 0.2, 0.1, 0.05]);
const aLadderRatios = A_LADDER_AT_U6.map((a) => captureAt(a, 6).ratio);
let aLadderMonotoneDecreasing = true;
for (let i = 1; i < aLadderRatios.length; i++) {
  if (!(aLadderRatios[i] < aLadderRatios[i - 1])) aLadderMonotoneDecreasing = false;
}
const aLadderTotalDrift = aLadderRatios[0] - aLadderRatios[aLadderRatios.length - 1]; // ~4e-6

const headlineCell = captureAt(0.5, 6); // must reproduce imp-3197 / imp-3215 ~0.0297
const closedFormMatchesHeadline = Math.abs(headlineCell.ratio - inverseUConstantC / 6) < 2e-3;

const verdict =
  maxRelativeSpreadAcrossA < 1e-3 &&
  maxEqualProductMismatch > 1e-3 &&
  ratioTimesUMin > 0.17 &&
  ratioTimesUMax < 0.19
    ? 'CAPTURE-RATIO-IS-A-FUNCTION-OF-U-ALONE-NOT-aU-PRODUCT-CLOSED-FORM-C-OVER-U'
    : 'INDETERMINATE';

export const IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID = Object.freeze({
  id: 'imp-3240-mupass-capture-ratio-aU-grid',
  ticket: 'imp-3240',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDiagnostic: 'imp-3197-mupass-bridge-sign-phi-only.js',
  relatedNScaling: 'imp-3215-mupass-capture-ratio-n-scaling.js',
  contrastGapSweep: 'imp-3085-hankel-gap-aU-grid.js',

  summary:
    '(a, U)-cell dependence of the imp-3197 lag-stationary Toeplitz-surrogate ' +
    'operator-norm CAPTURE RATIO r = ||T|| / ||Gshear|| of the genuine de Bruijn-Newman ' +
    'shear Gram, swept across the imp-3085 grid {0.5,0.3,0.2,0.1} x {4,6,8,10} at N = 240. ' +
    'FINDING: the ~3% capture deficit is a function of U ALONE (to better than 1 part in ' +
    '1e3) -- essentially INDEPENDENT of a and NOT a function of the product s = a*U. This ' +
    'is the OPPOSITE of the imp-3085 off-diagonal gap (an exact function of s = a*U): equal- ' +
    'product cells do NOT coincide here ((0.5,6) and (0.3,10), both s = 3, give r = 0.02967 ' +
    'vs 0.01801). The leading a factor of sinh(a Delta) cancels between ||T|| and ||Gshear|| ' +
    '(both carry the same sinh), leaving only a vanishing O(a^2) sinh-nonlinearity: at U = 6 ' +
    'the ratio drifts monotonically from 0.0296685 (a = 0.5) to 0.0296646 (a = 0.05), a ~4e-6 ' +
    'change converging to the a -> 0 linear-shear limit. The CLOSED FORM is r ~ C/U with ' +
    'C ~ 0.178: r*U sits in [0.178, 0.181] across the grid, so the position-concentration ' +
    'share 1 - r ~ 1 - C/U rises toward 1 as the window widens (the fixed-width Phi mass ' +
    'becomes an ever-smaller fraction of the window). The headline a = 0.5, U = 6 gives ' +
    'r = 0.02967 ~ 0.178/6, reproducing the imp-3197 ~3% capture. Assessment only; ' +
    'RH-equivalent; carries NO RH verdict and NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))  =  D_Phi S D_Phi, S(u,v) = sinh(a(v-u))',
    lagStationarySurrogate: 'T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k)',
    captureRatio: 'r = ||T|| / ||Gshear||  (both unscaled; the common quadrature weight H = U/N cancels)',
    aGrid: A_GRID.slice(),
    uGrid: U_GRID.slice(),
    N,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M (identical to imp-3197)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID, // every (a,U) cell: s, ||Gshear||, ||T||, ratio, ratio*U, position share
    maxRelativeSpreadAcrossA, // ~2.5e-4: the ratio is a-independent to <1 part in 1e3 at fixed U
    equalProductPairs: EQUAL_PRODUCT_PAIRS, // s = a*U pairs that do NOT coincide (the imp-3085 contrast)
    maxEqualProductMismatch, // ~1.2e-2: the ratio is NOT a function of s = a*U
    ratioTimesUMin, // ~0.178
    ratioTimesUMax, // ~0.181
    inverseUConstantC, // ~0.178: the C in the r ~ C/U closed form
    headlineRatio: headlineCell.ratio, // ~0.02967 at (0.5,6), reproduces imp-3197 / imp-3215
    closedFormMatchesHeadline, // 0.178/6 ~ headline ratio to <2e-3
    aLadderAtU6: A_LADDER_AT_U6.slice(), // a-ladder probing the residual sinh-nonlinearity at U = 6
    aLadderRatios, // monotone decreasing toward the a -> 0 linear-shear limit
    aLadderMonotoneDecreasing, // true -> residual a-dependence is a vanishing sinh-nonlinearity
    aLadderTotalDrift, // ~4e-6: the full a-range drift, three orders below the ratio itself
    verdict, // CAPTURE-RATIO-IS-A-FUNCTION-OF-U-ALONE-NOT-aU-PRODUCT-CLOSED-FORM-C-OVER-U
  }),

  interpretation: Object.freeze({
    ratioIsUOnly:
      'The capture ratio depends on the lag window U alone, not on the shear weight a and not on the product ' +
      's = a*U. Both ||Gshear|| and ||T|| carry the SAME sinh(a Delta) factor, whose leading a Delta term ' +
      'cancels in the ratio; only the O(a^2) sinh-nonlinearity survives as a ~4e-6 drift over a in [0.05, 0.5]. ' +
      'The length scale is therefore set entirely by U, because the de Bruijn-Newman Phi kernel is NOT ' +
      'scale-covariant in U -- it sits at a fixed lag concentration regardless of the window width.',
    contrastWithGapSweep:
      'This is the OPPOSITE structure to the imp-3085 de-homogenized off-diagonal gap, which is an EXACT ' +
      'function of s = a*U (equal-product cells coincide to machine precision there). The two diagnostics ' +
      'measure different invariants: the off-diagonal obstruction tracks the a*U scale of the monomial R, while ' +
      'the position-concentration deficit tracks the window U of the genuine Phi Gram.',
    closedForm:
      'The deficit has the clean leading closed form r ~ C/U with C ~ 0.178: the capture ratio is the inverse ' +
      'lag window times a near-constant. Equivalently the position-concentration share 1 - r ~ 1 - C/U rises ' +
      'toward 1 as U grows, because the fixed-width Phi mass becomes an ever-smaller fraction of the widening ' +
      'window, so the lag-stationary surrogate under-reports the concentrated norm by a factor ~U/C.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresRatioNotPositivity:
      'This module measures only the (a, U)-dependence of the operator-norm capture RATIO; it does NOT ' +
      'construct the missing magnitude and does NOT attempt the K_a >= 0 positivity.',
    closedFormIsLeadingOrderNotExact:
      'r ~ C/U is a LEADING-ORDER closed form: r*U rises slowly from ~0.178 (U <= 6) to ~0.181 (U = 10) rather ' +
      'than being exactly constant, so C carries a mild residual U-dependence. It is an asymptotic law, not an ' +
      'identity.',
    necessaryNotSufficient:
      'The U-only scaling of the position-concentration deficit is diagnostic; the imp-3066 off-diagonal ' +
      'endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3240-grid-shape-and-reproduces-headline',
    why: 'The sweep covers the full Cartesian A_GRID x U_GRID, and the (0.5,6) cell must reproduce the imp-3197 ' +
      '/ imp-3215 headline capture ratio ~0.0297. A count drift means a dropped/duplicated cell; a headline ' +
      'mismatch means the surrogate build drifted from the parent.',
    holds: () =>
      GRID.length === A_GRID.length * U_GRID.length &&
      headlineCell.ratio > 0.029 &&
      headlineCell.ratio < 0.031,
  },
  {
    id: 'imp3240-ratio-is-a-independent-at-fixed-U',
    why: 'THE FIRST HALF OF THE FINDING: at each fixed U the capture ratio is the same across all four shear ' +
      'weights a to better than 1 part in 1e3, because the leading a factor of sinh(a Delta) cancels between ' +
      '||T|| and ||Gshear||. A large spread would mean the deficit genuinely depends on a.',
    holds: () => maxRelativeSpreadAcrossA < 1e-3,
  },
  {
    id: 'imp3240-ratio-not-a-function-of-aU-product',
    why: 'THE KEY CONTRAST WITH imp-3085: equal-product (s = a*U) cells do NOT coincide -- the capture ratio is ' +
      'NOT a function of the a*U product (unlike the imp-3085 de-homogenized off-diagonal gap, which is). The ' +
      'mismatch must be O(1e-2), orders above the a-independence spread.',
    holds: () => maxEqualProductMismatch > 1e-3 && maxEqualProductMismatch > 10 * maxRelativeSpreadAcrossA,
  },
  {
    id: 'imp3240-inverse-U-closed-form',
    why: 'THE CLOSED-FORM DELIVERABLE: r ~ C/U with C ~ 0.178 -- r*U is a near-constant across the whole grid, ' +
      'sitting in [0.17, 0.19], and the headline (0.5,6) ratio matches C/6. A departure would falsify the 1/U ' +
      'scaling of the position-concentration deficit.',
    holds: () =>
      ratioTimesUMin > 0.17 &&
      ratioTimesUMax < 0.19 &&
      inverseUConstantC > 0.17 &&
      inverseUConstantC < 0.19 &&
      closedFormMatchesHeadline,
  },
  {
    id: 'imp3240-residual-a-dependence-is-vanishing-sinh-nonlinearity',
    why: 'The residual a-dependence at fixed U = 6 is a vanishing O(a^2) sinh-nonlinearity: the ratio decreases ' +
      'monotonically as a -> 0 (toward the linear-shear limit) and the FULL drift over a in [0.05, 0.5] is ' +
      'below 1e-4, three orders under the ratio itself. A non-monotone or large drift would contradict the ' +
      'sinh-cancellation explanation.',
    holds: () => aLadderMonotoneDecreasing && aLadderTotalDrift > 0 && aLadderTotalDrift < 1e-4,
  },
  {
    id: 'imp3240-verdict-U-only-closed-form',
    why: 'The classified verdict must be the U-only / closed-form-C-over-U split, not indeterminate; a flip means ' +
      'the a-independence, the a*U non-invariance, or the 1/U band failed.',
    holds: () => verdict === 'CAPTURE-RATIO-IS-A-FUNCTION-OF-U-ALONE-NOT-aU-PRODUCT-CLOSED-FORM-C-OVER-U',
  },
  {
    id: 'imp3240-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
      'not attempted, the closed form is leading-order not exact, PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.closedFormIsLeadingOrderNotExact === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3240-mupass-capture-ratio-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID;
