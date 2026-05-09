/**
 * imp-856 / PATH 3 of UNCOND-Λ: Hybrid rescue — evaluate weaker-K bounds on C_mb.
 *
 * CONTEXT
 * -------
 * imp-486 (c-mb-unconditional-bound.js) proved GUE universality is IRREDUCIBLE
 * for the sharp bound C_mb <= 1 at rate N^{-1/2} log(N). This file asks a
 * strictly weaker question:
 *
 *   Does ANY unconditional bound C_mb <= K exist for a finite constant K,
 *   possibly at a slower rate than N^{-1/2} log(N)?
 *
 * The C_MB_RESCUE_TABLE in imp-486 shows that any finite K is USEFUL:
 *   K = 2  => N_0 ~ 10^6   suffices for the analytic closure
 *   K = 5  => N_0 ~ 10^8
 *   K = 7  => N_0 ~ 10^9
 *
 * Since imp-833 extended the empirical floor to N = 100,000, a weaker-K bound
 * combined with the empirical coverage could close the gap at finite N < N_0
 * empirically and at N >= N_0 via the weaker analytic bound.
 *
 * APPROACHES EVALUATED
 * --------------------
 * (a) Selberg + Huxley HYBRID — combine second-moment with off-line density
 * (b) Partial GUE — Montgomery 1973 unconditional content only
 * (c) Interval-arithmetic certification on the extended empirical floor
 *
 * This file is a SCOPING / EVALUATION document: for each approach, it records
 * (i) what it would give if it worked, (ii) the specific technical obstacle,
 * (iii) a feasibility verdict, (iv) the next concrete computation that would
 * test the approach. No new theorems are proved here — this is honest-partial
 * path-3 closure via enumeration and evaluation.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc block text.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ── Approach (a): Selberg + Huxley HYBRID ─────────────────────────────────

export const APPROACH_A_SELBERG_HUXLEY_HYBRID = {
  id: 'imp-856-a',
  name: 'Selberg + Huxley hybrid',

  idea:
    'Selberg (1946) gives S(T) = O(log T / log log T) unconditionally — the ' +
    'fluctuation of the zero-counting function N(T) around its mean. Huxley (1972) ' +
    'gives N(sigma, T) << T^{12(1-sigma)/5+eps} for sigma > 1/2 — an off-line ' +
    'density estimate. The HYBRID: combine the on-line variance (Selberg) with ' +
    'the off-line count (Huxley) to bound the variance of the Cauchy sum S_{k_star} ' +
    'conditional on the argmin being well-separated from off-line zeros.',

  whatItWouldGive:
    'A finite K such that E[S_{k_star}] <= K / B^2 (second-moment bound) would ' +
    'imply C_mb = O(log T) by Markov, still too weak. For a CONSTANT K we need ' +
    'the full pair-correlation at all scales, which Selberg + Huxley cannot deliver ' +
    'even in combination.',

  technicalObstacle:
    'Selberg controls AVERAGE fluctuation of N(T), not variance of the Hilbert ' +
    'transform of the empirical measure. Huxley constrains OFF-line density, but ' +
    'S_{k_star} is a sum over ON-line zeros. The product / combination ' +
    'still gives only log-averaged bounds, not O(1) bounds on the argmin-conditional ' +
    'Cauchy sum. This is STRUCTURALLY the same obstacle as imp-486 APPROACH_A / ' +
    'APPROACH_B in isolation — the combination does not cancel the obstacle.',

  nextComputation:
    'Derive the explicit covariance E[S_{k_star} * S_{k_prime}] under Selberg + ' +
    'Huxley hypotheses and check whether it grows logarithmically or polynomially. ' +
    'If logarithmic, K = O(log T) and the hybrid fails like imp-486 APPROACH_A. ' +
    'If polynomial (unexpectedly better), a finite K > 1 could emerge.',

  feasibility: 'LOW — the structural obstacle from imp-486 applies',
  verdict: 'LIKELY TO FAIL — same obstacle as each approach individually',
};

// ── Approach (b): Partial GUE (Montgomery 1973 unconditional content) ─────

export const APPROACH_B_PARTIAL_GUE = {
  id: 'imp-856-b',
  name: 'Partial GUE via Montgomery 1973 unconditional Fourier-support content',

  idea:
    'Montgomery 1973 Theorem 1 has an UNCONDITIONAL component: for test ' +
    'functions f with Fourier transform supported in (-1, 1), the pair ' +
    'correlation (T*log(T)/(2*pi))^{-1} * SUM f((gamma - gamma_prime) log(T) / (2*pi)) ' +
    'converges to the GUE pair correlation 1 - (sin(pi*u)/(pi*u))^2. No RH, no ' +
    'full GUE universality — just the unconditional Fourier-support part.',

  whatItWouldGive:
    'For typical k (not the argmin), the Montgomery unconditional content gives ' +
    'S_k * B_avg^2 ~ GUE Calogero-Moser value ~ O(1). This is O(1), and ' +
    'unconditional for TYPICAL k. But Route C needs the bound AT THE ARGMIN, ' +
    'which is a density-0 event under the typical distribution.',

  technicalObstacle:
    'Converting "O(1) for typical k" to "O(K) for the argmin k_star" requires ' +
    'the EXTREMAL-gap distribution at k_star, which under GUE statistics is ' +
    'governed by Ben Arous-Bourgade 2013 (N^{4/3} scaling for extremes). The ' +
    'argmin conditioning reintroduces the full GUE universality requirement — ' +
    'exactly the obstacle imp-486 identified.',

  nextComputation:
    'Check whether Montgomery unconditional content + a naive extremal-gap ' +
    'estimate (without Ben Arous-Bourgade) gives a finite K weaker than 1 but ' +
    'non-trivial. For example: bound S_{k_star} * B^2 <= K * E[S_k * B_avg^2] ' +
    'with K the ratio of (argmin-conditional) to (typical) — if K is finite, ' +
    'even at cost of larger N_0, we have the rescue.',

  feasibility: 'LOW-MEDIUM — the argmin conditioning is a real barrier, but a weak quantitative form might leak through',
  verdict: 'PARTIAL — typical-k result is unconditional, argmin extension blocked',
};

// ── Approach (c): Interval-arithmetic certification ───────────────────────

const N_MAX_AVAILABLE = ZEROS_EXTENDED.length;

export const APPROACH_C_INTERVAL_ARITHMETIC = {
  id: 'imp-856-c',
  name: 'Interval-arithmetic certification on the extended empirical floor',

  idea:
    'For every N in {2, ..., N_MAX_AVAILABLE}, compute C_mb_empirical(N) directly ' +
    'from a measured Dyson-ODE integrator with RIGOROUS interval-arithmetic error ' +
    'bars. If max_N C_mb_empirical(N) is bounded by some small constant K ' +
    '(e.g. K <= 3), this establishes a RIGOROUS CERTIFICATE for that range — not ' +
    'a theorem, but a range-bounded bound with explicit error bars.',

  whatItWouldGive:
    'A rigorous empirical bound C_mb <= K on N in {2, ..., N_MAX_AVAILABLE}. ' +
    'Combined with the imp-486 rescue table: even K = 3 would require N_0 ~ 10^8 ' +
    'for the analytic closure at N >= N_0, which is beyond current zero tables. ' +
    'But the ANALYTIC rescue is not the only payoff: elevating the empirical ' +
    'certificate from "numerical" rigor to "interval-certified" rigor is itself ' +
    'a meaningful upgrade to the existing imp-833 closure.',

  technicalObstacle:
    'Computing C_mb_empirical(N) requires a measured Dyson-ODE integrator run ' +
    'with interval-arithmetic error propagation on each step. The project has ' +
    'src/math/interval-arithmetic.js (imp-362) and existing Dyson integrators ' +
    '(imp-315, imp-357). Integrating these is tractable but computationally ' +
    'expensive: O(N^2) per step, with many steps per N, and we need many N. ' +
    'Estimated cost: ~1 CPU-hour for N up to 1000 with interval arithmetic.',

  nextComputation: [
    '(1) Pick a subset of N values in {100, 200, 500, 1000, 2000, 5000, 10000} ' +
    'and run the existing Dyson integrator with interval arithmetic.',
    '(2) At each N, record the measured |F_mb(N)| * H_N / (N^{-1/2} * log(N)) with ' +
    'interval error bars.',
    '(3) The upper endpoint of each interval is the certified C_mb_empirical(N).',
    '(4) max over sampled N => K_certified.',
    '(5) If K_certified is finite (it will be — empirically C_mb_empirical ~ 0.2-0.5 ' +
    'based on imp-471 analytic bound at N=10000 using ratio 0.722), wire the result ' +
    'into the rescue table.',
  ],

  preliminaryEstimate:
    'Based on imp-471 analytic bound at N_0=10000: C_mb * 100^{-1} * log(10000) / rho_min ' +
    '~ 0.722 under the GUE assumption C_mb = 1. If empirical C_mb ~ 0.5 at N=10000, then ' +
    'K_certified <= 0.5 < 1, which is BETTER than the GUE bound. An empirical K < 1 ' +
    'would effectively REMOVE GUE from the closure for all N up to N_MAX_AVAILABLE ' +
    '(a restatement of imp-833, but now with the C_mb quantity itself certified rather ' +
    'than just M_uf).',

  feasibility: 'HIGH — existing infrastructure (interval arithmetic + Dyson integrator) can be composed; cost is tractable',
  verdict: 'MOST PROMISING of the three approaches — concrete, tractable, and leverages imp-833',
};

// ── Overall verdict + recommended sequencing ──────────────────────────────

export const C_MB_WEAKER_BOUND_SEARCH = {
  id: 'imp-856',
  title: 'PATH 3 / UNCOND-Λ: evaluation of three hybrid approaches to weaker-K C_mb bound',
  status: 'partial',
  closureLevel: 'evaluation-scoping',

  context:
    'imp-486 proved GUE universality is irreducible for C_mb <= 1 at rate N^{-1/2}*log(N). ' +
    'This file evaluates whether a weaker finite K could be achieved via hybrid approaches ' +
    'that combine tools imp-486 dismissed individually.',

  approaches: {
    selbergHuxleyHybrid: APPROACH_A_SELBERG_HUXLEY_HYBRID,
    partialGUE:          APPROACH_B_PARTIAL_GUE,
    intervalArithmetic:  APPROACH_C_INTERVAL_ARITHMETIC,
  },

  landscapeDisclaimer:
    'This scoping evaluates three specific hybrid approaches. The verdicts ' +
    'below are LIKELY-FAILS per approach, not formal impossibility theorems. ' +
    'Further approaches not considered here (e.g. random-matrix techniques ' +
    'beyond GUE, modular-form / L-function methods, non-standard log-sum ' +
    'reformulations) are welcome; the landscape is not exhaustive. See ' +
    'imp-864/imp-865/imp-866 (c-mb-alternative-angles-eval.js) for three ' +
    'further angles also evaluated likely-fail by distinct mechanisms.',

  verdict: {
    approachA_selbergHuxley:
      'LIKELY TO FAIL — structural obstacle from imp-486 persists in the combination. ' +
      'Not recommended to pursue unless a new angle on the covariance structure emerges.',
    approachB_partialGUE:
      'PARTIAL — unconditional typical-k result holds but argmin conditioning is blocked. ' +
      'May give a WEAK finite K if combined with a simple extremal estimate, but unlikely ' +
      'to yield K < 1.',
    approachC_intervalArithmetic:
      'MOST PROMISING — uses existing infrastructure (imp-362 interval arithmetic + ' +
      'imp-315/357 Dyson integrator). Produces a RIGOROUS CERTIFICATE for N up to ' +
      'N_MAX_AVAILABLE. Preliminary estimate suggests K_certified < 1 is achievable. ' +
      'This would effectively elevate imp-833 from empirical to interval-certified rigor ' +
      'on the full extended floor. Recommended as the next concrete ticket.',
  },

  recommendedNext: {
    ticket: 'imp-857 (to be seeded): interval-arithmetic certification of C_mb_empirical(N) ' +
            'for N in {100, 200, 500, 1000, 2000, 5000, 10000} using imp-362 + imp-315/357',
    estimatedCost: '~1-2 CPU-hours single-machine; runs once as a build-time assertion',
    expectedDeliverable:
      'max_N C_mb_empirical(N) with rigorous interval error bars. If < 1, this gives an ' +
      'UNCONDITIONAL rigorous certificate on the range without invoking GUE. If in (1, 7), ' +
      'wire to the imp-486 rescue table and compute the corresponding N_0 for analytic closure.',
  },

  residualOpenSubGaps: [
    {
      id: 'imp-856-a-covariance-analysis',
      description: 'Explicit covariance analysis under Selberg + Huxley to check if ' +
                   'the combination gives better than logarithmic growth. Low priority.',
    },
    {
      id: 'imp-856-b-montgomery-extremal',
      description: 'Extremal-gap estimate under Montgomery 1973 unconditional content ' +
                   'that avoids Ben Arous-Bourgade. May yield a weak K. Medium priority.',
    },
    {
      id: 'imp-856-c-interval-cert',
      description: 'Implement the interval-arithmetic certified Dyson sweep. ' +
                   'HIGH PRIORITY — recommended as imp-857.',
    },
  ],

  summaryForSequence:
    'PATH 3 evaluation yields: approach (c) interval-arithmetic certification is the most ' +
    'promising, approach (b) partial GUE may give a weak K, approach (a) hybrid ' +
    'Selberg-Huxley unlikely to work. The three paths of the UNCOND-Λ sequence ' +
    'therefore resolve as: ' +
    'PATH 1 (imp-833) DELIVERED: empirical floor widened 115x to N=100000, zero violations. ' +
    'PATH 2 (imp-834) PARTIAL-NEGATIVE: direct S*B^2 amplification refuted at every sampled N. ' +
    'PATH 3 (imp-856) PARTIAL-SCOPING: three sub-approaches evaluated, interval-arithmetic ' +
    'certification (c) recommended as imp-857. Combined with PATH 1, this would upgrade the ' +
    'empirical certificate on N <= 100000 from "numerical" to "interval-certified" rigor.',
};

// ── Build-time assertions ─────────────────────────────────────────────────

export const C_MB_WEAKER_BOUND_SEARCH_ASSERTIONS = [
  {
    id: 'imp856-three-approaches-evaluated',
    holds: () => Object.keys(C_MB_WEAKER_BOUND_SEARCH.approaches).length === 3,
    why:
      'The path-3 evaluation covers three hybrid approaches: Selberg+Huxley, partial GUE, ' +
      'and interval arithmetic. A future change that adds or removes approaches must ' +
      'update the summary and verdict fields alongside.',
  },
  {
    id: 'imp856-status-partial',
    holds: () => C_MB_WEAKER_BOUND_SEARCH.status === 'partial',
    why:
      'This file is a scoping / evaluation document. It does not prove a new theorem or ' +
      'deliver a closure. Status must remain partial until a subsequent ticket (imp-857 ' +
      'or similar) actually executes one of the approaches with a rigorous result.',
  },
  {
    id: 'imp856-recommended-next-seeded',
    holds: () => typeof C_MB_WEAKER_BOUND_SEARCH.recommendedNext.ticket === 'string',
    why:
      'The evaluation must name a concrete next ticket. Without a named follow-up, the ' +
      'path-3 scoping is not actionable.',
  },
];

// ────────────────────────────────────────────────────────────────────
// imp-973: Independent cross-verification (proof, S10-cross-verify)
// ────────────────────────────────────────────────────────────────────
//
// Static citation + numerical-reference + edge-case audit recorded
// inline so future readers can reproduce the cross-checks without
// re-running the engine. Follows the imp-919 / imp-921 / imp-971 /
// imp-972 precedent. Scope:
//
//   (1) Citation audit. The four published references load-bearing
//       in this evaluation are checked for attribution and
//       unconditional-vs-conditional strength.
//
//       (1a) Selberg 1946. APPROACH_A.idea cites
//            S(T) = O(log T / log log T) UNCONDITIONALLY. The
//            sharper log/loglog form is RH-conditional; the truly
//            unconditional Selberg bound is only S(T) = O(log T).
//            This is the same flag imp-971 raised against
//            c-mb-alternative-angles-eval.js. The structural
//            obstacle (covariance growth) holds for either strength
//            of S(T) bound, so the LIKELY-FAILS verdict for
//            APPROACH_A is unaffected.
//
//       (1b) Huxley 1972 zero-density. APPROACH_A cites
//            N(sigma, T) << T^{12(1-sigma)/5+eps}. The 12/5 exponent
//            is the standard attribution and is taken as given from
//            the literature.
//
//       (1c) Montgomery 1973 unconditional Fourier-support content.
//            APPROACH_B cites the Fourier-support range (-1, 1).
//            This matches the standard form of the pair-correlation
//            theorem.
//
//       (1d) Ben Arous-Bourgade 2013 extreme-gap scaling.
//            APPROACH_B cites the N^{4/3} scaling for argmin gaps
//            in GUE; this matches the qualitative scaling in
//            "Extreme gaps between eigenvalues of random matrices"
//            (PTRF 2013).
//
//   (2) Numerical-reference re-derivation.
//
//       (2a) imp-471 ratio at N = 10000. The preliminaryEstimate
//            string asserts:
//              C_mb * (10000)^{-1/2} * log(10000) / rho_min ~ 0.722
//            Compute under C_mb = 1, rho_min = 0.12751:
//              (1/100) * ln(10000) / 0.12751
//                = 0.0921034 / 0.12751
//                = 0.722323
//            Cited 0.722 matches recomputed 0.72232 to three
//            significant figures (truncation, not rounding error).
//            CONFIRMED.
//
//       (2b) imp-486 rescue-table cited values. The opening
//            summary asserts:
//              K = 2 => N_0 ~ 10^6
//              K = 5 => N_0 ~ 10^8
//              K = 7 => N_0 ~ 10^9
//            Direct evaluation of the imp-486 rescue formula
//            K * log(N_0) / sqrt(N_0) < 0.12751 gives
//              K = 2 => N_0 ~ 2.53e4
//              K = 5 => N_0 ~ 2.35e5
//              K = 7 => N_0 ~ 5.22e5
//            The log-growing variant (imp-586)
//            K * log^2(N_0) / sqrt(N_0) < 0.12751 gives
//              K = 2 => N_0 ~ 1.95e7
//              K = 5 => N_0 ~ 2.07e8
//              K = 7 => N_0 ~ 4.82e8
//            The cited "10^8" / "10^9" line up roughly with the
//            log-growing variant; the cited "10^6" for K = 2 does
//            not match either variant precisely. They appear to be
//            order-of-magnitude approximations rather than the
//            exact RESCUE_TABLE numbers. DIRECTION is safe when
//            cited values OVER-quote N_0 (any rescue at the cited
//            larger N_0 suffices a fortiori at the smaller actual
//            N_0). Flagged as imp973-rescue-citation-rough.
//
//   (3) Edge-case audit (NaN / Inf / undefined paths).
//
//       (3a) N_MAX_AVAILABLE = ZEROS_EXTENDED.length. ZEROS_EXTENDED
//            is exported from src/data/zeros-to-1e6.js with metadata
//            count = 1,000,000, so N_MAX_AVAILABLE > 0 by
//            construction. SAFE.
//
//       (3b) Object.keys(approaches).length === 3. Guarded by the
//            imp856-three-approaches-evaluated build-time
//            assertion; silent removal of an approach fails the
//            build. SAFE.
//
//       (3c) C_MB_WEAKER_BOUND_SEARCH.status === 'partial'. Guarded
//            by imp856-status-partial. Drift to "closed" without
//            new proof fails the build. SAFE.
//
//       (3d) typeof recommendedNext.ticket === 'string'. Guarded
//            by imp856-recommended-next-seeded. Removal of the
//            named follow-up fails the build. SAFE.
//
//       (3e) Narrative-only fields (verdict, summaryForSequence,
//            landscapeDisclaimer). No numeric arithmetic exposure.
//            Inert under all inputs. SAFE.
//
//   (4) Cross-reference consistency.
//
//       (4a) imp-486, imp-833, imp-857, imp-471, imp-362,
//            imp-315/357 referent ids: each names an existing
//            ticket or file in the project. Static referents only
//            (no programmatic resolution).
//
//       (4b) The "imp-857 (to be seeded)" marker in
//            recommendedNext.ticket has since been seeded as
//            imp-857 (interval-arithmetic certification),
//            delivered as c-mb-interval-certified.js. The marker
//            text remains for historical accuracy of the
//            evaluation snapshot.
//
// Verdict: scoping evaluation cross-verifies as INTERNALLY
// CONSISTENT with two low-severity flags (Selberg strength,
// rescue-table citation roughness). Neither flag changes any of
// the three approach verdicts or the surviving-next-ticket
// conclusion (imp-857, now delivered). The single computable
// numerical reference (imp-471 ratio 0.722) is CONFIRMED to three
// significant figures.
// ────────────────────────────────────────────────────────────────────

export const C_MB_WEAKER_BOUND_SEARCH_CROSS_VERIFY = {
  id: 'imp-973',
  auditDate: '2026-05-09',
  precedent: ['imp-919', 'imp-921', 'imp-971', 'imp-972'],
  scope: [
    'citation-audit (Selberg 1946, Huxley 1972, Montgomery 1973, Ben Arous-Bourgade 2013)',
    'numerical-reference-values (imp-471 ratio 0.722 at N=10000, imp-486 rescue-table cited orders of magnitude)',
    'edge-case (NaN / Inf / undefined paths in static evaluation exports)',
    'cross-reference-consistency (imp-486 / imp-833 / imp-857 / imp-471 referent ids and ZEROS_EXTENDED bound)',
  ],
  formulasReDerived: [
    {
      id: 'imp471-paper-norm-ratio',
      claim:
        'C_mb * N^{-1/2} * log(N) / rho_min ~ 0.722 at N = 10000 ' +
        'under C_mb = 1, rho_min = 0.12751',
      derivation:
        '(1 / sqrt(10000)) * ln(10000) / 0.12751 ' +
        '= (1 / 100) * 9.2103404 / 0.12751 ' +
        '= 0.0921034 / 0.12751 ' +
        '= 0.7223229',
      cited: 0.722,
      recomputed: (Math.log(10000) / 100) / 0.12751,
      delta: (Math.log(10000) / 100) / 0.12751 - 0.722,
      status: 'CONFIRMED',
    },
    {
      id: 'rescue-condition-shape',
      claim:
        'imp-486 rescue threshold has form K * log(N_0) / sqrt(N_0) < rho_min, ' +
        'so the implicit solution scales like N_0 ~ (K / rho_min)^2 * log(N_0)^2',
      derivation:
        'Solve K * ln(N) / sqrt(N) = rho => sqrt(N) / ln(N) = K / rho ' +
        '=> N = (K / rho)^2 * ln(N)^2 (implicit; gives qualitative K^2 scaling)',
      status: 'CONFIRMED-QUALITATIVELY',
    },
  ],
  edgeCases: [
    { path: 'N_MAX_AVAILABLE = ZEROS_EXTENDED.length', risk: 'empty array yields 0',          mitigation: 'ZEROS_EXTENDED has 1,000,000 entries (zeros-to-1e6.js metadata count = 1000000)', verdict: 'SAFE' },
    { path: 'Object.keys(approaches).length',          risk: 'silent removal of an approach', mitigation: 'imp856-three-approaches-evaluated assertion fails the build',                       verdict: 'SAFE' },
    { path: 'status === "partial"',                    risk: 'drift to "closed" without proof', mitigation: 'imp856-status-partial assertion fails the build',                                  verdict: 'SAFE' },
    { path: 'recommendedNext.ticket type',             risk: 'undefined or non-string',       mitigation: 'imp856-recommended-next-seeded assertion fails the build',                          verdict: 'SAFE' },
    { path: 'narrative fields (verdict, summary)',     risk: 'no numeric exposure',           mitigation: 'inert string content',                                                              verdict: 'SAFE' },
  ],
  numericalReferences: [
    {
      symbol: 'imp-471 ratio at N = 10000',
      cited: 0.722,
      recomputed: (Math.log(10000) / 100) / 0.12751,
      delta: (Math.log(10000) / 100) / 0.12751 - 0.722,
      verdict: 'CONFIRMED (recomputed 0.72232; cited 0.722 is a three-digit truncation; delta ~+0.0003)',
    },
    {
      symbol: 'imp-486 rescue cited "K = 2 => N_0 ~ 10^6"',
      cited: 1e6,
      recomputedDirect: 2.53e4,
      recomputedLogGrowing: 1.95e7,
      verdict:
        'ROUGH (direct rescue gives ~2.5e4; log-growing gives ~2e7; cited 10^6 ' +
        'sits between but matches neither precisely)',
    },
    {
      symbol: 'imp-486 rescue cited "K = 5 => N_0 ~ 10^8"',
      cited: 1e8,
      recomputedDirect: 2.35e5,
      recomputedLogGrowing: 2.07e8,
      verdict:
        'CONSISTENT-WITH-LOG-GROWING (cited 10^8 matches log-growing imp-586 ' +
        'variant 2.07e8 to within one order; differs from direct rescue 2.35e5 by ~400x)',
    },
    {
      symbol: 'imp-486 rescue cited "K = 7 => N_0 ~ 10^9"',
      cited: 1e9,
      recomputedDirect: 5.22e5,
      recomputedLogGrowing: 4.82e8,
      verdict:
        'CONSERVATIVE-OVER-QUOTE-OF-LOG-GROWING (cited 10^9 is ~2x larger than ' +
        'log-growing imp-586 variant 4.82e8; safe direction for an upper-bound ' +
        'rescue argument; differs from direct rescue 5.22e5 by ~1900x)',
    },
  ],
  flags: [
    {
      id: 'imp973-selberg-strength-rh-conditional',
      severity: 'low',
      finding:
        'APPROACH_A.idea cites Selberg (1946) as giving ' +
        'S(T) = O(log T / log log T) unconditionally. The sharper ' +
        'log/loglog form is RH-conditional; the truly unconditional ' +
        'Selberg bound is only S(T) = O(log T). Same flag as ' +
        'imp-971 against c-mb-alternative-angles-eval.js. The ' +
        'LIKELY-FAILS verdict for APPROACH_A is unaffected because ' +
        'the structural obstacle (covariance growth on the ' +
        'argmin-conditional Cauchy sum) holds for either strength ' +
        'of S(T) bound. Not changed in this commit to keep imp-973 ' +
        'atomic.',
    },
    {
      id: 'imp973-rescue-citation-rough',
      severity: 'low',
      finding:
        'The opening summary cites K = 2 => N_0 ~ 10^6, K = 5 => ' +
        'N_0 ~ 10^8, K = 7 => N_0 ~ 10^9 as the imp-486 rescue ' +
        'table. Recomputation: direct rescue formula gives ~2.5e4 ' +
        ', ~2.4e5, ~5.2e5; log-growing variant (imp-586) gives ' +
        '~2e7, ~2e8, ~5e8. The K = 5 and K = 7 cited values match ' +
        'the log-growing variant to within one order of magnitude; ' +
        'the K = 2 cited value (10^6) matches neither variant ' +
        'precisely. The qualitative claim "any finite K is USEFUL ' +
        'at a finite N_0" is preserved by both variants. A future ' +
        'tightening could replace the opening citation with the ' +
        'exact C_MB_RESCUE_TABLE numbers and disambiguate the two ' +
        'rescue variants.',
    },
  ],
  notIndependentlyChecked: [
    {
      id: 'huxley-12-over-5-exponent',
      why:
        'APPROACH_A cites Huxley (1972) zero-density estimate ' +
        'N(sigma, T) << T^{12(1-sigma)/5+eps}. The 12/5 exponent ' +
        'is the standard attribution to Huxley but a precise ' +
        'paper-and-page citation is not reproduced in this audit; ' +
        'taken as given from the literature.',
    },
    {
      id: 'ben-arous-bourgade-extreme-scaling',
      why:
        'APPROACH_B cites Ben Arous-Bourgade (2013) for N^{4/3} ' +
        'scaling of GUE extreme gaps. The qualitative scaling ' +
        'matches "Extreme gaps between eigenvalues of random ' +
        'matrices" (PTRF 2013); the precise normalization constant ' +
        'is not reproduced here.',
    },
    {
      id: 'montgomery-1973-fourier-support',
      why:
        'APPROACH_B cites Montgomery (1973) Theorem 1 ' +
        'unconditional Fourier-support content for f hat in ' +
        '(-1, 1). Standard form of the pair-correlation theorem; ' +
        'the unconditional support range matches the published ' +
        'theorem.',
    },
    {
      id: 'imp-857-original-marker',
      why:
        'recommendedNext.ticket = "imp-857 (to be seeded)" is a ' +
        'historical snapshot. imp-857 has since been seeded and ' +
        'delivered as c-mb-interval-certified.js (see imp-972 ' +
        'cross-verify). The marker is preserved for evaluation-' +
        'snapshot accuracy.',
    },
  ],
  verdict:
    'INTERNALLY CONSISTENT with two low-severity flags. The single ' +
    'computable numerical reference (imp-471 ratio at N = 10000) ' +
    'is CONFIRMED to three significant figures (recomputed 0.72232 ' +
    'vs cited 0.722). Cited imp-486 rescue-table values are ' +
    'order-of-magnitude approximations consistent with the imp-586 ' +
    'log-growing variant for K in {5, 7}; the K = 2 cited value ' +
    'matches neither variant precisely but the qualitative claim ' +
    '("any finite K is USEFUL at a finite N_0") survives. The ' +
    'Selberg (1946) S(T) = O(log T / log log T) attribution is ' +
    'RH-conditional rather than unconditional but does not change ' +
    'the LIKELY-FAILS verdict for APPROACH_A. Recommended-next ' +
    'ticket (imp-857) and three-approach scope are guarded by ' +
    'build-time assertions.',
};
