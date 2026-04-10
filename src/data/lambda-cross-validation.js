/**
 * Cross-validation of independent Λ estimates (imp-320)
 *
 * The codebase now contains several independent routes to the de Bruijn-
 * Newman constant Λ. Each was built for its own reason and lives in its
 * own file, so nothing currently CHECKS that the numbers are mutually
 * consistent. imp-320 asked for exactly that check: one table listing
 * every Λ estimate with its provenance, scope, and error bar, plus
 * build-time assertions that flag any pair that is numerically
 * incompatible. Three methods agreeing is evidence; three methods
 * disagreeing is a bug in one of them.
 *
 * What counts as "compatible"
 * ---------------------------
 * Two estimates (a ± δa) and (b ± δb) are compatible iff their error
 * intervals intersect:
 *
 *     [a − δa, a + δa] ∩ [b − δb, b + δb] ≠ ∅
 *
 * Equivalently |a − b| ≤ δa + δb. We use this symmetric-interval form
 * below. A one-sided bound (e.g. Rodgers-Tao Λ ≥ 0) is treated as an
 * interval [lo, +∞); a one-sided upper bound (e.g. Platt-Trudgian
 * Λ ≤ 0.2) is treated as (−∞, hi]. The CSV entries are one-sided lower
 * bounds.
 *
 * Scope is NOT the same thing as compatibility
 * --------------------------------------------
 * The estimates do not all apply to the same object. Path C and the
 * capstone are upper bounds derived from ~2500 zeros at T_0 ≈ 3000.
 * The analytical kernel-hack number is an asymptotic GUE-spacing
 * estimate evaluated at T ≈ 10^{12} (Platt scale). The CSV lower bound
 * from our in-repo 870-zero list is informative but dominated
 * numerically by Rodgers-Tao 2020. Platt-Trudgian's Λ ≤ 0.2 is the only
 * one that controls the global object unconditionally.
 *
 * So the table below flags which range of N / height each number is
 * actually about, and the assertions only compare estimates that live
 * in the same scope-class.
 *
 * Sources
 * -------
 *   (a) P15-10 capstone           Λ ≈ 0.011               — imp-304, Phase 3 assembly
 *   (b) Path C hybrid             Λ = 0.0066 ± 0.01       — imp-309 / commit 229139
 *   (c) CSV in-repo lower bound   Λ ≥ (negative value)    — imp-300, csv-lambda-lower-bound.js
 *   (d) Analytical kernel hack    Λ ∼ 1.3·10⁻¹⁰ (Platt)   — spectral-lambda-kernel.js
 *   (e) Rodgers-Tao 2020          Λ ≥ 0                    — unconditional theorem
 *   (f) Platt-Trudgian 2021       Λ ≤ 0.2                  — published unconditional upper
 *
 * The table also cites the file that owns the computation so this
 * cross-validation record never becomes the "source of truth" for any
 * individual number — it is a pure downstream consumer.
 */

import { LAMBDA_ERROR_BUDGET } from './lambda-error-budget.js';
import { CSV_LAMBDA_LOWER_BOUND } from './csv-lambda-lower-bound.js';
import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

// ── Helper: do two symmetric (value, error) intervals intersect? ────────────
function intervalsIntersect(a, deltaA, b, deltaB) {
  return Math.abs(a - b) <= deltaA + deltaB;
}

// ── Pull the CSV binding lower bound straight from its owner file ───────────
const CSV_LOWER = CSV_LAMBDA_LOWER_BOUND.ourBound.binding_lower_bound.Lambda_lower;

// ── Pull the Path C central value + error bar straight from the bridge ─────
const PATH_C_CENTRAL = LAMBDA_RH_BRIDGE.pathCBound.centralValue;
const PATH_C_ERROR = LAMBDA_RH_BRIDGE.pathCBound.errorBar;

// ── The P15-10 capstone result (imp-304, hard-coded in spectral kernel)
//    No error bar was published with the capstone — we attach a nominal
//    ±0.005 because the underlying mean-field + barrier pipeline uses
//    the same zero list (T_0 ≈ 3000) as Path C, and the fit-residual
//    component of the error budget (imp-314) is of that order. This is
//    flagged as `errorSource: 'nominal'` in the record.
const CAPSTONE_CENTRAL = 0.011;
const CAPSTONE_ERROR = 0.005;

// ── The analytical kernel-hack number at Platt scale (spectral-lambda-kernel.js)
//    This is NOT comparable to (a)/(b) because it evaluates the
//    asymptotic Λ ~ s_min²/4 at T ≈ 10^{12}, where s_min comes from
//    GUE-spacing statistics, not from the in-repo zero list. It's
//    recorded here for completeness and appears only in scope-matched
//    assertions (same-regime estimates only).
const KERNEL_HACK_CENTRAL = 1.3e-10;
const KERNEL_HACK_ERROR = 1.3e-10; // order-of-magnitude, treat as Fermi-style

export const LAMBDA_CROSS_VALIDATION = {
  compatibilityRule:
    '|a − b| ≤ δa + δb, where intervals are symmetric. One-sided ' +
    'bounds are treated as half-open intervals and only participate in ' +
    'scope-matched comparisons.',

  estimates: [
    {
      id: 'capstone',
      label: 'P15-10 capstone (imp-304)',
      central: CAPSTONE_CENTRAL,
      error: CAPSTONE_ERROR,
      errorSource: 'nominal',
      scope: 'upper bound from verified zeros T_0 ≈ 3000',
      N: 2458,
      sourceFile: 'src/math/spectral-lambda-kernel.js (const dysonResult)',
      citation: 'imp-304 / Phase 3 assembly, queue entry in improvement-queue.js',
      kind: 'upper-bound-with-nominal-error',
    },
    {
      id: 'path-c',
      label: 'Path C hybrid (imp-309)',
      central: PATH_C_CENTRAL,
      error: PATH_C_ERROR,
      errorSource: 'budgeted',
      scope: 'upper bound from verified zeros T_0 ≈ 3000',
      N: 2458,
      sourceFile: 'src/data/bridge-lambda-rh.js → LAMBDA_RH_BRIDGE.pathCBound',
      citation: 'imp-309 / commit 229139 + imp-314 error audit',
      kind: 'upper-bound-with-budgeted-error',
    },
    {
      id: 'csv-in-repo',
      label: 'CSV in-repo lower bound (imp-300)',
      central: CSV_LOWER, // strongly negative
      error: 0,
      errorSource: 'constructive',
      scope: 'lower bound from Odlyzko first 870 zeros',
      N: 870,
      sourceFile: 'src/data/csv-lambda-lower-bound.js',
      citation: 'imp-300; simplified Csordas-Norfolk-Varga 1988 form',
      kind: 'lower-bound-one-sided',
    },
    {
      id: 'kernel-hack',
      label: 'Analytical kernel hack (spectral-lambda-kernel.js)',
      central: KERNEL_HACK_CENTRAL,
      error: KERNEL_HACK_ERROR,
      errorSource: 'asymptotic',
      scope: 'GUE-spacing heuristic at T ≈ 10^{12} (Platt scale)',
      N: 3e11,
      sourceFile: 'src/math/spectral-lambda-kernel.js → analyticalLambdaBound',
      citation: 'imp-320 reference; Λ ∼ s_min²/4 with s_min from GUE',
      kind: 'asymptotic-heuristic',
    },
    {
      id: 'rodgers-tao',
      label: 'Rodgers-Tao 2020 unconditional floor',
      central: 0,
      error: 0,
      errorSource: 'theorem',
      scope: 'global, unconditional',
      N: Infinity,
      sourceFile: 'src/data/bridge-lambda-rh.js → theorems[1]',
      citation: 'Rodgers & Tao, Acta Math. 225 (2020), 1-58',
      kind: 'lower-bound-one-sided',
    },
    {
      id: 'platt-trudgian',
      label: 'Platt-Trudgian 2021 SOTA upper',
      central: 0.2,
      error: 0,
      errorSource: 'theorem',
      scope: 'global, unconditional',
      N: 3e12,
      sourceFile: 'src/data/bridge-lambda-rh.js → sotaUpperBound',
      citation: 'Platt & Trudgian, Bull. London Math. Soc. (2021)',
      kind: 'upper-bound-one-sided',
    },
  ],

  // Pairs that live in the SAME scope class and must therefore be
  // numerically compatible. Failing any of these at build time is a bug.
  sameScopeChecks: [
    {
      id: 'capstone-vs-pathc',
      a: 'capstone',
      b: 'path-c',
      why:
        'Both are upper bounds extracted from the same ~2500-zero list at ' +
        'T_0 ≈ 3000 via different pipelines (mean-field barrier vs Dyson ' +
        'backward collision). Disagreement outside their error bars would ' +
        'indicate a pipeline bug in one of them.',
    },
  ],

  // Pairs that span scope classes — not checked for interval overlap,
  // but recorded so a human reader can see what is being compared and
  // why agreement or disagreement is or is not informative.
  crossScopeNotes: [
    {
      id: 'pathc-vs-kernel-hack',
      note:
        'Path C evaluates at T_0 ≈ 3000 (N = 2458). Kernel hack evaluates ' +
        'the GUE spacing asymptotic at T ≈ 10^{12} (N ≈ 3·10^{11}). Nine ' +
        'decades of height separate them; the kernel-hack value is what we ' +
        'EXPECT Path C to look like after pushing T by nine decades, not a ' +
        'prediction at current T_0.',
    },
    {
      id: 'csv-vs-rodgers-tao',
      note:
        'CSV lower bound from 870 zeros is strongly negative; Rodgers-Tao ' +
        '2020 proved Λ ≥ 0 unconditionally. The CSV number is informative ' +
        'as a constructive witness from an explicit finite zero list but is ' +
        'dominated numerically by the unconditional floor. This is ' +
        'expected, not a conflict.',
    },
    {
      id: 'pathc-vs-platt-trudgian',
      note:
        'Path C gives Λ ≤ 0.0066 + 0.01 at T_0 ≈ 3000. Platt-Trudgian gives ' +
        'Λ ≤ 0.2 at T_0 ≈ 3·10^{12}. Path C appears numerically tighter, ' +
        'but it only controls the zero list we explicitly see, whereas ' +
        'Platt-Trudgian is global. See bridge-lambda-rh.js for why these ' +
        'bounds are not directly comparable.',
    },
  ],

  // The single plain-English line any UI consumer should quote.
  uiDisclaimer:
    'Four independent Λ estimates exist in this codebase. They are ' +
    'compatible within scope: the capstone 0.011 lies inside the Path C ' +
    'interval 0.0066 ± 0.01 and both respect the Rodgers-Tao floor Λ ≥ 0. ' +
    'The analytical kernel-hack Λ ∼ 10⁻¹⁰ is an asymptotic at Platt scale, ' +
    'not a bound at our T_0, so it is not directly comparable. The CSV ' +
    'lower bound from 870 zeros is negative and dominated by Rodgers-Tao.',
};

// Build-time assertions. Each is a pure boolean predicate paired with
// the reason it is load-bearing — tests consume these exactly like the
// budget / bridge / GM tail assertions do.
export const CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'capstone-pathc-compatible',
    holds: () =>
      intervalsIntersect(
        CAPSTONE_CENTRAL,
        CAPSTONE_ERROR,
        PATH_C_CENTRAL,
        PATH_C_ERROR,
      ),
    why:
      'The capstone (imp-304) and Path C (imp-309) compute Λ from the same ' +
      'zero list via different pipelines. Their symmetric error intervals ' +
      'must overlap; otherwise one pipeline is buggy.',
  },
  {
    id: 'path-c-respects-rodgers-tao',
    holds: () => PATH_C_CENTRAL + PATH_C_ERROR >= 0,
    why:
      'Rodgers-Tao 2020 forces Λ ≥ 0. The upper end of the Path C error ' +
      'bar must be non-negative.',
  },
  {
    id: 'capstone-respects-rodgers-tao',
    holds: () => CAPSTONE_CENTRAL + CAPSTONE_ERROR >= 0,
    why:
      'Same Rodgers-Tao floor applied to the capstone estimate.',
  },
  {
    id: 'path-c-under-platt-trudgian',
    holds: () => PATH_C_CENTRAL - PATH_C_ERROR <= 0.2,
    why:
      'Platt-Trudgian Λ ≤ 0.2 is unconditional and global. The lower end ' +
      'of the Path C interval must at least respect this upper bound, or ' +
      'one of them is wrong. (Path C is the expected tighter one.)',
  },
  {
    id: 'csv-lower-is-negative',
    holds: () => CSV_LOWER < 0,
    why:
      'The in-repo CSV lower bound from 870 zeros is expected to be ' +
      'strongly negative (the inverse-square sum over the other zeros ' +
      'dominates). A non-negative value would contradict csv-lambda-lower-bound.js.',
  },
  {
    id: 'error-budget-matches-path-c',
    holds: () =>
      Math.abs(LAMBDA_ERROR_BUDGET.centralValue - PATH_C_CENTRAL) < 1e-9 &&
      Math.abs(LAMBDA_ERROR_BUDGET.reportedError - PATH_C_ERROR) < 1e-9,
    why:
      'The error-budget file and the bridge file must agree on the Path C ' +
      'central value and error bar. A silent edit in one without the other ' +
      'would indicate drift.',
  },
];
