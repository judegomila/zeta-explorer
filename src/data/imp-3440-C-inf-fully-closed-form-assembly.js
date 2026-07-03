/**
 * @module imp-3440-C-inf-fully-closed-form-assembly
 * @fileoverview imp-3440 -- ASSEMBLE a fully closed-form capture constant
 *   C_inf from the imp-3400 closed-form NUMERATOR over the imp-3346 exact
 *   rank-2 DENOMINATOR, then TEST whether it reproduces the imp-3346 / imp-3407
 *   Richardson headline C_inf ~ 0.1751 to the quoted 1e-4 precision.
 *
 *   CONTEXT
 *   -------
 *   imp-3346 wrote the capture constant as C = ||Ttilde|| / (a m0 sigma_Phi),
 *   the fixed lag-stationary numerator norm over the exact rank-2 shear-Gram
 *   norm a m0 sigma_Phi, and pinned C_inf ~ 0.1751 ONLY by Richardson
 *   extrapolation (its honestCaveat.derivationIsStructuralNotClosedForm: the
 *   numerator norm had NO closed form, so C_inf was a determined NUMBER).
 *   imp-3400 then closed the numerator: in the a -> 0 linear-shear limit the
 *   numerator is a skew-Toeplitz (convolution) operator with kernel
 *   Ttilde(u,v) = a (v-u) R(|v-u|), R the fixed Phi autocorrelation, so its
 *   operator norm equals the sup-norm of its symbol, and the symbol is exactly
 *   the (negated, scaled) slope of the Phi power spectral density:
 *     ||Ttilde|| = a * sup_xi | d/dxi |Phihat(xi)|^2 |,   Phihat(xi) = FT of Phi.
 *   imp-3407 independently CERTIFIED the headline: an extended higher-N ladder
 *   with Aitken (0.1750631) and quadratic-Richardson (0.1751079) both land on
 *   0.1751 to within its 1e-4 quoted precision.
 *
 *   THE ASSEMBLY (what this module does)
 *   ------------------------------------
 *   Combine the two: divide the imp-3400 closed-form numerator by the imp-3346
 *   exact rank-2 denominator. The leading a cancels (imp-3346, imp-3400), so
 *     C_inf^closed = sup_xi | d/dxi |Phihat(xi)|^2 | / (M0 sigma_Phi),
 *   where the denominator is the exact rank-2 shear-Gram area a m0 sigma_Phi =
 *   a sqrt(M0 M2 - M1^2) with the Phi occupation moments M_k = int u^k Phi(u)^2 du
 *   (M0 the occupation mass, sigma_Phi = sqrt(M2/M0 - (M1/M0)^2) the position std)
 *   -- all closed-form functionals of the fixed de Bruijn-Newman Phi. Every
 *   quantity is a WINDOW-INDEPENDENT integral functional (no Richardson, no U
 *   ladder), so the assembled value is a single deterministic number.
 *
 *   THE RESULT (the test outcome, RH-equivalent, NO QED)
 *   ----------------------------------------------------
 *   The fully-closed-form value is C_inf^closed ~ 0.17372, U-INVARIANT across the
 *   integral ladder (identical to 5 sig figs for U in {6,8,10}) with the spectral
 *   peak fixed at xi* ~ 12.07 (matching the imp-3400 xi* ~ 12.05). It reproduces
 *   the imp-3346 / imp-3407 headline C_inf ~ 0.1751 to ~0.8% (a shortfall of
 *   ~1.4e-3), i.e. within ~1% but NOT within the quoted 1e-4 precision.
 *
 *   WHAT THE ~0.8% SHORTFALL EXPOSES (the residual obstruction)
 *   ----------------------------------------------------------
 *   The gap is a SYMBOL-vs-OPERATOR residual in the imp-3400 numerator identity.
 *   ||Ttilde|| = a sup_xi |d/dxi |Phihat|^2| is the sup-norm of the convolution
 *   SYMBOL; imp-3400 already reported its power-iteration operator norm matches
 *   the symbol sup only to ratio ~0.998 (a finite-window Szego / midpoint-
 *   quadrature residual that it claimed rises toward 1). Rebuilding the imp-3346
 *   Ttilde MATRIX directly (a (v-u) R(|v-u|)) and dividing by the exact rank-2
 *   matrix denominator, the ratio ||Ttilde||_matrix / (a m0 sigma_Phi) rises from
 *   BELOW -- 0.17483 (U=6) -> 0.17510 (U=24) -- converging to the Richardson
 *   headline 0.1751, whereas the closed-form symbol sup sits ~0.8% under it and
 *   is U-flat. So the closed form is a genuine symbolic identity that captures
 *   C_inf to ~1%, but its VALUE depends on the transcendental spectral sup, and
 *   the last ~0.8% is exactly the finite-operator-minus-symbol Szego gap plus the
 *   O(1/U) tail that Richardson extrapolation resolves and the symbol sup does
 *   not. This SHARPENS the imp-3346 caveat: the assembled closed form is real but
 *   NOT 1e-4-accurate, so C_inf ~ 0.1751 still requires the Richardson-extrapolated
 *   operator norm, not the symbol sup, for its last two digits. The imp-3066
 *   off-diagonal endpoint-Hankel K_a >= 0 magnitude remains the lone RH
 *   obstruction, UNTOUCHED.
 *
 *   @see imp-3400-Ttilde-spectral-slope-closed-form.js (closed-form numerator ||Ttilde|| = a sup_xi |d/dxi |Phihat|^2|)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C = ||Ttilde||/(a m0 sigma_Phi); rank-2 denominator; headline 0.1751)
 *   @see imp-3407-C-inf-independent-extrapolation-certification.js (independent certification of C_inf ~ 0.1751 to 1e-4)
 *
 *   Ticket: imp-3440 (proof, medium). Derivation/assessment only; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3346 / imp-3400 / imp-3240)
const C_INF_IMP3346 = 0.1751; // imp-3346 / imp-3407 headline C_inf, baked as a literal for the cross-check
const QUOTED_PRECISION = 1e-4; // imp-3346 quotes C_inf ~ 0.1751 to ~1e-4 (imp-3407 certified band)
const ITERS = 220; // power-iteration steps for the direct matrix-norm anchor
const XI_MAX = 60; // spectral scan range for the Phi power-spectrum slope sup
const DXI = 0.01; // finite-difference step for the spectral-density slope

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3346 / imp-3400). */
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

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3346 / imp-3400). */
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

/**
 * The FULLY CLOSED-FORM assembly on one window [0, U] with N midpoint panels
 * (all quantities are window-independent integral functionals of Phi):
 *   - denominator: exact rank-2 shear-Gram area a m0 sigma_Phi = a sqrt(M0 M2 - M1^2),
 *     M_k = int u^k Phi(u)^2 du (a cancels; here the reduced denominator M0 sigma_Phi).
 *   - numerator: sup_xi |d/dxi |Phihat(xi)|^2|, Phihat(xi) = int Phi(u) e^{-i xi u} du.
 *   - C_inf^closed = numerator / (M0 sigma_Phi).
 */
function closedFormAssembly(U, N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  // Phi occupation moments M_k = int u^k Phi^2 du (H-scaled integral): the exact rank-2 denominator.
  let M0 = 0;
  let M1 = 0;
  let M2 = 0;
  for (let i = 0; i < N; i++) {
    const w = phi[i] * phi[i] * H;
    M0 += w;
    M1 += u[i] * w;
    M2 += u[i] * u[i] * w;
  }
  const meanPos = M1 / M0;
  const sigmaPhi = Math.sqrt(Math.max(0, M2 / M0 - meanPos * meanPos));
  const gramArea = Math.sqrt(Math.max(0, M0 * M2 - M1 * M1)); // = M0 sigma_Phi (reduced rank-2 denominator)
  // Closed-form numerator: sup_xi |d/dxi |Phihat(xi)|^2|, Phihat(xi) = int Phi(u) e^{-i xi u} du.
  const powerSpectrum = (xi) => {
    let re = 0;
    let im = 0;
    for (let i = 0; i < N; i++) {
      re += phi[i] * Math.cos(xi * u[i]) * H;
      im -= phi[i] * Math.sin(xi * u[i]) * H;
    }
    return re * re + im * im;
  };
  let peakSlope = 0;
  let argmaxXi = 0;
  for (let xi = 0; xi <= XI_MAX; xi += DXI) {
    const slope = Math.abs((powerSpectrum(xi + DXI) - powerSpectrum(xi)) / DXI);
    if (slope > peakSlope) {
      peakSlope = slope;
      argmaxXi = xi;
    }
  }
  const cInfClosed = peakSlope / gramArea;
  return { U, N, H, M0, sigmaPhi, gramArea, peakSlope, argmaxXi, cInfClosed };
}

/**
 * DIRECT anchor: the imp-3346-convention Ttilde MATRIX norm over the exact rank-2
 * MATRIX denominator, C_direct = ||Ttilde||_matrix / (a sqrt(P0 P2 - P1^2)) with
 * P_k = sum_i u_i^k Phi_i^2 (raw sums, matrix-norm convention). This is imp-3346's
 * own C = ||Ttilde||/(a m0 sigma_Phi); it rises from below toward 0.1751 and is the
 * quantity Richardson extrapolates, contrasting the U-flat symbol-sup closed form.
 */
function directMatrixAnchor(U, N) {
  const H = U / N;
  const a = 1.0; // a cancels in the ratio
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const Rk = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let i = 0; i + k < N; i++) s += phi[i] * phi[i + k];
    Rk[k] = s * H; // fixed Phi autocorrelation R(kH) = int Phi Phi
  }
  const T = [];
  for (let i = 0; i < N; i++) {
    const r = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      r[j] = a * (u[j] - u[i]) * Rk[k]; // imp-3346 convention: NO extra H (matrix norm)
    }
    T.push(r);
  }
  const normTtilde = spectralNorm(T, N, ITERS);
  let P0 = 0;
  let P1 = 0;
  let P2 = 0;
  for (let i = 0; i < N; i++) {
    const w = phi[i] * phi[i];
    P0 += w;
    P1 += u[i] * w;
    P2 += u[i] * u[i] * w;
  }
  const denom = a * Math.sqrt(Math.max(0, P0 * P2 - P1 * P1)); // matrix-norm rank-2 denominator
  return { U, N, normTtilde, denom, cDirect: denom > 0 ? normTtilde / denom : 0 };
}

// --- (1) The FULLY CLOSED-FORM value across a window ladder: U-invariant, single deterministic number.
const CLOSED_LADDER = Object.freeze([
  { U: 6, N: 600 },
  { U: 8, N: 800 },
  { U: 10, N: 1000 },
]);
const closedCells = CLOSED_LADDER.map((c) => closedFormAssembly(c.U, c.N));
const cInfClosedValues = closedCells.map((c) => c.cInfClosed);
const cInfClosed = cInfClosedValues[cInfClosedValues.length - 1]; // ~0.17372
const closedSpread = Math.max(...cInfClosedValues) - Math.min(...cInfClosedValues); // ~0 -> U-invariant
const argmaxXiStar = closedCells[0].argmaxXi; // ~12.07 (matches imp-3400 xi* ~ 12.05)
const argmaxSpread =
  Math.max(...closedCells.map((c) => c.argmaxXi)) - Math.min(...closedCells.map((c) => c.argmaxXi));

// --- (2) The comparison to the imp-3346 / imp-3407 headline and its 1e-4 certified precision.
const absGap = Math.abs(cInfClosed - C_INF_IMP3346); // ~1.4e-3
const relGap = absGap / C_INF_IMP3346; // ~0.8%
const landsInsideQuotedPrecision = absGap <= QUOTED_PRECISION; // false -> exposes a residual obstruction

// --- (3) The DIRECT matrix-norm anchor: C_direct rises from below toward 0.1751 (Richardson-extrapolated),
//         contrasting the U-flat symbol-sup closed form ~0.17372.
const DIRECT_LADDER = Object.freeze([
  { U: 6, N: 240 },
  { U: 10, N: 400 },
  { U: 24, N: 960 },
]);
const directCells = DIRECT_LADDER.map((c) => directMatrixAnchor(c.U, c.N));
const cDirectValues = directCells.map((c) => c.cDirect);
const cDirectSmallU = cDirectValues[0]; // ~0.17483
const cDirectLargeU = cDirectValues[cDirectValues.length - 1]; // ~0.17510
const directRisesTowardHeadline =
  cDirectLargeU > cDirectSmallU && Math.abs(cDirectLargeU - C_INF_IMP3346) < QUOTED_PRECISION;

const verdict =
  closedSpread < 1e-4 &&
  cInfClosed > 0.17 &&
  cInfClosed < 0.18 &&
  !landsInsideQuotedPrecision &&
  relGap < 0.02 &&
  directRisesTowardHeadline
    ? 'CLOSED-FORM-C_inf~0.17372-REPRODUCES-0.1751-TO-~0.8%-NOT-1e-4-RESIDUAL-IS-SYMBOL-vs-OPERATOR-SZEGO-GAP'
    : 'INDETERMINATE';

export const IMP3440_C_INF_FULLY_CLOSED_FORM_ASSEMBLY = Object.freeze({
  id: 'imp-3440-C-inf-fully-closed-form-assembly',
  ticket: 'imp-3440',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  numeratorClosedForm: 'imp-3400-Ttilde-spectral-slope-closed-form.js',
  denominatorAndHeadline: 'imp-3346-capture-ratio-C-constant-derivation.js',
  certification: 'imp-3407-C-inf-independent-extrapolation-certification.js',

  summary:
    'ASSEMBLES a fully closed-form capture constant C_inf from the imp-3400 closed-form numerator ' +
    '||Ttilde|| = a sup_xi |d/dxi |Phihat(xi)|^2| over the imp-3346 exact rank-2 denominator a m0 sigma_Phi, ' +
    'the a cancelling: C_inf^closed = sup_xi |d/dxi |Phihat|^2| / (M0 sigma_Phi), all window-independent ' +
    'integral functionals of the fixed de Bruijn-Newman Phi (M_k = int u^k Phi^2 du, sigma_Phi the position ' +
    'std). The assembled value is C_inf^closed ~ 0.17372, U-INVARIANT across U in {6,8,10} with the spectral ' +
    'peak fixed at xi* ~ 12.07. It reproduces the imp-3346 / imp-3407 headline C_inf ~ 0.1751 to ~0.8% ' +
    '(shortfall ~1.4e-3) -- within ~1% but NOT within the quoted 1e-4 precision. The ~0.8% is a ' +
    'SYMBOL-vs-OPERATOR residual: sup_xi |d/dxi |Phihat|^2| is the convolution SYMBOL sup, which imp-3400 ' +
    'matched to the operator norm only to ratio ~0.998; rebuilding the imp-3346 Ttilde MATRIX directly, ' +
    '||Ttilde||_matrix / (a m0 sigma_Phi) rises from BELOW 0.17483 (U=6) -> 0.17510 (U=24) toward the ' +
    'Richardson headline, whereas the symbol-sup closed form is U-flat ~0.17372 under it. So the closed form ' +
    'is a real symbolic identity capturing C_inf to ~1%, but its last ~0.8% is the finite-operator-minus-symbol ' +
    'Szego gap plus the O(1/U) tail that Richardson resolves and the symbol sup does not. Assessment only; ' +
    'RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    numeratorClosedForm: 'imp-3400: ||Ttilde|| = a sup_xi |d/dxi |Phihat(xi)|^2|, Phihat(xi) = int Phi(u) e^{-i xi u} du',
    denominatorClosedForm: 'imp-3346: ||Gshear|| = a m0 sigma_Phi = a sqrt(M0 M2 - M1^2), M_k = int u^k Phi^2 du',
    assembledClosedForm: 'C_inf^closed = ||Ttilde|| / (a m0 sigma_Phi) = sup_xi |d/dxi |Phihat|^2| / (M0 sigma_Phi), a cancels',
    directAnchor: 'C_direct = ||Ttilde||_matrix / (a sqrt(P0 P2 - P1^2)), P_k = sum u^k Phi^2 (raw-sum matrix convention)',
    closedLadder: CLOSED_LADDER.map((c) => ({ U: c.U, N: c.N })),
    directLadder: DIRECT_LADDER.map((c) => ({ U: c.U, N: c.N })),
    xiMax: XI_MAX,
    dxi: DXI,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; spectral peak by finite-difference sup; matrix norm by power iteration',
    selfComputing: true,
  }),

  measured: Object.freeze({
    // (1) the fully closed-form value
    closedCells, // per-cell: M0, sigma_Phi, gramArea, peakSlope, xi*, C_inf^closed
    cInfClosedValues, // ~0.17372 across U in {6,8,10}
    cInfClosed, // ~0.17372 -- the assembled fully-closed-form capture constant
    closedSpread, // ~0 -> U-INVARIANT (all integral functionals)
    argmaxXiStar, // ~12.07 -- the fixed dBN spectral-density peak (matches imp-3400 xi* ~ 12.05)
    argmaxSpread, // ~0 -> xi* is window-independent
    // (2) the comparison to the headline and its 1e-4 precision
    cInfImp3346: C_INF_IMP3346, // 0.1751 baked headline
    quotedPrecision: QUOTED_PRECISION, // 1e-4
    absGap, // ~1.4e-3
    relGap, // ~0.8%
    landsInsideQuotedPrecision, // false -> exposes a residual obstruction
    // (3) the direct matrix-norm anchor -- rises from below toward 0.1751
    directCells, // per-cell: ||Ttilde||_matrix, denom, C_direct
    cDirectValues, // 0.17483 (U=6) -> 0.17510 (U=24)
    cDirectSmallU, // ~0.17483
    cDirectLargeU, // ~0.17510 (within 1e-4 of the headline)
    directRisesTowardHeadline, // true -> the operator norm converges to 0.1751, above the U-flat symbol sup
    verdict, // CLOSED-FORM-C_inf~0.17372-REPRODUCES-0.1751-TO-~0.8%-NOT-1e-4 ...
  }),

  interpretation: Object.freeze({
    fullyClosedFormExists:
      'Combining the imp-3400 numerator and the imp-3346 denominator gives a genuine fully-closed-form capture ' +
      'constant C_inf^closed = sup_xi |d/dxi |Phihat|^2| / (M0 sigma_Phi): a ratio of two window-independent ' +
      'integral functionals of the fixed Phi (the peak slope of the Phi power spectrum over the rank-2 shear-Gram ' +
      'area), with the a factor cancelling and NO Richardson, no U ladder. It evaluates to ~0.17372, U-invariant, ' +
      'with the spectral peak fixed at xi* ~ 12.07.',
    reproducesHeadlineToOnePercentNotToPrecision:
      'C_inf^closed ~ 0.17372 reproduces the imp-3346 / imp-3407 headline C_inf ~ 0.1751 to ~0.8% (shortfall ' +
      '~1.4e-3): within ~1% but OUTSIDE the quoted 1e-4 precision. So the closed form fixes the value to two ' +
      'significant figures, not to the certified band [0.17506, 0.17511].',
    residualIsSymbolVsOperatorSzegoGap:
      'The ~0.8% shortfall is a SYMBOL-vs-OPERATOR residual. sup_xi |d/dxi |Phihat|^2| is the convolution SYMBOL ' +
      'sup; imp-3400 matched its power-iteration operator norm only to ratio ~0.998 (a finite-window Szego / ' +
      'quadrature residual). Rebuilding the imp-3346 Ttilde MATRIX directly, ||Ttilde||_matrix / (a m0 sigma_Phi) ' +
      'rises from BELOW 0.17483 (U=6) -> 0.17510 (U=24) toward the Richardson headline, while the symbol-sup ' +
      'closed form is U-flat ~0.17372 under it. The last ~0.8% is the finite-operator-minus-symbol Szego gap plus ' +
      'the O(1/U) tail that Richardson extrapolation captures and the symbol sup cannot.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    closedFormExistsButNot1e4Accurate:
      'The assembled C_inf^closed = sup_xi |d/dxi |Phihat|^2| / (M0 sigma_Phi) is a genuine fully-closed-form ' +
      'symbolic identity, U-invariant ~0.17372, but it reproduces the headline C_inf ~ 0.1751 only to ~0.8% (~1.4e-3), ' +
      'NOT to the quoted 1e-4 precision. It does NOT collapse the Richardson extrapolation to a closed number.',
    residualObstruction:
      'The last ~0.8% is the finite-operator-minus-symbol Szego gap in the imp-3400 numerator identity (operator ' +
      'norm above the symbol sup, ratio ~0.998) plus the O(1/U) tail; the direct Ttilde MATRIX norm rises toward ' +
      '0.1751 while the symbol-sup closed form sits U-flat below it, so the certified last two digits still need ' +
      'the Richardson-extrapolated operator norm, not the symbol sup.',
    measuresRatioNotPositivity:
      'This assembles and tests the capture RATIO constant; it does NOT construct the missing magnitude and does ' +
      'NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'The closed-form assembly is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator magnitude ' +
      'remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3440_C_INF_FULLY_CLOSED_FORM_ASSEMBLY_ASSERTIONS = [
  {
    id: 'imp3440-closed-form-value-is-U-invariant-near-0.17372',
    why: 'THE ASSEMBLY: the fully-closed-form C_inf^closed = sup_xi |d/dxi |Phihat|^2| / (M0 sigma_Phi) must be a ' +
      'single window-independent number near 0.17372 (spread < 1e-4 across U in {6,8,10}), with the spectral peak ' +
      'fixed at xi* ~ 12.07. A U-drift would mean the assembled functional is not window-independent.',
    holds: () => closedSpread < 1e-4 && cInfClosed > 0.173 && cInfClosed < 0.175 && argmaxSpread < 0.5 && argmaxXiStar > 11 && argmaxXiStar < 13,
  },
  {
    id: 'imp3440-closed-form-reproduces-headline-to-one-percent-not-1e4',
    why: 'THE PRIMARY TEST: the closed-form value must reproduce the imp-3346 / imp-3407 headline C_inf ~ 0.1751 ' +
      'to within ~1% (relative gap < 2%) but NOT within the quoted 1e-4 precision (abs gap > 1e-4). Landing ' +
      'inside 1e-4 would mean the closed form collapses the Richardson extrapolation; a > 2% gap would falsify ' +
      'the reproduction. The honest outcome is ~0.8%.',
    holds: () => relGap > 0.002 && relGap < 0.02 && !landsInsideQuotedPrecision,
  },
  {
    id: 'imp3440-direct-matrix-norm-rises-from-below-toward-headline',
    why: 'THE RESIDUAL DIAGNOSIS: the direct imp-3346 Ttilde MATRIX norm / (a m0 sigma_Phi) must rise from BELOW ' +
      'toward the headline (C_direct increasing across U and landing within 1e-4 of 0.1751 at large U), above the ' +
      'U-flat symbol-sup closed form. This localizes the ~0.8% to the finite-operator-minus-symbol Szego gap.',
    holds: () => directRisesTowardHeadline && cDirectSmallU < C_INF_IMP3346 && cDirectLargeU > cDirectSmallU,
  },
  {
    id: 'imp3440-verdict-closed-form-to-0.8-percent-not-1e4',
    why: 'The classified verdict must be the reproduces-to-0.8%-not-1e-4 / symbol-vs-operator-Szego-gap split, not ' +
      'indeterminate; a flip means the U-invariance, the ~1% (non-1e-4) reproduction, or the direct-anchor rise failed.',
    holds: () => verdict === 'CLOSED-FORM-C_inf~0.17372-REPRODUCES-0.1751-TO-~0.8%-NOT-1e-4-RESIDUAL-IS-SYMBOL-vs-OPERATOR-SZEGO-GAP',
  },
  {
    id: 'imp3440-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- a real fully-closed-form symbolic identity, but reproducing the ' +
      'headline only to ~0.8% (not 1e-4), a named residual obstruction (Szego symbol-vs-operator gap), positivity ' +
      'not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3440_C_INF_FULLY_CLOSED_FORM_ASSEMBLY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.closedFormExistsButNot1e4Accurate === 'string' &&
        typeof c.residualObstruction === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3440_C_INF_FULLY_CLOSED_FORM_ASSEMBLY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3440-C-inf-fully-closed-form-assembly assertion failed: ${assertion.id}`);
  }
}

export default IMP3440_C_INF_FULLY_CLOSED_FORM_ASSEMBLY;
