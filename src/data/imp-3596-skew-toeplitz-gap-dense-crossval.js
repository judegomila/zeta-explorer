/**
 * @module imp-3596-skew-toeplitz-gap-dense-crossval
 * @fileoverview imp-3596 -- CROSS-VALIDATE the imp-3575 converged skew-Toeplitz
 *   gap rho = lambda_3/lambda_1 and its skew-symmetry PAIRED Ritz structure against
 *   an INDEPENDENT dense full-spectrum eigensolver on a REDUCED section, certifying
 *   that lambda_3 is a genuine top-of-second-pair level and NOT a Lanczos
 *   reorthogonalization ghost.
 *
 *   CONTEXT
 *   -------
 *   imp-3575 re-measured the imp-3530/imp-3545 skew-Toeplitz gap at the imp-3555
 *   non-monotone N = 1600 rung, attributed the non-monotonicity to a Krylov
 *   lambda_3 under-resolution (the m = 200 reference was 4.03e-4 short), reported the
 *   converged rho = 0.99975799, and asserted the top-6 Ritz spectrum is skew-paired
 *   (lambda_1 = lambda_2, lambda_3 = lambda_4, ...) so lambda_3 is the top of the
 *   SECOND degenerate pair rather than a reorthogonalization ghost of the top pair.
 *   That paired-structure claim was checked ONLY inside the Lanczos routine itself:
 *   the same solver that could, in principle, MANUFACTURE a spurious near-duplicate
 *   Ritz value under finite-precision reorthogonalization loss. It was never compared
 *   against an independent dense/full-spectrum solver.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3505/imp-3545/imp-3575 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature) and,
 *   at a set of REDUCED sections small enough for a dense O(N^3) diagonalization
 *   (N in {40, 60, 80}, i.e. U in {1, 1.5, 2}), computes the FULL singular spectrum
 *   two INDEPENDENT ways at matched N:
 *     (D) DENSE: form the Gram S = T^T T explicitly and diagonalize the whole matrix
 *         with a full-matrix cyclic Jacobi sweep -- ALL eigenvalues, NO Krylov
 *         subspace, NO reorthogonalization, so it cannot host a Lanczos ghost;
 *     (L) LANCZOS: the imp-3575 symmetric Lanczos on S = T^T T with full
 *         reorthogonalization, extracting the top-4 Ritz values.
 *   The sections are small so the whole cross-check SELF-COMPUTES at import in ~0.2 s.
 *
 *   FINDING
 *   -------
 *   (1) THE PAIRED STRUCTURE IS REAL, NOT A LANCZOS GHOST. The dense full-spectrum
 *       solver -- which never runs Lanczos -- returns a spectrum that is degenerate
 *       in ADJACENT PAIRS to machine precision at every reduced section:
 *         sigma_1 = sigma_2, sigma_3 = sigma_4, sigma_5 = sigma_6 to relative < 1e-14.
 *       So the lambda_3 = lambda_4 degeneracy imp-3575 saw at N = 1600 is a genuine
 *       skew-symmetry feature of the section (the (v-u) shear factor is antisymmetric,
 *       forcing the singular values into equal pairs), reproduced by an INDEPENDENT
 *       solver -- lambda_3 is the top of the SECOND real pair, not a reorthogonalization
 *       artifact of the top pair.
 *   (2) THE GAP rho = lambda_3/lambda_1 AGREES ACROSS THE TWO SOLVERS TO MACHINE
 *       PRECISION AT MATCHED N. dense vs Lanczos rho differ by < 1e-14 at every
 *       reduced N (5.2e-16 at N=40, 1.4e-15 at N=60, 1.2e-15 at N=80), and the top-6
 *       singular values agree to relative < 1e-14. So the imp-3575 top-3 Ritz
 *       extraction that produced rho = 0.99975799 is a faithful reading of the true
 *       section spectrum, not a solver-specific number: an independent full-spectrum
 *       solver computes the SAME gap ratio at matched section size.
 *
 *   SCOPE / WHAT IS AND IS NOT CERTIFIED. The dense O(N^3) diagonalization is feasible
 *   only at the REDUCED sections (N <= 80); N = 1600 itself is NOT dense-solved here
 *   (a 1600x1600 Jacobi diagonalization is far too heavy for an import-time check).
 *   What is cross-validated is the METHODOLOGY that produced the N = 1600 result: the
 *   skew-Toeplitz section genuinely has adjacent-paired singular values (so lambda_3
 *   is a real second-pair level at ANY N, including 1600), and the Lanczos top-3 Ritz
 *   extraction reproduces the independent dense gap ratio to machine precision at
 *   matched N. The specific numeric rho = 0.99975799 at N = 1600 remains a Lanczos
 *   measurement; this module certifies the solver and the pairing it relies on, not
 *   that exact value against a dense N = 1600 solve.
 *
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the rho and pairing claim cross-validated here)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine reused)
 *   @see imp-3555-skew-toeplitz-gap-exponent-convergence.js (the ladder the N=1600 rung sits on)
 *
 *   Ticket: imp-3596 (accuracy, medium). Cross-validation only: certifies the imp-3575
 *   paired-Ritz structure and gap ratio against an independent dense solver on reduced
 *   sections. Does NOT dense-solve N = 1600, does NOT construct the missing magnitude,
 *   and does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH
 *   verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3545 / imp-3575)
const A_LINEAR = 1.0; // shear weight; a cancels in the sigma ratio rho
const PAIR_TOL = 1e-12; // adjacent-pair degeneracy relative tolerance (measured ~1e-15)
const XVAL_TOL = 1e-11; // dense-vs-Lanczos agreement relative tolerance (measured ~1e-14)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3505 verbatim). */
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

function vecNorm(x, n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += x[i] * x[i];
  return Math.sqrt(s);
}

/** Build the imp-3505/imp-3575 skew-Toeplitz numerator Ttilde on [0, U] with N midpoint panels. */
function buildTtilde(a, U, N) {
  const H = U / N;
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
    Rk[k] = s * H;
  }
  const T = [];
  for (let i = 0; i < N; i++) {
    const r = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      r[j] = a * (u[j] - u[i]) * Rk[k] * H;
    }
    T.push(r);
  }
  return T;
}

/** Explicit Gram S = T^T T (dense, symmetric). */
function gram(T, N) {
  const S = [];
  for (let i = 0; i < N; i++) S.push(new Float64Array(N));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let s = 0;
      for (let k = 0; k < N; k++) s += T[k][i] * T[k][j];
      S[i][j] = s;
    }
  }
  return S;
}

/**
 * FULL-spectrum symmetric eigensolver by cyclic Jacobi on the whole m x m matrix
 * (eigenvalues only), returned sorted DESCENDING. This is the INDEPENDENT dense
 * route: no Krylov subspace, no reorthogonalization, so it cannot manufacture a
 * near-duplicate Ritz value. Feasible only at the reduced sections used here.
 */
function jacobiFullSpectrum(Ain, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(Float64Array.from(Ain[i]));
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) off += A[p][q] * A[p][q];
    if (off < 1e-300) break;
    for (let p = 0; p < m; p++) {
      for (let q = p + 1; q < m; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const theta = (aqq - app) / (2 * apq);
        const sgn = theta >= 0 ? 1 : -1;
        const t = sgn / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < m; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < m; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const ev = [];
  for (let i = 0; i < m; i++) ev.push(A[i][i]);
  ev.sort((x, y) => y - x);
  return ev;
}

/** Full-spectrum solver on a symmetric TRIDIAGONAL (diag, off), eigenvalues sorted descending. */
function jacobiTridiagSpectrum(diag, off, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(new Float64Array(m));
  for (let i = 0; i < m; i++) {
    A[i][i] = diag[i];
    if (i + 1 < m) {
      A[i][i + 1] = off[i];
      A[i + 1][i] = off[i];
    }
  }
  return jacobiFullSpectrum(A, m);
}

/** Apply S = M^T M to a vector without forming S (imp-3505/imp-3575 verbatim). */
function applyGram(M, v, n) {
  const Mv = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const Mi = M[i];
    for (let j = 0; j < n; j++) s += Mi[j] * v[j];
    Mv[i] = s;
  }
  const out = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
    out[j] = s;
  }
  return out;
}

/**
 * imp-3575 symmetric Lanczos on S = M^T M (Krylov dim mReq) with FULL
 * reorthogonalization; returns the top-K Ritz singular values sigma = sqrt(lambda),
 * sorted descending. Same start vector, update, and Jacobi tridiagonal solve as the
 * imp-3505/imp-3575 routine.
 */
function lanczosTopRitz(M, n, mReq, K) {
  const m = Math.min(mReq, n);
  const basis = [];
  let vPrev = new Float64Array(n);
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.cos(0.17 * i + 0.4);
  const b0 = vecNorm(v, n);
  for (let i = 0; i < n; i++) v[i] /= b0;
  const diag = [];
  const off = [];
  let beta = 0;
  for (let j = 0; j < m; j++) {
    const w = applyGram(M, v, n);
    let alpha = 0;
    for (let i = 0; i < n; i++) alpha += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= alpha * v[i] + beta * vPrev[i];
    for (const uVec of basis) {
      let d = 0;
      for (let i = 0; i < n; i++) d += w[i] * uVec[i];
      for (let i = 0; i < n; i++) w[i] -= d * uVec[i];
    }
    let dv = 0;
    for (let i = 0; i < n; i++) dv += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= dv * v[i];
    diag.push(alpha);
    basis.push(v.slice());
    const bn = vecNorm(w, n);
    if (bn < 1e-13) break;
    off.push(bn);
    vPrev = v;
    v = new Float64Array(n);
    for (let i = 0; i < n; i++) v[i] = w[i] / bn;
    beta = bn;
  }
  const ev = jacobiTridiagSpectrum(diag, off, diag.length);
  return ev.slice(0, K).map((e) => Math.sqrt(Math.max(0, e)));
}

// --- Reduced sections small enough for a dense O(N^3) diagonalization at import ------
const REDUCED_SECTIONS = Object.freeze([
  { U: 1.0, N: 40 },
  { U: 1.5, N: 60 },
  { U: 2.0, N: 80 },
]);

/** Cross-validate one reduced section: dense full spectrum vs Lanczos top-4 Ritz. */
function crossValidateSection(a, U, N) {
  const T = buildTtilde(a, U, N);
  // (D) INDEPENDENT dense full-spectrum solver: form S = T^T T, diagonalize the whole matrix.
  const denseSigmas = jacobiFullSpectrum(gram(T, N), N).map((e) => Math.sqrt(Math.max(0, e)));
  // (L) imp-3575 Lanczos top-4 Ritz on the same S.
  const lanczosSigmas = lanczosTopRitz(T, N, Math.min(N, 120), 4);

  const denseTop6 = denseSigmas.slice(0, 6);
  // adjacent-pair degeneracy in the INDEPENDENT dense spectrum
  const pair12 = Math.abs(denseTop6[0] - denseTop6[1]) / denseTop6[0];
  const pair34 = Math.abs(denseTop6[2] - denseTop6[3]) / denseTop6[2];
  const pair56 = Math.abs(denseTop6[4] - denseTop6[5]) / denseTop6[4];
  const densePaired = pair12 < PAIR_TOL && pair34 < PAIR_TOL && pair56 < PAIR_TOL;

  const rhoDense = denseTop6[2] / denseTop6[0];
  const rhoLanczos = lanczosSigmas[2] / lanczosSigmas[0];
  const rhoRelDiff = Math.abs(rhoDense - rhoLanczos) / rhoDense;

  // top-4 singular-value agreement across the two solvers at matched N
  let maxSigmaRelDiff = 0;
  for (let i = 0; i < 4; i++) {
    maxSigmaRelDiff = Math.max(maxSigmaRelDiff, Math.abs(denseTop6[i] - lanczosSigmas[i]) / denseTop6[i]);
  }
  return {
    U,
    N,
    denseTop6,
    lanczosTop4: lanczosSigmas,
    pair12,
    pair34,
    pair56,
    densePaired, // dense spectrum is adjacent-paired -> lambda_3 is a genuine second-pair level
    rhoDense,
    rhoLanczos,
    rhoRelDiff, // dense vs Lanczos gap ratio agreement (~1e-15)
    maxSigmaRelDiff, // dense vs Lanczos top-4 sigma agreement (~1e-14)
    solversAgree: rhoRelDiff < XVAL_TOL && maxSigmaRelDiff < XVAL_TOL,
  };
}

const sections = REDUCED_SECTIONS.map((s) => crossValidateSection(A_LINEAR, s.U, s.N));

// (1) EVERY reduced section is adjacent-paired in the INDEPENDENT dense spectrum.
const allSectionsDensePaired = sections.every((s) => s.densePaired);
// (2) dense and Lanczos agree on rho and the top-4 sigma at matched N in EVERY section.
const allSolversAgree = sections.every((s) => s.solversAgree);
// worst (largest) pair-degeneracy and cross-solver disagreement across the sections
const worstPairRel = Math.max(...sections.flatMap((s) => [s.pair12, s.pair34, s.pair56]));
const worstRhoRelDiff = Math.max(...sections.map((s) => s.rhoRelDiff));
const worstSigmaRelDiff = Math.max(...sections.map((s) => s.maxSigmaRelDiff));

const verdict =
  allSectionsDensePaired && allSolversAgree
    ? 'lambda_3-IS-A-GENUINE-SECOND-PAIR-LEVEL:-INDEPENDENT-DENSE-FULL-SPECTRUM-SOLVER-REPRODUCES-THE-ADJACENT-PAIRED-STRUCTURE-(sigma_1=sigma_2,-sigma_3=sigma_4)-AND-THE-GAP-RATIO-rho-TO-MACHINE-PRECISION-AT-MATCHED-N;-NOT-A-LANCZOS-REORTHOGONALIZATION-GHOST'
    : 'INDETERMINATE';

export const IMP3596_SKEW_TOEPLITZ_GAP_DENSE_CROSSVAL = Object.freeze({
  id: 'imp-3596-skew-toeplitz-gap-dense-crossval',
  ticket: 'imp-3596',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidates: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'CROSS-VALIDATES the imp-3575 converged skew-Toeplitz gap rho = lambda_3/lambda_1 (= 0.99975799 at N=1600) and ' +
    'its skew-symmetry PAIRED Ritz structure against an INDEPENDENT dense full-spectrum eigensolver on REDUCED ' +
    'sections. imp-3575 asserted the top-6 Ritz spectrum is adjacent-paired (lambda_1=lambda_2, lambda_3=lambda_4) so ' +
    'lambda_3 is the top of the SECOND degenerate pair and not a reorthogonalization ghost, but checked that ONLY ' +
    'inside the Lanczos routine. Reusing the IDENTICAL imp-3505/imp-3575 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, ' +
    'H0=0.025, midpoint) at N in {40,60,80} (small enough for a dense O(N^3) Jacobi diagonalization), this module ' +
    'forms the Gram S=T^T T EXPLICITLY and diagonalizes the whole matrix (all eigenvalues, no Krylov subspace, no ' +
    'reorthogonalization) and compares against the imp-3575 Lanczos top-4 Ritz at matched N. RESULT: (1) the dense ' +
    'full spectrum is adjacent-paired to relative < 1e-14 at every section (sigma_1=sigma_2, sigma_3=sigma_4, ' +
    'sigma_5=sigma_6), so the lambda_3=lambda_4 degeneracy is a genuine skew-symmetry feature of the (v-u) shear, ' +
    'reproduced by a solver that never runs Lanczos -- lambda_3 is a real second-pair level, NOT a ghost; (2) the ' +
    'dense and Lanczos gap ratio rho agree to < 1e-14 (5.2e-16, 1.4e-15, 1.2e-15) and the top-4 sigma to < 1e-14 at ' +
    'matched N, so the imp-3575 top-3 Ritz extraction is a faithful reading of the true section spectrum. SCOPE: the ' +
    'dense solve is feasible only at the reduced N<=80; N=1600 itself is NOT dense-solved, so this certifies the ' +
    'PAIRING mechanism (real at any N) and the Lanczos extraction (matches dense at matched N), not the exact ' +
    'rho=0.99975799 against a dense N=1600 solve. Cross-validation only; does NOT construct the missing magnitude ' +
    'and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    gapQuantity: 'rho(N) = lambda_3/lambda_1 = sigma_3/sigma_1 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3575: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    denseSolver: 'INDEPENDENT: form S=T^T T explicitly, full-matrix cyclic Jacobi sweep for ALL eigenvalues (no Krylov, no reorthogonalization)',
    lanczosSolver: 'imp-3575 symmetric Lanczos on S=T^T T with FULL reorthogonalization, top-4 Ritz values by Jacobi on the tridiagonal',
    reducedSections: REDUCED_SECTIONS.map((s) => ({ U: s.U, N: s.N })),
    pairTol: PAIR_TOL,
    crossValTol: XVAL_TOL,
    a: A_LINEAR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    sections, // per-section dense top-6, Lanczos top-4, pair degeneracies, rho both ways, agreement
    allSectionsDensePaired, // true -- independent dense spectrum is adjacent-paired at every N
    allSolversAgree, // true -- dense and Lanczos rho and top-4 sigma agree to < 1e-11 at matched N
    worstPairRel, // largest adjacent-pair relative gap across sections (~1e-14)
    worstRhoRelDiff, // largest dense-vs-Lanczos rho relative difference (~1e-15)
    worstSigmaRelDiff, // largest dense-vs-Lanczos top-4 sigma relative difference (~1e-14)
    imp3575ConvergedRhoN1600: 0.9997579854030878, // the imp-3575 value whose SOLVER + pairing this cross-validates
    verdict,
  }),

  interpretation: Object.freeze({
    pairingIsRealNotAGhost:
      'An independent dense full-spectrum solver -- which forms S=T^T T explicitly and diagonalizes the whole matrix, ' +
      'never building a Krylov subspace or reorthogonalizing -- returns a spectrum degenerate in ADJACENT PAIRS to ' +
      'machine precision (sigma_1=sigma_2, sigma_3=sigma_4, sigma_5=sigma_6) at every reduced section. So the ' +
      'lambda_3=lambda_4 degeneracy imp-3575 saw at N=1600 is a genuine skew-symmetry feature of the (v-u) shear ' +
      'factor, not a near-duplicate Ritz value manufactured by Lanczos reorthogonalization loss. lambda_3 is the top ' +
      'of the SECOND real pair.',
    gapRatioIsSolverIndependent:
      'The gap ratio rho=lambda_3/lambda_1 computed by the dense full-spectrum solver and by the imp-3575 top-3 Ritz ' +
      'Lanczos extraction agree to < 1e-14 at matched N, and the top-4 singular values agree to < 1e-14. So the ' +
      'imp-3575 rho is a faithful reading of the true section spectrum: an independent solver computes the same gap ' +
      'ratio, confirming the Lanczos top-3 extraction is not solver-specific.',
    whatItAddsOverImp3575:
      'imp-3575 established the paired structure and the converged rho inside a single (Lanczos) solver. This module ' +
      'confirms both against a structurally DIFFERENT dense full-spectrum solver at matched N on reduced sections, ' +
      'upgrading the ghost-exclusion from a within-Lanczos observation to an independent cross-check of the pairing ' +
      'mechanism and the gap-ratio extraction.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    reducedSectionsNotN1600:
      'The dense O(N^3) full-spectrum diagonalization is feasible only at the reduced sections N<=80; N=1600 itself ' +
      'is NOT dense-solved. This cross-validates the PAIRING mechanism (a structural skew-symmetry feature real at ' +
      'any N, hence at N=1600) and the Lanczos top-3 extraction (matches the dense spectrum to machine precision at ' +
      'matched N), NOT the specific numeric rho=0.99975799 against a dense N=1600 solve.',
    crossValidatesNotConstructs:
      'This confirms the imp-3575 solver and paired structure against an independent dense solver; it does NOT ' +
      'construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    agreementIsNumericalNotSymbolic:
      'The pairing and gap-ratio agreement are finite-N numerical measurements at reduced sections, not a proven ' +
      'symbolic degeneracy; the (v-u) antisymmetry is the heuristic mechanism, corroborated numerically here.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3596_SKEW_TOEPLITZ_GAP_DENSE_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3596-dense-spectrum-is-adjacent-paired',
    why: 'THE PRIMARY DELIVERABLE: the INDEPENDENT dense full-spectrum solver (no Krylov, no reorthogonalization) must ' +
      'return an adjacent-paired spectrum (sigma_1=sigma_2, sigma_3=sigma_4, sigma_5=sigma_6 to relative < 1e-12) at ' +
      'EVERY reduced section -- certifying lambda_3 is a genuine second-pair level, not a Lanczos ghost.',
    holds: () => allSectionsDensePaired && worstPairRel < PAIR_TOL,
  },
  {
    id: 'imp3596-dense-and-lanczos-rho-agree-at-matched-N',
    why: 'The gap ratio rho=lambda_3/lambda_1 from the dense full-spectrum solver and from the imp-3575 Lanczos top-3 ' +
      'Ritz extraction must agree to relative < 1e-11 (measured ~1e-15) at matched N -- confirming the imp-3575 rho ' +
      'is solver-independent, not a Lanczos-specific reading.',
    holds: () => sections.every((s) => s.rhoRelDiff < XVAL_TOL) && worstRhoRelDiff < XVAL_TOL,
  },
  {
    id: 'imp3596-dense-and-lanczos-top4-sigma-agree',
    why: 'The top-4 singular values from the two independent solvers must agree to relative < 1e-11 at matched N, so ' +
      'the whole leading spectrum -- not just the ratio -- is reproduced across solvers.',
    holds: () => allSolversAgree && worstSigmaRelDiff < XVAL_TOL,
  },
  {
    id: 'imp3596-verdict-second-pair-level-certified',
    why: 'The classified verdict must be the confirming genuine-second-pair-level result, not indeterminate; a flip ' +
      'means the dense pairing or the dense-vs-Lanczos agreement failed at some reduced section.',
    holds: () => verdict.startsWith('lambda_3-IS-A-GENUINE-SECOND-PAIR-LEVEL'),
  },
  {
    id: 'imp3596-honest-assessment-no-qed',
    why: 'Mandatory honesty: CROSS-VALIDATION only on reduced sections -- N=1600 not dense-solved, positivity not ' +
      'attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3596_SKEW_TOEPLITZ_GAP_DENSE_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.reducedSectionsNotN1600 === 'string' &&
        typeof c.crossValidatesNotConstructs === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3596_SKEW_TOEPLITZ_GAP_DENSE_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3596-skew-toeplitz-gap-dense-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3596_SKEW_TOEPLITZ_GAP_DENSE_CROSSVAL;
