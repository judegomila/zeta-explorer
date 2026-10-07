/**
 * @module imp-3404-shear-gram-full-spectrum-cell-independence
 * @fileoverview imp-3404 -- ASSESS whether the FULL eigenvalue spectrum of the
 *   imp-3351 hollow-antisymmetric shear Gram (beyond the extremal identity
 *   min eig = -||Gshear||) is cell-independent across the imp-3085 (a, U) grid,
 *   or whether only the extremes are structural.
 *
 *   CONTEXT
 *   -------
 *   imp-3351 certified only the EXTREMAL identity min eig(i Gshear) = -||Gshear||
 *   is cell-independent (16 cells, |ratio - 1| < 9e-16, reduced trace 0). It left
 *   OPEN whether the entire sorted spectrum -- the intermediate eigenvalues and any
 *   spectral gap -- is likewise (a, U)-independent up to normalization, or whether
 *   only the two extremes are structural.
 *
 *   THE ANSWER IS ALGEBRAIC, AND THIS MODULE MEASURES IT
 *   ----------------------------------------------------
 *   Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)) factors (sinh odd) as
 *     Gshear = p q^T - q p^T,   p_i = Phi_i cosh(a u_i),  q_i = Phi_i sinh(a u_i),
 *   which is a RANK-2 real antisymmetric matrix. A rank-2 matrix has AT MOST two
 *   nonzero singular values; for the antisymmetric case they come in an equal pair,
 *   so i Gshear has spectrum { +mu, -mu, 0, 0, ..., 0 } (N - 2 EXACT zeros) with
 *   mu^2 = |p|^2|q|^2 - <p,q>^2. There are therefore NO intermediate eigenvalues to
 *   vary from cell to cell: the entire NORMALIZED spectrum is { +1, 0, ..., 0, -1 }
 *   IDENTICALLY at every (a, U, Phi). This is the sense in which the full spectrum is
 *   cell-independent -- trivially, as a consequence of the rank-2 hollow antisymmetry,
 *   not as extra structure beyond the extremes.
 *
 *   WHAT THIS MODULE MEASURES (three independent routes)
 *   ----------------------------------------------------
 *   At the fixed resolution N = 240 (the imp-3252/imp-3351 ladder rung), for EACH of
 *   the 16 cells of A_GRID x U_GRID = {0.5, 0.3, 0.2, 0.1} x {4, 6, 8, 10}:
 *     - mu = sqrt(|p|^2|q|^2 - <p,q>^2)                (analytic rank-2 magnitude);
 *     - ||Gshear||_2 via power iteration on M^T M      (top singular value route);
 *     - ||Gshear||_F^2 = sum_{i,j} Gshear_ij^2         (Frobenius / total spectral energy).
 *   For a rank-2 antisymmetric matrix the whole Frobenius energy is carried by the two
 *   nonzero singular values (each = mu), so ||Gshear||_F^2 = 2 mu^2 EXACTLY. Hence
 *     rankTwoEnergyResidual = | ||Gshear||_F^2 / (2 mu^2) - 1 |  ->  0,
 *   which certifies s_1 = s_2 = mu and s_3 = ... = s_N = 0 (all intermediate eigenvalues
 *   are EXACTLY zero, since s_1 = mu already and the F-energy budget is exhausted by the
 *   pair). The DELIVERABLE is that this residual is ~machine precision at EVERY cell and
 *   the extremal-energy fraction 2 mu^2 / ||Gshear||_F^2 is 1 to machine precision at every
 *   cell -- the two extremes carry ALL the spectral energy, so there is no cell-dependent
 *   intermediate structure.
 *
 *   MEASURED VERDICT (assessment, RH-equivalent, NO QED)
 *   ----------------------------------------------------
 *   At all 16 cells the extremal pair carries the entire Frobenius energy to machine
 *   precision (rankTwoEnergyResidual < ~1e-12) and the top singular value matches the
 *   analytic mu. The full spectrum of i Gshear is therefore DEGENERATE -- { +mu, -mu }
 *   plus N - 2 exact zeros -- at every cell, so the normalized spectrum { +1, 0, ..., -1 }
 *   is cell-independent as a TRIVIAL algebraic consequence of the rank-2 hollow
 *   antisymmetry. It is NOT that only the extremes are structural while intermediate
 *   eigenvalues vary: there ARE no intermediate eigenvalues. This strengthens imp-3351:
 *   the whole spectrum (not just min eig) is (a, U, Phi)-independent up to normalization.
 *   The binding RH-equivalent K_a >= 0 residual (the imp-3066 off-diagonal endpoint-Hankel
 *   step) is untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA. No QED.
 *
 *   @see imp-3351-shear-gram-symmetric-spectrum-aU-grid.js (the extremal-only cell-independence this extends)
 *   @see imp-3252-shear-gram-mineig-symmetric-spectrum-n-scaling.js (the single-cell rank-2 factorization)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the lone binding obstruction, untouched)
 *
 *   Ticket: imp-3404 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid), same as imp-3351
const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]); // shear weights (imp-3085 grid)
const U_GRID = Object.freeze([4, 6, 8, 10]); // lag cutoffs (imp-3085 grid)
const N = 240; // fixed resolution (the genuine-cell ladder rung of imp-3252/imp-3351)
const ITERS = 400; // power-iteration steps (matches imp-3351)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3351). */
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

/** Spectral norm (top singular value) of a dense n x n matrix via power iteration on M^T M (identical routine to imp-3351). */
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

/**
 * One (a, U) cell at fixed grid N: build the rank-2 hollow antisymmetric shear Gram and
 * measure whether the FULL spectrum is carried entirely by the two extremes via three
 * INDEPENDENT routes:
 *   - mu via the exact rank-2 spectral reduction on span{p, q} (analytic magnitude),
 *   - ||Gshear||_2 via power iteration (top singular value),
 *   - ||Gshear||_F^2 via direct entrywise sum (total spectral energy).
 * For a rank-2 antisymmetric matrix ||Gshear||_F^2 = 2 mu^2 exactly (the two nonzero
 * singular values are both mu and all others are zero).
 */
function cellAt(a, U) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  const p = new Array(N); // p_i = Phi_i cosh(a u_i)
  const q = new Array(N); // q_i = Phi_i sinh(a u_i)
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
    p[i] = phi[i] * Math.cosh(a * u[i]);
    q[i] = phi[i] * Math.sinh(a * u[i]);
  }
  // Exact rank-2 reduction: Gshear = p q^T - q p^T; the nonzero eigenvalues of i Gshear
  // are +/- mu with mu^2 = |p|^2|q|^2 - <p,q>^2; every other eigenvalue is exactly zero.
  let pp = 0;
  let qq = 0;
  let pq = 0;
  for (let i = 0; i < N; i++) {
    pp += p[i] * p[i];
    qq += q[i] * q[i];
    pq += p[i] * q[i];
  }
  const det = pp * qq - pq * pq;
  const mu = Math.sqrt(Math.max(0, det)); // analytic rank-2 magnitude = |min eig| = |max eig|
  // Build the full matrix; accumulate the Frobenius energy (total spectral energy) and
  // run the independent power-iteration top singular value.
  const G = [];
  let frob2 = 0; // ||Gshear||_F^2 = sum_{i,j} Gshear_ij^2
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const g = phi[i] * phi[j] * Math.sinh(a * (u[j] - u[i]));
      rG[j] = g;
      frob2 += g * g;
    }
    G.push(rG);
  }
  const topSV = spectralNorm(G, N, ITERS); // = mu for a rank-2 antisymmetric matrix
  // For a rank-2 antisymmetric matrix the two nonzero singular values are both mu, so the
  // whole Frobenius energy is 2 mu^2. The residual below is 0 iff all sub-extremal
  // eigenvalues are exactly zero (no cell-dependent intermediate structure).
  const rankTwoEnergyResidual = mu > 0 ? Math.abs(frob2 / (2 * mu * mu) - 1) : 0;
  // Fraction of the total spectral energy carried by the two extremes: -> 1 exactly.
  const extremalEnergyFraction = frob2 > 0 ? (2 * mu * mu) / frob2 : 0;
  // Top singular value agrees with the analytic mu (second independent route).
  const topSVMatch = mu > 0 ? topSV / mu : 0;
  return {
    a,
    U,
    mu, // analytic rank-2 magnitude (unscaled)
    topSV, // power-iteration top singular value (unscaled)
    frob2, // ||Gshear||_F^2 total spectral energy
    rankTwoEnergyResidual, // | ||F||^2 / (2 mu^2) - 1 | -> 0: full spectrum is {+mu,-mu,0...}
    extremalEnergyFraction, // 2 mu^2 / ||F||^2 -> 1: extremes carry ALL the energy
    topSVMatch, // topSV / mu -> 1: independent routes agree
    H,
  };
}

const cells = [];
for (const a of A_GRID) for (const U of U_GRID) cells.push(cellAt(a, U));

// The extremal pair carries the ENTIRE Frobenius energy at every cell (no intermediate eigenvalues)?
const maxRankTwoEnergyResidual = Math.max(...cells.map((c) => c.rankTwoEnergyResidual));
const fullSpectrumIsRankTwoEveryCell = maxRankTwoEnergyResidual < 1e-12;

// The extremal-energy fraction is 1 to machine precision, and the top SV matches mu, at every cell?
const maxExtremalEnergyFractionDev = Math.max(...cells.map((c) => Math.abs(c.extremalEnergyFraction - 1)));
const maxTopSVMatchDev = Math.max(...cells.map((c) => Math.abs(c.topSVMatch - 1)));
const extremesCarryAllEnergyEveryCell = maxExtremalEnergyFractionDev < 1e-12 && maxTopSVMatchDev < 1e-9;

const verdict =
  fullSpectrumIsRankTwoEveryCell && extremesCarryAllEnergyEveryCell
    ? 'FULL-SPECTRUM-DEGENERATE-RANK-2-CELL-INDEPENDENT-NO-INTERMEDIATE-EIGENVALUES'
    : 'INDETERMINATE';

export const IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE = Object.freeze({
  id: 'imp-3404-shear-gram-full-spectrum-cell-independence',
  ticket: 'imp-3404',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-3351-shear-gram-symmetric-spectrum-aU-grid.js',
  sameGridAs: 'imp-3103-orthogonalized-opnorm-aU-grid.js',

  summary:
    'ASSESSES whether the FULL eigenvalue spectrum of the imp-3351 hollow-antisymmetric shear Gram ' +
    '(beyond the extremal min eig = -||Gshear||) is cell-independent across the imp-3085 grid A_GRID x U_GRID = ' +
    '{0.5, 0.3, 0.2, 0.1} x {4, 6, 8, 10}. Gshear(u,v) = Phi(u) Phi(v) sinh(a (v - u)) = p q^T - q p^T ' +
    '(p = Phi cosh(a t), q = Phi sinh(a t)) is RANK-2 real antisymmetric, so i Gshear has spectrum ' +
    '{ +mu, -mu, 0, ..., 0 } (N - 2 exact zeros, mu^2 = |p|^2|q|^2 - <p,q>^2) -- there are NO intermediate ' +
    'eigenvalues. MEASURED at N = 240 over all 16 cells via three independent routes (analytic mu, power-iteration ' +
    'top singular value, Frobenius energy ||Gshear||_F^2): rankTwoEnergyResidual = | ||Gshear||_F^2 / (2 mu^2) - 1 | ' +
    '< ~1e-12 and the extremal-energy fraction 2 mu^2 / ||Gshear||_F^2 = 1 to machine precision at EVERY cell, with ' +
    'the top singular value matching the analytic mu. CONCLUSION: the full spectrum is DEGENERATE { +mu, -mu, 0^(N-2) } ' +
    'at every cell, so the normalized spectrum { +1, 0, ..., -1 } is cell-independent as a TRIVIAL consequence of the ' +
    'rank-2 hollow antisymmetry -- NOT because only the extremes are structural, but because there are no intermediate ' +
    'eigenvalues at all. Strengthens imp-3351 from the extremal identity to the whole spectrum. The binding RH-equivalent ' +
    'K_a >= 0 residual (imp-3066 off-diagonal endpoint-Hankel) is untouched. Assessment only; RH-equivalent; NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))  = p q^T - q p^T,  p = Phi cosh(a t), q = Phi sinh(a t)',
    rankTwoSpectrum:
      'rank-2 antisymmetric: i Gshear eigenvalues { +mu, -mu, 0, ..., 0 } (N - 2 exact zeros), ' +
      'mu^2 = |p|^2|q|^2 - <p,q>^2; two nonzero singular values both = mu so ||Gshear||_F^2 = 2 mu^2 exactly',
    muRoute: 'exact rank-2 spectral reduction (analytic mu from p, q inner products)',
    topSVRoute: 'power iteration on the unscaled midpoint kernel matrix M^T M (identical to imp-3351)',
    frobRoute: 'direct entrywise sum ||Gshear||_F^2 = sum_{i,j} Gshear_ij^2 (total spectral energy)',
    aGrid: A_GRID.slice(),
    uGrid: U_GRID.slice(),
    nCells: A_GRID.length * U_GRID.length,
    N,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; unscaled matrices (common quadrature weight H = U/N per cell)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells: Object.freeze(
      cells.map((c) =>
        Object.freeze({
          a: c.a,
          U: c.U,
          mu: c.mu,
          topSV: c.topSV,
          frob2: c.frob2,
          rankTwoEnergyResidual: c.rankTwoEnergyResidual,
          extremalEnergyFraction: c.extremalEnergyFraction,
          topSVMatch: c.topSVMatch,
        }),
      ),
    ),
    maxRankTwoEnergyResidual, // ~machine precision: full spectrum is {+mu,-mu,0...} at every cell
    fullSpectrumIsRankTwoEveryCell, // true -> no intermediate eigenvalues at any cell
    maxExtremalEnergyFractionDev, // ~machine precision: extremes carry ALL the energy at every cell
    maxTopSVMatchDev, // ~machine precision: analytic mu and power-iteration top SV agree at every cell
    extremesCarryAllEnergyEveryCell,
    genuineCell: Object.freeze(
      (() => {
        const g = cells.find((c) => c.a === 0.5 && c.U === 6);
        return { a: g.a, U: g.U, rankTwoEnergyResidual: g.rankTwoEnergyResidual, mu: g.mu };
      })(),
    ),
    verdict, // FULL-SPECTRUM-DEGENERATE-RANK-2-CELL-INDEPENDENT-NO-INTERMEDIATE-EIGENVALUES
  }),

  interpretation: Object.freeze({
    fullSpectrumIsDegenerate:
      'The full spectrum of i Gshear is { +mu, -mu } plus N - 2 EXACT zeros at every cell: a rank-2 antisymmetric ' +
      'matrix has at most two nonzero singular values, and the Frobenius energy ||Gshear||_F^2 = 2 mu^2 to machine ' +
      'precision at all 16 cells confirms the two extremes carry the entire spectrum. There are no intermediate ' +
      'eigenvalues to be cell-dependent.',
    cellIndependenceIsTrivialRankTwo:
      'Because there are no intermediate eigenvalues, the normalized spectrum { +1, 0, ..., 0, -1 } is IDENTICAL at ' +
      'every (a, U, Phi) as a trivial algebraic consequence of the rank-2 hollow antisymmetry. The answer to imp-3404 ' +
      'is NOT that only the extremes are structural while the rest varies -- the rest is exactly zero, so the whole ' +
      'spectrum is cell-independent up to normalization.',
    extendsImp3351:
      'This strengthens imp-3351 (which certified only the extremal min eig = -||Gshear|| is cell-independent) to the ' +
      'entire spectrum: not just the extremes but the full sorted eigenvalue set is (a, U, Phi)-independent up to ' +
      'normalization, because the sub-extremal part is identically zero.',
    residualUntouched:
      'This changes nothing about the binding RH-equivalent K_a >= 0 sign-positivity residual (the imp-3066 ' +
      'off-diagonal endpoint-Hankel step), which remains the lone obstruction at every cell.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresSpectrumNotPositivity:
      'This module measures only the full-spectrum degeneracy (rank-2 energy concentration) across the (a, U) grid; ' +
      'it does NOT construct a dominating passive core and does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Cell-independence of the full spectrum confirms the rank-2 structure is (a, U, Phi)-independent; the off-diagonal ' +
      'endpoint-Hankel operator magnitude (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE_ASSERTIONS = [
  {
    id: 'imp3404-full-spectrum-is-rank-two-every-cell',
    why: 'THE DELIVERABLE: the two extremes carry the ENTIRE Frobenius energy at every cell ' +
         '(| ||Gshear||_F^2 / (2 mu^2) - 1 | to machine precision) -- so i Gshear has spectrum {+mu,-mu,0,...,0} with ' +
         'no intermediate eigenvalues, at every cell of the imp-3085 grid.',
    holds: () => fullSpectrumIsRankTwoEveryCell && maxRankTwoEnergyResidual < 1e-12,
  },
  {
    id: 'imp3404-extremes-carry-all-energy-and-routes-agree',
    why: 'The extremal-energy fraction 2 mu^2 / ||Gshear||_F^2 must be 1 to machine precision at every cell, and the ' +
         'power-iteration top singular value must match the analytic rank-2 mu -- two independent confirmations that ' +
         'the sub-extremal spectrum is identically zero.',
    holds: () => extremesCarryAllEnergyEveryCell && maxExtremalEnergyFractionDev < 1e-12 && maxTopSVMatchDev < 1e-9,
  },
  {
    id: 'imp3404-full-grid-swept',
    why: 'The sweep must cover the full imp-3085 A_GRID x U_GRID = 16 cells (and include the genuine cell a=0.5,U=6); ' +
         'a short count means the grid was not fully swept.',
    holds: () =>
      cells.length === A_GRID.length * U_GRID.length &&
      cells.length === 16 &&
      cells.some((c) => c.a === 0.5 && c.U === 6),
  },
  {
    id: 'imp3404-verdict-is-degenerate-rank-two-identity',
    why: 'The classified verdict must be the degenerate-rank-2 cell-independent split, not indeterminate; a flip means ' +
         'the Frobenius energy departed from 2 mu^2 at some cell (which cannot happen for a genuine rank-2 antisymmetric ' +
         'matrix -- a flip would signal a construction bug).',
    holds: () => verdict === 'FULL-SPECTRUM-DEGENERATE-RANK-2-CELL-INDEPENDENT-NO-INTERMEDIATE-EIGENVALUES',
  },
  {
    id: 'imp3404-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity not ' +
         'attempted, PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3404-shear-gram-full-spectrum-cell-independence assertion failed: ${assertion.id}`);
  }
}

export default IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE;
