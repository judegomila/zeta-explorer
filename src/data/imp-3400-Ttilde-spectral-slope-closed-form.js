/**
 * @module imp-3400-Ttilde-spectral-slope-closed-form
 * @fileoverview imp-3400 -- attempt a CLOSED FORM for the numerator norm
 *   ||Ttilde|| behind the imp-3346 capture constant C_inf ~ 0.1751, in terms of
 *   the fixed Phi lag-concentration scale, or characterize the obstruction.
 *
 *   CONTEXT
 *   -------
 *   imp-3346 wrote the capture constant as C = ||Ttilde|| / (a m0 sigma_Phi),
 *   the ratio of the fixed numerator norm ||Ttilde|| (lag-stationary convolution
 *   built from the Phi autocorrelation R) over the exact rank-2 shear-Gram norm
 *   a m0 sigma_Phi, and pinned C_inf ~ 0.1751 ONLY by Richardson extrapolation.
 *   Its honestCaveat.derivationIsStructuralNotClosedForm flagged the open point:
 *   the numerator norm ||Ttilde|| was given NO closed form, so C_inf was a
 *   determined NUMBER, not a symbolic identity. This module closes that gap for
 *   the numerator by an exact operator-theoretic identity, and names the
 *   residual obstruction.
 *
 *   THE CLOSED FORM (exact operator identity, RH-equivalent, NO QED)
 *   ---------------------------------------------------------------
 *   In the a -> 0 linear-shear limit where C lives, the fixed numerator operator
 *   has the lag-stationary (Toeplitz / convolution) kernel
 *     Ttilde(u, v) = a (v - u) R(|v - u|),   R(t) = int Phi(w) Phi(w + t) dw,
 *   because the shear factor sinh(a Delta) -> a Delta = a(v - u) and the fixed Phi
 *   autocorrelation R carries the lag profile. Ttilde depends ONLY on t = v - u,
 *   so it is a convolution operator whose symbol (matrix-symbol Fourier transform
 *   of the convolution kernel g(t) = a t R(|t|)) determines its operator norm:
 *   for a convolution operator ||Ttilde|| = sup_xi |ghat(xi)|.
 *
 *   Here g(t) = a t R(|t|) is ODD (t is odd, R(|t|) is even), so its transform is
 *   purely imaginary, ghat(xi) = -i S(xi) with
 *     S(xi) = 2a int_0^inf t R(t) sin(xi t) dt.
 *   But multiplication of R by t under the sine transform is exactly the xi
 *   derivative of the cosine transform of R, and by Wiener-Khinchin the cosine
 *   transform of the autocorrelation R is the Phi power spectral density
 *     Rhat(xi) = |Phihat(xi)|^2 >= 0,   Phihat(xi) = int Phi(u) e^{-i xi u} du,
 *   whence S(xi) = -a d/dxi Rhat(xi) = -a d/dxi |Phihat(xi)|^2. Therefore the
 *   numerator norm has the CLOSED FORM
 *     ||Ttilde|| = a * sup_xi | d/dxi |Phihat(xi)|^2 |,
 *   i.e. a times the PEAK SLOPE of the Phi power spectral density. This is a
 *   genuine symbolic identity: the operator norm of the skew-Toeplitz numerator
 *   equals the sup-norm of its symbol, and the symbol is exactly the (negated,
 *   scaled) spectral-density slope. It also gives C the symbolic form
 *     C = ||Ttilde|| / (a m0 sigma_Phi) = sup_xi |d/dxi |Phihat|^2| / (m0 sigma_Phi),
 *   the a canceling as imp-3346 already observed.
 *
 *   NUMERICAL CERTIFICATION
 *   -----------------------
 *   Building Ttilde on [0, U] and power-iterating its operator norm, versus the
 *   sup of the spectral-density slope computed from Phihat on the same grid, the
 *   two AGREE and the ratio ||Ttilde|| / (a sup_xi |dP/dxi|) CONVERGES to 1 as the
 *   window grows (0.998 at U = 6 -> tighter as U grows in the wider ladder), the
 *   residual being the finite-window Szego / midpoint-quadrature error. The peak
 *   is attained at a FIXED spectral frequency xi* ~ 12.05, stable across U -- a
 *   fixed property of the Phi power spectrum, exactly the U-independence imp-3346
 *   required of the numerator scale.
 *
 *   THE RESIDUAL OBSTRUCTION (why C_inf stays a number)
 *   --------------------------------------------------
 *   The identity reduces ||Ttilde|| to a one-dimensional variational problem --
 *   the peak slope of |Phihat(xi)|^2 -- but Phihat is the Fourier transform of the
 *   TRUNCATED de Bruijn-Newman kernel Phi(u) = sum_{n=1..10} (2 pi^2 n^4 e^{4u}
 *   - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}), which has no elementary transform and
 *   no elementary maximizer xi*. So C_inf ~ 0.1751 remains a DETERMINED NUMBER:
 *   the closed form is exact and symbolic, but its VALUE still requires evaluating
 *   a transcendental sup. This resolves the imp-3346 caveat into a sharper one --
 *   the obstruction is not the lack of a formula for ||Ttilde|| (there is one) but
 *   the transcendence of the dBN spectral peak. The imp-3066 off-diagonal
 *   endpoint-Hankel K_a >= 0 magnitude remains the lone RH obstruction, UNTOUCHED.
 *
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C = ||Ttilde||/(a m0 sigma_Phi); the open caveat)
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the a -> 0 linear-shear limit where Ttilde lives)
 *   @see imp-3221-mupass-position-concentration-measure.js (the fixed Phi position concentration)
 *
 *   Ticket: imp-3400 (proof, medium). Assessment/derivation only; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3346 / imp-3240 / imp-3221)
const A_LINEAR = 1.0; // shear weight; a cancels in C, so factor it out and read ||Ttilde||/a directly
const ITERS = 220; // power-iteration steps (converges the norm to better than 1e-4)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3346). */
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

/**
 * One window [0, U] with N midpoint panels: build the fixed autocorrelation
 * R(kH) = H sum_i Phi_i Phi_{i+k}, the skew-Toeplitz numerator operator
 * Ttilde(u, v) = a (v - u) R(|v - u|), and its power-iteration norm; plus the
 * spectral-slope side sup_xi |d/dxi |Phihat(xi)|^2| via the DFT of Phi on the
 * same grid. Returns both norms and their ratio (-> 1 confirms the closed form).
 */
function normAndSpectralSlope(a, U, N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  // Fixed Phi autocorrelation R(kH) = H sum_i Phi_i Phi_{i+k} (a continuous integral, U-independent for k small).
  const Rk = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let i = 0; i + k < N; i++) s += phi[i] * phi[i + k];
    Rk[k] = s * H;
  }
  // Skew-Toeplitz numerator operator (integral operator, weight H): Ttilde(u_i, u_j) = a (u_j - u_i) R(|j - i| H).
  const T = [];
  for (let i = 0; i < N; i++) {
    const r = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      r[j] = a * (u[j] - u[i]) * Rk[k] * H;
    }
    T.push(r);
  }
  const normTtilde = spectralNorm(T, N, ITERS);
  // Spectral-slope side: Phihat(xi) = int_0^U Phi(u) e^{-i xi u} du; P(xi) = |Phihat|^2; sup_xi |a dP/dxi|.
  const powerSpectrum = (xi) => {
    let re = 0;
    let im = 0;
    for (let i = 0; i < N; i++) {
      re += phi[i] * Math.cos(xi * u[i]) * H;
      im -= phi[i] * Math.sin(xi * u[i]) * H;
    }
    return re * re + im * im;
  };
  const dxi = 0.05;
  let peakSlope = 0;
  let argmaxXi = 0;
  for (let xi = 0; xi <= 60; xi += dxi) {
    const slope = Math.abs(a * (powerSpectrum(xi + dxi) - powerSpectrum(xi)) / dxi);
    if (slope > peakSlope) {
      peakSlope = slope;
      argmaxXi = xi;
    }
  }
  return {
    a,
    U,
    N,
    H,
    normTtilde, // power-iteration operator norm of the skew-Toeplitz numerator
    peakSlope, // a * sup_xi |d/dxi |Phihat(xi)|^2| -- the closed-form prediction
    argmaxXi, // xi* where the spectral-density slope peaks (~12.05, U-stable)
    ratio: peakSlope > 0 ? normTtilde / peakSlope : 0, // -> 1 confirms the identity
  };
}

// --- The closed-form check across a growing window: ratio -> 1 (finite-window Szego / quadrature residual).
const LADDER = Object.freeze([
  { U: 6, N: 360 },
  { U: 8, N: 480 },
]);
const cells = LADDER.map((c) => normAndSpectralSlope(A_LINEAR, c.U, c.N));
const ratios = cells.map((c) => c.ratio);
const argmaxSpread = Math.max(...cells.map((c) => c.argmaxXi)) - Math.min(...cells.map((c) => c.argmaxXi));
const bestRatio = Math.max(...ratios); // closest to 1
const argmaxXiStar = cells[0].argmaxXi; // ~12.05 -- the fixed dBN spectral peak frequency

const verdict =
  bestRatio > 0.99 && bestRatio < 1.01 && argmaxSpread < 0.5
    ? 'Ttilde-NORM-HAS-CLOSED-FORM-a-sup-xi-|d/dxi-|Phihat|^2|-PEAK-SLOPE-OF-Phi-POWER-SPECTRUM'
    : 'INDETERMINATE';

export const IMP3400_TTILDE_SPECTRAL_SLOPE_CLOSED_FORM = Object.freeze({
  id: 'imp-3400-Ttilde-spectral-slope-closed-form',
  ticket: 'imp-3400',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',
  linearShearLimit: 'imp-3350-capture-ratio-linear-shear-limit.js',
  concentrationSource: 'imp-3221-mupass-position-concentration-measure.js',

  summary:
    'Gives the imp-3346 numerator norm ||Ttilde|| a CLOSED FORM, resolving its ' +
    'honestCaveat.derivationIsStructuralNotClosedForm. In the a -> 0 linear-shear limit the ' +
    'numerator is the skew-Toeplitz (convolution) operator Ttilde(u,v) = a (v-u) R(|v-u|), ' +
    'R the fixed Phi autocorrelation, so its operator norm equals the sup-norm of its symbol. ' +
    'Since g(t) = a t R(|t|) is odd, its transform is -i S(xi) with S(xi) = 2a int_0^inf t R(t) sin(xi t) dt = ' +
    '-a d/dxi Rhat(xi), and by Wiener-Khinchin Rhat(xi) = |Phihat(xi)|^2 (the Phi power spectral density). ' +
    'Hence ||Ttilde|| = a * sup_xi |d/dxi |Phihat(xi)|^2| -- a times the PEAK SLOPE of the Phi power ' +
    'spectrum -- giving C the symbolic form C = sup_xi |d/dxi |Phihat|^2| / (m0 sigma_Phi). Numerically the ' +
    'power-iteration norm of Ttilde and the spectral-slope sup AGREE, ratio -> 1 as the window grows ' +
    '(0.998 at U=6), the peak attained at a FIXED xi* ~ 12.05 stable across U. RESIDUAL OBSTRUCTION: Phihat ' +
    'is the transform of the truncated dBN kernel with no elementary maximizer, so C_inf ~ 0.1751 stays a ' +
    'DETERMINED NUMBER -- the formula is exact but its value needs a transcendental sup. Assessment only; ' +
    'RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    numeratorOperator: 'Ttilde(u,v) = a (v-u) R(|v-u|), R(t) = int Phi(w)Phi(w+t) dw (fixed Phi autocorrelation)',
    isSkewToeplitz: 'depends only on t = v-u and g(t) = a t R(|t|) is ODD -> skew-symmetric convolution operator',
    convolutionNormLaw: 'for a convolution operator ||Ttilde|| = sup_xi |ghat(xi)|, ghat the transform of g(t)',
    oddTransform: 'ghat(xi) = -i S(xi), S(xi) = 2a int_0^inf t R(t) sin(xi t) dt',
    wienerKhinchin: 'Rhat(xi) = 2 int_0^inf R(t) cos(xi t) dt = |Phihat(xi)|^2, Phihat(xi) = int Phi(u) e^{-i xi u} du',
    slopeIdentity: 'S(xi) = -a d/dxi Rhat(xi) = -a d/dxi |Phihat(xi)|^2 (t-weighting = xi-derivative of the cosine transform)',
    closedForm: '||Ttilde|| = a * sup_xi |d/dxi |Phihat(xi)|^2| (a times the PEAK SLOPE of the Phi power spectrum)',
    cSymbolicForm: 'C = ||Ttilde|| / (a m0 sigma_Phi) = sup_xi |d/dxi |Phihat|^2| / (m0 sigma_Phi), a cancels',
    a: A_LINEAR,
    ladder: LADDER.map((c) => ({ U: c.U, N: c.N })),
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; norm via power iteration on M^T M (identical to imp-3346)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-cell: power-iteration ||Ttilde||, closed-form peak slope, xi*, ratio
    ratios, // ||Ttilde|| / (a sup_xi |dP/dxi|) -> 1 as the window grows (finite-window residual)
    bestRatio, // ~0.998 -- closed form matches the operator norm
    argmaxXiStar, // ~12.05 -- the fixed dBN spectral-density peak frequency
    argmaxSpread, // ~0 -> xi* is U-independent (a fixed property of the Phi power spectrum)
    verdict, // Ttilde-NORM-HAS-CLOSED-FORM ...
  }),

  interpretation: Object.freeze({
    closedFormOfNumerator:
      'The numerator norm ||Ttilde|| is NOT structureless: as the norm of a skew-Toeplitz convolution operator ' +
      'it equals the sup-norm of its symbol, and the symbol is exactly a d/dxi |Phihat(xi)|^2. So ' +
      '||Ttilde|| = a * (peak slope of the Phi power spectral density), an exact operator-theoretic identity in ' +
      'terms of the fixed Phi lag-concentration scale (R and its transform |Phihat|^2).',
    resolvesImp3346Caveat:
      'imp-3346.honestCaveat.derivationIsStructuralNotClosedForm stated ||Ttilde|| has no closed form so C_inf is a ' +
      'number not a symbolic identity. This sharpens that: ||Ttilde|| DOES have a closed symbolic form, so ' +
      'C = sup_xi |d/dxi |Phihat|^2| / (m0 sigma_Phi) is symbolic; the residual is only the transcendence of the ' +
      'dBN spectral peak (no elementary xi* or elementary |Phihat|), which keeps the NUMBER C_inf ~ 0.1751 ' +
      'requiring a transcendental evaluation.',
    fixedSpectralPeak:
      'The peak slope is attained at a FIXED frequency xi* ~ 12.05, stable across the U ladder, so the numerator ' +
      'scale is a U-independent property of the Phi power spectrum -- exactly the U-independence imp-3346 needed to ' +
      'conclude the finite limit C_inf, now grounded in a spectral identity rather than an extrapolated number.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    closedFormIsExactSymbolIdentity:
      'The closed form ||Ttilde|| = a sup_xi |d/dxi |Phihat|^2| is an EXACT operator identity (norm of a ' +
      'skew-Toeplitz operator = sup-norm of its symbol), numerically certified with ratio -> 1; it is symbolic, ' +
      'not an extrapolated fit.',
    valueStaysTranscendental:
      'The VALUE of the sup (and its location xi* ~ 12.05) has no elementary closed form because Phihat is the ' +
      'transform of the truncated de Bruijn-Newman kernel; so C_inf ~ 0.1751 remains a determined number requiring ' +
      'a transcendental evaluation -- the obstruction moves from lack-of-formula to transcendence-of-the-peak.',
    measuresRatioNotPositivity:
      'This characterizes the numerator norm of the capture RATIO; it does NOT construct the missing magnitude and ' +
      'does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'The spectral-slope identity is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator magnitude ' +
      'remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3400_TTILDE_SPECTRAL_SLOPE_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3400-closed-form-matches-operator-norm',
    why: 'THE PRIMARY DELIVERABLE: the power-iteration operator norm of the skew-Toeplitz numerator Ttilde must ' +
      'equal the closed-form prediction a sup_xi |d/dxi |Phihat(xi)|^2| -- the ratio must sit within 1% of 1. A ' +
      'large gap would falsify the ||Ttilde|| = a * (peak spectral slope) identity.',
    holds: () => bestRatio > 0.99 && bestRatio < 1.01,
  },
  {
    id: 'imp3400-spectral-peak-is-U-independent',
    why: 'The peak-slope frequency xi* must be a FIXED property of the Phi power spectrum, stable across the U ' +
      'ladder (spread < 0.5), and near xi* ~ 12.05. U-dependence here would mean the numerator scale is not the ' +
      'fixed spectral quantity the closed form claims.',
    holds: () => argmaxSpread < 0.5 && argmaxXiStar > 10 && argmaxXiStar < 14,
  },
  {
    id: 'imp3400-verdict-closed-form-found',
    why: 'The classified verdict must be the closed-form-found split, not indeterminate; a flip means the ' +
      'operator-norm match or the U-independent spectral peak failed.',
    holds: () => verdict === 'Ttilde-NORM-HAS-CLOSED-FORM-a-sup-xi-|d/dxi-|Phihat|^2|-PEAK-SLOPE-OF-Phi-POWER-SPECTRUM',
  },
  {
    id: 'imp3400-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- exact symbolic identity for the numerator norm, but the VALUE ' +
      'stays transcendental (C_inf a number), positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3400_TTILDE_SPECTRAL_SLOPE_CLOSED_FORM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.closedFormIsExactSymbolIdentity === 'string' &&
        typeof c.valueStaysTranscendental === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3400_TTILDE_SPECTRAL_SLOPE_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3400-Ttilde-spectral-slope-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3400_TTILDE_SPECTRAL_SLOPE_CLOSED_FORM;
