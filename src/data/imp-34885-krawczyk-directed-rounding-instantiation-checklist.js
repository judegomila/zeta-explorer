/**
 * @module imp-34885-krawczyk-directed-rounding-instantiation-checklist
 *
 * imp-34885 (proof, frontier): imp-34867 SCOPED the transcendental log layer that imp-34840 localised as the
 * Krawczyk-endpoint blocker -- a correctly-rounded / crlibm-style two-sided log enclosure has per-call outward
 * half-width <= 1 ulp, is well-conditioned on this chain (kappa_log ~ 0.05), and composes through the depth-30
 * chain with the (H2) margin head-room intact -- and sharpened the imp-34687a gap from "supply directed
 * rounding" to "supply a proven-ULP-bounded correctly-rounded log with RD/RU variants". This module turns that
 * scoping into a formal GAP-CLOSURE CHECKLIST: it enumerates (a) every Math.log SITE in the
 * effectiveHeightForN / g / g_prime chain and the two-sided-ULP primitive each needs; (b) the directed-rounding
 * primitive required for each elementary op type; (c) the [T0]-inverse as a self-validating interval-Newton /
 * Krawczyk CONTRACTION per imp-34865 (NOT forward propagation, which imp-34865 measured doubles per step and
 * crossings (H2) at step 5); and (d) which items are library-available vs must-build, and the single unmet
 * EXTERNAL dependency (a crlibm / MPFR directed-rounded log binding) that stays external before imp-34714a
 * could close. SCOPING / ASSESSMENT ONLY: does NOT instantiate the layer, does NOT discharge the conditional,
 * imp-34714a REMAINS OPEN, imp-34687a REMAINS OPEN, NO QED. No refereed bound is changed.
 *
 * (a) THE LOG SITES IN THE effectiveHeightForN / g / g_prime CHAIN
 * ---------------------------------------------------------------
 * The chain calls Math.log at four DISTINCT sites (the effectiveHeightForN source at
 * lambda-rh-height-mapping.js:140 plus g and g_prime):
 *   S1  seed  log(N + 2pi)          -- 1 call, the RvM-inverse seed (line 144); dropped if the contraction
 *                                      route (c) replaces the forward-Newton solve with a point-seed operator.
 *   S2  inner log(T / 2pi)          -- ~NEWTON_STEPS (~4) calls, one per Newton step (line 146); the u used in
 *                                      f = (T/2pi)(u-1) - N and fp = u/2pi.
 *   S3  outer log(T0)               -- 1 call, g(N) = K log T0(N).
 *   S4  g_prime log(T0 / 2pi)       -- 1 call, g_prime = 2pi K / (T0 log(T0/2pi)).
 * Every site needs the SAME primitive: a proven-ULP correctly-rounded log with two directed variants
 * [RD(log x), RU(log x)] (round-down for the lower endpoint, round-up for the upper). imp-34867 established
 * this primitive has outward half-width <= 1 ulp and kappa_log ~ 0.05 (< 1) at all four arguments here, so no
 * site amplifies -- the crossover map never visits a near-1 argument where log(x) ~ 0 would blow kappa_log up.
 *
 * (b) THE DIRECTED-ROUNDING PRIMITIVE PER ELEMENTARY OP
 * ----------------------------------------------------
 * The remaining ops in the DAG are +, -, *, /, and Math.max, plus the stored constants:
 *   +, -  : [RD(a op b), RU(a op b)] via IEEE-754-2019 roundTowardNegative / roundTowardPositive. The four
 *           basic ops are CORRECTLY ROUNDED by the standard, so RD/RU are exact hardware ops -- but ECMAScript
 *           exposes NO rounding-mode control (no fesetround), so in pure JS they must be emulated by
 *           error-free transformations (TwoSum / Dekker for +/-).
 *   *     : [RD(a*b), RU(a*b)] -- correctly rounded by IEEE-754; JS emulation via TwoProduct / FMA (Math.fma
 *           is not in JS either, so Dekker splitting).
 *   /     : [RD(a/b), RU(a/b)] -- correctly rounded by IEEE-754; JS emulation via a residual-corrected quotient.
 *   max   : interval max is a monotone SELECTION (max of endpoints); EXACT, needs no rounding primitive.
 *   consts: 2pi (pi not representable), e, and K = (C_C / E_trunc)^2 need OUTWARD-rounded enclosures [RD, RU]
 *           of the stored value; K carries one square + one division so its enclosure is [RD, RU] of that.
 *
 * (c) THE [T0]-INVERSE AS A SELF-VALIDATING CONTRACTION (per imp-34865)
 * --------------------------------------------------------------------
 * The inner Riemann-von Mangoldt inverse [T0] MUST be instantiated as the interval-Newton / Krawczyk operator
 * N([T]) = m - [f](m) / [f_prime]([T]) intersected with [T], where m = mid([T]) is a POINT. imp-34687
 * established f(T) = (T/2pi)(log(T/2pi) - 1) - N monotone-increasing and convex on T > 2pi, so this operator
 * is a verified contraction to the unique root T0; its width is set by the FINAL step (point residual [f](m),
 * a few ULP, divided by fp), collapsing to ~2.9e-6 in T-units in a single step. This is MANDATORY, not
 * optional: imp-34865 MEASURED that naive forward propagation of the input interval through the depth-30
 * dividing chain DOUBLES the width per Newton step (interval subtraction at a fixed point matches the iterate
 * width) and Crosses the (H2) margin at step 5 (ratio ~1.61), whereas the contraction route sits ~12.5 orders
 * below it. So the flat gamma(n_op) width model of imp-34799/imp-34840 is faithful ONLY on the contraction route.
 *
 * (d) LIBRARY-AVAILABLE vs MUST-BUILD, AND THE UNMET EXTERNAL DEPENDENCY
 * ---------------------------------------------------------------------
 *   IN-REPO / BUILDABLE (no external dependency):
 *     - the interval-Newton / Krawczyk contraction operator (c) -- pure algorithm once directed +,-,*,/ exist.
 *     - directed [RD, RU] for +, -, *, / -- buildable in pure JS via error-free transformations (TwoSum,
 *       TwoProduct, Dekker split), since the four basic ops are IEEE-754 correctly rounded and the residual is
 *       computable; alternatively a WASM module compiled with rounding-mode control.
 *     - interval max and the constant enclosures -- trivial.
 *   MUST-BUILD / EXTERNAL (the single unmet dependency):
 *     - a PROVEN-ULP correctly-rounded log with directed RD/RU variants. Stock JS Math.log carries NO
 *       guaranteed ULP bound (ECMAScript leaves log implementation-defined, not portable, no RD/RU variants),
 *       and correctly-rounded log is only a RECOMMENDED (not mandated) IEEE-754-2019 function. Closing this
 *       needs an external binding -- crlibm / RLIBM / MPFR (with directed rounding) -- OR a machine-checked
 *       Gappa/RLIBM proof of a specific JS libm log ULP bound. This is the ONE artifact that stays external.
 * NET: all four log sites and every elementary op reduce to buildable-in-repo primitives EXCEPT the
 * transcendental log, which is gated on a single external crlibm/MPFR directed-log binding. Once that binding
 * is supplied, the (a)-(c) pieces assemble into the imp-34687a directed-rounding layer and the imp-34714a
 * existence-uniqueness lemma could be machine-checked. Until then imp-34714a and imp-34687a REMAIN OPEN.
 *
 * SCOPING / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34867-crlibm-log-enclosure-ulp-scope (scoped the log layer; per-call <= 1 ulp, kappa_log ~ 0.05, composes; this ASSEMBLES its checklist)
 * @see imp-34865-forward-vs-contraction-width-inflation (MEASURED forward doubling / crossing vs contraction floor; the (c) requirement)
 * @see imp-34840-krawczyk-directed-rounding-op-dag-feasibility (op DAG n_op ~ 49, depth ~ 30; localised the log blocker)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori gamma(n_op) half-width bound the ops feed into)
 * @see imp-34687-crossover-interval-arithmetic-scope (f monotone+convex => interval-Newton contraction; sub-gap imp-34687a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop whose log sites this enumerates)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34799/imp-34840/imp-34867)
const DELTA = 2e-4; // same FIXED relative bracket half-width as the imp-34774/imp-34799/imp-34840 construction

// The shared imp-33723/imp-34774/imp-34799/imp-34867 Banach map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9
const M = N_CROSS;
const T0_AT_M = effectiveHeightForN(M); // ~1.1438e9
const A_INNER = T0_AT_M / TWO_PI; // ~1.8204e8 (inner-loop log argument)

// Count the inner Newton steps EXACTLY as imp-34867 does (one inner log per step).
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
const NEWTON_STEPS = newtonStepsToConverge(M); // ~4

// (a) The four distinct log SITES and the primitive each needs.
const LOG_SITES = [
  {
    tag: 'S1-seed',
    expr: 'log(N + 2pi)',
    source_line: 'lambda-rh-height-mapping.js:144',
    n_calls: 1,
    note: 'RvM-inverse seed; DROPPED on the contraction route (c) which uses a point-seed operator, not the forward-Newton seed.',
  },
  {
    tag: 'S2-inner',
    expr: 'log(T / 2pi)',
    source_line: 'lambda-rh-height-mapping.js:146',
    n_calls: NEWTON_STEPS, // ~4, one per Newton step
    note: 'the u in f = (T/2pi)(u-1) - N and fp = u/2pi; inner argument ~ T0/2pi, kappa_log ~ 0.0526 (imp-34867).',
  },
  {
    tag: 'S3-outer-g',
    expr: 'log(T0)',
    source_line: 'g(N) = K log T0(N)',
    n_calls: 1,
    note: 'outer Banach-map log; argument T0 ~ 1.14e9, kappa_log ~ 0.0479 (imp-34867).',
  },
  {
    tag: 'S4-g_prime',
    expr: 'log(T0 / 2pi)',
    source_line: 'g_prime = 2pi K / (T0 log(T0/2pi))',
    n_calls: 1,
    note: 'g_prime denominator log; same inner argument T0/2pi as S2.',
  },
];
const N_LOG_CALLS = LOG_SITES.reduce((s, x) => s + x.n_calls, 0); // ~7 including the seed
const LOG_PRIMITIVE = 'two-sided [RD(log x), RU(log x)]: proven-ULP correctly-rounded log with directed round-down / round-up variants (outward half-width <= 1 ulp, imp-34867)';

// (b) The directed-rounding primitive per elementary op type.
const OP_PRIMITIVES = [
  { op: 'add/sub (+,-)', primitive: '[RD(a op b), RU(a op b)]', ieee754_correctly_rounded: true, js_available: false, build: 'error-free transformation (TwoSum / Dekker); no fesetround in JS' },
  { op: 'mul (*)', primitive: '[RD(a*b), RU(a*b)]', ieee754_correctly_rounded: true, js_available: false, build: 'TwoProduct / Dekker split (no Math.fma in JS)' },
  { op: 'div (/)', primitive: '[RD(a/b), RU(a/b)]', ieee754_correctly_rounded: true, js_available: false, build: 'residual-corrected quotient' },
  { op: 'max', primitive: 'interval max (endpoint selection)', ieee754_correctly_rounded: true, js_available: true, build: 'exact monotone selection; no rounding needed' },
  { op: 'const (2pi, e, K)', primitive: 'outward [RD, RU] of the stored value', ieee754_correctly_rounded: true, js_available: false, build: 'pre-round constants outward once; K = (C_C/E_trunc)^2 carries a square + a division' },
  { op: 'log (transcendental)', primitive: LOG_PRIMITIVE, ieee754_correctly_rounded: false, js_available: false, build: 'EXTERNAL: crlibm / RLIBM / MPFR directed-log binding (recommended-only in IEEE-754-2019)' },
];

// (c) The [T0]-inverse contraction requirement (per imp-34865).
const T0_INVERSE_ROUTE = {
  operator: 'interval-Newton / Krawczyk operator N([T]) = m - [f](m) / [f_prime]([T]) intersected with [T], m = mid([T]) a POINT',
  contraction_justified_by: 'imp-34687: f(T) = (T/2pi)(log(T/2pi) - 1) - N monotone-increasing and convex on T > 2pi',
  contraction_width_T_units: 2.9e-6, // imp-34865 measured single-step collapse
  forward_route_breaches_H2: true, // imp-34865: forward propagation doubles per step, crossings at step 5
  forward_per_step_growth: 2.0, // structural: interval subtraction at a Newton fixed point
  mandatory: true, // the flat gamma(n_op) model of imp-34799/imp-34840 is faithful ONLY on the contraction route
};

// (d) library-available vs must-build; the single unmet external dependency.
const BUILDABLE_IN_REPO = [
  'interval-Newton / Krawczyk contraction operator (pure algorithm)',
  'directed [RD, RU] for +, -, *, / via error-free transformations (TwoSum/TwoProduct/Dekker) or a WASM rounding-mode module',
  'interval max and outward constant enclosures',
];
const EXTERNAL_UNMET = [
  'a proven-ULP correctly-rounded log with directed RD/RU variants (crlibm / RLIBM / MPFR), OR a machine-checked Gappa/RLIBM ULP-bound proof of a specific JS libm log',
];
const N_EXTERNAL_UNMET = EXTERNAL_UNMET.length; // 1: the transcendental log binding is the ONLY external gap

export const IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST = {
  id: 'imp-34885',
  proofSection: 'S-frontier',
  question:
    'imp-34867 scoped the transcendental log layer (per-call <= 1 ulp, kappa_log ~ 0.05, composes through the ' +
    'depth-30 chain within the (H2) margin) and sharpened the imp-34687a gap to "supply a proven-ULP log with ' +
    'RD/RU variants". Turn that scoping into a formal gap-closure checklist: (a) every Math.log site in the ' +
    'effectiveHeightForN / g / g_prime chain and the two-sided-ULP primitive each needs; (b) the directed-' +
    'rounding primitive required for each elementary op; (c) the [T0]-inverse as a self-validating interval-' +
    'Newton / Krawczyk contraction per imp-34865; (d) which items are library-available vs must-build, and ' +
    'what external dependency (crlibm binding) stays unmet. SCOPING / ASSESSMENT ONLY; does NOT instantiate ' +
    'the layer, does NOT discharge the conditional; imp-34714a REMAINS OPEN; no QED.',
  checklist: {
    a_log_sites: LOG_SITES,
    a_log_primitive: LOG_PRIMITIVE,
    a_n_log_sites: LOG_SITES.length, // 4 distinct sites
    a_n_log_calls: N_LOG_CALLS, // ~7 including the seed
    b_op_primitives: OP_PRIMITIVES,
    c_T0_inverse_route: T0_INVERSE_ROUTE,
    d_buildable_in_repo: BUILDABLE_IN_REPO,
    d_external_unmet: EXTERNAL_UNMET,
    d_n_external_unmet: N_EXTERNAL_UNMET, // 1
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // ~3.28029435165241e9
    T0_at_N_cross: +T0_AT_M.toPrecision(10), // ~1.143784918e9
    inner_log_arg_T0_over_2pi: +A_INNER.toPrecision(10), // ~1.820390235e8
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
    newton_steps: NEWTON_STEPS, // ~4
    n_log_calls: N_LOG_CALLS, // ~7
    n_external_unmet: N_EXTERNAL_UNMET, // 1
  },
  finding:
    'Assembling the imp-34867 log-layer scoping into a formal gap-closure checklist for the imp-34687a ' +
    'directed-rounding layer. (a) The effectiveHeightForN / g / g_prime chain calls Math.log at FOUR distinct ' +
    'sites (seed log(N+2pi), inner log(T/2pi) x ~4 Newton steps, outer log(T0) for g, log(T0/2pi) for ' +
    'g_prime; ~7 calls total), each needing the SAME primitive: a proven-ULP correctly-rounded log with ' +
    'directed [RD, RU] variants (outward half-width <= 1 ulp, kappa_log ~ 0.05 at every argument, imp-34867). ' +
    '(b) The remaining elementary ops are +, -, *, /, max and the stored constants; +, -, *, / are IEEE-754 ' +
    'correctly rounded so their [RD, RU] directed variants are exact hardware ops -- but ECMAScript exposes no ' +
    'rounding-mode control, so in pure JS they must be emulated by error-free transformations (TwoSum / ' +
    'TwoProduct / Dekker); interval max is an exact selection; the constants (2pi, e, K = (C_C/E_trunc)^2) ' +
    'need one-time outward-rounded enclosures. (c) The inner RvM inverse [T0] MUST be the interval-Newton / ' +
    'Krawczyk contraction N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] (m a point), a verified contraction ' +
    'since f is monotone+convex on T > 2pi (imp-34687); this is MANDATORY because imp-34865 MEASURED that ' +
    'forward propagation doubles the width per Newton step and crosses (H2) at step 5, while the contraction ' +
    'floor sits ~12.5 orders below the margin. (d) Every log site and every elementary op reduces to a ' +
    'buildable-in-repo primitive (EFT-based directed +,-,*,/; the contraction operator; interval max; ' +
    'constant enclosures) EXCEPT the transcendental log, which is gated on a SINGLE unmet external dependency: ' +
    'a crlibm / RLIBM / MPFR directed-log binding (or a machine-checked ULP-bound proof of a JS libm log). ' +
    'Once that ONE binding is supplied the (a)-(c) pieces assemble into the imp-34687a layer and imp-34714a ' +
    'could be machine-checked. This ENUMERATES the checklist; it does NOT instantiate the layer. imp-34714a ' +
    'and imp-34687a REMAIN OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This ASSEMBLES the gap-closure checklist -- 4 log sites ' +
    '(~7 calls) each needing a two-sided [RD, RU] proven-ULP log; directed [RD, RU] for +,-,*,/ (buildable via ' +
    'error-free transformations, JS has no fesetround); the [T0]-inverse as a MANDATORY interval-Newton / ' +
    'Krawczyk contraction (forward propagation crosses (H2), imp-34865); everything buildable in-repo EXCEPT ' +
    'the single unmet external dependency, a crlibm/RLIBM/MPFR directed-log binding -- but it does NOT supply ' +
    'any of them, does NOT instantiate the imp-34687a layer, and does NOT machine-check [g](m) / [F_prime]. ' +
    'A closure ROADMAP, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK DIRECTED-ROUNDING INSTANTIATION CHECKLIST (frontier, NOT an RH bound). imp-34867 scoped the ' +
    'transcendental log layer that imp-34840 localised as the Krawczyk-endpoint blocker; this turns that ' +
    'scoping into a formal four-part gap-closure checklist. (a) The effectiveHeightForN / g / g_prime chain ' +
    'calls Math.log at 4 distinct sites (seed, ~4 inner Newton, outer g, g_prime; ~7 calls), each needing a ' +
    'proven-ULP correctly-rounded log with directed [RD, RU] variants (per-call outward half-width <= 1 ulp, ' +
    'kappa_log ~ 0.05, imp-34867). (b) The other ops +,-,*,/ are IEEE-754 correctly rounded so their directed ' +
    'variants are exact hardware ops but need EFT emulation in JS (no fesetround); interval max is exact; ' +
    'constants need outward enclosures. (c) The [T0]-inverse MUST be the interval-Newton / Krawczyk ' +
    'contraction (verified via imp-34687 monotone+convex f), MANDATORY because imp-34865 measured forward ' +
    'propagation doubles per step and crosses (H2) at step 5. (d) Everything is buildable in-repo EXCEPT one ' +
    'unmet EXTERNAL dependency: a crlibm/RLIBM/MPFR directed-log binding (or a machine-checked JS-libm ULP ' +
    'proof). So imp-34714a closure is gated on a SINGLE external artifact; the rest assembles from in-repo ' +
    'primitives. This ENUMERATES the checklist; it does NOT instantiate the layer, does NOT discharge the ' +
    'conditional. SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. Scoping/assessment only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34867 (crlibm log-enclosure ULP scope; per-call <= 1 ulp, kappa_log ~ 0.05, composes -- this ' +
    'ASSEMBLES its checklist); imp-34865 (forward-vs-contraction width inflation; the (c) contraction ' +
    'requirement); imp-34840 (op-DAG feasibility; n_op ~ 49, depth ~ 30; localised the log blocker); ' +
    'imp-34799 (a-priori gamma(n_op) half-width bound); imp-34687 (crossover interval-arithmetic scope; f ' +
    'monotone+convex => contraction; sub-gap imp-34687a); imp-34714 (Krawczyk existence-uniqueness lemma; ' +
    'sub-gap imp-34714a); lambda-rh-height-mapping (effectiveHeightForN, the Newton loop whose log sites this ' +
    'enumerates). Correctly-rounded transcendentals and directed rounding: crlibm / RLIBM / MPFR / ' +
    'IEEE-754-2019 recommended functions; error-free transformations: Dekker, TwoSum, TwoProduct.',
};

export const IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST_ASSERTIONS = [
  {
    // (a) Exactly four distinct log sites; ~7 calls including the seed; all need the SAME two-sided-ULP log primitive.
    id: 'imp34885-four-log-sites-enumerated',
    description: '4 distinct log sites (seed, inner x NEWTON_STEPS, outer g, g_prime), ~7 calls total, each needing a two-sided [RD, RU] proven-ULP log',
    holds: () =>
      LOG_SITES.length === 4 &&
      NEWTON_STEPS >= 3 &&
      NEWTON_STEPS <= 8 &&
      N_LOG_CALLS === 3 + NEWTON_STEPS &&
      /RD\(log x\), RU\(log x\)/.test(LOG_PRIMITIVE),
  },
  {
    // (b) +,-,*,/ are IEEE-754 correctly rounded but NOT JS-available; log is NOT even correctly-rounded-mandated.
    id: 'imp34885-op-primitives-basic-vs-log',
    description: '+,-,*,/ IEEE-754 correctly rounded but not JS-exposed (need EFT); log is not correctly-rounded-mandated and needs an external binding',
    holds: () => {
      const basics = OP_PRIMITIVES.filter((o) => /add|mul|div/.test(o.op));
      const logOp = OP_PRIMITIVES.find((o) => /log/.test(o.op));
      const maxOp = OP_PRIMITIVES.find((o) => o.op === 'max');
      return (
        basics.length === 3 &&
        basics.every((o) => o.ieee754_correctly_rounded === true && o.js_available === false) &&
        logOp.ieee754_correctly_rounded === false &&
        logOp.js_available === false &&
        maxOp.js_available === true
      );
    },
  },
  {
    // (c) The [T0]-inverse route is a MANDATORY contraction; forward propagation crosses (H2) (imp-34865).
    id: 'imp34885-T0-inverse-must-be-contraction',
    description: 'the [T0]-inverse must be the interval-Newton / Krawczyk contraction (mandatory); forward propagation doubles per step and crosses (H2)',
    holds: () =>
      T0_INVERSE_ROUTE.mandatory === true &&
      T0_INVERSE_ROUTE.forward_route_breaches_H2 === true &&
      Math.abs(T0_INVERSE_ROUTE.forward_per_step_growth - 2.0) < 1e-9 &&
      /Krawczyk/.test(T0_INVERSE_ROUTE.operator) &&
      /monotone/.test(T0_INVERSE_ROUTE.contraction_justified_by),
  },
  {
    // (d) Everything buildable in-repo EXCEPT exactly ONE unmet external dependency: the directed-log binding.
    id: 'imp34885-single-unmet-external-dependency',
    description: 'buildable in-repo: contraction operator + EFT directed +,-,*,/ + max + constants; exactly ONE unmet external dependency: a crlibm/MPFR directed-log binding',
    holds: () =>
      BUILDABLE_IN_REPO.length >= 3 &&
      N_EXTERNAL_UNMET === 1 &&
      /crlibm|RLIBM|MPFR/.test(EXTERNAL_UNMET[0]) &&
      /log/.test(EXTERNAL_UNMET[0]),
  },
  {
    // Honesty gate: scoping only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34885-honesty-gate-no-qed',
    description: 'Instantiation checklist: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.isRigorous === false &&
      /imp-34714a/.test(IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.subGap) &&
      /imp-34687a/.test(IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.subGap) &&
      /REMAINS? OPEN/.test(IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.subGap) &&
      /NO QED/.test(IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.verdict) &&
      /refereed bound is changed/i.test(IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST.verdict),
  },
];

for (const a of IMP34885_KRAWCZYK_DIRECTED_ROUNDING_INSTANTIATION_CHECKLIST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34885-krawczyk-directed-rounding-instantiation-checklist assertion failed: ${a.id}`);
  }
}
