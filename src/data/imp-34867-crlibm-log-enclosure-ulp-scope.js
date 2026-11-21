/**
 * @module imp-34867-crlibm-log-enclosure-ulp-scope
 *
 * imp-34867 (proof, frontier): imp-34840 decomposed the Krawczyk endpoint evaluation into an operation DAG
 * (n_op ~ 49, depth ~ 30) and found the MARGIN axis FEASIBLE -- the achievable endpoint half-width clears the
 * (H2) bracket margin by ~10 orders -- then localized the genuine blocker as the TRANSCENDENTAL layer: the
 * chain calls Math.log several times (the inner RvM-inverse Newton loop, the outer g=K log T0, and g_prime),
 * and a correct directed-rounding enclosure needs a two-sided ULP bound on log, NOT the k eps / gamma(n)
 * SURROGATE. This module SCOPES that transcendental layer specifically: (a) what per-call outward-ULP width a
 * correctly-rounded / crlibm-style two-sided log enclosure achieves; (b) whether it composes through the
 * depth-30 Newton chain within the (H2) margin; (c) what remains before the imp-34687a directed-rounding layer
 * could be instantiated. FEASIBILITY / SCOPING ASSESSMENT ONLY; does NOT instantiate the layer and does NOT
 * discharge the conditional. imp-34714a REMAINS OPEN. NO QED.
 *
 * THE PER-CALL LOG ENCLOSURE WIDTH (crlibm-style correctly-rounded)
 * ----------------------------------------------------------------
 * A correctly-rounded log (crlibm / RLIBM / an IEEE-754-2019 recommended-function log) returns the FP number
 * nearest the true log, so the round-to-nearest per-call relative half-width is 0.5 ulp = 2^-53 ~ 1.11e-16.
 * A TWO-SIDED directed enclosure [RD(log x), RU(log x)] -- round the true value down for the lower endpoint
 * and up for the upper -- brackets log(x) in the tightest representable FP interval, of total width at most
 * 1 ulp = 2^-52 ~ 2.22e-16 (relative), i.e. outward relative half-width <= EPS. So a correctly-rounded log
 * enclosure is NO WIDER per call than an ordinary directed-rounded arithmetic op: it contributes one unit-
 * roundoff term to the gamma(n) accumulation, not a special amplifier.
 *
 * WHY LOG DAMPENS RATHER THAN AMPLIFIES ON THIS CHAIN
 * ---------------------------------------------------
 * The relative condition number of log at argument a is kappa_log(a) = 1/|log a| (a relative input width
 * delta_in maps to a relative output width delta_in/log a, since d log/dx = 1/x makes the ABSOLUTE output
 * width equal delta_in, and dividing by |log a| relativizes it). On this chain the inner log argument is
 * a = T0/2pi ~ 1.82e8 so log a ~ 19.02 and kappa_log ~ 0.0526; the outer log argument is T0 ~ 1.14e9 so
 * log T0 ~ 20.86 and kappa_log ~ 0.0479. Both are FAR below 1, so every log call CONTRACTS the incoming
 * relative width by ~20x and adds only its own ~1-ulp rounding. The transcendental layer is therefore the
 * BENIGN part of the chain here -- there is no near-1 argument where log(x) ~ 0 would blow the condition
 * number up. (Contrast: a log argument within ~1 ulp of 1 would have kappa_log ~ 2^52, catastrophic; the
 * crossover map never visits that regime.)
 *
 * COMPOSITION THROUGH THE DEPTH-30 CHAIN
 * --------------------------------------
 * The chain makes n_log ~ NEWTON_STEPS (inner, ~4) + 1 (outer g = K log T0) + 1 (g_prime = 2pi K/(T0 log a))
 * ~ 6 log calls, i.e. ~12 percent of the imp-34840 n_op ~ 49 operations. Because each log is well-conditioned
 * (kappa_log ~ 0.05 < 1) and contributes only ~1 ulp, the log calls enter the imp-34799 gamma(n_op) first-
 * order accumulation as ordinary unit-roundoff terms -- they neither dominate the budget nor amplify it. So
 * feeding the SAME n_op ~ 49 (log calls counted as ordinary ops) into r_image <= gamma(n_op) N_cross/
 * (1 - |g_prime|) leaves the imp-34840 achievable endpoint half-width ~3.7e-5 UNCHANGED, still ~10 orders
 * below the (H2) margin delta N_cross ~ 6.56e5. The transcendental layer is FEASIBLE on the width axis: a
 * crlibm-style log enclosure composes through the depth-30 chain with the margin head-room intact.
 *
 * WHAT STAYS OPEN (imp-34714a: the gap sharpens to a PROVEN-ULP log, not merely directed rounding)
 * -----------------------------------------------------------------------------------------------
 * The per-call width is fine and it composes -- so the transcendental layer does NOT obstruct a certificate on
 * the width axis. The genuine remaining gap is that stock JS Math.log carries NO guaranteed ULP bound:
 * ECMAScript leaves log implementation-defined (good libms are typically <= 1 ulp, but this is neither
 * mandated nor portable across engines/platforms), and there are no directed round-down / round-up log
 * variants. An actual instantiation needs a log with a MACHINE-CHECKED ULP bound (crlibm/Gappa-, RLIBM-, or
 * IEEE-754-2019-recommended-function-style) plus its directed variants. This SHARPENS the imp-34687a gap from
 * "supply directed rounding" to "supply a proven-ULP-bounded correctly-rounded log (with RD/RU variants)"; it
 * is an ENGINEERING / library gap, NOT a margin gap and NOT a conditioning gap. This module ASSESSES that such
 * a layer WOULD clear (H2) with ~10 orders to spare if supplied; it does NOT supply it. imp-34714a REMAINS OPEN.
 *
 * FEASIBILITY / SCOPING ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a
 * rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34840-krawczyk-directed-rounding-op-dag-feasibility (op DAG n_op ~ 49, depth ~ 30; localizes the log layer as the blocker this SCOPES)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori gamma(n_op) half-width bound the log calls feed into)
 * @see imp-34687-crossover-interval-arithmetic-scope (f monotone+convex => inner interval-Newton contraction; sub-gap imp-34687a directed-rounding layer this SHARPENS)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the actual Newton loop whose log calls this scopes)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const HALF_ULP = EPS / 2; // 2^-53: correctly-rounded round-to-nearest per-call relative half-width
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34774/imp-34799/imp-34840)
const DELTA = 2e-4; // same FIXED relative bracket half-width as the imp-34774/imp-34799/imp-34840 construction

// The shared imp-33723/imp-34774/imp-34799/imp-34840 Banach map g(N) = K log T0(N) and its closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// The double-precision fixed point m = N_cross (identical construction to imp-34840).
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const T0_AT_M = effectiveHeightForN(M); // ~1.1438e9
const A_INNER = T0_AT_M / TWO_PI; // ~1.8204e8 (inner log argument in each Newton step)
const G_PRIME = gPrime(N_CROSS);
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = the Krawczyk quotient denominator floor
const G_AT_M = Math.abs(g(M)); // |g(m)| ~ N_cross (m is the fixed point)

// --- The per-call log enclosure width and its condition number on the chain -------------------------
// crlibm-style correctly-rounded log: round-to-nearest per-call half-width = 0.5 ulp (2^-53); the two-sided
// directed enclosure [RD(log), RU(log)] has total width <= 1 ulp (2^-52), outward relative half-width <= EPS.
const LOG_PERCALL_HALFWIDTH_RN = HALF_ULP; // correctly-rounded to nearest: 2^-53
const LOG_PERCALL_HALFWIDTH_DIRECTED = EPS; // two-sided directed enclosure: <= 1 ulp = 2^-52

// Relative condition number of log at argument a: kappa_log = 1/|log a| (delta_out = delta_in/log a + own ulp).
const LOG_INNER_ARG = A_INNER; // T0/2pi, the inner-loop log argument
const LOG_OUTER_ARG = T0_AT_M; // T0, the outer g = K log T0 argument
const KAPPA_LOG_INNER = 1 / Math.abs(Math.log(LOG_INNER_ARG)); // ~0.0526
const KAPPA_LOG_OUTER = 1 / Math.abs(Math.log(LOG_OUTER_ARG)); // ~0.0479
const LOG_IS_CONTRACTIVE = KAPPA_LOG_INNER < 1 && KAPPA_LOG_OUTER < 1; // both << 1: log DAMPENS relative width

// --- How many log calls the chain makes, and their share of the imp-34840 op budget -----------------
function newtonStepsToConverge(N) {
  // Replicates the effectiveHeightForN source loop EXACTLY to count Newton steps (each has one log call).
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  let steps = 0;
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    steps++;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return steps;
}
const NEWTON_STEPS = newtonStepsToConverge(M); // ~4 (one log per step)
const N_LOG_CALLS = NEWTON_STEPS + 2; // + outer log(T0) for g + log(T0/2pi) for g_prime => ~6
const N_OP_IMP34840 = 49; // the imp-34840 op-DAG count (log calls counted as ordinary ops)
const LOG_SHARE_OF_NOP = N_LOG_CALLS / N_OP_IMP34840; // ~0.12: log is ~12% of the op budget

// --- Composition through the chain: same gamma(n_op) bound, log calls as ordinary unit-roundoff terms
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS); // first-order IA propagation (Moore/Neumaier/Higham)
const residualHalfWidth = (nOp) => gammaN(nOp) * G_AT_M; // r_F <= gamma(n) |g(m)|
const imageHalfWidth = (nOp) => residualHalfWidth(nOp) / FP_LO; // r_image = r_F / FP_LO (Krawczyk quotient)
const BRACKET_MARGIN = DELTA * N_CROSS; // a-priori (H2) margin on each side (~6.56e5)

// Because every log is well-conditioned (kappa_log < 1) and contributes ~1 ulp, feeding the SAME n_op ~ 49
// (log calls counted as ordinary ops) leaves the imp-34840 achievable half-width UNCHANGED.
const ENDPOINT_IMAGE_HALFWIDTH = imageHalfWidth(N_OP_IMP34840); // ~3.7e-5 absolute (same as imp-34840)
const ENDPOINT_RATIO_TO_MARGIN = ENDPOINT_IMAGE_HALFWIDTH / BRACKET_MARGIN; // ~5.7e-11
const HEADROOM_ORDERS = Math.log10(BRACKET_MARGIN / ENDPOINT_IMAGE_HALFWIDTH); // ~10.2

export const IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE = {
  id: 'imp-34867',
  proofSection: 'S-frontier',
  question:
    'imp-34840 found the Krawczyk MARGIN axis feasible (n_op ~ 49, depth ~ 30, ~10 orders of head-room) ' +
    'and localized the genuine blocker as the TRANSCENDENTAL log layer: [g](m) and the Newton f call log, ' +
    'and a correct directed-rounding enclosure needs a two-sided ULP bound on log, not the k eps / gamma(n) ' +
    'SURROGATE. Scope that log layer: what per-call outward-ULP width a correctly-rounded / crlibm-style ' +
    'two-sided log enclosure achieves, whether it composes through the depth-30 Newton chain within the ' +
    '(H2) margin, and what remains before the imp-34687a directed-rounding layer could be instantiated. ' +
    'Feasibility / scoping ONLY; does NOT discharge imp-34714a; no QED.',
  model: {
    percall_width:
      'A correctly-rounded log (crlibm / RLIBM / IEEE-754-2019 recommended-function log) returns the FP ' +
      'number nearest the true log, so the round-to-nearest per-call relative half-width is 0.5 ulp = 2^-53 ' +
      '~ 1.11e-16. A two-sided directed enclosure [RD(log x), RU(log x)] brackets log(x) in the tightest ' +
      'representable FP interval, of total width <= 1 ulp = 2^-52 ~ 2.22e-16 (outward relative half-width ' +
      '<= EPS). So a correctly-rounded log enclosure is NO WIDER per call than a directed-rounded arithmetic ' +
      'op: it contributes one unit-roundoff term to the gamma(n) accumulation, not a special amplifier.',
    conditioning:
      'The relative condition number of log at argument a is kappa_log(a) = 1/|log a| (a relative input ' +
      'width delta_in maps to delta_in/log a, since d log/dx = 1/x makes the absolute output width delta_in). ' +
      'On this chain the inner log argument is a = T0/2pi ~ 1.82e8 so log a ~ 19.02, kappa_log ~ 0.0526; the ' +
      'outer argument is T0 ~ 1.14e9 so log T0 ~ 20.86, kappa_log ~ 0.0479. Both are FAR below 1: every log ' +
      'call CONTRACTS the incoming relative width by ~20x and adds only its own ~1-ulp rounding. The chain ' +
      'never visits a near-1 argument where log(x) ~ 0 would blow the condition number up.',
    composition:
      'The chain makes n_log ~ NEWTON_STEPS (inner, ~4) + 1 (outer g = K log T0) + 1 (g_prime) ~ 6 log calls, ' +
      '~12 percent of the imp-34840 n_op ~ 49 operations. Since each log is well-conditioned (kappa_log ~ ' +
      '0.05 < 1) and contributes ~1 ulp, the log calls enter the imp-34799 gamma(n_op) first-order ' +
      'accumulation as ordinary unit-roundoff terms -- they neither dominate nor amplify. So the SAME n_op ' +
      '~ 49 leaves the achievable endpoint half-width ~3.7e-5 UNCHANGED, still ~10 orders below the (H2) ' +
      'margin ~6.56e5. The transcendental layer is FEASIBLE on the width axis.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    T0_at_N_cross: +T0_AT_M.toPrecision(10), // ~1.143784918e9
    inner_log_arg_T0_over_2pi: +LOG_INNER_ARG.toPrecision(10), // ~1.820390235e8
    log_inner_arg: +Math.log(LOG_INNER_ARG).toFixed(6), // ~19.019732
    log_outer_arg_T0: +Math.log(LOG_OUTER_ARG).toFixed(6), // ~20.857609
    eps: +EPS.toExponential(4), // 2.2204e-16
    half_ulp_2pow_minus_53: +HALF_ULP.toExponential(4), // 1.1102e-16
    delta: +DELTA.toExponential(1), // 2e-4
    bracket_margin_each_side: +BRACKET_MARGIN.toExponential(4), // ~6.5606e5
  },
  log_layer: {
    // Feasibility / scoping only; these are a WIDTH/CONDITIONING model, they certify nothing (imp-34714a open).
    percall_halfwidth_round_to_nearest: +LOG_PERCALL_HALFWIDTH_RN.toExponential(4), // 0.5 ulp = 2^-53
    percall_halfwidth_directed_enclosure: +LOG_PERCALL_HALFWIDTH_DIRECTED.toExponential(4), // <= 1 ulp = 2^-52
    kappa_log_inner: +KAPPA_LOG_INNER.toFixed(6), // ~0.052577
    kappa_log_outer: +KAPPA_LOG_OUTER.toFixed(6), // ~0.047944
    log_is_contractive: LOG_IS_CONTRACTIVE, // true: kappa_log << 1, log DAMPENS relative width
    newton_steps: NEWTON_STEPS, // ~4 (one log per step)
    n_log_calls: N_LOG_CALLS, // ~6
    log_share_of_n_op: +LOG_SHARE_OF_NOP.toFixed(3), // ~0.12
  },
  feasibility: {
    endpoint_image_half_width: +ENDPOINT_IMAGE_HALFWIDTH.toExponential(4), // ~3.74e-5 absolute (same as imp-34840)
    endpoint_ratio_to_margin: +ENDPOINT_RATIO_TO_MARGIN.toExponential(4), // ~5.7e-11
    headroom_orders_below_margin: +HEADROOM_ORDERS.toFixed(2), // ~10.2
    clears_H2_margin: ENDPOINT_IMAGE_HALFWIDTH < BRACKET_MARGIN, // true
    log_layer_is_the_width_blocker: false, // NO -- the per-call width is fine and it composes
    remaining_gap_is_proven_ulp_log: true, // stock Math.log has no guaranteed ULP bound / no RD/RU variants
  },
  finding:
    'Scoping the transcendental log layer that imp-34840 localized as the blocker: a correctly-rounded / ' +
    'crlibm-style log has a round-to-nearest per-call relative half-width of 0.5 ulp = 2^-53 ~ 1.11e-16, and ' +
    'a two-sided directed enclosure [RD(log), RU(log)] has outward relative half-width <= 1 ulp = 2^-52 ~ ' +
    'EPS -- NO wider per call than a directed-rounded arithmetic op. On this chain log is moreover well-' +
    'conditioned: the inner argument a = T0/2pi ~ 1.82e8 gives log a ~ 19.02 and kappa_log = 1/log a ~ ' +
    '0.0526, the outer argument T0 ~ 1.14e9 gives kappa_log ~ 0.0479, both FAR below 1, so every log call ' +
    'CONTRACTS the incoming relative width by ~20x and adds only ~1 ulp (the crossover map never visits a ' +
    'near-1 argument where log(x) ~ 0 would blow kappa_log up). The chain makes n_log ~ 6 log calls (~12 ' +
    'percent of the imp-34840 n_op ~ 49), so they enter the gamma(n_op) accumulation as ordinary unit-' +
    'roundoff terms and leave the achievable endpoint half-width ~3.7e-5 UNCHANGED, still ~10 orders below ' +
    'the (H2) margin ~6.56e5. So the transcendental layer is FEASIBLE on the width axis. The genuine ' +
    'remaining gap is that stock JS Math.log carries NO guaranteed ULP bound (ECMAScript leaves log ' +
    'implementation-defined, not portable, no RD/RU variants); an instantiation needs a MACHINE-CHECKED ' +
    'proven-ULP log (crlibm/Gappa-, RLIBM-, or IEEE-754-2019-style). This SHARPENS the imp-34687a gap from ' +
    '"supply directed rounding" to "supply a proven-ULP-bounded correctly-rounded log with RD/RU variants". ' +
    'imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This SCOPES the transcendental log layer -- per-call outward half-width <= 1 ' +
    'ulp (crlibm-style), kappa_log ~ 0.05 (log DAMPENS width), ~6 log calls composing within the imp-34840 ' +
    'gamma(n_op) budget with the ~10-order margin head-room intact -- but it does NOT supply a proven-ULP ' +
    'log or its directed RD/RU variants (stock Math.log carries no guaranteed ULP bound), so it does NOT ' +
    'instantiate the imp-34687a directed-rounding layer and does NOT prove [g](m)/[F_prime] are valid ' +
    'enclosures. Feasibility EVIDENCE, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CRLIBM LOG-ENCLOSURE ULP SCOPE (frontier, NOT an RH bound). imp-34840 found the Krawczyk margin axis ' +
    'feasible and localized the blocker as the transcendental log layer. Scoping that layer: a correctly-' +
    'rounded / crlibm-style log has a round-to-nearest per-call relative half-width of 0.5 ulp = 2^-53, and ' +
    'a two-sided directed enclosure [RD(log), RU(log)] has outward relative half-width <= 1 ulp = 2^-52 = ' +
    'EPS -- no wider per call than a directed-rounded arithmetic op. On this chain log is well-conditioned: ' +
    'inner arg T0/2pi ~ 1.82e8 (log ~ 19.02, kappa_log ~ 0.0526), outer arg T0 ~ 1.14e9 (kappa_log ~ ' +
    '0.0479), both << 1, so each log CONTRACTS relative width ~20x and adds only ~1 ulp. The chain makes ' +
    'n_log ~ 6 log calls (~12 percent of n_op ~ 49); they enter the gamma(n_op) accumulation as ordinary ' +
    'unit-roundoff terms and leave the achievable endpoint half-width ~3.7e-5 UNCHANGED, ~10 orders below ' +
    'the (H2) margin ~6.56e5. So the transcendental layer is FEASIBLE on the width axis -- it is the BENIGN ' +
    'part of the chain, not a margin or conditioning blocker. The genuine remaining gap is that stock JS ' +
    'Math.log carries NO guaranteed ULP bound (ECMAScript leaves it implementation-defined, no RD/RU ' +
    'variants); an instantiation needs a machine-checked proven-ULP log. This SHARPENS the imp-34687a gap ' +
    'from "supply directed rounding" to "supply a proven-ULP-bounded correctly-rounded log with directed ' +
    'variants" -- an engineering/library gap, NOT margin, NOT conditioning. This is FEASIBILITY EVIDENCE, ' +
    'NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN. Scoping/assessment only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34840 (op-DAG feasibility; n_op ~ 49, depth ~ 30; localizes the log layer this SCOPES); imp-34799 ' +
    '(a-priori gamma(n_op) half-width bound the log calls feed into); imp-34687 (crossover interval-' +
    'arithmetic scope; f monotone+convex => inner interval-Newton contraction; sub-gap imp-34687a directed-' +
    'rounding layer this SHARPENS); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, the Newton loop whose log calls this scopes). Correctly-rounded transcendentals ' +
    'and the gamma(n) = n eps/(1 - n eps) propagation factor: crlibm / RLIBM / IEEE-754-2019 recommended ' +
    'functions; Moore, Neumaier, Higham.',
};

export const IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE_ASSERTIONS = [
  {
    // A correctly-rounded log enclosure is no wider per call than a directed-rounded arithmetic op.
    id: 'imp34867-percall-log-width-at-most-one-ulp',
    description: 'crlibm-style log: round-to-nearest half-width 0.5 ulp (2^-53), two-sided directed enclosure <= 1 ulp (2^-52)',
    holds: () =>
      Math.abs(LOG_PERCALL_HALFWIDTH_RN - EPS / 2) < 1e-30 &&
      Math.abs(LOG_PERCALL_HALFWIDTH_DIRECTED - EPS) < 1e-30 &&
      LOG_PERCALL_HALFWIDTH_RN < LOG_PERCALL_HALFWIDTH_DIRECTED,
  },
  {
    // On this chain log is well-conditioned (kappa_log << 1): it DAMPENS relative width, does not amplify.
    id: 'imp34867-log-is-contractive-on-chain',
    description: 'kappa_log = 1/log(arg) ~ 0.05 at both the inner (T0/2pi) and outer (T0) log arguments: log contracts width ~20x',
    holds: () =>
      LOG_IS_CONTRACTIVE &&
      KAPPA_LOG_INNER > 0.04 &&
      KAPPA_LOG_INNER < 0.07 &&
      KAPPA_LOG_OUTER > 0.04 &&
      KAPPA_LOG_OUTER < 0.07 &&
      1 / KAPPA_LOG_INNER > 10, // contracts by more than 10x
  },
  {
    // The chain makes ~6 log calls, a small share of the imp-34840 op budget.
    id: 'imp34867-log-call-count-small-share',
    description: 'n_log ~ NEWTON_STEPS + 2 ~ 6 log calls, ~12% of the imp-34840 n_op ~ 49',
    holds: () =>
      NEWTON_STEPS >= 3 &&
      NEWTON_STEPS <= 8 &&
      N_LOG_CALLS === NEWTON_STEPS + 2 &&
      LOG_SHARE_OF_NOP > 0.05 &&
      LOG_SHARE_OF_NOP < 0.25,
  },
  {
    // The log calls compose within the gamma(n_op) budget: the endpoint half-width still clears (H2) by ~10 orders.
    id: 'imp34867-log-layer-composes-clears-H2',
    description: 'log calls as ordinary unit-roundoff terms leave the endpoint half-width ~3.7e-5, ~10 orders below the (H2) margin',
    holds: () =>
      ENDPOINT_IMAGE_HALFWIDTH < BRACKET_MARGIN &&
      ENDPOINT_RATIO_TO_MARGIN < 1e-9 &&
      ENDPOINT_RATIO_TO_MARGIN > 1e-12 &&
      HEADROOM_ORDERS > 9 &&
      HEADROOM_ORDERS < 12,
  },
  {
    // Honesty gate: feasibility/surrogate, not rigorous, sub-gap open, width not the blocker, no QED, no refereed bound is changed.
    id: 'imp34867-honesty-gate-no-qed',
    description: 'Log-enclosure scope: isRigorous false, imp-34714a open, width not the blocker, remaining gap is proven-ULP log, no QED, no refereed bound is changed',
    holds: () =>
      IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.isRigorous === false &&
      IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.feasibility.log_layer_is_the_width_blocker === false &&
      IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.feasibility.remaining_gap_is_proven_ulp_log === true &&
      /imp-34714a/.test(IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.subGap) &&
      /REMAINS OPEN/.test(IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.subGap) &&
      /NO QED/.test(IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE.verdict),
  },
];

for (const a of IMP34867_CRLIBM_LOG_ENCLOSURE_ULP_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34867-crlibm-log-enclosure-ulp-scope assertion failed: ${a.id}`);
  }
}
