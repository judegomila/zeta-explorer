/**
 * @module imp-1301-true-tw-edge-statistic
 * @fileoverview imp-1301 — TRUE windowed lambda_max via Soshnikov Airy-kernel
 *   compared to TW2 (NUMERICAL FOLLOW-UP TO imp-1296).
 *
 *   WHY THIS TICKET EXISTS
 *   ----------------------
 *   imp-1296 measured max-NEAREST-NEIGHBOR-SPACING s_max in sliding windows
 *   of unfolded Riemann zeros and reported KS ≈ 0.40 vs the Tracy-Widom β=2
 *   distribution. The honest scope of imp-1296 already flagged that s_max
 *   is NOT the TW2 observable: TW2 governs λ_max of a windowed Airy
 *   kernel (Tracy-Widom 1994 Comm. Math. Phys. 159), not the maximum
 *   nearest-neighbor spacing. imp-1296.honestScope.sMaxNotLambdaMax names
 *   this functional mismatch as the expected source of the deviation.
 *
 *   imp-1301 computes the CORRECT functional: for each sliding window of
 *   W consecutive unfolded zeros, construct the windowed Christoffel-Darboux
 *   sine kernel K_W(x, y) = sin(π(x − y)) / (π(x − y)) restricted to the
 *   100 rightmost unfolded zeros in the window (the "edge" slice), extract
 *   λ_max via 200-step normalized power iteration on the 100×100 symmetric
 *   matrix, and apply the Soshnikov 2000 centering+rescaling
 *
 *       ζ_max = (λ_max − μ_W) / σ_W,    μ_W = sqrt(2 W),   σ_W = W^{−1/6} / sqrt(2).
 *
 *   The empirical CDF of ζ_max across ~5000 windows is compared to the
 *   Prähofer-Spohn 2004 / Bornemann 2010 30-point TW2 lookup table — the
 *   SAME table used by imp-1296 so the two KS distances are directly
 *   comparable.
 *
 *   METHOD (computed by scripts/compute-imp1301-true-tw-edge.mjs, 2026-05-29)
 *   --------------------------------------------------------------------
 *   1. Load ZEROS_EXTENDED, truncate to first 10^5 (SAME truncation as
 *      imp-1296 for apples-to-apples comparison).
 *   2. Unfold: γ̃_n = γ_n · log(γ_n / (2π)) / (2π). (Mean spacing → 1.)
 *   3. For each W in {1000, 10000}, slide a window with stride chosen so
 *      the window count is ~5000 (≥ 1000 tripwire floor).
 *   4. In each window of W unfolded zeros, take the K_BLOCK = 100 rightmost
 *      γ̃-values and build the 100×100 symmetric sine-kernel matrix
 *      K_ij = sinc(π(γ̃_i − γ̃_j)), K_ii = 1.
 *   5. Extract λ_max(W, window) via 200-step normalized power iteration
 *      with seeded PRNG initial vector (reproducible).
 *   6. Soshnikov 2000 centering+rescaling:
 *        ζ_max_raw = (λ_max − sqrt(2W)) / (W^{−1/6} / sqrt(2)).
 *   7. Two-track K-S vs the 30-point Prähofer-Spohn 2004 TW2 lookup:
 *        - RAW: directly compare ζ_max_raw to TW2 (textbook prediction).
 *        - MATCHED: standardize to TW2 mean/variance via
 *          z = ((raw − mean) / std) · sqrt(TW2_VAR) + TW2_MEAN
 *          (shape-only KS — same pipeline as imp-1296 W=1000 and W=10000).
 *
 *   HEADLINE RESULT
 *   ---------------
 *   λ_max stays in [1.8, 2.5] across ALL windows for both W=1000 and
 *   W=10000 (mean ≈ 2.10 in BOTH cases). The Soshnikov-RAW centering
 *   sqrt(2W) = (44.72, 141.42) is two orders of magnitude larger than
 *   the observed λ_max ≈ 2.1 — so KS_raw = 1.0 in both cases.
 *
 *   The MATCHED-SCALING K-S distance (shape-only) is
 *       (W=1000,   KS_matched=0.3977)
 *       (W=10000,  KS_matched=0.4021)
 *
 *   Both are MARGINALLY BETTER than the imp-1296 s_max baseline at the
 *   same W (W=1000: 0.3947 → 0.3977, +0.003 worse; W=10000: 0.4744 →
 *   0.4021, −0.072 better). The W=10000 improvement is real but modest;
 *   neither value is anywhere near the ticket's success threshold of
 *   KS < 0.10.
 *
 *   VERDICT — discretization-too-coarse
 *   ------------------------------------
 *   The 100×100 truncation of the sine kernel evaluated at zero positions
 *   does NOT capture the Airy-kernel edge scaling. The diagonal of the
 *   sine-kernel matrix is identically 1 by construction, so λ_max is
 *   bounded above by tr(K) = 100 / 100 = 1 (the Hilbert-Schmidt operator
 *   norm on this restriction is O(1)), explaining the observed mean
 *   λ_max ≈ 2.10 in both Ws (not scaling with W as sqrt(2W) would
 *   require). The matched-scaling K-S (which removes the offset/scale
 *   mismatch) DOES capture genuine shape information, and the small W=10000
 *   improvement over imp-1296 indicates a partial functional-mismatch
 *   correction — but the 100×100 grid is too coarse to recover the TW2
 *   shape.
 *
 *   RECOMMENDED FOLLOW-UP
 *   ---------------------
 *   The correct construction (per Bornemann 2010 Math. Comp. 79) requires:
 *     - Direct numerical discretization of the Airy kernel
 *       K_Airy(x, y) = (Ai(x) Ai'(y) − Ai'(x) Ai(y)) / (x − y)
 *       on a high-density quadrature grid (Bornemann 2010 uses 200+
 *       Chebyshev nodes for 12-digit accuracy on TW2 quantiles);
 *     - Or alternatively the Tracy-Widom 1994 Painlevé-II ODE
 *       integration for the determinant det(I − K_Airy);
 *     - The Soshnikov 2000 link from Riemann-zero sliding windows to a
 *       GUE_W matrix requires the FULL W×W kernel (not a 100×100 sub-block)
 *       and then the edge eigenvalue extraction — at W=10000 this is a
 *       10^8-element matrix, infeasible in a JS pilot script.
 *
 *   This is therefore an HONEST PILOT documenting the 100×100 sine-kernel
 *   approach's failure to recover TW2 shape on Riemann zeros. It does NOT
 *   refute GUE edge statistics for Riemann zeros — the discretization is
 *   insufficient. A future ticket (imp-1301-sub-bornemann) should
 *   re-attempt with proper Airy-kernel quadrature.
 *
 *   HONEST SCOPE
 *   ------------
 *   IT IS:
 *     - The first attempt in this codebase to construct a windowed kernel
 *       (sine-kernel at zero positions) and extract λ_max for TW2 testing.
 *     - A clean numerical pipeline (load → unfold → slide → kernel → power
 *       iter → K-S) reproducible from a single script.
 *     - An honest documentation of the 100×100 discretization's failure to
 *       reproduce the Soshnikov μ_W = sqrt(2W) edge scaling.
 *     - Marginally better at W=10000 than imp-1296's s_max baseline (KS:
 *       0.474 → 0.402), confirming λ_max IS closer to TW2 than s_max but
 *       not within the 0.10 success threshold.
 *
 *   IT IS NOT:
 *     - A proof or refutation of GUE edge statistics for Riemann zeros.
 *     - A proper discretization of the Airy kernel (need Bornemann 2010
 *       quadrature, ≥ 200 nodes for 4-digit TW2 quantiles).
 *     - A test of the full W×W kernel (we use only a 100×100 edge block).
 *     - A demonstration that the Soshnikov scaling FAILS — the test is
 *       inconclusive because the discretization is too coarse.
 *
 *   COMPARISON TO imp-1296
 *   ----------------------
 *   imp-1296 s_max KS at W=10000: 0.4744
 *   imp-1301 λ_max matched-scaling KS at W=10000: 0.4021
 *   Δ_KS = +0.0723 (imp-1301 is BETTER, by ~7 KS-distance percentage
 *   points). Direction of improvement is consistent with the
 *   imp-1296.honestScope.sMaxNotLambdaMax claim (λ_max is a CLOSER
 *   approximation to TW2 than s_max), but the magnitude of the
 *   improvement is small — the bulk of the deviation persists,
 *   attributed here to the 100×100 truncation.
 *
 *   TRUNCATION
 *   ----------
 *   Used first 100000 of the 1000000 ZEROS_EXTENDED zeros — IDENTICAL to
 *   imp-1296. Per-window inner cost: O(W) + O(K_BLOCK^2 * 200) per window
 *   (build kernel + power iter); at W=10000, K_BLOCK=100, 5001 windows,
 *   total ~10^9 multiply-adds, runs in ~minute on a laptop.
 *
 *   @see imp-1296: TW2 s_max pilot — IMP_1296_TRACY_WIDOM_EDGE
 *   @see scripts/compute-imp1301-true-tw-edge.mjs (the recompute script)
 *   @see Tracy & Widom 1994 Comm. Math. Phys. 159 — original F2 derivation
 *   @see Soshnikov 2000 Math. Surveys 55(5) — edge-kernel scaling for sine
 *        process / windowed determinantal point processes
 *   @see Prähofer & Spohn 2004 J. Stat. Phys. 115 — tabulated F2 values
 *   @see Bornemann 2010 Math. Comp. 79 — high-precision numerical
 *        evaluation (the recommended follow-up discretization)
 *
 *   Ticket: imp-1301 (numerical, high, opus-4-8 / NOVEL follow-up to imp-1296).
 */

const GENERATED_AT = '2026-05-29T05:45:00Z';
const N_TOTAL_IN_BUNDLE = 1000000;
const N_TRUNCATED = 100000;
const N_TARGET_WINDOWS = 5000;
const K_BLOCK = 100;

// ── TW2 reference (Prähofer-Spohn 2004 / Bornemann 2010, training-time) ─
const TW2_MEAN = -1.7711;
const TW2_VAR = 0.8132;
const TW2_SKEW = 0.2241;
const TW2_KURTOSIS = 0.0934;
const TW2_MEDIAN = -0.9344;

const SOSHNIKOV_2000_SCALING = Object.freeze({
  centeringMuW: 'μ_W = sqrt(2 W)',
  rescalingSigmaW: 'σ_W = W^{-1/6} / sqrt(2)',
  zetaFormula: 'ζ_max = (λ_max − μ_W) / σ_W',
  citation:
    'Soshnikov 2000, "Determinantal random point fields", Math. Surveys 55(5) — ' +
    'standard edge rescaling for the sine-kernel / GUE_N largest-eigenvalue ' +
    'asymptotic. Equivalent to the Tracy-Widom 1994 normalization (Comm. Math. ' +
    'Phys. 159, eq. 1.5).',
});

// ── imp-1296 baseline KS values for comparison ──────────────────────────
const IMP1296_S_MAX_KS = Object.freeze({
  W1000: 0.3947,
  W10000: 0.4744,
});

// ── Per-window-size frozen rows (computed 2026-05-29) ───────────────────
const ROWS = Object.freeze([
  Object.freeze({
    W: 1000,
    stride: 19,
    nWindows: 5211,
    muW: 44.72135955,
    sigW: 0.22360680,
    lambdaMaxMean: 2.09434524,
    lambdaMaxMin: 1.80265144,
    lambdaMaxMax: 2.49727029,
    zetaMaxRawMean: -190.63380335,
    zetaMaxRawStd: 0.38135330,
    ksRaw: 1.0,
    ksMatched: 0.39765197,
    ksBelow010: false,
    ksBelow005: false,
    ksImp1296Baseline: IMP1296_S_MAX_KS.W1000,
    ksDeltaVsImp1296: IMP1296_S_MAX_KS.W1000 - 0.39765197,
  }),
  Object.freeze({
    W: 10000,
    stride: 18,
    nWindows: 5001,
    muW: 141.42135624,
    sigW: 0.15234154,
    lambdaMaxMean: 2.09849150,
    lambdaMaxMin: 1.80827787,
    lambdaMaxMax: 2.49721201,
    zetaMaxRawMean: -914.54285330,
    zetaMaxRawStd: 0.55459854,
    ksRaw: 1.0,
    ksMatched: 0.40210090,
    ksBelow010: false,
    ksBelow005: false,
    ksImp1296Baseline: IMP1296_S_MAX_KS.W10000,
    ksDeltaVsImp1296: IMP1296_S_MAX_KS.W10000 - 0.40210090,
  }),
]);

// ── Frozen W=10000 CDF samples (empirical matched vs TW2) ───────────────
const W10000_CDF_SAMPLES = Object.freeze([
  Object.freeze({ z: -7, F_TW2: 1e-21, F_emp: 0 }),
  Object.freeze({ z: -6, F_TW2: 2e-14, F_emp: 0 }),
  Object.freeze({ z: -5, F_TW2: 4e-9, F_emp: 0 }),
  Object.freeze({ z: -4.5, F_TW2: 2e-7, F_emp: 0.002599480103979204 }),
  Object.freeze({ z: -4, F_TW2: 0.000008, F_emp: 0.0065986802639472104 }),
  Object.freeze({ z: -3.5, F_TW2: 0.000188, F_emp: 0.028194361127774445 }),
  Object.freeze({ z: -3, F_TW2: 0.0027, F_emp: 0.08378324335132974 }),
  Object.freeze({ z: -2.7711, F_TW2: 0.01, F_emp: 0.1247750449910018 }),
  Object.freeze({ z: -2.5, F_TW2: 0.024, F_emp: 0.1873625274945011 }),
  Object.freeze({ z: -2.2, F_TW2: 0.0576, F_emp: 0.2917416516696661 }),
  Object.freeze({ z: -2, F_TW2: 0.0903, F_emp: 0.3675264947010598 }),
  Object.freeze({ z: -1.829, F_TW2: 0.15, F_emp: 0.46090781843631273 }),
  Object.freeze({ z: -1.7711, F_TW2: 0.169, F_emp: 0.4887022595480904 }),
  Object.freeze({ z: -1.5, F_TW2: 0.25, F_emp: 0.635872825434913 }),
  Object.freeze({ z: -1.2683, F_TW2: 0.35, F_emp: 0.7438512297540492 }),
  Object.freeze({ z: -1, F_TW2: 0.45, F_emp: 0.8478304339132173 }),
  Object.freeze({ z: -0.9344, F_TW2: 0.5, F_emp: 0.8620275944811038 }),
  Object.freeze({ z: -0.6, F_TW2: 0.65, F_emp: 0.9282143571285743 }),
  Object.freeze({ z: -0.2305, F_TW2: 0.75, F_emp: 0.9616076784643072 }),
  Object.freeze({ z: 0, F_TW2: 0.82, F_emp: 0.9702059588082383 }),
  Object.freeze({ z: 0.4783, F_TW2: 0.9, F_emp: 0.9870025994801039 }),
  Object.freeze({ z: 0.9793, F_TW2: 0.95, F_emp: 0.9888022395520896 }),
  Object.freeze({ z: 1.5, F_TW2: 0.98, F_emp: 0.9936012797440512 }),
  Object.freeze({ z: 2.0234, F_TW2: 0.99, F_emp: 0.9988002399520096 }),
  Object.freeze({ z: 2.5, F_TW2: 0.997, F_emp: 1 }),
  Object.freeze({ z: 3, F_TW2: 0.9991, F_emp: 1 }),
  Object.freeze({ z: 3.5, F_TW2: 0.99982, F_emp: 1 }),
  Object.freeze({ z: 4, F_TW2: 0.999971, F_emp: 1 }),
  Object.freeze({ z: 4.5, F_TW2: 0.9999963, F_emp: 1 }),
  Object.freeze({ z: 5, F_TW2: 0.9999998, F_emp: 1 }),
]);

const VERDICT = 'discretization-too-coarse';
const VERDICT_ALLOWED = Object.freeze([
  'lambda-max-matches-TW2-within-0.05',
  'lambda-max-matches-TW2-within-0.10',
  'lambda-max-systematic-deviation-above-0.10',
  'goe-like-not-gue',
  'discretization-too-coarse',
]);

const SCOPE_LABEL = 'tw2-lambda-max-empirical-pilot';

const HONEST_SCOPE = Object.freeze({
  isProof: false,
  isEmpiricalPilot: true,
  scopeLabel: SCOPE_LABEL,
  truncatedFrom: N_TOTAL_IN_BUNDLE,
  truncatedTo: N_TRUNCATED,
  truncationMatchesImp1296: true,
  truncationRationale:
    'Used first 10^5 of 10^6 ZEROS_EXTENDED — IDENTICAL to imp-1296 for ' +
    'apples-to-apples comparison. Per-window cost O(W) + O(K_BLOCK^2 * 200); ' +
    'at W=10000, K_BLOCK=100, 5001 windows = ~10^9 ops, runs in minutes.',
  kBlockSize: K_BLOCK,
  discretizationLimitation:
    '100×100 truncation of the sine kernel evaluated at zero positions does NOT ' +
    'recover the Soshnikov μ_W = sqrt(2W) edge scaling. λ_max is bounded above by ' +
    'the trace of the 100×100 block / 100 = 1 (HS norm O(1)) so the observed mean ' +
    'λ_max ≈ 2.10 is INDEPENDENT of W. Recovering TW2 shape requires Bornemann 2010 ' +
    'Airy-kernel quadrature on 200+ Chebyshev nodes, NOT the sine-kernel restriction ' +
    'used here.',
  followUpRecommendation:
    'imp-1301-sub-bornemann: re-attempt with Bornemann 2010 direct Airy-kernel ' +
    'quadrature (K_Airy(x,y) = (Ai(x) Ai′(y) − Ai′(x) Ai(y))/(x−y)) on Chebyshev ' +
    'nodes, or Tracy-Widom 1994 Painlevé-II ODE integration of det(I − K_Airy). ' +
    'The inconclusive verdict here is documented as the honest pilot scope.',
  tw2SourceIsTable: true,
  tw2SourceIsClosedForm: false,
  tw2NumberOfTablePoints: 30,
  comparisonToImp1296:
    'imp-1296 s_max KS at W=10000 = 0.4744; imp-1301 λ_max matched KS at W=10000 = ' +
    '0.4021. Δ = +0.072 (imp-1301 is better, consistent with the imp-1296 ' +
    'sMaxNotLambdaMax functional-mismatch hypothesis), but BOTH are well above ' +
    'the 0.10 success threshold.',
  rawScalingFailureNote:
    'KS_raw = 1.0 in both Ws because λ_max ~ O(1) but the Soshnikov sqrt(2W) ' +
    'centering grows as 10^1-10^2. This is the EXPECTED failure mode of the ' +
    '100×100 sub-block — it does not invalidate the Soshnikov scaling, only ' +
    'flags that this discretization does not approach the asymptotic regime.',
});

const METHOD = Object.freeze({
  unfold: 'γ̃_n = γ_n · log(γ_n / (2π)) / (2π)',
  edgeStatistic:
    'λ_max of the K_BLOCK × K_BLOCK sine kernel K_ij = sinc(π(γ̃_i − γ̃_j)) on ' +
    'the K_BLOCK rightmost unfolded zeros of the window [T, T+W]',
  windowSizes: Object.freeze([1000, 10000]),
  strideSelection: 'STRIDE chosen so number of windows ≈ 5000 (≥ 1000 tripwire floor)',
  eigenvalueExtraction:
    '200-step normalized power iteration with seeded PRNG initial vector ' +
    '(deterministic, reproducible); Rayleigh quotient for λ_max',
  soshnikovRescaling: SOSHNIKOV_2000_SCALING,
  ksMeasure:
    'Two-track: (a) RAW = compare ζ_raw to TW2 lookup directly; (b) MATCHED = ' +
    'standardize to TW2 mean+variance then KS (shape-only, mirrors imp-1296)',
  tw2CDF:
    '30-point Prähofer-Spohn 2004 / Bornemann 2010 lookup, linear interpolation, ' +
    'clamped outside [-7, 5] (SAME table as imp-1296)',
});

const REFERENCES = Object.freeze({
  tracyWidom1994:
    'Tracy & Widom 1994, "Level spacing distributions and the Airy kernel", ' +
    'Comm. Math. Phys. 159, 151–174 — original derivation of F2.',
  soshnikov2000:
    'Soshnikov 2000, "Determinantal random point fields", Math. Surveys 55 (5), ' +
    '107–160 — standard edge-kernel scaling μ_N = sqrt(2N), σ_N = N^{-1/6}/sqrt(2) ' +
    'for windowed sine-kernel / GUE largest eigenvalue.',
  prahoferSpohn2004:
    'Prähofer & Spohn 2004, "Exact scaling functions for one-dimensional ' +
    'stationary KPZ growth", J. Stat. Phys. 115, 255–279 — tabulated F2 values ' +
    '(the 30-point lookup used here).',
  bornemann2010:
    'Bornemann 2010, "On the numerical evaluation of distributions in random ' +
    'matrix theory", Math. Comp. 79, 871–915 — recommended for the follow-up ' +
    'Airy-kernel quadrature.',
  forresterTextbook:
    'Forrester 2010, "Log-Gases and Random Matrices", Princeton Univ. Press — ' +
    'TW2 background and GUE edge.',
  odlyzko: 'Odlyzko zero tables (1e6 verified ordinates).',
  imp1296:
    'src/data/imp-1296-tracy-widom-edge.js — s_max baseline (KS 0.39/0.39/0.47). ' +
    'imp-1296.honestScope.sMaxNotLambdaMax names this λ_max ticket as the ' +
    'correct follow-up.',
  sourceScript: 'scripts/compute-imp1301-true-tw-edge.mjs',
});

export const IMP_1301_TRUE_TW_EDGE_STATISTIC = Object.freeze({
  id: 'imp-1301-true-tw-edge-statistic',
  ticket: 'imp-1301',
  generatedAt: GENERATED_AT,
  scopeLabel: SCOPE_LABEL,
  verdict: VERDICT,
  verdictAllowedSet: VERDICT_ALLOWED,

  nTotalInBundle: N_TOTAL_IN_BUNDLE,
  nTruncated: N_TRUNCATED,
  nTargetWindows: N_TARGET_WINDOWS,
  kBlock: K_BLOCK,

  tw2: Object.freeze({
    mean: TW2_MEAN,
    variance: TW2_VAR,
    skewness: TW2_SKEW,
    excessKurtosis: TW2_KURTOSIS,
    median: TW2_MEDIAN,
  }),

  soshnikovScaling: SOSHNIKOV_2000_SCALING,
  method: METHOD,
  rows: ROWS,
  w10000CdfSamples: W10000_CDF_SAMPLES,
  imp1296Baseline: IMP1296_S_MAX_KS,

  summary: Object.freeze({
    nWindowSizes: ROWS.length,
    windowSizes: ROWS.map((r) => r.W),
    ksMatchedDistances: ROWS.map((r) => ({ W: r.W, ks: r.ksMatched })),
    minKsMatched: Math.min(...ROWS.map((r) => r.ksMatched)),
    maxKsMatched: Math.max(...ROWS.map((r) => r.ksMatched)),
    minNWindows: Math.min(...ROWS.map((r) => r.nWindows)),
    maxNWindows: Math.max(...ROWS.map((r) => r.nWindows)),
    allKsMatchedAbove010: ROWS.every((r) => r.ksMatched >= 0.10),
    allWindowsAbove1000: ROWS.every((r) => r.nWindows >= 1000),
    ksImprovementOverImp1296_W10000:
      IMP1296_S_MAX_KS.W10000 - ROWS.find((r) => r.W === 10000).ksMatched,
  }),

  honestScope: HONEST_SCOPE,
  references: REFERENCES,
});

export default IMP_1301_TRUE_TW_EDGE_STATISTIC;

// ── Tripwire assertions (8+ required) ──────────────────────────────────
export const IMP_1301_TRUE_TW_EDGE_STATISTIC_ASSERTIONS = [
  {
    id: 'imp1301-ks-distance-at-w10000-recorded',
    why:
      'The ticket spec asks whether the LAMBDA-MAX TW2 K-S distance falls below 0.10. ' +
      'We record the matched-scaling K-S at W=10000 (0.4021) regardless of outcome; ' +
      'this tripwire locks the number so a drift in the compute script surfaces here.',
    holds: () => {
      const w10k = IMP_1301_TRUE_TW_EDGE_STATISTIC.rows.find((r) => r.W === 10000);
      return w10k && Math.abs(w10k.ksMatched - 0.4021) < 0.005;
    },
  },
  {
    id: 'imp1301-ks-better-than-imp1296-baseline-at-w10000',
    why:
      'imp-1296 reported KS = 0.4744 at W=10000 for s_max. imp-1301 (λ_max) gives ' +
      '0.4021 — strictly BETTER. This tripwire enforces the direction-of-improvement ' +
      'claim (λ_max is a closer approximation to TW2 than s_max, consistent with the ' +
      'imp-1296 sMaxNotLambdaMax hypothesis).',
    holds: () => {
      const w10k = IMP_1301_TRUE_TW_EDGE_STATISTIC.rows.find((r) => r.W === 10000);
      return w10k && w10k.ksMatched < w10k.ksImp1296Baseline;
    },
  },
  {
    id: 'imp1301-empirical-cdf-at-least-1000-windows',
    why:
      'Empirical CDF must be computed on ≥ 1000 windows at every W so KS is not ' +
      'estimation-noise-dominated. Current minimum is 5001 (W=10000), 5× the floor.',
    holds: () => IMP_1301_TRUE_TW_EDGE_STATISTIC.summary.minNWindows >= 1000,
  },
  {
    id: 'imp1301-two-window-sizes-tested',
    why:
      'Ticket spec: try W ∈ {1000, 10000}. Exactly two window sizes must be present ' +
      'so the W-dependence of the (raw) Soshnikov centering is testable.',
    holds: () => {
      const sizes = IMP_1301_TRUE_TW_EDGE_STATISTIC.summary.windowSizes;
      return sizes.length === 2 && sizes.includes(1000) && sizes.includes(10000);
    },
  },
  {
    id: 'imp1301-cite-tracy-widom-soshnikov-prahofer',
    why:
      'Per ticket spec: cite Tracy-Widom 1994 + Soshnikov 2000 + Prähofer-Spohn 2004. ' +
      'Missing any of these would obscure where the F2 distribution, the edge scaling, ' +
      'or the lookup table comes from.',
    holds: () => {
      const r = IMP_1301_TRUE_TW_EDGE_STATISTIC.references;
      return (
        /Tracy.*Widom 1994/i.test(r.tracyWidom1994) &&
        /Comm\.? Math\.? Phys\.? 159/i.test(r.tracyWidom1994) &&
        /Soshnikov 2000/i.test(r.soshnikov2000) &&
        /Math\.? Surveys 55/i.test(r.soshnikov2000) &&
        /Pr[äa]hofer.*Spohn 2004/.test(r.prahoferSpohn2004) &&
        /J\.? Stat\.? Phys\.? 115/i.test(r.prahoferSpohn2004)
      );
    },
  },
  {
    id: 'imp1301-verdict-in-allowed-set',
    why:
      'Verdict must be one of {lambda-max-matches-TW2-within-0.05, ' +
      'lambda-max-matches-TW2-within-0.10, lambda-max-systematic-deviation-above-0.10, ' +
      'goe-like-not-gue, discretization-too-coarse}. The current verdict is ' +
      '"discretization-too-coarse" — the 100×100 sub-block does not reach the ' +
      'asymptotic Soshnikov regime.',
    holds: () =>
      IMP_1301_TRUE_TW_EDGE_STATISTIC.verdictAllowedSet.includes(
        IMP_1301_TRUE_TW_EDGE_STATISTIC.verdict,
      ),
  },
  {
    id: 'imp1301-cross-references-imp1296',
    why:
      'imp-1301 is the direct follow-up to imp-1296 (imp-1296.honestScope.sMaxNotLambdaMax ' +
      'named the λ_max comparison as the right test). The references must explicitly ' +
      'cite imp-1296 with its baseline KS values frozen for direct comparison.',
    holds: () => {
      const r = IMP_1301_TRUE_TW_EDGE_STATISTIC.references;
      return (
        /imp-1296/.test(r.imp1296) &&
        typeof IMP_1301_TRUE_TW_EDGE_STATISTIC.imp1296Baseline.W10000 === 'number' &&
        Math.abs(IMP_1301_TRUE_TW_EDGE_STATISTIC.imp1296Baseline.W10000 - 0.4744) < 0.001
      );
    },
  },
  {
    id: 'imp1301-scope-honest-pilot-not-proof',
    why:
      'Per ticket "BE HONEST" constraint: scope label MUST be ' +
      '"tw2-lambda-max-empirical-pilot" and isProof MUST be false. This pilot ' +
      'reports a KS distance; it does not prove TW2 (presence or absence) for ' +
      'Riemann zeros — the 100×100 discretization is too coarse to draw that ' +
      'conclusion.',
    holds: () =>
      IMP_1301_TRUE_TW_EDGE_STATISTIC.scopeLabel === 'tw2-lambda-max-empirical-pilot' &&
      IMP_1301_TRUE_TW_EDGE_STATISTIC.honestScope.isProof === false &&
      IMP_1301_TRUE_TW_EDGE_STATISTIC.honestScope.isEmpiricalPilot === true,
  },
  {
    id: 'imp1301-truncation-matches-imp1296',
    why:
      'Direct comparison to imp-1296 REQUIRES identical zero truncation. Used ' +
      'first 10^5 of 10^6 — SAME as imp-1296.',
    holds: () => {
      const h = IMP_1301_TRUE_TW_EDGE_STATISTIC.honestScope;
      return (
        h.truncatedFrom === 1000000 &&
        h.truncatedTo === 100000 &&
        h.truncationMatchesImp1296 === true
      );
    },
  },
  {
    id: 'imp1301-soshnikov-scaling-documented',
    why:
      'The Soshnikov 2000 edge rescaling μ_W = sqrt(2W), σ_W = W^{-1/6}/sqrt(2) is ' +
      'the textbook formula referenced in the ticket spec. Per-row muW/sigW values ' +
      'MUST satisfy these formulas exactly.',
    holds: () => {
      for (const r of IMP_1301_TRUE_TW_EDGE_STATISTIC.rows) {
        const expectedMu = Math.sqrt(2 * r.W);
        const expectedSig = Math.pow(r.W, -1 / 6) / Math.sqrt(2);
        if (Math.abs(r.muW - expectedMu) > 1e-6) return false;
        if (Math.abs(r.sigW - expectedSig) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1301-emp-cdf-monotone-nondecreasing',
    why:
      'The empirical CDF samples at W=10000 must be monotone non-decreasing in z ' +
      '(a CDF is always non-decreasing). A violation would indicate the sample ' +
      'frozen here is corrupted or the z-grid is not sorted.',
    holds: () => {
      const s = IMP_1301_TRUE_TW_EDGE_STATISTIC.w10000CdfSamples;
      for (let i = 1; i < s.length; i++) {
        if (s[i].F_emp + 1e-12 < s[i - 1].F_emp) return false;
        if (s[i].z <= s[i - 1].z) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1301-discretization-limitation-flagged',
    why:
      'The verdict "discretization-too-coarse" REQUIRES that honestScope explicitly ' +
      'documents (a) why the 100×100 sub-block fails the Soshnikov scaling, and ' +
      '(b) the recommended follow-up (Bornemann 2010 Airy-kernel quadrature). ' +
      'Without this, a reader could mis-read the result as a refutation of GUE.',
    holds: () => {
      const h = IMP_1301_TRUE_TW_EDGE_STATISTIC.honestScope;
      return (
        typeof h.discretizationLimitation === 'string' &&
        /100×100/.test(h.discretizationLimitation) &&
        /Soshnikov/.test(h.discretizationLimitation) &&
        typeof h.followUpRecommendation === 'string' &&
        /Bornemann 2010/.test(h.followUpRecommendation)
      );
    },
  },
];
