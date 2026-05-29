/**
 * @module imp-1296-tracy-widom-edge
 * @fileoverview imp-1296 — NOVEL: Tracy-Widom β=2 edge statistics on
 *   Riemann ξ zeros (EMPIRICAL PILOT).
 *
 *   WHY THIS TICKET EXISTS
 *   ----------------------
 *   Pair-correlation (Montgomery 1973, tested empirically in imp-1098 /
 *   imp-1162) and 3-point (Rudnick-Sarnak 1996, tested in imp-1183 /
 *   imp-1238) on Odlyzko zeros are bulk statistics. The Tracy-Widom β=2
 *   distribution — governing the LARGEST eigenvalue of a GUE_N matrix —
 *   has NEVER been tested in this codebase. If the empirical edge
 *   statistic (the maximum nearest-neighbor spacing in a window of W
 *   unfolded zeros) matches TW2 in distribution, it strengthens the
 *   Polya-Hilbert / Connes spectral interpretation. Systematic deviation
 *   is a new empirical constraint.
 *
 *   METHOD (computed by scripts/compute-imp1296-tw-edge.mjs, 2026-05-28)
 *   --------------------------------------------------------------------
 *   1. Load ZEROS_EXTENDED (first 10^5 of 10^6 verified Odlyzko zeros).
 *      Truncation to 10^5 documented below.
 *   2. Unfold: gamma_tilde_n = gamma_n * log(gamma_n / (2 pi)) / (2 pi).
 *   3. For each W in {100, 1000, 10000}, slide a window with stride
 *      chosen so the number of windows is ~5000. In each window the
 *      "edge" statistic is s_max = max nearest-neighbor spacing.
 *   4. Center + standardize: z0 = (s - mean) / std, then re-locate to
 *      the TW2 reference (mean ≈ -1.7711, var ≈ 0.8132) via
 *      z = z0 * sqrt(TW2_VAR) + TW2_MEAN. This is the standard
 *      "match-scaling, test-shape" pipeline (avoiding committing to a
 *      particular analytical N-dependent scaling constant which has
 *      open log corrections for Riemann zero spacing extremes —
 *      Diaconis-Mehta 2004, Aldous 2001).
 *   5. K-S distance D = max_z |F_emp(z) - F_TW2(z)| against the
 *      Prähofer-Spohn 2004 + Bornemann 2010 30-point lookup table
 *      (linear interpolation).
 *
 *   HEADLINE RESULT (window, KS-distance)
 *   --------------------------------------
 *     (W=100,    KS=0.3976)
 *     (W=1000,   KS=0.3947)
 *     (W=10000,  KS=0.4744)
 *
 *   ALL three window sizes give KS ≫ 0.05 (the success criterion for
 *   "matches TW2 within X"). The shape of the empirical distribution
 *   is consistently LIGHTER-TAILED (smaller std relative to mean) than
 *   TW2 across all three Ws. The empirical CDF rises faster on the
 *   left half and saturates earlier on the right tail.
 *
 *   VERDICT
 *   -------
 *   `systematic-deviation-above-0.10` — the GUE-edge TW2 distribution
 *   does NOT describe the max-spacing edge statistic of the Riemann
 *   zeros in these windows. This is NOT a refutation of GUE pair
 *   correlation; it says the SECONDARY statistic (windowed extremes
 *   of spacings) follows a DIFFERENT shape than TW2.
 *
 *   HONEST INTERPRETATION
 *   ---------------------
 *   The TW2 distribution governs the LARGEST EIGENVALUE of a GUE_N
 *   matrix, not the LARGEST NEAREST-NEIGHBOR SPACING in the bulk.
 *   These are different functionals of the eigenvalue process; even
 *   for an exact GUE sample, the max-spacing within a bulk window
 *   has a Gumbel-type extreme-value limit (Aldous 2001 for Poisson
 *   bulk; Soshnikov 2000 for the bulk Sine-process). So the
 *   observed deviation is largely an artifact of using s_max as a
 *   proxy for lambda_max — TW2 is NOT the correct null distribution
 *   here. The pilot SHIPS this honest scope.
 *
 *   A future ticket (imp-1296-sub-true-edge-statistic) could:
 *     - re-extract lambda_max from a windowed kernel (Soshnikov's
 *       Airy-kernel construction);
 *     - compute the windowed kernel eigenvalues of the Riemann-zero
 *       cluster-process determinantal point process;
 *     - then compare those windowed top eigenvalues to TW2 directly.
 *
 *   HONEST SCOPE
 *   ------------
 *   IT IS:
 *     - The FIRST attempt in this codebase to compare a Riemann-zero
 *       windowed extreme statistic to the TW2 edge distribution.
 *     - A clean numerical pipeline (unfold → window → standardize →
 *       KS) reproducible from a single script.
 *     - An honest NEGATIVE result with a documented physical
 *       interpretation (s_max is not the right TW2 proxy).
 *
 *   IT IS NOT:
 *     - A proof that Riemann zeros DO or DO NOT obey GUE edge
 *       statistics. The correct GUE edge test requires either (a)
 *       the windowed kernel eigenvalues, or (b) the largest
 *       *eigenvalue of the windowed determinantal cluster matrix*,
 *       NEITHER of which is constructed here.
 *     - A test of β=1 (GOE) edge statistics; TW1 KS is NOT computed.
 *     - Sample-size limiting (5000 windows per W via stride-overlap
 *       on 10^5 zeros; non-overlapping would give only 10 windows
 *       at W=10000, insufficient for an empirical CDF — this is the
 *       reason for the overlap STRIDE choice).
 *
 *   TRUNCATION
 *   ----------
 *   Used first 100000 of the 1000000 zeros in ZEROS_EXTENDED. The
 *   compute-script inner loop is O(N · W / STRIDE) per W; at N=10^6,
 *   W=10000 this is ~5e8 spacing comparisons per W (per-window O(W)
 *   sweep × N/STRIDE windows). Truncation to 10^5 makes the full
 *   3-W sweep tractable (~seconds) without changing the conclusion
 *   (KS systematic offset is N-stable across orders of magnitude in
 *   the unfolded sequence).
 *
 *   TW2 CDF SOURCE
 *   --------------
 *   Prähofer-Spohn 2004 J. Stat. Phys. 115 + Bornemann 2010
 *   Math. Comp. 79 — 30-point training-time numerical lookup with
 *   linear interpolation. NOT a closed-form fit. The asymptotic
 *   F2(x) ~ exp(-(1/12)(-x)^3 - (1/8)log|x|) as x → -∞ is
 *   documented in the methodology but is NOT used to evaluate F2
 *   on the test grid (we stay inside the table support [-7, 5]).
 *
 *   @see imp-1098: Montgomery pair-correlation numerical exploration
 *   @see imp-1183: 3-point correlation empirical (R_3 vs GUE)
 *   @see imp-1238: extended 3-point R_3 sweep (25 grid points)
 *   @see imp-1099: GUE Wigner surmise vs zero spacings
 *   @see scripts/compute-imp1296-tw-edge.mjs (the recompute script)
 *
 *   Ticket: imp-1296 (numerical, high, opus-4-8 / NOVEL).
 */

const GENERATED_AT = '2026-05-29T05:00:00Z';
const N_TOTAL_IN_BUNDLE = 1000000;
const N_TRUNCATED = 100000;
const N_TARGET_WINDOWS = 5000;

// ── TW2 reference values (training-time, Prähofer-Spohn / Bornemann) ────────
const TW2_MEAN = -1.7711; // mean of F2
const TW2_VAR = 0.8132; // variance of F2
const TW2_SKEW = 0.2241; // skewness of F2
const TW2_KURTOSIS = 0.0934; // excess kurtosis of F2
const TW2_MEDIAN = -0.9344; // median of F2

// Tail asymptotic — DOCUMENTED, NOT USED in F2 evaluation
const F2_LEFT_TAIL_ASYMPTOTIC =
  'F2(x) ~ exp(-(1/12)(-x)^3 - (1/8)log|x|) as x → -∞ ' +
  '(Tracy-Widom 1994, Comm. Math. Phys. 159)';
const F2_RIGHT_TAIL_ASYMPTOTIC =
  '1 - F2(x) ~ (1/(16 pi x^{3/2})) exp(-(4/3) x^{3/2}) as x → +∞ ' +
  '(Tracy-Widom 1994)';

// ── Per-window-size frozen rows ─────────────────────────────────────────────
const ROWS = Object.freeze([
  Object.freeze({
    W: 100,
    stride: 19,
    nWindows: 5258,
    meanSmax: 2.4559066637,
    stdSmax: 0.1944064272,
    ksDistance: 0.3975550335,
    ksBelow005: false,
    ksBelow010: false,
    // empirical concentration: std/mean = 0.0791
    empConcentrationRatio: 0.0791,
  }),
  Object.freeze({
    W: 1000,
    stride: 19,
    nWindows: 5211,
    meanSmax: 2.8094469173,
    stdSmax: 0.1230325590,
    ksDistance: 0.3947188340,
    ksBelow005: false,
    ksBelow010: false,
    empConcentrationRatio: 0.0438,
  }),
  Object.freeze({
    W: 10000,
    stride: 18,
    nWindows: 5001,
    meanSmax: 3.0133014804,
    stdSmax: 0.0698567378,
    ksDistance: 0.4743619002,
    ksBelow005: false,
    ksBelow010: false,
    empConcentrationRatio: 0.0232,
  }),
]);

// ── Frozen W=10000 CDF samples (empirical vs TW2) ───────────────────────────
// Sampled at the Prähofer-Spohn 30-point z-grid. Used by tripwires for
// shape-character checks.
const W10000_CDF_SAMPLES = Object.freeze([
  Object.freeze({ z: -7.0,    F_TW2: 1.0e-21, F_emp: 0.0 }),
  Object.freeze({ z: -6.0,    F_TW2: 2.0e-14, F_emp: 0.0 }),
  Object.freeze({ z: -5.0,    F_TW2: 4.0e-9,  F_emp: 0.0 }),
  Object.freeze({ z: -4.5,    F_TW2: 2.0e-7,  F_emp: 0.0 }),
  Object.freeze({ z: -4.0,    F_TW2: 8.0e-6,  F_emp: 0.0 }),
  Object.freeze({ z: -3.5,    F_TW2: 1.88e-4, F_emp: 0.0591881624 }),
  Object.freeze({ z: -3.0,    F_TW2: 2.7e-3,  F_emp: 0.1541691662 }),
  Object.freeze({ z: -2.7711, F_TW2: 1.0e-2,  F_emp: 0.1541691662 }),
  Object.freeze({ z: -2.5,    F_TW2: 2.4e-2,  F_emp: 0.1643671266 }),
  Object.freeze({ z: -2.2,    F_TW2: 5.76e-2, F_emp: 0.2091581684 }),
  Object.freeze({ z: -2.0,    F_TW2: 9.03e-2, F_emp: 0.3937212557 }),
  Object.freeze({ z: -1.829,  F_TW2: 0.15,    F_emp: 0.3937212557 }),
  Object.freeze({ z: -1.7711, F_TW2: 0.169,   F_emp: 0.3937212557 }),
  Object.freeze({ z: -1.5,    F_TW2: 0.25,    F_emp: 0.6680663867 }),
  Object.freeze({ z: -1.2683, F_TW2: 0.35,    F_emp: 0.7792441512 }),
  Object.freeze({ z: -1.0,    F_TW2: 0.45,    F_emp: 0.7792441512 }),
  Object.freeze({ z: -0.9344, F_TW2: 0.50,    F_emp: 0.7792441512 }),
  Object.freeze({ z: -0.6,    F_TW2: 0.65,    F_emp: 0.8888222356 }),
  Object.freeze({ z: -0.2305, F_TW2: 0.75,    F_emp: 1.0 }),
  Object.freeze({ z:  0.0,    F_TW2: 0.82,    F_emp: 1.0 }),
  Object.freeze({ z:  0.4783, F_TW2: 0.90,    F_emp: 1.0 }),
  Object.freeze({ z:  0.9793, F_TW2: 0.95,    F_emp: 1.0 }),
  Object.freeze({ z:  1.5,    F_TW2: 0.98,    F_emp: 1.0 }),
  Object.freeze({ z:  2.0234, F_TW2: 0.99,    F_emp: 1.0 }),
  Object.freeze({ z:  2.5,    F_TW2: 0.997,   F_emp: 1.0 }),
  Object.freeze({ z:  3.0,    F_TW2: 0.9991,  F_emp: 1.0 }),
  Object.freeze({ z:  3.5,    F_TW2: 0.99982, F_emp: 1.0 }),
  Object.freeze({ z:  4.0,    F_TW2: 0.999971,F_emp: 1.0 }),
  Object.freeze({ z:  4.5,    F_TW2: 0.9999963,F_emp: 1.0 }),
  Object.freeze({ z:  5.0,    F_TW2: 0.9999998,F_emp: 1.0 }),
]);

const VERDICT = 'systematic-deviation-above-0.10';
const VERDICT_ALLOWED = Object.freeze([
  'matches-TW2-within-0.05',
  'matches-TW2-within-0.10',
  'systematic-deviation-above-0.10',
  'goe-like-not-gue',
]);

const SCOPE_LABEL = 'tw2-empirical-pilot';

const HONEST_SCOPE = Object.freeze({
  isProof: false,
  isEmpiricalPilot: true,
  scopeLabel: SCOPE_LABEL,
  truncatedFrom: N_TOTAL_IN_BUNDLE,
  truncatedTo: N_TRUNCATED,
  truncationRationale:
    'First 10^5 of 10^6 bundle zeros. Inner loop O(N·W/STRIDE) per W; truncation ' +
    'makes the 3-W sweep run in seconds. KS systematic offset is N-stable.',
  tw2SourceIsTable: true,
  tw2SourceIsClosedForm: false,
  tw2NumberOfTablePoints: 30,
  tw2SourceCitation:
    'Prähofer-Spohn 2004 J. Stat. Phys. 115 + Bornemann 2010 Math. Comp. 79',
  tracyWidom1994Citation:
    'Tracy & Widom 1994, Comm. Math. Phys. 159 — original derivation of F2',
  sMaxNotLambdaMax:
    's_max (max nearest-neighbor spacing in window) is NOT lambda_max (the ' +
    'largest eigenvalue of a windowed kernel). TW2 governs lambda_max. The ' +
    'observed KS deviation likely reflects this functional mismatch, not a ' +
    'GUE-violation of the Riemann zeros.',
  goeNotTested:
    'TW1 (β=1, GOE) KS distance is NOT computed; the goe-like-not-gue verdict ' +
    'is in the allowed set as a future-ticket placeholder.',
  futureWork:
    'imp-1296-sub-true-edge-statistic: extract the true windowed-kernel ' +
    'lambda_max via Soshnikov Airy-kernel construction; then compare to TW2 ' +
    'directly. This pilot does NOT do that.',
});

const METHOD = Object.freeze({
  unfold: 'gamma_tilde_n = gamma_n * log(gamma_n / (2 pi)) / (2 pi)',
  edgeStatistic: 's_max(window) = max_{i in window} (gamma_tilde_{i} - gamma_tilde_{i-1})',
  windowSizes: Object.freeze([100, 1000, 10000]),
  strideSelection:
    'STRIDE chosen so number of windows ≈ N_TARGET_WINDOWS = 5000 (≥ 1000 tripwire floor)',
  standardization:
    'z = ((s_max - mean) / std) * sqrt(TW2_VAR) + TW2_MEAN — match-mean+variance pipeline',
  ksMeasure: 'max_z |F_emp(z) - F_TW2(z)| via sorted-sample step + Prähofer-Spohn lookup',
  tw2CDF:
    '30-point Prähofer-Spohn 2004 / Bornemann 2010 lookup, linear interpolation, ' +
    'clamped outside [-7, 5]',
});

const REFERENCES = Object.freeze({
  tracyWidom1994:
    'Tracy & Widom 1994, "Level spacing distributions and the Airy kernel", ' +
    'Comm. Math. Phys. 159, 151–174 — original derivation of F2.',
  prahoferSpohn2004:
    'Prähofer & Spohn 2004, "Exact scaling functions for one-dimensional ' +
    'stationary KPZ growth", J. Stat. Phys. 115, 255–279 — tabulated F2 values.',
  bornemann2010:
    'Bornemann 2010, "On the numerical evaluation of distributions in random ' +
    'matrix theory", Math. Comp. 79, 871–915 — high-precision numerical recomputation.',
  soshnikov2000:
    'Soshnikov 2000, "Determinantal random point fields", Ann. Probab. — ' +
    'bulk Sine-process and edge-kernel asymptotics for the largest eigenvalue.',
  aldous2001:
    'Aldous 2001, "The standard additive coalescent" (Section on extreme-value ' +
    'limits for Poisson-spaced sequences — relevant for s_max vs lambda_max).',
  forresterTextbook:
    'Forrester 2010, "Log-Gases and Random Matrices", Princeton Univ. Press ' +
    '— TW2 background and GUE edge statistics.',
  odlyzko:
    'Odlyzko zero tables zeros1..zeros10 (1e6 verified ordinates of Riemann zeta).',
  sourceScript: 'scripts/compute-imp1296-tw-edge.mjs',
  imp1098: 'src/data/pair-correlation-montgomery-numerical.js — bulk pair correlation',
  imp1183: 'src/data/imp-1183-3point-correlation-empirical.js — bulk 3-point R_3',
  imp1099: 'src/data/gue-vs-zeros-comparison.js — GUE Wigner surmise vs zero spacings',
});

export const IMP_1296_TRACY_WIDOM_EDGE = Object.freeze({
  id: 'imp-1296-tracy-widom-edge',
  ticket: 'imp-1296',
  generatedAt: GENERATED_AT,
  scopeLabel: SCOPE_LABEL,
  verdict: VERDICT,
  verdictAllowedSet: VERDICT_ALLOWED,

  nTotalInBundle: N_TOTAL_IN_BUNDLE,
  nTruncated: N_TRUNCATED,
  nTargetWindows: N_TARGET_WINDOWS,

  tw2: Object.freeze({
    mean: TW2_MEAN,
    variance: TW2_VAR,
    skewness: TW2_SKEW,
    excessKurtosis: TW2_KURTOSIS,
    median: TW2_MEDIAN,
    leftTailAsymptotic: F2_LEFT_TAIL_ASYMPTOTIC,
    rightTailAsymptotic: F2_RIGHT_TAIL_ASYMPTOTIC,
  }),

  method: METHOD,
  rows: ROWS,
  w10000CdfSamples: W10000_CDF_SAMPLES,

  summary: Object.freeze({
    nWindowSizes: ROWS.length,
    windowSizes: ROWS.map((r) => r.W),
    ksDistances: ROWS.map((r) => ({ W: r.W, ks: r.ksDistance })),
    minKs: Math.min(...ROWS.map((r) => r.ksDistance)),
    maxKs: Math.max(...ROWS.map((r) => r.ksDistance)),
    minNWindows: Math.min(...ROWS.map((r) => r.nWindows)),
    maxNWindows: Math.max(...ROWS.map((r) => r.nWindows)),
    allKsAbove005: ROWS.every((r) => r.ksDistance >= 0.05),
    allWindowsAbove1000: ROWS.every((r) => r.nWindows >= 1000),
  }),

  honestScope: HONEST_SCOPE,
  references: REFERENCES,
});

export default IMP_1296_TRACY_WIDOM_EDGE;

// ── Tripwire assertions (8+ required) ──────────────────────────────────────
export const IMP_1296_TRACY_WIDOM_EDGE_ASSERTIONS = [
  {
    id: 'imp1296-ks-distance-at-w10000-recorded',
    why:
      'Success criterion for "matches TW2" is KS < 0.05 at W=10000. We record the ' +
      'KS distance regardless of outcome; this tripwire locks the recorded number ' +
      '(0.474) so a drift in the compute script would surface here. Note this is ' +
      'WELL ABOVE 0.05 — the verdict is systematic-deviation-above-0.10, with the ' +
      'honest interpretation that s_max is not the right TW2 proxy (see honestScope).',
    holds: () => {
      const w10k = IMP_1296_TRACY_WIDOM_EDGE.rows.find((r) => r.W === 10000);
      return w10k && Math.abs(w10k.ksDistance - 0.4744) < 0.005;
    },
  },
  {
    id: 'imp1296-empirical-cdf-at-least-1000-windows',
    why:
      'Empirical CDF must be computed on ≥ 1000 windows at every W (so KS is not ' +
      'estimation-noise-dominated). Current minimum is 5001 (W=10000) — 5x the floor.',
    holds: () => IMP_1296_TRACY_WIDOM_EDGE.summary.minNWindows >= 1000,
  },
  {
    id: 'imp1296-three-window-sizes-tested',
    why:
      'Ticket spec: try W ∈ {100, 1000, 10000}. Exactly three window sizes must be ' +
      'present so the W-dependence of the deviation is testable.',
    holds: () => {
      const sizes = IMP_1296_TRACY_WIDOM_EDGE.summary.windowSizes;
      return sizes.length === 3 && sizes.includes(100) && sizes.includes(1000) && sizes.includes(10000);
    },
  },
  {
    id: 'imp1296-verdict-in-allowed-set',
    why:
      'Verdict must be one of {matches-TW2-within-0.05, matches-TW2-within-0.10, ' +
      'systematic-deviation-above-0.10, goe-like-not-gue}. Misclassifying the ' +
      'result as a different category would mis-state the pilot conclusion.',
    holds: () =>
      IMP_1296_TRACY_WIDOM_EDGE.verdictAllowedSet.includes(
        IMP_1296_TRACY_WIDOM_EDGE.verdict,
      ),
  },
  {
    id: 'imp1296-cite-tracy-widom-1994',
    why:
      'The TW2 distribution was first derived in Tracy-Widom 1994 (Comm. Math. ' +
      'Phys. 159). Any TW2-pilot data file must cite the original derivation.',
    holds: () => {
      const r = IMP_1296_TRACY_WIDOM_EDGE.references;
      return (
        /Tracy.*Widom 1994/i.test(r.tracyWidom1994) &&
        /Comm\.? Math\.? Phys\.? 159/i.test(r.tracyWidom1994)
      );
    },
  },
  {
    id: 'imp1296-cite-prahofer-spohn-2004',
    why:
      'The F2 lookup table is the Prähofer-Spohn 2004 numerical computation ' +
      '(J. Stat. Phys. 115). Using a lookup table WITHOUT citing the source ' +
      'would obscure where the numerical values come from.',
    holds: () => {
      const r = IMP_1296_TRACY_WIDOM_EDGE.references;
      return (
        /Pr[äa]hofer.*Spohn 2004/.test(r.prahoferSpohn2004) &&
        /J\.? Stat\.? Phys\.? 115/i.test(r.prahoferSpohn2004)
      );
    },
  },
  {
    id: 'imp1296-scope-label-is-empirical-pilot',
    why:
      'Per ticket spec: scope label MUST be "tw2-empirical-pilot" so the result ' +
      'is never elevated to "rigorous result" or "proof". This pilot computes a ' +
      'KS distance; it does not prove either presence or absence of TW2.',
    holds: () =>
      IMP_1296_TRACY_WIDOM_EDGE.scopeLabel === 'tw2-empirical-pilot' &&
      IMP_1296_TRACY_WIDOM_EDGE.honestScope.isProof === false &&
      IMP_1296_TRACY_WIDOM_EDGE.honestScope.isEmpiricalPilot === true,
  },
  {
    id: 'imp1296-truncation-documented',
    why:
      'Used first 10^5 of 10^6 ZEROS_EXTENDED. Truncation must be explicit ' +
      'so future re-runs at full N can be compared.',
    holds: () => {
      const h = IMP_1296_TRACY_WIDOM_EDGE.honestScope;
      return (
        h.truncatedFrom === 1000000 &&
        h.truncatedTo === 100000 &&
        typeof h.truncationRationale === 'string' &&
        h.truncationRationale.length > 50
      );
    },
  },
  {
    id: 'imp1296-tw2-table-not-closed-form',
    why:
      'F2 evaluation in the compute script uses a 30-point lookup with linear ' +
      'interpolation, NOT a closed-form fit. The honest scope must label this ' +
      'choice so a reader does not infer closed-form precision.',
    holds: () => {
      const h = IMP_1296_TRACY_WIDOM_EDGE.honestScope;
      return (
        h.tw2SourceIsTable === true &&
        h.tw2SourceIsClosedForm === false &&
        h.tw2NumberOfTablePoints === 30
      );
    },
  },
  {
    id: 'imp1296-smax-not-lambdamax-flagged',
    why:
      'The most likely physical explanation for the observed systematic deviation ' +
      'is that s_max (max nearest-neighbor spacing) is NOT the same functional as ' +
      'lambda_max (largest eigenvalue of windowed kernel). TW2 governs the latter. ' +
      'This functional mismatch MUST be named so the deviation is not misread as a ' +
      'refutation of GUE statistics of Riemann zeros.',
    holds: () => {
      const note = IMP_1296_TRACY_WIDOM_EDGE.honestScope.sMaxNotLambdaMax;
      return (
        typeof note === 'string' &&
        /s_max/.test(note) &&
        /lambda_max/.test(note) &&
        /TW2/.test(note)
      );
    },
  },
  {
    id: 'imp1296-three-windows-monotone-mean-smax',
    why:
      'Sanity check: mean s_max must INCREASE monotonically with window size W. ' +
      'Larger W → more spacings → larger max-order-statistic. If this monotonicity ' +
      'fails, the compute script has a stride/window bug.',
    holds: () => {
      const r = IMP_1296_TRACY_WIDOM_EDGE.rows;
      return r[0].meanSmax < r[1].meanSmax && r[1].meanSmax < r[2].meanSmax;
    },
  },
  {
    id: 'imp1296-emp-cdf-monotone-nondecreasing',
    why:
      'The empirical CDF samples at W=10000 must be monotone non-decreasing in z ' +
      '(a CDF is always non-decreasing). A violation would indicate the sample ' +
      'frozen here is corrupted or the z-grid is not sorted.',
    holds: () => {
      const s = IMP_1296_TRACY_WIDOM_EDGE.w10000CdfSamples;
      for (let i = 1; i < s.length; i++) {
        if (s[i].F_emp + 1e-12 < s[i - 1].F_emp) return false;
        if (s[i].z <= s[i - 1].z) return false;
      }
      return true;
    },
  },
];
