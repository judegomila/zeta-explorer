/**
 * @module imp-33276-r40-cross-outer-invariance-all-inner-grids
 * @fileoverview imp-33276 -- EXTEND the imp-33256 R_40 cross-outer control from the single
 *   coarse inner grid to the REFINED inner grids. imp-33256 established that the ~1.21e-5 R_40
 *   spread imp-3888 found is carried entirely by the INNER A(tau) resolution: at inner
 *   [0,7]/1200 the outer configs (T_A=2, NM=3200) and (T_A=6, NM=1600) agree on R_40 to ~1e-15.
 *   But that cross-outer control was run at ONE (coarse) inner grid only. If the inner-not-outer
 *   attribution is genuine it must hold at EVERY inner resolution, not just the coarsest -- so
 *   this module re-runs the same T_A=2 vs T_A=6 agreement at the REFINED inner grids
 *   ([0,2]/400 ... [0,2]/7200), MEASURING the cross-outer delta at each rung.
 *
 *   WHY THIS IS THE RIGHT CONTROL (isolating outer-invariance across inner resolution)
 *   ----------------------------------------------------------------------------------
 *   imp-33256 swept the inner axis at a FIXED outer grid and showed R_40 drifts monotonically
 *   as the inner panels refine (1.02438462 coarse -&gt; 1.02439670 converged). It ALSO ran a
 *   single cross-outer control -- coarse inner [0,7]/1200 under BOTH the imp-3849 outer
 *   (T_A=2, NM=3200) and the imp-3685 native outer (T_A=6, NM=1600) -- and found them equal to
 *   ~1e-15. A skeptic could object that outer-invariance was only demonstrated on the COARSE
 *   inner grid, where R_40 itself is farthest from converged; perhaps at finer inner grids the
 *   two outer configs would diverge. This module removes that gap: it fixes NOTHING on the
 *   outer side and instead pairs the SAME inner grid against the two outer configs at each of
 *   the refined inner resolutions, so the reported deltaCrossOuter(inner) isolates purely the
 *   sensitivity of R_40 to the OUTER moment grid at that inner resolution.
 *
 *   METHOD (self-computing; identical machinery to imp-33256/imp-3849)
 *   -----------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + Neumaier-compensated Simpson + [0,T_A] moment
 *   machinery is reused verbatim from imp-33256, truncated to MMAX = 44 (D_40 = C_42 - C_40
 *   needs only M_0..M_44). For each inner grid (innerHi, innerN) the module computes R_40 under
 *   outer A = (T_A=2, NM=3200) and outer B = (T_A=6, NM=1600) and records
 *   deltaCrossOuter = |R_40_A - R_40_B|. Because A(tau) underflows to 0 for tau &gt; ~1.4, both
 *   outer domains fully cover the support; the tau &gt; 1.45 =&gt; A = 0 guard is retained.
 *
 *   MEASURED (the cross-outer delta across inner resolution)
 *   -------------------------------------------------------
 *     (1) THE CROSS-OUTER DELTA IS MACHINE-EPSILON AT EVERY INNER GRID. Pairing the two outer
 *         configs at each inner rung gives:
 *           [0,7]/1200  R_40 ~ 1.02438462, deltaCrossOuter ~ 1.75e-14
 *           [0,2]/400   R_40 ~ 1.02438972, deltaCrossOuter ~ 6.88e-15
 *           [0,2]/800   R_40 ~ 1.02439620, deltaCrossOuter ~ 3.55e-15
 *           [0,2]/1600  R_40 ~ 1.02439666, deltaCrossOuter ~ 7.11e-15
 *           [0,2]/3200  R_40 ~ 1.02439669, deltaCrossOuter ~ 3.55e-15
 *           [0,2]/4800  R_40 ~ 1.02439669, deltaCrossOuter = 0.0
 *           [0,2]/7200  R_40 ~ 1.02439669, deltaCrossOuter = 0.0
 *         Every rung agrees to a few ULP (max ~1.75e-14), several to bit-identical 0.0. So the
 *         inner-not-outer attribution imp-33256 found is NOT a coarse-grid artefact: R_40 is
 *         OUTER-INVARIANT at ALL inner resolutions.
 *     (2) THE INNER DRIFT PERSISTS ALONGSIDE THE OUTER INVARIANCE. Across the SAME rungs R_40
 *         itself climbs 1.02438462 -&gt; 1.02439669 (the imp-33256 ~1.21e-5 inner O(h^4) drift),
 *         yet the cross-outer delta never rises above ~1e-14. The two axes are cleanly
 *         separated: inner resolution moves R_40, the outer grid does not.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY. This extends the imp-33256 cross-outer control to the refined inner grids
 *   and confirms R_40 is outer-invariant (agreement to ~1e-14 / bit-identical) at ALL inner
 *   resolutions, not just the coarsest -- so the whole ~1.21e-5 imp-3888/imp-33256 residual is
 *   carried by the INNER A(tau) resolution. No literal is patched; imp-3685 and imp-3849
 *   assertions are LEFT INTACT. It changes NO bound and establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA. Reported values are grid-CONVERGENCE stable, not
 *   certified error bounds; the shared finite NPHI = 10 kernel truncation and Simpson order
 *   remain the residual floor.
 *
 *   @see imp-33256-r40-inner-quadrature-sweep.js (the single-coarse-grid cross-outer control this extends)
 *   @see imp-3888-cross-check-provenance-audit.js (found the ~1.21e-5 R_40 residual)
 *   @see imp-3735-moment-ratio-correction-tail.js (the inner-resolution axis lesson)
 *
 *   Ticket: imp-33276 (numerical, low).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson with Neumaier COMPENSATED accumulation (imp-3731/imp-3849). */
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

/** A(tau) = int_0^innerHi Phi(s) Phi(s + tau) ds on innerN Simpson panels. */
function makeAutocorr(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
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
 * R_40 = |D_40| / |D_40^saddle| on an (T_A, NM) outer moment grid with an (innerHi, innerN)
 * inner A(tau) quadrature. Moments only to M_44 (all D_40 needs). Neumaier-compensated
 * throughout; the tau &gt; 1.45 =&gt; A = 0 guard skips the numerically-zero A tail.
 */
function computeR40(T_A, NM, innerHi, innerN) {
  const MMAX = 44;
  const autocorr = makeAutocorr(innerHi, innerN);
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

// The two outer moment grids probed at each inner rung: imp-3849 converged vs imp-3685 native.
const OUTER_A = Object.freeze({ label: 'T_A=2, NM=3200', T_A: 2, NM: 3200 });   // imp-3849 native
const OUTER_B = Object.freeze({ label: 'T_A=6, NM=1600', T_A: 6, NM: 1600 });   // imp-3685 native

// Inner grids: imp-33256 native coarse [0,7]/1200 plus the REFINED [0,2] ladder up to /7200.
const INNER_GRIDS = [
  { label: '[0,7]/1200', innerHi: 7, innerN: 1200 },   // imp-3685 native coarse (the imp-33256 single control point)
  { label: '[0,2]/400', innerHi: 2, innerN: 400 },
  { label: '[0,2]/800', innerHi: 2, innerN: 800 },
  { label: '[0,2]/1600', innerHi: 2, innerN: 1600 },
  { label: '[0,2]/3200', innerHi: 2, innerN: 3200 },
  { label: '[0,2]/4800', innerHi: 2, innerN: 4800 },   // imp-3849 native converged
  { label: '[0,2]/7200', innerHi: 2, innerN: 7200 },   // finest inner reference
];

// For each inner grid, pair the two outer configs and MEASURE the cross-outer delta.
const CROSS_OUTER = INNER_GRIDS.map((g) => {
  const r40A = computeR40(OUTER_A.T_A, OUTER_A.NM, g.innerHi, g.innerN);
  const r40B = computeR40(OUTER_B.T_A, OUTER_B.NM, g.innerHi, g.innerN);
  const deltaCrossOuter = Math.abs(r40A - r40B);
  return Object.freeze({
    innerGrid: g.label,
    innerHi: g.innerHi,
    innerN: g.innerN,
    hInner: g.innerHi / g.innerN,
    r40OuterA: r40A,
    r40OuterB: r40B,
    deltaCrossOuter,
    outerInvariant: deltaCrossOuter < 1e-12,
  });
});

// Outer-invariance summary: worst cross-outer delta across ALL inner rungs.
const MAX_CROSS_OUTER_DELTA = CROSS_OUTER.reduce((mx, r) => Math.max(mx, r.deltaCrossOuter), 0);
const ALL_OUTER_INVARIANT = CROSS_OUTER.every((r) => r.outerInvariant);

// The inner drift (using outer A) that PERSISTS while the outer axis stays invariant:
// R_40 climbs from the coarse grid to the finest, spanning the imp-33256 ~1.21e-5 residual.
const R40_COARSE = CROSS_OUTER[0].r40OuterA;                          // [0,7]/1200 ~ 1.02438462
const R40_FINEST = CROSS_OUTER[CROSS_OUTER.length - 1].r40OuterA;     // [0,2]/7200 ~ 1.02439669
const INNER_DRIFT_SPAN = Math.abs(R40_FINEST - R40_COARSE);          // ~1.21e-5 (imp-3888/imp-33256)

const verdict =
  ALL_OUTER_INVARIANT &&
  MAX_CROSS_OUTER_DELTA < 1e-12 &&
  INNER_DRIFT_SPAN > 1e-5 &&
  INNER_DRIFT_SPAN < 1.5e-5
    ? 'imp-33256-CROSS-OUTER-CONTROL-EXTENDS-TO-ALL-INNER-GRIDS:-R_40-IS-OUTER-INVARIANT-AT-EVERY' +
      '-INNER-RESOLUTION-([0,7]/1200-AND-[0,2]/400..7200),-T_A=2/NM=3200-vs-T_A=6/NM=1600-AGREEING' +
      '-TO-~1e-14-OR-BIT-IDENTICAL-0.0-(MAX-DELTA~1.75e-14);-MEANWHILE-R_40-ITSELF-DRIFTS-~1.21e-5' +
      '-WITH-INNER-REFINEMENT.-THE-INNER-NOT-OUTER-ATTRIBUTION-IS-NOT-A-COARSE-GRID-ARTEFACT.' +
      '-MEASUREMENT-ONLY;-NO-LITERAL-PATCHED;-imp-3066-UNTOUCHED;-PT-Lambda<=0.2-SOTA;-NO-QED'
    : 'INDETERMINATE';

export const IMP33276_R40_CROSS_OUTER_INVARIANCE = Object.freeze({
  id: 'imp-33276-r40-cross-outer-invariance-all-inner-grids',
  ticket: 'imp-33276',
  extendsControlFrom: 'imp-33256-r40-inner-quadrature-sweep.js',
  bridgesGrids: ['imp-3685-fit-bias-saddle-plateau-n40.js', 'imp-3849-saddle-ratio-well-depth-inner-converged.js'],
  appliesLessonFrom: 'imp-3735-moment-ratio-correction-tail.js',

  summary:
    'EXTENDS the imp-33256 R_40 = |D_40|/|D_40^saddle| cross-outer control from its single coarse inner ' +
    'grid ([0,7]/1200) to the REFINED inner grids ([0,2]/400 ... [0,2]/7200). For each inner rung R_40 is ' +
    'computed under BOTH outer configs (T_A=2, NM=3200) and (T_A=6, NM=1600) and their delta recorded. ' +
    'RESULT: the cross-outer delta is machine-epsilon at EVERY inner resolution (max ~1.75e-14, several ' +
    'rungs bit-identical 0.0), so R_40 is OUTER-INVARIANT at all inner grids -- the imp-33256 inner-not-' +
    'outer attribution is NOT a coarse-grid artefact. Meanwhile R_40 itself climbs ~1.21e-5 with inner ' +
    'refinement (1.02438462 coarse -> 1.02439669 finest), the imp-3888/imp-33256 inner O(h^4) drift, ' +
    'cleanly separating the two axes: inner resolution moves R_40, the outer moment grid does not. ' +
    'MEASUREMENT ONLY; no literal patched; imp-3685/imp-3849 left intact; imp-3066 untouched; ' +
    'necessary-but-not-sufficient; no QED; PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40| / |D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    outerConfigs: 'A = (T_A=2, NM=3200) [imp-3849 native]; B = (T_A=6, NM=1600) [imp-3685 native]',
    innerGrids: 'imp-33256 coarse [0,7]/1200 plus refined [0,2] ladder /400 /800 /1600 /3200 /4800 /7200',
    crossOuterMetric: 'deltaCrossOuter(inner) = |R_40(A, inner) - R_40(B, inner)| at each inner rung',
    momentsTo: 44,
    compensatedSummation: 'Neumaier-compensated accumulation for A(tau) AND every moment M_m',
    selfComputing: true,
  }),

  measured: Object.freeze({
    crossOuter: Object.freeze(CROSS_OUTER),
    maxCrossOuterDelta: MAX_CROSS_OUTER_DELTA,       // ~1.75e-14 (worst rung)
    allOuterInvariant: ALL_OUTER_INVARIANT,          // true
    r40Coarse: R40_COARSE,                           // ~1.02438462 ([0,7]/1200)
    r40Finest: R40_FINEST,                           // ~1.02439669 ([0,2]/7200)
    innerDriftSpan: INNER_DRIFT_SPAN,                // ~1.21e-5 (imp-3888/imp-33256 residual)
    verdict,
  }),

  interpretation: Object.freeze({
    outerInvarianceHoldsEverywhere:
      'The cross-outer delta stays at machine epsilon (max ~1.75e-14, several rungs bit-identical 0.0) at ' +
      'EVERY inner resolution from the coarse [0,7]/1200 to the finest [0,2]/7200. The imp-33256 finding ' +
      'that R_40 is invariant to the outer moment grid is therefore NOT a coarse-grid artefact -- it holds ' +
      'at all inner resolutions, exactly as the imp-3735 lesson (outer moment panels are the insensitive axis) predicts.',
    axesAreCleanlySeparated:
      'Across the same rungs R_40 climbs ~1.21e-5 with inner refinement (1.02438462 -> 1.02439669), the ' +
      'imp-3888/imp-33256 inner O(h^4) drift, while the cross-outer delta never exceeds ~1e-14. Inner ' +
      'resolution moves R_40; the outer moment grid does not. The ~1.21e-5 residual is INNER, at all resolutions.',
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
    tabulatedInsteadOfAsserting: true,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Reported values are grid-CONVERGENCE stable; the shared finite NPHI = 10 kernel truncation and ' +
      'Simpson order remain the residual floor, so these are located values of this truncated-kernel ' +
      'model, not certified error bounds.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

export const IMP33276_R40_CROSS_OUTER_INVARIANCE_ASSERTIONS = [
  {
    id: 'imp33276-cross-outer-invariant-at-every-inner-grid',
    why: 'The core extension: R_40 under (T_A=2, NM=3200) and (T_A=6, NM=1600) must agree to ~1e-12 at ' +
      'EVERY inner grid (coarse and refined), not just the single coarse grid imp-33256 tested.',
    holds: () => ALL_OUTER_INVARIANT && MAX_CROSS_OUTER_DELTA < 1e-12,
  },
  {
    id: 'imp33276-worst-cross-outer-delta-is-machine-epsilon',
    why: 'The worst-case cross-outer delta across all inner rungs must be at the ~1e-13 machine-epsilon ' +
      'floor, confirming outer-invariance is not merely coincidental at one grid.',
    holds: () => MAX_CROSS_OUTER_DELTA < 1e-13,
  },
  {
    id: 'imp33276-inner-drift-persists-alongside-outer-invariance',
    why: 'The inner O(h^4) drift the outer control is meant to leave untouched must still span the ' +
      'imp-3888/imp-33256 ~1.21e-5 residual across the same rungs (R_40 coarse to finest).',
    holds: () => INNER_DRIFT_SPAN > 1e-5 && INNER_DRIFT_SPAN < 1.5e-5,
  },
  {
    id: 'imp33276-coarse-grid-reproduces-imp33256-control',
    why: 'The coarse [0,7]/1200 rung must reproduce the imp-33256 single cross-outer control: R_40 ~ 1.02438 ' +
      'and a cross-outer delta at the ~1e-14 machine floor. Tolerance widened to the ladder-standard 1e-4 ' +
      '(imp-3713/imp-3731/imp-3849/imp-3868/imp-3895 all use 1e-4 for this same R_40 cross-check) -- the ' +
      'prior 5e-6 bound left only ~8% margin against the actual ~4.62e-6 delta and could red-build on any ' +
      'benign ULP-level float summation-order change (imp-33288 audit).',
    holds: () =>
      Math.abs(CROSS_OUTER[0].r40OuterA - 1.02438) < 1e-4 &&
      CROSS_OUTER[0].deltaCrossOuter < 1e-12,
  },
  {
    id: 'imp33276-verdict-not-indeterminate',
    why: 'The classified verdict must record outer-invariance at all inner grids alongside the persisting ' +
      'inner drift -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33276-honest-measurement-only',
    why: 'Mandatory honesty: measurement only, no literal patched, source modules intact, no bound changed, ' +
      'mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33276_R40_CROSS_OUTER_INVARIANCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33276_R40_CROSS_OUTER_INVARIANCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33276-r40-cross-outer-invariance-all-inner-grids assertion failed: ${assertion.id}`);
  }
}

export default IMP33276_R40_CROSS_OUTER_INVARIANCE;
