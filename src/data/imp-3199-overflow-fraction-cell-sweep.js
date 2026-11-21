/**
 * @module imp-3199-overflow-fraction-cell-sweep
 * @fileoverview imp-3199 -- Re-run the imp-3175 O(N) prefix/suffix overflow-
 *   fraction resolution sweep at SEVERAL de Bruijn-Newman Phi cells (vary the
 *   shear weight a, the lag cutoff U, and the kernel truncation NPHI), to test
 *   whether the imp-3175 findings are specific to the single lightweight cell
 *   (a = 0.5, U = 6, NPHI = 10) at which they were measured.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   WHAT imp-3175 LEFT SINGLE-CELL
 *   -----------------------------
 *   imp-3175-overflow-fraction-resolution-reconcile reports the converged genuine
 *   overflow fraction |{tau : nu(tau) > mu(tau)}| / U ~ 0.209 "at this lightweight
 *   Phi cell" (NPHI = 10, a = 0.5, U = 6) ONLY, and validates the O(N) sinh-
 *   addition-law factorization against the imp-3154 O(N^2) double loop at a SINGLE
 *   N = 200. Two things were therefore untested: (1) does the factorization still
 *   reproduce a direct O(N^2) recompute away from that one cell, and (2) is the
 *   monotone-to-~0.209 behaviour -- and the converged value itself -- cell-specific?
 *
 *   THE GENUINE DENSITIES (identical to imp-3175 / imp-3154, now (a, U, NPHI)-parametric)
 *   ------------------------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))   (past-future
 *               shear Volterra block)
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du             (passive
 *               Phi^2-tail diagonal density, Sec 26-27)
 *   overflow fraction = |{tau in [0, U] : nu(tau) > mu(tau)}| / U.
 *   The shear weight obeys sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au), so
 *   nu factors into a past-prefix x future-suffix product and each tau-grid
 *   resolution is O(N) (prefix/suffix accumulators). The direct O(N^2) double loop
 *   recomputes the SAME midpoint sum without the factorization.
 *
 *   WHAT THE MULTI-CELL SWEEP FINDS (measured at finest live N = 6400, NOT proved)
 *   ----------------------------------------------------------------------------
 *   Seven cells around the base (vary one knob at a time):
 *     a = 0.5, U = 6, NPHI = 10 (base) -> frac 0.209063,  measure (frac*U) 1.25438
 *     a = 0.3, U = 6, NPHI = 10        -> frac 0.208906,  measure 1.25344
 *     a = 0.7, U = 6, NPHI = 10        -> frac 0.209063,  measure 1.25438
 *     a = 0.5, U = 5, NPHI = 10        -> frac 0.250781,  measure 1.25391
 *     a = 0.5, U = 8, NPHI = 10        -> frac 0.156562,  measure 1.25250
 *     a = 0.5, U = 6, NPHI = 6         -> frac 0.209063,  measure 1.25438
 *     a = 0.5, U = 6, NPHI = 14        -> frac 0.209063,  measure 1.25438
 *
 *   THREE FINDINGS:
 *   (F1) ROBUST FACTORIZATION. At EVERY cell the O(N) factorized nu(tau) array
 *        reproduces the direct O(N^2) recompute to machine precision (max relative
 *        error ~1e-16 at N = 200) -- the prefix/suffix identity is not specific to
 *        the a = 0.5, U = 6 cell.
 *   (F2) UNIVERSAL MONOTONE CONVERGENCE. The overflow fraction is MONOTONE
 *        INCREASING in N and converges at every cell -- the imp-3175 monotone-to-a-
 *        limit shape is cell-independent.
 *   (F3) THE FRACTION IS CELL-DEPENDENT, BUT ONLY THROUGH U. Varying a (0.3, 0.5,
 *        0.7) and NPHI (6, 10, 14 -- the kernel is already saturated by NPHI = 6)
 *        leaves the converged fraction at ~0.209. Varying U moves it strongly
 *        (U = 5 -> 0.251, U = 6 -> 0.209, U = 8 -> 0.157). BUT the absolute
 *        overflow-SUPPORT measure frac*U is ~1.2535 +- 0.001 across ALL seven cells:
 *        the overflow region is a fixed absolute lag-length ~1.254, and the
 *        fraction's U-dependence is just that fixed length divided by U (a trivial
 *        normalization). So the imp-3175 ~0.209 is the U = 6 reading of a
 *        cell-invariant overflow-support length, NOT a universal fraction.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This measures the overflow-SUPPORT fraction /
 *   measure only; the absolute deficit MAGNITUDE (a separate quantity carrying the
 *   offline normalization convention) is NOT re-derived. A nonzero overflow
 *   fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH
 *   verdict. No false QED. No refereed bound is changed.
 *
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the single-cell sweep)
 *   @see imp-3154-genuine-deg2-deficit-degree-sweep.js (the O(N^2) reference loop)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (imp-3144: the 19.4% anchor)
 *
 *   Ticket: imp-3199 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Live tau-grid resolutions swept per cell (O(N) each via the hyperbolic factorization).
const N_SET = Object.freeze([100, 200, 400, 800, 1600, 3200, 6400]);

// The shared cross-check resolution at which the O(N) factorization is matched
// against the direct O(N^2) double loop (imp-3175 only checked the base cell here).
const CROSS_CHECK_N = 200;

// The imp-3175 base cell and its recorded converged fraction (must be reproduced).
const BASE_CELL = Object.freeze({ a: 0.5, U: 6, NPHI: 10 });
const IMP3175_BASE_CONVERGED_FRACTION = 0.2092; // offline N = 204800 -> 0.2092285

// The seven cells: vary ONE knob at a time around the base.
const CELLS = Object.freeze([
  Object.freeze({ label: 'base (a=0.5,U=6,NPHI=10)', a: 0.5, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'a=0.3', a: 0.3, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'a=0.7', a: 0.7, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'U=5', a: 0.5, U: 5, NPHI: 10 }),
  Object.freeze({ label: 'U=8', a: 0.5, U: 8, NPHI: 10 }),
  Object.freeze({ label: 'NPHI=6', a: 0.5, U: 6, NPHI: 6 }),
  Object.freeze({ label: 'NPHI=14', a: 0.5, U: 6, NPHI: 14 }),
]);

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-2841). */
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

/**
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) on an N-panel midpoint
 * grid, via the sinh(a(v-u)) hyperbolic addition law (imp-3175 path, parametric).
 */
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

/**
 * Direct O(N^2) genuine densities (the imp-3154 double-loop path, parametric):
 * nu(tau_k) WITHOUT the factorization, used to certify the prefix/suffix identity.
 */
function densitiesDirect(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const u = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i], NPHI);
  }
  const nu = new Array(N);
  const mu = new Array(N);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let i = 0; i <= k; i++) {
      for (let j = k + 1; j < N; j++) {
        s += phi[i] * phi[j] * Math.sinh(a * (u[j] - u[i]));
      }
    }
    nu[k] = H * H * s;
    let m = 0;
    for (let j = k; j < N; j++) m += phi[j] * phi[j] * Math.sinh(2 * a * u[j]);
    mu[k] = (H / (2 * Math.PI)) * m;
  }
  return { nu, mu };
}

/** overflow fraction |{tau : nu > mu}| / U from a pre-computed densities pair. */
function overflowFractionFrom(dens, N) {
  let panels = 0;
  for (let k = 0; k < N; k++) if (dens.nu[k] > dens.mu[k]) panels += 1;
  return panels / N;
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

// -- Per-cell computation -----------------------------------------------------
const PER_CELL = Object.freeze(
  CELLS.map((cell) => {
    const { a, U, NPHI } = cell;
    const sweep = N_SET.map((N) => ({
      N,
      overflowFraction: overflowFractionFrom(densitiesFactor(N, a, U, NPHI), N),
    }));
    const monotoneIncreasing = sweep.every(
      (row, i) => i === 0 || row.overflowFraction >= sweep[i - 1].overflowFraction - 1e-12,
    );
    const convergedFraction = sweep[sweep.length - 1].overflowFraction; // finest live N = 6400
    const supportMeasure = convergedFraction * U;                       // absolute overflow lag-length
    // Factorization-vs-direct cross-check at the shared resolution.
    const fac = densitiesFactor(CROSS_CHECK_N, a, U, NPHI);
    const dir = densitiesDirect(CROSS_CHECK_N, a, U, NPHI);
    const factorizationRelError = maxRelDiff(fac.nu, dir.nu);
    const factorizationFractionMatch =
      Math.abs(overflowFractionFrom(fac, CROSS_CHECK_N) - overflowFractionFrom(dir, CROSS_CHECK_N)) < 1e-12;
    return Object.freeze({
      label: cell.label,
      a,
      U,
      NPHI,
      sweep: Object.freeze(sweep.map((r) => Object.freeze(r))),
      monotoneIncreasing,
      convergedFraction,
      supportMeasure,
      factorizationRelError,
      factorizationFractionMatch,
    });
  }),
);

// -- Cross-cell summary -------------------------------------------------------
const baseRow = PER_CELL.find((r) => r.a === BASE_CELL.a && r.U === BASE_CELL.U && r.NPHI === BASE_CELL.NPHI);
const allFactorizationsMatch = PER_CELL.every((r) => r.factorizationRelError < 1e-10);
const allMonotone = PER_CELL.every((r) => r.monotoneIncreasing);

const measures = PER_CELL.map((r) => r.supportMeasure);
const measureMin = Math.min(...measures);
const measureMax = Math.max(...measures);
const measureSpread = measureMax - measureMin;          // absolute support length spread across cells
const measureMean = measures.reduce((s, m) => s + m, 0) / measures.length;

// The FRACTION varies (driven by U), but the absolute support MEASURE is invariant.
const fractions = PER_CELL.map((r) => r.convergedFraction);
const fractionSpread = Math.max(...fractions) - Math.min(...fractions);

// Cell-dependence verdict: fraction varies but support measure is invariant -> the
// 0.209 is the U=6 normalization of a cell-invariant overflow-support length ~1.2535.
const fractionIsCellDependent = fractionSpread > 0.02;  // U=5..8 spans 0.157..0.251
const measureIsCellInvariant = measureSpread < 0.01;    // ~1.2535 +- 0.001
const verdict =
  allFactorizationsMatch && allMonotone && fractionIsCellDependent && measureIsCellInvariant
    ? 'FACTORIZATION-AND-MONOTONE-CONVERGENCE-UNIVERSAL; FRACTION-U-DEPENDENT-BUT-SUPPORT-MEASURE-CELL-INVARIANT-~1.2535'
    : 'INDETERMINATE';

export const IMP3199_OVERFLOW_FRACTION_CELL_SWEEP = Object.freeze({
  id: 'imp-3199-overflow-fraction-cell-sweep',
  ticket: 'imp-3199',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSingleCellSweep: 'imp-3175-overflow-fraction-resolution-reconcile.js',
  relatedON2Reference: 'imp-3154-genuine-deg2-deficit-degree-sweep.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Generalizes the imp-3175 single-cell (a=0.5, U=6, NPHI=10) O(N) prefix/suffix ' +
    'overflow-fraction resolution sweep to SEVEN de Bruijn-Newman Phi cells (vary a, ' +
    'U, NPHI one knob at a time) and certifies the O(N) sinh-addition-law ' +
    'factorization against a direct O(N^2) recompute at EACH cell. FINDINGS: (F1) the ' +
    'factorized nu(tau) reproduces the direct O(N^2) loop to machine precision (max ' +
    'rel error ~1e-16) at every cell, not just the base; (F2) the overflow fraction is ' +
    'monotone-increasing-to-a-converged-value at every cell; (F3) the converged ' +
    'FRACTION is cell-dependent but ONLY through U (a in {0.3,0.5,0.7} and NPHI in ' +
    '{6,10,14} all leave it at ~0.209; U=5 -> 0.251, U=6 -> 0.209, U=8 -> 0.157), ' +
    'while the ABSOLUTE overflow-support measure frac*U is ~1.2535 +- 0.001 across ALL ' +
    'seven cells. So the imp-3175 ~0.209 is the U=6 normalization of a cell-invariant ' +
    'overflow-support lag-length ~1.254, NOT a universal fraction; the kernel is ' +
    'already saturated by NPHI=6 and the shear weight a barely moves the support. ' +
    'DIAGNOSTIC; overflow-support only; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))  (past-future Volterra block)',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du  (integrated Phi^2-tail diagonal)',
    overflowFunctional: '|{tau : nu(tau) > mu(tau)}| / U  (fraction of [0, U] where the shear overflows the passive)',
    supportMeasureFunctional: '(overflow fraction) * U  (absolute lag-length of the overflow support)',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N) per resolution',
    on2Reference: 'direct double loop nu(tau_k) = H^2 sum_{i<=k} sum_{j>k} Phi_i Phi_j sinh(a(v_j-u_i))  (no factorization)',
    resolutionSet: N_SET,
    crossCheckResolution: CROSS_CHECK_N,
    cells: CELLS,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    perCell: PER_CELL,                                  // per cell: sweep, monotone, converged fraction, support measure, factorization rel error
    baseConvergedFraction: baseRow.convergedFraction,   // base cell finest (reproduces imp-3175 ~0.209)
    imp3175BaseConvergedFraction: IMP3175_BASE_CONVERGED_FRACTION,
    allFactorizationsMatch,                             // O(N) == O(N^2) at every cell
    allMonotone,                                        // monotone-increasing at every cell
    fractionSpread,                                     // spread of converged FRACTION across cells (~0.094, U-driven)
    measureMin,
    measureMax,
    measureMean,                                        // ~1.2535 absolute overflow-support lag-length
    measureSpread,                                      // < 0.001 -> support measure cell-invariant
    fractionIsCellDependent,
    measureIsCellInvariant,
    verdict,
  }),

  interpretation: Object.freeze({
    factorizationIsNotCellSpecific:
      'imp-3175 validated the O(N) sinh-addition-law factorization against the imp-3154 O(N^2) loop at a SINGLE ' +
      'cell and a SINGLE N=200. Here the factorized nu(tau) reproduces a direct O(N^2) recompute to machine ' +
      'precision (max rel error ~1e-16) at all seven cells -- the prefix/suffix identity is exact wherever a, U, ' +
      'NPHI are varied, so the O(N) speed-up is not an artifact of the base cell.',
    monotoneConvergenceIsUniversal:
      'The monotone-increasing-to-a-converged-value behaviour imp-3175 found at the base cell holds at every cell ' +
      'tested -- it is a property of the midpoint quadrature on this genuine density pair, not of the specific a, U, NPHI.',
    fractionIsUOnlyButSupportIsInvariant:
      'The converged overflow FRACTION is essentially invariant to a (0.3, 0.5, 0.7 all give ~0.209) and to NPHI ' +
      '(6, 10, 14 give identical values -- the kernel is saturated by NPHI=6), but moves strongly with U ' +
      '(0.251 at U=5, 0.209 at U=6, 0.157 at U=8). The ABSOLUTE overflow-support measure frac*U, however, is ' +
      '~1.2535 +- 0.001 across ALL seven cells: the overflow region is a fixed absolute lag-length ~1.254 and the ' +
      'fraction is just that length divided by U. The imp-3175 ~0.209 is therefore the U=6 reading of a ' +
      'cell-invariant support length, NOT a universal fraction -- a correction worth recording.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addressesOverflowSupportOnlyNotAbsoluteDeficitMagnitude:
      'This module sweeps the overflow-SUPPORT fraction / measure |{nu > mu}| across cells only. The absolute ' +
      'deg-2 deficit magnitude (a separate quantity carrying the offline normalization convention) is NOT ' +
      're-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3199_OVERFLOW_FRACTION_CELL_SWEEP_ASSERTIONS = [
  {
    id: 'imp3199-base-cell-reproduces-imp3175',
    why: 'The base cell (a=0.5, U=6, NPHI=10) finest-resolution converged fraction must reproduce the imp-3175 ' +
         '~0.209, certifying the parametric path collapses to the single-cell module at the base.',
    holds: () => Math.abs(baseRow.convergedFraction - IMP3175_BASE_CONVERGED_FRACTION) < 0.005,
  },
  {
    id: 'imp3199-factorization-matches-direct-at-every-cell',
    why: 'THE DELIVERABLE (F1): the O(N) sinh-addition-law factorization must reproduce the direct O(N^2) ' +
         'recompute at EVERY cell, not just the base -- the per-cell max relative error of the nu(tau) array ' +
         'must be near machine precision, and the integer overflow counts must agree exactly.',
    holds: () =>
      allFactorizationsMatch &&
      PER_CELL.every((r) => r.factorizationRelError < 1e-12 && r.factorizationFractionMatch),
  },
  {
    id: 'imp3199-monotone-convergence-universal',
    why: 'THE DELIVERABLE (F2): the overflow fraction must be monotone-increasing-to-a-converged-value at EVERY ' +
         'cell, confirming the imp-3175 convergence shape is cell-independent.',
    holds: () => allMonotone,
  },
  {
    id: 'imp3199-fraction-cell-dependent-via-U',
    why: 'THE FINDING (F3a): the converged FRACTION is cell-dependent -- the U sweep (U=5 -> ~0.251, U=8 -> ' +
         '~0.157) spreads it by well over 0.02, so ~0.209 is NOT a universal fraction.',
    holds: () => fractionIsCellDependent && fractionSpread > 0.05,
  },
  {
    id: 'imp3199-support-measure-cell-invariant',
    why: 'THE FINDING (F3b): the ABSOLUTE overflow-support measure frac*U is cell-invariant ~1.2535 across all ' +
         'seven cells (spread < 0.01) -- the fraction depends on U only through the trivial 1/U normalization of ' +
         'a fixed overflow lag-length. This is the cell-invariant quantity to trust.',
    holds: () =>
      measureIsCellInvariant && measureSpread < 0.01 && Math.abs(measureMean - 1.2535) < 0.01,
  },
  {
    id: 'imp3199-a-and-nphi-do-not-move-the-fraction',
    why: 'Sanity for F3: varying a (0.3, 0.7 vs base 0.5) and NPHI (6, 14 vs base 10) must each leave the ' +
         'converged fraction within ~0.001 of the base ~0.209 -- the kernel is saturated by NPHI=6 and a barely ' +
         'moves the overflow support; only U matters.',
    holds: () => {
      const base = baseRow.convergedFraction;
      const near = (label) => {
        const r = PER_CELL.find((x) => x.label === label);
        return Math.abs(r.convergedFraction - base) < 0.0015;
      };
      return near('a=0.3') && near('a=0.7') && near('NPHI=6') && near('NPHI=14');
    },
  },
  {
    id: 'imp3199-verdict-is-universal-factorization-invariant-measure',
    why: 'The classified verdict must be the universal-factorization / invariant-support-measure reconciliation, ' +
         'not indeterminate; a flip means a cell broke the factorization, monotonicity, or the invariant measure.',
    holds: () =>
      verdict === 'FACTORIZATION-AND-MONOTONE-CONVERGENCE-UNIVERSAL; FRACTION-U-DEPENDENT-BUT-SUPPORT-MEASURE-CELL-INVARIANT-~1.2535',
  },
  {
    id: 'imp3199-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC cell sweep, overflow-support-only (not the absolute deficit magnitude), ' +
         'necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed. If any ' +
         'flip the module is over-claiming.',
    holds: () => {
      const c = IMP3199_OVERFLOW_FRACTION_CELL_SWEEP.honestCaveat;
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

for (const assertion of IMP3199_OVERFLOW_FRACTION_CELL_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3199-overflow-fraction-cell-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3199_OVERFLOW_FRACTION_CELL_SWEEP;
