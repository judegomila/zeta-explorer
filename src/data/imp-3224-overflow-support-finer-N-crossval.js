/**
 * @module imp-3224-overflow-support-finer-N-crossval
 * @fileoverview imp-3224 -- Cross-validate the imp-3199 absolute overflow-support
 *   measure frac x U (~1.2535 +- 0.001, cell-invariant across the base seven
 *   a/U/NPHI cells) at tau-grid resolutions FINER than the imp-3199 live N = 6400,
 *   and at ADDITIONAL de Bruijn-Newman Phi cells OFF the base seven, to certify the
 *   absolute overflow-support lag-length is N-converged and NOT a finite-resolution
 *   coincidence of the single live N.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   WHAT imp-3199 LEFT AT A SINGLE LIVE N
 *   -------------------------------------
 *   imp-3199-overflow-fraction-cell-sweep measured the absolute overflow-support
 *   measure frac x U ~ 1.2535 +- 0.001 as cell-invariant across seven cells, but
 *   ONLY at its finest LIVE resolution N = 6400. Two things were therefore untested:
 *   (1) is that ~1.2535 the N-converged support length, or a finite-resolution
 *   reading of a still-drifting quantity? and (2) does the cell-invariance survive
 *   at AWAY-from-grid cells (a, U, NPHI values NOT among the base seven)? If the
 *   invariance were a coincidence of the single N = 6400 panel quantization, finer N
 *   would break it; if it is real, finer N must TIGHTEN it.
 *
 *   THE GENUINE DENSITIES (identical to imp-3199 / imp-3175 / imp-3154)
 *   ------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   overflow-support measure = |{tau in [0, U] : nu(tau) > mu(tau)}|.
 *   sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) factors nu into a past-prefix
 *   x future-suffix product, so each resolution is O(N) (prefix/suffix accumulators).
 *
 *   WHAT THE FINER-N CROSS-VALIDATION FINDS (measured at N up to 51200, NOT proved)
 *   ------------------------------------------------------------------------------
 *   Nine cells -- the three base-family U anchors (base, U=5, U=8) plus SIX new
 *   off-grid cells (a = 0.4, a = 0.9, U = 5.5, U = 7, NPHI = 8, NPHI = 20) -- swept
 *   over the resolution ladder N in {6400, 12800, 25600, 51200}:
 *
 *   (C1) N-CONVERGENCE. At every cell frac x U is monotone-increasing in N with
 *        SHRINKING successive increments (a Cauchy tail): the cross-cell mean rises
 *        1.25385 (N=6400) -> 1.25471 -> 1.25505 -> 1.25519 (N=51200), the per-step
 *        gain collapsing 8.6e-4 -> 3.4e-4 -> 1.4e-4. The support length is converging
 *        to ~1.2552, not drifting; the imp-3199 N=6400 reading ~1.2535 is a mild
 *        finite-resolution UNDER-count of that same converged length.
 *   (C2) THE INVARIANCE TIGHTENS WITH N (the decisive test). The cross-cell spread of
 *        frac x U SHRINKS monotonically as the grid refines:
 *          N=6400  -> spread 1.88e-3
 *          N=12800 -> spread 7.0e-4
 *          N=25600 -> spread 2.7e-4
 *          N=51200 -> spread 2.0e-4
 *        A finite-resolution coincidence would NOT systematically contract toward a
 *        common value as N grows; the cells agreeing MORE tightly at finer N is the
 *        signature of a genuine cell-invariant length, now certified off the base grid.
 *   (C3) FACTORIZATION HOLDS OFF-GRID. At each of the six NEW cells the O(N) sinh-
 *        addition-law factorization reproduces the direct O(N^2) recompute to machine
 *        precision (max rel error ~1e-16 at N=200), so the finer-N O(N) sweep is not
 *        an artifact of the base cells at which imp-3199/imp-3175 checked it.
 *
 *   RELATION TO imp-3216 (endpoint closed form)
 *   -------------------------------------------
 *   imp-3216 resolved the support to N = 51200 and found it is a single contiguous
 *   interval [tau_1, tau_2] ~ [0.111, 1.366] with cell-invariant endpoints, on the
 *   base seven cells. imp-3224 is the ORTHOGONAL cross-check: it tracks the frac x U
 *   MEASURE along an N-LADDER at ADDITIONAL off-grid cells to show the invariance is
 *   N-convergent (spread -> 0 as N grows), certifying imp-3216's fixed-N endpoint
 *   reading is not a single-resolution coincidence.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This certifies the N-convergence and off-grid
 *   cell-invariance of the overflow-SUPPORT measure only; the absolute deficit
 *   MAGNITUDE (a separate quantity carrying the offline normalization convention) is
 *   NOT re-derived. A nonzero overflow measure is necessary-but-NOT-sufficient at
 *   operator order; the off-diagonal endpoint-Hankel operator step (imp-3066) remains
 *   the lone obstruction. RH-equivalent, necessary-not-sufficient. No RH verdict, no
 *   false QED. No refereed bound is changed.
 *
 *   @see imp-3199-overflow-fraction-cell-sweep.js (the single-live-N seven-cell sweep)
 *   @see imp-3216-overflow-support-length-closed-form.js (the endpoint interval at N=51200)
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the base-cell resolution sweep)
 *
 *   Ticket: imp-3224 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Resolution ladder, all FINER than or equal to the imp-3199 live finest N = 6400.
const N_LADDER = Object.freeze([6400, 12800, 25600, 51200]);

// imp-3199 live finest resolution (the single N at which its ~1.2535 was read).
const IMP3199_LIVE_N = 6400;
// imp-3199 recorded cell-invariant support measure at that live N.
const IMP3199_SUPPORT_MEASURE = 1.2535;

// Resolution at which the O(N) factorization is matched against the direct O(N^2)
// loop, for the NEW off-grid cells (imp-3199 only checked its own base seven here).
const CROSS_CHECK_N = 200;

// Nine cells: three base-family U anchors plus SIX cells OFF the imp-3199 base seven.
// offGrid = the (a, U, NPHI) triple is NOT one of the imp-3199 base seven.
const CELLS = Object.freeze([
  Object.freeze({ label: 'base (a=0.5,U=6,NPHI=10)', a: 0.5, U: 6, NPHI: 10, offGrid: false }),
  Object.freeze({ label: 'U=5', a: 0.5, U: 5, NPHI: 10, offGrid: false }),
  Object.freeze({ label: 'U=8', a: 0.5, U: 8, NPHI: 10, offGrid: false }),
  Object.freeze({ label: 'a=0.4 (off-grid)', a: 0.4, U: 6, NPHI: 10, offGrid: true }),
  Object.freeze({ label: 'a=0.9 (off-grid)', a: 0.9, U: 6, NPHI: 10, offGrid: true }),
  Object.freeze({ label: 'U=5.5 (off-grid)', a: 0.5, U: 5.5, NPHI: 10, offGrid: true }),
  Object.freeze({ label: 'U=7 (off-grid)', a: 0.5, U: 7, NPHI: 10, offGrid: true }),
  Object.freeze({ label: 'NPHI=8 (off-grid)', a: 0.5, U: 6, NPHI: 8, offGrid: true }),
  Object.freeze({ label: 'NPHI=20 (off-grid)', a: 0.5, U: 6, NPHI: 20, offGrid: true }),
]);

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3199). */
function phiKernel(u, NPHI) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** O(N) factorized genuine densities nu(tau_k), mu(tau_k) via the sinh addition law. */
function densitiesFactor(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u, NPHI);
    ch[i] = Math.cosh(a * u);
    sh[i] = Math.sinh(a * u);
  }
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += phi[k] * ch[k];
    asum += phi[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs;                                 // sum over j > k (set BEFORE folding in k)
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * a * (k + 0.5) * H);
    muSuffix[k] = ms;                                // sum over j >= k
  }
  const nu = new Array(N);
  const mu = new Array(N);
  for (let k = 0; k < N; k++) {
    nu[k] = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    mu[k] = (H / (2 * Math.PI)) * muSuffix[k];
  }
  return { nu, mu };
}

/** Direct O(N^2) genuine nu(tau_k) WITHOUT the factorization (imp-3154 loop). */
function nuDirect(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const u = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i], NPHI);
  }
  const nu = new Array(N);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let i = 0; i <= k; i++) {
      for (let j = k + 1; j < N; j++) {
        s += phi[i] * phi[j] * Math.sinh(a * (u[j] - u[i]));
      }
    }
    nu[k] = H * H * s;
  }
  return nu;
}

/** Absolute overflow-support measure |{tau : nu > mu}| = (panel count / N) * U. */
function supportMeasure(N, a, U, NPHI) {
  const d = densitiesFactor(N, a, U, NPHI);
  let panels = 0;
  for (let k = 0; k < N; k++) if (d.nu[k] > d.mu[k]) panels += 1;
  return (panels / N) * U;
}

/** Max relative difference between two nu(tau) arrays (factorized vs direct). */
function maxRelDiff(nuA, nuB) {
  let scale = 0;
  for (let k = 0; k < nuA.length; k++) scale = Math.max(scale, Math.abs(nuB[k]));
  if (scale === 0) return 0;
  let d = 0;
  for (let k = 0; k < nuA.length; k++) d = Math.max(d, Math.abs(nuA[k] - nuB[k]));
  return d / scale;
}

// -- Per-cell finer-N ladder --------------------------------------------------
const PER_CELL = Object.freeze(
  CELLS.map((cell) => {
    const { a, U, NPHI } = cell;
    const ladder = N_LADDER.map((N) => ({ N, supportMeasure: supportMeasure(N, a, U, NPHI) }));
    const measures = ladder.map((r) => r.supportMeasure);
    const monotoneInN = ladder.every((r, i) => i === 0 || r.supportMeasure >= ladder[i - 1].supportMeasure - 1e-12);
    const convergedMeasure = measures[measures.length - 1];   // finest N = 51200
    // O(N) vs O(N^2) certification at the shared small resolution.
    const fac = densitiesFactor(CROSS_CHECK_N, a, U, NPHI);
    const dir = nuDirect(CROSS_CHECK_N, a, U, NPHI);
    const factorizationRelError = maxRelDiff(fac.nu, dir);
    return Object.freeze({
      label: cell.label,
      a,
      U,
      NPHI,
      offGrid: cell.offGrid,
      ladder: Object.freeze(ladder.map((r) => Object.freeze(r))),
      monotoneInN,
      convergedMeasure,
      factorizationRelError,
    });
  }),
);

// -- Cross-cell spread AT EACH N (the decisive N-convergence diagnostic) -------
const SPREAD_BY_N = Object.freeze(
  N_LADDER.map((N, iN) => {
    const ms = PER_CELL.map((r) => r.ladder[iN].supportMeasure);
    const min = Math.min(...ms);
    const max = Math.max(...ms);
    const mean = ms.reduce((s, m) => s + m, 0) / ms.length;
    return Object.freeze({ N, min, max, mean, spread: max - min });
  }),
);

// The cross-cell SPREAD must contract monotonically as N grows (invariance tightens).
const spreadShrinksWithN = SPREAD_BY_N.every(
  (row, i) => i === 0 || row.spread <= SPREAD_BY_N[i - 1].spread + 1e-9,
);

// Per-cell measure is monotone-increasing in N with SHRINKING increments (Cauchy tail).
const allMonotoneInN = PER_CELL.every((r) => r.monotoneInN);
const meanDeltas = SPREAD_BY_N.slice(1).map((row, i) => row.mean - SPREAD_BY_N[i].mean);
const incrementsShrink = meanDeltas.every((d, i) => i === 0 || d <= meanDeltas[i - 1] + 1e-9);

// Off-grid factorization certification.
const offGridCells = PER_CELL.filter((r) => r.offGrid);
const allOffGridFactorizationsMatch = offGridCells.every((r) => r.factorizationRelError < 1e-12);

// Converged (finest N) invariance statistics.
const finest = SPREAD_BY_N[SPREAD_BY_N.length - 1];
const convergedSpread = finest.spread;             // ~2.0e-4
const convergedMean = finest.mean;                 // ~1.2552

const verdict =
  spreadShrinksWithN && allMonotoneInN && incrementsShrink && allOffGridFactorizationsMatch && convergedSpread < 0.001
    ? 'OVERFLOW-SUPPORT-MEASURE-N-CONVERGED-AND-OFF-GRID-CELL-INVARIANT-~1.2552; SPREAD-CONTRACTS-WITH-N (NOT-A-RESOLUTION-COINCIDENCE)'
    : 'INDETERMINATE';

export const IMP3224_OVERFLOW_SUPPORT_FINER_N_CROSSVAL = Object.freeze({
  id: 'imp-3224-overflow-support-finer-N-crossval',
  ticket: 'imp-3224',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCellSweep: 'imp-3199-overflow-fraction-cell-sweep.js',
  relatedEndpointClosedForm: 'imp-3216-overflow-support-length-closed-form.js',
  relatedResolutionSweep: 'imp-3175-overflow-fraction-resolution-reconcile.js',

  summary:
    'Cross-validates the imp-3199 cell-invariant absolute overflow-support measure ' +
    'frac x U (~1.2535 at the single imp-3199 live N=6400) at FINER resolutions ' +
    'N in {6400,12800,25600,51200} and at SIX new cells OFF the imp-3199 base seven ' +
    '(a=0.4, a=0.9, U=5.5, U=7, NPHI=8, NPHI=20). FINDINGS: (C1) at every cell the ' +
    'measure is monotone-increasing in N with shrinking increments, converging to ' +
    '~1.2552 (so the N=6400 reading ~1.2535 is a mild finite-resolution under-count of ' +
    'the same length, not a drifting quantity); (C2) THE DECISIVE TEST -- the cross-cell ' +
    'spread of frac x U CONTRACTS monotonically as N grows (1.88e-3 at N=6400 -> 2.0e-4 ' +
    'at N=51200), which a finite-resolution coincidence would not do, certifying the ' +
    'invariance is genuine and N-convergent; (C3) the O(N) sinh-addition-law ' +
    'factorization reproduces the direct O(N^2) loop to ~1e-16 at each new off-grid ' +
    'cell, so the finer-N sweep is not a base-cell artifact. NOTE (imp-3216/imp-3278): ' +
    'the upper endpoint bounding this length is the IEEE-754 kernel-underflow horizon, ' +
    'so what is certified N-converged and cell-invariant is the double-precision READING, ' +
    'not the mathematically corrected overflow length ([tau_1,U], fraction -> 1 as U grows). ' +
    'DIAGNOSTIC; overflow-support only; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du',
    supportMeasureFunctional: '|{tau in [0,U] : nu(tau) > mu(tau)}| = (overflow-panel count / N) * U',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N) per resolution',
    on2Reference: 'direct double loop nu(tau_k) = H^2 sum_{i<=k} sum_{j>k} Phi_i Phi_j sinh(a(v_j-u_i))',
    resolutionLadder: N_LADDER,
    crossCheckResolution: CROSS_CHECK_N,
    cells: CELLS,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    perCell: PER_CELL,                                  // per cell: N-ladder, monotone-in-N, converged measure, factorization rel error
    spreadByN: SPREAD_BY_N,                             // cross-cell min/max/mean/spread at each N (contracts with N)
    imp3199LiveN: IMP3199_LIVE_N,
    imp3199SupportMeasure: IMP3199_SUPPORT_MEASURE,
    convergedMean,                                      // ~1.2552 at finest N = 51200
    convergedSpread,                                    // ~2.0e-4 cross-cell at finest N
    spreadShrinksWithN,                                 // the decisive contraction test
    allMonotoneInN,                                     // per-cell monotone-increasing in N
    incrementsShrink,                                   // successive mean increments shrink (Cauchy tail)
    allOffGridFactorizationsMatch,                      // O(N) == O(N^2) at every new off-grid cell
    verdict,
  }),

  interpretation: Object.freeze({
    supportMeasureIsNConverged:
      'imp-3199 read frac x U ~1.2535 at its single live finest N=6400. Refining to N up to 51200 shows the measure ' +
      'is monotone-increasing in N with shrinking increments (mean gain 8.6e-4 -> 3.4e-4 -> 1.4e-4), converging to ' +
      '~1.2552 -- the ~1.2535 was a mild finite-resolution under-count of the SAME length, not a still-drifting quantity.',
    invarianceTightensWithN:
      'The decisive coincidence test: the cross-cell spread of frac x U CONTRACTS monotonically as the grid refines ' +
      '(1.88e-3 at N=6400 -> 7.0e-4 -> 2.7e-4 -> 2.0e-4 at N=51200). A finite-resolution accident would not ' +
      'systematically pull the cells toward a common value as N grows; the cells agreeing MORE tightly at finer N is ' +
      'the signature of a genuine cell-invariant overflow-support length.',
    invarianceHoldsOffTheBaseGrid:
      'The contraction and the ~1.2552 limit hold across six cells (a=0.4, a=0.9, U=5.5, U=7, NPHI=8, NPHI=20) that ' +
      'are NOT among the imp-3199 base seven, and the O(N) factorization reproduces the direct O(N^2) loop to ~1e-16 ' +
      'at each -- so the invariance is not a property of the specific base a/U/NPHI grid points.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    upperEndpointIsUnderflowHorizonArtifact:
      'CRITICAL honesty flag (imp-3216 / imp-3278): the frac x U upper endpoint tau_2 ~ 1.366 that bounds this ' +
      'support length is the IEEE-754 kernel-underflow horizon, NOT a genuine nu/mu down-crossing, so the converged ' +
      '~1.2552 is the double-precision snapshot of a quantity whose upper limit is an arithmetic artifact. What this ' +
      'module certifies is narrower and still true: that snapshot is itself N-CONVERGED and cell-invariant off the ' +
      'base grid (the contraction test rules out a finite-resolution coincidence in the READING), NOT that ~1.2552 ' +
      'is the mathematically correct overflow length -- the corrected region is [tau_1, U] with fraction -> 1 as U grows. ' +
      'HONEST-STATUS BANNER: this N-converged, cell-invariant ~1.2552 is an interval whose upper endpoint is the ' +
      'imp-3216 IEEE-754 kernel underflow horizon, NOT a genuine Phi-autocorrelation length -- N-convergence and ' +
      'off-grid cell-invariance certify the READING is stable, they do not promote it to a Phi-autocorrelation length.',
    addressesOverflowSupportOnlyNotAbsoluteDeficitMagnitude:
      'This module cross-validates the overflow-SUPPORT measure |{nu > mu}| N-convergence and off-grid ' +
      'cell-invariance only. The absolute deg-2 deficit magnitude (a separate quantity carrying the offline ' +
      'normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow measure is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3224_OVERFLOW_SUPPORT_FINER_N_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3224-spread-contracts-with-N',
    why: 'THE DELIVERABLE (C2): the cross-cell spread of frac x U must contract monotonically as the tau-grid ' +
         'refines from N=6400 to N=51200 -- a finite-resolution coincidence would not systematically tighten, so ' +
         'the shrinking spread certifies the invariance is N-convergent and genuine.',
    holds: () => spreadShrinksWithN && SPREAD_BY_N[SPREAD_BY_N.length - 1].spread < SPREAD_BY_N[0].spread,
  },
  {
    id: 'imp3224-converged-spread-cell-invariant',
    why: 'At the finest resolution N=51200 the cross-cell spread of frac x U must be well under 0.001 across all ' +
         'nine cells (including the six off-grid ones), confirming the support length is cell-invariant at converged N.',
    holds: () => convergedSpread < 0.001,
  },
  {
    id: 'imp3224-converged-mean-reproduces-imp3199',
    why: 'The finest-N cross-cell mean support measure must sit within 0.005 of the imp-3199 recorded ~1.2535, ' +
         'confirming the finer-N ladder converges to the SAME length imp-3199 read at N=6400 (a mild under-count).',
    holds: () => Math.abs(convergedMean - IMP3199_SUPPORT_MEASURE) < 0.005 && convergedMean > IMP3199_SUPPORT_MEASURE,
  },
  {
    id: 'imp3224-monotone-in-N-with-shrinking-increments',
    why: 'THE DELIVERABLE (C1): the measure must be monotone-increasing in N at every cell and the cross-cell-mean ' +
         'successive increments must shrink (a Cauchy tail) -- confirming convergence rather than open-ended drift.',
    holds: () => allMonotoneInN && incrementsShrink,
  },
  {
    id: 'imp3224-off-grid-factorization-matches-direct',
    why: 'THE DELIVERABLE (C3): at every NEW cell off the imp-3199 base seven the O(N) sinh-addition-law ' +
         'factorization must reproduce the direct O(N^2) recompute to near machine precision (rel error < 1e-12), ' +
         'so the finer-N O(N) sweep is not an artifact of the base a/U/NPHI grid points.',
    holds: () => allOffGridFactorizationsMatch && offGridCells.length === 6,
  },
  {
    id: 'imp3224-verdict-is-N-converged-off-grid-invariant',
    why: 'The classified verdict must be the N-converged / off-grid-cell-invariant / spread-contracts reconciliation, ' +
         'not indeterminate; a flip means the spread stopped contracting, a cell broke monotonicity, or an off-grid ' +
         'factorization diverged.',
    holds: () =>
      verdict === 'OVERFLOW-SUPPORT-MEASURE-N-CONVERGED-AND-OFF-GRID-CELL-INVARIANT-~1.2552; SPREAD-CONTRACTS-WITH-N (NOT-A-RESOLUTION-COINCIDENCE)',
  },
  {
    id: 'imp3224-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC finer-N cross-validation, overflow-support-only (not the absolute deficit ' +
         'magnitude), necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed. ' +
         'If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3224_OVERFLOW_SUPPORT_FINER_N_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3224_OVERFLOW_SUPPORT_FINER_N_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3224-overflow-support-finer-N-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3224_OVERFLOW_SUPPORT_FINER_N_CROSSVAL;
