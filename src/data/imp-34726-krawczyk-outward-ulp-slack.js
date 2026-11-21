/**
 * @module imp-34726-krawczyk-outward-ulp-slack
 *
 * imp-34726 (numerical, frontier): the imp-34714 Krawczyk existence-uniqueness lemma is EXACT in the
 * real values f(m) and [f_prime], but its concrete N = 1e9 verification runs in double precision,
 * leaving NAMED SUB-GAP imp-34714a: turning (H1)-(H2) into a machine certificate needs the imp-34687a
 * directed-rounding layer (JS Math has no directed rounding). This module ASSESSES whether the
 * double-precision certificate has SLACK to absorb such directed-rounding widening, using an explicit
 * outward-ULP surrogate: widen each computed endpoint by k*eps*|value| and MEASURE the largest k for
 * which (H1) 0 not in [f_prime] and (H2) N([T]) subset int([T]) still hold on the a-priori bracket
 * [3.7180e8, 3.7195e8]. Measurement only; this does NOT close the machine certificate. NO QED.
 *
 * OUTWARD-ULP SURROGATE MODEL
 * ---------------------------
 * A true directed-rounding / error-bounded arithmetic layer replaces every computed real v by an
 * outward-rounded enclosure [v_lo, v_hi] with v_lo <= v <= v_hi and v_hi - v_lo a few ULP. JS Math
 * gives no directed rounding, so we MODEL that layer by a single relative-widening parameter k: every
 * computed endpoint v is inflated outward to [v - k*eps*|v|, v + k*eps*|v|], eps = 2^-52. Composing the
 * Krawczyk evaluation under this rule (each of f(m), the [f_prime] endpoints, the quotient f(m)/[f_prime],
 * the midpoint m, and the subtraction m - q widened outward by k*eps) yields a k-parameterized enclosure
 * of the interval-Newton image N([T]). The single k absorbs the (small, constant) per-endpoint operation
 * count of a real IEEE outward-rounded chain, so "largest surviving k" is the ULP budget the
 * double-precision certificate can spend before a hypothesis fails.
 *
 * WHAT IS MEASURED (a-priori bracket [T] = [3.7180e8, 3.7195e8], N = 1e9)
 * ----------------------------------------------------------------------
 *  (H1) NONVANISHING DERIVATIVE: the outward-widened f_prime lower endpoint FP_LO*(1 - k*eps) must stay
 *       > 0. Since FP_LO = 2.84823520 > 0, this survives until k*eps ~ 1, i.e. k ~ 1/eps ~ 4.5e15.
 *  (H2) STRICT SELF-MAP: the outward-widened image [N_lo(k), N_hi(k)] must stay strictly inside the
 *       open bracket (N_lo > T_lo and N_hi < T_hi). As k grows the upper quotient endpoint q_hi inflates,
 *       pushing N_lo = m - q_hi down toward T_lo; the LOWER inclusion is the binding constraint.
 *
 * RESULT (double-precision surrogate; see imp-34714a)
 * ---------------------------------------------------
 * Nominal (k = 0) inclusion margins on the a-priori bracket are ENORMOUS:
 *   N([T]) = [3.7187020448e8, 3.7187020459e8] (width 1.08e-1) sits inside [3.7180e8, 3.7195e8] with
 *   left margin  N_lo - T_lo = 7.0204e4  and  right margin  T_hi - N_hi = 7.9795e4.
 * The largest surviving outward-ULP budget is k* ~ 4.2512e11 (k*eps ~ 9.44e-5 relative widening), where
 * the LOWER inclusion N_lo(k) > T_lo fails first; (H1) and the upper inclusion survive far past it. A
 * few-ULP directed-rounding layer (k ~ a handful) perturbs the left margin by only ~1.7e-6 (from
 * 7.0204e4 to 7.0204e4), so the certificate carries ~11 orders of magnitude of slack (log10(k-star/4) ~ 11)
 * over the realistic directed-rounding widening.
 *
 * INTERPRETATION -- SLACK, NOT A CERTIFICATE
 * ------------------------------------------
 * YES: the double-precision (H1)-(H2) certificate has vast slack to absorb directed-rounding widening --
 * the a-priori bracket is ~1.4e6x wider than the one-step image, so the strict-inclusion margins dwarf
 * any few-ULP outward rounding. This is EVIDENCE that a real directed-rounding instantiation would
 * preserve (H1)-(H2), NOT a proof that it does: the k*eps model is a surrogate for the imp-34687a layer,
 * not that layer. The machine certificate (imp-34714a) remains OPEN -- it needs the actual outward-rounded
 * arithmetic to guarantee the computed f(m), [f_prime] endpoints ARE valid enclosures; this module only
 * shows the target hypotheses have room to spare once that guarantee exists.
 *
 * MEASUREMENT ONLY. This quantifies the roundoff slack of the interval-Newton solver for the inherited
 * imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-34687-crossover-interval-arithmetic-scope (scoped the IA upgrade; sub-gap imp-34687a directed rounding)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52

const N_TARGET = 1e9;
const T0 = effectiveHeightForN(N_TARGET); // 3.7187020453e8

// The same f, derivative, and a-priori bracket as imp-34714 (N = 1e9 crossover left endpoint).
const f = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1) - N_TARGET;
const fPrime = (T) => Math.log(T / TWO_PI) / TWO_PI; // increasing -> range on [T] is endpoint values

const T_LO = 3.718e8;
const T_HI = 3.7195e8;
const M = 0.5 * (T_LO + T_HI); // midpoint

const FP_LO = fPrime(T_LO);
const FP_HI = fPrime(T_HI);
const F_M = f(M); // F_M > 0 (M > T0, f increasing)

// Nominal (k = 0) interval-Newton image N([T]) = m - f(m)/[f_prime], f(m) > 0 and [f_prime] > 0.
const Q_LO_NOM = F_M / FP_HI;
const Q_HI_NOM = F_M / FP_LO;
const N_LO_NOM = M - Q_HI_NOM;
const N_HI_NOM = M - Q_LO_NOM;
const MARGIN_LO_NOM = N_LO_NOM - T_LO; // left strict-inclusion margin
const MARGIN_HI_NOM = T_HI - N_HI_NOM; // right strict-inclusion margin

// Outward-ULP surrogate: widen each computed endpoint by k*eps*|value|; check (H1) and (H2 strict).
function checkOutwardUlp(k) {
  const w = k * EPS;
  // f_prime enclosure widened outward (f_prime > 0).
  const fpLo = FP_LO - w * Math.abs(FP_LO); // outer-lower of [f_prime]
  const fpHi = FP_HI + w * Math.abs(FP_HI); // outer-upper of [f_prime]
  // f(m) enclosure widened outward (F_M > 0).
  const fmLo = F_M - w * Math.abs(F_M);
  const fmHi = F_M + w * Math.abs(F_M);
  // midpoint m enclosure widened outward.
  const mLo = M - w * Math.abs(M);
  const mHi = M + w * Math.abs(M);
  // quotient q = f(m)/[f_prime] (both positive), then widen the division result outward.
  const qLo = (fmLo / fpHi) * (1 - w);
  const qHi = (fmHi / fpLo) * (1 + w);
  // Newton image N = m - q; widen the subtraction result outward.
  let nLo = mLo - qHi;
  nLo = nLo - w * Math.abs(nLo);
  let nHi = mHi - qLo;
  nHi = nHi + w * Math.abs(nHi);
  const H1 = fpLo > 0; // 0 not in [f_prime]
  const H2 = nLo > T_LO && nHi < T_HI; // N([T]) subset int([T]) (strict)
  return { H1, H2, nLo, nHi, marginLo: nLo - T_LO, marginHi: T_HI - nHi };
}

// Largest surviving outward-ULP budget k*: double then bisect between good and bad.
function largestSurvivingK() {
  let good = 1;
  let bad = 1;
  while (bad < 1e18) {
    const c = checkOutwardUlp(bad);
    if (c.H1 && c.H2) {
      good = bad;
      bad *= 2;
    } else {
      break;
    }
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (good + bad);
    const c = checkOutwardUlp(mid);
    if (c.H1 && c.H2) good = mid;
    else bad = mid;
  }
  return good;
}

const K_STAR = largestSurvivingK(); // ~4.2512e11
const K_STAR_REL = K_STAR * EPS; // ~9.44e-5 relative widening at break
const AT_BREAK = checkOutwardUlp(K_STAR); // lower inclusion is the binding constraint
const FEW_ULP = checkOutwardUlp(10); // a generous "few-ULP" directed-rounding widening
const MARGIN_LO_DELTA_FEW_ULP = MARGIN_LO_NOM - FEW_ULP.marginLo; // left-margin loss at k = 10
const SLACK_ORDERS = Math.log10(K_STAR / 4); // ULP-budget slack over a real few-ULP layer (~11)

export const IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK = {
  id: 'imp-34726',
  proofSection: 'S-frontier',
  question:
    'imp-34714 proved the Krawczyk existence-uniqueness lemma EXACTLY in f(m) and [f_prime] but its ' +
    'N = 1e9 verification runs in double precision (sub-gap imp-34714a). Using an explicit outward-ULP ' +
    'model -- widen each computed endpoint by k*eps*|value| -- measure the largest k for which (H1) ' +
    '0 not in [f_prime] and (H2) N([T]) subset int([T]) still hold on the a-priori bracket ' +
    '[3.7180e8, 3.7195e8], and report the surviving margin. Assess only whether the double-precision ' +
    'certificate has slack to absorb directed-rounding widening; do NOT claim the machine certificate ' +
    'is closed. NO QED.',
  model: {
    surrogate:
      'Every computed real v -> outward enclosure [v - k*eps*|v|, v + k*eps*|v|], eps = 2^-52; the ' +
      'Krawczyk evaluation (f(m), [f_prime] endpoints, quotient, midpoint, subtraction) composed under ' +
      'this rule gives a k-parameterized enclosure of N([T]). The single k absorbs the small constant ' +
      'per-endpoint operation count of a real IEEE outward-rounded chain.',
    binding_constraint:
      'As k grows the upper quotient endpoint inflates, pushing N_lo = m - q_hi down toward T_lo; the ' +
      'LOWER strict inclusion N_lo(k) > T_lo fails first. (H1) and the upper inclusion survive far past it.',
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    N_target: +N_TARGET.toExponential(0),
    bracket: [+T_LO.toExponential(6), +T_HI.toExponential(6)],
    T0: +T0.toExponential(9),
    f_m: +F_M.toExponential(4), // 1.3659e4 (> 0)
    fprime_range: [+FP_LO.toExponential(8), +FP_HI.toExponential(8)], // excludes 0 -> (H1)
    newton_image_nominal: [+N_LO_NOM.toExponential(10), +N_HI_NOM.toExponential(10)],
    margin_lo_nominal: +MARGIN_LO_NOM.toExponential(6), // 7.0204e4 left strict-inclusion margin
    margin_hi_nominal: +MARGIN_HI_NOM.toExponential(6), // 7.9795e4 right strict-inclusion margin
    largest_surviving_k: +K_STAR.toExponential(4), // ~4.2512e11 ULP
    largest_surviving_k_relative: +K_STAR_REL.toExponential(4), // ~9.4396e-5 relative widening at break
    binding_hypothesis: 'H2-lower', // N_lo(k) > T_lo is what fails at k*
    H1_survives_at_break: AT_BREAK.H1,
    margin_hi_at_break: +AT_BREAK.marginHi.toExponential(4), // upper inclusion still comfortably inside
    margin_lo_loss_few_ulp: +MARGIN_LO_DELTA_FEW_ULP.toExponential(4), // ~1.7e-6 at k = 10
    slack_orders_over_few_ulp: +SLACK_ORDERS.toFixed(2), // ~11.03 (log10 of k-star over 4)
  },
  finding:
    'On the a-priori bracket [3.7180e8, 3.7195e8] the nominal one-step image N([T]) = ' +
    '[3.7187020448e8, 3.7187020459e8] (width 1.08e-1) sits inside with left margin N_lo - T_lo = ' +
    '7.0204e4 and right margin T_hi - N_hi = 7.9795e4. Under the outward-ULP surrogate (each computed ' +
    'endpoint widened by k*eps*|value|), (H1) 0 not in [f_prime] and (H2) N([T]) subset int([T]) survive ' +
    'up to k* ~ 4.2512e11 ULP (relative widening ~9.44e-5), where the LOWER inclusion N_lo(k) > T_lo ' +
    'fails first while (H1) and the upper inclusion remain comfortably inside. A realistic few-ULP ' +
    'directed-rounding layer (k ~ a handful) erodes the left margin by only ~1.7e-6, so the ' +
    'double-precision certificate carries ~11 orders of magnitude of slack over the widening a real ' +
    'imp-34687a directed-rounding layer would introduce. The a-priori bracket being ~1.4e6x wider than ' +
    'the one-step image is exactly why the strict-inclusion margins dwarf any few-ULP outward rounding.',
  subGap:
    'imp-34714a REMAINS OPEN. This module ASSESSES slack with a k*eps surrogate for the directed-rounding ' +
    'layer; it does NOT instantiate that layer. The measured ~4.2512e11-ULP budget is EVIDENCE that a real ' +
    'outward-rounded arithmetic would preserve (H1)-(H2), not a proof: the machine certificate still needs ' +
    'the imp-34687a error-bounded arithmetic to guarantee the computed f(m) and [f_prime] endpoints ARE ' +
    'valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'SLACK ASSESSMENT (frontier, NOT an RH bound). The imp-34714 double-precision Krawczyk certificate ' +
    'has VAST slack to absorb directed-rounding widening. Under an explicit outward-ULP surrogate -- ' +
    'widen each computed endpoint by k*eps*|value|, eps = 2^-52 -- hypotheses (H1) 0 not in [f_prime] and ' +
    '(H2) N([T]) subset int([T]) survive on the a-priori bracket [3.7180e8, 3.7195e8] up to k* ~ 4.2512e11 ' +
    'ULP (relative widening ~9.44e-5). The BINDING constraint is the lower strict inclusion N_lo(k) > T_lo ' +
    '(margin 7.0204e4 at k = 0); (H1) and the upper inclusion (margin 7.9795e4) survive far past k*. A ' +
    'realistic few-ULP layer (k ~ a handful) erodes the left margin by only ~1.7e-6, giving ~11 orders of ' +
    'magnitude of slack. INTERPRETATION: YES the double-precision certificate has room to spare, because ' +
    'the a-priori bracket is ~1.4e6x wider than the one-step image; this is EVIDENCE a real directed-rounding ' +
    'instantiation would preserve (H1)-(H2), NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: ' +
    'the k*eps model is a surrogate for the imp-34687a directed-rounding layer, not that layer. Measurement ' +
    'only for the inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a double-precision surrogate); ' +
    'imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer); ' +
    'imp-34650 (Banach contraction certificate on I = [1e9, 1e10]); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton inverse of the Riemann-von Mangoldt count). ' +
    'Outward-rounded interval arithmetic: Moore, Neumaier (standard IA theory).',
};

export const IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK_ASSERTIONS = [
  {
    // Nominal (k = 0) certificate holds: (H1) and strict (H2) with large positive margins.
    id: 'imp34726-nominal-certificate-holds',
    description: 'k = 0: 0 not in [f_prime], N([T]) subset int([T]), both inclusion margins > 0',
    holds: () => {
      const c = checkOutwardUlp(0);
      return c.H1 && c.H2 && MARGIN_LO_NOM > 0 && MARGIN_HI_NOM > 0;
    },
  },
  {
    // A generous few-ULP outward widening (k = 10) still satisfies (H1)-(H2) comfortably.
    id: 'imp34726-few-ulp-survives',
    description: 'k = 10 (few-ULP directed rounding): (H1)-(H2) hold; left margin loss ~1.7e-6 negligible',
    holds: () => {
      const c = checkOutwardUlp(10);
      return c.H1 && c.H2 && MARGIN_LO_DELTA_FEW_ULP > 0 && MARGIN_LO_DELTA_FEW_ULP < 1e-3;
    },
  },
  {
    // The measured surviving budget is large (>= 1e10 ULP) and the lower inclusion is what breaks.
    id: 'imp34726-large-surviving-budget',
    description: 'largest surviving k* >= 1e10 ULP; at k* the H2-lower inclusion fails, H1 still holds',
    holds: () => {
      const past = checkOutwardUlp(K_STAR * 1.001);
      return (
        K_STAR > 1e10 &&
        AT_BREAK.H1 &&
        AT_BREAK.H2 &&
        past.H1 && // (H1) survives past the break
        !past.H2 && // (H2) is what fails
        past.marginLo <= 0 && // the lower inclusion is the binding constraint
        past.marginHi > 0 // the upper inclusion is still satisfied
      );
    },
  },
  {
    // Slack is many orders of magnitude over a realistic few-ULP directed-rounding layer.
    id: 'imp34726-slack-orders-of-magnitude',
    description: 'log10(k*/4) >= 8: >= 8 orders of ULP-budget slack over a real few-ULP layer',
    holds: () => SLACK_ORDERS >= 8,
  },
  {
    // Honesty gate: slack assessment / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34726-honesty-gate-no-qed',
    description: 'Surrogate assessment: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK.isRigorous === false &&
      /imp-34714a/.test(IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK.subGap) &&
      /REMAINS OPEN/.test(IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK.subGap) &&
      /NO QED/.test(IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK.verdict) &&
      /refereed bound is changed/i.test(IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK.verdict),
  },
];

for (const a of IMP34726_KRAWCZYK_OUTWARD_ULP_SLACK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34726-krawczyk-outward-ulp-slack assertion failed: ${a.id}`);
  }
}
