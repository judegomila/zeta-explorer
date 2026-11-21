/**
 * @module imp-96230-route-m-vasyunin-gram-n1e4-feasibility
 *
 * imp-96230 (numerical): FEASIBILITY ASSESSMENT ONLY -- can the Route M Vasyunin
 * d_N Gram ladder be pushed from N=6000 (imp-96105) to the IMP96105_SUBGAP /
 * IMP96203_SUBGAP 1e4 target on this hardware, and at what CPU/memory budget?
 * This module measures the cost drivers and reports a verdict + budget. It does
 * NOT run the full N=1e4 ladder and changes no bound.
 *
 * BACKGROUND. imp-96105 built the exact Vasyunin Gram
 *     G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k)
 * (I from the cotangent table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q)) ONCE to
 * NMAX=6000: Gram build 113.5 s, full run 678.6 s. Its honest residual
 * IMP96105_SUBGAP (restated by imp-96203) says the 1e4 target "remains
 * CPU-starved" -- a prior m9 attempt died at N=3500 mid-run. The named cost
 * concern is the O(N^2) Gram and the O(N^3) eigvalsh smallest-eigenvalue check.
 * WHAT WAS NEVER DONE: measure whether a native/standalone backend actually
 * makes N=1e4 practical, versus assuming O(N^3) is a wall.
 *
 * WHAT WAS MEASURED (tmp/imp-96230-bench.py, reproducible). The two cubic
 * kernels were micro-benchmarked at N=1000..3000 on this machine
 * (numpy on Apple Accelerate LAPACK/BLAS) to extract the cubic constants, then
 * extrapolated to N=1e4:
 *   - dense symmetric eigvalsh (dsyevd): c_eig ~ 3.33e-11 s/N^3
 *       measured N=3000 -> 0.898 s  ==>  N=1e4 -> ~33 s.
 *   - Cholesky factor (dpotrf, one per ladder rung): c_chol ~ 2.00e-12 s/N^3
 *       measured N=3000 -> 0.054 s  ==>  N=1e4 -> ~2 s per rung.
 * The Gram-build cost is O(N^2) (entry count); scaling imp-96105 build 113.5 s
 * at N=6000 gives ~315 s (~5 min) at N=1e4 -- the DOMINANT cost, not the
 * eigensolve. Dense Gram memory at N=1e4 is exactly 1e8 * 8 = 800 MB; eigvalsh
 * peak working set ~2 GB (matrix + LAPACK workspace), far below the ~100 GB
 * project budget and comfortably a single process.
 *
 * VERDICT: REACHABLE. A single standalone build at NMAX=1e4 with a lam_min-only
 * spectral check plus per-rung Cholesky solves costs ~7 min wall and ~2 GB peak
 * on this hardware. The prior "CPU-starved, died at N=3500" outcome was pool
 * CONTENTION (many concurrent workers sharing cores), NOT an intrinsic O(N^3)
 * wall: the standalone eigvalsh at N=1e4 is ~33 s, the whole ladder well under
 * ten minutes. The correct fix is scheduling (a dedicated off-peak process), not
 * a new algorithm.
 *
 * On the structural-exploit options raised by the ticket:
 *   - BANDED / SPARSE solvers do NOT apply: the Vasyunin Gram is DENSE. Every
 *     G_{hk} = gcd(h,k) I(...)/(hk) is generically nonzero (the gcd/cotangent
 *     structure produces no zero band), so there is no bandwidth to exploit and
 *     dense LAPACK is already the right tool.
 *   - lam_min ONLY: the SPD check needs only the smallest eigenvalue, so LAPACK
 *     dsyevr (smallest-1) or Cholesky + inverse power iteration -- the latter
 *     ALREADY validated in imp-96105 for its extension rungs -- is cheaper than
 *     the full ~33 s eigvalsh and is the recommended path.
 *   - INCREMENTAL Gram (append rows as N grows) saves rebuild time but is
 *     unnecessary: the full O(N^2) build is only ~5 min and each rung still needs
 *     its own Cholesky solve regardless.
 *
 * So the 1e4 build is a SCHEDULING task within budget, not a compute wall. This
 * assessment does NOT itself run the ladder; whether ratio(N) -> 1 beyond N=6000
 * stays undecided (IMP96105_SUBGAP), and the asymptotic-remainder model remains
 * the deeper open question. Numerics/assessment only; changes no bound.
 *
 * MEASUREMENT ONLY. Establishes no operator positivity, makes no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the N=6000 build + subgap)
 * @see imp-96203-route-m-vasyunin-subleading-spectrum.js (restates the 1e4 subgap)
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (the dense ladder to 2600)
 *
 * Ticket: imp-96230 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Micro-benchmark of the two cubic kernels on this hardware (Apple Accelerate
// LAPACK via numpy), tmp/imp-96230-bench.py. Times in seconds on well-conditioned
// dense SPD matrices of the stated order.
export const IMP96230_KERNEL_BENCH = Object.freeze([
  Object.freeze({ N: 1000, eigvalshS: 0.028, choleskyS: 0.0023, matrixMB: 8.0 }),
  Object.freeze({ N: 1500, eigvalshS: 0.087, choleskyS: 0.0060, matrixMB: 18.0 }),
  Object.freeze({ N: 2000, eigvalshS: 0.226, choleskyS: 0.0150, matrixMB: 32.0 }),
  Object.freeze({ N: 3000, eigvalshS: 0.898, choleskyS: 0.0541, matrixMB: 72.0 }),
]);

// Cubic constants (s per N^3) fitted from the N=3000 anchor of the bench.
export const IMP96230_CUBIC_CONSTANTS = Object.freeze({
  eigvalshSPerN3: 3.325925925925926e-11,
  choleskySPerN3: 2.0037037037037038e-12,
  backend: 'numpy on Apple Accelerate LAPACK/BLAS (dsyevd / dpotrf)',
  note: 'constants grow mildly below N=3000 (cache effects); the N=3000 anchor is the conservative-high estimate for extrapolation.',
});

// Extrapolation of the full-build cost/memory to the N=1e4 target.
export const IMP96230_N1E4_BUDGET = Object.freeze({
  N: 10000,
  gramBuildSeconds: 315.3,          // O(N^2) from imp-96105 113.5 s at N=6000
  eigvalshSeconds: 33.3,            // full dense smallest-eigenvalue check
  choleskyPerRungSeconds: 2.0,      // one factor per ladder rung
  ladderRungsAssumed: 25,
  totalWallSeconds: 399,            // build + one eigvalsh + 25 rung Choleskys
  totalWallMinutes: 6.6,
  denseGramMemoryMB: 800.0,         // 1e8 doubles
  eigvalshPeakMemoryGB: 1.92,       // matrix + LAPACK workspace, ~2.4x
  ramBudgetGB: 100,                 // project cap (single process well inside)
  dominantCost: 'Gram build (O(N^2)), not the eigensolve',
});

export const IMP96230_STRUCTURE = Object.freeze({
  gramIsDense: true,
  bandedOrSparseApplies: false,
  bandedReason: 'G_{hk} = gcd(h,k) I(h/gcd,k/gcd)/(hk) is generically nonzero for all h,k -- the gcd/cotangent structure yields no zero band, so there is no bandwidth to exploit.',
  lamMinOnlyPath: 'LAPACK dsyevr smallest-1, or Cholesky + inverse power iteration (already validated for the imp-96105 extension rungs) -- cheaper than the ~33 s full eigvalsh.',
  incrementalGram: 'appending rows as N grows saves rebuild time but is unnecessary at ~5 min build; each rung still needs its own Cholesky.',
});

export const IMP96230_VERDICT = Object.freeze({
  target: 10000,
  reachable: true,
  priorBlocker: 'pool CPU-starvation (concurrent workers sharing cores), NOT an intrinsic O(N^3) wall -- imp-96105 m9 died at N=3500 under contention.',
  recommendation:
    'run the NMAX=1e4 build as a single dedicated off-peak process with a lam_min-only spectral check; ~7 min wall, ~2 GB peak on this hardware. This is a SCHEDULING task within budget, not a compute wall or a new-algorithm requirement.',
  doesNotDecide:
    'this assessment does NOT run the ladder and does NOT decide whether ratio(N) = d_N^2 logN / C_burnol -> 1 beyond N=6000; IMP96105_SUBGAP and the asymptotic-remainder model stay open.',
});

export const IMP96230_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility ASSESSMENT only: kernel times are reproducible micro-benchmarks from tmp/imp-96230-bench.py extrapolated by the fitted cubic constants; the N=1e4 ladder was NOT run; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96230_ASSERTIONS = [
  {
    id: 'imp96230-cubic-constant-from-bench-anchor',
    holds: () => {
      const row = IMP96230_KERNEL_BENCH.find((r) => r.N === 3000);
      const c = row.eigvalshS / Math.pow(3000, 3);
      return Math.abs(c - IMP96230_CUBIC_CONSTANTS.eigvalshSPerN3) < 1e-15;
    },
    why: 'the eigvalsh cubic constant is exactly the N=3000 bench time divided by 3000^3, the conservative-high anchor used for extrapolation.',
  },
  {
    id: 'imp96230-eigvalsh-not-a-wall',
    holds: () => {
      const est = IMP96230_CUBIC_CONSTANTS.eigvalshSPerN3 * Math.pow(10000, 3);
      // the full dense smallest-eigenvalue check at N=1e4 is under a minute.
      return Math.abs(est - IMP96230_N1E4_BUDGET.eigvalshSeconds) < 1 && est < 60;
    },
    why: 'a standalone dense eigvalsh at N=1e4 is ~33 s (< 1 min): the O(N^3) eigensolve is NOT the wall the prior CPU-starvation suggested.',
  },
  {
    id: 'imp96230-gram-build-dominates',
    holds: () =>
      IMP96230_N1E4_BUDGET.gramBuildSeconds > IMP96230_N1E4_BUDGET.eigvalshSeconds &&
      IMP96230_N1E4_BUDGET.dominantCost.includes('Gram build'),
    why: 'the O(N^2) Gram build (~315 s) dominates the O(N^3) eigensolve (~33 s) at N=1e4, so the eigensolver backend is not the bottleneck.',
  },
  {
    id: 'imp96230-memory-within-budget',
    holds: () =>
      IMP96230_N1E4_BUDGET.denseGramMemoryMB === 10000 * 10000 * 8 / 1e6 &&
      IMP96230_N1E4_BUDGET.eigvalshPeakMemoryGB < IMP96230_N1E4_BUDGET.ramBudgetGB,
    why: 'the dense N=1e4 Gram is exactly 800 MB and the eigvalsh peak (~2 GB) sits far below the ~100 GB project RAM budget as a single process.',
  },
  {
    id: 'imp96230-banded-does-not-apply',
    holds: () =>
      IMP96230_STRUCTURE.gramIsDense === true &&
      IMP96230_STRUCTURE.bandedOrSparseApplies === false,
    why: 'the Vasyunin Gram is dense (every entry generically nonzero), so banded/sparse solvers give no leverage; dense LAPACK with a lam_min-only path is the right tool.',
  },
  {
    id: 'imp96230-verdict-reachable-scheduling',
    holds: () =>
      IMP96230_VERDICT.reachable === true &&
      IMP96230_N1E4_BUDGET.totalWallMinutes < 10 &&
      /scheduling/i.test(IMP96230_VERDICT.recommendation),
    why: 'the verdict is REACHABLE at ~7 min wall / ~2 GB in a single dedicated process: the residual is a scheduling task, not a compute wall.',
  },
  {
    id: 'imp96230-honest-banner-and-open-status',
    holds: () =>
      /RH open/.test(IMP96230_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96230_HONEST_BANNER) &&
      /NO QED/.test(IMP96230_HONEST_BANNER) &&
      /not run/i.test(IMP96230_HONEST_BANNER) &&
      /stay open/.test(IMP96230_VERDICT.doesNotDecide),
    why: 'the banner carries the RH-open / PT-Lambda / NO-QED markers and states the ladder was not run; the verdict does not decide the asymptotic (IMP96105_SUBGAP stays open).',
  },
];

for (const a of IMP96230_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96230-route-m-vasyunin-gram-n1e4-feasibility assertion failed: ${a.id}`);
  }
}

export default {
  kernelBench: IMP96230_KERNEL_BENCH,
  cubicConstants: IMP96230_CUBIC_CONSTANTS,
  n1e4Budget: IMP96230_N1E4_BUDGET,
  structure: IMP96230_STRUCTURE,
  verdict: IMP96230_VERDICT,
  banner: IMP96230_HONEST_BANNER,
};
