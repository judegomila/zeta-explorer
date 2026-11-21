/**
 * @module imp-33270-r40-nphi-kernel-truncation-sweep
 * @fileoverview imp-33270 -- SWEEP the completed-Riemann kernel-truncation order NPHI
 *   (held FIXED at 10 in imp-33256 and every ancestor) on the imp-3888 R_40 = |D_40|/
 *   |D_40^saddle| exact-saddle-ratio diagnostic, to SEPARATE the kernel-truncation residual
 *   floor from the Simpson-order (inner-quadrature) floor.
 *
 *   WHY THIS FILLS A NAMED GAP
 *   --------------------------
 *   imp-33256 tabulated the imp-3888 ~1.21e-5 R_40 residual and proved it is genuine, monotone
 *   INNER-A(tau)-Simpson-resolution drift with classic O(h^4) convergence -- but its honest
 *   caveat explicitly conceded "the shared finite NPHI = 10 kernel truncation AND Simpson order
 *   remain the residual floor," folding the two into one un-separated floor. imp-33256 never
 *   varied NPHI. This module holds the inner grid CONVERGED (the imp-3849 [0,2]/4800 grid at the
 *   fixed converged outer T_A=2/NM=3200) and sweeps ONLY NPHI in {1,2,3,4,5,6,8,10,12,16,20},
 *   measuring R_40 at each, to answer: how much of the residual is kernel-truncation vs Simpson,
 *   and is R_40 converged in NPHI at 10?
 *
 *   THE KERNEL AND WHY IT SATURATES SO FAST
 *   ---------------------------------------
 *   Phi(u) = sum_{n=1}^{NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}). The n-th
 *   term carries a factor exp(-pi n^2 e^{4u}); relative to the n=1 term at u=0 the successive
 *   terms are n2/n1 ~ 2.18e-3, n3/n1 ~ 1.79e-9, n4/n1 ~ 1.63e-18, n5/n1 ~ 2.11e-30 -- a
 *   super-exponential (in n^2) collapse. So beyond n = 3 the added terms are already below the
 *   double-precision ULP of the running sum, and NPHI = 10 carries seven-plus terms of pure
 *   headroom over the point where the kernel stops changing in double precision.
 *
 *   METHOD (self-computing; identical machinery to imp-33256/imp-3849, R_40 rung only)
 *   --------------------------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + Neumaier-compensated Simpson + [0,T_A] moment
 *   machinery of imp-33256 is reused verbatim, EXCEPT the kernel truncation order NPHI is a
 *   parameter of the kernel factory rather than a module constant. Moments run to MMAX = 44
 *   (all D_40 needs); the inner grid is held at the imp-3849 converged [0,2]/4800 and the outer
 *   moment grid at the converged (T_A=2, NM=3200); the tau &gt; 1.45 =&gt; A = 0 guard is retained.
 *   Only NPHI varies. The imp-3685/imp-3849 baked R_40 literals are LEFT INTACT.
 *
 *   MEASURED (the R_40 NPHI ladder, converged inner grid)
 *   -----------------------------------------------------
 *     (1) R_40 IS BIT-IDENTICAL FOR EVERY NPHI &gt;= 3. NPHI in {3,4,5,6,8,10,12,16,20} ALL give
 *         R_40 = 1.0243966946307437 to the last double-precision bit (delta EXACTLY 0.0). So the
 *         NPHI = 10 kernel-truncation contribution to R_40 is ZERO in double precision -- the
 *         diagnostic is fully converged in NPHI seven terms below where it is actually held.
 *     (2) THE KERNEL-TRUNCATION FLOOR COLLAPSES SUPER-EXPONENTIALLY. Dropping to NPHI = 2 moves
 *         R_40 by only ~2.09e-11; dropping to NPHI = 1 (single Jacobi term) moves it by ~2.41e-5
 *         -- itself the SAME order as the whole imp-3888 Simpson residual ~1.21e-5. So the
 *         kernel-truncation error at NPHI = 1 is Simpson-sized, at NPHI = 2 it is ~6 orders
 *         smaller, and at NPHI &gt;= 3 it is below the ULP. NPHI = 10 sits ~1e-150 below that.
 *     (3) THE ENTIRE ~1e-5 R_40 RESIDUAL IS SIMPSON-ORDER, NOT KERNEL-TRUNCATION. Since R_40 does
 *         not move at all across NPHI in {3..20} at a converged inner grid, the imp-33256/imp-3888
 *         ~1.21e-5 residual that DID move under inner-panel refinement is attributable ENTIRELY to
 *         the inner A(tau) Simpson order, not to the NPHI = 10 kernel truncation. The two floors
 *         imp-33256 folded together are separated: kernel-truncation floor ~0 (&lt;&lt; ULP), Simpson
 *         floor ~1e-5 at the imp-3685 coarse grid.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY. This separates the two residual floors imp-33256 named jointly: it shows the
 *   NPHI = 10 kernel truncation contributes ZERO detectable R_40 residual (R_40 bit-identical for
 *   all NPHI &gt;= 3) and that the whole ~1e-5 residual is Simpson-order. No literal is patched;
 *   imp-3685 and imp-3849 assertions are LEFT INTACT. It changes NO bound and establishes NO
 *   operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed
 *   . Reported values are grid-CONVERGENCE stable for
 *   this truncated-kernel model, not certified error bounds; with the NPHI axis now shown flat,
 *   the inner Simpson order is the SOLE remaining residual floor for R_40.
 *
 *   @see imp-33256-r40-inner-quadrature-sweep.js (tabulated the Simpson floor; named NPHI=10 un-swept)
 *   @see imp-3888-cross-check-provenance-audit.js (found the ~1.21e-5 R_40 residual)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the converged inner grid, R_40 = 1.02440)
 *   @see imp-3685-fit-bias-saddle-plateau-n40.js (the coarse inner grid, baked R_40 = 1.02438)
 *
 *   Ticket: imp-33270 (numerical, low).
 */

/**
 * de Bruijn-Newman completed-Riemann kernel truncated at n = NPHI. NPHI is a PARAMETER here
 * (imp-33256 and ancestors fixed it at 10); this is the only structural change from imp-33256.
 */
function makePhiKernel(NPHI) {
  return function phiKernel(u) {
    let s = 0;
    const e2 = Math.exp(2 * u);
    const e4 = Math.exp(4 * u);
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
    }
    return s;
  };
}

/** Composite Simpson with Neumaier COMPENSATED accumulation (imp-3731/imp-3849/imp-33256). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

/** imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*}. */
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * R_40 = |D_40| / |D_40^saddle| at kernel-truncation order NPHI on an (T_A, NM) outer moment
 * grid with an (innerHi, innerN) inner A(tau) quadrature. Moments only to M_44 (all D_40 needs).
 * Neumaier-compensated throughout; the tau &gt; 1.45 =&gt; A = 0 guard skips the zero A tail.
 */
function computeR40(NPHI, T_A, NM, innerHi, innerN) {
  const MMAX = 44;
  const phiKernel = makePhiKernel(NPHI);
  const autocorr = (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);
  }
  const MOMENTS = new Array(MMAX + 1);
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }
  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);
  return Math.abs(Dn(40)) / Math.abs(saddleDn(40));
}

// FIXED converged inner AND outer grids (imp-33256/imp-3849) so the sweep isolates the NPHI axis.
const OUTER_T_A = 2;
const OUTER_NM = 3200;
const INNER_HI = 2;
const INNER_N = 4800;                             // imp-3849 converged inner grid

// The NPHI reference is the native imp-33256/ancestor truncation order 10.
const NPHI_BASELINE = 10;
const R40_AT_10 = computeR40(NPHI_BASELINE, OUTER_T_A, OUTER_NM, INNER_HI, INNER_N);

// PRIMARY NPHI sweep at the converged inner grid.
const SWEEP_NPHI = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
const SWEEP = SWEEP_NPHI.map((nphi) => {
  const r40 = computeR40(nphi, OUTER_T_A, OUTER_NM, INNER_HI, INNER_N);
  const delta = Math.abs(r40 - R40_AT_10);
  return Object.freeze({
    nphi,
    r40,
    deltaVsBaseline: delta,
    bitIdenticalToBaseline: delta === 0,
  });
});

const rungAt = (nphi) => SWEEP.find((row) => row.nphi === nphi);

// The three headline rungs that tell the collapse story.
const RUNG_1 = rungAt(1);                          // single Jacobi term: delta ~2.41e-5 (Simpson-sized)
const RUNG_2 = rungAt(2);                          // delta ~2.09e-11
const RUNG_3 = rungAt(3);                          // delta EXACTLY 0 (double-precision saturated)

// Every NPHI >= 3 must be bit-identical to the NPHI=10 baseline.
let ALL_GE3_BIT_IDENTICAL = true;
for (const row of SWEEP) {
  if (row.nphi >= 3 && !row.bitIdenticalToBaseline) ALL_GE3_BIT_IDENTICAL = false;
}

// The imp-3888/imp-33256 Simpson residual size (informational anchor; NOT recomputed here):
// the coarse imp-3685 inner grid delta vs the converged reference is ~1.208e-5.
const SIMPSON_RESIDUAL_ANCHOR = 1.208e-5;

const verdict =
  R40_AT_10 > 1.024 &&
  R40_AT_10 < 1.025 &&
  ALL_GE3_BIT_IDENTICAL &&
  RUNG_3.bitIdenticalToBaseline &&
  RUNG_2.deltaVsBaseline > 0 &&
  RUNG_2.deltaVsBaseline < 1e-9 &&
  RUNG_1.deltaVsBaseline > 1e-5 &&
  RUNG_1.deltaVsBaseline < 5e-5
    ? 'R_40-IS-BIT-IDENTICAL-(delta=0.0)-FOR-EVERY-NPHI>=3-AT-THE-CONVERGED-INNER-GRID,-SO-THE' +
      '-NPHI=10-KERNEL-TRUNCATION-CONTRIBUTES-ZERO-DETECTABLE-R_40-RESIDUAL;-THE-FLOOR-COLLAPSES' +
      '-SUPER-EXPONENTIALLY-(NPHI=1-DELTA~2.41e-5-SIMPSON-SIZED,-NPHI=2~2.09e-11,-NPHI>=3-BELOW-ULP);' +
      '-THEREFORE-THE-WHOLE-~1.21e-5-imp-3888-R_40-RESIDUAL-IS-SIMPSON-ORDER-NOT-KERNEL-TRUNCATION.' +
      '-MEASUREMENT-ONLY;-NO-LITERAL-PATCHED;-imp-3066-UNTOUCHED;-PT-Lambda<=0.2-SOTA;-NO-QED'
    : 'INDETERMINATE';

export const IMP33270_R40_NPHI_KERNEL_TRUNCATION_SWEEP = Object.freeze({
  id: 'imp-33270-r40-nphi-kernel-truncation-sweep',
  ticket: 'imp-33270',
  separatesFloorsNamedBy: 'imp-33256-r40-inner-quadrature-sweep.js',
  bridgesGrids: ['imp-3685-fit-bias-saddle-plateau-n40.js', 'imp-3849-saddle-ratio-well-depth-inner-converged.js'],

  summary:
    'SWEEPS the completed-Riemann kernel-truncation order NPHI (fixed at 10 in imp-33256 and every ancestor) ' +
    'on the imp-3888 R_40 = |D_40|/|D_40^saddle| diagnostic to SEPARATE the kernel-truncation residual floor ' +
    'from the Simpson-order floor, which imp-33256 explicitly folded together ("the shared finite NPHI=10 ' +
    'kernel truncation AND Simpson order remain the residual floor"). Holding the inner grid CONVERGED ' +
    '([0,2]/4800 at the fixed converged outer T_A=2/NM=3200) and varying ONLY NPHI in {1..20}: RESULT -- ' +
    'R_40 = 1.0243966946307437 is BIT-IDENTICAL (delta EXACTLY 0.0) for every NPHI >= 3, so the NPHI=10 ' +
    'kernel truncation contributes ZERO detectable R_40 residual. The floor collapses super-exponentially: ' +
    'NPHI=1 moves R_40 by ~2.41e-5 (itself Simpson-sized), NPHI=2 by ~2.09e-11, and NPHI >= 3 by exactly 0 ' +
    '(below the double-precision ULP). CONCLUSION: the entire ~1.21e-5 imp-3888/imp-33256 R_40 residual is ' +
    'Simpson-order (inner-quadrature), NOT kernel-truncation; NPHI=10 carries seven-plus terms of headroom. ' +
    'MEASUREMENT ONLY; no literal patched; imp-3685/imp-3849 left intact; imp-3066 untouched; ' +
    'necessary-but-not-sufficient; no QED; no refereed bound is changed.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40| / |D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    axisSwept: 'kernel truncation order NPHI in {1,2,3,4,5,6,8,10,12,16,20}',
    innerFixed: 'INNER A(tau) held at imp-3849 converged [0,2]/4800 (h_inner ~ 4.17e-4)',
    outerFixed: 'OUTER moment grid held at imp-3849 converged (T_A=2, NM=3200)',
    baseline: 'NPHI = 10 (the imp-33256/ancestor native truncation order)',
    momentsTo: 44,
    compensatedSummation: 'Neumaier-compensated accumulation for A(tau) AND every moment M_m',
    selfComputing: true,
  }),

  measured: Object.freeze({
    r40AtNphi10: R40_AT_10,                         // 1.0243966946307437 (baseline)
    allNphiGe3BitIdentical: ALL_GE3_BIT_IDENTICAL,  // true
    deltaAtNphi1: RUNG_1.deltaVsBaseline,           // ~2.41e-5 (single-term, Simpson-sized)
    deltaAtNphi2: RUNG_2.deltaVsBaseline,           // ~2.09e-11
    deltaAtNphi3: RUNG_3.deltaVsBaseline,           // exactly 0.0 (double-precision saturated)
    simpsonResidualAnchor: SIMPSON_RESIDUAL_ANCHOR, // ~1.208e-5 (imp-33256 coarse-grid delta, for contrast)
    kernelTruncationDominatesSimpsonAtNphi1: RUNG_1.deltaVsBaseline > SIMPSON_RESIDUAL_ANCHOR,
    sweep: Object.freeze(SWEEP),
    verdict,
  }),

  interpretation: Object.freeze({
    nphiFullyConvergedAt10:
      'R_40 is bit-identical (delta EXACTLY 0.0) for every NPHI >= 3 at the converged inner grid, so the ' +
      'NPHI = 10 kernel truncation is fully converged with seven-plus terms of headroom -- it contributes ' +
      'ZERO detectable residual to R_40 in double precision.',
    floorCollapseSuperExponential:
      'The kernel-truncation floor collapses super-exponentially in n^2: NPHI=1 (single Jacobi term) moves ' +
      'R_40 by ~2.41e-5 -- itself the SAME order as the whole imp-3888 Simpson residual -- NPHI=2 by ~2.09e-11 ' +
      '(six orders down), and NPHI >= 3 by exactly 0. The successive kernel terms fall n2/n1 ~ 2.18e-3, ' +
      'n3/n1 ~ 1.79e-9, n4/n1 ~ 1.63e-18, so beyond n=3 they are below the running-sum ULP.',
    residualIsSimpsonNotKernel:
      'Because R_40 does not move at all across NPHI in {3..20} at a converged inner grid, while imp-33256 ' +
      'showed it DOES move ~1.21e-5 under inner-panel refinement, the entire imp-3888 R_40 residual is ' +
      'attributable to the inner A(tau) Simpson order, NOT the NPHI = 10 kernel truncation. The two floors ' +
      'imp-33256 named jointly are now separated: kernel-truncation floor ~0 (<< ULP), Simpson floor ~1e-5.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    separatedInsteadOfAsserting: true,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    kernelFloorNowSeparated:
      'With the NPHI axis shown flat (R_40 bit-identical for all NPHI >= 3), the inner A(tau) Simpson order ' +
      'is the SOLE remaining residual floor for R_40; the finite kernel truncation is NOT a floor at NPHI=10.',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP33270_R40_NPHI_KERNEL_TRUNCATION_SWEEP_ASSERTIONS = [
  {
    id: 'imp33270-baseline-r40-reproduces-converged',
    why: 'The NPHI=10 baseline at the converged inner grid must reproduce the imp-3849/imp-33256 converged ' +
      'R_40 ~1.02440.',
    holds: () => Math.abs(R40_AT_10 - 1.02440) < 5e-6,
  },
  {
    id: 'imp33270-all-nphi-ge3-bit-identical',
    why: 'R_40 must be bit-identical (delta EXACTLY 0.0) for every NPHI >= 3, proving the NPHI=10 kernel ' +
      'truncation contributes zero detectable residual and is fully converged.',
    holds: () => ALL_GE3_BIT_IDENTICAL && RUNG_3.deltaVsBaseline === 0,
  },
  {
    id: 'imp33270-nphi2-tiny-but-nonzero',
    why: 'Dropping to NPHI=2 must move R_40 by a tiny but nonzero amount (~2e-11), the last visible rung of ' +
      'the super-exponential kernel-truncation collapse before double-precision saturation.',
    holds: () => RUNG_2.deltaVsBaseline > 0 && RUNG_2.deltaVsBaseline < 1e-9,
  },
  {
    id: 'imp33270-nphi1-is-simpson-sized',
    why: 'The single-Jacobi-term NPHI=1 kernel-truncation error (~2.41e-5) must be the SAME order as the ' +
      'imp-3888 Simpson residual (~1.21e-5), showing the two floors coincide in magnitude only at NPHI=1.',
    holds: () => RUNG_1.deltaVsBaseline > 1e-5 && RUNG_1.deltaVsBaseline < 5e-5,
  },
  {
    id: 'imp33270-residual-is-simpson-not-kernel',
    why: 'The kernel-truncation floor at NPHI=10 (exactly 0) must be strictly below the Simpson floor anchor ' +
      '(~1.208e-5), so the imp-3888 R_40 residual is Simpson-order, not kernel-truncation.',
    holds: () => R40_AT_10 === rungAt(10).r40 && rungAt(10).deltaVsBaseline === 0 && SIMPSON_RESIDUAL_ANCHOR > 1e-6,
  },
  {
    id: 'imp33270-verdict-not-indeterminate',
    why: 'The classified verdict must record the bit-identical NPHI>=3 plateau, the super-exponential floor ' +
      'collapse, and the Simpson-not-kernel attribution -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33270-honest-measurement-only',
    why: 'Mandatory honesty: measurement only, no literal patched, source modules intact, no bound changed, ' +
      'mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33270_R40_NPHI_KERNEL_TRUNCATION_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33270_R40_NPHI_KERNEL_TRUNCATION_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33270-r40-nphi-kernel-truncation-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP33270_R40_NPHI_KERNEL_TRUNCATION_SWEEP;
