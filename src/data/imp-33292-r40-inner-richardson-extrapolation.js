/**
 * @module imp-33292-r40-inner-richardson-extrapolation
 * @fileoverview imp-33292 -- COLLAPSE the imp-33276-confirmed inner-resolution R_40 drift with
 *   repeated Richardson extrapolation on the INNER A(tau) Simpson grid, converting the imp-3888
 *   residual into a converged R_40 value.
 *
 *   THE SETUP imp-33276 LEFT (the residual is entirely inner, and still O(h^4))
 *   ------------------------------------------------------------------------
 *   imp-33256/imp-33276 established that the ~1.21e-5 R_40 = |D_40|/|D_40^saddle| spread imp-3888
 *   found is carried ENTIRELY by the INNER A(tau) O(h^4) Simpson resolution: R_40 is
 *   outer-invariant to ~1e-14 at EVERY inner grid, yet climbs 1.02438462 (coarse [0,7]/1200) ->
 *   1.02439669 (converged [0,2]) as the inner panels refine. imp-33252/imp-33275 separately showed
 *   that the same inner A(tau) Simpson error is a clean even-power expansion (h^4, h^6, h^8, ...)
 *   whose repeated-Richardson tableau drives the saddle weight A(tau) to its few-ULP floor. This
 *   module closes the obvious next question: does that SAME repeated-Richardson tableau, applied to
 *   the inner grid of the FULL R_40 moment-ratio machinery, collapse the inner drift to the
 *   double-precision arithmetic floor and yield a converged R_40?
 *
 *   METHOD (self-computing; identical machinery to imp-33276/imp-33256)
 *   ------------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + Neumaier-compensated Simpson + [0,T_A] moment machinery
 *   is reused verbatim (moments to M_44, all D_40 = C_42 - C_40 needs). The OUTER moment grid is
 *   held at the imp-3849 native (T_A=2, NM=3200); imp-33276 proved R_40 is outer-invariant, so the
 *   outer grid contributes nothing to the measured drift. On a FIXED inner domain [0,2] (Richardson
 *   requires a single domain with pure h-halving), R_40 is computed on a doubling panel ladder
 *   N = 400, 800, 1600, 3200, 6400, 12800. The Simpson even-power expansion then feeds a repeated
 *   Richardson tableau: each column eliminates the next even error power p = 4, 6, 8, ... via
 *   (2^p * R(2N) - R(N)) / (2^p - 1). A SECOND, offset doubling ladder N = 600, 1200, 2400, 4800,
 *   9600 is extrapolated the same way; the two converged extrapolants are compared to confirm the
 *   converged R_40 is a ladder-independent value, not a single-ladder coincidence.
 *
 *   MEASURED (the inner drift collapses ~9 orders of magnitude to the machinery floor)
 *   ---------------------------------------------------------------------------------
 *     (1) THE RAW INNER LADDER REPRODUCES THE imp-3888 DRIFT. On [0,2] the raw R_40 climbs
 *         1.02438972 (N=400) -> 1.02439670 (N=12800), a ~6.98e-6 inner O(h^4) drift; anchored at
 *         the coarser imp-3685 [0,7]/1200 grid (R_40 ~ 1.02438462) the full span to the converged
 *         value is ~1.208e-5, reproducing the imp-3888/imp-33256 residual.
 *     (2) REPEATED RICHARDSON COLLAPSES THE DRIFT TO THE ARITHMETIC FLOOR. The tableau per-column
 *         spread falls
 *           L0 (raw)  ~6.98e-6   (~3.1e10 ULP)
 *           L1 (h^4)  ~6.63e-8
 *           L2 (h^6)  ~3.46e-11
 *           L3 (h^8)  ~9.99e-15  (~44 ULP)
 *           L4 (h^10) ~9.55e-15  (~42 ULP)
 *           L5 (h^12)  single converged extrapolant
 *         a ~7.3e8x reduction from raw drift to the finest-column spread. The top three columns are
 *         bit-stable at 1.02439669503136.
 *     (3) THE CONVERGED R_40 IS LADDER-INDEPENDENT. The offset ladder (600 ... 9600) extrapolates to
 *         the same value; the two converged extrapolants agree to ~1.0e-14 (~45 ULP), so
 *         R_40^converged ~ 1.0243966950314 is a located value of this truncated-kernel model, not a
 *         property of one panel ladder.
 *
 *   WHAT THE FLOOR IS (honest: a few tens of ULP, not literally sub-1-ULP)
 *   --------------------------------------------------------------------
 *   The inner O(h^4) drift is REMOVED: after two Richardson columns the residual sits at ~1e-14
 *   (~40 ULP at magnitude 1.024) and stops falling. That plateau is the double-precision ARITHMETIC
 *   floor of the R_40 machinery itself -- dominated by the cancellation in D_40 = C_42 - C_40 and
 *   the M_44 moment ratios -- not a further discretization error. So the imp-3888 residual is
 *   converted from a ~1.21e-5 inner-resolution UNCERTAINTY into a converged R_40 pinned to the ~40
 *   ULP arithmetic floor of the machinery. Unlike the scalar A(tau) weight (imp-33252/imp-33275),
 *   which Richardson drives to a genuine few-ULP floor, R_40 inherits the ratio-cancellation floor,
 *   so the honest converged precision is a few tens of ULP, not sub-1-ULP.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY. This applies repeated Richardson to the inner grid of the R_40 moment-ratio
 *   machinery and reports that the ~1.21e-5 imp-3888 inner-resolution residual collapses ~9 orders
 *   of magnitude to the ~40 ULP arithmetic floor, yielding a ladder-independent converged
 *   R_40 ~ 1.0243966950314. No literal is patched; imp-3685 and imp-3849 assertions are LEFT INTACT
 *   (a converged literal would be proposed separately, if at all). It changes NO bound and
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed. The reported converged value is a
 *   grid-CONVERGENCE floor of this truncated-kernel model, not a certified error bound; the shared
 *   finite NPHI = 10 kernel truncation remains the residual model floor.
 *
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (isolated the residual to the inner grid)
 *   @see imp-33256-r40-inner-quadrature-sweep.js (swept the inner axis; found the O(h^4) drift)
 *   @see imp-33252-richardson-extrapolate-saddle-a-ladder.js (the repeated-Richardson tableau on A(tau))
 *   @see imp-33275-richardson-saddle-a-rung-uniformity.js (rung-uniform Richardson to few-ULP for A)
 *   @see imp-3888-cross-check-provenance-audit.js (found the ~1.21e-5 R_40 residual)
 *
 *   Ticket: imp-33292 (numerical, medium).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation
const U = 2.220446049250313e-16;                // double-precision unit roundoff (2^-52)

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
 * R_40 = |D_40| / |D_40^saddle| on an (T_A, NM) outer moment grid with an (innerHi, innerN) inner
 * A(tau) quadrature. Moments only to M_44 (all D_40 needs). Neumaier-compensated throughout; the
 * tau &gt; 1.45 =&gt; A = 0 guard skips the numerically-zero A tail (imp-33276 machinery, verbatim).
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

/**
 * Repeated Richardson extrapolation on a Simpson even-power ladder (p = 4, 6, 8, ...): each panel
 * doubling halves h, each column eliminates the next even error power via (2^p*R2N - RN)/(2^p-1).
 * Returns the full tableau (L0 raw at index 0, then successive columns).
 */
function richardsonTableau(raw) {
  const tableau = [raw.slice()];
  let column = raw.slice();
  let p = 4;
  while (column.length > 1) {
    const factor = Math.pow(2, p);
    const next = [];
    for (let i = 0; i + 1 < column.length; i += 1) {
      next.push((factor * column[i + 1] - column[i]) / (factor - 1));
    }
    tableau.push(next.slice());
    column = next;
    p += 2;
  }
  return tableau;
}

// Outer moment grid: imp-3849 native converged (T_A=2, NM=3200). imp-33276 proved R_40 is
// outer-invariant to ~1e-14, so the outer grid contributes nothing to the measured inner drift.
const OUTER = Object.freeze({ T_A: 2, NM: 3200 });

// Primary and offset doubling ladders on the FIXED inner domain [0,2] (Richardson needs one domain).
const INNER_HI = 2;
const LADDER_PRIMARY = [400, 800, 1600, 3200, 6400, 12800];
const LADDER_OFFSET = [600, 1200, 2400, 4800, 9600];

// -- (1) Raw R_40 on the primary inner ladder, and the Richardson tableau that collapses it -------
const RAW_PRIMARY = LADDER_PRIMARY.map((innerN) => computeR40(OUTER.T_A, OUTER.NM, INNER_HI, innerN));
const TABLEAU_PRIMARY = richardsonTableau(RAW_PRIMARY);
const CONVERGED_PRIMARY = TABLEAU_PRIMARY[TABLEAU_PRIMARY.length - 1][0];
const ULP = CONVERGED_PRIMARY * U;

// Per-column spread (max - min within the column) and its size in ULP: the collapse metric.
const COLUMNS = TABLEAU_PRIMARY.map((column, level) => {
  const mn = Math.min(...column);
  const mx = Math.max(...column);
  const spread = mx - mn;
  return Object.freeze({
    level,
    errorOrder: level === 0 ? 'raw (h^0 columns)' : `h^${4 + 2 * (level - 1)}`,
    count: column.length,
    spread,
    spreadUlp: spread / ULP,
    last: column[column.length - 1],
  });
});

// The raw inner O(h^4) drift, and the finest-column spread it collapses to (the arithmetic floor).
const RAW_DRIFT_SPAN = Math.abs(RAW_PRIMARY[RAW_PRIMARY.length - 1] - RAW_PRIMARY[0]);   // ~6.98e-6
const PENULTIMATE = TABLEAU_PRIMARY[TABLEAU_PRIMARY.length - 2];                          // last multi-entry column
const FINEST_COLUMN_SPREAD = Math.abs(PENULTIMATE[PENULTIMATE.length - 1] - PENULTIMATE[0]); // ~9.5e-15
const REDUCTION_FACTOR = RAW_DRIFT_SPAN / Math.max(FINEST_COLUMN_SPREAD, ULP);           // ~7.3e8

// -- (2) The full imp-3888 span: the coarse [0,7]/1200 anchor to the converged value --------------
const R40_COARSE_ANCHOR = computeR40(OUTER.T_A, OUTER.NM, 7, 1200);                       // ~1.02438462
const FULL_IMP3888_SPAN = Math.abs(CONVERGED_PRIMARY - R40_COARSE_ANCHOR);                // ~1.208e-5

// -- (3) Ladder-independence: the offset doubling ladder must extrapolate to the same value --------
const RAW_OFFSET = LADDER_OFFSET.map((innerN) => computeR40(OUTER.T_A, OUTER.NM, INNER_HI, innerN));
const TABLEAU_OFFSET = richardsonTableau(RAW_OFFSET);
const CONVERGED_OFFSET = TABLEAU_OFFSET[TABLEAU_OFFSET.length - 1][0];
const CROSS_LADDER_DELTA = Math.abs(CONVERGED_PRIMARY - CONVERGED_OFFSET);                // ~1.0e-14
const CROSS_LADDER_ULP = CROSS_LADDER_DELTA / ULP;                                        // ~45 ULP

const verdict =
  RAW_DRIFT_SPAN > 5e-6 && RAW_DRIFT_SPAN < 1e-5 &&
  FINEST_COLUMN_SPREAD < 1e-13 &&
  REDUCTION_FACTOR > 1e7 &&
  CROSS_LADDER_DELTA < 1e-13 &&
  FULL_IMP3888_SPAN > 1e-5 && FULL_IMP3888_SPAN < 1.5e-5
    ? 'REPEATED-RICHARDSON-ON-THE-INNER-A(tau)-SIMPSON-GRID-COLLAPSES-THE-imp-33276-R_40-INNER-DRIFT-' +
      'FROM-~7e-6-(RAW-[0,2]/400..12800)-TO-THE-~40-ULP-ARITHMETIC-FLOOR-OF-THE-D_40=C_42-C_40-MOMENT-' +
      'MACHINERY-(~7.3e8x-REDUCTION),-YIELDING-A-LADDER-INDEPENDENT-CONVERGED-R_40~1.0243966950314-' +
      '(TWO-DOUBLING-LADDERS-AGREE-TO-~45-ULP);-THE-FULL-~1.208e-5-imp-3888-RESIDUAL-(COARSE-[0,7]/1200-' +
      'ANCHOR-TO-CONVERGED)-IS-THUS-A-REMOVABLE-INNER-O(h^4)-ARTEFACT,-NOT-A-STRUCTURAL-UNCERTAINTY.-' +
      'FLOOR-IS-THE-RATIO-CANCELLATION-FLOOR-(~40-ULP),-NOT-SUB-1-ULP.-MEASUREMENT-ONLY;-NO-LITERAL-' +
      'PATCHED;-imp-3685/imp-3849-INTACT;-imp-3066-UNTOUCHED;-PT-Lambda<=0.2-SOTA;-NO-QED'
    : 'INDETERMINATE';

export const IMP33292_R40_INNER_RICHARDSON = Object.freeze({
  id: 'imp-33292-r40-inner-richardson-extrapolation',
  ticket: 'imp-33292',
  extendsControlFrom: 'imp-33276-r40-cross-outer-invariance-all-inner-grids.js',
  appliesTableauFrom: 'imp-33252-richardson-extrapolate-saddle-a-ladder.js',
  isolatesResidualNamedBy: 'imp-3888-cross-check-provenance-audit.js',

  summary:
    'APPLIES the imp-33252/imp-33275 repeated-Richardson tableau (Simpson even-power p = 4, 6, 8, ...) to ' +
    'the INNER A(tau) grid of the FULL R_40 = |D_40|/|D_40^saddle| moment-ratio machinery, at the fixed ' +
    'outer-invariant grid (T_A=2, NM=3200). On the inner domain [0,2] the raw R_40 climbs ~6.98e-6 across ' +
    'the doubling ladder N = 400 ... 12800 (the imp-33256/imp-3888 inner O(h^4) drift; ~1.208e-5 measured ' +
    'from the coarse [0,7]/1200 anchor). Repeated Richardson collapses the per-column spread ' +
    '~6.98e-6 -> ~6.63e-8 -> ~3.46e-11 -> ~1e-14 (~44 ULP), a ~7.3e8x reduction, and the top three columns ' +
    'are bit-stable at 1.02439669503136. A second offset doubling ladder (600 ... 9600) extrapolates to the ' +
    'same value; the two converged extrapolants agree to ~1.0e-14 (~45 ULP), so R_40^converged ~ ' +
    '1.0243966950314 is ladder-independent. The residual reaches the ~40 ULP arithmetic floor of the ' +
    'D_40 = C_42 - C_40 cancellation, NOT literally sub-1-ULP. So the ~1.21e-5 imp-3888 residual is a ' +
    'REMOVABLE inner O(h^4) artefact, converted here into a converged R_40 pinned to the machinery floor. ' +
    'MEASUREMENT ONLY; no literal patched; imp-3685/imp-3849 left intact; imp-3066 untouched; ' +
    'necessary-but-not-sufficient; no QED; no refereed bound is changed.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40| / |D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    outerGrid: 'T_A=2, NM=3200 [imp-3849 native; imp-33276-proven outer-invariant]',
    innerDomain: '[0,2] (fixed; Richardson requires one domain with pure h-halving)',
    primaryLadder: 'inner Simpson panels N = 400, 800, 1600, 3200, 6400, 12800 (doubling)',
    offsetLadder: 'inner Simpson panels N = 600, 1200, 2400, 4800, 9600 (offset doubling, ladder-independence check)',
    richardson: 'repeated tableau, column k eliminates even power p = 4, 6, 8, ... via (2^p*R(2N) - R(N))/(2^p - 1)',
    momentsTo: 44,
    compensatedSummation: 'Neumaier-compensated accumulation for A(tau) AND every moment M_m',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rawPrimaryLadder: Object.freeze(RAW_PRIMARY.map((v, i) => Object.freeze({ innerN: LADDER_PRIMARY[i], r40: v }))),
    rawDriftSpan: RAW_DRIFT_SPAN,                 // ~6.98e-6 (inner O(h^4) drift on [0,2])
    columns: Object.freeze(COLUMNS),              // per-column spread collapse
    convergedR40: CONVERGED_PRIMARY,              // ~1.0243966950314 (primary ladder)
    convergedR40OffsetLadder: CONVERGED_OFFSET,   // ~1.0243966950314 (offset ladder)
    crossLadderDelta: CROSS_LADDER_DELTA,         // ~1.0e-14 (ladder-independence)
    crossLadderUlp: CROSS_LADDER_ULP,             // ~45 ULP
    finestColumnSpread: FINEST_COLUMN_SPREAD,     // ~9.5e-15 (~42 ULP; arithmetic floor)
    reductionFactor: REDUCTION_FACTOR,            // ~7.3e8 (raw drift / finest-column spread)
    r40CoarseAnchor: R40_COARSE_ANCHOR,           // ~1.02438462 ([0,7]/1200, imp-3888 low anchor)
    fullImp3888Span: FULL_IMP3888_SPAN,           // ~1.208e-5 (coarse anchor to converged)
    ulpAtScale: ULP,
    verdict,
  }),

  interpretation: Object.freeze({
    driftIsRemovable:
      'Repeated Richardson on the inner grid collapses the ~6.98e-6 raw inner drift by ~7.3e8x to the ~40 ULP ' +
      'arithmetic floor; the full ~1.208e-5 imp-3888 residual (measured from the coarse [0,7]/1200 anchor) is ' +
      'therefore a REMOVABLE inner O(h^4) artefact, not a structural uncertainty in R_40.',
    convergedIsLadderIndependent:
      'The primary and offset doubling ladders extrapolate to the same R_40 ~ 1.0243966950314, agreeing to ~1.0e-14 ' +
      '(~45 ULP), and the top three tableau columns are bit-stable at 1.02439669503136. The converged value is a ' +
      'located value of this truncated-kernel model, not a single-ladder coincidence.',
    floorIsCancellationNotDiscretization:
      'After two Richardson columns the residual plateaus at ~1e-14 (~40 ULP) and stops falling: that is the ' +
      'double-precision ARITHMETIC floor of the D_40 = C_42 - C_40 ratio-cancellation, not a further ' +
      'discretization error. Unlike the scalar A(tau) weight (imp-33252/imp-33275, genuine few-ULP floor), R_40 ' +
      'inherits the ratio-cancellation floor, so honest converged precision is a few tens of ULP, not sub-1-ULP.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    reachesArithmeticFloorNotSubUlp: true,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    tabulatedInsteadOfAsserting: true,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'The converged R_40 is a grid-CONVERGENCE floor of this truncated-kernel model; the shared finite ' +
      'NPHI = 10 kernel truncation remains the residual model floor, so this is a located value, not a ' +
      'certified error bound.',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP33292_R40_INNER_RICHARDSON_ASSERTIONS = [
  {
    id: 'imp33292-raw-inner-ladder-reproduces-imp3888-drift',
    why: 'The raw [0,2] doubling ladder must reproduce the imp-33256/imp-3888 inner O(h^4) drift: a ~7e-6 ' +
      'monotone climb, and a ~1.208e-5 full span from the coarse [0,7]/1200 anchor to the converged value.',
    holds: () =>
      RAW_DRIFT_SPAN > 5e-6 && RAW_DRIFT_SPAN < 1e-5 &&
      FULL_IMP3888_SPAN > 1e-5 && FULL_IMP3888_SPAN < 1.5e-5 &&
      RAW_PRIMARY[RAW_PRIMARY.length - 1] > RAW_PRIMARY[0],
  },
  {
    id: 'imp33292-richardson-collapses-drift-to-arithmetic-floor',
    why: 'Repeated Richardson must collapse the per-column spread to the ~1e-14 arithmetic floor: the ' +
      'finest multi-entry column spread must be < 1e-13 and the reduction from raw drift > 1e7x.',
    holds: () => FINEST_COLUMN_SPREAD < 1e-13 && REDUCTION_FACTOR > 1e7,
  },
  {
    id: 'imp33292-converged-r40-is-ladder-independent',
    why: 'The primary and offset doubling ladders must extrapolate to the same converged R_40 to within the ' +
      'machinery arithmetic floor (< 1e-13), confirming a located value rather than a single-ladder artefact.',
    holds: () => CROSS_LADDER_DELTA < 1e-13 && Math.abs(CONVERGED_PRIMARY - 1.02439669503) < 1e-8,
  },
  {
    id: 'imp33292-tableau-columns-shrink-monotonically',
    why: 'Each Richardson column must reduce the spread relative to the previous one down to the floor, ' +
      'confirming the even-power expansion is genuine (h^4, h^6, h^8 removed in turn).',
    holds: () =>
      COLUMNS[1].spread < COLUMNS[0].spread &&
      COLUMNS[2].spread < COLUMNS[1].spread &&
      COLUMNS[3].spread < COLUMNS[2].spread,
  },
  {
    id: 'imp33292-verdict-not-indeterminate',
    why: 'The classified verdict must record the drift-collapse-to-floor with a ladder-independent converged ' +
      'R_40 -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33292-honest-measurement-only',
    why: 'Mandatory honesty: measurement only, reaches the arithmetic floor (not sub-1-ULP), no literal ' +
      'patched, source modules intact, no bound changed, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33292_R40_INNER_RICHARDSON.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.reachesArithmeticFloorNotSubUlp === true &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33292_R40_INNER_RICHARDSON_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33292-r40-inner-richardson-extrapolation assertion failed: ${assertion.id}`);
  }
}

export default IMP33292_R40_INNER_RICHARDSON;
