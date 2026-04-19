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
