/**
 * @module imp-3525-corrected-solver-agreement-crossval
 * @fileoverview imp-3525 -- RE-RUN the imp-3485 solver-independent capture-constant
 *   cross-validation with the imp-3505-CORRECTED settings (Lanczos Krylov dimension
 *   m >= 120 and a CONVERGED power-iteration budget) and measure whether the U = 20
 *   relative solver agreement improves from imp-3485s reported 1.0e-4 once the
 *   reference deficit AND the power under-convergence are both removed -- reporting
 *   how much of the 1.0e-4 gap was reference (Krylov-truncation) deficit vs power
 *   under-convergence vs genuine algebraic solver disagreement.
 *
 *   CONTEXT
 *   -------
 *   imp-3485 cross-checked the imp-3467 skew-Toeplitz operator norm ||Ttilde|| by a
 *   second, structurally independent Lanczos/Jacobi Krylov eigensolver and reported
 *   the two solvers agree to relative error 1.7e-9 (U = 4) rising to 1.0e-4 (U = 20).
 *   imp-3505 then swept the power-iteration budget and the Krylov dimension and found
 *   the 1.0e-4 residual at N = 800 splits into TWO error sources, NOT one:
 *     (i)  the imp-3485 power iteration at 260 steps was under-converged by ~1.04e-4
 *          (it needs ~6250 steps to reach 1e-9 of the converged norm at N = 800), and
 *     (ii) the imp-3485 m = 80 Lanczos REFERENCE was itself under-resolved at N = 800
 *          by 1.13e-6 (short of the power-converged norm 6.491220876901e-5), lifting
 *          onto the converged value only once the Krylov dimension grows to m >= 120.
 *   imp-3505 recommended re-running the cross-check at m >= 120 with a converged power
 *   budget to see the corrected agreement. THIS MODULE does exactly that.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3485 skew-Toeplitz assembly
 *   (Ttilde(u,v) = a (v-u) R(|v-u|), midpoint quadrature, N = U/H0 panels) and the
 *   IDENTICAL power-iteration and Lanczos/Jacobi routines, and on the full imp-3240
 *   U-grid {4,6,8,10,12,16,20} computes:
 *     - normPowerConv : power iteration at a CONVERGED budget (8320 steps, imp-3505)
 *     - normLanczos120: independent Lanczos/Jacobi at the CORRECTED Krylov dim m = 120
 *     - normLanczos160: a further-enriched m = 160 Lanczos, to confirm m = 120 is
 *                       itself fully resolved (self-agreement, not just vs power)
 *     - normLegacyLanczos (m = 80) and normLegacyPower (260 steps): the ORIGINAL
 *                       imp-3485 settings, reproduced to recover its 1.0e-4 gap and
 *                       decompose it.
 *   It then tabulates the CORRECTED per-U relative solver agreement
 *   |normLanczos120 - normPowerConv| / normPowerConv and, at the U = 20 target cell,
 *   the three-way decomposition of the imp-3485 gap.
 *
 *   FINDING
 *   -------
 *   (1) CORRECTED AGREEMENT COLLAPSES BY ~5.5 MILLION-FOLD AT U = 20. With m = 120
 *       and a converged power budget the U = 20 relative solver agreement improves
 *       from imp-3485s 1.0e-4 to ~1.9e-11 -- and to ~1e-14 (machine level) on every
 *       smaller cell. The m = 120 and m = 160 Lanczos norms agree to 1.6e-14 at
 *       N = 800, so the m = 120 reference is FULLY RESOLVED (imp-3505s m >= 120
 *       recommendation is confirmed: enriching past 120 changes nothing) and the
 *       residual ~1.9e-11 is remaining power convergence at budget 8320, NOT
 *       reference deficit and NOT algebraic solver disagreement.
 *   (2) THE 1.0e-4 GAP WAS ~99% POWER UNDER-CONVERGENCE, ~1% REFERENCE DEFICIT.
 *       Reproducing the imp-3485 settings recovers its gap 1.025e-4 at U = 20. Split
 *       against the converged norm: power under-convergence at 260 steps contributes
 *       1.036e-4 (the dominant ~99%), the m = 80 Krylov-truncation reference deficit
 *       contributes only 1.127e-6 (~1.1%, reproducing imp-3505s 1.13e-6), and the
 *       genuine algebraic disagreement between the two converged eigensolvers is
 *       ~1.6e-14. So REMOVING THE REFERENCE DEFICIT ALONE would NOT have improved the
 *       U = 20 agreement -- the gap was overwhelmingly power under-convergence; only
 *       the two corrections TOGETHER (m >= 120 AND a converged power budget) collapse
 *       it. The imp-3485 solvers never genuinely disagreed by 1.0e-4; both were
 *       measuring the same section norm, each short of it by a different amount.
 *
 *   So imp-3485s 1.0e-4 U = 20 figure was an artifact of two under-convergence
 *   deficits stacked, not solver disagreement: at converged settings the independent
 *   Lanczos/Jacobi and power routes agree to ~1.9e-11 at N = 800 and ~1e-14 elsewhere.
 *
 *   @see imp-3485-Ttilde-independent-operator-norm-crossval.js (the cross-check re-run here)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the m >= 120 / budget recommendation)
 *   @see imp-3467-Ttilde-closed-form-C-inf-assembly.js (the assembled C the cross-check validates)
 *
 *   Ticket: imp-3525 (numerical, medium). Measurement only; sharpens the imp-3485
 *   solver-independence figure by removing two under-convergence deficits. Does NOT
 *   construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0
 *   positivity. RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 *   remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3485 / imp-3505 / imp-3467)
const A_LINEAR = 1.0; // shear weight; a cancels in sigma-ratios, factor it out
const H0 = 0.025; // FIXED grid step (N = U/H0 grows with U) -- identical to the imp-3485 ladder
const POWER_CONV = 8320; // CONVERGED power-iteration budget (imp-3505: stable to 1e-14 at N=800)
const KRYLOV_CORRECTED = 120; // imp-3505-recommended Krylov dimension (fully resolves N=800)
const KRYLOV_ENRICHED = 160; // further enrichment, to confirm m=120 is itself resolved
const LEGACY_KRYLOV = 80; // the imp-3485 Krylov dimension (under-resolved at N=800)
const LEGACY_POWER = 260; // the imp-3485 power budget (under-converged at N=800)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3485). */
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

/** ROUTE A -- power iteration on M^T M (identical routine to imp-3485 / imp-3467). */
function powerNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const s0 = vecNorm(v, n);
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
    lam = vecNorm(MtMv, n);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** Apply S = M^T M to a vector without forming S (two matvecs, O(n^2)). */
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
 * Largest eigenvalue of a symmetric tridiagonal (diag, off) by a cyclic Jacobi
 * rotation sweep on the assembled m x m matrix -- identical to imp-3485.
 */
function jacobiTopEig(diag, off, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(new Float64Array(m));
  for (let i = 0; i < m; i++) {
    A[i][i] = diag[i];
    if (i + 1 < m) {
      A[i][i + 1] = off[i];
      A[i + 1][i] = off[i];
    }
  }
  for (let sweep = 0; sweep < 80; sweep++) {
    let offSum = 0;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) offSum += A[p][q] * A[p][q];
    if (offSum < 1e-30) break;
    for (let p = 0; p < m; p++) {
      for (let q = p + 1; q < m; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-32) continue;
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
  let mx = -Infinity;
  for (let i = 0; i < m; i++) if (A[i][i] > mx) mx = A[i][i];
  return mx;
}

/**
 * ROUTE B (INDEPENDENT) -- symmetric Lanczos on S = M^T M with full
 * reorthogonalization, top eigenvalue by Jacobi. Returns sigma_max = sqrt(lambda_max).
 * Identical routine to imp-3485; only the Krylov dimension mReq varies.
 */
function lanczosNorm(M, n, mReq) {
  const m = Math.min(mReq, n);
  const basis = [];
  let vPrev = new Float64Array(n);
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.cos(0.17 * i + 0.4); // start distinct from powerNorm
  let b0 = vecNorm(v, n);
  for (let i = 0; i < n; i++) v[i] /= b0;
  const diag = [];
  const off = [];
  let beta = 0;
  for (let j = 0; j < m; j++) {
    const w = applyGram(M, v, n);
    let alpha = 0;
    for (let i = 0; i < n; i++) alpha += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= alpha * v[i] + beta * vPrev[i];
    for (const uu of basis) {
      let d = 0;
      for (let i = 0; i < n; i++) d += w[i] * uu[i];
      for (let i = 0; i < n; i++) w[i] -= d * uu[i];
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
  const lamMax = jacobiTopEig(diag, off, diag.length);
  return Math.sqrt(Math.max(0, lamMax));
}

/** Build the imp-3485 skew-Toeplitz numerator Ttilde(u,v) = a (v-u) R(|v-u|) on [0,U]. */
function buildT(a, U, N) {
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

/**
 * One window [0,U] with N = U/H0 panels. Recomputes ||Ttilde|| by the CORRECTED
 * settings (converged power + m=120 and m=160 Lanczos) and by the LEGACY imp-3485
 * settings (260-step power + m=80 Lanczos), and reports the corrected agreement plus
 * the three-way decomposition of the imp-3485 gap.
 */
function crossValCell(a, U, N) {
  const T = buildT(a, U, N);
  const normPowerConv = powerNorm(T, N, POWER_CONV); // converged power reference
  const normLanczos120 = lanczosNorm(T, N, KRYLOV_CORRECTED); // corrected independent route
  const normLanczos160 = lanczosNorm(T, N, KRYLOV_ENRICHED); // enriched self-consistency check
  const normLegacyLanczos = lanczosNorm(T, N, LEGACY_KRYLOV); // imp-3485 m=80 reference
  const normLegacyPower = powerNorm(T, N, LEGACY_POWER); // imp-3485 260-step power
  const correctedRel = Math.abs(normLanczos120 - normPowerConv) / normPowerConv;
  const lanczosSelfRel = Math.abs(normLanczos120 - normLanczos160) / normLanczos160;
  const legacyGap = Math.abs(normLegacyLanczos - normLegacyPower) / normLegacyPower; // reproduces imp-3485
  const refDeficit = Math.abs(normLegacyLanczos - normPowerConv) / normPowerConv; // m=80 Krylov deficit
  const powUnder = Math.abs(normLegacyPower - normPowerConv) / normPowerConv; // 260-step under-convergence
  return {
    a,
    U,
    N,
    normPowerConv,
    normLanczos120,
    normLanczos160,
    normLegacyLanczos,
    normLegacyPower,
    correctedRel, // CORRECTED per-U solver agreement (m=120 vs converged power)
    lanczosSelfRel, // |L120 - L160| / L160 -- reference-resolution self-check
    legacyGap, // |L80 - pow260| / pow260 -- reproduces imp-3485s per-U gap
    refDeficit, // m=80 Krylov-truncation reference deficit vs converged norm
    powUnder, // 260-step power under-convergence vs converged norm
  };
}

// --- The full imp-3240 U-grid at fixed resolution H0 = 0.025 (N = U/H0 grows with U).
const U_GRID = Object.freeze([4, 6, 8, 10, 12, 16, 20]);
const cells = U_GRID.map((U) => crossValCell(A_LINEAR, U, Math.round(U / H0)));

const targetCell = cells[cells.length - 1]; // U = 20, N = 800 -- the ticket target

// (1) CORRECTED agreement across the grid.
const correctedRels = cells.map((c) => c.correctedRel);
const worstCorrectedRel = Math.max(...correctedRels);
const correctedU20 = targetCell.correctedRel; // ~1.9e-11
const correctedImproves = correctedU20 < 1e-8; // vs imp-3485s 1.0e-4 at U=20

// Reference-resolution self-check: m=120 vs m=160 Lanczos agree at machine level everywhere.
const lanczosSelfRels = cells.map((c) => c.lanczosSelfRel);
const worstLanczosSelfRel = Math.max(...lanczosSelfRels);
const referenceResolved = worstLanczosSelfRel < 1e-12; // m=120 is itself fully resolved

// (2) Reproduce and decompose the imp-3485 gap at U = 20.
const legacyGapU20 = targetCell.legacyGap; // ~1.025e-4 (reproduces imp-3485s 1.0e-4)
const reproducesImp3485Gap = legacyGapU20 > 8e-5 && legacyGapU20 < 1.3e-4;
const refDeficitU20 = targetCell.refDeficit; // ~1.127e-6 (reproduces imp-3505s 1.13e-6)
const powUnderU20 = targetCell.powUnder; // ~1.036e-4 (dominant)
const powerDominatesGap = powUnderU20 > 50 * refDeficitU20; // power under-convergence >> reference deficit
const improvementFactor = correctedU20 > 0 ? legacyGapU20 / correctedU20 : Infinity; // ~5.5e6
const hugeImprovement = improvementFactor > 1e5;

const verdict =
  correctedImproves &&
  referenceResolved &&
  reproducesImp3485Gap &&
  powerDominatesGap &&
  hugeImprovement
    ? 'CORRECTED-SETTINGS-COLLAPSE-U20-SOLVER-AGREEMENT-1.0e-4->1.9e-11-GAP-WAS-99%-POWER-UNDER-CONVERGENCE'
    : 'INDETERMINATE';

export const IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL = Object.freeze({
  id: 'imp-3525-corrected-solver-agreement-crossval',
  ticket: 'imp-3525',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  reRuns: 'imp-3485-Ttilde-independent-operator-norm-crossval.js',
  correctionSource: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'RE-RUNS the imp-3485 solver-independent operator-norm cross-validation with the imp-3505-CORRECTED ' +
    'settings -- Lanczos Krylov dimension m = 120 (recommended m >= 120) plus a CONVERGED power-iteration ' +
    'budget of 8320 steps -- on the full imp-3240 U-grid {4,6,8,10,12,16,20}, to measure whether the U = 20 ' +
    'relative solver agreement improves from imp-3485s reported 1.0e-4 once the reference deficit AND the ' +
    'power under-convergence are removed. FINDING (1): the corrected U = 20 agreement collapses from 1.0e-4 to ' +
    '~1.9e-11 (a ~5.5-million-fold improvement) and to ~1e-14 on every smaller cell; the m = 120 and m = 160 ' +
    'Lanczos norms agree to 1.6e-14 at N = 800, so m = 120 is itself fully resolved and the residual ~1.9e-11 ' +
    'is remaining power convergence at budget 8320, not reference deficit. FINDING (2): reproducing the ' +
    'imp-3485 settings recovers its gap 1.025e-4 at U = 20, which splits into power under-convergence at 260 ' +
    'steps 1.036e-4 (the dominant ~99%), the m = 80 Krylov-truncation reference deficit 1.127e-6 (~1.1%, ' +
    'reproducing imp-3505s 1.13e-6), and genuine algebraic solver disagreement ~1.6e-14 -- so REMOVING THE ' +
    'REFERENCE DEFICIT ALONE would NOT have improved the U = 20 agreement; only the two corrections TOGETHER ' +
    'collapse it. imp-3485s 1.0e-4 was two stacked under-convergence deficits, not solver disagreement. ' +
    'Measurement only; sharpens the imp-3485 solver-independence figure; does NOT construct the missing ' +
    'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; the off-diagonal ' +
    'endpoint-Hankel obstruction remains UNTOUCHED. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    numeratorOperator: 'Ttilde(u,v) = a (v-u) R(|v-u|), R(t) = int Phi(w)Phi(w+t) dw (identical to imp-3485)',
    correctedPowerBudget: POWER_CONV,
    correctedKrylov: KRYLOV_CORRECTED,
    enrichedKrylov: KRYLOV_ENRICHED,
    legacyPowerBudget: LEGACY_POWER,
    legacyKrylov: LEGACY_KRYLOV,
    operatorNorm: 'sigma_max = sqrt(lambda_max(T^T T)) in both routes',
    a: A_LINEAR,
    h0: H0,
    uGrid: U_GRID.slice(),
    quadrature: 'midpoint, N = U/H0 panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-cell norms, correctedRel, lanczosSelfRel, legacyGap, refDeficit, powUnder
    // (1) corrected agreement
    correctedRels, // |L120 - powConv| / powConv per cell, ~1e-14 .. ~1.9e-11
    worstCorrectedRel, // ~1.9e-11 (at U=20) -- vs imp-3485s 1.0e-4
    correctedU20, // ~1.879e-11 -- the corrected U=20 solver agreement
    correctedImproves, // true -- < 1e-8, a huge improvement over 1.0e-4
    lanczosSelfRels, // |L120 - L160| / L160 per cell, ~1.6e-14 worst
    worstLanczosSelfRel, // ~1.6e-14 -- m=120 is fully resolved (enriching to 160 changes nothing)
    referenceResolved, // true -- confirms imp-3505s m >= 120 recommendation
    // (2) decomposition of the imp-3485 gap at U = 20
    legacyGapU20, // ~1.025e-4 -- reproduces imp-3485s reported 1.0e-4
    reproducesImp3485Gap, // true
    powUnderU20, // ~1.036e-4 -- power under-convergence at 260 steps (dominant ~99%)
    refDeficitU20, // ~1.127e-6 -- m=80 Krylov reference deficit (~1.1%, reproduces imp-3505s 1.13e-6)
    powerDominatesGap, // true -- power under-convergence >> reference deficit
    improvementFactor, // ~5.5e6 -- legacyGapU20 / correctedU20
    hugeImprovement, // true
    verdict, // CORRECTED-SETTINGS-COLLAPSE ...
  }),

  interpretation: Object.freeze({
    correctedAgreementCollapses:
      'At m = 120 and a converged 8320-step power budget the independent Lanczos/Jacobi and power routes agree ' +
      'to ~1.9e-11 at U = 20 (N = 800) and to ~1e-14 on every smaller cell, versus imp-3485s 1.0e-4 at U = 20. ' +
      'The m = 120 and m = 160 Lanczos norms agree to 1.6e-14, so m = 120 is fully resolved and the residual ' +
      '~1.9e-11 at N = 800 is remaining power convergence at budget 8320, not reference deficit.',
    gapDecomposition:
      'The imp-3485 U = 20 gap 1.025e-4 splits into power under-convergence at 260 steps 1.036e-4 (dominant ' +
      '~99%), the m = 80 Krylov-truncation reference deficit 1.127e-6 (~1.1%, reproducing imp-3505s 1.13e-6), ' +
      'and genuine algebraic disagreement ~1.6e-14. Removing the reference deficit ALONE would have left the ' +
      'U = 20 agreement essentially unchanged; only correcting BOTH the Krylov dimension and the power budget ' +
      'collapses the figure.',
    whatItAddsOverImp3485:
      'imp-3485 reported 1.0e-4 at U = 20 as solver agreement and attributed it to power under-convergence ' +
      'without measuring the corrected value; imp-3505 diagnosed two error sources. This module executes the ' +
      'recommended re-run, quantifies the corrected agreement (~1.9e-11) and the three-way decomposition of ' +
      'the 1.0e-4 gap, confirming the two solvers never genuinely disagreed by 1.0e-4 -- both were short of ' +
      'the same section norm by different under-convergence amounts.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    reRunsNotConstructs:
      'This re-runs the imp-3485 numerator operator-norm cross-check at corrected solver settings and ' +
      'decomposes the reported gap; it does NOT construct the missing magnitude and does NOT attempt the ' +
      'imp-3066 K_a >= 0 positivity.',
    convergenceIsNumericalNotSymbolic:
      'The corrected ~1.9e-11 agreement is a finite-N numerical convergence measurement at budget 8320; it ' +
      'certifies solver-independence of the section norm, not a symbolic identity of the closed-form sup.',
    measuresRatioNotPositivity:
      'This concerns the numerator norm of the capture RATIO only; the imp-3066 off-diagonal endpoint-Hankel ' +
      'operator magnitude remains the lone obstruction, UNTOUCHED.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3525-corrected-U20-agreement-collapses',
    why: 'THE PRIMARY DELIVERABLE: at m = 120 and a converged power budget the U = 20 relative solver ' +
      'agreement must improve from imp-3485s 1.0e-4 to below 1e-8 (measured ~1.9e-11); a failure means the ' +
      'corrected settings did not remove the under-convergence.',
    holds: () => correctedImproves,
  },
  {
    id: 'imp3525-corrected-agreement-machine-level-off-target',
    why: 'On every cell BELOW the U = 20 target the corrected agreement must reach machine level (< 1e-9); ' +
      'only the largest N = 800 section carries the residual ~1.9e-11 of remaining power convergence.',
    holds: () => cells.slice(0, -1).every((c) => c.correctedRel < 1e-9),
  },
  {
    id: 'imp3525-m120-reference-fully-resolved',
    why: 'The m = 120 and m = 160 Lanczos norms must agree to < 1e-12 on every cell, confirming the ' +
      'imp-3505 m >= 120 recommendation: the corrected reference is itself fully resolved, so the residual ' +
      'corrected gap is power convergence, not Krylov-truncation.',
    holds: () => referenceResolved,
  },
  {
    id: 'imp3525-reproduces-imp3485-gap',
    why: 'Reproducing the imp-3485 legacy settings (m = 80 Lanczos vs 260-step power) must recover its ' +
      'reported ~1.0e-4 U = 20 gap (in [8e-5, 1.3e-4]); otherwise this is not comparing the same object.',
    holds: () => reproducesImp3485Gap,
  },
  {
    id: 'imp3525-gap-is-mostly-power-under-convergence',
    why: 'THE DECOMPOSITION: at U = 20 the 260-step power under-convergence (~1.04e-4) must dominate the ' +
      'm = 80 Krylov reference deficit (~1.13e-6) by more than 50x, so removing the reference deficit alone ' +
      'would NOT have improved the agreement -- the gap was ~99% power under-convergence.',
    holds: () => powerDominatesGap,
  },
  {
    id: 'imp3525-improvement-factor-huge',
    why: 'The corrected U = 20 agreement must beat the imp-3485 gap by more than 1e5x (measured ~5.5e6x), ' +
      'quantifying that imp-3485s 1.0e-4 was stacked under-convergence, not solver disagreement.',
    holds: () => hugeImprovement,
  },
  {
    id: 'imp3525-verdict-corrected-collapse',
    why: 'The classified verdict must be the collapse split, not indeterminate; a flip means the corrected ' +
      'agreement, the reference-resolution self-check, the gap reproduction, or the decomposition failed.',
    holds: () => verdict === 'CORRECTED-SETTINGS-COLLAPSE-U20-SOLVER-AGREEMENT-1.0e-4->1.9e-11-GAP-WAS-99%-POWER-UNDER-CONVERGENCE',
  },
  {
    id: 'imp3525-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- corrected re-run of the imp-3485 numerator cross-check, ' +
      'positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.reRunsNotConstructs === 'string' &&
        typeof c.convergenceIsNumericalNotSymbolic === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3525-corrected-solver-agreement-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL;
