/**
 * @module imp-3407-C-inf-independent-extrapolation-certification
 * @fileoverview imp-3407 -- INDEPENDENTLY CERTIFY the imp-3346 capture constant
 *   C_inf ~ 0.1751 against (a) an extended, higher-N ladder and (b) a DIFFERENT
 *   extrapolation order, and report whether the two agree to within the quoted
 *   precision. Certification only; no RH verdict.
 *
 *   CONTEXT
 *   -------
 *   imp-3346 (imp-3346-capture-ratio-C-constant-derivation.js) pins the constant
 *   C in the capture-ratio law r = ||T|| / ||Gshear|| ~ C/U to
 *   C_inf ~ 0.1751 by ONE Richardson route: it takes the fixed-resolution ladder
 *   (h = 0.025 held constant, N = U/h) at U in {4,6,8,10,12,16,20}, fits
 *   r*U = C_inf + b/U from the two LINEAR-order pairs (U=10,20) and (U=16,20),
 *   and averages. Its own honestCaveat.derivationIsStructuralNotClosedForm flags
 *   that C_inf is fixed by a SINGLE first-order Richardson route with no
 *   independent cross-check. This module supplies that cross-check.
 *
 *   THE INDEPENDENT CERTIFICATION
 *   -----------------------------
 *   Two things are changed relative to imp-3346, both deliberately:
 *
 *   (a) A DIFFERENT, HIGHER-N ladder. Rather than reuse imp-3346 linear U grid
 *       and its (10,20)/(16,20) pairs, we build a GEOMETRIC ladder
 *       U in {10, 15, 22.5} (ratio 1.5) at the same fixed resolution h = 0.025,
 *       so N = U/h runs {400, 600, 900}. The top cell N = 900 EXCEEDS the
 *       imp-3346 maximum N = 800 (U=20) -- a genuinely higher-N anchor. On a
 *       geometric U ladder the tail 1/U is itself geometric, so both accelerators
 *       below act on a geometric sequence, which is where each is exact for its
 *       model tail.
 *
 *   (b) TWO different extrapolation ORDERS on that ladder:
 *         - AITKEN Delta^2 acceleration on the three r*U samples: exact for a
 *           pure C_inf + b/U (geometric) tail and the accelerator imp-3346 did
 *           NOT use.
 *         - a SECOND-ORDER (quadratic) Richardson: fit r*U = C_inf + b/U + c/U^2
 *           by interpolating the polynomial through the three (1/U, r*U) points
 *           and evaluating at 1/U = 0 (Neville/Lagrange to zero). This carries
 *           the O(1/U^2) term imp-3346 first-order route drops.
 *
 *   FINDING
 *   -------
 *   The higher-N ladder r*U DECREASES monotonically 0.176902 (U=10) ->
 *   0.176323 (U=15) -> 0.175927 (U=22.5), reproducing the imp-3346 "from above"
 *   convergence on an independent grid. The two accelerators land at
 *     Aitken   C_inf = 0.1750631
 *     quadratic C_inf = 0.1751079
 *   They AGREE with each other to ~4.5e-5 and BOTH agree with the imp-3346
 *   headline C_inf = 0.1751 to within its quoted 1e-4 precision (Aitken -3.7e-5,
 *   quadratic +7.9e-6). So C_inf ~ 0.1751 is CERTIFIED: it is stable across an
 *   independent higher-N ladder and across two distinct extrapolation orders,
 *   not an artifact of the single first-order Richardson route imp-3346 used.
 *
 *   The imp-3346 reference value 0.1751 is baked as a literal (C_INF_IMP3346)
 *   rather than imported, to keep this module free of cross-module imports for
 *   node verification; the parent computes the same number self-contained.
 *
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (the single-route C_inf ~ 0.1751)
 *   @see imp-3400-Ttilde-spectral-slope-closed-form.js (the closed form for the numerator norm)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the r ~ C/U law)
 *
 *   Ticket: imp-3407 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3346 / imp-3240)
const H0 = 0.025; // FIXED grid step (identical to imp-3346), N = U/H0 grows with U
const A_LINEAR = 0.1; // small shear weight isolating the a -> 0 linear-shear limit where C lives
const ITERS = 220; // power-iteration steps (identical to imp-3346)
const C_INF_IMP3346 = 0.1751; // imp-3346 headline C_inf, baked as a literal for the cross-check

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3346). */
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

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3346). */
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

/** One (a, U, N) cell: build Gshear and the lag-stationary surrogate T, return r and r*U (identical to imp-3346). */
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

// --- (a) INDEPENDENT HIGHER-N geometric ladder U in {10, 15, 22.5} (ratio 1.5), N = U/H0 = {400, 600, 900}.
const U_GEOMETRIC_LADDER = Object.freeze([10, 15, 22.5]);
const geomLadder = U_GEOMETRIC_LADDER.map((U) => captureAt(A_LINEAR, U, Math.round(U / H0)));
const rU = geomLadder.map((c) => c.ratioTimesU);
const invU = geomLadder.map((c) => 1 / c.U);
const maxN = Math.max(...geomLadder.map((c) => c.N)); // 900 -- exceeds the imp-3346 maximum N = 800
let geomMonotoneDecreasing = true;
for (let i = 1; i < rU.length; i++) {
  if (!(rU[i] < rU[i - 1] + 1e-9)) geomMonotoneDecreasing = false;
}

// --- (b1) AITKEN Delta^2 acceleration on the three r*U samples (accelerator imp-3346 did NOT use).
const aitkenCInf = rU[0] - (rU[1] - rU[0]) ** 2 / (rU[2] - 2 * rU[1] + rU[0]);

// --- (b2) SECOND-ORDER (quadratic) Richardson: fit r*U = C_inf + b/U + c/U^2, evaluate at 1/U = 0.
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
const quadraticCInf = lagrangeAtZero(invU, rU);

// --- Cross-checks: the two orders vs each other and vs the imp-3346 baked headline.
const routeAgreement = Math.abs(aitkenCInf - quadraticCInf); // ~4.5e-5
const aitkenVsImp3346 = Math.abs(aitkenCInf - C_INF_IMP3346); // ~3.7e-5
const quadraticVsImp3346 = Math.abs(quadraticCInf - C_INF_IMP3346); // ~7.9e-6
const QUOTED_PRECISION = 1e-4; // imp-3346 quotes C_inf ~ 0.1751 to ~1e-4

const verdict =
  geomMonotoneDecreasing &&
  maxN > 800 &&
  aitkenVsImp3346 < QUOTED_PRECISION &&
  quadraticVsImp3346 < QUOTED_PRECISION &&
  routeAgreement < QUOTED_PRECISION
    ? 'C_inf~0.1751-CERTIFIED-INDEPENDENT-HIGHER-N-LADDER-AND-TWO-EXTRAPOLATION-ORDERS-AGREE-TO-QUOTED-PRECISION'
    : 'INDETERMINATE';

export const IMP3407_C_INF_INDEPENDENT_EXTRAPOLATION_CERTIFICATION = Object.freeze({
  id: 'imp-3407-C-inf-independent-extrapolation-certification',
  ticket: 'imp-3407',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',
  numeratorClosedForm: 'imp-3400-Ttilde-spectral-slope-closed-form.js',
  parentLaw: 'imp-3240-mupass-capture-ratio-aU-grid.js',

  summary:
    'INDEPENDENTLY CERTIFIES the imp-3346 capture constant C_inf ~ 0.1751 against ' +
    'an extended higher-N ladder AND a different extrapolation order, resolving ' +
    'imp-3346 honestCaveat that C_inf was pinned by a SINGLE first-order Richardson ' +
    'route (linear fit r*U = C_inf + b/U from the U=10,20 and U=16,20 pairs, max N=800). ' +
    'This module rebuilds the fixed-resolution capture ratio r = ||T||/||Gshear|| on a ' +
    'GEOMETRIC ladder U in {10, 15, 22.5} (ratio 1.5) at the same h = 0.025, so N = U/h ' +
    'runs {400, 600, 900} and the top cell N = 900 EXCEEDS the imp-3346 maximum N = 800. ' +
    'On that ladder r*U DECREASES monotonically 0.176902 -> 0.176323 -> 0.175927 (the same ' +
    'from-above convergence, independent grid), and TWO distinct accelerators are applied: ' +
    'AITKEN Delta^2 (exact for a geometric C_inf + b/U tail) gives C_inf = 0.1750631, and a ' +
    'SECOND-ORDER quadratic Richardson r*U = C_inf + b/U + c/U^2 (Lagrange to 1/U=0, carrying the ' +
    'O(1/U^2) term the parent first-order route drops) gives C_inf = 0.1751079. The two orders ' +
    'AGREE to ~4.5e-5 and BOTH agree with the imp-3346 headline C_inf = 0.1751 to within its ' +
    'quoted 1e-4 precision (Aitken -3.7e-5, quadratic +7.9e-6). VERDICT: C_inf ~ 0.1751 is ' +
    'CERTIFIED -- stable across an independent higher-N ladder and across two extrapolation ' +
    'orders, not an artifact of the single Richardson route. Certification only; RH-equivalent; ' +
    'NO RH verdict and NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    lagStationarySurrogate: 'T(u,v) = sinh(a(v-u)) Abar(|v-u|), Abar(k) = A_Phi(k)/(N-k)',
    captureRatio: 'r = ||T|| / ||Gshear||, spectral norm via power iteration on M^T M (identical to imp-3346)',
    geometricLadder: 'U in {10, 15, 22.5} (ratio 1.5), fixed h = H0 = 0.025, N = U/H0 in {400, 600, 900}',
    higherThanParent: 'top cell N = 900 exceeds the imp-3346 maximum N = 800 (U=20)',
    aitkenAcceleration: 'C_inf = x1 - (x2-x1)^2 / (x3 - 2 x2 + x1) on the three r*U samples',
    quadraticRichardson: 'fit r*U = C_inf + b/U + c/U^2; interpolate poly through (1/U, r*U), evaluate at 1/U = 0',
    a: A_LINEAR,
    h0: H0,
    uLadder: U_GEOMETRIC_LADDER.slice(),
    iters: ITERS,
    cInfImp3346Literal: C_INF_IMP3346,
    selfComputing: true,
  }),

  measured: Object.freeze({
    uLadder: U_GEOMETRIC_LADDER.slice(),
    nLadder: geomLadder.map((c) => c.N), // {400, 600, 900}
    rU, // r*U DECREASES 0.176902 -> 0.176323 -> 0.175927
    geomMonotoneDecreasing, // true
    maxN, // 900 -- exceeds imp-3346 max N = 800
    aitkenCInf, // ~0.1750631
    quadraticCInf, // ~0.1751079
    routeAgreement, // ~4.5e-5 -- the two extrapolation orders agree
    cInfImp3346: C_INF_IMP3346, // 0.1751 baked headline
    aitkenVsImp3346, // ~3.7e-5 -- within quoted precision
    quadraticVsImp3346, // ~7.9e-6 -- within quoted precision
    quotedPrecision: QUOTED_PRECISION, // 1e-4
    verdict,
  }),

  interpretation: Object.freeze({
    certifies:
      'C_inf ~ 0.1751 is not an artifact of the single first-order Richardson route imp-3346 used. An ' +
      'INDEPENDENT geometric ladder U in {10,15,22.5} (top cell N = 900 > the imp-3346 max N = 800) fed into ' +
      'TWO distinct accelerators -- Aitken Delta^2 and a second-order quadratic Richardson carrying the ' +
      'O(1/U^2) term -- lands at 0.1750631 and 0.1751079. Both fall within the quoted 1e-4 precision of the ' +
      'parent value 0.1751, and they agree with each other to ~4.5e-5.',
    whyDifferentOrders:
      'imp-3346 fit only the first-order tail r*U = C_inf + b/U. The quadratic route additionally fits the ' +
      'O(1/U^2) curvature, and Aitken Delta^2 sums a full geometric tail; that the three values coincide to ' +
      '~1e-4 shows the residual beyond first order is small on this grid, so the parent first-order truncation ' +
      'did not bias C_inf outside its quoted band.',
    fromAboveConvergence:
      'On the independent geometric ladder r*U still decreases monotonically toward C_inf (0.176902 at U=10 ' +
      'down to 0.175927 at U=22.5), reproducing the imp-3346 convergence FROM ABOVE on a grid it never sampled.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    certificationNotClosedForm:
      'This CERTIFIES the determined number C_inf ~ 0.1751 by cross-route agreement (independent higher-N ' +
      'ladder + two extrapolation orders); it does NOT supply a symbolic closed form for C_inf. The numerator ' +
      'norm ||Ttilde|| still reduces to a transcendental spectral-slope sup (imp-3400), so C_inf remains a ' +
      'determined NUMBER, not a symbolic identity.',
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
export const IMP3407_C_INF_INDEPENDENT_EXTRAPOLATION_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3407-independent-ladder-is-higher-N-and-converges-from-above',
    why: 'The certification must use a GENUINELY independent, higher-N ladder: the geometric U in {10,15,22.5} ' +
      'gives a top cell N = 900 EXCEEDING the imp-3346 maximum N = 800, and r*U must DECREASE monotonically ' +
      '(the same from-above convergence on the new grid). A non-monotone or lower-N ladder would not certify.',
    holds: () => geomMonotoneDecreasing && maxN > 800 && rU[0] > rU[rU.length - 1],
  },
  {
    id: 'imp3407-aitken-order-lands-in-the-C_inf-band',
    why: 'The Aitken Delta^2 accelerator (an extrapolation order imp-3346 did NOT use) must land in the ' +
      'C_inf band [0.173, 0.177]. A value outside would mean the constant is route-dependent.',
    holds: () => aitkenCInf > 0.173 && aitkenCInf < 0.177,
  },
  {
    id: 'imp3407-quadratic-order-lands-in-the-C_inf-band',
    why: 'The second-order quadratic Richardson (carrying the O(1/U^2) term the parent first-order fit drops) ' +
      'must also land in the C_inf band [0.173, 0.177].',
    holds: () => quadraticCInf > 0.173 && quadraticCInf < 0.177,
  },
  {
    id: 'imp3407-two-orders-agree-with-each-other',
    why: 'THE PRIMARY DELIVERABLE (part 1): the two distinct extrapolation orders must AGREE with each other to ' +
      'within the quoted 1e-4 precision, showing C_inf is stable across extrapolation order.',
    holds: () => routeAgreement < QUOTED_PRECISION,
  },
  {
    id: 'imp3407-both-orders-agree-with-imp3346-to-quoted-precision',
    why: 'THE PRIMARY DELIVERABLE (part 2): both independent extrapolations must agree with the imp-3346 headline ' +
      'C_inf = 0.1751 to within its quoted 1e-4 precision -- the cross-check that certifies the single-route value.',
    holds: () => aitkenVsImp3346 < QUOTED_PRECISION && quadraticVsImp3346 < QUOTED_PRECISION,
  },
  {
    id: 'imp3407-verdict-certified-not-indeterminate',
    why: 'The classified verdict must be the CERTIFIED split, not indeterminate; a flip means the higher-N ' +
      'ladder, one of the two extrapolation orders, or a cross-route agreement failed.',
    holds: () =>
      verdict ===
      'C_inf~0.1751-CERTIFIED-INDEPENDENT-HIGHER-N-LADDER-AND-TWO-EXTRAPOLATION-ORDERS-AGREE-TO-QUOTED-PRECISION',
  },
  {
    id: 'imp3407-honest-assessment-no-qed',
    why: 'Mandatory honesty: CERTIFICATION only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
      'not attempted, C_inf is a determined number not a symbolic identity, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3407_C_INF_INDEPENDENT_EXTRAPOLATION_CERTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.certificationNotClosedForm === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3407_C_INF_INDEPENDENT_EXTRAPOLATION_CERTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3407-C-inf-independent-extrapolation-certification assertion failed: ${assertion.id}`);
  }
}

export default IMP3407_C_INF_INDEPENDENT_EXTRAPOLATION_CERTIFICATION;
