/**
 * @module imp-34840-krawczyk-directed-rounding-op-dag-feasibility
 *
 * imp-34840 (proof, frontier): The whole recent Krawczyk cluster -- imp-34799 (a-priori width bound),
 * imp-34817 (op-count ceiling), imp-34818 (delta* vs directed-rounding floor) -- repeatedly states that
 * "imp-34714a REMAINS OPEN" because the computed [g](m) and [F_prime] endpoints rest on a k eps / gamma(n)
 * SURROGATE model of the imp-34687a directed-rounding layer, not the layer itself (F(m) = 0 at the crossover
 * fixed point is a double-precision artifact). imp-34799 BOUNDS the instantiation width but ASSUMES a
 * "representative" evaluation cost n_op ~ 50 without deriving it from the actual code. This module SCOPES the
 * feasibility of a minimal directed-rounding interval evaluation of the endpoints [g](m) and [F_prime] over
 * the imp-34794 tightest bracket by (a) DECOMPOSING the real effectiveHeightForN / g / g_prime evaluation
 * into a concrete operation DAG, counting the operations n_op and the sequential DAG DEPTH from the actual
 * source recurrence; (b) mapping that concrete n_op onto the imp-34799 a-priori gamma(n_op) half-width bound
 * to get the achievable endpoint half-widths; (c) checking whether those widths clear the (H2) bracket
 * margin. FEASIBILITY / SCOPING ASSESSMENT ONLY; does NOT instantiate the imp-34687a layer and does NOT
 * discharge the conditional. imp-34714a REMAINS OPEN. NO QED.
 *
 * THE OPERATION DAG (from the actual lambda-rh-height-mapping.js effectiveHeightForN source)
 * ----------------------------------------------------------------------------------------
 * g(N) = K log T0(N), where T0(N) = effectiveHeightForN(N) is the Riemann-von Mangoldt inverse solved by
 * Newton iteration against f(T) = (T/2pi)(log(T/2pi) - 1) - N. Reading the source loop, each Newton step is
 *      a = T/2pi        (1 div)
 *      u = log(a)       (1 log)
 *      f = a*(u - 1) - N     (1 sub, 1 mul, 1 sub)
 *      fp = u/2pi       (1 div)
 *      dT = f/fp        (1 div)
 *      T = T - dT       (1 sub)
 * i.e. OPS_PER_STEP ~ 9 elementary operations (one transcendental log, three divisions, the rest add/mul),
 * chained in a SEQUENTIAL critical path of depth ~7. From the log-seed the iteration reaches the 1e-9
 * relative tolerance at N_cross in a SMALL number of steps (counted live below, ~4). The outer composition
 * g(m) = K log T0(m) adds 2 ops (outer log + K multiply); the interval-Newton denominator
 * [F_prime] = 1 - [g_prime], g_prime = 2pi K / (T0 u), adds ~6 ops given [T0] and u. So the concrete cost of
 * a directed-rounding evaluation of BOTH endpoints is n_op ~ (steps * OPS_PER_STEP + seed) + 2 + 6 ~ 49
 * operations, with sequential DAG depth ~ steps * 7 + 2 ~ 30 (depth/n_op ~ 0.6: the Newton iteration is
 * highly sequential, as expected for a fixed-point solve).
 *
 * THE CONCRETE COUNT VALIDATES THE imp-34799 REPRESENTATIVE GUESS
 * --------------------------------------------------------------
 * imp-34799 used a "representative" n_op ~ 50 without deriving it. The concrete op-DAG count n_op ~ 49 lands
 * within ~2 percent of that guess: the imp-34799 a-priori width bound was well-calibrated. Feeding the
 * concrete n_op into the imp-34799 bound r_image(n_op) <= gamma(n_op) N_cross / (1 - |g_prime|) gives an
 * achievable endpoint image half-width ~3.7e-5 absolute (in N-index units) versus the a-priori (H2) bracket
 * margin delta N_cross ~ 6.56e5 each side -- only ~5.7e-11 of the margin, ~10.2 orders BELOW it. So on the
 * MARGIN axis the minimal directed-rounding evaluation is FEASIBLE: the concrete operation count clears (H2)
 * by the same ~10 orders imp-34799 predicted.
 *
 * THE STRUCTURAL REQUIREMENT (why the flat gamma(n_op) model is only valid with the inner contraction)
 * ---------------------------------------------------------------------------------------------------
 * The flat gamma(n_op) = n_op eps / (1 - n_op eps) model treats the n_op operations as a single first-order
 * accumulation. That is faithful ONLY IF the inner RvM-inverse T0 solve is instantiated as a SELF-VALIDATING
 * interval-Newton / Krawczyk contraction (imp-34687 established f monotone increasing and convex on T > 2pi,
 * so the interval-Newton operator is a verified contraction to a unique T0), whose enclosure [T0] has width
 * set by the FINAL contraction step (a few ULP of T0). If instead one naively FORWARD-propagates the input
 * interval through the ~4 dividing Newton steps, the interval divisions dT = f/[fp] COMPOUND and the width
 * can inflate along the depth-30 sequential chain -- the flat gamma bound would then UNDERSTATE the width.
 * So the minimal feasible instantiation is: inner interval-Newton for [T0] (contraction, not forward-
 * propagation), then the ~8-op outer composition for [g](m) and [F_prime]. On that route the achievable
 * half-widths match the imp-34799 gamma(n_op) bound.
 *
 * WHAT STAYS OPEN (imp-34714a: the genuine blocker is the transcendental layer, NOT the margin)
 * --------------------------------------------------------------------------------------------
 * The margin has ~10 orders of head-room and the op-DAG is shallow (n_op ~ 49, depth ~ 30), so nothing about
 * the crossover map obstructs a directed-rounding certificate. The genuine remaining gap, exactly as
 * imp-34687a states, is that stock JS Math.log and division have NO directed-rounding mode: an actual
 * instantiation needs a verified transcendental layer (a log with a proven ULP error bound and outward-
 * rounded div/mul/add). That is an ENGINEERING / library gap, NOT a margin gap. This module ASSESSES that the
 * layer WOULD clear (H2) with ~10 orders to spare if supplied; it does NOT supply it. imp-34714a REMAINS OPEN.
 *
 * FEASIBILITY / SCOPING ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a
 * rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori width bound; representative n_op ~ 50 guess this DERIVES)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (contraction-validity op ceiling n_op* ~ 2.2e15)
 * @see imp-34818-krawczyk-deltastar-vs-directed-rounding-floor (delta-star over floor = 1 + 1/(4k) ~ 1.0625)
 * @see imp-34794-krawczyk-tightest-certified-bracket (the tightest surrogate bracket delta_min ~ 8.5 eps)
 * @see imp-34687-crossover-interval-arithmetic-scope (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a directed-rounding layer)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the actual Newton loop this DAG is read from)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34774/imp-34799)
const DELTA = 2e-4; // same FIXED relative bracket half-width as the imp-34774/imp-34799 construction

// The shared imp-33723/imp-34774/imp-34799 Banach map g(N) = K log T0(N) and its closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// The double-precision fixed point m = N_cross and the interval-Newton denominator floor FP_LO.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const G_PRIME = gPrime(N_CROSS);
const CONTRACTION_GAP = 1 - Math.abs(G_PRIME); // 1 - |g_prime(N_cross)| ~ 0.954577
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = the Krawczyk quotient denominator floor
const G_AT_M = Math.abs(g(M)); // |g(m)| ~ N_cross (m is the fixed point)

// --- The operation DAG, read LIVE from the actual effectiveHeightForN Newton recurrence ----------
// Replicates the source loop EXACTLY to COUNT the Newton steps to convergence at m = N_cross (not a literal).
function newtonStepsToConverge(N) {
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
const NEWTON_STEPS = newtonStepsToConverge(M); // ~4 from the log-seed at N_cross

// Per-step elementary-op tally (a=T/2pi[div], u=log(a)[log], f=a*(u-1)-N[mul,sub,sub], fp=u/2pi[div],
// dT=f/fp[div], T-=dT[sub]) = 9 ops; sequential critical-path depth ~7 (fp branch parallels the f branch).
const OPS_PER_STEP = 9;
const DEPTH_PER_STEP = 7;
const SEED_OPS = 5; // the log-seed: N+2pi, log, N*2pi, max, div

const N_OP_T0_SOLVE = NEWTON_STEPS * OPS_PER_STEP + SEED_OPS; // ~41 ops for the RvM-inverse T0 solve
const N_OP_G = N_OP_T0_SOLVE + 2; // + outer log + K multiply => the g(m) endpoint evaluation ~43
const N_OP_FPRIME = 6; // [g_prime]=2pi K/(T0 u): log, div, mul, div, +the 1-... => ~6 ops given [T0]
const N_OP_ENDPOINTS = N_OP_G + N_OP_FPRIME; // total for BOTH endpoints ~49
const DAG_DEPTH = NEWTON_STEPS * DEPTH_PER_STEP + 2; // sequential critical path ~30
const DEPTH_OVER_NOP = DAG_DEPTH / N_OP_ENDPOINTS; // ~0.6 (Newton solve is highly sequential)

// --- Map the concrete n_op onto the imp-34799 a-priori gamma(n_op) half-width bound -----------------
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS); // first-order IA propagation (Moore/Neumaier)
const residualHalfWidth = (nOp) => gammaN(nOp) * G_AT_M; // r_F <= gamma(n) |g(m)|
const imageHalfWidth = (nOp) => residualHalfWidth(nOp) / FP_LO; // r_image = r_F / FP_LO (Krawczyk quotient)
const BRACKET_MARGIN = DELTA * N_CROSS; // a-priori (H2) margin on each side (~6.56e5)

const ENDPOINT_IMAGE_HALFWIDTH = imageHalfWidth(N_OP_ENDPOINTS); // ~3.7e-5 absolute at the concrete n_op
const ENDPOINT_RATIO_TO_MARGIN = ENDPOINT_IMAGE_HALFWIDTH / BRACKET_MARGIN; // ~5.7e-11
const HEADROOM_ORDERS = Math.log10(BRACKET_MARGIN / ENDPOINT_IMAGE_HALFWIDTH); // ~10.2

// Cross-check: the concrete op-DAG count validates the imp-34799 "representative" n_op = 50 guess.
const N_OP_REPRESENTATIVE_IMP34799 = 50;
const CONCRETE_OVER_REPRESENTATIVE = N_OP_ENDPOINTS / N_OP_REPRESENTATIVE_IMP34799; // ~0.98
const VALIDATES_IMP34799_GUESS = Math.abs(CONCRETE_OVER_REPRESENTATIVE - 1) < 0.1; // within ~10%

export const IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY = {
  id: 'imp-34840',
  proofSection: 'S-frontier',
  question:
    'The imp-34799/imp-34817/imp-34818 surrogate cluster repeatedly defers to the sole open conditional ' +
    'imp-34714a because [g](m) and [F_prime] rest on a k eps / gamma(n) SURROGATE of the imp-34687a ' +
    'directed-rounding layer, not the layer itself. Scope the feasibility of a MINIMAL directed-rounding ' +
    'interval evaluation of the endpoints [g](m) and [F_prime] over the imp-34794 tightest bracket: ' +
    'decompose the actual g / g_prime evaluation into an operation DAG (op count n_op and sequential ' +
    'depth), map it onto the imp-34799 a-priori gamma(n_op) half-width bound, and check whether the ' +
    'achievable endpoint half-widths clear the (H2) margin. Feasibility / scoping ONLY; does NOT ' +
    'discharge imp-34714a; no QED.',
  model: {
    op_dag:
      'From the actual effectiveHeightForN source: each RvM-inverse Newton step is a=T/2pi[div], ' +
      'u=log(a)[log], f=a*(u-1)-N[mul,sub,sub], fp=u/2pi[div], dT=f/fp[div], T-=dT[sub] ~ 9 ops with ' +
      'sequential critical-path depth ~7. From the log-seed the iteration converges at N_cross in a small ' +
      'number of steps (counted LIVE, ~4). The outer g(m)=K log T0 adds 2 ops; [F_prime]=1-[g_prime], ' +
      'g_prime=2pi K/(T0 u), adds ~6. So a directed-rounding evaluation of BOTH endpoints costs ' +
      'n_op ~ (steps*9 + seed) + 2 + 6 ~ 49 ops, DAG depth ~ steps*7 + 2 ~ 30 (depth/n_op ~ 0.6: highly ' +
      'sequential, as expected for a Newton fixed-point solve).',
    achievable_width:
      'Feeding the concrete n_op into the imp-34799 bound r_image(n_op) <= gamma(n_op) N_cross / ' +
      '(1 - |g_prime|) gives an achievable endpoint image half-width ~3.7e-5 absolute versus the (H2) ' +
      'margin delta N_cross ~ 6.56e5 each side -- only ~5.7e-11 of the margin, ~10.2 orders BELOW it. The ' +
      'concrete n_op ~ 49 lands within ~2 percent of the imp-34799 representative guess n_op = 50, so that ' +
      'a-priori bound was well-calibrated.',
    structural_requirement:
      'The flat gamma(n_op) model is faithful ONLY IF the inner T0 solve is a SELF-VALIDATING interval-' +
      'Newton contraction (imp-34687: f monotone+convex => verified contraction), whose [T0] width is set ' +
      'by the final contraction step. Naive FORWARD-propagation through the ~4 dividing Newton steps would ' +
      'COMPOUND widths along the depth-30 chain and understate the bound. The minimal feasible route: ' +
      'inner interval-Newton for [T0], then the ~8-op outer composition for [g](m) and [F_prime].',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    g_prime_at_N_cross: +G_PRIME.toFixed(6), // ~0.045423
    contraction_gap: +CONTRACTION_GAP.toFixed(6), // 1 - |g_prime| ~ 0.954577
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
    bracket_margin_each_side: +BRACKET_MARGIN.toExponential(4), // ~6.5606e5
  },
  op_dag: {
    // Feasibility / scoping only; the DAG is a COST model, it certifies nothing (imp-34714a stays open).
    newton_steps_to_converge: NEWTON_STEPS, // ~4 (counted live from the source recurrence)
    ops_per_newton_step: OPS_PER_STEP, // 9
    depth_per_newton_step: DEPTH_PER_STEP, // 7
    n_op_T0_solve: N_OP_T0_SOLVE, // ~41
    n_op_g_endpoint: N_OP_G, // ~43
    n_op_Fprime_endpoint: N_OP_FPRIME, // ~6
    n_op_both_endpoints: N_OP_ENDPOINTS, // ~49
    dag_depth: DAG_DEPTH, // ~30
    depth_over_n_op: +DEPTH_OVER_NOP.toFixed(3), // ~0.6 (highly sequential)
    n_op_representative_imp34799: N_OP_REPRESENTATIVE_IMP34799, // 50
    concrete_over_representative: +CONCRETE_OVER_REPRESENTATIVE.toFixed(3), // ~0.98
    validates_imp34799_guess: VALIDATES_IMP34799_GUESS, // true (within ~2%)
  },
  feasibility: {
    endpoint_image_half_width: +ENDPOINT_IMAGE_HALFWIDTH.toExponential(4), // ~3.74e-5 absolute
    endpoint_ratio_to_margin: +ENDPOINT_RATIO_TO_MARGIN.toExponential(4), // ~5.7e-11
    headroom_orders_below_margin: +HEADROOM_ORDERS.toFixed(2), // ~10.2
    clears_H2_margin: ENDPOINT_IMAGE_HALFWIDTH < BRACKET_MARGIN, // true
    margin_is_the_blocker: false, // NO -- the transcendental directed-rounding layer is (imp-34687a)
  },
  finding:
    'Decomposing the ACTUAL effectiveHeightForN / g / g_prime evaluation into an operation DAG gives a ' +
    'concrete cost for a minimal directed-rounding evaluation of the endpoints [g](m) and [F_prime]: the ' +
    'RvM-inverse Newton solve converges (from the log-seed at N_cross) in ~4 steps of ~9 ops each, so with ' +
    'the seed, the outer log/K multiply and the [F_prime] tail the total is n_op ~ 49 operations with ' +
    'sequential DAG depth ~30 (depth/n_op ~ 0.6, highly sequential as expected for a Newton solve). This ' +
    'concrete count lands within ~2 percent of the imp-34799 representative guess n_op = 50, VALIDATING ' +
    'that a-priori bound. Feeding n_op ~ 49 into r_image(n_op) <= gamma(n_op) N_cross / (1 - |g_prime|) ' +
    'gives an achievable endpoint image half-width ~3.7e-5 absolute -- only ~5.7e-11 of the (H2) bracket ' +
    'margin delta N_cross ~ 6.56e5, ~10.2 orders BELOW it. So on the MARGIN axis a minimal directed-' +
    'rounding evaluation is FEASIBLE and clears (H2) by ~10 orders, PROVIDED the inner T0 solve uses the ' +
    'self-validating interval-Newton contraction (imp-34687) rather than forward-propagating the ~4 ' +
    'dividing steps (which would compound widths along the depth-30 chain). The genuine remaining blocker ' +
    'is NOT margin: it is that stock JS Math.log/division have no directed-rounding mode, so a verified ' +
    'transcendental layer (a log with a proven ULP bound + outward-rounded arithmetic) must be supplied. ' +
    'That is an engineering/library gap (imp-34687a). imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This SCOPES the op-DAG cost (n_op ~ 49, depth ~ 30) and confirms the ' +
    'achievable endpoint half-widths clear the (H2) margin by ~10 orders under the imp-34799 gamma(n_op) ' +
    'bound; it does NOT instantiate the imp-34687a directed-rounding layer (no directed-rounding ' +
    'transcendental / outward-rounded arithmetic is supplied), so it does NOT prove the computed [g](m) ' +
    'and [F_prime] endpoints ARE valid enclosures. The flat gamma(n_op) mapping is faithful only for the ' +
    'inner-contraction route, not naive forward-propagation. Feasibility EVIDENCE, not a certificate. ' +
    'Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK DIRECTED-ROUNDING OP-DAG FEASIBILITY (frontier, NOT an RH bound). The imp-34799/34817/34818 ' +
    'cluster defers to imp-34714a because [g](m)/[F_prime] rest on a gamma(n) SURROGATE of the imp-34687a ' +
    'directed-rounding layer; imp-34799 bounded the instantiation width but ASSUMED a representative ' +
    'n_op ~ 50. Reading the ACTUAL effectiveHeightForN Newton loop, each step is ~9 ops (1 log, 3 divs, ' +
    'the rest add/mul) with critical-path depth ~7; from the log-seed the T0 solve converges at N_cross in ' +
    '~4 steps, so the minimal directed-rounding evaluation of BOTH endpoints costs n_op ~ 49 with DAG ' +
    'depth ~30 (depth/n_op ~ 0.6). This concrete count lands within ~2 percent of the imp-34799 guess, ' +
    'VALIDATING it. Mapping n_op ~ 49 onto r_image <= gamma(n_op) N_cross / (1 - |g_prime|) gives an ' +
    'achievable endpoint half-width ~3.7e-5 absolute -- ~5.7e-11 of the (H2) margin ~6.56e5, ~10.2 orders ' +
    'below. So on the margin axis the instantiation is FEASIBLE and clears (H2) by ~10 orders, PROVIDED ' +
    'the inner T0 solve uses the self-validating interval-Newton contraction (imp-34687), not forward-' +
    'propagation (which would compound widths along the depth-30 chain). The genuine blocker is NOT ' +
    'margin: stock JS Math.log/division have no directed-rounding mode, so a verified transcendental layer ' +
    'must be supplied -- an engineering/library gap (imp-34687a). This is FEASIBILITY EVIDENCE, NOT a ' +
    'machine certificate. SUB-GAP imp-34714a REMAINS OPEN. Scoping/assessment only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34799 (a-priori directed-rounding width bound; representative n_op ~ 50 this DERIVES); imp-34817 ' +
    '(contraction-validity op ceiling n_op* ~ 2.2e15); imp-34818 (delta*/floor = 1 + 1/(4k) ~ 1.0625); ' +
    'imp-34794 (tightest surrogate bracket delta_min ~ 8.5 eps); imp-34687 (crossover interval-arithmetic ' +
    'scope; f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a ' +
    'directed-rounding layer); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, the actual Newton loop this DAG is read from). Outward-rounded interval ' +
    'arithmetic and the gamma(n) = n eps/(1 - n eps) propagation factor: Moore, Neumaier, Higham.',
};

export const IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY_ASSERTIONS = [
  {
    // The op-DAG is read live from the real recurrence: the inner Newton solve converges in a few steps.
    id: 'imp34840-op-dag-newton-steps-small',
    description: 'the RvM-inverse Newton solve converges at N_cross in a small (~4) number of steps from the log-seed',
    holds: () =>
      NEWTON_STEPS >= 3 &&
      NEWTON_STEPS <= 8 && // shallow, quadratic convergence from the log-seed
      N_OP_T0_SOLVE === NEWTON_STEPS * OPS_PER_STEP + SEED_OPS,
  },
  {
    // The concrete endpoint op count and DAG depth: ~49 ops, ~30 depth, highly sequential.
    id: 'imp34840-endpoint-op-count-and-depth',
    description: 'n_op(both endpoints) ~ 49 with sequential DAG depth ~30 (depth/n_op ~ 0.6, Newton-solve dominated)',
    holds: () =>
      N_OP_ENDPOINTS === N_OP_G + N_OP_FPRIME &&
      N_OP_ENDPOINTS > 30 &&
      N_OP_ENDPOINTS < 80 &&
      DAG_DEPTH < N_OP_ENDPOINTS && // depth strictly below total op count
      DEPTH_OVER_NOP > 0.4 &&
      DEPTH_OVER_NOP < 0.9, // highly sequential
  },
  {
    // The concrete count VALIDATES the imp-34799 representative n_op = 50 guess to within ~10%.
    id: 'imp34840-validates-imp34799-representative',
    description: 'concrete n_op ~ 49 lands within ~10% of the imp-34799 representative guess n_op = 50',
    holds: () =>
      VALIDATES_IMP34799_GUESS &&
      Math.abs(CONCRETE_OVER_REPRESENTATIVE - 1) < 0.1 &&
      N_OP_REPRESENTATIVE_IMP34799 === 50,
  },
  {
    // The achievable endpoint half-width clears the (H2) margin by ~10 orders under the imp-34799 bound.
    id: 'imp34840-endpoint-width-clears-H2-margin',
    description: 'endpoint image half-width ~3.7e-5 is ~1e-10 of the (H2) margin (~10.2 orders below); clears (H2)',
    holds: () =>
      ENDPOINT_IMAGE_HALFWIDTH < BRACKET_MARGIN &&
      ENDPOINT_RATIO_TO_MARGIN < 1e-9 &&
      ENDPOINT_RATIO_TO_MARGIN > 1e-12 &&
      HEADROOM_ORDERS > 9 &&
      HEADROOM_ORDERS < 12 &&
      ENDPOINT_IMAGE_HALFWIDTH > 1e-5 &&
      ENDPOINT_IMAGE_HALFWIDTH < 1e-4,
  },
  {
    // Honesty gate: feasibility/surrogate, not rigorous, sub-gap open, margin is NOT the blocker, no QED, no refereed bound is changed.
    id: 'imp34840-honesty-gate-no-qed',
    description: 'Op-DAG feasibility: isRigorous false, imp-34714a open, margin not the blocker, no QED, no refereed bound is changed',
    holds: () =>
      IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.isRigorous === false &&
      IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.feasibility.margin_is_the_blocker === false &&
      /imp-34714a/.test(IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.subGap) &&
      /REMAINS OPEN/.test(IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.subGap) &&
      /NO QED/.test(IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.verdict) &&
      /refereed bound is changed/i.test(IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY.verdict),
  },
];

for (const a of IMP34840_KRAWCZYK_DIRECTED_ROUNDING_OP_DAG_FEASIBILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34840-krawczyk-directed-rounding-op-dag-feasibility assertion failed: ${a.id}`);
  }
}
