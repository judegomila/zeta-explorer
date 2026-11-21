/**
 * @module imp-34908-krawczyk-certificate-precision-scope
 *
 * imp-34908 (proof, frontier): the imp-34865/34883/34884/34889 forward-breach and headroom modules all
 * defer to the imp-34714a certified transcendental (Krawczyk existence-uniqueness) layer, which REMAINS
 * OPEN. Their shared arithmetic model is the imp-34799 a-priori first-order surrogate: a DOUBLE-precision
 * evaluation whose residual half-width is BOUNDED by gamma(n_op) |g(m)| = n_op eps / (1 - n_op eps) times
 * |g(m)|, with the machine fixed point rounding to F(m) = 0 EXACTLY. That F(m) = 0 is a double-precision
 * ARTIFACT (the surrogate assumes a well-behaved n_op-op directed-rounding evaluation rather than
 * instantiating one), and gamma(n_op) eps is a first-order OUTWARD-ROUNDING PROXY, not the imp-34687a
 * directed-rounding layer. This module SCOPES what a machine-checkable Krawczyk certificate would require
 * to REPLACE that surrogate: (A) which interval primitives must be correctly-rounded; (B) the residual
 * budget of the four-site transcendental log evaluations; (C) where extended precision is mandatory; and
 * (D) a double-vs-extended feasibility verdict. SCOPING / FEASIBILITY ASSESSMENT ONLY: does NOT instantiate
 * the layer, does NOT discharge the conditional, imp-34714a REMAINS OPEN, imp-34687a REMAINS OPEN, NO QED.
 * No refereed bound is changed.
 *
 * (A) WHICH INTERVAL PRIMITIVES MUST BE CORRECTLY-ROUNDED
 * -------------------------------------------------------
 * A Krawczyk certificate proves (H1) 0 not in [f_prime] and (H2) N([T]) subset int([T]) from the COMPUTED
 * f(m) and [f_prime]; both must be proven OUTWARD enclosures of the exact reals (imp-34714). That forces
 * every op in the effectiveHeightForN / g / g_prime DAG to have a directed [RD, RU] primitive:
 *   +, -, * : IEEE-754-2019 CORRECTLY ROUNDED, so [RD, RU] are exact hardware rounds -- but ECMAScript
 *             exposes no rounding-mode control (no fesetround), so in pure JS they need error-free
 *             transformation (TwoSum / TwoProduct / Dekker) emulation.
 *   /       : IEEE-754 correctly rounded, but the JS "/" gives only the round-to-nearest result; a
 *             directed [RD, RU] quotient needs a residual-corrected quotient build (the SOLE
 *             non-IEEE-754-exposed basic op per imp-34885; measured by the sibling imp-34910 ticket).
 *   max     : exact monotone endpoint selection; needs no rounding.
 *   consts  : 2pi, e, K = (C_C / E_trunc)^2 need one-time outward [RD, RU] enclosures.
 *   log     : NOT correctly-rounded-MANDATED by IEEE-754 (only RECOMMENDED); the ONE artifact that stays
 *             external (crlibm / RLIBM / MPFR) or must be manufactured in extended precision (see (C)).
 * NET: every basic op is correctly-rounded at the HARDWARE level; the certificate gap is purely that JS
 * exposes neither directed rounding modes nor a proven-ULP log, so the surrogate's gamma(n_op) eps proxy
 * must be replaced op-by-op with outward-rounded primitives.
 *
 * (B) RESIDUAL BUDGET OF THE FOUR-SITE TRANSCENDENTAL LOG EVALUATIONS
 * ------------------------------------------------------------------
 * The chain calls Math.log at 4 distinct sites (~N_LOG_CALLS calls incl. the seed; imp-34885). A
 * proven-ULP two-sided log contributes at most 1 ulp of OUTWARD half-width per call. At the dominant
 * argument scale (T0 ~ 1.14e9) one ulp is ulp(T0) = eps * 2^floor(log2 T0) (absolute). Summing the ~7
 * calls gives a log-induced residual half-width ~ N_LOG_CALLS * ulp(T0) in T-units, propagated through
 * the interval-Newton quotient (divide by FP_LO ~ 0.9546). Compared against the (H2) bracket margin
 * delta * N_cross ~ 6.56e5, the accumulated log residual sits ~10 orders BELOW the margin: the log
 * evaluations are NOT the binding accuracy term for (H2) -- they are dominated by the same ~10-order
 * head-room the imp-34799 n_op^max ~ 8.60e11 ceiling gives over the n_op ~ 50 evaluation cost. So the
 * residual BUDGET for the log is enormous; the difficulty is CORRECTNESS of the rounding, not its size.
 *
 * (C) WHERE EXTENDED PRECISION IS MANDATORY
 * -----------------------------------------
 * The (H2) width budget is met in DOUBLE precision with ~10 orders of head-room (B); extended precision is
 * therefore NOT mandated by the interval WIDTH. It is mandated only as the internal MECHANISM to
 * MANUFACTURE the two primitives JS cannot supply correctly-rounded:
 *   - the transcendental log: a double-double (eps_dd ~ 2^-106) polynomial/argument-reduction evaluation
 *     whose error < 0.5 ulp(double) yields a correctly-rounded double log (the crlibm/RLIBM technique) --
 *     required ONLY if no external directed-log binding is used.
 *   - the residual-corrected quotient for "/": the residual term is an extended-precision (double-double)
 *     computation used to round the quotient outward correctly.
 * So extended precision is a MEANS to correct rounding of log and div, NOT a requirement of the certificate
 * width budget. The Krawczyk existence-uniqueness content (imp-34714) is EXACT real analysis and precision-
 * independent; precision enters only through the outward-enclosure obligation on f(m) and [f_prime].
 *
 * (D) DOUBLE-vs-EXTENDED FEASIBILITY VERDICT
 * ------------------------------------------
 * DOUBLE precision is FEASIBLE for the certificate arithmetic (width/(H2) budget has ~10 orders head-room),
 * PROVIDED the log and div primitives are correctly-rounded. Since JS supplies neither, the two routes are:
 *   (i)  bind an external correctly-rounded directed-log (crlibm/RLIBM/MPFR) + EFT directed +,-,*,/ + a
 *        residual-corrected quotient -- stays in double for the interval, external for the log; or
 *   (ii) manufacture correctly-rounded log/div in EXTENDED precision (double-double) inside a pure-JS
 *        module -- no external binding, but a machine-checked ULP-bound proof (Gappa/RLIBM) of the
 *        emulated log becomes the new obligation.
 * Either way imp-34714a is gated on a SINGLE unmet correctness artifact (a proven-ULP log), not on the
 * interval width, which double precision already clears by ~10 orders. imp-34714a and imp-34687a REMAIN OPEN.
 *
 * SCOPING / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (the 4-log-site / per-op checklist this scopes into a certificate requirement)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the gamma(n_op) eps first-order surrogate this certificate would replace; n_op^max ~ 8.60e11)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; sub-gap imp-34714a; F(m)=0 is the double-precision artifact)
 * @see imp-34865-forward-vs-contraction-width-inflation (the [T0]-inverse must be a contraction, not forward propagation)
 * @see imp-34883-krawczyk-worstcase-headroom-band (the headroom the log residual must stay below)
 * @see imp-34910 (SIBLING: measures the residual-corrected quotient ULP error, the sole non-IEEE-754-exposed basic op)
 * @see imp-34867-crlibm-log-enclosure-ulp-scope (per-call <= 1 ulp, kappa_log ~ 0.05 log-layer scope)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop whose evaluations the certificate would enclose)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 double unit roundoff
const EPS_DD = EPS * EPS; // ~2^-104 double-double unit roundoff (extended-precision route)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34799/imp-34885)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34774/imp-34799/imp-34885

// Shared imp-33723/imp-34774/imp-34799 Banach map g(N) = K log T0(N) and closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9
const M = N_CROSS;
const T0_AT_M = effectiveHeightForN(M); // ~1.1438e9
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.9546 contraction-gap / Krawczyk denominator floor

// One ulp at a magnitude x (absolute), the two-sided proven-ULP half-width the log contributes per call.
const ulpAt = (x) => EPS * 2 ** Math.floor(Math.log2(Math.abs(x)));
const ULP_T0 = ulpAt(T0_AT_M); // ~ulp at the dominant log argument scale

// Count the inner Newton log calls exactly as imp-34885 does (one inner log per step) + 3 outer sites.
function newtonStepsToConverge(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  let steps = 0;
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const fVal = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    T -= fVal / fp;
    steps++;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(fVal / fp) < 1e-9 * Math.max(1, T)) break;
  }
  return steps;
}
const NEWTON_STEPS = newtonStepsToConverge(M); // ~4
const N_LOG_SITES = 4; // seed, inner, outer g, g_prime (imp-34885)
const N_LOG_CALLS = 3 + NEWTON_STEPS; // ~7 including the seed

// (B) residual budget: ~N_LOG_CALLS ulp outward at the T0 scale, propagated through the contraction quotient.
const LOG_RESIDUAL_HALFWIDTH = (N_LOG_CALLS * ULP_T0) / FP_LO; // T-units, log-induced image half-width
const H2_MARGIN = DELTA * N_CROSS; // ~6.56e5 (H2) bracket margin per side
const LOG_HEADROOM_ORDERS = Math.log10(H2_MARGIN / LOG_RESIDUAL_HALFWIDTH); // ~orders below the margin

// (A) the surrogate this certificate would replace: gamma(n_op) eps first-order proxy at n_op ~ 50.
const N_OP_REPRESENTATIVE = 50;
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS);
const SURROGATE_IMAGE_HALFWIDTH = (gammaN(N_OP_REPRESENTATIVE) * N_CROSS) / FP_LO; // a-priori bound, not instantiated
const N_OP_CEILING = (DELTA * FP_LO) / EPS; // ~8.60e11 (imp-34799): n_op ceiling under (H2)
const SURROGATE_HEADROOM_ORDERS = Math.log10(N_OP_CEILING / N_OP_REPRESENTATIVE); // ~10 orders

// (A) primitive correctly-rounded requirements.
const PRIMITIVE_REQUIREMENTS = [
  { op: 'add/sub (+,-)', ieee754_correctly_rounded: true, js_directed_available: false, extended_precision_mandatory: false, route: 'error-free transformation (TwoSum/Dekker); no fesetround in JS' },
  { op: 'mul (*)', ieee754_correctly_rounded: true, js_directed_available: false, extended_precision_mandatory: false, route: 'TwoProduct / Dekker split (no Math.fma in JS)' },
  { op: 'div (/)', ieee754_correctly_rounded: true, js_directed_available: false, extended_precision_mandatory: true, route: 'residual-corrected quotient (double-double residual); sole non-IEEE-754-exposed basic op (imp-34885/34910)' },
  { op: 'max', ieee754_correctly_rounded: true, js_directed_available: true, extended_precision_mandatory: false, route: 'exact monotone endpoint selection' },
  { op: 'const (2pi, e, K)', ieee754_correctly_rounded: true, js_directed_available: false, extended_precision_mandatory: false, route: 'one-time outward [RD, RU] enclosure' },
  { op: 'log (transcendental)', ieee754_correctly_rounded: false, js_directed_available: false, extended_precision_mandatory: true, route: 'EXTERNAL crlibm/RLIBM/MPFR directed-log OR manufacture in double-double with a machine-checked ULP-bound proof' },
];
const N_EXTENDED_MANDATORY = PRIMITIVE_REQUIREMENTS.filter((p) => p.extended_precision_mandatory).length; // 2: log + div residual

export const IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE = {
  id: 'imp-34908',
  proofSection: 'S-frontier',
  question:
    'The imp-34865/34883/34884/34889 forward-breach and headroom modules all defer to the imp-34714a ' +
    'certified transcendental (Krawczyk existence-uniqueness) layer, whose arithmetic model is the ' +
    'imp-34799 gamma(n_op) eps first-order OUTWARD-ROUNDING surrogate with F(m) = 0 a double-precision ' +
    'artifact. Scope what a MACHINE-CHECKABLE Krawczyk certificate would require to replace that ' +
    'surrogate, per the imp-34885 4-log-site checklist: (A) which interval primitives must be correctly-' +
    'rounded; (B) the residual budget of the transcendental log evaluations; (C) where extended precision ' +
    'is mandatory; (D) a double-vs-extended feasibility verdict. SCOPING / FEASIBILITY ONLY; does NOT ' +
    'instantiate the layer, does NOT discharge the conditional; imp-34714a REMAINS OPEN; no QED.',
  requirements: {
    A_primitive_correctly_rounded: PRIMITIVE_REQUIREMENTS,
    A_basic_ops_correctly_rounded_but_not_js_directed: '+,-,*,/ are IEEE-754-2019 correctly rounded but JS exposes no directed rounding mode (no fesetround); / additionally needs a residual-corrected quotient',
    B_log_residual_budget: {
      n_log_sites: N_LOG_SITES,
      n_log_calls: N_LOG_CALLS, // ~7
      per_call_outward_ulp: 1, // proven-ULP two-sided log
      dominant_argument_T0: +T0_AT_M.toPrecision(10),
      ulp_at_T0: +ULP_T0.toExponential(4),
      log_residual_image_halfwidth_T_units: +LOG_RESIDUAL_HALFWIDTH.toExponential(4),
      H2_margin: +H2_MARGIN.toExponential(4),
      log_headroom_orders_below_margin: +LOG_HEADROOM_ORDERS.toFixed(2),
      binding_term: false, // the log residual is NOT the binding accuracy term for (H2)
    },
    C_extended_precision_mandatory_where: {
      for_interval_width_budget: false, // double precision clears (H2) by ~10 orders
      for_correctly_rounded_log: true, // double-double emulation if no external binding
      for_residual_corrected_quotient: true, // double-double residual term for directed /
      n_extended_mandatory_primitives: N_EXTENDED_MANDATORY, // 2: log + div residual
      krawczyk_content_precision_independent: true, // imp-34714 existence-uniqueness is exact real analysis
    },
    D_feasibility_verdict: {
      double_feasible_for_certificate_arithmetic: true, // ~10 orders (H2) head-room
      surrogate_image_halfwidth_at_nop50: +SURROGATE_IMAGE_HALFWIDTH.toExponential(4),
      n_op_ceiling_under_H2: +N_OP_CEILING.toExponential(4), // ~8.60e11 (imp-34799)
      surrogate_headroom_orders: +SURROGATE_HEADROOM_ORDERS.toFixed(2), // ~10
      route_i_external_binding: 'crlibm/RLIBM/MPFR directed-log + EFT directed +,-,*,/ + residual-corrected quotient (interval stays double, log external)',
      route_ii_extended_precision: 'manufacture correctly-rounded log/div in double-double (no external binding) with a machine-checked Gappa/RLIBM ULP-bound proof as the new obligation',
      single_unmet_artifact: 'a proven-ULP correctly-rounded log; gated on correctness, not on interval width',
    },
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    T0_at_N_cross: +T0_AT_M.toPrecision(10),
    eps_double: +EPS.toExponential(4), // 2.2204e-16
    eps_double_double: +EPS_DD.toExponential(4), // ~4.93e-32
    FP_LO: +FP_LO.toPrecision(7), // ~0.954568 contraction-gap floor
    delta: +DELTA.toExponential(1),
    newton_steps: NEWTON_STEPS,
    n_log_calls: N_LOG_CALLS,
    n_extended_mandatory: N_EXTENDED_MANDATORY,
  },
  finding:
    'Scoping the machine-checkable Krawczyk certificate that would replace the imp-34799 gamma(n_op) eps ' +
    'first-order surrogate (F(m) = 0 is a double-precision artifact; gamma(n_op) eps is an outward-rounding ' +
    'PROXY, not the imp-34687a directed-rounding layer). (A) Every op in the effectiveHeightForN / g / ' +
    'g_prime DAG needs a directed [RD, RU] primitive: +,-,* are IEEE-754 correctly rounded (exact hardware ' +
    'rounds) but JS has no fesetround so they need error-free-transformation emulation; / additionally ' +
    'needs a residual-corrected quotient (the sole non-IEEE-754-exposed basic op); max is exact; consts ' +
    'need outward enclosures; log is not correctly-rounded-mandated (only recommended). (B) The ~7 log ' +
    'calls contribute at most ~7 ulp(T0) outward, giving a log-induced image half-width ~' +
    LOG_RESIDUAL_HALFWIDTH.toExponential(2) + ' in T-units versus the (H2) margin ~' + H2_MARGIN.toExponential(2) +
    ' -- ~' + LOG_HEADROOM_ORDERS.toFixed(1) + ' orders below, so the log residual is NOT the binding ' +
    'accuracy term. (C) Extended precision is NOT mandated by the interval width (double clears (H2) by ' +
    '~10 orders) but IS the internal mechanism to manufacture the two primitives JS cannot supply ' +
    'correctly-rounded: a double-double log (< 0.5 ulp(double) => correctly-rounded double) and the ' +
    'residual-corrected quotient; the Krawczyk existence-uniqueness content (imp-34714) is exact real ' +
    'analysis and precision-independent. (D) Double precision is FEASIBLE for the certificate arithmetic; ' +
    'closure is gated on a SINGLE unmet correctness artifact -- a proven-ULP log, either via an external ' +
    'crlibm/RLIBM/MPFR binding or a machine-checked double-double emulation -- NOT on the interval width. ' +
    'This ENUMERATES the certificate requirements; it does NOT instantiate the layer. imp-34714a and ' +
    'imp-34687a REMAIN OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This SCOPES the certificate requirements -- ' +
    'directed [RD, RU] for every DAG op (+,-,*,/ via error-free transformations since JS has no ' +
    'fesetround, / via a residual-corrected quotient), a proven-ULP two-sided log at all 4 sites, the ' +
    '[T0]-inverse as a contraction not forward propagation (imp-34865), and machine-verified outward ' +
    'enclosures of f(m) and [f_prime] -- and the double-vs-extended verdict (double feasible for the ' +
    'width budget with ~10 orders head-room; extended precision mandatory only to manufacture ' +
    'correctly-rounded log/div). It does NOT supply any primitive, does NOT instantiate the imp-34687a ' +
    'layer, and does NOT machine-check (H1)/(H2). A precision-feasibility ROADMAP, not a certificate. ' +
    'Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK CERTIFICATE PRECISION SCOPE (frontier, NOT an RH bound). The imp-34865/34883/34884/34889 ' +
    'modules defer to the imp-34714a certified transcendental layer, whose arithmetic is the imp-34799 ' +
    'gamma(n_op) eps first-order surrogate (F(m) = 0 a double-precision artifact). This scopes the ' +
    'machine-checkable certificate that would replace it. (A) Every DAG op needs a directed [RD, RU] ' +
    'primitive: +,-,* are IEEE-754 correctly rounded but need error-free-transformation emulation (no ' +
    'fesetround in JS); / needs a residual-corrected quotient; max is exact; consts need outward ' +
    'enclosures; log is only RECOMMENDED-correctly-rounded. (B) The ~7 log calls contribute ~7 ulp(T0) ' +
    'outward, ~10 orders below the (H2) margin -- the log residual is NOT the binding accuracy term. ' +
    '(C) Extended precision is NOT mandated by the interval width (double clears (H2) by ~10 orders); it ' +
    'is the internal mechanism to manufacture the two primitives JS cannot supply correctly-rounded (a ' +
    'double-double log and the residual-corrected quotient), while the Krawczyk existence-uniqueness ' +
    'content (imp-34714) is precision-independent exact real analysis. (D) Double precision is FEASIBLE ' +
    'for the certificate arithmetic; closure is gated on a SINGLE unmet correctness artifact -- a ' +
    'proven-ULP log (external crlibm/RLIBM/MPFR binding OR a machine-checked double-double emulation) -- ' +
    'not on the interval width. This ENUMERATES the requirements; it does NOT instantiate the layer, does ' +
    'NOT discharge the conditional. SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. Scoping/assessment ' +
    'only on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34885 (directed-rounding instantiation checklist; 4 log sites, / the sole non-IEEE-754-exposed ' +
    'basic op -- this scopes it into a certificate precision requirement); imp-34799 (gamma(n_op) eps ' +
    'first-order surrogate this would replace; n_op^max ~ 8.60e11, ~10 orders over n_op ~ 50); imp-34714 ' +
    '(Krawczyk existence-uniqueness lemma; sub-gap imp-34714a; F(m)=0 double-precision artifact); ' +
    'imp-34865 (forward-vs-contraction inflation; the [T0]-inverse contraction requirement); imp-34883 ' +
    '(worst-case headroom band the log residual stays below); imp-34910 (sibling: residual-corrected ' +
    'quotient ULP measurement); imp-34867 (crlibm log-enclosure ULP scope). Correctly-rounded ' +
    'transcendentals and error-free transformations: crlibm / RLIBM / MPFR / IEEE-754-2019 recommended ' +
    'functions; Dekker, TwoSum, TwoProduct; double-double arithmetic.',
};

export const IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE_ASSERTIONS = [
  {
    // (A) every basic op +,-,*,/ is IEEE-754 correctly rounded yet has no JS-exposed directed variant; log is not even correctly-rounded-mandated.
    id: 'imp34908-primitives-correctly-rounded-but-not-js-directed',
    description: '+,-,*,/ IEEE-754 correctly rounded but no JS directed rounding; log not correctly-rounded-mandated',
    holds: () => {
      const basics = PRIMITIVE_REQUIREMENTS.filter((p) => /add|mul|div/.test(p.op));
      const logOp = PRIMITIVE_REQUIREMENTS.find((p) => /log/.test(p.op));
      return (
        basics.length === 3 &&
        basics.every((p) => p.ieee754_correctly_rounded === true && p.js_directed_available === false) &&
        logOp.ieee754_correctly_rounded === false &&
        logOp.js_directed_available === false
      );
    },
  },
  {
    // (B) the ~7-call log residual is many orders below the (H2) margin -- NOT the binding accuracy term.
    id: 'imp34908-log-residual-not-binding',
    description: 'the ~7 proven-ULP log calls contribute an image half-width many orders below the (H2) margin',
    holds: () =>
      N_LOG_CALLS === 3 + NEWTON_STEPS &&
      NEWTON_STEPS >= 3 &&
      NEWTON_STEPS <= 8 &&
      LOG_RESIDUAL_HALFWIDTH > 0 &&
      LOG_RESIDUAL_HALFWIDTH < H2_MARGIN &&
      LOG_HEADROOM_ORDERS > 6,
  },
  {
    // (C) extended precision is mandatory for exactly the two primitives JS cannot supply correctly-rounded (log + div residual), NOT for the width budget.
    id: 'imp34908-extended-precision-only-for-log-and-div',
    description: 'extended precision mandatory only to manufacture correctly-rounded log/div, not for the interval width budget',
    holds: () =>
      N_EXTENDED_MANDATORY === 2 &&
      IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.requirements.C_extended_precision_mandatory_where.for_interval_width_budget === false &&
      IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.requirements.C_extended_precision_mandatory_where.for_correctly_rounded_log === true &&
      IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.requirements.C_extended_precision_mandatory_where.for_residual_corrected_quotient === true,
  },
  {
    // (D) double precision is feasible for the certificate arithmetic -- the surrogate n_op ceiling sits ~10 orders over the n_op ~ 50 cost.
    id: 'imp34908-double-feasible-headroom',
    description: 'double precision clears the (H2) width budget with ~10 orders of head-room (n_op ceiling ~8.60e11 vs n_op ~50)',
    holds: () =>
      N_OP_CEILING > 1e11 &&
      SURROGATE_HEADROOM_ORDERS > 8 &&
      IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.requirements.D_feasibility_verdict.double_feasible_for_certificate_arithmetic === true,
  },
  {
    // Honesty gate: scoping only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34908-honesty-gate-no-qed',
    description: 'Certificate precision scope: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.isRigorous === false &&
      /imp-34714a/.test(IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.subGap) &&
      /imp-34687a/.test(IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.subGap) &&
      /REMAINS? OPEN/.test(IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.subGap) &&
      /NO QED/.test(IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE.verdict),
  },
];

for (const a of IMP34908_KRAWCZYK_CERTIFICATE_PRECISION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34908-krawczyk-certificate-precision-scope assertion failed: ${a.id}`);
  }
}
