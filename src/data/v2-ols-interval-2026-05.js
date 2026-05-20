/**
 * @module v2-ols-interval-2026-05
 * @fileoverview imp-1137 V2 OLS interval-arithmetic refit -- rigorous error
 * bar on the asymptotic intercept.
 *
 * Proof chain step: S7 (asymptotic Lambda upper bound).
 *
 * Background
 * ----------
 * The PATH_C_BASELINE_FIT_V2 record (src/data/path-c-baseline-fit-v2.js,
 * imp-400) ships an OLS fit y = a + b / N on the imp-360 measured Dyson
 * backward-collision ladder using POINT estimates t_c = midpoint(t_c_lo,
 * t_c_hi). The resulting intercept a is ~0.0066 with a one-sided 95 pct
 * Student-t upper confidence limit; the limit is a heuristic Gaussian error
 * bar that does NOT account for the certified interval widths on the input
 * data. Order-of-magnitude that heuristic is +- 0.01, larger than the
 * central value itself, so the asymptotic claim a < 0.02 is not yet
 * rigorous.
 *
 * What this module ships
 * ----------------------
 * A RIGOROUS interval-arithmetic OLS fit produced by the new Rust binary
 * interval-ols-cli (rust/interval-rk4/src/interval_ols.rs, source-of-truth
 * algorithm). Given input rows { N, t_lo, t_hi }, the fit returns intervals
 * a_interval = [a_lo, a_hi] and b_interval = [b_lo, b_hi] that ENCLOSE
 * every possible OLS solution (a, b) consistent with some point y_k in
 * [t_lo_k, t_hi_k] at every row. The bound is rigorous via inari interval
 * arithmetic with IEEE 1788 directed rounding.
 *
 * Algorithm
 * ---------
 * For x_k = 1/N_k EXACT (integers in f64) and y_k in [t_lo_k, t_hi_k], both
 * a and b are LINEAR functionals of y_k:
 *
 *     b = sum_k w_k_b * y_k    with  w_k_b = (x_k - xbar) / Sxx
 *     a = sum_k w_k_a * y_k    with  w_k_a = 1/n - xbar * w_k_b
 *
 * Each linear combination is evaluated with each y_k appearing EXACTLY
 * ONCE -- the single-occurrence form gives the TIGHTEST possible interval
 * enclosure (no dependency-problem inflation). Grid search over (a, b) is
 * deliberately NOT used because grid search is strictly looser than the
 * closed-form single-occurrence evaluation for this linear problem.
 *
 * Two fits shipped
 * ----------------
 *   1. fitConservative (ACCEPTANCE FIT). The imp-1082 conservative ladder
 *      rows at N in {25k, 50k, 100k} -- all three rows have closed
 *      brackets [t_c_lo, t_c_hi] from imp-360 one-ULP interval RK4
 *      (src/data/imp-360-extended-ladder-N1e6-rows.json). This is the
 *      ticket acceptance fit; the bracket width on a is < 0.05 (ticket
 *      requirement).
 *   2. fitEnriched (TIGHTER FIT using imp-857 measured rows). Adds four
 *      additional closed-bracket rows from imp-857 baseline sweep at
 *      N in {1000, 2000, 5000, 10000}
 *      (src/data/imp-857-baseline-sweep-result.js) for a 7-row fit. The
 *      bracket is tighter because the additional rows add data spread.
 *      Note that the enriched fit pushes the a-interval below zero
 *      (small-N rows have larger t_c values that pull the slope steeper,
 *      forcing the intercept lower) -- this is a HONEST reading of the
 *      data, not a soundness fix.
 *
 * Output schema (per fit)
 * -----------------------
 *   inputRows           : the (N, t_lo, t_hi) rows fed to the CLI
 *   fittedA             : { lo, hi }  -- rigorous a-interval enclosure
 *   fittedB             : { lo, hi }  -- rigorous b-interval enclosure
 *   residualSup         : rigorous sup-bound on |y_k - a - b * x_k| over k
 *   bracketWidthA       : a.hi - a.lo
 *   narrowerThanHeuristic : true iff bracketWidthA < 0.02 (the heuristic
 *                         +- 0.01 V2 fit bracket width)
 *   comparisonToHeuristicCentral : a_central - 0.0066 absolute distance
 *
 * @see imp-1137
 * @see imp-1082
 * @see imp-400 PATH_C_BASELINE_FIT_V2
 * @see rust/interval-rk4/src/interval_ols.rs
 * @see rust/interval-rk4/src/bin/interval-ols-cli.rs
 */

// ── Input ladders ────────────────────────────────────────────────────────────
// Source: src/data/imp-360-extended-ladder-N1e6-rows.json -- the three
// CLOSED rows at N in {25k, 50k, 100k}. Other rows in that file have
// t_c_hi = null (Infinity) because the per-step O(N^2) compute exceeded the
// engine budget; those rows cannot enter the OLS fit until a tighter upper
// bound is produced by the imp-1136 production sweep (sister ticket).
const IMP_1082_CONSERVATIVE_LADDER = [
  { N: 25000,  t_lo: 0.0001, t_hi: 0.0002 },
  { N: 50000,  t_lo: 0.0001, t_hi: 0.0002 },
  { N: 100000, t_lo: 0.0,    t_hi: 0.0001 },
];

// Source: src/data/imp-857-baseline-sweep-result.js -- four closed brackets
// from the baseline backward RK4 sweep at smaller N.
const IMP_857_MEASURED_ROWS = [
  { N: 1000,  t_lo: 0.0033, t_hi: 0.0034 },
  { N: 2000,  t_lo: 0.0011, t_hi: 0.0012 },
  { N: 5000,  t_lo: 0.0002, t_hi: 0.0003 },
  { N: 10000, t_lo: 0.0002, t_hi: 0.0003 },
];

const IMP_857_PLUS_CONSERVATIVE_LADDER = [
  ...IMP_857_MEASURED_ROWS,
  ...IMP_1082_CONSERVATIVE_LADDER,
];

// ── Fit results (computed by the Rust CLI interval-ols-cli on 2026-05-19) ───
// Reproduce via:
//   cd rust/interval-rk4 && cargo build --release --bin interval-ols-cli
//   echo (rows JSON) | ./target/release/interval-ols-cli
//
// The values below are the verbatim JSON output of the CLI, transcribed
// into JS object literals.

// Conservative ladder fit (imp-1082 acceptance):
//   echo (the 3-row JSON) | ./target/release/interval-ols-cli
//
//   { "a_lo": -0.000049999999999999975,
//     "a_hi":  0.00015000000000000004,
//     "b_lo": -0.7142857142857153,
//     "b_hi":  6.428571428571428,
//     "residual_sup": 0.00030714285714285723,
//     "n_rows": 3,
//     "sxx": 4.666666666666668e-10,
//     "xbar": 0.000023333333333333336 }
const FIT_CONSERVATIVE_CLI_OUTPUT = Object.freeze({
  a_lo:         -0.000049999999999999975,
  a_hi:          0.00015000000000000004,
  b_lo:         -0.7142857142857153,
  b_hi:          6.428571428571428,
  residual_sup:  0.00030714285714285723,
  n_rows:        3,
  sxx:           4.666666666666668e-10,
  xbar:          0.000023333333333333336,
});

// Enriched fit (imp-857 measured + imp-1082 conservative):
//   echo (the 7-row JSON) | ./target/release/interval-ols-cli
//
//   { "a_lo": -0.00015472426928690947,
//     "a_hi": -0.00003450639040193656,
//     "b_lo":  3.0948057958631474,
//     "b_hi":  3.3354694008330665,
//     "residual_sup": 0.0005332283100145971,
//     "n_rows": 7,
//     "sxx": 8.025428571428573e-7,
//     "xbar": 0.0002671428571428572 }
const FIT_ENRICHED_CLI_OUTPUT = Object.freeze({
  a_lo:         -0.00015472426928690947,
  a_hi:         -0.00003450639040193656,
  b_lo:          3.0948057958631474,
  b_hi:          3.3354694008330665,
  residual_sup:  0.0005332283100145971,
  n_rows:        7,
  sxx:           8.025428571428573e-7,
  xbar:          0.0002671428571428572,
});

// ── Heuristic comparison constants ──────────────────────────────────────────
// imp-315 / imp-400 heuristic fit: a ~ 0.0066 with Gaussian +- 0.01.
const HEURISTIC_CENTRAL_A = 0.0066;
const HEURISTIC_HALF_BAND = 0.01;
const HEURISTIC_BRACKET_WIDTH = 2 * HEURISTIC_HALF_BAND;

function buildFitRecord(rows, cliOutput, label) {
  const bracketWidthA = cliOutput.a_hi - cliOutput.a_lo;
  const bracketWidthB = cliOutput.b_hi - cliOutput.b_lo;
  const aCentral = 0.5 * (cliOutput.a_lo + cliOutput.a_hi);
  const distanceCentral = Math.abs(aCentral - HEURISTIC_CENTRAL_A);
  return Object.freeze({
    label,
    inputRows: rows,
    fittedA: { lo: cliOutput.a_lo, hi: cliOutput.a_hi },
    fittedB: { lo: cliOutput.b_lo, hi: cliOutput.b_hi },
    residualSup: cliOutput.residual_sup,
    nRows: cliOutput.n_rows,
    sxx: cliOutput.sxx,
    xbar: cliOutput.xbar,
    bracketWidthA,
    bracketWidthB,
    bracketCentralA: aCentral,
    narrowerThanHeuristic: bracketWidthA < HEURISTIC_BRACKET_WIDTH,
    bracketWidthRatioVsHeuristic: bracketWidthA / HEURISTIC_BRACKET_WIDTH,
    comparisonToHeuristicCentral: {
      heuristicCentral: HEURISTIC_CENTRAL_A,
      heuristicHalfBand: HEURISTIC_HALF_BAND,
      rigorousCentral: aCentral,
      absDistance: distanceCentral,
      heuristicEnclosesRigorousInterval:
        cliOutput.a_lo >= HEURISTIC_CENTRAL_A - HEURISTIC_HALF_BAND &&
        cliOutput.a_hi <= HEURISTIC_CENTRAL_A + HEURISTIC_HALF_BAND,
      rigorousIntersectsHeuristicBand:
        cliOutput.a_hi >= HEURISTIC_CENTRAL_A - HEURISTIC_HALF_BAND &&
        cliOutput.a_lo <= HEURISTIC_CENTRAL_A + HEURISTIC_HALF_BAND,
    },
  });
}

const FIT_CONSERVATIVE = buildFitRecord(
  IMP_1082_CONSERVATIVE_LADDER,
  FIT_CONSERVATIVE_CLI_OUTPUT,
  'imp-1082-conservative-3rows',
);

const FIT_ENRICHED = buildFitRecord(
  IMP_857_PLUS_CONSERVATIVE_LADDER,
  FIT_ENRICHED_CLI_OUTPUT,
  'imp-857-plus-imp-1082-7rows',
);

// ── Headline acceptance evaluation ──────────────────────────────────────────
const TICKET_ACCEPTANCE_THRESHOLD_A = 0.05;
const ACCEPTANCE_CONSERVATIVE_BRACKET_OK =
  FIT_CONSERVATIVE.bracketWidthA < TICKET_ACCEPTANCE_THRESHOLD_A;
const ENRICHED_TIGHTER_THAN_CONSERVATIVE =
  FIT_ENRICHED.bracketWidthA < FIT_CONSERVATIVE.bracketWidthA;

// ── Honest sub-gaps ─────────────────────────────────────────────────────────
const SUB_GAPS = Object.freeze([
  Object.freeze({
    id: 'imp-1137-sub-tighter-ols-algorithm',
    parent: 'imp-1137',
    status: 'closed-by-design',
    blocker: false,
    statement:
      'The first version of the interval-OLS might have produced a LOOSE ' +
      'interval (the ticket honest-scope clause: ship as partial with this ' +
      'sub-gap if a_interval width > 0.05). The actual conservative-ladder ' +
      'fit has bracket width ' +
      FIT_CONSERVATIVE.bracketWidthA.toExponential(3) +
      ' which is well below the 0.05 threshold, so this sub-gap closes by ' +
      'design. The single-occurrence linear-projection form (each y_k ' +
      'appears exactly once in each of a and b) gives the TIGHTEST possible ' +
      'interval enclosure for OLS on f(x) = a + b * x with EXACT x_k and ' +
      'INTERVAL y_k; no algorithmic improvement is possible without changing ' +
      'either the input data or the model form.',
  }),
  Object.freeze({
    id: 'imp-1137-sub-imp-1136-measured-rows',
    parent: 'imp-1137',
    status: 'open',
    blocker: false,
    statement:
      'imp-1136 production sweep is shipping new measured rows in ' +
      'src/data/k-plateau-ladder-measured-2026-05.js with the imp-1132 ' +
      'Barnes-Hut backend. Once that file exists with closed brackets at ' +
      'N > 1e5, this module should re-run the CLI on the combined ladder ' +
      '(imp-1082 conservative + imp-857 baseline + imp-1136 measured) to ' +
      'tighten the bracket further. As of 2026-05-19 the imp-1136 measured ' +
      'file does NOT exist in src/data, so the enriched fit uses only the ' +
      'imp-857 closed-bracket rows.',
    consumedBy: 'future re-run of interval-ols-cli',
  }),
]);

// ── Exported record ─────────────────────────────────────────────────────────
export const V2_OLS_INTERVAL = Object.freeze({
  id: 'imp-1137',
  status: 'shipped',
  title:
    'V2 OLS interval-arithmetic refit: rigorous error bar on the asymptotic ' +
    'intercept (single-occurrence closed-form, inari intervals)',
  ticketAcceptance: Object.freeze({
    thresholdA: TICKET_ACCEPTANCE_THRESHOLD_A,
    conservativeBracketWidthA: FIT_CONSERVATIVE.bracketWidthA,
    conservativeBracketWithinThreshold: ACCEPTANCE_CONSERVATIVE_BRACKET_OK,
    enrichedTighterThanConservative: ENRICHED_TIGHTER_THAN_CONSERVATIVE,
    headline:
      'Conservative ladder (3 imp-1082 rows): a in [' +
      FIT_CONSERVATIVE.fittedA.lo.toExponential(3) +
      ', ' +
      FIT_CONSERVATIVE.fittedA.hi.toExponential(3) +
      '] width ' +
      FIT_CONSERVATIVE.bracketWidthA.toExponential(3) +
      ' (acceptance threshold 0.05, narrowness ratio ' +
      (FIT_CONSERVATIVE.bracketWidthA / TICKET_ACCEPTANCE_THRESHOLD_A).toExponential(3) +
      '). Enriched ladder (7 rows imp-857 + imp-1082): a in [' +
      FIT_ENRICHED.fittedA.lo.toExponential(3) +
      ', ' +
      FIT_ENRICHED.fittedA.hi.toExponential(3) +
      '] width ' +
      FIT_ENRICHED.bracketWidthA.toExponential(3) +
      '.',
  }),
  fitConservative: FIT_CONSERVATIVE,
  fitEnriched: FIT_ENRICHED,
  heuristicReference: Object.freeze({
    source: 'src/data/path-c-baseline-fit-v2.js (imp-400 PATH_C_BASELINE_FIT_V2)',
    central: HEURISTIC_CENTRAL_A,
    halfBand: HEURISTIC_HALF_BAND,
    bracketWidth: HEURISTIC_BRACKET_WIDTH,
    note:
      'Heuristic Gaussian error bar from one-sided 95 pct Student-t at df ' +
      '= n - 2 on point estimates (midpoint of input intervals). Does NOT ' +
      'account for input interval widths.',
  }),
  comparisonHeadline:
    'The rigorous interval-arithmetic OLS bracket on a is ' +
    FIT_CONSERVATIVE.bracketWidthA.toExponential(3) +
    ' (conservative 3-row ladder) and ' +
    FIT_ENRICHED.bracketWidthA.toExponential(3) +
    ' (enriched 7-row ladder). The heuristic +- 0.01 V2 fit has bracket ' +
    'width 0.02. Both rigorous brackets are narrower than the heuristic ' +
    'by a factor of ~' +
    Math.round(HEURISTIC_BRACKET_WIDTH / FIT_CONSERVATIVE.bracketWidthA) +
    'x (conservative) and ~' +
    Math.round(HEURISTIC_BRACKET_WIDTH / FIT_ENRICHED.bracketWidthA) +
    'x (enriched). The CONSERVATIVE bracket [' +
    FIT_CONSERVATIVE.fittedA.lo.toExponential(2) +
    ', ' +
    FIT_CONSERVATIVE.fittedA.hi.toExponential(2) +
    '] lies entirely BELOW the heuristic central 0.0066 (rigorous data ' +
    'does not support the heuristic point estimate); both endpoints are ' +
    'within the heuristic +- 0.01 band, so the rigorous result is ' +
    'compatible with but tighter than the heuristic.',
  honestScope: Object.freeze({
    inputDataLimitation:
      'The conservative ladder uses only 3 rows because the imp-360 extended ' +
      'ladder (src/data/imp-360-extended-ladder-N1e6-rows.json) has closed ' +
      'brackets only at N in {25k, 50k, 100k}. Rows at N >= 150k have ' +
      't_c_hi = null (Infinity) because the per-step O(N^2) cost exceeded ' +
      'the engine compute budget. imp-1136 ships the production sweep with ' +
      'imp-1132 Barnes-Hut to close more brackets at larger N.',
    enrichedFitWarning:
      'The enriched fit (with imp-857 baseline rows at small N) produces a ' +
      'NEGATIVE a-interval [' +
      FIT_ENRICHED.fittedA.lo.toExponential(2) +
      ', ' +
      FIT_ENRICHED.fittedA.hi.toExponential(2) +
      ']. This is a rigorous statement about the data: under the 1/N linear ' +
      'model, the asymptotic intercept must be at most ' +
      FIT_ENRICHED.fittedA.hi.toExponential(2) +
      ' (i.e. negative) given the input bracket widths. A negative intercept ' +
      'is consistent with t_c(N) approaching zero as N -> infinity, which ' +
      'in the Lambda picture would correspond to Lambda asymptotic <= 0. ' +
      'However the 1/N linear model is an EXTRAPOLATION and may not capture ' +
      'sub-leading corrections; do not over-interpret the negative intercept ' +
      'as a proof of Lambda <= 0.',
    algorithmTightness:
      'The single-occurrence linear-projection form is the TIGHTEST possible ' +
      'interval enclosure for OLS on EXACT x and INTERVAL y. Any subexpression ' +
      'duplication (e.g. computing ybar and Sxy separately) would inflate the ' +
      'enclosure by the dependency problem. The current implementation has no ' +
      'such inflation.',
    subGaps: SUB_GAPS,
  }),
  sources: [
    'rust/interval-rk4/src/interval_ols.rs (algorithm source-of-truth)',
    'rust/interval-rk4/src/bin/interval-ols-cli.rs (CLI)',
    'src/data/imp-360-extended-ladder-N1e6-rows.json (conservative input)',
    'src/data/imp-857-baseline-sweep-result.js (enriched input)',
    'src/data/path-c-baseline-fit-v2.js (heuristic reference, imp-400)',
  ],
});

// ── Build-time assertions ───────────────────────────────────────────────────
export const V2_OLS_INTERVAL_ASSERTIONS = [
  {
    id: 'imp1137-conservative-bracket-width-below-acceptance-threshold',
    holds: () =>
      FIT_CONSERVATIVE.bracketWidthA < TICKET_ACCEPTANCE_THRESHOLD_A,
    why:
      'Ticket acceptance: at the imp-1082 conservative ladder (3 rows N in ' +
      '{25k, 50k, 100k} all closed brackets), the rigorous interval-OLS ' +
      'intercept a_interval bracket width must be strictly less than 0.05. ' +
      'The current bracket width is ' +
      FIT_CONSERVATIVE.bracketWidthA.toExponential(3) +
      '. A regression in the interval algorithm or in the input ladder rows ' +
      'would surface here.',
  },
  {
    id: 'imp1137-conservative-bracket-encloses-input-row-midpoints',
    holds: () => {
      // Sanity: with EXACT y_k at the midpoints of the input intervals, the
      // scalar OLS solution must lie inside the returned interval. Compute
      // scalar OLS and check enclosure.
      const xs = IMP_1082_CONSERVATIVE_LADDER.map((r) => 1 / r.N);
      const ys = IMP_1082_CONSERVATIVE_LADDER.map((r) => 0.5 * (r.t_lo + r.t_hi));
      const n = xs.length;
      const sx = xs.reduce((s, x) => s + x, 0);
      const sy = ys.reduce((s, y) => s + y, 0);
      const xbar = sx / n;
      const ybar = sy / n;
      const Sxx = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
      const Sxy = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
      const b = Sxy / Sxx;
      const a = ybar - b * xbar;
      return (
        a >= FIT_CONSERVATIVE.fittedA.lo - 1e-10 &&
        a <= FIT_CONSERVATIVE.fittedA.hi + 1e-10 &&
        b >= FIT_CONSERVATIVE.fittedB.lo - 1e-10 &&
        b <= FIT_CONSERVATIVE.fittedB.hi + 1e-10
      );
    },
    why:
      'Enclosure tripwire: the scalar-OLS solution at the midpoint of each ' +
      'input interval must lie inside the rigorous interval enclosure. If ' +
      'it does not, either the CLI output transcribed here is wrong or the ' +
      'algorithm has a bug.',
  },
  {
    id: 'imp1137-bracket-on-a-is-non-degenerate',
    holds: () =>
      FIT_CONSERVATIVE.bracketWidthA > 0 &&
      FIT_ENRICHED.bracketWidthA > 0 &&
      Number.isFinite(FIT_CONSERVATIVE.bracketWidthA) &&
      Number.isFinite(FIT_ENRICHED.bracketWidthA),
    why:
      'Both fitted intervals on a must have strictly positive width (the ' +
      'input y intervals all have width 1e-4, so the output a interval ' +
      'cannot be a point) and finite (a non-finite width would signal an ' +
      'inari overflow or a Sxx near-singular condition).',
  },
  {
    id: 'imp1137-narrower-than-heuristic-flag-true-on-conservative',
    holds: () => FIT_CONSERVATIVE.narrowerThanHeuristic === true,
    why:
      'The conservative rigorous bracket (width ' +
      FIT_CONSERVATIVE.bracketWidthA.toExponential(3) +
      ') must be strictly narrower than the heuristic +- 0.01 V2 fit ' +
      'bracket (width 0.02). A regression that produces a wider bracket ' +
      'would mean the rigorous fit gives no improvement over the heuristic ' +
      'and the ticket value proposition collapses.',
  },
  {
    id: 'imp1137-residual-sup-is-positive-and-bounded',
    holds: () =>
      FIT_CONSERVATIVE.residualSup > 0 &&
      FIT_CONSERVATIVE.residualSup < 1e-2 &&
      FIT_ENRICHED.residualSup > 0 &&
      FIT_ENRICHED.residualSup < 1e-2,
    why:
      'The rigorous residual sup-bound must be positive (input intervals are ' +
      'non-degenerate so any consistent fit has positive residual width) and ' +
      'bounded (below 1e-2 -- larger would mean the linear model is wildly ' +
      'wrong for the input data, which is not the case for the well-fit ' +
      '1/N model on this ladder).',
  },
  {
    id: 'imp1137-enriched-fit-uses-strictly-more-rows',
    holds: () => FIT_ENRICHED.nRows > FIT_CONSERVATIVE.nRows,
    why:
      'The enriched fit must use strictly more input rows than the ' +
      'conservative fit (the enriched fit adds the imp-857 measured rows ' +
      'on top of the imp-1082 conservative ladder).',
  },
  {
    id: 'imp1137-comparison-to-heuristic-central-is-finite',
    holds: () =>
      Number.isFinite(FIT_CONSERVATIVE.comparisonToHeuristicCentral.absDistance) &&
      Number.isFinite(FIT_ENRICHED.comparisonToHeuristicCentral.absDistance),
    why:
      'The reported absolute distance between the rigorous central and the ' +
      'heuristic central must be a finite number. A NaN or Infinity would ' +
      'signal an arithmetic bug in the comparison helper.',
  },
  {
    id: 'imp1137-sources-cite-rust-cli-and-ladder-files',
    holds: () =>
      V2_OLS_INTERVAL.sources.some((s) => s.includes('interval_ols.rs')) &&
      V2_OLS_INTERVAL.sources.some((s) => s.includes('interval-ols-cli')) &&
      V2_OLS_INTERVAL.sources.some((s) => s.includes('imp-360-extended-ladder')) &&
      V2_OLS_INTERVAL.sources.some((s) => s.includes('imp-857-baseline-sweep')),
    why:
      'The sources field must cite the Rust algorithm module, the CLI ' +
      'binary, and the two input ladder files. Dropping any of these would ' +
      'orphan the provenance chain.',
  },
  {
    id: 'imp1137-sub-gaps-include-imp-1136-rerun-hook',
    holds: () =>
      SUB_GAPS.some((g) => g.id === 'imp-1137-sub-imp-1136-measured-rows'),
    why:
      'The sub-gap manifest must include the imp-1136 rerun hook so that ' +
      'when imp-1136 ships measured rows at N > 1e5, a follow-up agent ' +
      'knows to re-run the CLI on the combined ladder.',
  },
];
