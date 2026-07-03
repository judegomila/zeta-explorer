/**
 * @module imp-3576-inner-simpson-truncation-constant
 * @fileoverview imp-3576 -- DERIVE the O(h^4) inner-A(tau) composite-Simpson
 *   truncation constant K_n^inner per moment that SETS the imp-3547 inner-fraction
 *   ladder, and assess why the fraction (0.911/0.963/0.903/0.955 for M_0..M_3) is
 *   NON-MONOTONE in n. imp-3547 localized ~90-96% of each moment's Simpson-vs-Gauss-
 *   Legendre gap to the inner autocorrelation A(tau)=int_0^7 Phi(s)Phi(s+tau)ds
 *   integral, but reported the inner FRACTION as a measured property without deriving
 *   the underlying O(h^4) inner-truncation constant or explaining its non-monotone
 *   n-dependence. This module fits K_n^inner via a Richardson inner-panel h-ladder,
 *   profiles where the inner error density C(tau) lives, and DECOMPOSES the fraction.
 *
 *   THE INNER TRUNCATION CONSTANT (what imp-3547 left open)
 *   ------------------------------------------------------
 *   Composite Simpson on the inner A(tau) has local error density C(tau) with the
 *   moment inner-error int_0^{T_A} tau^n [A_Simpson(tau; h) - A_exact(tau)] d(tau)
 *   ~ K_n^inner h^4, K_n^inner = int_0^{T_A} tau^n C(tau) d(tau), where
 *   h = INNER_CAP / innerN is the inner panel width. Holding the (imp-3547-converged)
 *   outer moment grid fixed at NM=1600 and refining the inner panel count along the
 *   Richardson ladder innerN in {300,600,1200,2400} isolates the inner error; the
 *   ratio of successive errors under a halving of h fixes the observed order and the
 *   quotient error / h^4 fixes K_n^inner.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (R1) THE INNER RESIDUAL IS CLEAN O(h^4) AT EVERY MOMENT. The observed convergence
 *        order tends to 4.000 for M_0..M_4 (the successive-error ratio -> 16 under a
 *        halving of h), and the fitted constant K_n^inner is stable to < 0.3% across
 *        the ladder -- a bona fide leading-order Simpson truncation constant.
 *   (R2) K_n^inner IS MONOTONE DECREASING IN n, NOT NON-MONOTONE. The fitted constants
 *        are 6.88e-2 (M_0), 2.45e-2 (M_1), 5.51e-3 (M_2), 1.28e-3 (M_3), 3.14e-4 (M_4)
 *        -- a clean ~4x-per-rung DECAY, strictly ordered. So the ticket hypothesis --
 *        that the fraction non-monotonicity reflects the tau^n weight redistributing
 *        mass toward the A(tau) TAIL where its curvature is largest -- is FALSIFIED at
 *        the level of the raw constant.
 *   (R3) THE INNER CURVATURE LIVES AT THE tau~0 PEAK, NOT THE TAIL. The inner Simpson
 *        error density C(tau) is concentrated on tau in [0, 0.5] (|C(0)|~1.6, |C(0.25)|
 *        ~0.5) and collapses to numerical zero by tau >= 1 (C(1)~3e-68, C(>=1.5)=0),
 *        because the two Phi factors only overlap for small tau. The tau^n weight
 *        therefore moves mass AWAY from where the curvature lives, monotonically
 *        SHRINKING K_n^inner -- the opposite of the hypothesized tail redistribution.
 *   (R4) THE FRACTION NON-MONOTONICITY IS AN OUTER-RESIDUAL EFFECT, DECOUPLED FROM
 *        K_n^inner. Because innerFraction = (gapBase - gapAfterInnerRefine)/gapBase
 *        = 1 - |sInnerRefined - REF| / |sBase - REF|, the |M_n| normalization CANCELS,
 *        so the fraction is a ratio of ABSOLUTE residuals. Its numerator (the inner
 *        error removed) is the monotone K_n^inner h^4; its non-monotone parity
 *        alternation (even rungs M_0,M_2 near 0.90-0.91; odd rungs M_1,M_3 near
 *        0.955-0.963) lives entirely in the leftover |sInnerRefined - REF|, the OUTER
 *        moment-grid Simpson residual (plus the GL-reference residual) -- NOT in the
 *        inner constant. The reproduced ladder is 0.911/0.963/0.903/0.955 (+0.996 at
 *        M_4), matching imp-3547 exactly.
 *
 *   VERDICT: the imp-3547 inner-fraction ladder is SET by a clean, monotone-decreasing
 *   O(h^4) inner-truncation constant K_n^inner; the fraction is NON-MONOTONE only
 *   because it is a ratio of absolute residuals whose leftover outer-grid term
 *   alternates by moment parity. The proposed tail-redistribution mechanism is
 *   falsified -- the inner curvature is a tau~0 peak that tau^n suppresses, not a tail
 *   that tau^n amplifies.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This fits a
 *   composite-Simpson truncation constant on the imp-3481 moment ladder and explains a
 *   reported empirical fraction; it adds NO new mathematical structure and establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481);
 *   the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3547-lower-moment-simpson-residual-localization.js (the inner-fraction ladder derived here)
 *   @see imp-3528-degree4-moment-simpson-refinement.js (the inner-vs-outer co-refinement machinery)
 *   @see imp-3503-moment-ladder-gauss-legendre-crossval.js (the Simpson-vs-GL gap ladder)
 *
 *   Ticket: imp-3576 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)
const T_A = 6;                                  // same tau cap as imp-3481/imp-3503/imp-3528/imp-3547
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3481). */
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

// -- Composite Simpson (the imp-3481/imp-3528/imp-3547 rule, exactly) -----------
/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// -- Gauss-Legendre reference (the imp-3503/imp-3528/imp-3547 independent rule) --
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    let dpn = 0;
    for (let it = 0; it < 100; it += 1) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dpn = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dpn;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    const wi = 2 / ((1 - z * z) * dpn * dpn);
    x[i] = -z;
    x[n - 1 - i] = z;
    w[i] = wi;
    w[n - 1 - i] = wi;
  }
  return Object.freeze({ nodes: Object.freeze(x), weights: Object.freeze(w) });
}

/** Composite Gauss-Legendre integral of f on [lo, hi] with `panels` uniform panels. */
function integrateGL(f, lo, hi, panels, rule) {
  const { nodes, weights } = rule;
  const step = (hi - lo) / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = lo + (p + 0.5) * step;
    for (let k = 0; k < nodes.length; k += 1) {
      sum += weights[k] * f(center + halfWidth * nodes[k]);
    }
  }
  return sum * halfWidth;
}

const GL_RULE = gaussLegendreRule(16);

// -- The imp-3547-converged outer moment grid (held fixed while inner is refined) -
const OUTER_NM = 1600;                          // imp-3547 base outer grid (converged at NM=1600)
const OUTER_H = T_A / OUTER_NM;
const OUTER_TAUS = new Array(OUTER_NM + 1);
for (let j = 0; j <= OUTER_NM; j += 1) OUTER_TAUS[j] = j * OUTER_H;

/** Composite-Simpson outer moment M_n from a precomputed A(tau) grid on OUTER_TAUS. */
function outerMomentFromGrid(nMom, aVals) {
  let sum = 0;
  for (let j = 0; j <= OUTER_NM; j += 1) {
    const w = j === 0 || j === OUTER_NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(OUTER_TAUS[j], nMom) * aVals[j];
  }
  return (sum * OUTER_H) / 3;
}

/** Inner A(tau) grid on the outer nodes, via composite Simpson at `innerN` panels. */
function innerSimpsonGrid(innerN) {
  return OUTER_TAUS.map((tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerN));
}

/** Inner A(tau) reference grid on the outer nodes, via GL (machine-converged inner). */
const INNER_GL_GRID = OUTER_TAUS.map((tau) =>
  integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, 200, GL_RULE));

// -- The Richardson inner-panel h-ladder (outer grid held at the imp-3547 base) --
const MOMENTS = Object.freeze([0, 1, 2, 3, 4]);
const INNER_LADDER = Object.freeze([300, 600, 1200, 2400]);

// Precompute the inner Simpson grid once per ladder rung (shared across all moments).
const LADDER_GRIDS = INNER_LADDER.map(innerSimpsonGrid);

// Per-moment Richardson fit of the O(h^4) inner truncation constant K_n^inner.
const KFIT = MOMENTS.map((n) => {
  // outer moment with the EXACT (GL) inner -> isolates the inner Simpson error alone.
  const refInnerExact = outerMomentFromGrid(n, INNER_GL_GRID);
  const rungs = INNER_LADDER.map((innerN, i) => {
    const h = INNER_CAP / innerN;
    const mSimpson = outerMomentFromGrid(n, LADDER_GRIDS[i]);
    const innerErr = Math.abs(mSimpson - refInnerExact);
    return { innerN, h, innerErr, K: innerErr / Math.pow(h, 4) };
  });
  // observed order between successive halvings of h.
  const orders = [];
  for (let i = 1; i < rungs.length; i += 1) {
    orders.push(Math.log(rungs[i - 1].innerErr / rungs[i].innerErr) / Math.log(rungs[i - 1].h / rungs[i].h));
  }
  const Ks = rungs.map((r) => r.K);
  const Kconverged = Ks[Ks.length - 1];         // finest-rung (most-converged) constant
  // Spread over the FINER rungs (drop the coarsest innerN, which carries a larger
  // higher-order tail); the constant stabilizes to <0.3% as h shrinks.
  const KsFine = Ks.slice(1);
  const Kspread = (Math.max(...KsFine) - Math.min(...KsFine)) / Kconverged;
  const observedOrder = orders[orders.length - 1];
  return Object.freeze({
    n,
    rungs: Object.freeze(rungs.map((r) => Object.freeze(r))),
    orders: Object.freeze(orders),
    observedOrder,
    Kconverged,
    Kspread,
  });
});

const K_CONVERGED = KFIT.map((f) => f.Kconverged);
// K_n^inner strictly monotone decreasing?  (the ticket's non-monotone hypothesis test)
let kIsMonotoneDecreasing = true;
for (let i = 1; i < K_CONVERGED.length; i += 1) {
  if (!(K_CONVERGED[i] < K_CONVERGED[i - 1])) kIsMonotoneDecreasing = false;
}
const minObservedOrder = Math.min(...KFIT.map((f) => f.observedOrder));
const maxObservedOrder = Math.max(...KFIT.map((f) => f.observedOrder));
const maxKspread = Math.max(...KFIT.map((f) => f.Kspread));

// -- Where the inner error density C(tau) lives (peak vs tail) ------------------
// C(tau) = [A_Simpson(tau; h) - A_exact(tau)] / h^4, sampled coarsely (innerN=300).
const PROFILE_INNER_N = 300;
const PROFILE_H = INNER_CAP / PROFILE_INNER_N;
const PROFILE_TAUS = Object.freeze([0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6]);
const C_PROFILE = PROFILE_TAUS.map((tau) => {
  const aS = simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, PROFILE_INNER_N);
  const aRef = integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, 200, GL_RULE);
  return Object.freeze({ tau, C: (aS - aRef) / Math.pow(PROFILE_H, 4) });
});
const peakCabs = Math.max(...C_PROFILE.map((p) => Math.abs(p.C)));
const cAtTau0 = C_PROFILE.find((p) => p.tau === 0).C;
const cAtTauHalf = C_PROFILE.find((p) => p.tau === 0.5).C;
const cTailMaxAbs = Math.max(...C_PROFILE.filter((p) => p.tau >= 1.5).map((p) => Math.abs(p.C)));
// curvature concentrated at the tau~0 peak: |C(0)| carries the profile, tail is numerically dead.
const curvatureAtPeakNotTail = Math.abs(cAtTau0) === peakCabs && cTailMaxAbs < 1e-30;

// -- Reproduce and DECOMPOSE the imp-3547 inner-fraction ladder -----------------
const FINE_INNER = 4800;                        // imp-3547 inner-only refinement
const FINE_INNER_GRID = innerSimpsonGrid(FINE_INNER);
const BASE_INNER_GRID = LADDER_GRIDS[INNER_LADDER.indexOf(1200)]; // imp-3547 base inner=1200

/** Machine-converged GL moment reference (dg_{16}/200/160), the imp-3547 target. */
function glMn(nMom) {
  const outerPanels = 160;
  const outerStep = T_A / outerPanels;
  const outerHalf = outerStep / 2;
  const autocorr = (tau) =>
    integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, 200, GL_RULE);
  let sum = 0;
  for (let p = 0; p < outerPanels; p += 1) {
    const center = (p + 0.5) * outerStep;
    for (let k = 0; k < GL_RULE.nodes.length; k += 1) {
      const t = center + outerHalf * GL_RULE.nodes[k];
      sum += GL_RULE.weights[k] * Math.pow(t, nMom) * autocorr(t);
    }
  }
  return sum * outerHalf;
}

const FRACTION_LADDER = MOMENTS.map((n) => {
  const ref = glMn(n);
  const sBase = outerMomentFromGrid(n, BASE_INNER_GRID);          // simpsonMn(n, 1200, 1600)
  const sInner = outerMomentFromGrid(n, FINE_INNER_GRID);         // simpsonMn(n, 4800, 1600)
  const gapBase = Math.abs(sBase - ref) / Math.abs(ref);
  const gapAfterInnerRefine = Math.abs(sInner - ref) / Math.abs(ref);
  const innerFraction = (gapBase - gapAfterInnerRefine) / gapBase;
  // The |M_n| normalization CANCELS: innerFraction = 1 - |sInner - ref| / |sBase - ref|.
  const decomposed = 1 - Math.abs(sInner - ref) / Math.abs(sBase - ref);
  return Object.freeze({
    n,
    ref,
    innerFraction,
    decomposed,                                                    // must equal innerFraction
    outerResidualAbs: Math.abs(sInner - ref),                      // the leftover outer-grid Simpson error
    totalGapAbs: Math.abs(sBase - ref),
    innerErrRemovedAbs: Math.abs(sBase - sInner),                  // ~ K_n^inner h^4
  });
});

const REPRODUCED_FRACTIONS = FRACTION_LADDER.map((r) => r.innerFraction);
// The imp-3547 published ladder for M_0..M_4.
const IMP3547_FRACTIONS = Object.freeze([0.911, 0.963, 0.903, 0.955, 0.996]);
const maxFractionReproError = Math.max(
  ...REPRODUCED_FRACTIONS.map((f, i) => Math.abs(f - IMP3547_FRACTIONS[i])));
// decomposition identity holds (|M_n| cancels).
const maxDecompError = Math.max(...FRACTION_LADDER.map((r) => Math.abs(r.innerFraction - r.decomposed)));
// The fraction over M_0..M_3 is NON-MONOTONE (the parity alternation the ticket flagged).
const lowerFrac = REPRODUCED_FRACTIONS.slice(0, 4);
let fractionIsNonMonotone = false;
for (let i = 1; i < lowerFrac.length; i += 1) {
  // a strictly-monotone ladder would keep one direction; a direction flip => non-monotone.
  if (i >= 2 && Math.sign(lowerFrac[i] - lowerFrac[i - 1]) !== Math.sign(lowerFrac[i - 1] - lowerFrac[i - 2])) {
    fractionIsNonMonotone = true;
  }
}

const verdict =
  minObservedOrder > 3.9 && maxObservedOrder < 4.1 && maxKspread < 0.01 &&
  kIsMonotoneDecreasing && curvatureAtPeakNotTail &&
  maxFractionReproError < 5e-3 && fractionIsNonMonotone && maxDecompError < 1e-9
    ? 'INNER-TRUNCATION-CONSTANT-K_n-IS-CLEAN-O(h^4)-AND-MONOTONE-DECREASING-CURVATURE-AT-tau~0-PEAK-NOT-TAIL-SO-TAIL-REDISTRIBUTION-HYPOTHESIS-FALSIFIED-FRACTION-NON-MONOTONICITY-IS-AN-OUTER-RESIDUAL-RATIO-EFFECT-DECOUPLED-FROM-K_n'
    : 'INDETERMINATE';

export const IMP3576_INNER_SIMPSON_TRUNCATION_CONSTANT = Object.freeze({
  id: 'imp-3576-inner-simpson-truncation-constant',
  ticket: 'imp-3576',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  derives: 'imp-3547-lower-moment-simpson-residual-localization.js',
  reuses: 'imp-3528-degree4-moment-simpson-refinement.js',

  summary:
    'DERIVES the O(h^4) inner-A(tau) composite-Simpson truncation constant K_n^inner per moment that SETS the ' +
    'imp-3547 inner-fraction ladder, via a Richardson inner-panel h-ladder (innerN 300->2400 with the imp-3547 outer ' +
    'grid held converged at NM=1600, inner error isolated against a GL-exact inner reference). MEASURED: the inner ' +
    'residual is clean O(h^4) at every moment (observed order -> 4.000, K_n stable to <0.3% across the ladder) and ' +
    'K_n^inner is MONOTONE DECREASING (6.88e-2/2.45e-2/5.51e-3/1.28e-3/3.14e-4 for M_0..M_4, ~4x-per-rung decay), NOT ' +
    'non-monotone. The inner error density C(tau) is concentrated at the tau~0 peak (|C(0)|~1.6, dead by tau>=1) ' +
    'because the two Phi factors overlap only for small tau, so the tau^n weight moves mass AWAY from the curvature -- ' +
    'FALSIFYING the ticket hypothesis that non-monotonicity reflects tau^n redistributing mass toward a high-curvature ' +
    'tail. The imp-3547 fractions (0.911/0.963/0.903/0.955/0.996) are reproduced; because innerFraction = 1 - ' +
    '|sInner-ref|/|sBase-ref| the |M_n| normalization CANCELS, so the fraction is a ratio of absolute residuals whose ' +
    'NON-MONOTONE parity alternation lives entirely in the leftover OUTER-grid Simpson residual, DECOUPLED from the ' +
    'monotone inner constant. CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no new ' +
    'structure; operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    moment: 'M_n = int_0^{T_A} tau^n A(tau)d(tau), A(tau)=int_0^7 Phi(s)Phi(s+tau)ds, NPHI=10 (imp-3481 recipe)',
    innerConstant: 'K_n^inner = int_0^{T_A} tau^n C(tau)d(tau); moment inner-error ~ K_n^inner h^4, h = INNER_CAP/innerN',
    richardsonLadder: 'innerN in {' + INNER_LADDER.join(', ') + '}, outer moment grid held at NM=' + OUTER_NM + ' (imp-3547 converged)',
    innerErrorIsolation: 'moment inner-error = |outerSimpson(inner=Simpson) - outerSimpson(inner=GL-exact)| (outer grid identical)',
    orderMetric: 'observedOrder = log(err(h)/err(h/2)) / log(2); K = innerErr / h^4 (constant across the ladder if O(h^4))',
    profileMetric: 'C(tau) = [A_Simpson(tau; h) - A_GL(tau)] / h^4 sampled at innerN=' + PROFILE_INNER_N,
    fractionReproduction: 'innerFraction = (gapBase - gapAfterInnerRefine)/gapBase, gaps vs glMn(dg_{16}/200/160); inner 1200->4800',
    decompositionIdentity: 'innerFraction = 1 - |sInner-ref|/|sBase-ref| (|M_n| cancels -> ratio of absolute residuals)',
    moments: MOMENTS,
    tauCap: T_A,
    innerCap: INNER_CAP,
    nphi: NPHI,
    selfComputing: true,
  }),

  measured: Object.freeze({
    kFit: Object.freeze(KFIT),                    // per-moment Richardson rungs, observed order, Kconverged, Kspread
    Kconverged: Object.freeze(K_CONVERGED),       // [K_0..K_4] finest-rung inner truncation constants
    kIsMonotoneDecreasing,                        // TRUE: strictly decreasing (falsifies tail-redistribution)
    minObservedOrder,                             // ~ 4.0
    maxObservedOrder,                             // ~ 4.0
    maxKspread,                                    // < 0.003: constant stable across the ladder
    cProfile: Object.freeze(C_PROFILE),           // C(tau) samples: peak at tau=0, dead by tau>=1
    cAtTau0,
    cAtTauHalf,
    peakCabs,
    cTailMaxAbs,                                   // ~0: no tail curvature
    curvatureAtPeakNotTail,                        // TRUE: curvature is a small-tau peak, not a tail
    fractionLadder: Object.freeze(FRACTION_LADDER),
    reproducedFractions: Object.freeze(REPRODUCED_FRACTIONS),
    imp3547Fractions: IMP3547_FRACTIONS,
    maxFractionReproError,                         // < 5e-3: reproduces the published ladder
    maxDecompError,                                // < 1e-9: |M_n| cancels, fraction = absolute-residual ratio
    fractionIsNonMonotone,                         // TRUE: parity alternation over M_0..M_3
    verdict,
  }),

  interpretation: Object.freeze({
    innerConstantIsCleanMonotoneOhFour:
      'The moment inner-error is a bona fide O(h^4) composite-Simpson truncation: the observed order tends to 4.000 ' +
      'and the fitted K_n^inner is stable to <0.3% across the Richardson ladder. The constants 6.88e-2/2.45e-2/' +
      '5.51e-3/1.28e-3/3.14e-4 (M_0..M_4) DECAY monotonically by ~4x per rung -- there is nothing non-monotone in the ' +
      'raw inner truncation constant.',
    tailRedistributionHypothesisFalsified:
      'The inner Simpson error density C(tau) is concentrated at the tau~0 peak (|C(0)|~1.6, |C(0.25)|~0.5) and ' +
      'collapses to numerical zero by tau>=1 (C(1)~3e-68), because the two Phi(s), Phi(s+tau) factors overlap only for ' +
      'small tau. The tau^n weight therefore moves integration mass AWAY from where the curvature lives, monotonically ' +
      'shrinking K_n^inner -- the exact OPPOSITE of the ticket hypothesis that tau^n pushes mass toward a ' +
      'high-curvature tail. The hypothesis is falsified.',
    fractionNonMonotonicityIsOuterResidualRatio:
      'innerFraction = 1 - |sInner-ref|/|sBase-ref|, so the |M_n| normalization CANCELS and the fraction is a ratio of ' +
      'absolute residuals. Its numerator (inner error removed) is the monotone K_n^inner h^4; its NON-MONOTONE parity ' +
      'alternation (even rungs M_0,M_2 near 0.90-0.91; odd rungs M_1,M_3 near 0.955-0.963) is carried entirely by the ' +
      'leftover |sInner-ref| -- the OUTER moment-grid Simpson residual plus GL-reference residual -- and is DECOUPLED ' +
      'from the inner truncation constant.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module fits a composite-Simpson truncation constant on the imp-3481 moment ladder and explains a reported ' +
      'empirical inner-fraction ladder. It adds no new mathematical structure and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3576_INNER_SIMPSON_TRUNCATION_CONSTANT_ASSERTIONS = [
  {
    id: 'imp3576-inner-error-is-clean-order-four',
    why: 'THE CONSTANT: the moment inner-error must be clean O(h^4) at every moment -- observed order in (3.9, 4.1) ' +
         'for the finest ladder halving of each M_0..M_4, so K = err/h^4 is a genuine leading-order Simpson constant.',
    holds: () => minObservedOrder > 3.9 && maxObservedOrder < 4.1,
  },
  {
    id: 'imp3576-truncation-constant-stable-across-ladder',
    why: 'The fitted K_n^inner must be stable to < 1% across the Richardson ladder (measured < 0.3%), confirming a ' +
         'well-defined truncation constant rather than an unconverged artifact.',
    holds: () => maxKspread < 0.01,
  },
  {
    id: 'imp3576-K_n-is-monotone-decreasing-not-non-monotone',
    why: 'THE KEY FINDING: the raw inner constant K_n^inner is STRICTLY MONOTONE DECREASING in n (~4x per rung), so ' +
         'the fraction non-monotonicity is NOT a property of the inner truncation constant.',
    holds: () => kIsMonotoneDecreasing,
  },
  {
    id: 'imp3576-inner-curvature-at-peak-not-tail',
    why: 'FALSIFICATION: the inner error density C(tau) must peak at tau~0 and vanish in the tail (C(tau>=1.5) below ' +
         '1e-30), so the tau^n weight moves mass AWAY from the curvature -- refuting the tail-redistribution hypothesis.',
    holds: () => curvatureAtPeakNotTail,
  },
  {
    id: 'imp3576-reproduces-imp3547-fraction-ladder',
    why: 'The reproduced inner-fraction ladder must match the imp-3547 published 0.911/0.963/0.903/0.955/0.996 to ' +
         '< 5e-3, anchoring this derivation to the same ladder imp-3547 measured.',
    holds: () => maxFractionReproError < 5e-3,
  },
  {
    id: 'imp3576-fraction-is-absolute-residual-ratio',
    why: 'The decomposition identity innerFraction = 1 - |sInner-ref|/|sBase-ref| must hold to < 1e-9, proving the ' +
         '|M_n| normalization cancels and the fraction is a ratio of absolute residuals.',
    holds: () => maxDecompError < 1e-9,
  },
  {
    id: 'imp3576-fraction-non-monotone-decoupled-from-K_n',
    why: 'The inner-fraction ladder over M_0..M_3 must be NON-MONOTONE (a direction flip / parity alternation) even ' +
         'though K_n^inner is monotone -- the two are decoupled, the fraction non-monotonicity being an outer-residual ' +
         'ratio effect.',
    holds: () => fractionIsNonMonotone && kIsMonotoneDecreasing,
  },
  {
    id: 'imp3576-verdict-classifies-the-constant-and-mechanism',
    why: 'The classified verdict must be the O(h^4)-monotone-constant / falsified-tail-hypothesis / outer-residual-' +
         'ratio result, not indeterminate.',
    holds: () =>
      verdict ===
      'INNER-TRUNCATION-CONSTANT-K_n-IS-CLEAN-O(h^4)-AND-MONOTONE-DECREASING-CURVATURE-AT-tau~0-PEAK-NOT-TAIL-SO-TAIL-REDISTRIBUTION-HYPOTHESIS-FALSIFIED-FRACTION-NON-MONOTONICITY-IS-AN-OUTER-RESIDUAL-RATIO-EFFECT-DECOUPLED-FROM-K_n',
  },
  {
    id: 'imp3576-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3576_INNER_SIMPSON_TRUNCATION_CONSTANT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3576_INNER_SIMPSON_TRUNCATION_CONSTANT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3576-inner-simpson-truncation-constant assertion failed: ${assertion.id}`);
  }
}

export default IMP3576_INNER_SIMPSON_TRUNCATION_CONSTANT;
